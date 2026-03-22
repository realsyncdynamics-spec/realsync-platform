'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const APPS = [
  {id:'creatorseal',  name:'CreatorSeal',     icon:'🛡',  color:'#C9A84C', desc:'C2PA · Blockchain · Deepfake Detection',      href:'/apps/creatorseal/dashboard',  badge:'Flagship'},
  {id:'reviewradar',  name:'ReviewRadar',      icon:'⭐',  color:'#3B82F6', desc:'KI-Antworten · Google · Trustpilot · Yelp',   href:'/apps/reviewradar/dashboard',   badge:null},
  {id:'churnrescue',  name:'ChurnRescue',      icon:'💳',  color:'#EF4444', desc:'Failed Payments · Smart Retry · Win-Back',    href:'/apps/churnrescue/dashboard',   badge:null},
  {id:'waitlistkit',  name:'WaitlistKit',      icon:'🚀',  color:'#8B5CF6', desc:'Viral Referral · Launch Sequence · QR',       href:'/apps/waitlistkit/dashboard',   badge:null},
  {id:'adengine',     name:'AdEngine',         icon:'📺',  color:'#FF6888', desc:'KI-Ads · 7 Plattformen · DACH-First',         href:'/apps/adengine/dashboard',      badge:'KI'},
  {id:'analyticspr',  name:'AnalyticsPro',     icon:'📊',  color:'#00F0FF', desc:'Cross-Platform · Echtzeit · BI',               href:'/apps/analyticspro/dashboard',  badge:null},
  {id:'socialhub',    name:'SocialHub',        icon:'📱',  color:'#80FFC0', desc:'YouTube · TikTok · IG · FB · X · Twitch',    href:'/',                              badge:null},
  {id:'contentforge', name:'ContentForge',     icon:'✍️',  color:'#A855F7', desc:'KI-Content · SEO · Skripte · Posts',          href:'/apps/contentforge/dashboard',  badge:'KI'},
  {id:'mediavault',   name:'MediaVault',       icon:'🗄',  color:'#38BDF8', desc:'Encrypted Cloud · DSGVO · 1TB+',              href:'/apps/mediavault/dashboard',    badge:null},
  {id:'rightsgrd',    name:'RightsGuard',      icon:'⚖️',  color:'#2DD4BF', desc:'DMCA · Copyright · Digital Rights',           href:'/apps/rightsguard/dashboard',   badge:null},
  {id:'collabhub',    name:'CollabHub',        icon:'🤝',  color:'#F59E0B', desc:'Brand Deals · Collabs · Verträge',            href:'/apps/collabhub/dashboard',     badge:null},
  {id:'monetize',     name:'MonetizeMax',      icon:'💰',  color:'#10B981', desc:'Revenue Optimization · Preise · Upsell',      href:'/apps/monetizemax/dashboard',   badge:null},
  {id:'optimus',      name:'Optimus KI',       icon:'🤖',  color:'#60D0FF', desc:'9 Modelle · Perplexity · GPT · Claude',       href:'/',                              badge:'KI'},
  {id:'certgen',      name:'CertificateGen',   icon:'🏆',  color:'#FBBF24', desc:'PDF · QR · Blockchain-Zertifikate',           href:'/apps/certificategen/dashboard', badge:null},
  {id:'fanconnect',   name:'FanConnect',       icon:'❤️',  color:'#F472B6', desc:'Community · Membership · Fan-Club',           href:'/apps/fanconnect/dashboard',    badge:null},
  {id:'brandkit',     name:'BrandKit',         icon:'🎨',  color:'#EC4899', desc:'KI-Brand · Logo · Colors · Identity',         href:'/apps/brandkit/dashboard',      badge:'KI'},
];

const STATS = [
  {v:'16',   l:'Apps im Creator OS',   c:'#00D4FF'},
  {v:'C2PA', l:'2.3 Standard ready',   c:'#C9A84C'},
  {v:'98%',  l:'Deepfake-Erkennung',   c:'#10B981'},
  {v:'€0',   l:'Startup-Kosten',       c:'#8B5CF6'},
];

const TICKER_ITEMS = [
  '🛡 C2PA 2.3 Standard · EU AI Act konform',
  '⚡ 12 Workflows · Vollautomatisch',
  '🪙 50% Provision via RealSyncCoins',
  '🔐 DSGVO · Server in Deutschland',
  '📺 KI-Ads für YouTube · TikTok · Instagram',
  '⭐ KI-Antworten in 3 Sekunden',
  '💳 72% Failed Payment Recovery-Rate',
  '🚀 Viral Waitlist · Referral-System',
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  const [hovered, setHovered] = useState<string|null>(null);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:.7}50%{opacity:.2}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,212,255,.2)}50%{box-shadow:0 0 40px rgba(0,212,255,.4)}}
        .fu{animation:fadeUp .6s cubic-bezier(.34,1.56,.64,1) both}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}
        .ticker-inner{display:flex;animation:ticker 32s linear infinite;width:max-content}
        .app-card:hover{transform:translateY(-3px)!important}
      `}</style>

      {/* TICKER */}
      <div style={{ background:'#080C14', borderBottom:'1px solid #0F1520', height:34, overflow:'hidden', display:'flex', alignItems:'center' }}>
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', padding:'0 32px', letterSpacing:'.08em', whiteSpace:'nowrap' }}>
              {item} <span style={{ color:'#1A2130', marginLeft:16 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{ padding:'0 40px', height:54, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #0F1520', background:'rgba(3,5,10,.95)', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(20px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:16, height:16, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
            <div style={{ position:'absolute', inset:3, background:'#C9A84C' }}/>
          </div>
          <span style={{ fontWeight:900, fontSize:15, letterSpacing:'.04em' }}>
            RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span>
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {[
            {href:'/pricing', label:'Pakete'},
            {href:'/workflows', label:'Workflows'},
            {href:'/join/rs-dominik', label:'Referral'},
          ].map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.45)', textDecoration:'none', padding:'6px 12px', borderRadius:6, transition:'color .15s' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/login"
            style={{ fontFamily:"'DM Mono',monospace", fontSize:11, padding:'7px 14px', background:'transparent', border:'1px solid #374151', borderRadius:8, color:'rgba(255,255,255,.6)', textDecoration:'none', marginLeft:4 }}>
            Login
          </Link>
          <Link href="/register"
            style={{ fontFamily:"'DM Mono',monospace", fontSize:11, padding:'7px 16px', background:'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:8, color:'#000', fontWeight:700, textDecoration:'none' }}>
            Kostenlos starten
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 40px 60px', textAlign:'center', position:'relative' }}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:400, background:'radial-gradient(ellipse at center, rgba(0,212,255,.06), transparent 70%)', pointerEvents:'none' }}/>

        <div className="fu" style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:'.25em', color:'#00D4FF', textTransform:'uppercase', marginBottom:16 }}>
          // The Creator OS · 16 Apps · 1 Login
        </div>
        <h1 className="fu d1" style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:'-.02em' }}>
          Dein Content.<br/>
          <span style={{ background:'linear-gradient(90deg,#00D4FF 0%,#C9A84C 50%,#00D4FF 100%)', backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'ticker 4s linear infinite' }}>
            Verifiziert. Monetarisiert.
          </span><br/>
          Automatisiert.
        </h1>
        <p className="fu d2" style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:'rgba(255,255,255,.4)', maxWidth:540, margin:'0 auto 36px', lineHeight:1.8 }}>
          C2PA 2.3 · Polygon Blockchain · Deepfake-Erkennung ·<br/>
          KI-Reviews · Failed Payment Recovery · Viral Waitlist
        </p>
        <div className="fu d3" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/register"
            style={{ padding:'14px 32px', background:'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:10, color:'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, letterSpacing:'.04em', textDecoration:'none', display:'inline-block', boxShadow:'0 0 32px rgba(0,212,255,.3)' }}>
            Kostenlos Creator werden →
          </Link>
          <Link href="/join/rs-dominik"
            style={{ padding:'14px 28px', background:'transparent', border:'1px solid rgba(255,255,255,.15)', borderRadius:10, color:'rgba(255,255,255,.7)', fontFamily:"'DM Mono',monospace", fontSize:12, textDecoration:'none', display:'inline-block' }}>
            📱 QR-Demo scannen
          </Link>
        </div>

        {/* STATS */}
        <div className="fu d4" style={{ display:'flex', gap:20, justifyContent:'center', marginTop:48, flexWrap:'wrap' }}>
          {STATS.map(s => (
            <div key={s.l} style={{ textAlign:'center', padding:'16px 24px', background:'rgba(11,15,24,.8)', border:'1px solid #1A2130', borderRadius:12 }}>
              <div style={{ fontWeight:900, fontSize:26, color:s.c, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', marginTop:4, letterSpacing:'.1em', textTransform:'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* APP GRID */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>// 16 Apps · Ein Ökosystem</div>
          <h2 style={{ fontWeight:900, fontSize:32, marginBottom:8 }}>Creator OS</h2>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:'rgba(255,255,255,.35)' }}>Alle Tools. Ein Login. Vollständig automatisiert.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {APPS.map(app => (
            <Link key={app.id} href={app.href} style={{ textDecoration:'none' }}>
              <div className="app-card"
                onMouseEnter={() => setHovered(app.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ background:'#080C14', border:`1px solid ${hovered===app.id ? app.color+'50' : '#1A2130'}`, borderRadius:12, padding:16, transition:'all .2s', cursor:'pointer', background: hovered===app.id ? app.color+'08' : '#080C14' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:20 }}>{app.icon}</span>
                    <span style={{ fontWeight:800, fontSize:13, color: hovered===app.id ? app.color : '#E4E6EF' }}>{app.name}</span>
                  </div>
                  {app.badge && (
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, padding:'1px 6px', background:app.color+'20', border:`1px solid ${app.color}40`, color:app.color, borderRadius:4 }}>{app.badge}</span>
                  )}
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', lineHeight:1.5 }}>{app.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* WORKFLOW SECTION */}
      <div style={{ background:'#080C14', borderTop:'1px solid #1A2130', borderBottom:'1px solid #1A2130', padding:'60px 40px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>// Referral-Workflow</div>
            <h2 style={{ fontWeight:900, fontSize:28 }}>So funktioniert der Viral Loop</h2>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto', paddingBottom:10 }}>
            {[
              {icon:'📱', step:'1', title:'Creator postet QR', desc:'YouTube Bio · TikTok · Instagram'},
              {icon:'👆', step:'2', title:'Fan scannt / klickt', desc:'Landet auf join/creator-name'},
              {icon:'👁', step:'3', title:'Features sehen', desc:'Alles sichtbar · leicht geblurrt'},
              {icon:'🔐', step:'4', title:'Social Login', desc:'Google · YouTube · TikTok · FB · X'},
              {icon:'🎁', step:'5', title:'1 Monat Bronze gratis', desc:'Via Referral · Wert €19'},
              {icon:'🪙', step:'6', title:'Creator +Coins', desc:'50% des ersten Pakets · 100=€1'},
            ].map((s, i) => (
              <div key={s.step} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                <div style={{ textAlign:'center', padding:'16px', width:140 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#00D4FF', letterSpacing:'.1em', marginBottom:4 }}>SCHRITT {s.step}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:'#E4E6EF', marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', lineHeight:1.4 }}>{s.desc}</div>
                </div>
                {i < 5 && <div style={{ width:40, height:1, background:'linear-gradient(90deg,#00D4FF40,#C9A84C40)', flexShrink:0 }}/>}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:32 }}>
            <Link href="/join/rs-dominik"
              style={{ padding:'12px 28px', background:'rgba(201,168,76,.15)', border:'1px solid rgba(201,168,76,.3)', borderRadius:10, color:'#C9A84C', fontFamily:"'DM Mono',monospace", fontSize:11, textDecoration:'none', display:'inline-block' }}>
              Demo: /join/rs-dominik testen →
            </Link>
          </div>
        </div>
      </div>

      {/* PRICING PREVIEW */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'60px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>// Transparent. Kein Vertrag.</div>
          <h2 style={{ fontWeight:900, fontSize:28 }}>Starte kostenlos. Skaliere wenn bereit.</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          {[
            {name:'🆓 Gratis', price:'€0,00', sub:'Für immer', features:['Creator-Profil','QR-Code','Basis-Badge'], color:'#6B7280'},
            {name:'🥉 Bronze', price:'€19,00', sub:'/Monat · alle Tools', features:['Alle Dashboard-Tools','KI-Antworten (50/Mo)','3 Plattformen','Bronze Badge'], color:'#CD7F32'},
            {name:'🥈 Silber', price:'€49,00', sub:'/Monat', features:['Blockchain Zeitstempel','KI-Analyse','Bulk-Aktionen','5 Plattformen'], color:'#C0C0C0'},
          ].map(p => (
            <div key={p.name} style={{ background:'#080C14', border:`1px solid ${p.color}30`, borderRadius:12, padding:20 }}>
              <div style={{ fontWeight:800, fontSize:16, color:p.color, marginBottom:4 }}>{p.name}</div>
              <div style={{ fontWeight:900, fontSize:24, marginBottom:2 }}>{p.price}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', marginBottom:14 }}>{p.sub}</div>
              {p.features.map(f => (
                <div key={f} style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
                  <span style={{ color:p.color, fontSize:11 }}>▸</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.55)' }}>{f}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center' }}>
          <Link href="/pricing"
            style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(0,212,255,.6)', textDecoration:'none' }}>
            Alle 6 Pakete · Gold · Platin · Diamant →
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background:'#080C14', borderTop:'1px solid #1A2130', padding:'32px 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:13, height:13, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
              <div style={{ position:'absolute', inset:2.5, background:'#C9A84C' }}/>
            </div>
            <span style={{ fontWeight:800, fontSize:13 }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
          </div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {[['Login','/login'],['Register','/register'],['Pricing','/pricing'],['Workflows','/workflows'],['Setup','/setup'],['Hub','/hub']].map(([l,h]) => (
              <Link key={h} href={h} style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)' }}>
            🔒 DSGVO · 🇩🇪 Server DE · C2PA 2.3 · EU AI Act
          </div>
        </div>
      </div>
    </div>
  );
}
