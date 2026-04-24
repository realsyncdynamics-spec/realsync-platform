import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  // Authenticate the user
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch stripe_customer_id from the user's profile
  const serviceRole = createServiceRoleClient();
  const { data: profile } = await serviceRole
    .schema("creatorseal")
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found" },
      { status: 404 }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

  const returnUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de") +
    "/dashboard";

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: returnUrl
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
