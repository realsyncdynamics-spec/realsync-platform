'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Bitte alle Felder ausfüllen.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    router.push('/hub');
  }

  return (
    <div style={{ minHeight:'100vh', background:'#03050A', display:'flex', fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .fu{animation:fadeUp .45s cubic-bezier(.34,1.56,.64,1) both}
        .d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
        .d4{animation-delay:.24s}.d5{animation-delay:.3s}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #0B0F18 inset!important;-webkit-text-fill-color:#E4E6EF!important}
        .social-btn:hover{border-color:#374151!important;background:#111827!important}
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{ width:460, flexShrink:0, borderRight:'1px solid #0F1520', padding:'48px 40px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}
        className="hidden lg:flex">
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-15%', left:'-15%', width:520, height:520, background:'radial-gradient(circle, rgba(0,240,255,.06), transparent 60%)', borderRadius:'50%' }}/>
          <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:360, height:360, background:'radial-gradient(circle, rgba(201,168,76,.05), transparent 60%)', borderRadius:'50%' }}/>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.035 }}>
            {Array.from({length:18},(_,i)=><line key={'v'+i} x1={i*28} y1="0" x2={i*28} y2="100%" stroke="#00F0FF" strokeWidth=".5"/>)}
            {Array.from({length:24},(_,i)=><line key={'h'+i} x1="0" y1={i*28} x2="100%" y2={i*28} stroke="#00F0FF" strokeWidth=".5"/>)}
          </svg>
        </div>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', position:'relative', zIndex:1 }}>
          <div style={{ width:16, height:16, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative', flexShrink:0 }}>
            <div style={{ position:'absolute', inset:3, background:'#C9A84C' }}/>
          </div>
          <span style={{ fontWeight:800, fontSize:14, letterSpacing:'.04em', color:'#E4E6EF' }}>
            RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span>
          </span>
        </Link>

        {/* Quote */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'.2em', color:'#00D4FF', textTransform:'uppercase', marginBottom:18 }}>// THE CREATOR OS</div>
          <div style={{ fontSize:30, fontWeight:800, lineHeight:1.2, color:'#E4E6EF', marginBottom:20 }}>
            Ein Login.<br/>
            <span style={{ background:'linear-gradient(90deg,#00D4FF,#C9A84C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Alle Tools.
            </span>
          </div>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', lineHeight:1.8 }}>
            ReviewRadar · ChurnRescue<br/>
            WaitlistKit · CreatorSeal<br/>
            + 12 weitere Apps
          </p>
        </div>

        {/* Stats */}
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['4.9K+','Creator aktiv'],['98%','Deepfake-Erkennung'],['€0','Infrastruktur'],['C2PA','2.3 Standard']].map(([v,l])=>(
            <div key={l} style={{ background:'rgba(11,15,24,.8)', border:'1px solid #1F2937', borderRadius:8, padding:'12px 14px' }}>
              <div style={{ fontWeight:800, fontSize:18, color:'#00D4FF', lineHeight:1 }}>{v}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', marginTop:4, letterSpacing:'.08em', textTransform:'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ width:'100%', maxWidth:380 }}>

          {/* Mobile logo */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:7, textDecoration:'none', marginBottom:32 }} className="lg:hidden">
            <div style={{ width:13, height:13, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
              <div style={{ position:'absolute', inset:2.5, background:'#C9A84C' }}/>
            </div>
            <span style={{ fontWeight:800, fontSize:13, color:'#E4E6EF' }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
          </Link>

          {/* Heading */}
          <div className="fu" style={{ marginBottom:28 }}>
            <h1 style={{ fontWeight:800, fontSize:26, color:'#E4E6EF', marginBottom:6, letterSpacing:'-.02em' }}>Willkommen zurück</h1>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)' }}>
              Kein Konto?{' '}
              <Link href="/register" style={{ color:'#00D4FF', textDecoration:'none', fontWeight:500 }}>Kostenlos registrieren →</Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="fu d1" style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
            {[
              { id:'google', label:'Mit Google anmelden', icon:(
                <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              )},
              { id:'github', label:'Mit GitHub anmelden', icon:(
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              )},
            ].map(s=>(
              <button key={s.id} className="social-btn"
                onClick={()=>router.push('/hub')}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:9, padding:'11px 16px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'rgba(255,255,255,.65)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer', transition:'all .15s', letterSpacing:'.04em' }}>
                {s.icon}{s.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="fu d2" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
            <div style={{ flex:1, height:1, background:'#1A2130' }}/>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.15)', letterSpacing:'.2em' }}>ODER MIT E-MAIL</span>
            <div style={{ flex:1, height:1, background:'#1A2130' }}/>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="fu d3">
            <div style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.35)', textTransform:'uppercase', display:'block', marginBottom:7 }}>E-Mail</label>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}}
                placeholder="deine@email.de" autoComplete="email"
                style={{ width:'100%', padding:'11px 13px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'#E4E6EF', fontFamily:"'DM Mono',monospace", fontSize:13, boxSizing:'border-box', transition:'border-color .15s' }}
                onFocus={e=>e.target.style.borderColor='#00D4FF'}
                onBlur={e=>e.target.style.borderColor=email?'#374151':'#1F2937'}
              />
            </div>

            <div style={{ marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                <label style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.35)', textTransform:'uppercase' }}>Passwort</label>
                <Link href="#" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(0,212,255,.5)', textDecoration:'none' }}>Vergessen?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('');}}
                  placeholder="••••••••" autoComplete="current-password"
                  style={{ width:'100%', padding:'11px 40px 11px 13px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'#E4E6EF', fontFamily:"'DM Mono',monospace", fontSize:13, boxSizing:'border-box', transition:'border-color .15s' }}
                  onFocus={e=>e.target.style.borderColor='#00D4FF'}
                  onBlur={e=>e.target.style.borderColor=password?'#374151':'#1F2937'}
                />
                <button type="button" onClick={()=>setShowPass(p=>!p)}
                  style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,.25)', cursor:'pointer', fontSize:14, padding:0, lineHeight:1 }}>
                  {showPass?'🙈':'👁'}
                </button>
              </div>
            </div>

            {error&&(
              <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', borderRadius:7, padding:'9px 12px', fontFamily:"'DM Mono',monospace", fontSize:11, color:'#FCA5A5', marginBottom:14 }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'12px', background: loading?'rgba(0,212,255,.2)':'linear-gradient(135deg,#00D4FF 0%,#0070F3 100%)', border:'none', borderRadius:8, color: loading?'rgba(255,255,255,.4)':'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, letterSpacing:'.04em', cursor: loading?'default':'pointer', transition:'all .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: loading?'none':'0 0 20px rgba(0,212,255,.25)' }}>
              {loading?(
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Einloggen…
                </>
              ):'Einloggen →'}
            </button>
          </form>

          <p className="fu d4" style={{ textAlign:'center', marginTop:20, fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.15)' }}>
            Kein Konto?{' '}
            <Link href="/register" style={{ color:'rgba(0,212,255,.6)', textDecoration:'none' }}>Kostenlos registrieren</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
