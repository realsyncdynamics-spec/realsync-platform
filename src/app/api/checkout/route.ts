import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { priceId, tenantId, appSlug } = await req.json();

  const { data: tenant } = await supabase.from("tenants").select("*").eq("id", tenantId).single();
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  let customerId = tenant.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: tenant.billing_email, metadata: { tenant_id: tenantId } });
    customerId = customer.id;
    await supabase.from("tenants").update({ stripe_customer_id: customerId }).eq("id", tenantId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${req.nextUrl.origin}/?success=true`,
    cancel_url: `${req.nextUrl.origin}/?canceled=true`,
    metadata: { tenant_id: tenantId, app_slug: appSlug },
  });

  return NextResponse.json({ url: session.url });
}
