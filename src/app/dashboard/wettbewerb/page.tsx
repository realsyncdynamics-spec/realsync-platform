"use client";
import { Trophy, Users, Gift, Share2 } from "lucide-react";
export default function WettbewerbPage() {
  const taken = 847;
  const total = 1000;
  const pct = Math.round((taken/total)*100);
  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Trophy size={16} className="text-yellow-400" /></div>
        <div>
          <h1 className="text-white text-sm font-semibold">RealSync Wettbewerb</h1>
          <p className="text-zinc-600 text-xs font-mono">1000 Gratis-Plaetze · Early Adopters · by RealSync Apps</p>
        </div>
      </div>
      <div className="px-6 py-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center mb-6">
          <div className="text-6xl font-black text-white mb-2">{taken}<span className="text-zinc-600">/{total}</span></div>
          <p className="text-zinc-500 text-sm mb-4">Plaetze vergeben</p>
          <div className="w-full h-3 bg-zinc-800 rounded-full mb-2">
            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all" style={{width:`${pct}%`}} />
          </div>
          <p className="text-yellow-600 text-xs font-mono">{total-taken} Plaetze verfuegbar</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <Gift size={20} className="text-yellow-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Gratis Pro</div>
            <div className="text-zinc-600 text-[10px]">3 Monate kostenlos</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <Users size={20} className="text-yellow-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Einladen</div>
            <div className="text-zinc-600 text-[10px]">+1 Monat pro Freund</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <Share2 size={20} className="text-yellow-400 mx-auto mb-2" />
            <div className="text-white text-sm font-medium">Teilen</div>
            <div className="text-zinc-600 text-[10px]">Referral-Link</div>
          </div>
        </div>
        <button className="w-full py-3 bg-white text-zinc-950 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition">Platz sichern</button>
      </div>
    </div>
  );
}
