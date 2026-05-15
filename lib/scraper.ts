// Amazon scraper using fetch + cheerio (no native binaries, Vercel-compatible)
// Amazon SSR-renders title, bullets, price, rating in the initial HTML

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

// Extract ASIN from a URL or return as-is if already an ASIN
export function parseAsin(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Z0-9]{10}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  if (match) return match[1].toUpperCase();
  return null;
}

// Parse a comma/space/newline-separated list of ASINs or URLs
export function parseAsinList(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[\s,\n]+/)
    .map(parseAsin)
    .filter((a): a is string => a !== null)
    .slice(0, 10);
}

const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": randomUA(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function scrapeAsin(domain: string, asin: string): Promise<CompetitorProduct | null> {
  const html = await fetchPage(`https://${domain}/dp/${asin}`);
  if (!html) return null;

  // If Amazon redirected to CAPTCHA/signin page, bail
  if (html.includes("robot check") || html.includes("Type the characters") || html.includes("ap/signin")) {
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

  const price = $(".a-price .a-offscreen").first().text().trim() || undefined;
  const rating = $("[data-hook='average-star-rating'] .a-icon-alt").first().text().split(" ")[0] || undefined;
  const reviewCount = $("[data-hook='total-review-count']").first().text().trim() || undefined;

  return { title, asin, bullets, price, rating, reviewCount };
}

async function searchAsins(domain: string, keyword: string): Promise<string[]> {
  const html = await fetchPage(`https://${domain}/s?k=${encodeURIComponent(keyword)}`);
  if (!html) return [];

  const $ = cheerio.load(html);
  const asins: string[] = [];
  $("[data-asin]").each((_, el) => {
    const asin = $(el).attr("data-asin") ?? "";
    if (/^[A-Z0-9]{10}$/.test(asin)) asins.push(asin);
  });

  return [...new Set(asins)].slice(0, 10);
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
  return `[NOTE: Live Amazon scraping did not return results for "${searchTerm}" on Amazon.${marketplace}. This may be due to Amazon rate-limiting or CAPTCHA. Generate the listing based on the product information provided, general category knowledge, and best practices. DO NOT invent competitor data or fake search volumes.]`;
}

// Main entry point — called from /api/generate
export async function fetchCompetitors(
  searchTerm: string,
  marketplace: string,
  userAsins?: string[]
): Promise<string> {
  const domain = domainMap[marketplace] ?? domainMap.us;

  try {
    let asins: string[] = userAsins?.length ? userAsins : [];

    if (asins.length === 0) {
      console.log(`[SCRAPER] No ASINs provided. Searching ${domain} for: "${searchTerm}"`);
      asins = await searchAsins(domain, searchTerm);
      if (asins.length === 0) return buildFallbackMessage(searchTerm, marketplace);
      console.log(`[SCRAPER] Found ${asins.length} ASINs from search.`);
    } else {
      console.log(`[SCRAPER] Using ${asins.length} user-provided ASINs on ${domain}`);
    }

    const toFetch = asins.slice(0, 5);
    const results = await Promise.allSettled(
      toFetch.map((asin) => scrapeAsin(domain, asin))
    );

    const products: CompetitorProduct[] = results
      .filter(
        (r): r is PromiseFulfilledResult<CompetitorProduct> =>
          r.status === "fulfilled" && r.value !== null && !!r.value?.title
      )
      .map((r) => r.value);

    console.log(`[SCRAPER] ✓ Scraped ${products.length}/${toFetch.length} competitor listings`);

    return products.length > 0
      ? formatCompetitorData(products)
      : buildFallbackMessage(searchTerm, marketplace);
  } catch (err) {
    console.error("[SCRAPER] Critical error:", err);
    return buildFallbackMessage(searchTerm, marketplace);
  }
}
