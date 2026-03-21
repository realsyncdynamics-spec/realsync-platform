'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const PLANS = [
  {
    id: 'gratis', name: 'Gratis', emoji: '🆓',
    price: { monthly: 0, yearly: 0 },
    badge: 'Für immer kostenlos',
    color: '#6B7280',
    gradient: 'from-gray-800 to-gray-900',
    border: 'border-gray-700',
    button: 'bg-gray-700 hover:bg-gray-600 text-white',
    buttonText: 'Kostenlos starten',
    limits: { ai: 10, storage: '500 MB', apps: 3 },
    features: [
      { text: '3 Apps freigeschaltet', ok: true },
      { text: '10 KI-Aktionen/Monat', ok: true },
      { text: '500 MB Speicher', ok: true },
      { text: 'Community Support', ok: true },
      { text: 'Basis-Analytics', ok: true },
      { text: 'Keine Kreditkarte nötig', ok: true },
      { text: 'Prioritäts-Support', ok: false },
      { text: 'API-Zugang', ok: false },
      { text: 'White-Label', ok: false },
    ],
  },
  {
    id: 'bronze', name: 'Bronze', emoji: '🥉',
    price: { monthly: 19, yearly: 15 },
    badge: 'Einsteiger',
    color: '#CD7F32',
    gradient: 'from-yellow-900 to-amber-950',
    border: 'border-yellow-700/50',
    button: 'bg-amber-700 hover:bg-amber-600 text-white',
    buttonText: 'Bronze wählen',
    limits: { ai: 100, storage: '10 GB', apps: 7 },
    features: [
      { text: '7 Apps freigeschaltet', ok: true },
      { text: '100 KI-Aktionen/Monat', ok: true },
      { text: '10 GB Speicher', ok: true },
      { text: 'E-Mail Support', ok: true },
      { text: 'Standard-Analytics', ok: true },
      { text: 'C2PA + QR-Codes', ok: true },
      { text: 'Prioritäts-Support', ok: false },
      { text: 'API-Zugang', ok: false },
      { text: 'White-Label', ok: false },
    ],
  },
  {
    id: 'silber', name: 'Silber', emoji: '🥈',
    price: { monthly: 49, yearly: 39 },
    badge: 'Empfohlen',
    color: '#C0C0C0',
    gradient: 'from-slate-700 to-slate-900',
    border: 'border-slate-400/50',
    button: 'bg-slate-500 hover:bg-slate-400 text-white',
    buttonText: 'Silber wählen',
    highlighted: true,
    limits: { ai: 500, storage: '50 GB', apps: 11 },
    features: [
      { text: '11 Apps freigeschaltet', ok: true },
      { text: '500 KI-Aktionen/Monat', ok: true },
      { text: '50 GB Speicher', ok: true },
      { text: 'Prioritäts-Support', ok: true },
      { text: 'Erweiterte Analytics', ok: true },
      { text: 'Blockchain-Verifikation', ok: true },
      { text: 'API-Zugang (limited)', ok: true },
      { text: 'White-Label', ok: false },
      { text: 'Dedicated Manager', ok: false },
    ],
  },
  {
    id: 'gold', name: 'Gold', emoji: '🥇',
    price: { monthly: 99, yearly: 79 },
    badge: 'Beliebt',
    color: '#FFD700',
    gradient: 'from-yellow-700 to-amber-900',
    border: 'border-yellow-400/50',
    button: 'bg-yellow-500 hover:bg-yellow-400 text-black',
    buttonText: 'Gold wählen',
    limits: { ai: 2000, storage: '200 GB', apps: 16 },
    features: [
      { text: 'Alle 16 Apps', ok: true },
      { text: '2.000 KI-Aktionen/Monat', ok: true },
      { text: '200 GB Speicher', ok: true },
      { text: 'Support 24/7', ok: true },
      { text: 'Pro Analytics + Export', ok: true },
      { text: 'Voller API-Zugang', ok: true },
      { text: 'Team bis 5 Nutzer', ok: true },
      { text: 'White-Label', ok: false },
      { text: 'Dedicated Manager', ok: false },
    ],
  },
  {
    id: 'platin', name: 'Platin', emoji: '💎',
    price: { monthly: 199, yearly: 159 },
    badge: '⚡ Power',
    color: '#00D4FF',
    gradient: 'from-cyan-900 to-slate-900',
    border: 'border-cyan-400/50',
    button: 'bg-cyan-500 hover:bg-cyan-400 text-black',
    buttonText: 'Platin wählen',
    limits: { ai: 10000, storage: '1 TB', apps: 16 },
    features: [
      { text: 'Alle 16 Apps + Early Access', ok: true },
      { text: '10.000 KI-Aktionen/Monat', ok: true },
      { text: '1 TB Speicher', ok: true },
      { text: 'Support + Slack-Kanal', ok: true },
      { text: 'White-Label', ok: true },
      { text: 'Unbegrenzte API-Aufrufe', ok: true },
      { text: 'Team bis 25 Nutzer', ok: true },
      { text: 'SLA 99.9%', ok: true },
      { text: 'Dedicated Manager', ok: false },
    ],
  },
  {
    id: 'diamant', name: 'Diamant', emoji: '💠',
    price: { monthly: 499, yearly: 399 },
    badge: '🏢 Enterprise',
    color: '#93C5FD',
    gradient: 'from-blue-900 via-purple-900 to-slate-900',
    border: 'border-blue-300/50',
    button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white',
    buttonText: 'Diamant wählen',
    limits: { ai: -1, storage: '∞', apps: 16 },
    features: [
      { text: 'Alles aus Platin', ok: true },
      { text: 'Unbegrenzte KI-Aktionen', ok: true },
      { text: 'Unbegrenzter Speicher', ok: true },
      { text: 'Dedicated Account Manager', ok: true },
      { text: 'Custom KI-Training', ok: true },
      { text: 'On-Premise Option', ok: true },
      { text: 'Unbegrenzte Nutzer', ok: true },
      { text: 'SLA 99.99%', ok: true },
      { text: 'Custom Entwicklung', ok: true },
    ],
  },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const app = searchParams.get('app') || 'platform';
  const [billing, setBilling] = useState('monthly');

  const appLabels: Record<string, string> = {
    reviewradar: '⭐ ReviewRadar', churnrescue: '🔴 ChurnRescue',
    waitlistkit: '🚀 WaitlistKit', creatorseal: '🛡 CreatorSeal',
    adengine: '📺 AdEngine', platform: '🌐 RealSync Platform',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
            <span className="text-gray-700">|</span>
            <span className="text-sm text-gray-400">Preise · <span className="text-white font-semibold">{appLabels[app] || app}</span></span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full p-1">
            <button onClick={() => setBilling('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${billing === 'monthly' ? 'bg-white text-black' : 'text-gray-400'}`}>
              Monatlich
            </button>
            <button onClick={() => setBilling('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${billing === 'yearly' ? 'bg-white text-black' : 'text-gray-400'}`}>
              Jährlich <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center py-12 px-6">
        <div className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">// 6 Pakete · Von Gratis bis Enterprise</div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Gratis starten.<br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Skalieren wenn du bereit bist.</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">Jederzeit upgraden, downgraden oder kündigen. Keine Mindestlaufzeit. Keine versteckten Kosten.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {PLANS.map((plan) => {
            const price = billing === 'monthly' ? plan.price.monthly : plan.price.yearly;
            return (
              <div key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-4 bg-gradient-to-b ${plan.gradient} ${plan.border} ${plan.highlighted ? 'ring-1 ring-slate-400/50' : ''} transition-all hover:scale-[1.02] hover:ring-2 hover:ring-cyan-500/50`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-900 border border-gray-700 text-gray-300">{plan.badge}</span>
                  </div>
                )}
                <div className="text-center mb-4 pt-2">
                  <div className="text-3xl mb-1">{plan.emoji}</div>
                  <div className="font-bold text-base" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="mt-2">
                    {price === 0
                      ? <span className="text-2xl font-bold">Gratis</span>
                      : <><span className="text-2xl font-bold">€{price}</span><span className="text-gray-500 text-xs">/Mo</span></>}
                    {billing === 'yearly' && price > 0 && <div className="text-green-400 text-xs mt-0.5">-20%</div>}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-2.5 mb-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">KI</span>
                    <span className="font-bold">{plan.limits.ai === -1 ? '∞' : plan.limits.ai.toLocaleString('de')}/Mo</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Speicher</span>
                    <span className="font-bold">{plan.limits.storage}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Apps</span>
                    <span className="font-bold">{plan.limits.apps}/16</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 mb-4">
                  {plan.features.map((f, i) => (
                    <div key={i} className={`flex items-start gap-1.5 text-xs ${f.ok ? 'text-gray-200' : 'text-gray-600'}`}>
                      <span className={`flex-shrink-0 ${f.ok ? 'text-green-400' : 'text-gray-700'}`}>{f.ok ? '✓' : '✕'}</span>
                      {f.text}
                    </div>
                  ))}
                </div>

                <Link href={price === 0 ? '/register' : `/checkout?plan=${plan.id}&billing=${billing}&app=${app}`}
                  className={`block text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${plan.button}`}>
                  {plan.buttonText}
                </Link>
                {price > 0 && (
                  <p className="text-center text-gray-600 text-xs mt-1.5">
                    {billing === 'yearly' ? `€${(price * 12).toLocaleString('de')}/Jahr` : 'Monatlich kündbar'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-gray-900 border border-gray-800 rounded-xl px-8 py-4 text-sm text-gray-400">
            <span>🔒 DSGVO-konform</span>
            <span>🇩🇪 Server in DE</span>
            <span>↩ Jederzeit kündbar</span>
            <span>💬 Kein Vertrag</span>
            <span>⚡ Sofort aktiv</span>
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto space-y-3">
          <h2 className="text-center font-bold text-gray-300 mb-5">Häufige Fragen</h2>
          {[
            ['Wann Platin, wann Diamant?', 'Platin ab ~10 Mitarbeitern oder für Agenturen (White-Label). Diamant für Enterprises ab 50+ Nutzern oder On-Premise-Bedarf.'],
            ['Kann ich jederzeit upgraden?', 'Ja — sofort aktiv, du zahlst nur die anteilige Differenz.'],
            ['Was passiert nach Gratis?', 'Du behältst alle Daten. Upgrade jederzeit per Klick.'],
            ['Gibt es Rabatte für NGOs?', 'Ja — kontaktiere uns für Non-Profit-Konditionen.'],
          ].map(([q, a]) => (
            <div key={q as string} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="font-semibold text-sm mb-1">{q}</div>
              <div className="text-gray-400 text-xs">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Lädt...</div>}>
      <PricingContent />
    </Suspense>
  );
}
