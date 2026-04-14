'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PLANS, PLAN_ORDER, type PlanId } from '@/lib/plans';

// Only show paid plans on the billing page
const PAID_PLAN_IDS: PlanId[] = ['bronze', 'silber', 'gold', 'platin', 'diamant'];

// Key features to display per plan (derived from plans.ts)
const PLAN_HIGHLIGHTS: Record<PlanId, string[]> = {
  gratis:  [],
  bronze:  ['50 KI-Antworten/Monat', '3 Social-Plattformen', '3 Workflows', 'Wasserzeichen-Verifizierung', 'E-Mail-Support'],
  silber:  ['500 KI-Antworten/Monat', 'Blockchain-Timestamp', 'KI-Analytics', '5 Plattformen · 10 Workflows', 'Priority-Support'],
  gold:    ['2.000 KI-Antworten/Monat', 'C2PA 2.3 Zertifizierung', 'Automation & Webhooks', 'Alle 16 Apps freigeschaltet', 'Creator-Website'],
  platin:  ['10.000 KI-Antworten/Monat', 'White-Label & Custom Domain', 'Polygon NFT-Stamps', 'Unbegrenzte API-Aufrufe', 'Slack-Support · 25 Team-Mitglieder'],
  diamant: ['Unbegrenzte KI-Antworten', 'Dedicated Account Manager', 'SLA & Enterprise-Support', 'Unbegrenzte Team-Mitglieder', 'Alles aus Platin'],
};

export default function BillingPage() {
  const supabase = createClient();
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>('gratis');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('profiles')
        .select('plan_id')
        .eq('id', user.id)
        .single();
      if (data?.plan_id) setCurrentPlanId(data.plan_id as PlanId);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- supabase client is stable

  const handleCheckout = async (planId: PlanId) => {
    setCheckoutLoading(planId);
    setErrorMsg('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || 'Fehler beim Checkout');
      }
    } catch {
      setErrorMsg('Verbindungsfehler — bitte erneut versuchen');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const currentPlanIdx = PLAN_ORDER.indexOf(currentPlanId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-300 mb-1">Abonnement & Abrechnung</h1>
      <p className="text-sm text-zinc-500 mb-6">Alle Preise in EUR · inkl. MwSt. · jederzeit kündbar</p>

      {loading && (
        <div className="mb-6 text-sm text-zinc-500">Lädt…</div>
      )}

      {!loading && currentPlanId !== 'gratis' && (
        <div className="mb-6 p-4 bg-green-950 border border-green-800 rounded-xl">
          <p className="text-green-400 font-semibold text-sm">
            {PLANS[currentPlanId].emoji} Aktiver Plan: <span className="font-bold">{PLANS[currentPlanId].name}</span>
            {' '}· {PLANS[currentPlanId].tagline}
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">{errorMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {PAID_PLAN_IDS.map(planId => {
          const plan = PLANS[planId];
          const isCurrent = planId === currentPlanId;
          const isPopular = planId === 'gold';
          const isDowngrade = PLAN_ORDER.indexOf(planId) < currentPlanIdx;

          return (
            <div
              key={planId}
              className="relative flex flex-col rounded-xl border transition-colors"
              style={{
                borderColor: isCurrent ? plan.color : isPopular ? `${plan.color}60` : '#27272a',
                background: isCurrent ? `${plan.color}10` : isPopular ? `${plan.color}08` : '#18181b',
              }}
            >
              {isPopular && !isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold rounded-full"
                  style={{ background: plan.color, color: '#000' }}>
                  Beliebt
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold rounded-full"
                  style={{ background: plan.color, color: '#000' }}>
                  Aktuell
                </span>
              )}

              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{plan.emoji}</span>
                  <span className="font-bold text-base" style={{ color: plan.color }}>{plan.name}</span>
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-zinc-100">€{plan.price.monthly}</span>
                  <span className="text-sm text-zinc-500">/Monat</span>
                </div>
                <div className="text-xs text-zinc-600 mb-4">
                  oder €{plan.price.yearly}/Mo bei Jahresabo
                </div>
                <p className="text-xs text-zinc-400 mb-4">{plan.tagline}</p>

                <ul className="space-y-2 mb-4">
                  {PLAN_HIGHLIGHTS[planId].map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                      <span style={{ color: plan.color }} className="mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleCheckout(planId)}
                  disabled={!!checkoutLoading || isCurrent || isDowngrade}
                  className="w-full py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={
                    isCurrent
                      ? { background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}40` }
                      : isDowngrade
                      ? { background: 'transparent', color: '#52525b', border: '1px solid #3f3f46' }
                      : { background: plan.color, color: planId === 'silber' ? '#000' : '#000' }
                  }
                >
                  {checkoutLoading === planId ? 'Weiterleitung…' :
                   isCurrent ? 'Aktueller Plan' :
                   isDowngrade ? 'Downgrade' :
                   'Jetzt abonnieren'}
                </button>
                {isDowngrade && !isCurrent && (
                  <p className="text-xs text-zinc-600 text-center mt-2">
                    Downgrade via Support
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-zinc-600">
        Stripe-Checkout · Sicher · Kündigung jederzeit zum Monatsende möglich.
        {' '}Fragen? <a href="mailto:support@realsyncdynamics.de" className="text-yellow-600 hover:text-yellow-400">support@realsyncdynamics.de</a>
      </p>
    </div>
  );
}
