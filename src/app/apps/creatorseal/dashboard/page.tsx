'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLANS = {
  gratis:  { name:'Gratis',  emoji:'🆓', color:'#6B7280', verify:1, watermark:false, blockchain:false, c2pa:false },
  bronze:  { name:'Bronze',  emoji:'🥉', color:'#CD7F32', verify:2, watermark:true,  blockchain:false, c2pa:false },
  silber:  { name:'Silber',  emoji:'🥈', color:'#C0C0C0', verify:3, watermark:true,  blockchain:true,  c2pa:false },
  gold:    { name:'Gold',    emoji:'🥇', color:'#FFD700', verify:4, watermark:true,  blockchain:true,  c2pa:true },
  platin:  { name:'Platin',  emoji:'💎', color:'#00D4FF', verify:5, watermark:true,  blockchain:true,  c2pa:true },
  diamant: { name:'Diamant', emoji:'💠', color:'#93C5FD', verify:6, watermark:true,  blockchain:true,  c2pa:true },
};

const VERIFY_LEVELS = [
  { level:1, name:'Basis',           color:'#6B7280', desc:'E-Mail verifiziert',                     icon:'✉️', plan:'gratis' },
  { level:2, name:'Bronze Creator',  color:'#CD7F32', desc:'Wasserzeichen + Basis-Schutz',            icon:'🥉', plan:'bronze' },
  { level:3, name:'Silber Creator',  color:'#C0C0C0', desc:'Blockchain-Zeitstempel aktiviert',        icon:'🥈', plan:'silber' },
  { level:4, name:'Gold Creator',    color:'#FFD700', desc:'C2PA 2.3 + Vollverifizierung',            icon:'🥇', plan:'gold' },
  { level:5, name:'Platin Creator',  color:'#00D4FF', desc:'Polygon + White-Label + Enterprise',      icon:'💎', plan:'platin' },
  { level:6, name:'Diamant Creator', color:'#93C5FD', desc:'Höchste Stufe · RealSync Certified',      icon:'💠', plan:'diamant' },
];

const SOCIALS = [
  { id:'youtube',   name:'YouTube',    icon:'▶️',  color:'#FF0000', bg:'#1a0000', api:'YouTube Data API v3 (kostenlos)',  features:['Abonnenten','Video-Stats','Kanal-Info','Thumbnails','Analytics'] },
  { id:'tiktok',    name:'TikTok',     icon:'🎵',  color:'#00f2ea', bg:'#001a1a', api:'TikTok Display API (kostenlos)',   features:['Profil-Info','Letzte Videos','Follower','Video-Embed'] },
  { id:'instagram', name:'Instagram',  icon:'📸',  color:'#E1306C', bg:'#1a0010', api:'Instagram Basic Display API',      features:['Profil','Medien','Follower','Reels','Bio'] },
  { id:'facebook',  name:'Facebook',   icon:'👥',  color:'#1877F2', bg:'#00081a', api:'Facebook Graph API (kostenlos)',   features:['Page-Info','Posts','Fans','Insights'] },
  { id:'twitch',    name:'Twitch',     icon:'🟣',  color:'#9147FF', bg:'#0d0015', api:'Twitch Helix API (kostenlos)',     features:['Channel','Stream-Status','Follower','Clips'] },
  { id:'x',         name:'X / Twitter',icon:'✖️',  color:'#FFFFFF', bg:'#111',    api:'Twitter API v2 (Basic free)',      features:['Profil','Tweets','Follower'] },
];

const STATS: Record<string,{followers:string,posts:string,views:string,engagement:string}> = {
  youtube:   {followers:'12.4K',posts:'87', views:'1.2M', engagement:'8.4%'},
  tiktok:    {followers:'34.7K',posts:'142',views:'5.8M', engagement:'12.1%'},
  instagram: {followers:'8.9K', posts:'203',views:'420K', engagement:'6.7%'},
  facebook:  {followers:'3.2K', posts:'45', views:'87K',  engagement:'3.2%'},
  twitch:    {followers:'1.8K', posts:'28', views:'156K', engagement:'15.4%'},
  x:         {followers:'5.6K', posts:'834',views:'980K', engagement:'4.8%'},
};

function QR({value, size=160}:{value:string,size?:number}) {
  const cells=21, cs=size/cells;
  const h=value.split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white"/>
      {Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
        const fp=(r<7&&c<7)||(r<7&&c>=cells-7)||(r>=cells-7&&c<7);
        const on=fp||((h^(r*31+c*17))&1)===1;
        return on?<rect key={`${r}-${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill="#000"/>:null;
      }))}
    </svg>
  );
}

function Barcode({value}:{value:string}) {
  let x=4;
  return (
    <svg width="240" height="52" viewBox="0 0 240 52">
      <rect width="240" height="52" fill="white"/>
      {value.split('').map((c,i)=>{
        const w=(c.charCodeAt(0)%3+1)*2, gap=i%4===0?3:1;
        const el=<rect key={i} x={x} y={4} width={w} height={38} fill="#000"/>;
        x+=w+gap; return el;
      })}
      <text x="120" y="50" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#000">{value}</text>
    </svg>
  );
}

export default function CreatorSealDashboard() {
  const [plan, setPlan] = useState<keyof typeof PLANS>('silber');
  const [tab, setTab] = useState<'overview'|'verify'|'social'|'content'|'profile'|'website'>('overview');
  const [socials, setSocials] = useState<Record<string,boolean>>({youtube:true,tiktok:true,instagram:false,facebook:false,twitch:false,x:false});
  const [showQR, setShowQR] = useState(false);
  const username = 'dominik_steiner';
  const code = 'RS-2026-D5T8K1';
  const p = PLANS[plan];
  const vl = p.verify;
  const totalF = Object.entries(socials).filter(([,v])=>v).reduce((s,[k])=>s+parseFloat(STATS[k].followers)*1000,0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* HEADER */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg" style={{color:p.color}}>🛡 CreatorSeal</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{borderColor:p.color,color:p.color}}>{p.emoji} {p.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 bg-gray-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>{code}
          </span>
          <button onClick={()=>setShowQR(true)} className="text-xs font-bold px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 rounded-full hover:bg-cyan-500/20">📱 QR</button>
          <Link href="/pricing?app=creatorseal" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:p.color,color:'#000'}}>Upgrade</Link>
        </div>
      </div>

      {/* PLAN SWITCHER */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-gray-500 whitespace-nowrap">Demo:</span>
        {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map(k=>(
          <button key={k} onClick={()=>setPlan(k)}
            className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all ${plan===k?'opacity-100':'opacity-35 hover:opacity-60'}`}
            style={{background:PLANS[k].color+'20',border:`1px solid ${PLANS[k].color}50`,color:PLANS[k].color}}>
            {PLANS[k].emoji} {PLANS[k].name}
          </button>
        ))}
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-800 overflow-x-auto bg-gray-900/20">
        {(['overview','verify','social','content','profile','website'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${tab===t?'border-cyan-400 text-cyan-400':'border-transparent text-gray-500 hover:text-gray-300'}`}>
            {({overview:'📊 Übersicht',verify:'🔐 Verifikation',social:'📱 Social',content:'🎬 Content',profile:'👤 Profil',website:'🌐 Website'})[t]}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">

        {/* ── OVERVIEW ── */}
        {tab==='overview'&&<>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {v:`${vl}/6`,l:'Verifikationsstufe',c:p.color,s:p.emoji+' '+p.name},
              {v:`${(totalF/1000).toFixed(1)}K`,l:'Total Follower',c:'#00C853',s:'↑ alle Plattformen'},
              {v:`${Object.values(socials).filter(Boolean).length}/6`,l:'Plattformen',c:'#3B82F6',s:'Social Media'},
              {v:'98.2',l:'Trust Score',c:'#F9AB00',s:'⭐ Verifiziert'},
            ].map(s=>(
              <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
                <div className="text-xs text-gray-500 mt-1">{s.l}</div>
                <div className="text-xs mt-1" style={{color:s.c}}>{s.s}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Creator Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">// Creator Card</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2" style={{background:p.color+'20',borderColor:p.color}}>🎬</div>
                <div>
                  <div className="font-black">Dominik Steiner</div>
                  <div className="text-xs text-gray-400 font-mono">@{username}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:p.color,color:'#000'}}>{p.emoji} {p.name}</span>
                    {p.blockchain&&<span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">⛓</span>}
                    {p.c2pa&&<span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">C2PA</span>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                {['youtube','tiktok','instagram'].map(k=>(
                  <div key={k} className="bg-gray-800 rounded-lg p-2">
                    <div className="font-black text-sm" style={{color:SOCIALS.find(s=>s.id===k)?.color}}>{STATS[k].followers}</div>
                    <div className="text-xs text-gray-500 capitalize">{k==='youtube'?'YT':k==='tiktok'?'TT':'IG'}</div>
                  </div>
                ))}
              </div>
              <Link href={`/creator/${username}`} className="block text-center text-xs font-bold py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
                🌐 Öffentliches Profil →
              </Link>
            </div>

            {/* QR + Barcode */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">// Creator Code</div>
              <div className="flex gap-4">
                <div className="bg-white rounded-lg p-2 flex-shrink-0"><QR value={`https://realsyncdynamics.de/creator/${username}`} size={100}/></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-2">QR → dein verifiziertes Profil</div>
                  <div className="bg-white rounded p-2 mb-2"><Barcode value={code}/></div>
                  <div className="font-mono text-xs text-gray-400">{code}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button onClick={()=>setShowQR(true)} className="text-xs font-bold py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">📥 Herunterladen</button>
                <button className="text-xs font-bold py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400">📋 Kopieren</button>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Freigeschaltete Features · {p.name}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                {name:'Creator-Profil',icon:'👤',on:true},
                {name:'QR-Code + Barcode',icon:'📱',on:true},
                {name:'E-Mail Verifikation',icon:'✉️',on:true},
                {name:'Wasserzeichen',icon:'💧',on:p.watermark},
                {name:'Blockchain-Timestamp',icon:'⛓',on:p.blockchain},
                {name:'C2PA 2.3 Signatur',icon:'🔐',on:p.c2pa},
                {name:'Social Media APIs',icon:'📡',on:vl>=2},
                {name:'Analytics Dashboard',icon:'📊',on:vl>=3},
                {name:'Custom Domain',icon:'🌐',on:vl>=5},
                {name:'White-Label Profil',icon:'🎨',on:vl>=5},
                {name:'Polygon NFT-Badge',icon:'💎',on:vl>=5},
                {name:'RealSync Certified',icon:'🏆',on:vl>=6},
              ].map(f=>(
                <div key={f.name} className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${f.on?'bg-green-500/5 border-green-500/20 text-green-300':'bg-gray-800/50 border-gray-700 text-gray-600'}`}>
                  <span>{f.icon}</span><span className="flex-1">{f.name}</span>
                  <span>{f.on?'✓':'🔒'}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ── VERIFY ── */}
        {tab==='verify'&&<>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-5">// Verifikationsstufen — RealSync Creator Badges</div>
            <div className="space-y-3">
              {VERIFY_LEVELS.map(v=>{
                const active=vl>=v.level, current=vl===v.level;
                return (
                  <div key={v.level} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${current?'ring-1':''}`}
                    style={{borderColor:active?v.color+'60':'#374151',background:active?v.color+'08':'#111827',ringColor:v.color}}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 flex-shrink-0"
                      style={{borderColor:active?v.color:'#374151',background:active?v.color+'20':'transparent'}}>
                      {active?v.icon:'🔒'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-black text-sm" style={{color:active?v.color:'#6B7280'}}>Stufe {v.level} — {v.name}</span>
                        {current&&<span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">✓ Aktiv</span>}
                        {!active&&v.level>vl&&<span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-500">{v.plan} benötigt</span>}
                      </div>
                      <div className="text-xs text-gray-400">{v.desc}</div>
                    </div>
                    <div className="flex-shrink-0">
                      {active?<div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-black" style={{background:v.color}}>✓</div>
                             :<Link href="/pricing?app=creatorseal" className="text-xs px-3 py-1 rounded-full border border-gray-600 text-gray-400 hover:border-gray-400">↑</Link>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {title:'Polygon Blockchain',icon:'⛓',color:'#9333EA',on:p.blockchain,detail:'0x7a2c...d8f1 · Block #68.241.009',lock:'Silber+'},
              {title:'Unsichtbares Wasserzeichen',icon:'💧',color:'#3B82F6',on:p.watermark,detail:`WM-ID: ${code}`,lock:'Bronze+'},
              {title:'C2PA 2.3 Standard',icon:'🔐',color:'#06B6D4',on:p.c2pa,detail:'Ed25519 · SHA-256 · EU AI Act',lock:'Gold+'},
            ].map(b=>(
              <div key={b.title} className={`bg-gray-900 border rounded-xl p-5 ${b.on?'':'opacity-50'}`} style={{borderColor:b.on?b.color+'40':'#374151'}}>
                <div className="text-2xl mb-2">{b.icon}</div>
                <div className="font-black mb-2">{b.title}</div>
                {b.on?<div className="text-xs font-mono" style={{color:b.color}}>{b.detail}</div>
                     :<div className="text-xs text-gray-500">🔒 {b.lock}</div>}
              </div>
            ))}
          </div>
        </>}

        {/* ── SOCIAL ── */}
        {tab==='social'&&<>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">// Social Media Integrationen · Alle gratis APIs</div>
            <div className="text-xs text-gray-500 mb-5">YouTube Data API v3 · TikTok Display API · Instagram Basic Display · Facebook Graph API · Twitch Helix API</div>
            <div className="grid md:grid-cols-2 gap-3">
              {SOCIALS.map(s=>{
                const conn=socials[s.id];
                return (
                  <div key={s.id} className="border rounded-xl overflow-hidden" style={{borderColor:conn?s.color+'40':'#374151',background:conn?s.bg:'#111827'}}>
                    <div className="flex items-center gap-3 p-4">
                      <span className="text-2xl">{s.icon}</span>
                      <div className="flex-1">
                        <div className="font-black text-sm" style={{color:conn?s.color:'#9CA3AF'}}>{s.name}</div>
                        <div className="text-xs text-gray-500">{s.api}</div>
                      </div>
                      <button onClick={()=>setSocials(prev=>({...prev,[s.id]:!prev[s.id]}))}
                        className="text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
                        style={conn?{borderColor:s.color,color:s.color,background:s.color+'15'}:{borderColor:'#374151',color:'#9CA3AF'}}>
                        {conn?'✓ Verbunden':'+ Verbinden'}
                      </button>
                    </div>
                    {conn&&<>
                      <div className="border-t px-4 py-3 grid grid-cols-4 gap-2 text-center" style={{borderColor:s.color+'20'}}>
                        {[['followers','Follower'],[`posts`,'Posts'],['views','Views'],['engagement','Engage']].map(([k,l])=>(
                          <div key={k}>
                            <div className="font-black text-xs" style={{color:k==='engagement'?'#00C853':k==='followers'?s.color:'white'}}>{STATS[s.id][k as 'followers'|'posts'|'views'|'engagement']}</div>
                            <div className="text-xs text-gray-500">{l}</div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 pb-3 flex flex-wrap gap-1">
                        {s.features.map(f=><span key={f} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{f}</span>)}
                      </div>
                    </>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Aggregiert · Alle Plattformen</div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><div className="text-3xl font-black text-cyan-400">{(totalF/1000).toFixed(1)}K</div><div className="text-xs text-gray-500">Total Follower</div></div>
              <div><div className="text-3xl font-black text-green-400">7.9M</div><div className="text-xs text-gray-500">Total Views</div></div>
              <div><div className="text-3xl font-black text-yellow-400">8.2%</div><div className="text-xs text-gray-500">Ø Engagement</div></div>
              <div><div className="text-3xl font-black text-purple-400">{Object.values(socials).filter(Boolean).length}</div><div className="text-xs text-gray-500">Plattformen</div></div>
            </div>
          </div>
        </>}

        {/* ── CONTENT ── */}
        {tab==='content'&&(
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Content Feed — Alle Plattformen</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {plat:'youtube', title:'RealSync Dynamics Intro', views:'24.3K', date:'vor 2T', thumb:'🎬', wm:true},
                {plat:'tiktok',  title:'CreatorSeal Demo #fyp',  views:'156K',  date:'vor 5T', thumb:'🎵', wm:true},
                {plat:'youtube', title:'Tutorial: C2PA 2.3',     views:'8.7K',  date:'vor 1W', thumb:'📹', wm:true},
                {plat:'tiktok',  title:'Blockchain für Creator', views:'89K',   date:'vor 1W', thumb:'⛓',  wm:true},
                {plat:'instagram',title:'Behind the Scenes',     views:'12K',   date:'vor 2W', thumb:'📸', wm:false},
                {plat:'instagram',title:'Launch Day!',           views:'9.4K',  date:'vor 3W', thumb:'🚀', wm:true},
                {plat:'youtube', title:'Q&A Session',            views:'5.2K',  date:'vor 4W', thumb:'🎤', wm:false},
                {plat:'tiktok',  title:'Tech Stack 2026',        views:'234K',  date:'vor 1M', thumb:'💻', wm:true},
              ].map((c,i)=>{
                const s=SOCIALS.find(s=>s.id===c.plat)!;
                const conn=socials[c.plat];
                return (
                  <div key={i} className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${!conn?'opacity-40':''}`}>
                    <div className="h-24 flex items-center justify-center text-4xl" style={{background:s.bg}}>{c.thumb}</div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs">{s.icon}</span>
                        <span className="text-xs font-bold" style={{color:s.color}}>{s.name}</span>
                        {c.wm&&p.watermark&&<span className="ml-auto text-xs text-blue-400">💧</span>}
                      </div>
                      <div className="text-xs font-semibold text-white mb-1">{c.title}</div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{c.views}</span><span>{c.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab==='profile'&&(
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Profil bearbeiten</div>
              <div className="space-y-3">
                {[{l:'Anzeigename',v:'Dominik Steiner',t:'text'},{l:'Username',v:username,t:'text'},{l:'Bio',v:'Creator, Developer & Gründer RealSync Dynamics 🚀',t:'ta'},{l:'Website',v:'realsyncdynamics.de',t:'url'},{l:'Ort',v:'Neuhaus am Rennweg, Thüringen 🇩🇪',t:'text'},{l:'Kategorie',v:'Tech & Startup',t:'text'}].map(f=>(
                  <div key={f.l}>
                    <label className="text-xs text-gray-400 mb-1 block">{f.l}</label>
                    {f.t==='ta'
                      ?<textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-cyan-500" rows={2} defaultValue={f.v}/>
                      :<input type={f.t} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500" defaultValue={f.v}/>}
                  </div>
                ))}
                <button className="w-full py-2 rounded-lg bg-cyan-500 text-black text-sm font-black hover:bg-cyan-400">✓ Speichern</button>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Profil-Vorschau</div>
              <div className="bg-gray-800 rounded-xl p-5 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-3xl mb-3 border-2" style={{background:p.color+'20',borderColor:p.color}}>🎬</div>
                <div className="font-black mb-0.5">Dominik Steiner</div>
                <div className="text-xs text-gray-400 font-mono mb-2">@{username}</div>
                <div className="flex justify-center gap-1 mb-3 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:p.color,color:'#000'}}>{p.emoji} {p.name}</span>
                  {p.blockchain&&<span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">⛓</span>}
                  {p.c2pa&&<span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">C2PA</span>}
                </div>
                <div className="text-xs text-gray-400 mb-3">Creator · Developer · RealSync Dynamics</div>
                <div className="flex justify-center gap-2 mb-4">
                  {SOCIALS.filter(s=>socials[s.id]).map(s=>(
                    <span key={s.id} className="text-lg">{s.icon}</span>
                  ))}
                </div>
                <div className="flex justify-center"><div className="bg-white rounded-lg p-1.5"><QR value={`https://realsyncdynamics.de/creator/${username}`} size={80}/></div></div>
                <div className="text-xs font-mono text-gray-500 mt-2">realsyncdynamics.de/creator/{username}</div>
              </div>
              <Link href={`/creator/${username}`} className="mt-3 block text-center text-xs font-bold py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">🌐 Profil öffnen →</Link>
            </div>
          </div>
        )}

        {/* ── WEBSITE ── */}
        {tab==='website'&&<>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {tier:'Gratis',plan:'gratis',color:'#6B7280',emoji:'🆓',on:true,features:['Öffentliches Creator-Profil','QR-Code + Barcode','Social Media Links','Verification Badge','realsyncdynamics.de/creator/du']},
              {tier:'Silber+',plan:'silber',color:'#C0C0C0',emoji:'🥈',on:vl>=3,features:['Alle Gratis-Features','Custom Design','Video-Feed','Kontakt-Formular','Besucher-Analytics']},
              {tier:'Platin+',plan:'platin',color:'#00D4FF',emoji:'💎',on:vl>=5,features:['Alle Silber-Features','Custom Domain','Shop-Integration','Newsletter','SEO-Tools']},
            ].map(w=>(
              <div key={w.tier} className={`border rounded-xl p-5 ${!w.on?'opacity-50':''}`} style={{borderColor:w.on?w.color+'40':'#374151'}}>
                <div className="text-2xl mb-2">{w.emoji}</div>
                <div className="font-black mb-3" style={{color:w.color}}>{w.tier}</div>
                <div className="space-y-1.5 mb-4">
                  {w.features.map(f=>(
                    <div key={f} className="flex items-center gap-2 text-xs">
                      <span className={w.on?'text-green-400':'text-gray-600'}>✓</span>
                      <span className={w.on?'text-gray-300':'text-gray-600'}>{f}</span>
                    </div>
                  ))}
                </div>
                {w.on
                  ?<button className="w-full py-2 rounded-lg text-xs font-black" style={{background:w.color,color:'#000'}}>Bearbeiten →</button>
                  :<Link href="/pricing?app=creatorseal" className="block w-full py-2 rounded-lg text-xs font-bold text-center bg-gray-800 text-gray-500">Upgrade auf {w.plan} →</Link>}
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-5">
            <div className="text-xs text-cyan-500 uppercase tracking-widest mb-4">// Live Vorschau — Creator Page</div>
            <div className="bg-gray-800 rounded-xl overflow-hidden max-w-sm mx-auto">
              <div className="bg-gray-700 px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1">{['bg-red-500','bg-yellow-500','bg-green-500'].map(c=><div key={c} className={`w-2 h-2 rounded-full ${c}`}/>)}</div>
                <div className="flex-1 bg-gray-600 rounded text-xs text-gray-300 px-2 py-0.5 text-center font-mono">realsyncdynamics.de/creator/{username}</div>
              </div>
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-3 border-2" style={{background:p.color+'20',borderColor:p.color}}>🎬</div>
                <div className="font-black mb-0.5">Dominik Steiner</div>
                <div className="text-xs text-gray-400 font-mono mb-2">@{username}</div>
                <div className="flex justify-center gap-1 mb-3 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-black" style={{background:p.color,color:'#000'}}>{p.emoji} {p.name}</span>
                  {p.blockchain&&<span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">⛓</span>}
                  {p.c2pa&&<span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">C2PA</span>}
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  {SOCIALS.filter(s=>socials[s.id]).map(s=><span key={s.id} className="text-lg">{s.icon}</span>)}
                </div>
                <div className="flex justify-center">
                  <div className="bg-white rounded p-1.5"><QR value={`https://realsyncdynamics.de/creator/${username}`} size={80}/></div>
                </div>
              </div>
            </div>
          </div>
        </>}
      </div>

      {/* QR MODAL */}
      {showQR&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowQR(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-xs w-full" onClick={e=>e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="font-black text-lg mb-1">Creator QR-Code</div>
              <div className="text-xs font-mono text-gray-400">{code}</div>
            </div>
            <div className="flex justify-center mb-3"><div className="bg-white rounded-xl p-3"><QR value={`https://realsyncdynamics.de/creator/${username}`} size={180}/></div></div>
            <div className="flex justify-center mb-3"><div className="bg-white rounded p-2"><Barcode value={code}/></div></div>
            <div className="text-center text-xs text-gray-500 mb-4">realsyncdynamics.de/creator/{username}</div>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 rounded-lg bg-cyan-500 text-black text-sm font-black">📥 Download</button>
              <button onClick={()=>setShowQR(false)} className="py-2 rounded-lg bg-gray-800 text-gray-400 text-sm">Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
