'use client';
import { useState } from 'react';
import Link from 'next/link';

const DEALS = [
  {id:1, brand:'TechGear Pro',      logo:'⚙️', value:2500,  status:'active',    deadline:'30.04.', type:'Sponsored Video', platform:'YouTube', progress:65},
  {id:2, brand:'FitLife Nutrition', logo:'💪', value:800,   status:'pending',   deadline:'15.04.', type:'Instagram Story', platform:'Instagram', progress:20},
  {id:3, brand:'CloudStorage Inc',  logo:'☁️', value:1500,  status:'completed', deadline:'01.03.', type:'Blog Review',     platform:'Blog', progress:100},
  {id:4, brand:'GameStream Plus',   logo:'🎮', value:3200,  status:'negotiating',deadline:'TBD',   type:'Series Sponsor',  platform:'Multi', progress:10},
];
const STATUS: Record<string,{l:string;c:string;bg:string}> = {
  active:     {l:'Aktiv',        c:'#10B981',bg:'rgba(16,185,129,.15)'},
  pending:    {l:'Ausstehend',   c:'#FFD700',bg:'rgba(255,215,0,.12)'},
  completed:  {l:'✓ Abgeschlossen',c:'#6B7280',bg:'rgba(107,114,128,.12)'},
  negotiating:{l:'Verhandlung',  c:'#00D4FF',bg:'rgba(0,212,255,.12)'},
};

export default function CollabHubDashboard() {
  const [showNew, setShowNew] = useState(false);
  const totalEarned = DEALS.filter(d=>d.status==='completed').reduce((s,d)=>s+d.value,0);
  const totalActive = DEALS.filter(d=>d.status==='active').reduce((s,d)=>s+d.value,0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-amber-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(245,158,11,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-amber-400">🤝 CollabHub</span>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setShowNew(true)} className="text-xs font-bold px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-full">+ Neuer Deal</button>
          <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-amber-500 text-black rounded-full">Upgrade</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:`€${totalEarned.toLocaleString('de')}`,l:'Eingenommen',    c:'#10B981',s:'Abgeschlossene Deals'},
          {v:`€${totalActive.toLocaleString('de')}`,l:'Aktive Deals',    c:'#FFD700',s:'In Bearbeitung'},
          {v:DEALS.length.toString(),               l:'Deals gesamt',    c:'#F59E0B',s:'Alle Plattformen'},
          {v:'€1.975',                               l:'Ø Deal-Wert',     c:'#00D4FF',s:'Pro Kooperation'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-8 space-y-3">
        {DEALS.map(d=>{
          const st = STATUS[d.status];
          return (
            <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl flex-shrink-0">{d.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-black text-base">{d.brand}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{color:st.c,background:st.bg}}>{st.l}</span>
                    <span className="text-xs text-gray-500 font-mono ml-auto">Deadline: {d.deadline}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-gray-400 font-mono">{d.type}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-400 font-mono">{d.platform}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-sm font-black text-amber-400">€{d.value.toLocaleString('de')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{width:`${d.progress}%`,background:d.status==='completed'?'#6B7280':'#F59E0B'}}/>
                    </div>
                    <span className="text-xs font-mono text-gray-500">{d.progress}%</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {d.status!=='completed'&&(
                    <button className="text-xs px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">Bearbeiten</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowNew(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-4">🤝 Neuer Brand Deal</div>
            {['Markenname','Deal-Wert (€)','Content-Typ','Deadline'].map(f=>(
              <input key={f} placeholder={f} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 mb-3"/>
            ))}
            <button onClick={()=>setShowNew(false)} className="w-full py-2.5 bg-amber-500 text-black font-black text-sm rounded-lg">Deal hinzufügen</button>
          </div>
        </div>
      )}
    </div>
  );
}
