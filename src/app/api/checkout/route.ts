import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: true, message: "Nicht eingeloggt", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { priceId, tenantId, appSlug } = await req.json();
    if (!priceId) {
      return NextResponse.json(
        { error: true, message: "priceId ist erforderlich", code: "MISSING_PRICE_ID" },
        { status: 400 }
      );
    }

    // If tenantId is provided, use it; otherwise derive from authenticated user's default tenant
    let tenant: any = null;
    if (tenantId) {
      const { data } = await supabase.from("tenants").select("*").eq("id", tenantId).single();
      tenant = data;
    } else {
      // Look up the user's default tenant via user_tenants join table
      const { data: userTenant } = await supabase
        .from("user_tenants")
        .select("*, tenant:tenant_id(*)")
        .eq("user_id", user.id)
        .limit(1)
        .single();
      tenant = userTenant?.tenant ?? null;
    }

    // If no tenant found, create a checkout directly with the user's profile (personal checkout)
    const stripe = getStripe();
    let customerId: string;

    if (tenant) {
      customerId = tenant.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: tenant.billing_email || user.email,
          metadata: { tenant_id: tenant.id, user_id: user.id },
        });
        customerId = customer.id;
        await supabase.from("tenants").update({ stripe_customer_id: customerId }).eq("id", tenant.id);
      }
    } else {
      // Fallback: use user's profile for personal checkout (no tenant required)
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id, full_name")
        .eq("id", user.id)
        .single();

      customerId = profile?.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: profile?.full_name || user.email?.split("@")[0],
          metadata: { user_id: user.id },
        });
        customerId = customer.id;
        await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.nextUrl.origin}/?success=true`,
      cancel_url: `${req.nextUrl.origin}/?canceled=true`,
      metadata: {
        user_id: user.id,
        ...(tenant && { tenant_id: tenant.id }),
        ...(appSlug && { app_slug: appSlug }),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[Checkout]", err);
    return NextResponse.json(
      { error: true, message: err.message || "Checkout fehlgeschlagen", code: "CHECKOUT_FAILED" },
      { status: 500 }
    );
  }
}
