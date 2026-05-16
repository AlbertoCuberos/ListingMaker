import { NextRequest, NextResponse } from "next/server";
import { getServerFirestore } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, channel, audience, message } = body;

    if (!name || !email || !channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getServerFirestore();
    if (!db) throw new Error("Firestore not initialized");

    await db.collection("affiliate_applications").add({
      name,
      email: email.toLowerCase().trim(),
      channel,
      audience: audience || "",
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Affiliate apply error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
