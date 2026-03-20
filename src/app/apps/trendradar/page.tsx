'use client';

import { motion } from 'framer-motion';
import { Radio, TrendingUp, FileText, Bell } from 'lucide-react';

export default function TrendRadarLanding() {
  return (
    <div className="bg-[#03050A] text-white min-h-screen">
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center overflow-hidden">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-20 z-0 opacity-10 blur-[120px] w-[600px] h-[600px] bg-[#00F0FF] rounded-full" />
        <div className="z-10 text-center space-y-8 max-w-5xl">
          <Radio size={64} className="mx-auto text-[#00F0FF]" />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">Trend<span className="text-[#00F0FF]">Radar</span></h1>
          <p className="text-xl text-gray-400 font-mono tracking-widest">Echtzeit Markt-Intelligence // Perplexity Trend Detection</p>
          <button className="bg-[#00F0FF] text-black px-10 py-4 font-black uppercase tracking-tighter hover:bg-white transition-all">Trends Scannen</button>
        </div>
      </section>
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-4">
          {[{ icon: <Radio size={20}/>, t: 'Live Scanning', d: 'TikTok, X, Reddit Monitoring' }, { icon: <TrendingUp size={20}/>, t: 'Trend Score', d: 'AI-basierte Bewertung' }, { icon: <FileText size={20}/>, t: 'PDF Reports', d: 'Automatische Berichte' }, { icon: <Bell size={20}/>, t: 'Alert System', d: 'Echtzeit Benachrichtigungen' }].map((f, i) => (
            <motion.div whileHover={{ y: -10 }} key={i} className="p-8 bg-[#0B0F18] border border-white/10 rounded-xl space-y-4">
              <div className="text-[#00F0FF]">{f.icon}</div>
              <h3 className="text-xl font-black italic">{f.t}</h3>
              <p className="text-sm text-gray-500">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
