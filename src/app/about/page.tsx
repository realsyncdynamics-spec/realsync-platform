'use client';
import Link from 'next/link';

const TIMELINE = [
  { year:'2025 Q2', event:'RealSync Dynamics gegründet · Erste Bubble.io Prototypen' },
  { year:'2025 Q3', event:'CreatorSeal Konzept · C2PA 2.3 Implementierung · Ed25519 Stack' },
  { year:'2025 Q4', event:'Next.js Architektur · Supabase Integration · 16-App-Vision' },
  { year:'2026 Q1', event:'OPTIMUS KI-Agent · Perplexity Integration · Model Council' },
  { year:'2026 Q2', event:'Production Launch · DACH-Go-to-Market · Creator Community' },
];

const TECH = [
  { name:'Next.js 15',        icon:'▲', color:'#000000', desc:'App Router · React Server Components'    },
  { name:'Perplexity AI',     icon:'⬡', color:'#20B2AA', desc:'sonar · sonar-pro · sonar-deep · Council' },
  { name:'Supabase',          icon:'🗄', color:'#3ECF8E', desc:'Auth · PostgreSQL · RLS · Realtime'      },
  { name:'Stripe',            icon:'💳', color:'#635BFF', desc:'Subscriptions · Webhooks · Recovery'      },
  { name:'C2PA 2.3',          icon:'🛡', color:'#C9A84C', desc:'Content Authenticity Standard · Ed25519'  },
  { name:'Polygon',           icon:'⛓', color:'#8B5CF6', desc:'Blockchain · Hash-Anchoring · NFT-Badges'  },
  { name:'Vercel',            icon:'▲', color:'#E4E6EF', desc:'Edge Network · Global CDN · CI/CD'         },
  { name:'Cloudflare',        icon:'🔥', color:'#F38020', desc:'DNS · DDoS Protection · R2 Storage'       },
];

const PRODUCTS_SUMMARY = [
  { n:'CreatorSeal',  desc:'Trust-Score + C2PA + 7-Tage-Promo',    color:'#C9A84C' },
  { n:'ReviewRadar',  desc:'KI-Review-Management · 5 Plattformen',  color:'#00D4FF' },
  { n:'ChurnRescue',  desc:'Payment Recovery · 72% Success Rate',   color:'#3B82F6' },
  { n:'DealFlow',     desc:'Brand-Matching via OPTIMUS',            color:'#10B981' },
  { n:'WaitlistKit',  desc:'Viral Launch Builder · 3,2x Growth',    color:'#8B5CF6' },
  { n:'ContentForge', desc:'KI-Content · 6 Formate · 30s',          color:'#F59E0B' },
  { n:'OPTIMUS',      desc:'Perplexity AI Agent · Model Council',   color:'#8B5CF6' },
  { n:'AdEngine',     desc:'KI-Ads für 7 Plattformen',              color:'#FF6888' },
  { n:'+8 weitere',   desc:'Analytics · MediaVault · TrendRadar…',  color:'#6B7280' },
];

export default function AboutPage() {
  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}.fu{animation:fu .4s ease both}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 40px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:7,textDecoration:'none'}}>
          <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
          <span style={{fontWeight:800,fontSize:13}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <div style={{display:'flex',gap:8}}>
          <Link href="/perplexity" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'5px 12px',color:'#20B2AA',border:'1px solid rgba(32,178,170,.25)',borderRadius:6,textDecoration:'none'}}>⬡ Perplexity Partnership</Link>
          <Link href="/register" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'6px 16px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:7,color:'#000',fontWeight:700,textDecoration:'none'}}>Kostenlos starten</Link>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'56px 40px'}}>

        {/* Hero */}
        <div className="fu" style={{marginBottom:52}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:12}}>// Über RealSync Dynamics</div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,4vw,48px)',lineHeight:1.1,marginBottom:16}}>
            Das Creator OS<br/>
            <span style={{background:'linear-gradient(90deg,#C9A84C,#FFD700)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>für den DACH-Markt.</span>
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'rgba(255,255,255,.55)',lineHeight:1.9,maxWidth:600}}>
            RealSync Dynamics ist eine deutsche SaaS-Plattform für Creator im DACH-Raum. Wir verbinden
            Content-Verifikation, KI-Automatisierung und Revenue-Optimierung in einem einzigen Ökosystem.
            Gegründet 2025 in Neuhaus am Rennweg, Bayern.
          </p>
        </div>

        {/* Mission */}
        <div style={{background:'rgba(201,168,76,.06)',border:'1px solid rgba(201,168,76,.2)',borderRadius:16,padding:'28px',marginBottom:32}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#C9A84C',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:12}}>// Mission</div>
          <p style={{fontSize:16,lineHeight:1.8,color:'rgba(255,255,255,.8)',fontWeight:700}}>
            &ldquo;Jeden Creator im DACH-Markt mit den Tools auszustatten, die bisher nur großen Agenturen zur Verfügung standen — automatisiert, KI-gestützt und zu Creator-freundlichen Preisen.&rdquo;
          </p>
        </div>

        {/* Products */}
        <div style={{marginBottom:44}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16}}>// Produkt-Portfolio · 16 Apps</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {PRODUCTS_SUMMARY.map(p=>(
              <div key={p.n} style={{background:'#080C14',border:`1px solid ${p.color}20`,borderRadius:10,padding:'12px 14px'}}>
                <div style={{fontWeight:700,fontSize:13,color:p.color,marginBottom:3}}>{p.n}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{marginBottom:44}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16}}>// Technology Stack</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
            {TECH.map(t=>(
              <div key={t.name} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:10,padding:'12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
                  <span style={{fontSize:16}}>{t.icon}</span>
                  <span style={{fontWeight:700,fontSize:12,color:t.color==='#000000'?'#E4E6EF':t.color}}>{t.name}</span>
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.35)',lineHeight:1.5}}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{marginBottom:44}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16}}>// Timeline</div>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {TIMELINE.map((t,i)=>(
              <div key={i} style={{display:'flex',gap:20,position:'relative'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:'#C9A84C',border:'2px solid #080C14',flexShrink:0,marginTop:18}}/>
                  {i<TIMELINE.length-1&&<div style={{width:2,flex:1,background:'rgba(201,168,76,.15)',margin:'4px 0'}}/>}
                </div>
                <div style={{paddingBottom:i<TIMELINE.length-1?20:0,paddingTop:14}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#C9A84C',marginBottom:3}}>{t.year}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,.65)',lineHeight:1.5}}>{t.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perplexity Partnership */}
        <div style={{background:'rgba(32,178,170,.06)',border:'1px solid rgba(32,178,170,.2)',borderRadius:16,padding:'24px',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
            <span style={{fontSize:28}}>⬡</span>
            <div>
              <div style={{fontWeight:800,fontSize:16}}>Perplexity AI Partnership</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#20B2AA',marginTop:2}}>API Partner · Technology Partner (angestrebt) · Publishers Program</div>
            </div>
          </div>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.5)',lineHeight:1.7,marginBottom:14}}>
            RealSync Dynamics baut auf der Perplexity Sonar API auf — dem schnellsten, zitierfähigsten KI-Such-System der Welt.
            OPTIMUS nutzt sonar, sonar-pro und sonar-deep-research für Echtzeit-Analysen, 7-Tage-Promo-Pläne und den Model Council.
          </p>
          <Link href="/perplexity" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'7px 16px',background:'rgba(32,178,170,.12)',border:'1px solid rgba(32,178,170,.3)',borderRadius:7,color:'#20B2AA',textDecoration:'none',display:'inline-block'}}>
            Partnership Details →
          </Link>
        </div>

        {/* Contact */}
        <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:14,padding:'22px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:14}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginBottom:4}}>// Kontakt · Investoren · Partnerships</div>
            <div style={{fontWeight:700,fontSize:15}}>RealSync Dynamics</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',marginTop:2}}>Neuhaus am Rennweg · Bayern · Deutschland</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Link href="https://realsyncdynamics.de" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'7px 14px',background:'rgba(255,255,255,.05)',border:'1px solid #1A2130',borderRadius:7,color:'rgba(255,255,255,.4)',textDecoration:'none'}}>
              realsyncdynamics.de
            </Link>
            <Link href="/launch" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'7px 14px',background:'rgba(201,168,76,.1)',border:'1px solid rgba(201,168,76,.25)',borderRadius:7,color:'#C9A84C',textDecoration:'none'}}>
              🚀 Launch →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
