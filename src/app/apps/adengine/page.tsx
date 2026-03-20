'use client';

import { motion } from 'framer-motion';
import { Rocket, Target, Zap, BarChart2 } from 'lucide-react';

const ADENGINE_PLANS = [
  { id: 'free', name: 'Starter', price: 0, features: ['3 Kampagnen/mtl.', 'Facebook & Instagram', 'KI-Standard-Copy'] },
  { id: 'pro', name: 'Performance', price: 29, priceId: 'price_ae_pro', features: ['Unbegrenzte Kampagnen', 'Alle 7 Kanaele', 'A/B Testing', 'Comet Scraping'] },
  { id: 'agency', name: 'Scale', price: 99, priceId: 'price_ae_agency', features: ['White-Label', 'Team-Zugriff', 'API-Zugang', 'Auto Budget-Routing'] },
];

export default function AdEngineLanding() {
  return (
    <div className="bg-[#03050A] text-white min-h-screen">
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-20 z-0 opacity-10 blur-[120px] w-[600px] h-[600px] bg-[#FF6888] rounded-full"
        />
        <div className="z-10 text-center space-y-8 max-w-5xl">
          <Rocket size={64} className="mx-auto text-[#FF6888]" />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
            Ad<span className="text-[#FF6888]">Engine</span>
          </h1>
          <p className="text-xl text-gray-400 font-mono tracking-widest">
            KI-gesteuerte Multi-Channel Werbung // Perplexity Research // Comet Scraping
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-[#FF6888] text-black px-10 py-4 font-black uppercase tracking-tighter hover:bg-white transition-all">
              Kampagne Starten
            </button>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: <Rocket size={20} />, t: 'Multi-Platform', d: 'TikTok, Insta, YouTube, FB, LinkedIn' },
            { icon: <Target size={20} />, t: 'Perplexity Research', d: 'Echtzeit Zielgruppen-Analyse' },
            { icon: <Zap size={20} />, t: 'A/B Testing', d: 'Automatische Varianten-Optimierung' },
            { icon: <BarChart2 size={20} />, t: 'Live Analytics', d: 'Performance-Tracking in Echtzeit' },
          ].map((f, i) => (
            <motion.div
              whileHover={{ y: -10 }}
              key={i}
              className="p-8 bg-[#0B0F18] border border-white/10 rounded-xl space-y-4"
            >
              <div className="text-[#FF6888]">{f.icon}</div>
              <h3 className="text-xl font-black italic">{f.t}</h3>
              <p className="text-sm text-gray-500">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {ADENGINE_PLANS.map((plan) => (
            <div key={plan.id} className="border border-white/10 p-10 flex flex-col rounded-2xl bg-[#03050A]">
              <span className="text-sm font-mono uppercase tracking-[0.3em] mb-2">{plan.name}</span>
              <h2 className="text-5xl font-black mb-8 italic">{plan.price}EUR<span className="text-sm">/mtl.</span></h2>
              <ul className="flex-1 space-y-4 mb-12">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#FF6888]" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 font-black uppercase tracking-tighter rounded-sm" style={{ backgroundColor: plan.price > 0 ? '#FF6888' : 'transparent', color: plan.price > 0 ? 'black' : 'white', border: plan.price === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                {plan.price === 0 ? 'Kostenlos Starten' : 'Jetzt Aktivieren'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
