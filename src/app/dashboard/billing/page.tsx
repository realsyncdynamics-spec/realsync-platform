'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PLANS, PLAN_ORDER, type PlanId } from '@/lib/plans';

// Paid plans derived from the central plan system
const BILLING_PLANS = PLAN_ORDER
  .filter((id): id is Exclude<PlanId, 'gratis'> => id !== 'gratis')
  .map(id => ({
    id,
    name: PLANS[id].name,
    emoji: PLANS[id].emoji,
    price: PLANS[id].price.monthly,
    features: (() => {
      switch (id) {
        case 'bronze': return ['50 KI-Antworten/Mo', '3 Plattformen', 'Wasserzeichen', 'E-Mail-Support'];
        case 'silber': return ['500 KI-Antworten/Mo', '5 Plattformen', 'Blockchain Zeitstempel', 'Bulk-Aktionen', 'Priority-Support'];
        case 'gold': return ['2.000 KI-Antworten/Mo', 'Alle Plattformen', 'C2PA 2.3', 'Automation', 'Creator-Website'];
        case 'platin': return ['10.000 KI-Antworten/Mo', 'White-Label', 'Custom Domain', 'Unbegrenzte API', 'Slack-Support'];
        case 'diamant': return ['Unbegrenzt KI', 'Alles aus Platin', 'Dedicated Manager', 'Custom Entwicklung', 'SLA 99.99%'];
        default: return [];
      }
    })(),
    popular: id === 'gold',
  }));

export default function BillingPage() {
  const supabase = createClient();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('subscriptions').select('*').eq('status', 'active').single().then(({ data }) => {
      if (data) setSubscription(data);
      setLoading(false);
    });
  }, []);

  const handleCheckout = async (planId: string) => {
    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billing: 'monthly' }),
      });
      const data = await res.json();
      if (data.error) {
        console.error('Checkout error:', data.message);
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-300 mb-2">Abonnement & Abrechnung</h1>
      {subscription && (
        <div className="mb-6 p-4 bg-green-950 border border-green-800 rounded-xl">
          <p className="text-green-400 font-semibold text-sm">
            ✓ Aktives Abonnement: <span className="capitalize">{subscription.plan_id}</span>
          </p>
          {subscription.current_period_end && (
            <p className="text-green-600 text-xs mt-1">
              Verlängert am: {new Date(subscription.current_period_end * 1000).toLocaleDateString('de-DE')}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {BILLING_PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative p-5 rounded-xl border transition-colors ${
              plan.popular
                ? 'border-yellow-500 bg-yellow-950/20'
                : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-400 text-zinc-950 text-xs font-bold rounded-full">
                Beliebt
              </span>
            )}
            <h2 className="text-lg font-bold text-yellow-300">{plan.emoji} {plan.name}</h2>
            <p className="text-3xl font-bold text-zinc-100 my-3">
              €{plan.price}<span className="text-sm font-normal text-zinc-500">/Monat</span>
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={!!checkoutLoading || subscription?.plan_id === plan.id}
              className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
                plan.popular
                  ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300'
                  : 'border border-yellow-700 text-yellow-300 hover:bg-yellow-950'
              }`}
            >
              {checkoutLoading === plan.id ? 'Weiterleitung...' :
               subscription?.plan_id === plan.id ? 'Aktueller Plan' : 'Jetzt abonnieren'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
