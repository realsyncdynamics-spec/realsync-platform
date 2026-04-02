'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: ['50 Posts/Monat', '2 Social-Konten', 'Basis-Analytics', 'E-Mail-Support'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    features: ['Unbegrenzte Posts', '10 Social-Konten', 'Erweiterte Analytics', 'Creator Verifizierung', 'Priority-Support'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 199,
    features: ['Alles aus Pro', 'Unbegrenzte Konten', 'Team-Zugang (5 User)', 'API-Zugang', 'Dedizierter Support'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || '',
  },
];

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- supabase client is stable

  const handleCheckout = async (priceId: string, planId: string) => {
    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
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
          <p className="text-green-400 font-semibold text-sm">✓ Aktives Abonnement: <span className="capitalize">{subscription.plan_id}</span></p>
          {subscription.current_period_end && (
            <p className="text-green-600 text-xs mt-1">Verlängert am: {new Date(subscription.current_period_end * 1000).toLocaleDateString('de-DE')}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`relative p-6 rounded-xl border transition-colors ${
              plan.popular
                ? 'border-yellow-500 bg-yellow-950/20'
                : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-400 text-zinc-950 text-xs font-bold rounded-full">Beliebt</span>
            )}
            <h2 className="text-lg font-bold text-yellow-300">{plan.name}</h2>
            <p className="text-3xl font-bold text-zinc-100 my-3">€{plan.price}<span className="text-sm font-normal text-zinc-500">/Monat</span></p>
            <ul className="space-y-2 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.priceId, plan.id)}
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
