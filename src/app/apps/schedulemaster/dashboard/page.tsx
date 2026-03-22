'use client';
import { useState } from 'react';
import Link from 'next/link';

const DAYS = ['Mo','Di','Mi','Do','Fr','Sa','So'];
const SCHEDULED = [
  {id:1, day:0, time:'09:00', title:'YouTube Review: Sony A7V', platform:'YouTube',   icon:'📺', color:'#FF0000', status:'scheduled'},
  {id:2, day:0, time:'12:00', title:'TikTok Hook: Creator Tools',platform:'TikTok',    icon:'🎵', color:'#00F2EA', status:'scheduled'},
  {id:3, day:1, time:'10:00', title:'Instagram Reel: Behind Scenes',platform:'Instagram',icon:'📸',color:'#E1306C',status:'scheduled'},
  {id:4, day:2, time:'15:00', title:'YouTube Short: Quick Tip #47',platform:'YouTube',  icon:'📺', color:'#FF0000', status:'draft'},
  {id:5, day:3, time:'11:00', title:'LinkedIn: Creator Economy Trends',platform:'LinkedIn',icon:'💼',color:'#0A66C2',status:'scheduled'},
  {id:6, day:4, time:'09:00', title:'TikTok: Product Unboxing',   platform:'TikTok',    icon:'🎵', color:'#00F2EA', status:'scheduled'},
  {id:7, day:5, time:'14:00', title:'Instagram Post: Weekend Vibes',platform:'Instagram',icon:'📸',color:'#E1306C',status:'draft'},
];
const AI_SUGGESTIONS = [
  'Beste Zeit für YouTube: Dienstag 14:00-16:00 (+34% Reichweite)',
  'TikTok Peak: Täglich 19:00-21:00 Uhr (Ø 8.7% Engagement)',
  'Instagram Reels: Freitag morgen für maximale Saves',
  'LinkedIn: Dienstag/Mittwoch 08:00-10:00 für B2B',
];

export default function ScheduleMasterDashboard() {
  const [activeDay, setActiveDay] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [newPost, setNewPost] = useState({title:'',platform:'YouTube',time:'09:00',day:0});

  const dayPosts = SCHEDULED.filter(s => s.day === activeDay);
  const weekTotal = SCHEDULED.length;
  const scheduled = SCHEDULED.filter(s=>s.status==='scheduled').length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-orange-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(249,115,22,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-orange-400">📅 ScheduleMaster</span>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setShowNew(true)} className="text-xs font-bold px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full">+ Neuer Post</button>
          <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-orange-500 text-black rounded-full">Upgrade</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:weekTotal.toString(),    l:'Posts diese Woche', c:'#F97316', s:'Geplant'},
          {v:scheduled.toString(),   l:'Geplant',           c:'#10B981', s:'Bereit zum Senden'},
          {v:(weekTotal-scheduled).toString(), l:'Entwürfe', c:'#FFD700', s:'Noch nicht fertig'},
          {v:'7',                    l:'Plattformen',        c:'#00D4FF', s:'Verbunden'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Week Calendar */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-gray-800 border-b border-gray-800">
            {DAYS.map((d,i)=>(
              <button key={d} onClick={()=>setActiveDay(i)}
                className="py-3 text-center transition-all"
                style={{background:activeDay===i?'rgba(249,115,22,.1)':undefined}}>
                <div className="text-xs font-mono text-gray-500 uppercase">{d}</div>
                <div className="text-lg font-black mt-0.5" style={{color:activeDay===i?'#F97316':'#9CA3AF'}}>
                  {i+17}
                </div>
                {SCHEDULED.filter(s=>s.day===i).length>0 && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {SCHEDULED.filter(s=>s.day===i).map(s=>(
                      <div key={s.id} className="w-1.5 h-1.5 rounded-full" style={{background:s.color}}/>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 min-h-32">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">
              {DAYS[activeDay]}. {activeDay+17}. März · {dayPosts.length} Posts geplant
            </div>
            {dayPosts.length===0?(
              <div className="text-center py-8 text-gray-600 text-sm font-mono">Keine Posts — <button onClick={()=>setShowNew(true)} className="text-orange-400 hover:underline">hinzufügen?</button></div>
            ):(
              <div className="space-y-2">
                {dayPosts.map(p=>(
                  <div key={p.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                    <span className="text-xs font-mono text-gray-500 w-12 flex-shrink-0">{p.time}</span>
                    <span className="text-base">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.title}</div>
                      <div className="text-xs font-mono mt-0.5" style={{color:p.color}}>{p.platform}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${p.status==='scheduled'?'bg-green-500/15 text-green-400':'bg-yellow-500/15 text-yellow-400'}`}>
                      {p.status==='scheduled'?'✓ Geplant':'Entwurf'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KI Suggestions */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-5">
          <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-3">// KI-Optimierungsvorschläge</div>
          <div className="space-y-2">
            {AI_SUGGESTIONS.map((s,i)=>(
              <div key={i} className="flex items-start gap-3 bg-gray-800 rounded-lg p-3">
                <span className="text-orange-400 mt-0.5 text-sm flex-shrink-0">💡</span>
                <span className="text-sm text-gray-300">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowNew(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-4">📅 Neuen Post planen</div>
            <input value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))}
              placeholder="Post-Titel oder Beschreibung"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 mb-3"/>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <select value={newPost.platform} onChange={e=>setNewPost(p=>({...p,platform:e.target.value}))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500">
                {['YouTube','TikTok','Instagram','LinkedIn','Facebook','X'].map(p=><option key={p}>{p}</option>)}
              </select>
              <input type="time" value={newPost.time} onChange={e=>setNewPost(p=>({...p,time:e.target.value}))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"/>
            </div>
            <button onClick={()=>setShowNew(false)} className="w-full py-2.5 bg-orange-500 text-black font-black text-sm rounded-lg hover:bg-orange-400">
              📅 Planen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
