import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  const clean = code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 16);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  const res = NextResponse.redirect(`${siteUrl}/starter?ref=${clean}`, { status: 302 });
  res.cookies.set("rs_ref", clean, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });
  return res;
}
