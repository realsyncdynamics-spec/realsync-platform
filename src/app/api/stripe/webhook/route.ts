import { NextRequest, NextResponse } from 'next/server';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Plan feature limits
const PLAN_FEATURES = {
  free: {
    scansPerMonth: 10,
    watermarksPerMonth: 5,
    certificatesPerMonth: 3,
    blockchainVerifications: 2,
    storageGB: 1,
    apps: ['creatorseal', 'certificategen', 'trendradar'],
  },
  bronze: {
    scansPerMonth: 100,
    watermarksPerMonth: 50,
    certificatesPerMonth: 25,
    blockchainVerifications: 20,
    storageGB: 10,
    apps: ['creatorseal', 'certificategen', 'trendradar', 'contentforge', 'brandkit', 'fanconnect', 'schedulemaster'],
  },
  silber: {
    scansPerMonth: 500,
    watermarksPerMonth: 250,
    certificatesPerMonth: 100,
    blockchainVerifications: 100,
    storageGB: 50,
    apps: ['creatorseal', 'certificategen', 'trendradar', 'contentforge', 'brandkit', 'fanconnect', 'schedulemaster', 'adengine', 'rightsguard', 'mediavault', 'analyticspro'],
  },
  gold: {
    scansPerMonth: -1, // unlimited
    watermarksPerMonth: -1,
    certificatesPerMonth: -1,
    blockchainVerifications: -1,
    storageGB: 500,
    apps: ['all'],
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    // In production, verify webhook signature
    // For now, parse the event directly
    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const plan = session.metadata?.plan || 'bronze';
        const email = session.customer_email;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log(`[Webhook] Checkout completed: ${email} -> ${plan}`);
        console.log(`[Webhook] Customer: ${customerId}, Subscription: ${subscriptionId}`);
        console.log(`[Webhook] Features:`, PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES]);

        // TODO: Update user record in database with plan, customerId, subscriptionId
        // TODO: Send welcome email with plan details
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status;
        console.log(`[Webhook] Subscription updated: ${subscription.id} -> ${status}`);
        // TODO: Update user subscription status
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);
        // TODO: Downgrade user to free plan
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`[Webhook] Payment succeeded: ${invoice.id}`);
        // TODO: Record payment, reset monthly limits
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log(`[Webhook] Payment failed: ${invoice.id}`);
        // TODO: Notify user, grace period
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// Export plan features for use in other routes
export { PLAN_FEATURES };
