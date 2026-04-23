import { NextResponse } from "next/server";

export async function POST() {
  const portalUrl = process.env.STRIPE_BILLING_PORTAL_URL;
  if (!portalUrl) {
    return NextResponse.json(
      { error: "Billing portal not configured" },
      { status: 503 }
    );
  }
  return NextResponse.redirect(portalUrl, { status: 303 });
}
