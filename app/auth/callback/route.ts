import { NextRequest, NextResponse } from "next/server";

// Firebase handles auth client-side — this route is a no-op kept for URL compatibility
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get("next") || "/dashboard";
  return NextResponse.redirect(new URL(next, req.url));
}
