import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Keep named export for backwards compat — resolved lazily
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
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
