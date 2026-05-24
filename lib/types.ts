// Firestore document types

export interface ListingMakerProfile {
  id: string;
  email: string;
  fullName: string | null;
  creditsRemaining: number;
  plan: "free" | "starter" | "pro" | "business";
  stripeCustomerId: string | null;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export interface Listing {
  id: string;
  userId: string;
  productName: string;
  brand: string;
  marketplace: string;
  category: string;
  price: string | null;
  title: string;
  titleCharCount?: number;
  bullets: string[];
  bulletCharCounts?: number[];
  benefits: string[];
  description: string;
  descriptionCharCount?: number;
  backendKeywords: string;
  backendByteCount?: number;
  keywordsUsed: KeywordStrategy;
  aplusContent?: APlusContent;
  competitorData: string | null;
  additionalInfo: string | null;
  createdAt: any; // Firestore Timestamp
}

export interface Purchase {
  id: string;
  userId: string;
  stripeSessionId: string;
  stripePaymentIntent: string | null;
  plan: "starter" | "pro" | "business";
  creditsAdded: number;
  amountCents: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  createdAt: any;
}

export interface Affiliate {
  id: string; // The coupon code
  name: string;
  email: string;
  commissionPct: number;
  earningsTotal: number;
  recentSales: AffiliateSale[];
  createdAt: any;
}

export interface AffiliateSale {
  userId: string;
  amount: number;
  commission: number;
  date: string;
}

export interface KeywordStrategy {
  primary: string;
  secondary: string[];
  backend: string[];
}

// A+ Premium Content Types
export interface APlusModule {
  moduleNumber: number;
  moduleType: string;
  headline: string;
  bodyText: string;
  imageDescription: string;
  strategicPurpose: string;
}

export interface APlusContent {
  modules: APlusModule[];
}

// Plan configuration
export const PLANS = {
  free: { name: "Gratis", credits: 1, price: 0 },
  starter: { name: "Starter", credits: 5, price: 2900 },   // $29.00
  business: { name: "Business", credits: 25, price: 7900 }, // $79.00
  agency: { name: "Pack 100", credits: 100, price: 19900 }, // $199.00
} as const;

export type PlanKey = keyof typeof PLANS;

export interface ListingResult {
  isDemo?: boolean;
  productName?: string;
  brand?: string;
  marketplace?: string;
  title: string;
  titleCharCount?: number;
  bullets: string[];
  bulletCharCounts?: number[];
  benefits: string[];
  description: string;
  descriptionCharCount?: number;
  backendKeywords: string;
  backendByteCount?: number;
  keywordsUsed: {
    primary: string;
    secondary: string[];
    backend: string[];
  };
  aplusContent?: APlusContent;
  analysis: SEOAnalysis;
}

export interface SEOAnalysis {
  seoScore: number; // 0-100
  rufusScore: number; // 0-100
  titleAnalysis: {
    charCount: number;
    primaryKeywordPosition: number; // word position of primary kw
    keywordDensity: string; // e.g. "optimal", "too high", "too low"
    verdict: string; // short explanation
  };
  competitorKeywordMap: {
    keyword: string;
    frequency: number; // how many competitors use it
    totalCompetitors: number;
    classification: "core" | "benefit" | "ingredient" | "problem" | "use_case" | "long_tail";
    placement: string; // where it was placed in our listing
  }[];
  keywordGaps: string[]; // keywords competitors miss that we exploit
  bulletAnalysis: {
    bulletIndex: number;
    question: string; // the buyer question this bullet answers
    keywordsInBullet: string[];
    justification: string; // why this content/order was chosen
  }[];
  ppcRecommendations: {
    keyword: string;
    reason: string; // why PPC is needed for this one
    estimatedCompetition: "low" | "medium" | "high";
    campaignPhase?: string; // e.g. "weeks 1-4 exact match"
  }[];
  strategySummary: string; // 3-4 sentence overview of the strategy
}
