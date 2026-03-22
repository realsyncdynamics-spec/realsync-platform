'use client';
import Link from 'next/link';

const PRODUCTS = [
  {
    id:'creatorseal',
    icon:'🛡',
    name:'CreatorSeal',
    tagline:'Trust-Score + Promo-Plan',
    color:'#C9A84C',
    href:'/creatorseal',
    badge:'Signature',
    metrics:[{v:'87/100',l:'Ø Trust-Score'},{v:'C2PA 2.3',l:'Standard'},{v:'30s',l:'Scan-Zeit'}],
    features:['C2PA-Verifikation','Deepfake-Erkennung','Blockchain-Timestamp','7-Tage-Promo-Plan via OPTIMUS','Brand-Fitness-Analyse'],
    cta:'Trust-Score prüfen',
    demo:true,
  },
  {
    id:'reviewradar',
    icon:'⭐',
    name:'ReviewRadar',
    tagline:'KI-Review-Management',
    color:'#00D4FF',
    href:'/reviewradar',
    badge:'Beliebt',
    metrics:[{v:'<3 Min',l:'Antwortzeit'},{v:'5',l:'Plattformen'},{v:'89%',l:'Positive Rate'}],
    features:['Google · Trustpilot · App Store','KI-Antworten via OPTIMUS','Sentiment-Analyse','Bulk-Modus (Silber+)','Review-Alerts'],
    cta:'Live Demo starten',
    demo:true,
  },
  {
    id:'churnrescue',
    icon:'💳',
    name:'ChurnRescue',
    tagline:'Payment-Recovery automatisiert',
    color:'#3B82F6',
    href:'/churnrescue',
    badge:'NEU',
    metrics:[{v:'72%',l:'Recovery-Rate'},{v:'4',l:'Auto-Schritte'},{v:'€4.200',l:'Ø/Monat gerettet'}],
    features:['Smart-Retry nach 2h','KI-E-Mail via OPTIMUS','SMS + WhatsApp Sequenz','Stripe-Integration','Churn-Risk-Score'],
    cta:'Demo ausprobieren',
    demo:true,
  },
  {
    id:'dealflow',
    icon:'🎯',
    name:'DealFlow',
    tagline:'Brand-Deal-Matching',
    color:'#10B981',
    href:'/dealflow',
    badge:null,
    metrics:[{v:'6+',l:'DACH-Brands'},{v:'91%',l:'Ø Fit-Score'},{v:'€6.400',l:'Monatl. Potenzial'}],
    features:['KI-Brand-Matching','Trust-Score-basiert','OPTIMUS-Analyse','Deal-Pipeline','Bewerbungs-Tracking'],
    cta:'Brands entdecken',
    demo:false,
  },
  {
    id:'optimus',
    icon:'🤖',
    name:'OPTIMUS',
    tagline:'KI-Agent für alle Apps',
    color:'#8B5CF6',
    href:'/optimus',
    badge:'KI',
    metrics:[{v:'16',l:'Apps verbunden'},{v:'3',l:'Sonar-Modelle'},{v:'⚖️',l:'Model Council'}],
    features:['Perplexity sonar-pro','Model Council (3 Perspektiven)','Spaces für Creator','9 Quick-Actions','Echtzeit-Web-Suche'],
    cta:'OPTIMUS öffnen',
    demo:false,
  },
  {
    id:'adengine',
    icon:'📺',
    name:'AdEngine',
    tagline:'KI-Ads für alle Plattformen',
    color:'#FF6888',
    href:'/apps/adengine/dashboard',
    badge:null,
    metrics:[{v:'7',l:'Plattformen'},{v:'KI',l:'Hook-Generator'},{v:'ROAS',l:'Optimierung'}],
    features:['YouTube · TikTok · Instagram','KI-Hook-Generator','ROAS-Tracking','Multi-Format','Campaign-Manager'],
    cta:'Dashboard öffnen',
    demo:false,
  },
  {
    id:'waitlistkit',
    icon:'🚀',
    name:'WaitlistKit',
    tagline:'Viral Launch Builder',
    color:'#8B5CF6',
    href:'/waitlistkit',
    badge:null,
    metrics:[{v:'3,2x',l:'Viral-Multiplikator'},{v:'47%',l:'Referral-Rate'},{v:'2 Min',l:'Setup'}],
    features:['Viral Referral Loop','Custom Domain','Launch-Sequenz','Analytics Dashboard','E-Mail-Integration'],
    cta:'Waitlist erstellen',
    demo:true,
  },
  {
    id:'contentforge',
    icon:'✍️',
    name:'ContentForge',
    tagline:'KI-Content-Generator',
    color:'#F59E0B',
    href:'/contentforge',
    badge:null,
    metrics:[{v:'6',l:'Formate'},{v:'30s',l:'Generierung'},{v:'DACH',l:'Optimiert'}],
    features:['TikTok Hooks','YouTube Titel','Instagram Captions','X Threads','Video-Skripte'],
    cta:'Content generieren',
    demo:true,
  },
];

export default function ProductsPage() {
  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}.fu{animation:fu .4s ease both}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
          <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
          <span style={{fontWeight:800,fontSize:12,color:'#E4E6EF'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <Link href="/pricing" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',textDecoration:'none',padding:'5px 10px'}}>Pakete ab €19,00</Link>
          <Link href="/register" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 18px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:8,color:'#000',fontWeight:700,textDecoration:'none'}}>
            Kostenlos starten
          </Link>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 24px'}}>

        {/* Header */}
        <div className="fu" style={{textAlign:'center',marginBottom:56}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:14}}>
            // The Creator OS · 16 Apps · 1 Plattform
          </div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5vw,52px)',lineHeight:1.1,marginBottom:14}}>
            Alle Tools die ein Creator<br/>
            <span style={{background:'linear-gradient(90deg,#C9A84C,#00D4FF,#8B5CF6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>wirklich braucht.</span>
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.4)',maxWidth:480,margin:'0 auto',lineHeight:1.8}}>
            Verifizierung · Reviews · Payments · Brands · KI-Agent<br/>
            Alles verbunden. Alles automatisiert. DACH-Markt.
          </p>
        </div>

        {/* Products grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:48}}>
          {PRODUCTS.map((p,i)=>(
            <div key={p.id} className="fu" style={{animationDelay:`${i*.08}s`,background:'#080C14',border:`1px solid ${p.color}20`,borderRadius:18,padding:'24px',position:'relative',overflow:'hidden',transition:'border-color .2s'}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor=p.color+'50')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor=p.color+'20')}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${p.color},transparent)`}}/>
              {p.badge&&<div style={{position:'absolute',top:14,right:14,fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:p.color+'18',border:`1px solid ${p.color}35`,borderRadius:3,color:p.color}}>{p.badge}</div>}

              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <div style={{width:46,height:46,borderRadius:13,background:p.color+'15',border:`1px solid ${p.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{p.icon}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:16}}>{p.name}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',marginTop:1}}>{p.tagline}</div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{display:'flex',gap:8,marginBottom:16}}>
                {p.metrics.map(m=>(
                  <div key={m.l} style={{flex:1,background:'rgba(255,255,255,.03)',borderRadius:8,padding:'7px',textAlign:'center'}}>
                    <div style={{fontWeight:900,fontSize:14,color:p.color}}>{m.v}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:'rgba(255,255,255,.3)',marginTop:1}}>{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div style={{marginBottom:16}}>
                {p.features.slice(0,4).map(f=>(
                  <div key={f} style={{display:'flex',gap:7,alignItems:'center',marginBottom:5}}>
                    <span style={{color:p.color,fontSize:10,flexShrink:0}}>▸</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.55)'}}>{f}</span>
                  </div>
                ))}
              </div>

              <Link href={p.href}
                style={{display:'block',textAlign:'center',padding:'9px 14px',background:p.color+'15',border:`1px solid ${p.color}35`,borderRadius:9,color:p.color,fontFamily:"'DM Mono',monospace",fontSize:10,textDecoration:'none',fontWeight:700,transition:'all .15s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=p.color+'25'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=p.color+'15'}}>
                {p.demo?'▶ '+p.cta:'→ '+p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Pricing strip */}
        <div style={{background:'linear-gradient(135deg,rgba(201,168,76,.06),rgba(0,212,255,.03))',border:'1px solid rgba(201,168,76,.15)',borderRadius:20,padding:'36px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
          <div>
            <div style={{fontWeight:900,fontSize:22,marginBottom:6}}>Alle 16 Apps. Ein Paket.</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.7}}>
              Bronze ab €19,00/Mo · Silber €49,00 · Gold €99,00<br/>
              Platin €199,00 · Diamant €499,00 · Gratis immer verfügbar
            </div>
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <Link href="/pricing" style={{padding:'12px 24px',background:'transparent',border:'1px solid rgba(255,255,255,.2)',borderRadius:11,color:'rgba(255,255,255,.6)',fontFamily:"'DM Mono',monospace",fontSize:11,textDecoration:'none'}}>
              Pakete vergleichen →
            </Link>
            <Link href="/register" style={{padding:'12px 28px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:11,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,textDecoration:'none'}}>
              🚀 Kostenlos starten
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
