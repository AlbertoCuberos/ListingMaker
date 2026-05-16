import { NextRequest, NextResponse } from "next/server";
import { getServerFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const db = await getServerFirestore();
    if (!db) throw new Error("Firestore not initialized");

    // Find affiliate record by userId
    const snap = await db.collection("affiliates").where("userId", "==", userId).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({ isAffiliate: false });
    }

    const data = snap.docs[0].data();
    return NextResponse.json({
      isAffiliate: true,
      code: data.code,
      referralLink: `https://listingmaker.app?ref=${data.code}`,
      clicks: data.clicks || 0,
      sales: (data.recentSales || []).length,
      earningsTotal: data.earningsTotal || 0,
      earningsPaid: data.earningsPaid || 0,
      recentSales: (data.recentSales || []).slice(-20).reverse(),
    });
  } catch (err) {
    console.error("Affiliate stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
