import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { getServerFirestore, getAdminInstance } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  if (!sig || !endpointSecret) {
    console.error("Webhook Error: Missing signature or endpoint secret");
    return NextResponse.json({ error: "Configuration error" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Metadata we set in app/api/checkout/route.ts
    const firebaseUserId = session.metadata?.firebaseUserId;
    const plan = session.metadata?.plan as "starter" | "pro" | "business";
    const credits = parseInt(session.metadata?.credits || "0", 10);

    if (!firebaseUserId) {
      console.error("Webhook Error: No firebaseUserId in session metadata", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const db = await getServerFirestore();
      if (!db) throw new Error("Firestore not initialized");

      const batch = db.batch();

      // 1. Update User Profile (Credits and Plan)
      const profileRef = db.collection("profiles").doc(firebaseUserId);
      batch.set(profileRef, {
        creditsRemaining: (await getAdminInstance()).firestore.FieldValue.increment(credits),
        plan: plan,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 2. Create Purchase History Record
      const purchaseRef = db.collection("users").doc(firebaseUserId).collection("purchases").doc();
      batch.set(purchaseRef, {
        id: purchaseRef.id,
        userId: firebaseUserId,
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent as string || null,
        plan: plan,
        creditsAdded: credits,
        amountCents: session.amount_total || 0,
        currency: session.currency || "usd",
        status: "completed",
        createdAt: new Date().toISOString(),
      });

      // 3. Handle Affiliate Commissions
      // We look for promotion codes applied to the session
      const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["total_details.breakdown.discounts"],
      });

      const promoCodeId = checkoutSession.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code;

      if (promoCodeId) {
        // Retrieve the promotion code object to get the actual "code" (e.g., VIVIENDODEAMAZON)
        const promoCode = await stripe.promotionCodes.retrieve(promoCodeId as string);
        const codeString = promoCode.code.toUpperCase(); // Ensure consistency

        console.log(`[Affiliate] Detected code: ${codeString}`);

        const affiliateRef = db.collection("affiliates").doc(codeString);
        const affiliateSnap = await affiliateRef.get();

        if (affiliateSnap.exists) {
          const affiliateData = affiliateSnap.data()!;
          const commissionPct = affiliateData.commissionPct || 20;
          const amountPaid = (session.amount_total || 0) / 100;
          const commissionAmount = parseFloat(((amountPaid * commissionPct) / 100).toFixed(2));

          const saleData = {
            userId: firebaseUserId,
            amount: amountPaid,
            commission: commissionAmount,
            date: new Date().toISOString(),
            stripeSessionId: session.id,
            plan: plan
          };

          const adminInst = await getAdminInstance();
          batch.update(affiliateRef, {
            earningsTotal: adminInst.firestore.FieldValue.increment(commissionAmount),
            recentSales: adminInst.firestore.FieldValue.arrayUnion(saleData),
            updatedAt: adminInst.firestore.FieldValue.serverTimestamp()
          });
          
          console.log(`[Affiliate] Attributing ${commissionAmount} ${session.currency} to ${codeString}`);
        } else {
          console.warn(`[Affiliate] Code ${codeString} used but NO record found in Firestore. Check 'affiliates' collection.`);
          
          // Optionally auto-create the affiliate with default 20% if we want to be permissive
          // For now, we stick to manual influencer onboarding for safety.
        }
      }

      await batch.commit();
      console.log(`Successfully processed payment for user ${firebaseUserId}. Credits: +${credits}, Plan: ${plan}`);

    } catch (error) {
      console.error("Error processing successful payment:", error);
      return NextResponse.json({ error: "Firestore processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
