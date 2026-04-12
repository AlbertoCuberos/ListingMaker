import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// Map plan names to Stripe Price IDs (set in .env.local)
export function getStripePriceId(plan: string): string | null {
  switch (plan) {
    case "starter":
      return process.env.STRIPE_PRICE_STARTER || null;
    case "pro":
      return process.env.STRIPE_PRICE_PRO || null;
    case "business":
      return process.env.STRIPE_PRICE_BUSINESS || null;
    default:
      return null;
  }
}

// Credits per plan
export function getCreditsForPlan(plan: string): number {
  switch (plan) {
    case "starter":
      return 5;
    case "pro":
      return 10;
    case "business":
      return 25;
    default:
      return 0;
  }
}
