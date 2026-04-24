import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  STARTER_DURATION_DAYS,
  REFERRAL_BONUS_DAYS,
  REFERRALS_PER_BONUS
} from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAN_BY_LEVEL: Record<string, string> = {
  "0": "gratis",
  "1": "bronze",
  "2": "silber",
  "3": "gold",
  "4": "platin",
  "5": "diamant"
};

// Starter: €9,90 one-off → 90 days access; grant referrer bonus after every
// REFERRALS_PER_BONUS paid invites. All writes go through the service-role
// client (RLS does not gate writes here).
async function handleStarterCheckout(
  db: ReturnType<typeof createServiceRoleClient>,
  args: {
    userId: string;
    email: string | null;
    customerId: string;
    referredByCode?: string | null;
  }
): Promise<void> {
  const { userId, email, customerId, referredByCode } = args;

  // Load current starter_access_until + referral_bonus_days to extend, not reset.
  const { data: existing } = await db
    .schema("creatorseal")
    .from("profiles")
    .select("starter_access_until, referral_bonus_days")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();
  const base =
    existing?.starter_access_until && new Date(existing.starter_access_until) > now
      ? new Date(existing.starter_access_until)
      : now;
  const bonusDays = existing?.referral_bonus_days ?? 0;
  const newUntil = new Date(
    base.getTime() + (STARTER_DURATION_DAYS + bonusDays) * 86_400_000
  );

  await db
    .schema("creatorseal")
    .from("profiles")
    .upsert(
      {
        user_id: userId,
        email: email ?? "",
        plan_code: "starter",
        stripe_customer_id: customerId,
        starter_access_until: newUntil.toISOString()
      },
      { onConflict: "user_id" }
    );

  if (!referredByCode) return;

  // Look up referrer by their referral_code and record the paid referral.
  const { data: referrer } = await db
    .schema("creatorseal")
    .from("profiles")
    .select("user_id, starter_access_until, referral_bonus_days")
    .eq("referral_code", referredByCode)
    .maybeSingle();

  if (!referrer || referrer.user_id === userId) return;

  await db
    .schema("creatorseal")
    .from("referrals")
    .upsert(
      {
        referrer_id: referrer.user_id,
        referred_id: userId,
        paid_at: now.toISOString()
      },
      { onConflict: "referred_id" }
    );

  // Count paid-but-not-yet-rewarded referrals; grant bonus per full batch of 3.
  const { data: pending } = await db
    .schema("creatorseal")
    .from("referrals")
    .select("id")
    .eq("referrer_id", referrer.user_id)
    .is("rewarded_at", null)
    .not("paid_at", "is", null)
    .order("paid_at", { ascending: true });

  if (!pending || pending.length < REFERRALS_PER_BONUS) return;

  const batches = Math.floor(pending.length / REFERRALS_PER_BONUS);
  const toReward = pending.slice(0, batches * REFERRALS_PER_BONUS).map((r) => r.id);
  const newBonusDays = (referrer.referral_bonus_days ?? 0) + batches * REFERRAL_BONUS_DAYS;

  const referrerBase =
    referrer.starter_access_until && new Date(referrer.starter_access_until) > now
      ? new Date(referrer.starter_access_until)
      : now;
  const newReferrerUntil = new Date(
    referrerBase.getTime() + batches * REFERRAL_BONUS_DAYS * 86_400_000
  );

  await db
    .schema("creatorseal")
    .from("profiles")
    .update({
      referral_bonus_days: newBonusDays,
      starter_access_until: newReferrerUntil.toISOString()
    })
    .eq("user_id", referrer.user_id);

  await db
    .schema("creatorseal")
    .from("referrals")
    .update({ rewarded_at: now.toISOString() })
    .in("id", toReward);
}

// Resolve plan_code from either price_id (lookup_key) or metadata.plan_level
async function resolvePlanCode(
  db: ReturnType<typeof createServiceRoleClient>,
  priceId?: string | null,
  planLevel?: string | null
): Promise<string> {
  // 1. Try price_id via stripe_lookup_key
  if (priceId) {
    const { data } = await db
      .schema("creatorseal")
      .from("plans")
      .select("code")
      .eq("stripe_lookup_key", priceId)
      .maybeSingle();
    if (data?.code) return data.code;
  }
  // 2. Fallback: metadata.plan_level
  if (planLevel && PLAN_BY_LEVEL[planLevel]) {
    return PLAN_BY_LEVEL[planLevel];
  }
  // 3. Default
  return "gratis";
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!secret || !stripeKey) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${msg}` },
      { status: 400 }
    );
  }

  const db = createServiceRoleClient();

  // Idempotency
  try {
    const { data: existing } = await db
      .schema("creatorseal")
      .from("webhook_events")
      .select("stripe_event_id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, already_processed: true });
    }

    await db.schema("creatorseal").from("webhook_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload_summary: {
        object_type: (event.data.object as { object?: string })?.object || null,
        livemode: event.livemode
      }
    });
  } catch (e) {
    console.error("[webhook] idempotency check failed:", e);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string | null;
        const subscriptionId = session.subscription as string | null;
        const customerEmail =
          session.customer_email || session.customer_details?.email || null;
        const metaUserId = session.metadata?.user_id;
        const metaPlanCode = session.metadata?.plan_code;
        const metaReferredByCode = session.metadata?.referred_by_code;

        if (!customerId) break;

        // Resolve user: prefer metadata.user_id (set by our checkout route),
        // fall back to email lookup for legacy subscription flows.
        let userId: string | null = metaUserId ?? null;
        let userEmail: string | null = customerEmail;

        if (!userId && customerEmail) {
          const { data: users } = await db.auth.admin.listUsers();
          const matched = users?.users.find(
            (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
          );
          userId = matched?.id ?? null;
          userEmail = matched?.email ?? userEmail;
        }

        if (!userId) {
          console.warn(
            `[webhook] checkout.session.completed: no user for email=${customerEmail} meta_user_id=${metaUserId}`
          );
          break;
        }

        // Starter: one-off payment → 90 days access, no subscription row.
        if (metaPlanCode === "starter") {
          await handleStarterCheckout(db, {
            userId,
            email: userEmail,
            customerId,
            referredByCode: metaReferredByCode
          });
          break;
        }

        // Subscription path (unchanged from pre-starter behavior).
        let planCode = "gratis";
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = sub.items.data[0]?.price.id;
          const planLevel =
            sub.metadata?.plan_level || session.metadata?.plan_level;
          planCode = await resolvePlanCode(db, priceId, planLevel);
        }

        await db.schema("creatorseal").from("profiles").upsert({
          user_id: userId,
          email: userEmail ?? "",
          plan_code: planCode,
          stripe_customer_id: customerId
        });

        if (subscriptionId) {
          await db
            .schema("creatorseal")
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                plan_code: planCode,
                status: "active"
              },
              { onConflict: "stripe_subscription_id" }
            );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id;
        const planCode = await resolvePlanCode(
          db,
          priceId,
          sub.metadata?.plan_level
        );

        const { data: profile } = await db
          .schema("creatorseal")
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", sub.customer as string)
          .maybeSingle();

        if (profile?.user_id) {
          await db
            .schema("creatorseal")
            .from("subscriptions")
            .upsert(
              {
                user_id: profile.user_id,
                stripe_subscription_id: sub.id,
                stripe_customer_id: sub.customer as string,
                plan_code: planCode,
                status: sub.status
              },
              { onConflict: "stripe_subscription_id" }
            );

          await db
            .schema("creatorseal")
            .from("profiles")
            .update({ plan_code: planCode })
            .eq("user_id", profile.user_id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db
          .schema("creatorseal")
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", sub.id);

        const { data: profile } = await db
          .schema("creatorseal")
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", sub.customer as string)
          .maybeSingle();

        if (profile?.user_id) {
          await db
            .schema("creatorseal")
            .from("profiles")
            .update({ plan_code: "gratis" })
            .eq("user_id", profile.user_id);
        }
        break;
      }
    }

    await db
      .schema("creatorseal")
      .from("webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("stripe_event_id", event.id);
  } catch (e) {
    console.error("[webhook] processing error:", e);
    const errMsg = e instanceof Error ? e.message : "processing failed";

    await db
      .schema("creatorseal")
      .from("webhook_events")
      .update({ processing_error: errMsg })
      .eq("stripe_event_id", event.id);

    return NextResponse.json({ ok: false, error: errMsg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
