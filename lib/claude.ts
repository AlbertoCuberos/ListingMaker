import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import { getCurrencySymbol } from "./currency";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

Follow the methodology in your system instructions precisely. Use the provided images for deep product context and the competitor data to identify high-value keywords and gaps.

PRODUCT DATA:
- Product: ${input.productName}
- Brand: ${input.brand}
- Category: ${input.category}
- Marketplace: Amazon.${input.marketplace === "us" ? "com" : input.marketplace === "uk" ? "co.uk" : input.marketplace}
- Price: ${getCurrencySymbol(input.marketplace)}${input.price}
- Additional details: ${input.additionalInfo}

DATA HIERARCHY RULES:
1. USER FIELDS (Product Name, Brand) = IDENTITY TRUTH. Use these for the listing's identity.
2. PRODUCT LABEL (PDF/Images) = TECHNICAL REALITY. Use as the absolute source of truth for ingredients, weights, certifications, specs. If the user provided vague info, the label supersedes for technicalities.
3. If there is a CLASH (e.g., user says Brand 'X', label says Brand 'Y'), use Brand 'X' but maintain the quality standards and specs from 'Y'.

COMPETITOR LISTINGS (analyze deeply for keywords, positioning, and gaps):
${input.competitorListings}

Respond ONLY with valid JSON in this EXACT format:
{
  "title": "Full 200-character optimized title",
  "titleCharCount": 200,
  "bullets": ["Bullet 1 (max 500 chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
  "bulletCharCounts": [450, 430, 460, 470, 440],
  "benefits": ["Benefit 1 (max 40 chars)", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"],
  "description": "2000-character description optimized for Rufus indexing",
  "descriptionCharCount": 1950,
  "backendKeywords": "500 bytes max, zero repetition with visible listing, space-separated, include secondary languages if space allows",
  "backendByteCount": 480,
  "keywordsUsed": {
    "primary": "main keyword phrase",
    "secondary": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7"],
    "backend": ["bkw1", "bkw2", "bkw3", "bkw4", "bkw5"]
  },
  "aplusContent": {
    "modules": [
      {
        "moduleNumber": 1,
        "moduleType": "Hero Banner",
        "headline": "Main claim text for the hero",
        "bodyText": "Supporting text under the hero image",
        "imageDescription": "Detailed description of what the hero image should show: composition, elements, mood, colors",
        "strategicPurpose": "Why this module matters for conversion"
      },
      {
        "moduleNumber": 2,
        "moduleType": "4 Key Differentiators",
        "headline": "Section header",
        "bodyText": "Differentiator 1: [text] | Differentiator 2: [text] | Differentiator 3: [text] | Differentiator 4: [text]",
        "imageDescription": "4 icons or mini-images, describe each",
        "strategicPurpose": "Quick-scan value props for fast scrollers"
      },
      {
        "moduleNumber": 3,
        "moduleType": "Ingredients / Specifications",
        "headline": "Section header",
        "bodyText": "Full ingredient/spec breakdown with quantities and benefits of each",
        "imageDescription": "Infographic or table layout description",
        "strategicPurpose": "Radical transparency builds trust"
      },
      {
        "moduleNumber": 4,
        "moduleType": "How to Use",
        "headline": "Section header",
        "bodyText": "Step-by-step usage instructions with dosage/application details",
        "imageDescription": "Visual guide showing usage steps",
        "strategicPurpose": "Removes friction: buyer knows exactly what to do"
      },
      {
        "moduleNumber": 5,
        "moduleType": "Comparison Table",
        "headline": "Section header",
        "bodyText": "Product vs conventional alternatives on 5-6 criteria (never name competitor brands)",
        "imageDescription": "Clean comparison table layout",
        "strategicPurpose": "Positions product as the obvious better choice"
      },
      {
        "moduleNumber": 6,
        "moduleType": "Brand Story",
        "headline": "Brand name + tagline",
        "bodyText": "Origin story, values, manufacturing standards, certifications, why the brand exists",
        "imageDescription": "Lifestyle/brand imagery description",
        "strategicPurpose": "Emotional connection + trust"
      },
      {
        "moduleNumber": 7,
        "moduleType": "Visual FAQ",
        "headline": "Frequently Asked Questions",
        "bodyText": "Q1: [question from competitor reviews] A1: [answer] | Q2: ... | Q3: ... | Q4: ... | Q5: ...",
        "imageDescription": "FAQ layout with icons per question",
        "strategicPurpose": "Kills remaining doubts before purchase"
      }
    ]
  },
  "analysis": {
    "seoScore": 85,
    "rufusScore": 88,
    "titleAnalysis": {
      "charCount": 198,
      "primaryKeywordPosition": 2,
      "keywordDensity": "optimal",
      "verdict": "Strategic explanation of title construction"
    },
    "competitorKeywordMap": [
      { "keyword": "example keyword", "frequency": 7, "totalCompetitors": 10, "classification": "core", "placement": "Title position 2-3" }
    ],
    "keywordGaps": ["gap1 — opportunity keywords competitors miss"],
    "bulletAnalysis": [
      { "bulletIndex": 1, "question": "The buyer question this bullet answers", "keywordsInBullet": ["kw1", "kw2"], "justification": "Why this content was chosen" }
    ],
    "ppcRecommendations": [
      { "keyword": "high competition keyword", "reason": "Why PPC is needed", "estimatedCompetition": "high", "campaignPhase": "weeks 1-4 exact match" }
    ],
    "strategySummary": "3-4 sentence overview of the complete listing strategy, positioning, and competitive advantage"
  }
}`,
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 12000,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse listing from AI response");
  }

  return JSON.parse(jsonMatch[0]);
}
