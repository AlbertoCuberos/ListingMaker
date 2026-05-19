import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import { getCurrencySymbol } from "./currency";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 120 * 1000, // 2 min cap — scraping takes ~45s, leaves 120s for Claude within Vercel's 300s limit
});

interface GenerateInput {
  productName: string;
  brand: string;
  marketplace: string;
  category: string;
  price: string;
  competitorListings: string;
  additionalInfo: string;
  images: { type: "image"; media_type: string; data: string }[];
}

export async function generateListing(input: GenerateInput) {
  const systemPrompt = getSystemPrompt(input.marketplace);

  const userContent: Anthropic.ContentBlockParam[] = [];

  // Add images if provided
  for (const img of input.images) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.media_type as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp",
        data: img.data,
      },
    });
  }

  // Add text prompt
  userContent.push({
    type: "text",
    text: `Generate a complete Amazon listing, A+ Premium content briefing, and SEO diagnostic report for this product.

PRODUCT DATA:
- Product: ${input.productName}
- Brand: ${input.brand}
- Category: ${input.category}
- Marketplace: Amazon.${input.marketplace === "us" ? "com" : input.marketplace === "uk" ? "co.uk" : input.marketplace}
- Price: ${getCurrencySymbol(input.marketplace)}${input.price}
- Additional details: ${input.additionalInfo}

COMPETITOR LISTINGS (Real data scraped from Amazon):
${input.competitorListings}`,
  });

  const modelName = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";
  let lastError: any = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log(`[AI] Generation attempt ${attempt + 1} using model: ${modelName}`);
      const t0 = Date.now();

      // Use STREAMING to keep connection alive (no timeout issues)
      let fullText = "";
      const stream = await anthropic.messages.stream({
        model: modelName,
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      });

      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          fullText += chunk.delta.text;
        }
      }

      console.log(`[AI] Streaming complete in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${fullText.length} chars`);

      // Extract JSON from streamed response
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("[AI] Raw response:", fullText.substring(0, 500));
        throw new Error("Failed to parse listing from AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // === POST-PROCESSING ===

      // Strip asterisks/markdown from bullets (Amazon doesn't render them)
      if (parsed.bullets && Array.isArray(parsed.bullets)) {
        parsed.bullets = parsed.bullets.map((b: string) =>
          b.replace(/\*\*/g, "").replace(/\*/g, "").trim()
        );
      }

      // Enforce exactly 5 benefits (Amazon's hard limit)
      if (parsed.benefits && Array.isArray(parsed.benefits)) {
        parsed.benefits = parsed.benefits.slice(0, 5).map((b: string) =>
          b.replace(/\*\*/g, "").replace(/\*/g, "").trim()
        );
      }

      // Recalculate actual character count (never trust AI's count)
      if (parsed.title) {
        if (!parsed.analysis) parsed.analysis = {};
        if (!parsed.analysis.titleAnalysis) parsed.analysis.titleAnalysis = {};
        parsed.analysis.titleAnalysis.charCount = parsed.title.length;
      }

      // Calculate actual backend keyword byte count
      if (parsed.backendKeywords) {
        parsed.backendByteCount = Buffer.byteLength(parsed.backendKeywords, "utf8");
      }

      return parsed;
    } catch (error: any) {
      console.error(`[AI] Error (Attempt ${attempt + 1}):`, error?.message || error);
      lastError = error;

      // Only retry on connection/network errors, not on bad responses
      const isRetryable =
        error.name === "APIConnectionTimeoutError" ||
        error.name === "APIConnectionError" ||
        (error.message && (
          error.message.includes("socket hang up") ||
          error.message.includes("ECONNRESET") ||
          error.message.includes("ETIMEDOUT")
        )) ||
        error.status >= 500;

      if (!isRetryable || attempt === 1) break;

      console.log(`[AI] Retrying in 3s...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Translate error to user-friendly message
  const msg = lastError?.message || "";
  if (msg.includes("Connection error") || lastError?.name === "APIConnectionError") {
    throw new Error("Error de conexión con la IA. Verifica tu conexión a internet e inténtalo de nuevo.");
  }
  if (lastError?.name === "APIConnectionTimeoutError" || msg.includes("timeout")) {
    throw new Error("La IA tardó demasiado en responder. Inténtalo de nuevo en unos segundos.");
  }
  if (lastError?.status === 401) {
    throw new Error("API Key inválida. Contacta con soporte.");
  }
  if (lastError?.status === 429) {
    throw new Error("Límite de velocidad alcanzado. Espera unos segundos e inténtalo de nuevo.");
  }
  throw new Error(msg || "Error inesperado en el motor de IA.");
}
