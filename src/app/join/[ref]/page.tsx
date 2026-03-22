'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── QR Generator ─────────────────────────────────────────
function QRCanvas({ value, size=140, color='#000' }: { value:string; size?:number; color?:string }) {
  const cells=21, cs=Math.floor(size/cells);
  const h = value.split('').reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0, 5381);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:'block'}}>
      <rect width={size} height={size} fill="white" rx="4"/>
      {Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
        const fp=(r<7&&c<7)||(r<7&&c>=cells-7)||(r>=cells-7&&c<7);
        const on=fp||((h^(r*31+c*17))&1)===1;
        return on?<rect key={`${r}${c}`} x={c*cs} y={r*cs} width={cs} height={cs} fill={color}/>:null;
      }))}
    </svg>
  );
}

// ── Barcode ───────────────────────────────────────────────
function Barcode({ value, w=260, h=50 }: { value:string; w?:number; h?:number }) {
  let x=6;
  const bars: React.ReactNode[] = [];
  for(let i=0;i<Math.min(value.length,28);i++){
    const bw=(value.charCodeAt(i)%3+1)*2.2, gap=i%4===0?3:1.5;
    bars.push(<rect key={i} x={x} y={4} width={bw} height={h-16} fill="#111"/>);
    x+=bw+gap;
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect width={w} height={h} fill="white" rx="4"/>
      {bars}
      <text x={w/2} y={h-1} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#444">{value}</text>
    </svg>
  );
}

// ── FAKE CREATOR DATA (in prod: fetch from Supabase by ref) ──
function getCreatorByRef(ref: string) {
  const demos: Record<string, any> = {
    'rs-dominik': { name:'Dominik Steiner', username:'dominik_steiner', avatar:'🎬', plan:'gold', platforms:['YouTube','TikTok','Instagram'], followers:'61.4K', niche:'Tech & Startup', code:'RS-2026-D5T8K1' },
    'default':    { name:'RealSync Creator', username:'creator', avatar:'🌟', plan:'bronze', platforms:['YouTube','TikTok'], followers:'12K', niche:'Creator', code:'RS-2026-DEFAULT' },
  };
  return demos[ref] || demos.default;
}

// ── FEATURES (shown but blurred if not logged in) ─────────
const FEATURES = [
  { icon:'🛡', title:'Creator Verifikation', desc:'C2PA 2.3, Blockchain Zeitstempel, Deepfake Detection', locked:true },
  { icon:'⭐', title:'Review Manager', desc:'KI-Antworten auf Google, Trustpilot, Yelp in 3 Sek.', locked:true },
  { icon:'💳', title:'Payment Recovery', desc:'Failed Payments automatisch retten — 72% Erfolgsrate', locked:true },
  { icon:'🚀', title:'Viral Waitlist', desc:'Referral-System, Launch Sequence, Milestone Rewards', locked:true },
  { icon:'📱', title:'Social Hub', desc:'YouTube, TikTok, Instagram, Facebook, X auf einmal', locked:true },
  { icon:'💰', title:'RealSyncCoins', desc:'50% Provision für jeden den du einlädst', locked:true },
  { icon:'📱', title:'Dein QR-Code', desc:'Persönlicher Barcode für alle deine Kanäle', locked:false },
  { icon:'🌐', title:'Creator-Seite', desc:'Eigene URL: realsyncdynamics.de/creator/du', locked:false },
];

const SOCIAL_PROVIDERS = [
  { id:'google',    name:'Google / YouTube', icon:<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, color:'#4285F4', bg:'#EBF1FF' },
  { id:'facebook',  name:'Facebook',        icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, color:'#1877F2', bg:'#E7F0FF' },
  { id:'tiktok',    name:'TikTok',          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>, color:'#000', bg:'#F0F0F0' },
  { id:'x',         name:'X / Twitter',     icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, color:'#000', bg:'#111' },
  { id:'instagram', name:'Instagram',       icon:<svg width="18" height="18" viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="107%"><stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, color:'#E1306C', bg:'#FFF0F5' },
];

export default function JoinPage({ params }: { params: Promise<{ ref: string }> }) {
  const router = useRouter();
  const { ref } = use(params);
  const creator = getCreatorByRef(ref);
  const [step, setStep] = useState<'landing'|'connecting'|'connected'|'done'>('landing');
  const [chosenProvider, setChosenProvider] = useState<string|null>(null);
  const [newUser, setNewUser] = useState({ name:'', username:'', code:'' });
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [referralBonus, setReferralBonus] = useState(false);

  // Detect referral from URL
  useEffect(() => {
    if(ref && ref !== 'default') setReferralBonus(true);
  }, [ref]);

  function handleSocialLogin(provider: string) {
    setChosenProvider(provider);
    setStep('connecting');
    // Simulate OAuth flow
    setTimeout(() => {
      const username = `creator_${Math.random().toString(36).slice(2,7)}`;
      setNewUser({
        name: provider === 'google' ? 'Max Müller' : provider === 'facebook' ? 'Sophie Weber' : 'Creator User',
        username,
        code: `RS-2026-${username.toUpperCase().slice(8,14)}`,
      });
      setConnectedPlatforms([provider]);
      setStep('connected');
    }, 1800);
  }

  function finishSetup() {
    setStep('done');
    setTimeout(() => router.push('/hub'), 2500);
  }

  const myLink = `realsyncdynamics.de/creator/${newUser.username}`;
  const b2bLink = `realsyncdynamics.de/join/${newUser.username}`;

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{ fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes coinDrop{0%{transform:translateY(-20px) scale(0.5);opacity:0}60%{transform:translateY(4px) scale(1.1)}100%{transform:translateY(0) scale(1);opacity:1}}
        .fu{animation:fadeUp .45s cubic-bezier(.34,1.56,.64,1) both}
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
        .social-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)!important}
        .feature-locked{filter:blur(3px);pointer-events:none;user-select:none}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background:'rgba(3,5,10,.97)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <div style={{ width:13, height:13, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
            <div style={{ position:'absolute', inset:2.5, background:'#C9A84C' }}/>
          </div>
          <span style={{ fontWeight:800, fontSize:13, color:'#E4E6EF' }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
        </Link>
        {referralBonus && (
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, padding:'4px 12px', background:'rgba(16,185,129,.15)', border:'1px solid rgba(16,185,129,.3)', borderRadius:20, color:'#10B981' }}>
            🎁 1 Monat Bronze GRATIS via {creator.name}
          </div>
        )}
      </div>

      {/* ══════════ STEP: LANDING ══════════ */}
      {step === 'landing' && (
        <div style={{ maxWidth:960, margin:'0 auto', padding:'40px 20px' }}>

          {/* Referral Banner */}
          {referralBonus && (
            <div className="fu" style={{ background:'linear-gradient(135deg, rgba(16,185,129,.12), rgba(0,212,255,.08))', border:'1px solid rgba(16,185,129,.3)', borderRadius:16, padding:'16px 24px', marginBottom:28, display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:32 }}>🎁</span>
              <div>
                <div style={{ fontWeight:800, fontSize:16, color:'#10B981' }}>Du wurdest eingeladen von {creator.name}!</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>
                  Meld dich an → bekomme <strong style={{ color:'#10B981' }}>1 Monat Bronze GRATIS</strong> (Wert: €19) · Kein Kreditkarte nötig
                </div>
              </div>
              <div style={{ marginLeft:'auto', fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)' }}>
                via <span style={{ color:'#C9A84C' }}>@{creator.username}</span>
              </div>
            </div>
          )}

          {/* Hero */}
          <div className="fu d1" style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>{creator.avatar}</div>
            <h1 style={{ fontWeight:800, fontSize:30, lineHeight:1.2, marginBottom:8 }}>
              <span style={{ color:'rgba(255,255,255,.5)' }}>Entdeckt von</span><br/>
              <span style={{ color:'#C9A84C' }}>{creator.name}</span>
            </h1>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:'rgba(255,255,255,.35)', marginBottom:24 }}>
              {creator.niche} · {creator.followers} Follower · Verifizierter Creator
            </p>
            <div style={{ fontWeight:800, fontSize:22, marginBottom:8 }}>
              Das bekommst du als <span style={{ background:'linear-gradient(90deg,#00D4FF,#C9A84C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>RealSync Creator</span>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

            {/* LEFT: Features (blurred if locked) */}
            <div className="fu d2">
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:12 }}>// Features</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {FEATURES.map(f => (
                  <div key={f.title} style={{ position:'relative', borderRadius:10, overflow:'hidden' }}>
                    <div className={f.locked ? 'feature-locked' : ''}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'#080C14', border:'1px solid #1A2130', borderRadius:10 }}>
                      <span style={{ fontSize:20, flexShrink:0 }}>{f.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:'#E4E6EF' }}>{f.title}</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)' }}>{f.desc}</div>
                      </div>
                      {!f.locked && <span style={{ marginLeft:'auto', color:'#10B981', fontSize:14 }}>✓</span>}
                    </div>
                    {f.locked && (
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(3,5,10,.5)' }}>
                        <span style={{ fontSize:16, color:'rgba(255,255,255,.3)' }}>🔒</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:10, fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.2)', textAlign:'center' }}>
                🔓 Meld dich an — alles wird freigeschaltet
              </div>
            </div>

            {/* RIGHT: Social Login */}
            <div className="fu d3">
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:12 }}>// Kostenlos anmelden</div>

              <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'24px 20px' }}>
                <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>
                  {referralBonus ? '🎁 Jetzt 1 Monat GRATIS starten' : 'Creator werden'}
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:20 }}>
                  {referralBonus ? 'Bronze Paket · Wert €19 · Kein Kreditkarte' : 'Kostenlos · Kein Kreditkarte · Sofort loslegen'}
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {SOCIAL_PROVIDERS.map(p => (
                    <button key={p.id} className="social-btn" onClick={() => handleSocialLogin(p.id)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:10, color:'rgba(255,255,255,.75)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer', transition:'all .2s', letterSpacing:'.04em', textAlign:'left', width:'100%' }}>
                      <span style={{ flexShrink:0, display:'flex', alignItems:'center' }}>{p.icon}</span>
                      <span>Mit <strong>{p.name}</strong> anmelden</span>
                      <span style={{ marginLeft:'auto', opacity:.3, fontSize:13 }}>→</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1, height:1, background:'#1A2130' }}/>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.15)' }}>ODER</span>
                  <div style={{ flex:1, height:1, background:'#1A2130' }}/>
                </div>
                <div style={{ marginTop:12, textAlign:'center' }}>
                  <Link href={`/register?ref=${ref}`} style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(0,212,255,.6)', textDecoration:'none' }}>
                    Mit E-Mail registrieren →
                  </Link>
                </div>
              </div>

              {/* Coin Info */}
              <div style={{ marginTop:12, background:'rgba(201,168,76,.08)', border:'1px solid rgba(201,168,76,.2)', borderRadius:10, padding:'12px 16px', display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:22 }}>🪙</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:'#C9A84C' }}>RealSyncCoins Programm</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', marginTop:2 }}>
                    Teile deinen Link → 50% Provision als Coins<br/>100 Coins = €1 · Sofort gutgeschrieben
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div style={{ marginTop:12, display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
                {['🔒 DSGVO','🇩🇪 Server DE','↩ Kündbar','⚡ Sofort'].map(t=>(
                  <span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ STEP: CONNECTING ══════════ */}
      {step === 'connecting' && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh', flexDirection:'column', gap:20 }}>
          <div style={{ width:56, height:56, border:'3px solid #00D4FF', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
          <div style={{ fontWeight:800, fontSize:20 }}>Verbinde mit {SOCIAL_PROVIDERS.find(p=>p.id===chosenProvider)?.name}…</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)' }}>OAuth Authentifizierung läuft…</div>
        </div>
      )}

      {/* ══════════ STEP: CONNECTED ══════════ */}
      {step === 'connected' && (
        <div style={{ maxWidth:700, margin:'0 auto', padding:'40px 20px' }}>
          <div className="fu" style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ width:56, height:56, background:'#10B98120', border:'2px solid #10B981', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 16px' }}>✓</div>
            <h1 style={{ fontWeight:800, fontSize:24, marginBottom:4 }}>Willkommen, {newUser.name}! 🎉</h1>
            {referralBonus && (
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:'#10B981', marginBottom:4 }}>🎁 1 Monat Bronze GRATIS aktiviert!</div>
            )}
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.35)' }}>Account erstellt · Dein Creator-Code: <span style={{ color:'#C9A84C' }}>{newUser.code}</span></p>
          </div>

          {/* Connect more platforms */}
          <div className="fu d1" style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'20px', marginBottom:20 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:14 }}>// Weitere Plattformen verbinden (optional)</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {SOCIAL_PROVIDERS.filter(p=>!connectedPlatforms.includes(p.id)).map(p => (
                <button key={p.id} onClick={()=>setConnectedPlatforms(prev=>[...prev,p.id])}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'rgba(255,255,255,.6)', fontFamily:"'DM Mono',monospace", fontSize:10, cursor:'pointer', transition:'all .15s', textAlign:'left' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='#374151'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='#1F2937'}>
                  {p.icon} <span>{p.name}</span>
                </button>
              ))}
              {connectedPlatforms.filter(p=>p!==chosenProvider).map(p=>(
                <div key={p} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.3)', borderRadius:8, fontFamily:"'DM Mono',monospace", fontSize:10, color:'#10B981' }}>
                  ✓ {SOCIAL_PROVIDERS.find(x=>x.id===p)?.name}
                </div>
              ))}
            </div>
          </div>

          {/* QR Codes */}
          <div className="fu d2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
            {/* Personal QR */}
            <div style={{ background:'#080C14', border:'1px solid #C9A84C30', borderRadius:14, padding:'20px', textAlign:'center' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#C9A84C', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:12 }}>// Dein Creator-QR</div>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
                <div style={{ background:'white', padding:8, borderRadius:8, boxShadow:'0 0 20px rgba(201,168,76,.3)' }}>
                  <QRCanvas value={`https://${myLink}`} size={120} color="#111"/>
                </div>
              </div>
              <div style={{ background:'white', padding:6, borderRadius:6, marginBottom:8 }}>
                <Barcode value={newUser.code} w={200} h={40}/>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)' }}>{myLink}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.2)', marginTop:4 }}>Führt zu deinem verifizierten Creator-Profil</div>
            </div>

            {/* B2B Referral QR */}
            <div style={{ background:'#080C14', border:'1px solid rgba(0,212,255,.25)', borderRadius:14, padding:'20px', textAlign:'center' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#00D4FF', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:12 }}>// B2B Referral-QR</div>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
                <div style={{ background:'white', padding:8, borderRadius:8, boxShadow:'0 0 20px rgba(0,212,255,.3)' }}>
                  <QRCanvas value={`https://${b2bLink}`} size={120} color="#0070F3"/>
                </div>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', marginBottom:4 }}>{b2bLink}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(0,212,255,.7)', background:'rgba(0,212,255,.08)', border:'1px solid rgba(0,212,255,.2)', borderRadius:6, padding:'6px 10px', marginTop:6 }}>
                🎁 Wer scannt → 1 Monat Bronze GRATIS<br/>
                🪙 Du bekommst 50% als Coins
              </div>
            </div>
          </div>

          {/* Coins info */}
          {referralBonus && (
            <div className="fu d3" style={{ background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.3)', borderRadius:12, padding:'16px 20px', marginBottom:20, display:'flex', gap:14, alignItems:'center' }}>
              <span style={{ fontSize:28 }}>🪙</span>
              <div>
                <div style={{ fontWeight:800, color:'#C9A84C' }}>Du hast automatisch Coins bekommen!</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)', marginTop:2 }}>
                  {creator.name} bekommt 50% deines ersten Pakets als RealSyncCoins gutgeschrieben.<br/>
                  <strong style={{ color:'rgba(255,255,255,.6)' }}>100 Coins = €1 · Sofort einlösbar auf der Plattform</strong>
                </div>
              </div>
            </div>
          )}

          <button onClick={finishSetup} className="fu d4"
            style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:10, color:'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, letterSpacing:'.04em', cursor:'pointer', boxShadow:'0 0 24px rgba(0,212,255,.25)' }}>
            Zum Creator Hub → Alle Tools starten
          </button>
        </div>
      )}

      {/* ══════════ STEP: DONE ══════════ */}
      {step === 'done' && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh', flexDirection:'column', gap:16, textAlign:'center' }}>
          <span style={{ fontSize:48 }}>🚀</span>
          <div style={{ fontWeight:800, fontSize:24 }}>Alles bereit!</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:'rgba(255,255,255,.35)' }}>Du wirst zu deinem Creator Hub weitergeleitet…</div>
        </div>
      )}
    </div>
  );
}
