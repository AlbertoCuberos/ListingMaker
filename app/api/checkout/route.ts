import { NextRequest, NextResponse } from "next/server";
import { stripe, getStripePriceId, getCreditsForPlan } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json({ error: "Missing plan or userId" }, { status: 400 });
    }

    const priceId = getStripePriceId(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const credits = getCreditsForPlan(plan);

    // Read affiliate ref from cookie (set by middleware when ?ref=CODE is in URL)
    const refCode = req.cookies.get("lm_ref")?.value || null;

    const customer = await stripe.customers.create({
      metadata: { firebaseUserId: userId },
    });

    // Create Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
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
