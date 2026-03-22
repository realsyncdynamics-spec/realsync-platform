'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimusButton from '@/components/OptimusButton';

const TRENDS = [
  {id:1, topic:'AI-generierter Content',    score:98, velocity:'+142%', platform:'TikTok',    category:'Tech',      status:'exploding', posts:'2.4M', engagement:'12.8%'},
  {id:2, topic:'Creator Economy 2026',      score:91, velocity:'+89%',  platform:'YouTube',   category:'Business',  status:'rising',    posts:'890K', engagement:'8.2%'},
  {id:3, topic:'Deepfake Detection Tools',  score:87, velocity:'+234%', platform:'X',         category:'Tech',      status:'viral',     posts:'456K', engagement:'15.1%'},
  {id:4, topic:'Content Authenticity',      score:82, velocity:'+67%',  platform:'LinkedIn',  category:'Business',  status:'rising',    posts:'234K', engagement:'6.4%'},
  {id:5, topic:'QR Code Marketing',         score:74, velocity:'+45%',  platform:'Instagram', category:'Marketing', status:'growing',   posts:'1.2M', engagement:'4.7%'},
  {id:6, topic:'Blockchain für Creator',    score:69, velocity:'+38%',  platform:'YouTube',   category:'Tech',      status:'growing',   posts:'345K', engagement:'5.9%'},
  {id:7, topic:'Micro-Influencer Deals',   score:63, velocity:'+22%',  platform:'TikTok',    category:'Business',  status:'steady',    posts:'678K', engagement:'9.3%'},
  {id:8, topic:'B2B Creator Marketing',     score:58, velocity:'+18%',  platform:'LinkedIn',  category:'Marketing', status:'steady',    posts:'123K', engagement:'7.1%'},
];
const STATUS_META: Record<string,{l:string;c:string;bg:string}> = {
  exploding:{l:'🔥 Exploding',  c:'#EF4444',bg:'rgba(239,68,68,.15)'},
  viral:    {l:'⚡ Viral',      c:'#FF6B35',bg:'rgba(255,107,53,.12)'},
  rising:   {l:'📈 Steigend',   c:'#FFD700',bg:'rgba(255,215,0,.12)'},
  growing:  {l:'↗ Wachsend',   c:'#10B981',bg:'rgba(16,185,129,.12)'},
  steady:   {l:'→ Stabil',     c:'#6B7280',bg:'rgba(107,114,128,.1)'},
};
const CATEGORIES = ['Alle','Tech','Business','Marketing'];
const PLATFORMS  = ['Alle','YouTube','TikTok','Instagram','X','LinkedIn'];

export default function TrendRadarDashboard() {
  const [catFilter, setCatFilter] = useState('Alle');
  const [platFilter, setPlatFilter] = useState('Alle');
  const [liveCount, setLiveCount] = useState(2847392);
  const [alertTrend, setAlertTrend] = useState<number|null>(null);

  useEffect(() => {
    const t = setInterval(() => setLiveCount(c => c + Math.floor(Math.random()*50+10)), 2000);
    return () => clearInterval(t);
  }, []);

  const filtered = TRENDS.filter(t =>
    (catFilter==='Alle'||t.category===catFilter) &&
    (platFilter==='Alle'||t.platform===platFilter)
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-green-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(0,255,136,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-green-400">📡 TrendRadar</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border bg-red-500/15 text-red-400 border-red-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
            Live · {liveCount.toLocaleString('de')} Posts analysiert
          </span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 rounded-full text-black" style={{background:'#00FF88'}}>Upgrade</Link>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:TRENDS.filter(t=>t.status==='exploding'||t.status==='viral').length.toString(), l:'Viral Trends', c:'#EF4444', s:'Jetzt explodierend'},
          {v:TRENDS.length.toString(), l:'Trends erkannt', c:'#00FF88', s:'Letzte 24h'},
          {v:'98%', l:'Top Score', c:'#FFD700', s:'AI-generierter Content'},
          {v:'+142%', l:'Max Velocity', c:'#00D4FF', s:'Schnellster Trend'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-5 mb-4 flex gap-4 flex-wrap">
        <div className="flex gap-1.5">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCatFilter(c)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
              style={catFilter===c?{background:'rgba(0,255,136,.2)',border:'1px solid rgba(0,255,136,.4)',color:'#00FF88'}:{border:'1px solid #374151',color:'#6B7280',background:'transparent'}}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {PLATFORMS.map(p=>(
            <button key={p} onClick={()=>setPlatFilter(p)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
              style={platFilter===p?{background:'rgba(0,212,255,.2)',border:'1px solid rgba(0,212,255,.4)',color:'#00D4FF'}:{border:'1px solid #374151',color:'#6B7280',background:'transparent'}}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Trend List */}
      <div className="px-5 pb-8 space-y-2">
        {filtered.map((t,i)=>{
          const st = STATUS_META[t.status];
          return (
            <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-center w-8 flex-shrink-0">
                  <div className="text-xl font-black" style={{color:i<3?'#FFD700':'#6B7280'}}>#{i+1}</div>
                </div>
                {/* Score Bar */}
                <div className="w-16 flex-shrink-0">
                  <div className="flex justify-between text-xs font-mono mb-0.5">
                    <span style={{color:t.score>85?'#EF4444':t.score>70?'#FFD700':'#10B981'}}>{t.score}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${t.score}%`,background:t.score>85?'#EF4444':t.score>70?'#FFD700':'#10B981'}}/>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{t.topic}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{t.platform} · {t.category} · {t.posts} Posts · {t.engagement} Eng.</div>
                </div>
                <div className="text-sm font-black text-right" style={{color:'#10B981',minWidth:60}}>{t.velocity}</div>
                <span className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap" style={{color:st.c,background:st.bg}}>{st.l}</span>
                <button onClick={()=>setAlertTrend(alertTrend===t.id?null:t.id)}
                  className="text-xs px-2.5 py-1 rounded-full transition-all flex-shrink-0"
                  style={alertTrend===t.id?{background:'rgba(0,255,136,.2)',border:'1px solid rgba(0,255,136,.4)',color:'#00FF88'}:{background:'#1F2937',border:'1px solid #374151',color:'#6B7280'}}>
                  {alertTrend===t.id?'🔔 An':'🔕'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {alertTrend && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 border border-green-500/30 rounded-2xl px-5 py-3 shadow-2xl z-50 flex items-center gap-3">
          <span className="text-green-400">🔔</span>
          <span className="text-sm font-bold text-green-400">Alert aktiv</span>
          <span className="text-xs text-gray-400 font-mono">Du wirst benachrichtigt wenn dieser Trend +20% steigt</span>
          <button onClick={()=>setAlertTrend(null)} className="text-gray-600 hover:text-white ml-2">✕</button>
        </div>
      )}
    </div>
  );
}
