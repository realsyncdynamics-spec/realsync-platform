'use client';
import { useState } from 'react';
import Link from 'next/link';

const PLATFORMS = [
  {name:'YouTube',  icon:'📺', color:'#FF0000', views:'28.4K', subs:'1.2K',  growth:'+12%', eng:'4.2%'},
  {name:'TikTok',   icon:'🎵', color:'#00F2EA', views:'54.2K', subs:'3.8K',  growth:'+34%', eng:'8.7%'},
  {name:'Instagram',icon:'📸', color:'#E1306C', views:'12.3K', subs:'892',   growth:'+8%',  eng:'3.1%'},
  {name:'Facebook', icon:'🔵', color:'#1877F2', views:'8.1K',  subs:'2.1K',  growth:'+3%',  eng:'1.8%'},
  {name:'X',        icon:'𝕏',  color:'#000',   views:'4.9K',  subs:'634',   growth:'+5%',  eng:'2.3%'},
];
const MONTHS = ['Jan','Feb','Mär','Apr','Mai','Jun'];
const VIEWS  = [12000,18000,15000,24000,21000,28400];
const MAX    = Math.max(...VIEWS);

export default function AnalyticsProDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const totalViews  = PLATFORMS.reduce((s,p)=>s+parseInt(p.views.replace(/[^0-9]/g,'')),0);
  const totalSubs   = PLATFORMS.reduce((s,p)=>s+parseInt(p.subs.replace(/[^0-9]/g,'')),0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(0,240,255,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg" style={{color:'#00F0FF'}}>📊 AnalyticsPro</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border" style={{background:'rgba(0,240,255,.1)',color:'#00F0FF',borderColor:'rgba(0,240,255,.3)'}}>Cross-Platform</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 rounded-full text-black" style={{background:'#00F0FF'}}>Upgrade</Link>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:'107.9K',l:'Gesamt Views/Mo',  c:'#00F0FF', s:'↑ +18% vs. Vormonat'},
          {v:'8.6K',  l:'Neue Follower',     c:'#10B981', s:'+5 Plattformen'},
          {v:'4.8%',  l:'Ø Engagement',      c:'#FFD700', s:'Ø alle Plattformen'},
          {v:'5',     l:'Plattformen aktiv',  c:'#8B5CF6', s:'Echtzeit-Sync'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// Views Trend — letzten 6 Monate</div>
          <div className="flex items-end gap-3 h-32">
            {MONTHS.map((m,i)=>(
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md transition-all hover:opacity-80" 
                  style={{height:`${Math.round(VIEWS[i]/MAX*100)}%`,background:i===5?'#00F0FF':'rgba(0,240,255,.3)',minHeight:4}}/>
                <span className="text-xs font-mono text-gray-500">{m}</span>
                <span className="text-xs font-mono" style={{color:i===5?'#00F0FF':'#6B7280'}}>{(VIEWS[i]/1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Plattform Breakdown</span>
          </div>
          <div className="divide-y divide-gray-800">
            {PLATFORMS.map(p=>(
              <div key={p.name} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border flex-shrink-0"
                  style={{background:p.color+'18',borderColor:p.color+'35'}}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{p.subs} Follower · {p.eng} Engagement</div>
                </div>
                <div className="text-sm font-bold font-mono" style={{color:'#00F0FF'}}>{p.views}</div>
                <div className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'rgba(16,185,129,.15)',color:'#10B981'}}>{p.growth}</div>
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${parseInt(p.views)/600}%`,background:p.color,maxWidth:'100%'}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
