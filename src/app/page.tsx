'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href:'/products',     label:'Produkte' },
  { href:'/creatorseal',  label:'CreatorSeal' },
  { href:'/reviewradar',  label:'ReviewRadar' },
  { href:'/churnrescue',  label:'ChurnRescue' },
  { href:'/optimus',      label:'OPTIMUS' },
  { href:'/pricing',      label:'Preise' },
];

const TICKER_ITEMS = [
  '🛡 C2PA 2.3 verifiziert', '⛓ Blockchain-Timestamp', '🤖 Deepfake-Erkennung 98%',
  '⭐ KI-Reviews in 3 Min', '💳 72% Payment-Recovery', '🎯 Brand-Matching via KI',
  '⬡ Perplexity AI-Agent', '🪙 RealSyncCoins Ökosystem', '🚀 DACH-Creator-Markt',
];

const HERO_STATS = [
  { v:'16',     l:'Apps',            c:'#C9A84C' },
  { v:'4.900+', l:'Creator',         c:'#00D4FF' },
  { v:'€0,00',  l:'Startup-Kosten',  c:'#10B981' },
  { v:'⬡',      l:'Perplexity AI',   c:'#8B5CF6' },
];

const PRODUCTS = [
  { icon:'🛡', name:'CreatorSeal',  color:'#C9A84C', desc:'Trust-Score + C2PA + 7-Tage-Promo',    href:'/creatorseal',  badge:'Signature' },
  { icon:'⭐', name:'ReviewRadar',  color:'#00D4FF', desc:'KI-Antworten auf alle Reviews',         href:'/reviewradar',  badge:'Live Demo' },
  { icon:'💳', name:'ChurnRescue',  color:'#3B82F6', desc:'72% Failed Payments gerettet',          href:'/churnrescue',  badge:'NEU'       },
  { icon:'🎯', name:'DealFlow',     color:'#10B981', desc:'Brand-Matching via OPTIMUS',            href:'/dealflow',     badge:null        },
  { icon:'🚀', name:'WaitlistKit',  color:'#8B5CF6', desc:'Viral Launch Builder · 3,2x Growth',   href:'/waitlistkit',  badge:null        },
  { icon:'✍️', name:'ContentForge', color:'#F59E0B', desc:'KI-Content · 6 Formate · 30 Sekunden', href:'/contentforge', badge:null        },
  { icon:'📡', name:'TrendRadar',   color:'#EF4444', desc:'Virale Trends vor allen anderen',       href:'/apps/trendradar/dashboard',  badge:null },
  { icon:'📊', name:'AnalyticsPro', color:'#06B6D4', desc:'Cross-Platform Analytics',             href:'/apps/analyticspr/dashboard', badge:null },
  { icon:'🤖', name:'OPTIMUS',      color:'#8B5CF6', desc:'KI-Agent · Perplexity · Model Council',href:'/optimus',      badge:'KI'        },
];

const JOURNEY = [
  { n:'01', icon:'🔍', title:'Trust-Score',    desc:'Handle eingeben → C2PA + Deepfake + Brand in 30s',   color:'#C9A84C' },
  { n:'02', icon:'📊', title:'Report',          desc:'Vollständiger Bericht mit Quick-Wins und Score',      color:'#00D4FF' },
  { n:'03', icon:'🚀', title:'7-Tage-Plan',    desc:'OPTIMUS generiert Promo-Plan mit Perplexity-Trends',  color:'#8B5CF6' },
  { n:'04', icon:'🎯', title:'Brand Deals',    desc:'DealFlow matched dich mit passenden Brands',           color:'#10B981' },
  { n:'05', icon:'🪙', title:'+Coins',          desc:'Jeder Referral = 50% als Coins zurück',               color:'#F59E0B' },
  { n:'06', icon:'♾️', title:'Creator OS',     desc:'16 Apps. Eine Plattform. Dein Creator-Leben optimiert',color:'#EC4899' },
];

const PRICING_PREVIEW = [
  { name:'Gratis',  price:'€0,00',   sub:'für immer',    features:['Creator-Profil','QR-Code','Basis-Badge'],      color:'#6B7280', cta:'/register'          },
  { name:'Bronze',  price:'€19,00',  sub:'/Monat',       features:['Alle 16 Apps','50 KI-Anfragen','3 Plattformen'], color:'#CD7F32', cta:'/register?plan=bronze', hot:true },
  { name:'Silber',  price:'€49,00',  sub:'/Monat',       features:['Blockchain','Bulk-Modus','5 Plattformen'],       color:'#C0C0C0', cta:'/register?plan=silber'  },
];

const SOCIAL_PROOF = [
  { handle:'@max_creator',  niche:'Tech',     score:94, platform:'YouTube', flag:'🇩🇪' },
  { handle:'@lisa_style',   niche:'Fashion',  score:78, platform:'TikTok',  flag:'🇦🇹' },
  { handle:'@tom_eats',     niche:'Food',     score:86, platform:'IG',      flag:'🇨🇭' },
  { handle:'@anna_startup', niche:'Business', score:91, platform:'LinkedIn',flag:'🇩🇪' },
];

export default function HomePage() {
  const [tickerPos, setTickerPos] = useState(0);
  const [heroTab, setHeroTab] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroTab(n => (n+1) % SOCIAL_PROOF.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif",overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(500%)}}
        .fu{animation:fu .6s cubic-bezier(.34,1.56,.64,1) both}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.35s}
        .ticker-track{display:flex;animation:ticker 28s linear infinite;width:max-content}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1A2130}
        a{text-decoration:none}
      `}</style>

      {/* Ticker */}
      <div style={{height:28,background:'rgba(201,168,76,.06)',borderBottom:'1px solid rgba(201,168,76,.12)',overflow:'hidden',display:'flex',alignItems:'center'}}>
        <div className="ticker-track">
          {[0,1].map(r=>TICKER_ITEMS.map((item,i)=>(
            <span key={`${r}-${i}`} style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',padding:'0 24px',whiteSpace:'nowrap',letterSpacing:'.06em'}}>
              {item} <span style={{color:'rgba(201,168,76,.3)'}}>·</span>
            </span>
          )))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:54,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 40px',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(20px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:14,height:14,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative',flexShrink:0}}>
            <div style={{position:'absolute',inset:2.5,background:'#C9A84C'}}/>
          </div>
          <span style={{fontWeight:900,fontSize:14,letterSpacing:'-.01em'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <div style={{display:'flex',gap:4,alignItems:'center'}}>
          {NAV_LINKS.map(l=>(
            <Link key={l.href} href={l.href} style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'5px 12px',color:'rgba(255,255,255,.45)',borderRadius:6,transition:'color .15s'}}
              onMouseEnter={e=>(e.currentTarget.style.color='white')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.45)')}>
              {l.label}
            </Link>
          ))}
          <div style={{width:1,height:18,background:'#1A2130',margin:'0 6px'}}/>
          <Link href="/login" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'6px 14px',border:'1px solid #1A2130',borderRadius:7,color:'rgba(255,255,255,.5)'}}>Login</Link>
          <Link href="/register" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 18px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:8,color:'#000',fontWeight:700,marginLeft:4}}>
            Kostenlos starten
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'80px 40px 60px',display:'grid',gridTemplateColumns:'1fr 420px',gap:60,alignItems:'center'}}>
        <div>
          <div className="fu" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#C9A84C',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:18,display:'flex',alignItems:'center',gap:8}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'#C9A84C',display:'inline-block',animation:'glow 2s ease infinite'}}/>
            Das Creator OS für DACH
          </div>
          <h1 className="fu d1" style={{fontSize:'clamp(36px,5vw,64px)',fontWeight:900,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:22}}>
            Dein Content.<br/>
            <span style={{background:'linear-gradient(90deg,#C9A84C 0%,#FFD700 40%,#00D4FF 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              Verifiziert. Optimiert.<br/>Monetarisiert.
            </span>
          </h1>
          <p className="fu d2" style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.9,marginBottom:28,maxWidth:480}}>
            16 KI-gestützte Tools in einer Plattform. Trust-Score, Review-Management,
            Payment-Recovery, Brand Deals und OPTIMUS — der KI-Agent powered by Perplexity AI.
            <br/><span style={{color:'#C9A84C'}}>Für Creator im DACH-Markt. Ab €0,00/Monat.</span>
          </p>
          <div className="fu d3" style={{display:'flex',gap:10,marginBottom:28,flexWrap:'wrap'}}>
            <Link href="/creatorseal" style={{padding:'13px 28px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:12,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,boxShadow:'0 4px 30px rgba(201,168,76,.35)'}}>
              🛡 Trust-Score prüfen
            </Link>
            <Link href="/products" style={{padding:'13px 22px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,color:'rgba(255,255,255,.7)',fontFamily:"'DM Mono',monospace",fontSize:12}}>
              Alle 16 Apps →
            </Link>
          </div>
          {/* Stats */}
          <div className="fu d3" style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            {HERO_STATS.map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,padding:'10px 16px',textAlign:'center'}}>
                <div style={{fontWeight:900,fontSize:18,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Creator Card */}
        <div style={{position:'relative'}}>
          <div style={{position:'absolute',inset:-30,background:'radial-gradient(ellipse,rgba(201,168,76,.07),transparent 70%)',pointerEvents:'none'}}/>
          <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.3)',borderRadius:20,padding:'26px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#C9A84C,#FFD700,#00D4FF)'}}/>
            <div style={{position:'absolute',top:0,bottom:0,width:2,background:'linear-gradient(180deg,transparent,rgba(0,212,255,.3),transparent)',left:'50%',animation:'scan 2s ease-in-out infinite',pointerEvents:'none'}}/>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:16}}>
              ● LIVE · DACH Creator Scores
            </div>
            {/* Rotating creator */}
            <div style={{marginBottom:18}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:3}}>{SOCIAL_PROOF[heroTab].flag} {SOCIAL_PROOF[heroTab].handle} · {SOCIAL_PROOF[heroTab].niche}</div>
                  <div style={{fontWeight:900,fontSize:52,color:'#C9A84C',lineHeight:1}}>{SOCIAL_PROOF[heroTab].score}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginTop:2}}>Trust-Score · {SOCIAL_PROOF[heroTab].platform}</div>
                </div>
                <div style={{width:52,height:52,borderRadius:14,background:'rgba(201,168,76,.15)',border:'1px solid rgba(201,168,76,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>🛡</div>
              </div>
              {/* Factor bars */}
              {[
                {l:'C2PA 2.3',score:SOCIAL_PROOF[heroTab].score+3,c:'#10B981'},
                {l:'Blockchain',score:SOCIAL_PROOF[heroTab].score-2,c:'#8B5CF6'},
                {l:'Deepfake-Scan',score:97,c:'#00D4FF'},
                {l:'Engagement',score:SOCIAL_PROOF[heroTab].score-12,c:'#F59E0B'},
              ].map(f=>(
                <div key={f.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.4)',width:90,flexShrink:0}}>{f.l}</span>
                  <div style={{flex:1,height:4,background:'#1A2130',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',background:`linear-gradient(90deg,${f.c}60,${f.c})`,width:`${Math.min(f.score,100)}%`,borderRadius:2,transition:'width 1s ease'}}/>
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:f.c,minWidth:22,textAlign:'right'}}>{Math.min(f.score,100)}</span>
                </div>
              ))}
            </div>
            {/* Dots indicator */}
            <div style={{display:'flex',gap:5,justifyContent:'center',marginBottom:16}}>
              {SOCIAL_PROOF.map((_,i)=><div key={i} style={{width:i===heroTab?16:5,height:5,borderRadius:3,background:i===heroTab?'#C9A84C':'rgba(255,255,255,.15)',transition:'all .3s'}}/>)}
            </div>
            <Link href="/creatorseal" style={{display:'block',textAlign:'center',padding:'11px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:10,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13}}>
              🔍 Meinen Score jetzt prüfen
            </Link>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div style={{background:'#080C14',borderTop:'1px solid #1A2130',borderBottom:'1px solid #1A2130',padding:'60px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:44}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:10}}>// The Creator OS · 16 Apps · 1 Login</div>
            <h2 style={{fontWeight:900,fontSize:32,marginBottom:10}}>Alles was du als Creator brauchst.</h2>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.35)'}}>Jede App standalone stark — zusammen unschlagbar.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {PRODUCTS.map((p,i)=>(
              <Link key={p.name} href={p.href}
                style={{background:'#0B0F18',border:`1px solid ${p.color}18`,borderRadius:14,padding:'18px',display:'flex',gap:12,alignItems:'flex-start',position:'relative',overflow:'hidden',transition:'all .15s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color+'45';e.currentTarget.style.background='#0F1420'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=p.color+'18';e.currentTarget.style.background='#0B0F18'}}>
                {p.badge&&<div style={{position:'absolute',top:10,right:10,fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:p.color+'18',border:`1px solid ${p.color}35`,borderRadius:3,color:p.color}}>{p.badge}</div>}
                <div style={{width:38,height:38,borderRadius:10,background:p.color+'14',border:`1px solid ${p.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{p.icon}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:14,marginBottom:3,color:'#E4E6EF'}}>{p.name}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>{p.desc}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:20}}>
            <Link href="/products" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'8px 20px',background:'rgba(255,255,255,.04)',border:'1px solid #1A2130',borderRadius:8,color:'rgba(255,255,255,.4)'}}>
              Alle 16 Apps ansehen →
            </Link>
          </div>
        </div>
      </div>

      {/* JOURNEY */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 40px'}}>
        <div style={{textAlign:'center',marginBottom:44}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:10}}>// Hero Journey</div>
          <h2 style={{fontWeight:900,fontSize:30}}>Von 0 auf Creator OS — in 6 Schritten.</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}}>
          {JOURNEY.map((j,i)=>(
            <div key={j.n} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:12,padding:'16px 12px',textAlign:'center',position:'relative'}}>
              {i<5&&<div style={{position:'absolute',top:'38%',right:-5,width:10,height:2,background:'linear-gradient(90deg,rgba(255,255,255,.1),transparent)'}}/>}
              <div style={{width:36,height:36,borderRadius:'50%',border:`2px solid ${j.color}40`,background:j.color+'12',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,margin:'0 auto 8px'}}>{j.icon}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:j.color,marginBottom:5}}>SCHRITT {j.n}</div>
              <div style={{fontWeight:800,fontSize:12,marginBottom:5}}>{j.title}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.35)',lineHeight:1.5}}>{j.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING PREVIEW */}
      <div style={{background:'#080C14',borderTop:'1px solid #1A2130',padding:'60px 40px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:10}}>// Preise</div>
            <h2 style={{fontWeight:900,fontSize:30,marginBottom:8}}>Einfach. Transparent. Creator-freundlich.</h2>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.35)'}}>Alle Pakete inklusive 16 Apps · Monatlich kündbar · Keine versteckten Kosten</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {PRICING_PREVIEW.map(p=>(
              <div key={p.name} style={{background:'#0B0F18',border:`1px solid ${p.hot?'rgba(201,168,76,.4)':'#1A2130'}`,borderRadius:16,padding:'24px',position:'relative',overflow:'hidden'}}>
                {p.hot&&<div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#C9A84C,#FFD700)'}}/>}
                {p.hot&&<div style={{position:'absolute',top:12,right:14,fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:'rgba(201,168,76,.15)',border:'1px solid rgba(201,168,76,.3)',borderRadius:3,color:'#C9A84C'}}>EMPFOHLEN</div>}
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:p.color,letterSpacing:'.15em',textTransform:'uppercase',marginBottom:8}}>{p.name}</div>
                <div style={{fontWeight:900,fontSize:32,color:p.hot?'#C9A84C':'#E4E6EF',marginBottom:2}}>{p.price}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:18}}>{p.sub}</div>
                {p.features.map(f=>(
                  <div key={f} style={{display:'flex',gap:8,fontSize:12,color:'rgba(255,255,255,.6)',marginBottom:6}}>
                    <span style={{color:p.color,flexShrink:0}}>▸</span><span>{f}</span>
                  </div>
                ))}
                <Link href={p.cta} style={{display:'block',marginTop:18,textAlign:'center',padding:'10px',background:p.hot?'linear-gradient(135deg,#C9A84C,#FFD700)':'rgba(255,255,255,.06)',border:p.hot?'none':'1px solid #1A2130',borderRadius:9,color:p.hot?'#000':'rgba(255,255,255,.5)',fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:p.hot?700:400}}>
                  {p.name==='Gratis'?'Kostenlos starten':'Jetzt starten'}
                </Link>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:18}}>
            <Link href="/pricing" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)'}}>Alle 6 Pakete vergleichen →</Link>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{padding:'80px 40px',textAlign:'center',background:'linear-gradient(180deg,#080C14,#03050A)',borderTop:'1px solid #1A2130'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{fontSize:48,marginBottom:16}}>🛡</div>
          <h2 style={{fontWeight:900,fontSize:'clamp(26px,4vw,44px)',lineHeight:1.15,marginBottom:14}}>
            Dein Creator OS wartet.
          </h2>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:30,lineHeight:1.8}}>
            16 Apps. 1 Plattform. Kostenlos starten.<br/>
            DACH-Markt · C2PA 2.3 · Perplexity AI · DSGVO
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'14px 36px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:14,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:15,boxShadow:'0 4px 40px rgba(201,168,76,.4)'}}>
              🚀 Kostenlos starten
            </Link>
            <Link href="/creatorseal" style={{padding:'14px 26px',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.15)',borderRadius:14,color:'rgba(255,255,255,.6)',fontFamily:"'DM Mono',monospace",fontSize:12}}>
              🔍 Trust-Score prüfen →
            </Link>
          </div>
          <div style={{marginTop:16,fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.15)'}}>
            🔒 DSGVO · Kein Kreditkarte nötig · Server 🇩🇪 · C2PA 2.3 · SOC2 (Enterprise)
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:'#030509',borderTop:'1px solid #0F1520',padding:'24px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:11,height:11,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
            <span style={{fontWeight:800,fontSize:12}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.2)',marginLeft:8}}>© 2026 · Neuhaus am Rennweg · Deutschland</span>
          </div>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            {['/products','Products'],['/pricing','Preise'],['/about','Über uns'],['/perplexity','⬡ Perplexity'],['/setup','Setup'],['/launch','Launch'].map(([href,label])=>(
              <Link key={href} href={href} style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)'}}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
