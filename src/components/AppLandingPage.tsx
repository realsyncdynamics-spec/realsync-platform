'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface Feature {
  icon: ReactNode;
  title: string;
  desc: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface AppLandingPageProps {
  appName: string;
  headline: string;
  subtitle: string;
  accentColor: string;
  ctaText: string;
  features: Feature[];
  plans: Plan[];
}

export default function AppLandingPage({
  appName,
  headline,
  subtitle,
  accentColor,
  ctaText,
  features,
  plans,
}: AppLandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between p-6 border-b border-gray-800">
        <Link href="/" className="text-gray-400 hover:text-white transition">
          &larr; Stargate Hub
        </Link>
        <h2 className="font-bold text-lg" style={{ color: accentColor }}>{appName}</h2>
        <Link href={`/apps/${appName.toLowerCase()}/dashboard`} className="px-4 py-2 rounded-lg text-sm font-medium text-black" style={{ backgroundColor: accentColor }}>
          Dashboard
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4" style={{ color: accentColor }}>{headline}</h1>
        <p className="text-gray-400 text-xl mb-8">{subtitle}</p>
        <button className="px-8 py-3 rounded-xl font-semibold text-black text-lg" style={{ backgroundColor: accentColor }}>
          {ctaText}
        </button>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center mb-10">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="mb-3" style={{ color: accentColor }}>{f.icon}</div>
              <h4 className="font-semibold mb-1">{f.title}</h4>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center mb-10">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 text-center">
              <h4 className="font-bold text-lg mb-2" style={{ color: accentColor }}>{plan.name}</h4>
              <p className="text-3xl font-bold mb-4">
                {plan.price === 0 ? 'Free' : `${plan.price} EUR/mo`}
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button className="w-full py-2 rounded-lg font-medium text-black" style={{ backgroundColor: accentColor }}>
                {plan.price === 0 ? 'Kostenlos Starten' : 'Upgraden'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
