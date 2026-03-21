'use client';

import { useState } from 'react';

const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "/Monat",
    badge: "Kostenlos - Fuer immer",
    badgeColor: "text-green-400 bg-green-400/10",
    description: "Alle Apps gratis testen - keine Zeitbegrenzung",
    features: [
      "1 Content-Verifizierung/Tag (C2PA)",
      "Basic Wasserzeichen (mit RealSync Logo)",
      "1 Blockchain-Hash/Monat",
      "QR-Barcode Generator (3/Monat)",
      "CreatorSeal Basic Badge",
      "Basic Analytics Dashboard",
      "Community Support",
      "Alle 14 Apps zugang (Basic)",
      "ScheduleMaster (3 Posts/Woche)",
      "FanConnect (100 Fans)",
    ],
    cta: "Kostenlos starten",
    highlight: false,
    color: "border-zinc-800 bg-zinc-900/50",
  },
  {
    name: "Bronze",
    price: "9",
    period: "/Monat",
    badge: "Starter",
    badgeColor: "text-amber-600 bg-amber-600/10",
    description: "Perfekt zum Einstieg & Wachstum",
    features: [
      "10 C2PA Verifizierungen/Monat",
      "Wasserzeichen ohne Branding",
      "10 Blockchain-Hashes/Monat",
      "QR/Barcode unlimitiert",
      "CreatorSeal Bronze Badge",
      "AdEngine (2 Kampagnen)",
      "ContentForge (10 Inhalte/Mo)",
      "ScheduleMaster (alle Plattformen)",
      "FanConnect (1.000 Fans)",
      "MediaVault (10 GB Speicher)",
      "E-Mail Support",
    ],
    cta: "Bronze starten",
    highlight: false,
    color: "border-amber-700/50 bg-amber-900/10",
  },
  {
    name: "Silber",
    price: "29",
    period: "/Monat",
    badge: "Beliebteste Wahl",
    badgeColor: "text-yellow-400 bg-yellow-400/10",
    description: "Das beliebteste Paket fuer Creator",
    features: [
      "50 C2PA Verifizierungen/Monat",
      "Erweiterte Wasserzeichen (Custom)",
      "50 Blockchain-Hashes/Monat",
      "QR/Barcode mit Custom Branding",
      "CreatorSeal Pro Badge + Zertifikat",
      "AdEngine (10 Kampagnen)",
      "ContentForge (unlimitiert)",
      "ScheduleMaster Pro (AI Timing)",
      "FanConnect (10.000 Fans)",
      "MediaVault (50 GB)",
      "RightsGuard DMCA Schutz",
      "BrandKit Pro",
      "TrendRadar Echtzeit",
      "MonetizeMax Affiliate Tools",
      "Priority Support",
    ],
    cta: "Silber starten",
    highlight: true,
    color: "border-yellow-500 bg-yellow-500/5 shadow-lg shadow-yellow-500/10",
  },
  {
    name: "Gold",
    price: "79",
    period: "/Monat",
    badge: "Maximum Power",
    badgeColor: "text-yellow-300 bg-yellow-300/10",
    description: "Alles unlimitiert - volle Kontrolle",
    features: [
      "Unlimitierte C2PA Verifizierungen",
      "Enterprise Wasserzeichen + Invisible",
      "Unlimitierte Blockchain-Hashes",
      "QR/Barcode White-Label + API",
      "CreatorSeal Premium Badge",
      "PDF Zertifikat-Generator (unlimitiert)",
      "AdEngine (unlimitierte Kampagnen)",
      "Alle Apps unlimitiert",
      "FanConnect (unlimitiert)",
      "MediaVault (500 GB)",
      "RightsGuard Echtzeit + Auto-DMCA",
      "AnalyticsPro Advanced Reports",
      "CollabHub Deal Management",
      "API Vollzugriff",
      "Dedizierter Support",
    ],
    cta: "Gold starten",
    highlight: false,
    color: "border-yellow-400/30 bg-yellow-900/10",
  },
];

const APP_FEATURES = [
  { app: "CreatorSeal", free: "1 Badge/Tag", bronze: "10/Mo", silber: "50/Mo", gold: "Unlimitiert" },
  { app: "C2PA Verifizierung", free: "1/Tag", bronze: "10/Mo", silber: "50/Mo", gold: "Unlimitiert" },
  { app: "Wasserzeichen", free: "Mit Logo", bronze: "Ohne Branding", silber: "Custom Design", gold: "Invisible + API" },
  { app: "Blockchain Hash", free: "1/Monat", bronze: "10/Mo", silber: "50/Mo", gold: "Unlimitiert" },
  { app: "QR/Barcode", free: "3/Monat", bronze: "Unlimitiert", silber: "Custom Brand", gold: "White-Label" },
  { app: "AdEngine", free: "Nur Vorschau", bronze: "2 Kampagnen", silber: "10 Kampagnen", gold: "Unlimitiert" },
  { app: "ContentForge", free: "3 Inhalte/Mo", bronze: "10/Mo", silber: "Unlimitiert", gold: "Unlimitiert + AI" },
  { app: "ScheduleMaster", free: "3 Posts/Woche", bronze: "Alle Plattformen", silber: "+ AI Timing", gold: "+ Auto-Optimize" },
  { app: "FanConnect", free: "100 Fans", bronze: "1.000 Fans", silber: "10.000 Fans", gold: "Unlimitiert" },
  { app: "MediaVault", free: "1 GB", bronze: "10 GB", silber: "50 GB", gold: "500 GB" },
  { app: "RightsGuard", free: "Nur Monitoring", bronze: "+ Alerts", silber: "+ DMCA", gold: "+ Auto-DMCA" },
  { app: "AnalyticsPro", free: "Basic Stats", bronze: "+ Export", silber: "+ Echtzeit", gold: "+ Custom Reports" },
  { app: "BrandKit", free: "1 Asset", bronze: "10 Assets", silber: "Pro Tools", gold: "Unlimitiert" },
  { app: "TrendRadar", free: "Daily Digest", bronze: "Hourly", silber: "Echtzeit", gold: "+ AI Predictions" },
];

export default function PricingPage() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-yellow-400">Pricing</span> - Dein Plan
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Starte kostenlos und wachse mit deinem Business. Alle Plaene monatlich kuendbar.
          </p>
          <p className="text-green-400 text-sm mt-2">Paket 1 ist fuer immer kostenlos - keine Kreditkarte noetig</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border transition-all hover:scale-105 ${plan.color}`}
            >
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${plan.badgeColor}`}>
                {plan.badge}
              </span>
              <h3 className={`text-2xl font-bold mt-3 mb-1 ${plan.highlight ? 'text-yellow-400' : 'text-white'}`}>
                {plan.name}
              </h3>
              <p className="text-zinc-500 text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}EUR</span>
                <span className="text-zinc-500">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-yellow-400 mt-0.5">OK</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-lg font-bold text-sm transition ${
                  plan.highlight
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-6 py-3 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition"
          >
            {showComparison ? 'Vergleich ausblenden' : 'Alle Apps im Vergleich'}
          </button>
        </div>

        {showComparison && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold">Feature-Vergleich: Alle 14 Apps</h3>
              <p className="text-zinc-400 text-sm">C2PA, Wasserzeichen, Blockchain Hash & Barcode in jeder App</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-[10px] font-mono uppercase text-zinc-500 bg-black/20">
                  <tr>
                    <th className="p-4 text-left">App / Feature</th>
                    <th className="p-4 text-left text-green-400">Free</th>
                    <th className="p-4 text-left text-amber-600">Bronze</th>
                    <th className="p-4 text-left text-yellow-400">Silber</th>
                    <th className="p-4 text-left text-yellow-300">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {APP_FEATURES.map((row) => (
                    <tr key={row.app} className="border-t border-zinc-800 hover:bg-white/5">
                      <td className="p-4 font-medium">{row.app}</td>
                      <td className="p-4 text-zinc-400 text-sm">{row.free}</td>
                      <td className="p-4 text-zinc-300 text-sm">{row.bronze}</td>
                      <td className="p-4 text-zinc-200 text-sm">{row.silber}</td>
                      <td className="p-4 text-yellow-300 text-sm font-medium">{row.gold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-zinc-500 text-sm">Alle Preise in EUR. Monatlich kuendbar. Sichere Zahlung ueber Stripe.</p>
        </div>
      </div>
    </div>
  );
}
