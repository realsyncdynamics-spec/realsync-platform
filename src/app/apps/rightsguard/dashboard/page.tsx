'use client';
import { useState } from 'react';
import Link from 'next/link';

const VIOLATIONS = [
  {id:1, content:'ProductReview_Final.mp4', platform:'YouTube',    type:'Vollständige Kopie',   status:'dmca_sent',  date:'heute',     match:'98%'},
  {id:2, content:'Thumbnail_01.jpg',        platform:'Instagram',   type:'Bilddiebstahl',        status:'detected',   date:'gestern',   match:'94%'},
  {id:3, content:'BlogPost_KI_Trends.pdf',  platform:'Medium',      type:'Text-Plagiat',         status:'resolved',   date:'15.03.',    match:'87%'},
  {id:4, content:'Podcast_Episode_12.mp3',  platform:'Spotify',     type:'Audio-Kopie',          status:'monitoring', date:'10.03.',    match:'76%'},
];
const STATUS_META: Record<string,{l:string;c:string;bg:string}> = {
  detected:   {l:'⚠ Erkannt',     c:'#EF4444',bg:'rgba(239,68,68,.15)'},
  dmca_sent:  {l:'📧 DMCA gesendet',c:'#3B82F6',bg:'rgba(59,130,246,.15)'},
  monitoring: {l:'👁 Monitoring',   c:'#FFD700',bg:'rgba(255,215,0,.12)'},
  resolved:   {l:'✓ Gelöst',       c:'#10B981',bg:'rgba(16,185,129,.12)'},
};

export default function RightsGuardDashboard() {
  const [sending, setSending] = useState<number|null>(null);
  const [violations, setViolations] = useState(VIOLATIONS);

  function sendDMCA(id: number) {
    setSending(id);
    setTimeout(()=>{
      setViolations(p=>p.map(v=>v.id===id?{...v,status:'dmca_sent'}:v));
      setSending(null);
    },1800);
  }

  const openCount = violations.filter(v=>v.status==='detected').length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-teal-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(45,212,191,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-teal-400">⚖️ RightsGuard</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border bg-teal-500/10 text-teal-400 border-teal-500/30">DMCA Auto</span>
        </div>
        <div className="flex gap-2">
          {openCount > 0 && <span className="text-xs font-bold px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full">⚠ {openCount} neue Verletzungen</span>}
          <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-teal-500 text-black rounded-full">Upgrade</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:violations.length.toString(),                         l:'Gesamt erkannt',     c:'#2DD4BF'},
          {v:violations.filter(v=>v.status==='resolved').length.toString(), l:'Gelöst',  c:'#10B981'},
          {v:violations.filter(v=>v.status==='dmca_sent').length.toString(),l:'DMCA gesendet',c:'#3B82F6'},
          {v:openCount.toString(),                                 l:'Neu / Offen',        c:openCount>0?'#EF4444':'#6B7280'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Content-Verletzungen</span>
            <button className="text-xs px-3 py-1.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full font-bold">🔍 Jetzt scannen</button>
          </div>
          <div className="divide-y divide-gray-800">
            {violations.map(v=>{
              const st = STATUS_META[v.status];
              return (
                <div key={v.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{v.content}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      {v.platform} · {v.type} · Match: <span className="text-red-400 font-bold">{v.match}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-mono">{v.date}</div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{color:st.c,background:st.bg}}>{st.l}</span>
                  {v.status==='detected' && (
                    <button onClick={()=>sendDMCA(v.id)} disabled={sending===v.id}
                      className="text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-40"
                      style={{background:'rgba(59,130,246,.2)',border:'1px solid rgba(59,130,246,.4)',color:'#3B82F6'}}>
                      {sending===v.id?'⟳ Sende...':'📧 DMCA senden'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
