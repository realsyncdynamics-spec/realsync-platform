'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: '/Monat',
    badge: 'Kostenlos - Fuer immer',
    badgeColor: 'text-green-400 bg-green-400/10 border-green-400/20',
    buttonText: 'Jetzt kostenlos starten',
    buttonStyle: 'bg-zinc-800 hover:bg-zinc-700 text-white',
    highlighted: false,
    features: [
      { text: '10 Deepfake-Scans/Monat', included: true },
      { text: '5 Wasserzeichen/Monat', included: true },
      { text: '3 Zertifikate/Monat', included: true },
      { text: '2 Blockchain-Verifikationen/Monat', included: true },
      { text: '1 GB Speicher', included: true },
      { text: 'CreatorSeal, CertificateGen, TrendRadar', included: true },
      { text: 'C2PA Basis-Schutz', included: true },
      { text: 'Prioritaets-Support', included: false },
      { text: 'Alle 13 Apps', included: false },
      { text: 'API-Zugang', included: false },
    ],
  },
  {
    id: 'bronze',
    name: 'Bronze',
    price: '19',
    period: '/Monat',
    badge: 'Beliebt',
    badgeColor: 'text-yellow-700 bg-yellow-700/10 border-yellow-700/20',
    buttonText: 'Bronze waehlen',
    buttonStyle: 'bg-yellow-700 hover:bg-yellow-600 text-white',
    highlighted: false,
    features: [
      { text: '100 Deepfake-Scans/Monat', included: true },
      { text: '50 Wasserzeichen/Monat', included: true },
      { text: '25 Zertifikate/Monat', included: true },
      { text: '20 Blockchain-Verifikationen/Monat', included: true },
      { text: '10 GB Speicher', included: true },
      { text: '7 Apps freigeschaltet', included: true },
      { text: 'C2PA + QR-Codes', included: true },
      { text: 'Email-Support', included: true },
      { text: 'Alle 13 Apps', included: false },
      { text: 'API-Zugang', included: false },
    ],
  },
  {
    id: 'silber',
    name: 'Silber',
    price: '49',
    period: '/Monat',
    badge: 'Empfohlen',
    badgeColor: 'text-gray-300 bg-gray-300/10 border-gray-300/20',
    buttonText: 'Silber waehlen',
    buttonStyle: 'bg-gradient-to-r from-gray-400 to-gray-300 hover:from-gray-300 hover:to-gray-200 text-black',
    highlighted: true,
    features: [
      { text: '500 Deepfake-Scans/Monat', included: true },
      { text: '250 Wasserzeichen/Monat', included: true },
      { text: '100 Zertifikate/Monat', included: true },
      { text: '100 Blockchain-Verifikationen/Monat', included: true },
      { text: '50 GB Speicher', included: true },
      { text: '11 Apps freigeschaltet', included: true },
      { text: 'C2PA + QR + Barcode + Wasserzeichen', included: true },
      { text: 'Prioritaets-Support', included: true },
      { text: 'Alle 13 Apps', included: false },
      { text: 'API-Zugang', included: true },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '99',
    period: '/Monat',
    badge: 'Alles inklusive',
    badgeColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    buttonText: 'Gold waehlen',
    buttonStyle: 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black',
    highlighted: false,
    features: [
      { text: 'Unbegrenzte Deepfake-Scans', included: true },
      { text: 'Unbegrenzte Wasserzeichen', included: true },
      { text: 'Unbegrenzte Zertifikate', included: true },
      { text: 'Unbegrenzte Blockchain-Verifikationen', included: true },
      { text: '500 GB Speicher', included: true },
      { text: 'Alle 13 Apps freigeschaltet', included: true },
      { text: 'C2PA + QR + Barcode + Wasserzeichen + NFT', included: true },
      { text: 'Dedizierter Support + SLA', included: true },
      { text: 'White-Label Option', included: true },
      { text: 'Voller API-Zugang + Webhooks', included: true },
    ],
  },
];

function PricingContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const [annual, setAnnual] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('checkout') === 'cancelled';

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') {
      router.push('/register');
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Fehler beim Laden des Checkouts. Bitte versuche es erneut.');
      }
    } catch (e) {
      alert('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (plan: typeof PLANS[0]) => {
    if (plan.price === '0') return '0';
    const p = parseInt(plan.price);
    if (annual) return Math.floor(p * 10).toString(); // 2 months free
    return plan.price;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">RealSync</Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link>
          <Link href="/login" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 text-sm">Login</Link>
        </div>
      </nav>

      <div className="px-8 py-16 max-w-7xl mx-auto">
        {cancelled && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl text-yellow-400 text-center">
            Checkout wurde abgebrochen. Du kannst jederzeit upgraden.
          </div>
        )}

        <div className="text-center mb-12">
          <span className="text-sm bg-yellow-500/10 text-yellow-400 px-4 py-1 rounded-full border border-yellow-500/20 mb-4 inline-block">Transparente Preise</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">Waehle deinen Plan</h1>
          <p className="text-gray-400 text-lg mb-8">Free Plan fuer immer kostenlos. Kein Kreditkarte. Kein Zeitlimit.</p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-500'}`}>Monatlich</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-yellow-500' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${annual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-500'}`}>Jaehrlich <span className="text-green-400">(2 Monate gratis)</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border flex flex-col ${
                plan.highlighted
                  ? 'border-gray-400 bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-lg shadow-gray-400/10'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-300 text-black text-xs font-bold px-3 py-1 rounded-full">EMPFOHLEN</span>
                </div>
              )}

              <div className="mb-6">
                <span className={`text-xs px-2 py-1 rounded-full border ${plan.badgeColor} mb-3 inline-block`}>{plan.badge}</span>
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">{getPrice(plan)}</span>
                  <span className="text-gray-400">&euro;{annual && plan.price !== '0' ? '/Jahr' : plan.period}</span>
                </div>
                {annual && plan.price !== '0' && (
                  <p className="text-green-400 text-xs mt-1">Spare {parseInt(plan.price) * 2}&euro;/Jahr</p>
                )}
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${feature.included ? 'text-white' : 'text-gray-600 line-through'}`}>
                    <span className={`mt-0.5 flex-shrink-0 ${feature.included ? 'text-green-400' : 'text-gray-700'}`}>{feature.included ? '✔' : '✘'}</span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.buttonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Weiterleitung...
                  </span>
                ) : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-bold">Feature-Vergleich</h2>
            <p className="text-gray-400 text-sm mt-1">Alle Features im Ueberblick - was ist in welchem Plan enthalten?</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="text-left p-4 text-gray-400">Feature</th>
                  <th className="text-center p-4 text-gray-400">Free</th>
                  <th className="text-center p-4 text-yellow-700">Bronze</th>
                  <th className="text-center p-4 text-gray-300">Silber</th>
                  <th className="text-center p-4 text-yellow-400">Gold</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Deepfake-Scans (C2PA)', '10/Mo', '100/Mo', '500/Mo', 'Unbegrenzt'],
                  ['Wasserzeichen', '5/Mo', '50/Mo', '250/Mo', 'Unbegrenzt'],
                  ['Blockchain-Hash', '2/Mo', '20/Mo', '100/Mo', 'Unbegrenzt'],
                  ['QR-Zertifikate', '3/Mo', '25/Mo', '100/Mo', 'Unbegrenzt'],
                  ['Barcode-Generierung', '✘', '✔', '✔', '✔'],
                  ['Speicher', '1 GB', '10 GB', '50 GB', '500 GB'],
                  ['Apps freigeschaltet', '3', '7', '11', '13 (alle)'],
                  ['API-Zugang', '✘', '✘', '✔', '✔ (Voll)'],
                  ['White-Label', '✘', '✘', '✘', '✔'],
                  ['Support', 'Community', 'Email', 'Prioritaet', 'Dediziert + SLA'],
                ].map(([feature, free, bronze, silber, gold]) => (
                  <tr key={feature} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                    <td className="p-4 font-medium">{feature}</td>
                    <td className="p-4 text-center text-gray-400">{free}</td>
                    <td className="p-4 text-center text-yellow-700">{bronze}</td>
                    <td className="p-4 text-center text-gray-300">{silber}</td>
                    <td className="p-4 text-center text-yellow-400">{gold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">Alle Preise inkl. MwSt. Jederzeit kuendbar. Keine versteckten Kosten.</p>
          <p className="text-gray-600 text-xs mt-2">Zahlungen werden sicher ueber Stripe verarbeitet. 🔒 SSL-verschluesselt.</p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Laden...</div>}>
      <PricingContent />
    </Suspense>
  );
}
