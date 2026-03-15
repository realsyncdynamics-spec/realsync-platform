const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "/Monat",
    description: "Zum Testen & Kennenlernen",
    features: ["1 Content-Verifizierung", "Basic Analytics", "Community Support", "RealSync Branding"],
    cta: "Kostenlos starten",
    highlight: false,
  },
  {
    name: "Bronze",
    price: "9",
    period: "/Monat",
    description: "Perfekt zum Einstieg",
    features: ["10 Verifizierungen/Monat", "CreatorSeal Badge", "Social Auto-Posting (3 Plattformen)", "Market Scanner (Basic)", "E-Mail Support"],
    cta: "Bronze starten",
    highlight: false,
  },
  {
    name: "Silber",
    price: "29",
    period: "/Monat",
    description: "Das beliebteste Paket",
    features: ["50 Verifizierungen/Monat", "CreatorSeal Pro Badge", "Auto-Posting (alle Plattformen)", "Market Scanner (Pro)", "Ad Campaigns (5 aktive)", "Priority Support", "Digital Optimus Basic"],
    cta: "Silber starten",
    highlight: true,
  },
  {
    name: "Gold",
    price: "79",
    period: "/Monat",
    description: "Maximale Power",
    features: ["Unlimitierte Verifizierungen", "CreatorSeal Premium Badge", "Alle Plattformen + API", "Market Scanner (Echtzeit)", "Unlimitierte Campaigns", "Digital Optimus Pro", "Multi-App Builder", "Dedizierter Support"],
    cta: "Gold starten",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "199",
    period: "/Monat",
    description: "Teams & Agenturen",
    features: ["Alles aus Gold", "Multi-Tenant / Team-Accounts", "Custom Branding", "SLA & Priority Queue", "API Vollzugriff", "Custom Integrationen", "Onboarding Call"],
    cta: "Kontakt aufnehmen",
    highlight: false,
  },
];

export default function PricingPage() {
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border transition-all hover:scale-105 ${
                plan.highlight
                  ? "border-yellow-500 bg-yellow-500/5 shadow-lg shadow-yellow-500/10"
                  : "border-zinc-800 bg-zinc-900/50"
              }`}
            >
              <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-yellow-400" : "text-white"}`}>
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
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
