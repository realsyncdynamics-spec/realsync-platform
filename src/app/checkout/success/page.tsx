'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const params = useSearchParams();
  const plan = params.get('plan') || params.get('plan_success') || '';
  const sessionId = params.get('session_id') || '';

  const planNames: Record<string, string> = {
    bronze: 'Bronze', silber: 'Silber', gold: 'Gold',
    platin: 'Platin', diamant: 'Diamant',
  };
  // Prices match the Stripe API route (PLANS object in api/stripe/checkout)
  const planPrices: Record<string, string> = {
    bronze: '19,00', silber: '49,00', gold: '99,00',
    platin: '199,00', diamant: '499,00',
  };

  const planName = planNames[plan] || plan;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div className="text-6xl mb-6">&#10003;</div>
        <h1 className="text-3xl font-bold mb-4">Zahlung eingegangen!</h1>
        <p className="text-gray-400 mb-8">
          Dein <span className="text-yellow-400 font-semibold">{planName || 'Plan'}</span> wird
          nach Stripe-Bestätigung aktiviert.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 text-left">
          <h3 className="font-semibold mb-3">Bestelluebersicht</h3>
          <div className="space-y-2 text-sm">
            {planName && (
              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span>{planName}</span>
              </div>
            )}
            {planPrices[plan] && (
              <div className="flex justify-between">
                <span className="text-gray-400">Preis</span>
                <span>{planPrices[plan]} EUR/Monat</span>
              </div>
            )}
            {sessionId && (
              <div className="flex justify-between">
                <span className="text-gray-400">Session</span>
                <span className="text-xs text-gray-500 font-mono">{sessionId.slice(0, 24)}…</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-yellow-400">Wird aktiviert…</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4 leading-relaxed">
            Dein Plan wird aktiviert, sobald die Zahlung von Stripe bestaetigt wurde — ueblicherweise
            innerhalb weniger Sekunden. Du erhaeltst eine Bestaetigungsemail.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-8 text-left">
          <h3 className="font-semibold mb-3 text-sm">Was dich erwartet</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>&#10003; Zugang zu allen freigeschalteten Apps deines Plans</p>
            <p>&#10003; CreatorSeal · ReviewRadar · ChurnRescue und mehr</p>
            <p>&#10003; Monatlich kuendbar — keine Bindung</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/hub" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400">
            Zum Hub
          </Link>
          <Link href="/login" className="border border-zinc-700 px-8 py-3 rounded-xl font-semibold hover:border-zinc-500">
            Einloggen
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Laden...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
