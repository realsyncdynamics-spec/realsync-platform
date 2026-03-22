'use client';
import { useState } from 'react';
import Link from 'next/link';

const REVENUE_STREAMS = [
  {name:'YouTube AdSense',    icon:'📺', monthly:892,  growth:'+12%', color:'#FF0000', active:true},
  {name:'Sponsoring Deals',   icon:'🤝', monthly:2500, growth:'+28%', color:'#F59E0B', active:true},
  {name:'Merch / Shop',       icon:'👕', monthly:340,  growth:'+5%',  color:'#8B5CF6', active:true},
  {name:'Mitgliedschaften',   icon:'💎', monthly:680,  growth:'+41%', color:'#00D4FF', active:true},
  {name:'Affiliate Links',    icon:'🔗', monthly:245,  growth:'+9%',  color:'#10B981', active:true},
  {name:'Digitale Produkte',  icon:'📦', monthly:0,    growth:'—',    color:'#6B7280', active:false},
];
const MONTHS = ['Okt','Nov','Dez','Jan','Feb','Mär'];
const MRR    = [2890,3120,2980,3800,4150,4657];
const MAX    = Math.max(...MRR);

export default function MonetizeMaxDashboard() {
  const totalMRR = REVENUE_STREAMS.filter(r=>r.active).reduce((s,r)=>s+r.monthly,0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-emerald-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(16,185,129,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-emerald-400">💰 MonetizeMax</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-emerald-500 text-black rounded-full">Upgrade</Link>
      </div>

      {/* MRR Hero */}
      <div className="p-5">
        <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full opacity-10" style={{background:'radial-gradient(ellipse at right, #10B981, transparent)'}}/>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">// Monthly Recurring Revenue</div>
          <div className="text-5xl font-black text-emerald-400 mb-1">€{totalMRR.toLocaleString('de')}</div>
          <div className="text-sm text-gray-400 font-mono">↑ +22% vs. letzten Monat · 5 aktive Einnahmequellen</div>
        </div>

        {/* MRR Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// MRR Trend</div>
          <div className="flex items-end gap-3 h-28">
            {MONTHS.map((m,i)=>(
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md" style={{height:`${Math.round(MRR[i]/MAX*100)}%`,background:i===5?'#10B981':'rgba(16,185,129,.3)',minHeight:4}}/>
                <span className="text-xs font-mono text-gray-500">{m}</span>
                <span className="text-xs font-mono" style={{color:i===5?'#10B981':'#6B7280'}}>€{(MRR[i]/1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Einnahmequellen</span>
          </div>
          <div className="divide-y divide-gray-800">
            {REVENUE_STREAMS.map(r=>(
              <div key={r.name} className="px-5 py-4 flex items-center gap-4">
                <span className="text-xl w-8 text-center flex-shrink-0">{r.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{r.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 rounded-full" style={{width:`${r.active?(r.monthly/totalMRR*200):0}%`,maxWidth:120,background:r.color,minWidth:r.active?8:0}}/>
                    {r.active && <span className="text-xs font-mono text-gray-500">{Math.round(r.monthly/totalMRR*100)}%</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-black text-right" style={{color:r.active?'#10B981':'#6B7280'}}>
                    {r.active?`€${r.monthly.toLocaleString('de')}/Mo`:'Nicht aktiv'}
                  </div>
                  <div className="text-xs font-mono text-right" style={{color:r.growth==='—'?'#6B7280':'#10B981'}}>{r.growth}</div>
                </div>
                {!r.active && (
                  <button className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">Aktivieren</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
