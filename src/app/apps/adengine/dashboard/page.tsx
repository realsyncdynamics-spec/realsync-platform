'use client';
import { useState } from 'react';
import Link from 'next/link';

const CAMPAIGNS = [
  {id:1, name:'Tech Review Spring', platform:'YouTube', status:'active',  budget:500,  spent:247,  views:28400, ctr:3.2, roi:182},
  {id:2, name:'TikTok Viral Hook',  platform:'TikTok',   status:'active',  budget:200,  spent:89,   views:54200, ctr:5.7, roi:241},
  {id:3, name:'IG Story Promo',     platform:'Instagram', status:'paused',  budget:150,  spent:150,  views:12300, ctr:2.1, roi:95},
  {id:4, name:'YouTube PreRoll',    platform:'YouTube',  status:'draft',   budget:800,  spent:0,    views:0,     ctr:0,   roi:0},
];
const PLATFORMS = ['YouTube','TikTok','Instagram','Facebook','Reddit','LinkedIn','X'];

export default function AdEngineDashboard() {
  const [creating, setCreating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState('');
  const [generating, setGenerating] = useState(false);

  function generateAd() {
    if(!prompt) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerated(`🎬 Hook: "${prompt.split(' ').slice(0,3).join(' ')}? Das änderst du jetzt!"\n\n📝 Script (15s):\n"Hast du ${prompt}? Ich zeige dir in 15 Sekunden wie RealSync Creator dabei hilft — kostenlos starten, Link in der Bio!"\n\n🎯 CTA: "Jetzt kostenlos starten → Link in Bio"\n\n#${prompt.replace(/\s+/g, '')} #Creator #RealSync`);
      setGenerating(false);
    }, 1600);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-pink-950/30 border-b border-pink-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-pink-400">📺 AdEngine</span>
          <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-mono border border-pink-500/30">KI-Ads</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-pink-500 text-white rounded-full">💎 Upgrade</Link>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[{v:'€336',l:'Total Spent',c:'#F472B6'},{v:'94.9K',l:'Views gesamt',c:'#00D4FF'},{v:'3.8%',l:'Ø CTR',c:'#10B981'},{v:'173%',l:'Ø ROI',c:'#FFD700'}].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{s.l}</div>
          </div>
        ))}
      </div>

      {/* KI Ad Generator */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-pink-500/30 rounded-xl p-5">
          <div className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-3">// KI Ad Generator</div>
          <div className="flex gap-3 mb-3">
            <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Beschreibe dein Produkt oder Thema..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"/>
            <button onClick={generateAd} disabled={generating}
              className="px-5 py-2.5 bg-pink-500 text-white text-sm font-bold rounded-lg hover:bg-pink-400 disabled:opacity-50">
              {generating?'⟳ Generiere...':'🤖 Generieren'}
            </button>
          </div>
          <div className="flex gap-2 mb-3 flex-wrap">
            {PLATFORMS.map(p=>(
              <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 cursor-pointer hover:border-pink-500 hover:text-pink-400 transition-all">{p}</span>
            ))}
          </div>
          {generated && (
            <pre className="bg-gray-800 border border-pink-500/20 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono">{generated}</pre>
          )}
        </div>
      </div>

      {/* Campaigns */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Kampagnen</span>
            <button onClick={()=>setCreating(true)} className="text-xs font-bold px-3 py-1.5 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-full">+ Neue Kampagne</button>
          </div>
          <div className="divide-y divide-gray-800">
            {CAMPAIGNS.map(c=>(
              <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{c.platform}</div>
                </div>
                <div className="text-xs font-mono text-gray-400">€{c.spent}/€{c.budget}</div>
                <div className="text-xs font-mono" style={{color:c.views>0?'#00D4FF':'#6B7280'}}>{c.views>0?c.views.toLocaleString('de'):'—'} Views</div>
                <div className="text-xs font-mono" style={{color:c.roi>100?'#10B981':c.roi>0?'#FFD700':'#6B7280'}}>{c.roi>0?`${c.roi}% ROI`:'—'}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${c.status==='active'?'bg-green-500/20 text-green-400 border-green-500/30':c.status==='paused'?'bg-yellow-500/20 text-yellow-400 border-yellow-500/30':'bg-gray-800 text-gray-500 border-gray-700'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
