'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const params = useSearchParams();
  const plan = params.get('plan') || 'free';
  const sessionId = params.get('session_id') || '';

  const planNames: Record<string, string> = { bronze: 'Bronze', silber: 'Silber', gold: 'Gold', free: 'Free' };
  const planPrices: Record<string, string> = { bronze: '19,00', silber: '39,00', gold: '79,00', free: '0,00' };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div className="text-6xl mb-6">&#10003;</div>
        <h1 className="text-3xl font-bold mb-4">Zahlung erfolgreich!</h1>
        <p className="text-gray-400 mb-8">Dein <span className="text-yellow-400 font-semibold">{planNames[plan]}</span> Plan ist jetzt aktiv.</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold mb-3">Bestelluebersicht</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Plan</span><span>{planNames[plan]}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Preis</span><span>{planPrices[plan]} EUR/Monat</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Session</span><span className="text-xs text-gray-500 font-mono">{sessionId.slice(0, 20)}...</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400">Aktiv</span></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold mb-3">Freigeschaltete Features</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>&#10003; Alle 13 Apps mit {planNames[plan]}-Limits</p>
            <p>&#10003; C2PA, Wasserzeichen, Blockchain in allen Apps</p>
            <p>&#10003; {plan === 'gold' ? 'Unbegrenzte' : 'Erweiterte'} Workflows & Automatisierungen</p>
            <p>&#10003; Ecosystem-Datentransfer zwischen Apps</p>
            <p>&#10003; {plan === 'gold' ? '500 GB' : plan === 'silber' ? '50 GB' : '10 GB'} Cloud-Speicher</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard" className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400">Zum Dashboard</Link>
          <Link href="/automations" className="border border-zinc-700 px-8 py-3 rounded-xl font-semibold hover:border-zinc-500">Automatisierungen</Link>
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
