// Amazon scraper using Playwright (real browser) for reliable extraction
// Handles ASIN-direct and keyword-search modes
// Uses @sparticuz/chromium-min for Vercel-compatible headless Chrome

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
  // Pure ASIN (10 uppercase alphanumeric chars)
  if (/^[A-Z0-9]{10}$/.test(trimmed)) return trimmed;
  // URL with /dp/ASIN or /gp/product/ASIN
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

// Launch a browser appropriate for the current environment
async function launchBrowser() {
  const { chromium } = await import("playwright-core");

  // In production (Vercel/Lambda), use the minimal Chromium build
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    const chromiumMin = (await import("@sparticuz/chromium-min")).default;
    const executablePath = await chromiumMin.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar"
    );
    return chromium.launch({
      args: chromiumMin.args,
      executablePath,
      headless: true,
    });
  }

  // In development, use the locally-installed browser
  return chromium.launch({ headless: true });
}

// Extract competitor data from a rendered product page
async function extractFromPage(
  page: import("playwright-core").Page,
  asin: string
): Promise<CompetitorProduct | null> {
  try {
    // Title
    const title = await page
      .$eval("#productTitle", (el) => el.textContent?.trim() ?? "")
      .catch(() => "");
    if (!title) return null;

    // Bullets
    const bullets = await page
      .$$eval(
        "#feature-bullets .a-list-item",
        (els) =>
          els
            .map((el) => el.textContent?.trim() ?? "")
            .filter((t) => t.length > 10 && !t.includes("Make sure") && !t.includes("Click here"))
      )
      .catch(() => [] as string[]);

    // Price
    const price = await page
      .$eval(".a-price .a-offscreen", (el) => el.textContent?.trim() ?? "")
      .catch(() => "");

    // Rating
    const rating = await page
      .$eval("[data-hook='average-star-rating'] .a-icon-alt", (el) =>
        el.textContent?.split(" ")[0] ?? ""
      )
      .catch(() => "");

    // Review count
    const reviewCount = await page
      .$eval("[data-hook='total-review-count']", (el) => el.textContent?.trim() ?? "")
      .catch(() => "");

    return { title, asin, bullets, price, rating, reviewCount };
  } catch (e) {
    console.error(`[SCRAPER] Parse error for ${asin}:`, e);
    return null;
  }
}

// Scrape a single ASIN, returns null on failure
async function scrapeAsin(
  domain: string,
  asin: string,
  browser: import("playwright-core").Browser
): Promise<CompetitorProduct | null> {
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  const page = await context.newPage();
  try {
    const url = `https://${domain}/dp/${asin}`;
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    if (!response?.ok()) {
      await context.close();
      return null;
    }
    // Dismiss cookie banner if present (EU markets)
    await page
      .click('[id*="accept"], [data-action*="accept-cookies"], #sp-cc-accept', { timeout: 2000 })
      .catch(() => {});
    const product = await extractFromPage(page, asin);
    await context.close();
    return product;
  } catch {
    await context.close();
    return null;
  }
}

// Auto-search: find top ASINs for a keyword on Amazon
async function searchAsins(
  domain: string,
  keyword: string,
  browser: import("playwright-core").Browser
): Promise<string[]> {
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  try {
    await page.goto(
      `https://${domain}/s?k=${encodeURIComponent(keyword)}`,
      { waitUntil: "domcontentloaded", timeout: 15000 }
    );
    await page
      .click('[id*="accept"], #sp-cc-accept', { timeout: 2000 })
      .catch(() => {});

    const asins = await page
      .$$eval("[data-asin]", (els) =>
        els
          .map((el) => el.getAttribute("data-asin") ?? "")
          .filter((a) => /^[A-Z0-9]{10}$/.test(a))
      )
      .catch(() => [] as string[]);

    await context.close();
    return [...new Set(asins)].slice(0, 10);
  } catch {
    await context.close();
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
  return `[NOTE: Live Amazon scraping did not return results for "${searchTerm}" on Amazon.${marketplace}. This may be due to Amazon rate-limiting or CAPTCHA. Generate the listing based on the product information provided, general category knowledge, and best practices. DO NOT invent competitor data or fake search volumes.]`;
}

// Main entry point — called from /api/generate
export async function fetchCompetitors(
  searchTerm: string,
  marketplace: string,
  userAsins?: string[] // provided by the seller via the form
): Promise<string> {
  const domain = domainMap[marketplace] ?? domainMap.us;
  let browser: import("playwright-core").Browser | null = null;

  try {
    browser = await launchBrowser();

    let asins: string[] = userAsins?.length ? userAsins : [];

    // If no ASINs provided, search Amazon for the top ones
    if (asins.length === 0) {
      console.log(`[SCRAPER] No ASINs provided. Searching ${domain} for: "${searchTerm}"`);
      asins = await searchAsins(domain, searchTerm, browser);
      if (asins.length === 0) {
        return buildFallbackMessage(searchTerm, marketplace);
      }
      console.log(`[SCRAPER] Found ${asins.length} ASINs from search.`);
    } else {
      console.log(`[SCRAPER] Using ${asins.length} user-provided ASINs on ${domain}`);
    }

    // Scrape up to 5 ASINs in parallel
    const toFetch = asins.slice(0, 5);
    const results = await Promise.allSettled(
      toFetch.map((asin) => scrapeAsin(domain, asin, browser!))
    );

    const products: CompetitorProduct[] = results
      .filter(
        (r): r is PromiseFulfilledResult<CompetitorProduct> =>
          r.status === "fulfilled" && r.value !== null && !!r.value?.title
      )
      .map((r) => r.value);

    console.log(
      `[SCRAPER] ✓ Scraped ${products.length}/${toFetch.length} competitor listings`
    );

    return products.length > 0
      ? formatCompetitorData(products)
      : buildFallbackMessage(searchTerm, marketplace);
  } catch (err) {
    console.error("[SCRAPER] Critical error:", err);
    return buildFallbackMessage(searchTerm, marketplace);
  } finally {
    await browser?.close().catch(() => {});
  }
}
