// Amazon Direct Scraper — Real competitor data extraction
// Scrapes Amazon search results and product pages directly as a client browser

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

// Rotate User-Agents to reduce blocking risk
const userAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

function getRandomUA(): string {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getHeaders(domain: string): Record<string, string> {
  return {
    "User-Agent": getRandomUA(),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,es;q=0.8,de;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
  };
}

// Extract text between two markers in raw HTML
function extractBetween(html: string, start: string, end: string): string {
  const startIdx = html.indexOf(start);
  if (startIdx === -1) return "";
  const afterStart = startIdx + start.length;
  const endIdx = html.indexOf(end, afterStart);
  if (endIdx === -1) return "";
  return html.substring(afterStart, endIdx);
}

// Clean HTML tags from a string
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract ASINs from Amazon search results page HTML
function extractAsinsFromSearch(html: string): string[] {
  const asins: string[] = [];
  const regex = /data-asin="([A-Z0-9]{10})"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const asin = match[1];
    if (asin && !asins.includes(asin) && asin !== "undefined") {
      asins.push(asin);
    }
  }
  return asins.slice(0, 10); // Top 10 organic results
}

// Extract product details from a single product page
function extractProductFromPage(html: string, asin: string): CompetitorProduct | null {
  try {
    // Extract title
    let title = "";
    const titleMatch = html.match(/id="productTitle"[^>]*>([^<]+)</);
    if (titleMatch) {
      title = stripHtml(titleMatch[1]).trim();
    }
    if (!title) return null;

    // Extract bullet points
    const bullets: string[] = [];
    const bulletSection = extractBetween(html, 'id="feature-bullets"', '</div>');
    if (bulletSection) {
      const bulletRegex = /<span class="a-list-item">\s*([\s\S]*?)\s*<\/span>/g;
      let bMatch;
      while ((bMatch = bulletRegex.exec(bulletSection)) !== null) {
        const bulletText = stripHtml(bMatch[1]).trim();
        if (bulletText && bulletText.length > 10 && !bulletText.includes("Make sure") && !bulletText.includes("Click here")) {
          bullets.push(bulletText);
        }
      }
    }

    // Also try alternate bullet format 
    if (bullets.length === 0) {
      const altBulletRegex = /<li[^>]*><span[^>]*class="a-list-item"[^>]*>([\s\S]*?)<\/span><\/li>/g;
      let aMatch;
      while ((aMatch = altBulletRegex.exec(html)) !== null) {
        const t = stripHtml(aMatch[1]).trim();
        if (t && t.length > 10) bullets.push(t);
      }
    }

    // Extract price
    let price = "";
    const priceMatch = html.match(/class="a-price-whole">([^<]+)/);
    if (priceMatch) {
      price = priceMatch[1].replace(",", "").trim();
      const decMatch = html.match(/class="a-price-fraction">([^<]+)/);
      if (decMatch) price += "." + decMatch[1].trim();
    }

    // Extract rating
    let rating = "";
    const ratingMatch = html.match(/(\d+[.,]\d+) (?:de|out of|von|su|sur) \d+/);
    if (ratingMatch) rating = ratingMatch[1];

    // Extract review count
    let reviewCount = "";
    const reviewMatch = html.match(/(\d[\d.,]+)\s*(?:valoraciones|ratings|Bewertungen|valutazioni|évaluations)/i);
    if (reviewMatch) reviewCount = reviewMatch[1];

    return { title, asin, bullets, price, rating, reviewCount };
  } catch (e) {
    console.error(`[SCRAPER] Error parsing product ${asin}:`, e);
    return null;
  }
}

// Fetch a single product page with a strict timeout
async function fetchProductWithTimeout(domain: string, asin: string, timeoutMs = 8000): Promise<CompetitorProduct | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const productUrl = `https://${domain}/dp/${asin}`;
    const productResponse = await fetch(productUrl, {
      headers: getHeaders(domain),
      redirect: "follow",
      signal: controller.signal,
    });
    if (!productResponse.ok) return null;
    const productHtml = await productResponse.text();
    return extractProductFromPage(productHtml, asin);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Main scraping function: search Amazon and extract top competitor listings IN PARALLEL
export async function fetchCompetitorsFromRainforest(searchTerm: string, marketplace: string): Promise<string> {
  const domain = domainMap[marketplace] || domainMap.us;
  console.log(`[SCRAPER] Searching ${domain} for: "${searchTerm}"`);

  try {
    // Step 1: Search Amazon (with 10s timeout)
    const searchController = new AbortController();
    const searchTimer = setTimeout(() => searchController.abort(), 10000);
    let searchHtml = "";
    try {
      const searchUrl = `https://${domain}/s?k=${encodeURIComponent(searchTerm)}`;
      const searchResponse = await fetch(searchUrl, {
        headers: getHeaders(domain),
        redirect: "follow",
        signal: searchController.signal,
      });
      if (!searchResponse.ok) {
        console.warn(`[SCRAPER] Search returned ${searchResponse.status}.`);
        return buildFallbackMessage(searchTerm, marketplace);
      }
      searchHtml = await searchResponse.text();
    } finally {
      clearTimeout(searchTimer);
    }

    const asins = extractAsinsFromSearch(searchHtml);
    console.log(`[SCRAPER] Found ${asins.length} ASINs. Fetching top 5 IN PARALLEL...`);

    if (asins.length === 0) {
      return buildFallbackMessage(searchTerm, marketplace);
    }

    // Step 2: Fetch ALL product pages IN PARALLEL (max 5, each with 8s timeout)
    const productsToFetch = asins.slice(0, 5);
    const results = await Promise.allSettled(
      productsToFetch.map(asin => fetchProductWithTimeout(domain, asin, 8000))
    );

    const products: CompetitorProduct[] = results
      .filter((r): r is PromiseFulfilledResult<CompetitorProduct> =>
        r.status === "fulfilled" && r.value !== null && !!r.value?.title
      )
      .map(r => r.value);

    console.log(`[SCRAPER] ✓ Successfully scraped ${products.length}/${productsToFetch.length} competitor listings`);

    if (products.length === 0) {
      return buildFallbackMessage(searchTerm, marketplace);
    }

    return formatCompetitorData(products);
  } catch (error) {
    console.error("[SCRAPER] Critical error in Amazon scraping:", error);
    return buildFallbackMessage(searchTerm, marketplace);
  }
}

function formatCompetitorData(products: CompetitorProduct[]): string {
  let output = "";
  products.forEach((p, i) => {
    output += `\n--- Competitor ${i + 1} (ASIN: ${p.asin}) ---\n`;
    output += `Title: ${p.title}\n`;
    if (p.price) output += `Price: ${p.price}\n`;
    if (p.rating) output += `Rating: ${p.rating}\n`;
    if (p.reviewCount) output += `Reviews: ${p.reviewCount}\n`;
    p.bullets.forEach((b, bi) => {
      output += `Bullet ${bi + 1}: ${b}\n`;
    });
  });
  return output;
}

function buildFallbackMessage(searchTerm: string, marketplace: string): string {
  return `[NOTE: Live Amazon scraping did not return results for "${searchTerm}" on Amazon.${marketplace}. This may be due to Amazon rate-limiting or CAPTCHA. The AI should generate the listing based on the product information provided, general category knowledge, and best practices. DO NOT invent competitor data or fake search volumes. Be transparent about what is estimated vs. factual.]`;
}
