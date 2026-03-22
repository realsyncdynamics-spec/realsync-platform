'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PLAN_CONFIG = {
  gratis:  { name:'Gratis',  emoji:'🆓', color:'#6B7280', watermark:false, blockchain:false, c2pa:false },
  bronze:  { name:'Bronze',  emoji:'🥉', color:'#CD7F32', watermark:true,  blockchain:false, c2pa:false },
  silber:  { name:'Silber',  emoji:'🥈', color:'#C0C0C0', watermark:true,  blockchain:true,  c2pa:false },
  gold:    { name:'Gold',    emoji:'🥇', color:'#FFD700', watermark:true,  blockchain:true,  c2pa:true  },
  platin:  { name:'Platin',  emoji:'💎', color:'#00D4FF', watermark:true,  blockchain:true,  c2pa:true  },
  diamant: { name:'Diamant', emoji:'💠', color:'#93C5FD', watermark:true,  blockchain:true,  c2pa:true  },
};

// Mock creator data — in prod from Supabase
const CREATORS: Record<string, {
  name: string; username: string; bio: string; location: string;
  category: string; avatar: string; plan: keyof typeof PLAN_CONFIG;
  trustScore: number; creatorCode: string; joinDate: string;
  website?: string;
  socials: { youtube?:string; tiktok?:string; instagram?:string; facebook?:string; twitch?:string; x?:string; };
  stats: { youtube?:string; tiktok?:string; instagram?:string; facebook?:string; twitch?:string; x?:string; };
  recentContent: { platform:string; title:string; views:string; thumb:string; date:string; verified:boolean; }[];
}> = {
  dominik_steiner: {
    name: 'Dominik Steiner',
    username: 'dominik_steiner',
    bio: 'Creator, Developer & Gründer von RealSync Dynamics. Ich baue die Zukunft der Creator Economy 🚀',
    location: 'Neuhaus am Rennweg, Thüringen 🇩🇪',
    category: 'Tech & Startup',
    avatar: '🎬',
    plan: 'gold',
    trustScore: 98.2,
    creatorCode: 'RS-2026-D5T8K1',
    joinDate: 'März 2026',
    website: 'realsyncdynamics.de',
    socials: { youtube:'@realsyncdynamics', tiktok:'@realsyncdynamics', instagram:'@realsyncdynamics', x:'@realsyncdyn' },
    stats:   { youtube:'12.4K', tiktok:'34.7K', instagram:'8.9K', x:'5.6K' },
    recentContent: [
      {platform:'tiktok',    title:'CreatorSeal Demo #fyp',   views:'156K',  thumb:'🎵', date:'vor 5T',  verified:true},
      {platform:'youtube',   title:'RealSync Dynamics Intro', views:'24.3K', thumb:'🎬', date:'vor 2T',  verified:true},
      {platform:'youtube',   title:'Tutorial: C2PA 2.3',      views:'8.7K',  thumb:'📹', date:'vor 1W',  verified:true},
      {platform:'tiktok',    title:'Blockchain für Creator',  views:'89K',   thumb:'⛓', date:'vor 1W',  verified:true},
      {platform:'instagram', title:'Behind the Scenes',       views:'12K',   thumb:'📸', date:'vor 2W',  verified:false},
      {platform:'tiktok',    title:'Tech Stack 2026',         views:'234K',  thumb:'💻', date:'vor 1M',  verified:true},
    ],
  },
};

const PLATFORM_META: Record<string,{icon:string;name:string;color:string;url:(h:string)=>string}> = {
  youtube:   {icon:'▶️', name:'YouTube',   color:'#FF0000', url:h=>`https://youtube.com/${h}`},
  tiktok:    {icon:'🎵', name:'TikTok',    color:'#00f2ea', url:h=>`https://tiktok.com/${h}`},
  instagram: {icon:'📸', name:'Instagram', color:'#E1306C', url:h=>`https://instagram.com/${h.replace('@','')}`},
  facebook:  {icon:'👥', name:'Facebook',  color:'#1877F2', url:h=>`https://facebook.com/${h}`},
  twitch:    {icon:'🟣', name:'Twitch',    color:'#9147FF', url:h=>`https://twitch.tv/${h}`},
  x:         {icon:'✖️', name:'X',         color:'#FFFFFF', url:h=>`https://x.com/${h.replace('@','')}`},
};

function QR({value,size=120}:{value:string,size?:number}) {
  const cells=21,cs=size/cells;
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
    <svg width="220" height="48" viewBox="0 0 220 48">
      <rect width="220" height="48" fill="white"/>
      {value.split('').map((c,i)=>{
        const w=(c.charCodeAt(0)%3+1)*2,gap=i%4===0?3:1;
        const el=<rect key={i} x={x} y={3} width={w} height={36} fill="#000"/>;
        x+=w+gap; return el;
      })}
      <text x="110" y="46" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill="#000">{value}</text>
    </svg>
  );
}

export default function CreatorProfile() {
  const params = useParams();
  const username = params?.username as string || 'dominik_steiner';
  const creator = CREATORS[username] || CREATORS['dominik_steiner'];
  const plan = PLAN_CONFIG[creator.plan];
  const [tab, setTab] = useState<'about'|'content'|'verify'|'contact'>('about');
  const [showShare, setShowShare] = useState(false);

  const totalFollowers = Object.values(creator.stats).reduce((s,v)=>s+parseFloat(v||'0')*1000,0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO ── */}
      <div className="relative" style={{background:`linear-gradient(135deg, ${plan.color}15 0%, #030712 60%)`}}>
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-xs text-gray-500 hover:text-white flex items-center gap-1">← RealSync</Link>
            <div className="flex gap-2">
              <button onClick={()=>setShowShare(true)} className="text-xs px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white">
                🔗 Teilen
              </button>
              <Link href="/apps/creatorseal/dashboard" className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:plan.color,color:'#000'}}>
                Dashboard →
              </Link>
            </div>
          </div>

          {/* Avatar + Info */}
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl border-2" style={{background:plan.color+'20',borderColor:plan.color}}>
                {creator.avatar}
              </div>
              {/* Verification ring */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-gray-950" style={{background:plan.color}}>
                {plan.emoji}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-black">{creator.name}</h1>
                {/* Verification badges */}
                {plan.blockchain && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">⛓ Blockchain</span>}
                {plan.c2pa && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">C2PA 2.3</span>}
                {plan.watermark && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">💧 WM</span>}
              </div>
              <div className="text-sm text-gray-400 font-mono mb-2">@{creator.username}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-3 py-1 rounded-full" style={{background:plan.color,color:'#000'}}>
                  {plan.emoji} {plan.name} Creator
                </span>
                <span className="text-xs text-gray-500">{creator.category}</span>
                <span className="text-xs text-gray-500">📍 {creator.location}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">{creator.bio}</p>

          {/* Stats Row */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="text-center bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <div className="font-black text-lg" style={{color:plan.color}}>{(totalFollowers/1000).toFixed(1)}K</div>
              <div className="text-xs text-gray-500">Follower</div>
            </div>
            <div className="text-center bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <div className="font-black text-lg text-green-400">{creator.trustScore}</div>
              <div className="text-xs text-gray-500">Trust Score</div>
            </div>
            <div className="text-center bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <div className="font-black text-lg text-blue-400">{creator.recentContent.filter(c=>c.verified).length}</div>
              <div className="text-xs text-gray-500">Verified Posts</div>
            </div>
            <div className="text-center bg-gray-900/60 rounded-xl p-3 border border-gray-800">
              <div className="font-black text-lg text-yellow-400">{Object.keys(creator.socials).length}</div>
              <div className="text-xs text-gray-500">Plattformen</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(creator.socials).map(([platform, handle]) => {
              const meta = PLATFORM_META[platform];
              const followers = creator.stats[platform as keyof typeof creator.stats];
              return (
                <a key={platform} href={meta.url(handle)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105"
                  style={{borderColor:meta.color+'40',background:meta.color+'10',color:meta.color}}>
                  <span>{meta.icon}</span>
                  <span>{meta.name}</span>
                  {followers && <span className="text-gray-400 font-normal">{followers}</span>}
                </a>
              );
            })}
            {creator.website && (
              <a href={`https://${creator.website}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-xs font-bold hover:scale-105 transition-all">
                🌐 {creator.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex border-b border-gray-800 overflow-x-auto">
          {(['about','content','verify','contact'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${tab===t?'text-white':'text-gray-500 hover:text-gray-300 border-transparent'}`}
              style={tab===t?{borderColor:plan.color,color:plan.color}:{borderColor:'transparent'}}>
              {({about:'👤 Über',content:'🎬 Content',verify:'🔐 Verifikation',contact:'✉️ Kontakt'})[t]}
            </button>
          ))}
        </div>

        <div className="py-6 space-y-4">

          {/* ABOUT */}
          {tab==='about'&&<>
            {/* Platform Stats */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Plattform Stats</div>
              <div className="space-y-3">
                {Object.entries(creator.socials).map(([platform, handle]) => {
                  const meta = PLATFORM_META[platform];
                  const followers = creator.stats[platform as keyof typeof creator.stats] || '—';
                  return (
                    <div key={platform} className="flex items-center gap-3">
                      <span className="text-xl w-8 text-center">{meta.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold" style={{color:meta.color}}>{meta.name}</span>
                          <span className="text-sm font-black text-white">{followers}</span>
                        </div>
                        <div className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{width:`${Math.min(100,parseFloat(followers)*2)}%`,background:meta.color}}/>
                        </div>
                      </div>
                      <a href={meta.url(handle)} target="_blank" className="text-xs text-gray-500 hover:text-white">→</a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Creator Info</div>
              <div className="space-y-2">
                {[
                  {icon:'📍',label:'Ort',value:creator.location},
                  {icon:'🎯',label:'Kategorie',value:creator.category},
                  {icon:'📅',label:'Dabei seit',value:creator.joinDate},
                  {icon:'🔑',label:'Creator Code',value:creator.creatorCode},
                  ...(creator.website?[{icon:'🌐',label:'Website',value:creator.website}]:[]),
                ].map(r=>(
                  <div key={r.label} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                    <span className="text-lg w-8 text-center">{r.icon}</span>
                    <span className="text-xs text-gray-500 w-24">{r.label}</span>
                    <span className="text-xs text-white font-mono">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* CONTENT */}
          {tab==='content'&&(
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">// Neueste Inhalte</div>
              <div className="grid grid-cols-2 gap-3">
                {creator.recentContent.map((c,i)=>{
                  const meta=PLATFORM_META[c.platform];
                  return (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all cursor-pointer">
                      <div className="h-24 flex items-center justify-center text-4xl bg-gray-800">{c.thumb}</div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs">{meta.icon}</span>
                          <span className="text-xs font-bold" style={{color:meta.color}}>{meta.name}</span>
                          {c.verified&&plan.watermark&&<span className="ml-auto text-xs text-green-400">✓</span>}
                        </div>
                        <div className="text-xs font-semibold text-white mb-1 line-clamp-2">{c.title}</div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{c.views}</span><span>{c.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VERIFY */}
          {tab==='verify'&&<>
            <div className="bg-gray-900 border rounded-xl p-5" style={{borderColor:plan.color+'40'}}>
              <div className="text-xs uppercase tracking-widest mb-3" style={{color:plan.color}}>// Verifikationsstatus</div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2" style={{background:plan.color+'20',borderColor:plan.color}}>
                  {plan.emoji}
                </div>
                <div>
                  <div className="font-black text-xl" style={{color:plan.color}}>{plan.name} Creator</div>
                  <div className="text-xs text-gray-400">Trust Score: <span className="text-green-400 font-bold">{creator.trustScore}/100</span></div>
                  <div className="text-xs text-gray-500 font-mono">{creator.creatorCode}</div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {icon:'✉️',label:'E-Mail Verifikation',on:true},
                  {icon:'💧',label:'Unsichtbares Wasserzeichen',on:plan.watermark},
                  {icon:'⛓',label:'Polygon Blockchain Zeitstempel',on:plan.blockchain},
                  {icon:'🔐',label:'C2PA 2.3 Standard (EU AI Act)',on:plan.c2pa},
                  {icon:'🛡',label:'RealSync Verifikation Badge',on:true},
                  {icon:'🌐',label:'Öffentliches Creator-Profil',on:true},
                ].map(f=>(
                  <div key={f.label} className={`flex items-center gap-3 p-3 rounded-lg border ${f.on?'border-green-500/20 bg-green-500/5':'border-gray-700 bg-gray-800/30'}`}>
                    <span>{f.icon}</span>
                    <span className={`text-xs flex-1 ${f.on?'text-green-300':'text-gray-500'}`}>{f.label}</span>
                    <span className={f.on?'text-green-400 text-xs font-bold':'text-gray-600 text-xs'}>{f.on?'✓ Aktiv':'✗'}</span>
                  </div>
                ))}
              </div>

              {plan.blockchain&&(
                <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-xs text-purple-400 mb-1 font-bold">⛓ Polygon Blockchain</div>
                  <div className="font-mono text-xs text-gray-400">0x7a2c4f8d...d8f1a3b9</div>
                  <div className="font-mono text-xs text-gray-500">Block #68.241.009 · {creator.joinDate}</div>
                </div>
              )}
            </div>

            {/* QR + Barcode */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Creator Code — Verifizierungsnachweis</div>
              <div className="flex gap-4 items-center">
                <div className="bg-white rounded-lg p-2 flex-shrink-0"><QR value={`https://realsyncdynamics.de/creator/${creator.username}`}/></div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">QR-Code für Verifizierungsnachweis</div>
                  <div className="bg-white rounded p-2 mb-2"><Barcode value={creator.creatorCode}/></div>
                  <div className="font-mono text-xs text-gray-400">{creator.creatorCode}</div>
                </div>
              </div>
            </div>
          </>}

          {/* CONTACT */}
          {tab==='contact'&&(
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">// Kontakt aufnehmen</div>
              <div className="space-y-3">
                <input type="text" placeholder="Dein Name" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"/>
                <input type="email" placeholder="Deine E-Mail" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"/>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500">
                  <option>Kooperation</option><option>Sponsoring</option><option>Interview</option><option>Sonstiges</option>
                </select>
                <textarea rows={3} placeholder="Deine Nachricht..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-cyan-500"/>
                <button className="w-full py-2.5 rounded-lg font-black text-sm" style={{background:plan.color,color:'#000'}}>
                  Nachricht senden →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-xs text-gray-500 mb-2">Powered by</div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black" style={{color:plan.color}}>
            🛡 RealSync Dynamics
          </Link>
          <div className="text-xs text-gray-600 mt-1">Creator Identity & Verification Platform</div>
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShare&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowShare(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-xs w-full" onClick={e=>e.stopPropagation()}>
            <div className="text-center font-black mb-4">Profil teilen</div>
            <div className="flex justify-center mb-4"><div className="bg-white rounded-xl p-3"><QR value={`https://realsyncdynamics.de/creator/${creator.username}`} size={160}/></div></div>
            <div className="bg-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 text-center mb-4 break-all">
              realsyncdynamics.de/creator/{creator.username}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 rounded-lg text-xs font-bold" style={{background:plan.color,color:'#000'}}>📋 Kopieren</button>
              <button onClick={()=>setShowShare(false)} className="py-2 rounded-lg bg-gray-800 text-gray-400 text-xs">Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
