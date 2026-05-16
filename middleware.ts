import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ref = searchParams.get("ref");

  const response = NextResponse.next();

  if (ref) {
    response.cookies.set("lm_ref", ref.toUpperCase(), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
