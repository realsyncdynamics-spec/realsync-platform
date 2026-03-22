'use client';
import { useState } from 'react';
import Link from 'next/link';

const COIN_BALANCE = 3750; // Demo balance — in prod from /api/coins

const CATEGORIES = ['Alle', 'Pakete', 'Merch', 'Digital', 'Service', 'Premium'];

const PRODUCTS = [
  // Pakete
  { id:'bronze-plan',  cat:'Pakete',  icon:'🥉', name:'Bronze Paket',        sub:'1 Monat · alle Tools',     coins:1900,  euros:19,  badge:null,       popular:true,  desc:'50 KI-Antworten · 3 Plattformen · Workflows · Bronze Badge' },
  { id:'silber-plan',  cat:'Pakete',  icon:'🥈', name:'Silber Paket',        sub:'1 Monat',                  coins:4900,  euros:49,  badge:'BELIEBT',   popular:true,  desc:'Bulk-Aktionen · KI-Analyse · 5 Plattformen · Blockchain' },
  { id:'gold-plan',    cat:'Pakete',  icon:'🥇', name:'Gold Paket',          sub:'1 Monat',                  coins:9900,  euros:99,  badge:null,       popular:false, desc:'Automation · C2PA · Launch-Tools · Priority Support' },
  { id:'platin-plan',  cat:'Pakete',  icon:'💎', name:'Platin Paket',        sub:'1 Monat',                  coins:19900, euros:199, badge:null,       popular:false, desc:'White-Label · API-Zugang · Dedicated Manager' },
  // Merch
  { id:'tshirt',       cat:'Merch',   icon:'👕', name:'Creator T-Shirt',     sub:'Unisex · S–XXL',           coins:2500,  euros:25,  badge:null,       popular:false, desc:'100% Bio-Baumwolle · RealSync Logo Stick · Luxury Cyberpunk Design' },
  { id:'hoodie',       cat:'Merch',   icon:'🧥', name:'Creator Hoodie',      sub:'Premium Qualität',         coins:4500,  euros:45,  badge:null,       popular:false, desc:'Heavyweight · Embroidered Logo · Lux Fit' },
  { id:'cap',          cat:'Merch',   icon:'🧢', name:'Creator Cap',         sub:'Snapback · One size',      coins:1500,  euros:15,  badge:null,       popular:false, desc:'Embroidered RealSync Logo · Adjustable' },
  { id:'sticker-pack', cat:'Merch',   icon:'✨', name:'Sticker Pack',        sub:'10er Set',                 coins:500,   euros:5,   badge:'NEU',      popular:false, desc:'Holographic Creator Stickers · Wasserfest' },
  // Digital
  { id:'masterclass',  cat:'Digital', icon:'🎓', name:'Creator Masterclass',  sub:'12 Video-Module',         coins:5000,  euros:50,  badge:'TOP',      popular:true,  desc:'QR Marketing · Referral Strategie · Creator Monetarisierung' },
  { id:'template-pack',cat:'Digital', icon:'📐', name:'Template Bundle',     sub:'50+ Vorlagen',             coins:2000,  euros:20,  badge:null,       popular:false, desc:'Canva · Figma · Social Media Templates für Creator' },
  { id:'qr-print',     cat:'Digital', icon:'🖨', name:'QR Print Kit',        sub:'Druckfertige Dateien',     coins:800,   euros:8,   badge:null,       popular:false, desc:'Visitenkarte · Flyer · Poster · A3/A4 QR Codes' },
  // Service
  { id:'setup-1on1',   cat:'Service', icon:'🔧', name:'Setup Service 1:1',   sub:'60 Min · Remote',          coins:10000, euros:100, badge:null,       popular:false, desc:'Komplettes Onboarding mit RealSync Team · Supabase + Stripe' },
  { id:'brand-audit',  cat:'Service', icon:'🎯', name:'Brand Audit',         sub:'Schriftliche Analyse',     coins:7500,  euros:75,  badge:null,       popular:false, desc:'Creator Brand Review · Positionierung · DACH-Markt Analyse' },
  // Premium
  { id:'nft-badge',    cat:'Premium', icon:'🏆', name:'NFT Creator Badge',   sub:'Polygon · Einmalig',       coins:25000, euros:250, badge:'EXKLUSIV', popular:false, desc:'On-Chain verifizierbarer Creator Status · Nicht übertragbar' },
  { id:'priority-feat',cat:'Premium', icon:'⚡', name:'Priority Feature',    sub:'Dein Wunsch wird gebaut',  coins:50000, euros:500, badge:'RARE',     popular:false, desc:'1 Feature deiner Wahl wird in den nächsten 30 Tagen entwickelt' },
];

export default function StorePage() {
  const [cat, setCat] = useState('Alle');
  const [cart, setCart] = useState<string[]>([]);
  const [redeeming, setRedeeming] = useState<string|null>(null);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = cat === 'Alle' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  const cartItems = PRODUCTS.filter(p => cart.includes(p.id));
  const cartTotal = cartItems.reduce((s,p) => s+p.coins, 0);
  const canAfford = (coins: number) => COIN_BALANCE >= coins;

  function redeem(id: string, coins: number) {
    if (!canAfford(coins)) return;
    setRedeeming(id);
    setTimeout(() => {
      setRedeemed(r => [...r, id]);
      setRedeeming(null);
    }, 1600);
  }

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{fontFamily:"'Syne',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .fu{animation:fadeUp .35s ease both}
        .card:hover{transform:translateY(-2px);transition:all .2s}
      `}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',padding:'0 20px',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Hub</Link>
          <span style={{color:'#1A2130'}}>|</span>
          <span style={{fontWeight:800,fontSize:14,color:'#C9A84C'}}>🛍 RealSync Store</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {/* Coin Balance */}
          <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(201,168,76,.1)',border:'1px solid rgba(201,168,76,.3)',borderRadius:20,padding:'5px 12px'}}>
            <span style={{fontSize:14}}>🪙</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:'#C9A84C'}}>{COIN_BALANCE.toLocaleString('de')}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(201,168,76,.5)'}}>Coins</span>
          </div>
          <Link href="/coins" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',textDecoration:'none',padding:'5px 10px',border:'1px solid #1A2130',borderRadius:8}}>
            Verdienen →
          </Link>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'32px 20px'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#C9A84C',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:10}}>// Coins einlösen</div>
          <h1 style={{fontWeight:900,fontSize:28,marginBottom:8}}>RealSync Store</h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.35)'}}>
            Du hast <span style={{color:'#C9A84C',fontWeight:700}}>{COIN_BALANCE.toLocaleString('de')} Coins</span> · €{(COIN_BALANCE/100).toFixed(2).replace('.', ',')} Guthaben
          </p>
        </div>

        {/* How to earn */}
        <div style={{background:'rgba(201,168,76,.05)',border:'1px solid rgba(201,168,76,.15)',borderRadius:14,padding:'16px 20px',marginBottom:28,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
          <span style={{fontSize:24,flexShrink:0}}>💡</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>Mehr Coins verdienen?</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)'}}>
              Teile deinen B2B-QR-Code → Jemand kauft ein Paket → Du bekommst 50% als Coins
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Link href="/join/rs-dominik" style={{padding:'7px 14px',background:'rgba(201,168,76,.15)',border:'1px solid rgba(201,168,76,.35)',borderRadius:8,color:'#C9A84C',fontFamily:"'DM Mono',monospace",fontSize:10,textDecoration:'none'}}>Mein QR →</Link>
            <Link href="/coins" style={{padding:'7px 14px',background:'transparent',border:'1px solid #1A2130',borderRadius:8,color:'rgba(255,255,255,.4)',fontFamily:"'DM Mono',monospace",fontSize:10,textDecoration:'none'}}>Verlauf</Link>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 16px',borderRadius:20,border:`1px solid ${cat===c?'rgba(201,168,76,.5)':'#1A2130'}`,background:cat===c?'rgba(201,168,76,.12)':'transparent',color:cat===c?'#C9A84C':'rgba(255,255,255,.4)',cursor:'pointer',transition:'all .15s'}}>
              {c}
            </button>
          ))}
          <span style={{marginLeft:'auto',fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.25)',alignSelf:'center'}}>
            {filtered.length} Artikel
          </span>
        </div>

        {/* Products Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}}>
          {filtered.map(p => {
            const affordable = canAfford(p.coins);
            const done = redeemed.includes(p.id);
            const loading = redeeming === p.id;
            return (
              <div key={p.id} className="card"
                style={{background:'#080C14',border:`1px solid ${done?'rgba(16,185,129,.3)':'#1A2130'}`,borderRadius:14,padding:18,display:'flex',flexDirection:'column',gap:10,position:'relative',overflow:'hidden',opacity:affordable||done?1:.7}}>

                {p.badge && (
                  <div style={{position:'absolute',top:10,right:10,fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:p.badge==='BELIEBT'?'rgba(0,212,255,.2)':p.badge==='TOP'?'rgba(201,168,76,.2)':p.badge==='NEU'?'rgba(16,185,129,.2)':'rgba(139,92,246,.2)',border:`1px solid ${p.badge==='BELIEBT'?'rgba(0,212,255,.4)':p.badge==='TOP'?'rgba(201,168,76,.4)':p.badge==='NEU'?'rgba(16,185,129,.4)':'rgba(139,92,246,.4)'}`,color:p.badge==='BELIEBT'?'#00D4FF':p.badge==='TOP'?'#C9A84C':p.badge==='NEU'?'#10B981':'#A855F7',borderRadius:4}}>
                    {p.badge}
                  </div>
                )}

                <div style={{fontSize:28}}>{p.icon}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:14}}>{p.name}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.35)',marginTop:2}}>{p.sub}</div>
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.45)',lineHeight:1.5,flex:1}}>{p.desc}</div>

                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:4}}>
                  <div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:'#C9A84C'}}>🪙 {p.coins.toLocaleString('de')}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)'}}>€{p.euros.toFixed(2).replace('.', ',')}</div>
                  </div>
                  {done ? (
                    <div style={{padding:'7px 14px',background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.3)',borderRadius:8,color:'#10B981',fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700}}>
                      ✓ Eingelöst
                    </div>
                  ) : (
                    <button onClick={() => redeem(p.id, p.coins)} disabled={!affordable||loading}
                      style={{padding:'7px 16px',background:affordable?'linear-gradient(135deg,#C9A84C,#FFD700)':'#1A2130',border:'none',borderRadius:8,color:affordable?'#000':'rgba(255,255,255,.2)',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,cursor:affordable?'pointer':'not-allowed',transition:'all .15s'}}>
                      {loading?'⟳ ...':`Einlösen`}
                    </button>
                  )}
                </div>

                {!affordable && !done && (
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(239,68,68,.6)',textAlign:'center'}}>
                    Noch {(p.coins-COIN_BALANCE).toLocaleString('de')} Coins fehlen
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{marginTop:48,background:'linear-gradient(135deg,rgba(201,168,76,.08),rgba(0,212,255,.05))',border:'1px solid rgba(201,168,76,.2)',borderRadius:16,padding:'28px',textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:12}}>📱</div>
          <h3 style={{fontWeight:800,fontSize:18,marginBottom:6}}>RealSync Store App — Coming Soon</h3>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:16}}>
            Native iOS + Android · Push-Benachrichtigungen · Coins Live-Tracking
          </p>
          <Link href="/apps/waitlistkit/dashboard"
            style={{padding:'10px 24px',background:'#C9A84C',borderRadius:10,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,textDecoration:'none',display:'inline-block'}}>
            🚀 Waitlist beitreten
          </Link>
        </div>
      </div>
    </div>
  );
}
