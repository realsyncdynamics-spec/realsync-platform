'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { UNIFIED_PRICES } from '@/lib/stripe/plans-config';

interface Feature { icon: ReactNode; title: string; desc: string; }
interface Plan { id: string; name: string; price: number; priceId?: string; features: string[]; }

interface AppLandingPageProps {
  appName: string;
  headline: string;
  subtitle: string;
  accentColor: string;
  features: Feature[];
  plans: Plan[];
  ctaText?: string;
}

export default function AppLandingPage({ appName, headline, subtitle, accentColor, features, plans, ctaText = 'Jetzt Starten' }: AppLandingPageProps) {
  return (
    <div className="bg-[#03050A] text-white min-h-screen">
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center overflow-hidden">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-20 z-0 opacity-10 blur-[120px] w-[600px] h-[600px] rounded-full" style={{ backgroundColor: accentColor }} />
        <div className="z-10 text-center space-y-8 max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
            {headline}
          </h1>
          <p className="text-xl text-gray-400 font-mono tracking-widest">{subtitle}</p>
          <button className="px-10 py-4 font-black uppercase tracking-tighter hover:bg-white transition-all text-black" style={{ backgroundColor: accentColor }}>
            {ctaText}
          </button>
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div whileHover={{ y: -10 }} key={i} className="p-8 bg-[#0B0F18] border border-white/10 rounded-xl space-y-4">
              <div style={{ color: accentColor }}>{f.icon}</div>
              <h3 className="text-xl font-black italic">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-white/10 p-10 flex flex-col rounded-2xl bg-[#03050A]">
              <span className="text-sm font-mono uppercase tracking-[0.3em] mb-2">{plan.name}</span>
              <h2 className="text-5xl font-black mb-8 italic">{plan.price}EUR<span className="text-sm">/mtl.</span></h2>
              <ul className="flex-1 space-y-4 mb-12">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 font-black uppercase tracking-tighter rounded-sm" style={{ backgroundColor: plan.price > 0 ? accentColor : 'transparent', color: plan.price > 0 ? 'black' : 'white', border: plan.price === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                {plan.price === 0 ? 'Kostenlos Starten' : 'Jetzt Aktivieren'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center">
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.5em]">RealSync Dynamics AI Ecosystem — {appName}</p>
      </footer>
    </div>
  );
}
