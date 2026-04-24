import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  const { data: profile } = await admin
    .schema("creatorseal")
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Stripe customer on file — complete a checkout first." },
      { status: 404 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl}/dashboard`
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
