import { NextRequest, NextResponse } from "next/server";
import { stripe, getStripePriceId, getCreditsForPlan } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, userEmail } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json({ error: "Missing plan or userId" }, { status: 400 });
    }

    const priceId = getStripePriceId(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const credits = getCreditsForPlan(plan);
    const refCode = req.cookies.get("lm_ref")?.value || null;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://listingmaker.app";

    // Let Stripe create the customer during checkout so it can detect
    // the browser country and apply Adaptive Pricing (EUR → GBP/USD etc.)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      customer_creation: "always",
      ...(userEmail ? { customer_email: userEmail } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        firebaseUserId: userId,
        plan,
        credits: credits.toString(),
        ...(refCode ? { ref_code: refCode } : {}),
      },
      success_url: `${appUrl}/dashboard?payment=success`,
      cancel_url: `${appUrl}/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
