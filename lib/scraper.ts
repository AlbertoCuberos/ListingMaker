// Amazon scraper — fetch + cheerio, Vercel-compatible
// Improvements: cookie chaining, per-locale Accept-Language, sequential fetching, referer spoofing

import * as cheerio from "cheerio";

export interface CompetitorProduct {
  title: string;
  asin: string;
  bullets: string[];
  price?: string;
  rating?: string;
  reviewCount?: string;
}

const domainMap: Record<string, string> = {
  us: "www.amazon.com",
  uk: "www.amazon.co.uk",
  de: "www.amazon.de",
  fr: "www.amazon.fr",
  it: "www.amazon.it",
  es: "www.amazon.es",
};

const languageMap: Record<string, string> = {
  us: "en-US,en;q=0.9",
  uk: "en-GB,en;q=0.9,en-US;q=0.8",
  de: "de-DE,de;q=0.9,en;q=0.8",
  fr: "fr-FR,fr;q=0.9,en;q=0.8",
  it: "it-IT,it;q=0.9,en;q=0.8",
  es: "es-ES,es;q=0.9,en;q=0.8",
};

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildHeaders(locale: string, referer?: string, cookies?: string): Record<string, string> {
  const ua = randomUA();
  const isFirefox = ua.includes("Firefox");
  return {
    "User-Agent": ua,
    "Accept": isFirefox
      ? "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
      : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": languageMap[locale] ?? "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    ...(isFirefox ? {
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": referer ? "same-origin" : "none",
      "Sec-Fetch-User": "?1",
      "DNT": "1",
    } : {
      "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": referer ? "same-origin" : "none",
      "sec-fetch-user": "?1",
    }),
    ...(referer ? { Referer: referer } : {}),
    ...(cookies ? { Cookie: cookies } : {}),
  };
}

function extractSetCookies(res: Response): string {
  // Node fetch doesn't expose multiple Set-Cookie headers via .get()
  // We get what we can from the combined header
  const raw = res.headers.get("set-cookie") ?? "";
  if (!raw) return "";
  // Each directive is separated by comma, but cookie values may contain commas
  // Safe approach: split on ", " followed by known cookie names
  return raw
    .split(/,(?=[a-zA-Z0-9_-]+=)/)
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

// Export for ASIN parsing
export function parseAsin(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Z0-9]{10}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  if (match) return match[1].toUpperCase();
  return null;
}

export function parseAsinList(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[\s,\n]+/)
    .map(parseAsin)
    .filter((a): a is string => a !== null)
    .slice(0, 10);
}

// Two-step fetch: warm up cookies on search page, then fetch product page
async function fetchProductPage(domain: string, asin: string, locale: string): Promise<string | null> {
  const searchUrl = `https://${domain}/s?k=${encodeURIComponent(asin)}`;
  const productUrl = `https://${domain}/dp/${asin}?th=1&psc=1`;

  let cookies = "";

  // Step 1: hit search page to get cookies (like a real browser would)
  try {
    const warmRes = await fetch(searchUrl, {
      headers: buildHeaders(locale),
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    cookies = extractSetCookies(warmRes);
    // Small human-like delay between requests
    await sleep(600 + Math.random() * 900);
  } catch {
    // Continue without cookies — better than failing completely
  }

  // Step 2: fetch product page with cookies + referer
  try {
    const res = await fetch(productUrl, {
      headers: buildHeaders(locale, searchUrl, cookies || undefined),
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function scrapeAsin(domain: string, asin: string, locale: string): Promise<CompetitorProduct | null> {
  const html = await fetchProductPage(domain, asin, locale);
  if (!html) return null;

  if (
    html.includes("robot check") ||
    html.includes("Type the characters") ||
    html.includes("ap/signin") ||
    html.includes("api-services-support@amazon.com") ||
    html.length < 5000
  ) {
    console.warn(`[SCRAPER] Bot detection on ASIN ${asin}`);
    return null;
  }

  const $ = cheerio.load(html);

  const title = $("#productTitle").text().trim();
  if (!title) return null;

  const bullets: string[] = [];
  $("#feature-bullets .a-list-item").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 10 && !text.includes("Make sure") && !text.includes("Click here")) {
      bullets.push(text);
    }
  });

  const price =
    $(".a-price .a-offscreen").first().text().trim() ||
    $("#priceblock_ourprice").text().trim() ||
    undefined;
  const rating =
    $("[data-hook='average-star-rating'] .a-icon-alt").first().text().split(" ")[0] ||
    $(".a-icon-star .a-icon-alt").first().text().split(" ")[0] ||
    undefined;
  const reviewCount =
    $("[data-hook='total-review-count']").first().text().trim() || undefined;

  return { title, asin, bullets, price, rating, reviewCount };
}

async function searchAsins(domain: string, keyword: string, locale: string): Promise<string[]> {
  const url = `https://${domain}/s?k=${encodeURIComponent(keyword)}`;
  try {
    const res = await fetch(url, {
      headers: buildHeaders(locale),
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const asins: string[] = [];
    $("[data-asin]").each((_, el) => {
      const asin = $(el).attr("data-asin") ?? "";
      if (/^[A-Z0-9]{10}$/.test(asin)) asins.push(asin);
    });
    return [...new Set(asins)].slice(0, 8);
  } catch {
    return [];
  }
}

function formatCompetitorData(products: CompetitorProduct[]): string {
  return products
    .map((p, i) => {
      let out = `\n--- Competitor ${i + 1} (ASIN: ${p.asin}) ---\n`;
      out += `Title: ${p.title}\n`;
      if (p.price) out += `Price: ${p.price}\n`;
      if (p.rating) out += `Rating: ${p.rating}\n`;
      if (p.reviewCount) out += `Reviews: ${p.reviewCount}\n`;
      p.bullets.forEach((b, bi) => { out += `Bullet ${bi + 1}: ${b}\n`; });
      return out;
    })
    .join("");
}

function buildFallbackMessage(searchTerm: string, marketplace: string): string {
  return `[NOTE: Live Amazon scraping did not return results for "${searchTerm}" on Amazon.${marketplace}. Generate the listing based on the product information provided and category best practices. DO NOT invent competitor data.]`;
}

export async function fetchCompetitors(
  searchTerm: string,
  marketplace: string,
  userAsins?: string[]
): Promise<string> {
  const domain = domainMap[marketplace] ?? domainMap.us;
  const locale = marketplace;

  // Hard budget: max 45s total for scraping phase
  const deadline = Date.now() + 45_000;

  try {
    let asins: string[] = userAsins?.length ? userAsins : [];

    if (asins.length === 0) {
      console.log(`[SCRAPER] No ASINs — searching ${domain} for: "${searchTerm}"`);
      asins = await searchAsins(domain, searchTerm, locale);
      if (asins.length === 0) return buildFallbackMessage(searchTerm, marketplace);
    }

    // Fetch sequentially (not parallel) to look more human + avoid IP throttle
    const toFetch = asins.slice(0, 4);
    const products: CompetitorProduct[] = [];

    for (const asin of toFetch) {
      if (Date.now() > deadline) {
        console.warn(`[SCRAPER] Time budget exhausted — stopping at ${products.length} competitors`);
        break;
      }
      const product = await scrapeAsin(domain, asin, locale);
      if (product) products.push(product);
      // Random delay between product pages (500ms–1.5s)
      if (Date.now() < deadline) await sleep(500 + Math.random() * 1000);
    }

    console.log(`[SCRAPER] ✓ ${products.length}/${toFetch.length} competitors scraped`);

    return products.length > 0
      ? formatCompetitorData(products)
      : buildFallbackMessage(searchTerm, marketplace);

  } catch (err) {
    console.error("[SCRAPER] Critical error:", err);
    return buildFallbackMessage(searchTerm, marketplace);
  }
}
