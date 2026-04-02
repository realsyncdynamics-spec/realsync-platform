'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PROVIDERS = [
  { id:'google',    label:'Mit Google anmelden',     icon:<svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
  { id:'youtube',   label:'Mit YouTube anmelden',    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id:'facebook',  label:'Mit Facebook anmelden',   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id:'tiktok',    label:'Mit TikTok anmelden',     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
  { id:'x',         label:'Mit X / Twitter anmelden', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id:'instagram', label:'Mit Instagram anmelden',  icon:<svg width="16" height="16" viewBox="0 0 24 24"><defs><radialGradient id="ig3" cx="30%" cy="107%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><path fill="url(#ig3)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
];

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string|null>(null);
  const [error, setError] = useState(errorParam || '');
  const [showPass, setShowPass] = useState(false);
  const [showAll, setShowAll] = useState(false);

  function handleSocial(id: string) {
    setLoadingProvider(id);
    // Redirect to real OAuth flow via Supabase
    window.location.href = `/api/auth/oauth?provider=${id}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Bitte alle Felder ausfüllen.'); return; }
    setLoading(true); setError('');
    const res = await fetch('/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Login fehlgeschlagen'); setLoading(false); return; }
    window.location.href = '/hub';
  }

  const visibleProviders = showAll ? PROVIDERS : PROVIDERS.slice(0, 3);

  return (
    <div style={{ minHeight:'100vh', background:'#03050A', display:'flex', fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fu{animation:fadeUp .45s cubic-bezier(.34,1.56,.64,1) both}
        .d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}.d4{animation-delay:.24s}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #0B0F18 inset!important;-webkit-text-fill-color:#E4E6EF!important}
        .sbtn:hover{border-color:#374151!important;transform:translateY(-1px)}
      `}</style>

      {/* LEFT */}
      <div style={{ width:440, flexShrink:0, borderRight:'1px solid #0F1520', padding:'48px 40px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }} className="hidden lg:flex">
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-15%', left:'-15%', width:500, height:500, background:'radial-gradient(circle, rgba(0,240,255,.06), transparent 60%)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:340, height:340, background:'radial-gradient(circle, rgba(201,168,76,.05), transparent 60%)', borderRadius:'50%' }}/>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.03 }}>
            {Array.from({length:17},(_,i)=><line key={'v'+i} x1={i*28} y1="0" x2={i*28} y2="100%" stroke="#00F0FF" strokeWidth=".5"/>)}
            {Array.from({length:24},(_,i)=><line key={'h'+i} x1="0" y1={i*28} x2="100%" y2={i*28} stroke="#00F0FF" strokeWidth=".5"/>)}
          </svg>
        </div>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', position:'relative', zIndex:1 }}>
          <div style={{ width:16, height:16, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}><div style={{ position:'absolute', inset:3, background:'#C9A84C' }}/></div>
          <span style={{ fontWeight:800, fontSize:14, color:'#E4E6EF' }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
        </Link>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'.2em', color:'#00D4FF', textTransform:'uppercase', marginBottom:18 }}>// THE CREATOR OS</div>
          <div style={{ fontSize:28, fontWeight:800, lineHeight:1.2, color:'#E4E6EF', marginBottom:20 }}>
            Ein Login.<br/><span style={{ background:'linear-gradient(90deg,#00D4FF,#C9A84C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Alle Tools.</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[['🛡','CreatorSeal · Verifikation & QR'],['⭐','ReviewRadar · KI-Antworten'],['💳','ChurnRescue · Revenue retten'],['🚀','WaitlistKit · Viral Growth'],['🪙','RealSyncCoins · 50% Provision']].map(([i,t])=>(
              <div key={t} style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span style={{ fontSize:16 }}>{i}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[['4.9K+','Creator'],['98%','Deepfake-Scan'],['€0','Startup'],['C2PA','2.3 Standard']].map(([v,l])=>(
            <div key={l} style={{ background:'rgba(11,15,24,.8)', border:'1px solid #1F2937', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontWeight:800, fontSize:16, color:'#00D4FF' }}>{v}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.3)', marginTop:3, letterSpacing:'.08em', textTransform:'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ width:'100%', maxWidth:380 }}>
          <div className="fu" style={{ marginBottom:26 }}>
            <h1 style={{ fontWeight:800, fontSize:25, color:'#E4E6EF', marginBottom:5 }}>Willkommen zurück</h1>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)' }}>
              Kein Konto?{' '}<Link href="/register" style={{ color:'#00D4FF', textDecoration:'none' }}>Kostenlos registrieren →</Link>
            </p>
          </div>

          {error && (
            <div className="fu" style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', borderRadius:8, padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11, color:'#FCA5A5', marginBottom:16 }}>
              ⚠ {error === 'auth_failed' ? 'OAuth fehlgeschlagen — bitte nochmals versuchen.' : error}
            </div>
          )}

          <div className="fu d1" style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
            {visibleProviders.map(p => (
              <button key={p.id} className="sbtn" onClick={()=>handleSocial(p.id)} disabled={!!loadingProvider}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:9, color:'rgba(255,255,255,.7)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor: loadingProvider?'default':'pointer', transition:'all .18s', letterSpacing:'.04em', width:'100%', opacity: loadingProvider&&loadingProvider!==p.id?0.4:1 }}>
                {loadingProvider===p.id
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite', flexShrink:0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  : <span style={{ flexShrink:0, display:'flex', alignItems:'center' }}>{p.icon}</span>}
                <span>{p.label}</span>
                <span style={{ marginLeft:'auto', opacity:.25, fontSize:12 }}>→</span>
              </button>
            ))}
            {!showAll && (
              <button onClick={()=>setShowAll(true)}
                style={{ padding:'8px', background:'transparent', border:'1px dashed #1F2937', borderRadius:8, color:'rgba(255,255,255,.25)', fontFamily:"'DM Mono',monospace", fontSize:10, cursor:'pointer', letterSpacing:'.08em' }}>
                + {PROVIDERS.length - 3} weitere Anbieter
              </button>
            )}
          </div>

          <div className="fu d2" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
            <div style={{ flex:1, height:1, background:'#1A2130' }}/><span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.15)', letterSpacing:'.2em' }}>ODER E-MAIL</span><div style={{ flex:1, height:1, background:'#1A2130' }}/>
          </div>

          <form onSubmit={handleSubmit} className="fu d3">
            <div style={{ marginBottom:12 }}>
              <label style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.35)', textTransform:'uppercase', display:'block', marginBottom:6 }}>E-Mail</label>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder="deine@email.de" autoComplete="email"
                style={{ width:'100%', padding:'11px 13px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'#E4E6EF', fontFamily:"'DM Mono',monospace", fontSize:12, boxSizing:'border-box', transition:'border-color .15s' }}
                onFocus={e=>e.target.style.borderColor='#00D4FF'} onBlur={e=>e.target.style.borderColor=email?'#374151':'#1F2937'}/>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <label style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.35)', textTransform:'uppercase' }}>Passwort</label>
                <Link href="/forgot-password" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(0,212,255,.5)', textDecoration:'none' }}>Vergessen?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="••••••••" autoComplete="current-password"
                  style={{ width:'100%', padding:'11px 40px 11px 13px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'#E4E6EF', fontFamily:"'DM Mono',monospace", fontSize:12, boxSizing:'border-box', transition:'border-color .15s' }}
                  onFocus={e=>e.target.style.borderColor='#00D4FF'} onBlur={e=>e.target.style.borderColor=password?'#374151':'#1F2937'}/>
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,.25)', cursor:'pointer', padding:0 }}>{showPass?'🙈':'👁'}</button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'12px', background: loading?'rgba(0,212,255,.2)':'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:8, color: loading?'rgba(255,255,255,.4)':'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, letterSpacing:'.04em', cursor: loading?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: loading?'none':'0 0 20px rgba(0,212,255,.2)' }}>
              {loading?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Einloggen…</>:'Einloggen →'}
            </button>
          </form>

          <p className="fu d4" style={{ textAlign:'center', marginTop:18, fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.15)' }}>
            Kein Konto?{' '}<Link href="/register" style={{ color:'rgba(0,212,255,.6)', textDecoration:'none' }}>Kostenlos starten</Link>
            {' · '}<Link href="/setup" style={{ color:'rgba(255,255,255,.2)', textDecoration:'none' }}>Setup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:'100vh', background:'#03050A', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>Lädt…</div>}>
      <LoginContent/>
    </Suspense>
  );
}
