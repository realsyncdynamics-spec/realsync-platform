'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PLANS } from '@/lib/plans';

const STEPS = ['Account', 'Paket', 'Fertig'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [plan, setPlan] = useState<'gratis'|'bronze'|'silber'|'gold'>('gratis');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Bitte alle Felder ausfüllen.'); return; }
    if (form.password.length < 8) { setError('Passwort mindestens 8 Zeichen.'); return; }
    setError('');
    setStep(1);
  }

  async function handleFinish() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setStep(2);
    setTimeout(() => router.push(searchParams.get('source')==='creatorseal'?'/onboarding/creatorseal?score=87':'/onboarding'), 2000);
  }

  const inp = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.35)', textTransform:'uppercase', display:'block', marginBottom:7 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <input type={key==='password'?(showPass?'text':'password'):type}
          value={form[key]} onChange={e=>{setForm(p=>({...p,[key]:e.target.value}));setError('');}}
          placeholder={placeholder}
          style={{ width:'100%', padding:'11px '+(key==='password'?'40px':'13px')+' 11px 13px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'#E4E6EF', fontFamily:"'DM Mono',monospace", fontSize:13, boxSizing:'border-box', transition:'border-color .15s' }}
          onFocus={e=>e.target.style.borderColor='#00D4FF'}
          onBlur={e=>e.target.style.borderColor=form[key]?'#374151':'#1F2937'}
        />
        {key==='password'&&(
          <button type="button" onClick={()=>setShowPass(p=>!p)}
            style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,.25)', cursor:'pointer', fontSize:14, padding:0, lineHeight:1 }}>
            {showPass?'🙈':'👁'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#03050A', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes checkPop{0%{transform:scale(0)}80%{transform:scale(1.15)}100%{transform:scale(1)}}
        .fu{animation:fadeUp .4s cubic-bezier(.34,1.56,.64,1) both}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #0B0F18 inset!important;-webkit-text-fill-color:#E4E6EF!important}
      `}</style>

      <div style={{ width:'100%', maxWidth:460 }}>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:32, justifyContent:'center' }}>
          <div style={{ width:14, height:14, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
            <div style={{ position:'absolute', inset:2.5, background:'#C9A84C' }}/>
          </div>
          <span style={{ fontWeight:800, fontSize:14, color:'#E4E6EF' }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
        </Link>

        {/* Progress */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:32 }}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{ display:'flex', alignItems:'center' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, transition:'all .3s',
                  background: i<step?'#00C853':i===step?'#00D4FF':'#0B0F18',
                  border: `2px solid ${i<step?'#00C853':i===step?'#00D4FF':'#1F2937'}`,
                  color: i<=step?'#000':'rgba(255,255,255,.25)' }}>
                  {i<step?'✓':i+1}
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.1em', color: i===step?'#00D4FF':i<step?'#00C853':'rgba(255,255,255,.2)', textTransform:'uppercase' }}>{s}</span>
              </div>
              {i<STEPS.length-1&&<div style={{ width:60, height:2, background: i<step?'#00C853':'#1A2130', margin:'0 6px 14px', transition:'background .4s' }}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'28px 28px 24px' }}>

          {/* STEP 0 — Account */}
          {step===0&&(
            <form onSubmit={handleStep1} className="fu">
              <h2 style={{ fontWeight:800, fontSize:22, color:'#E4E6EF', marginBottom:4 }}>Account erstellen</h2>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:22 }}>
                Bereits registriert? <Link href="/login" style={{ color:'#00D4FF', textDecoration:'none' }}>Einloggen →</Link>
              </p>

              {/* Social */}
              <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                {[{label:'Google',icon:<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>},
                  {label:'GitHub',icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}]
                  .map(s=>(
                  <button key={s.label} type="button" onClick={()=>router.push(searchParams.get('source')==='creatorseal'?'/onboarding/creatorseal?score=87':'/onboarding')}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'10px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'rgba(255,255,255,.55)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer', transition:'border-color .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='#374151'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='#1F2937'}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ flex:1, height:1, background:'#1A2130' }}/>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.15)', letterSpacing:'.15em' }}>ODER</span>
                <div style={{ flex:1, height:1, background:'#1A2130' }}/>
              </div>

              {inp('Creator-Name','name','text','Max Mustermann')}
              {inp('E-Mail','email','email','deine@email.de')}
              {inp('Passwort (min. 8 Zeichen)','password','password','••••••••')}

              {error&&<div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', borderRadius:7, padding:'8px 11px', fontFamily:"'DM Mono',monospace", fontSize:11, color:'#FCA5A5', marginBottom:14 }}>⚠ {error}</div>}

              <button type="submit"
                style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:8, color:'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, letterSpacing:'.04em', cursor:'pointer', boxShadow:'0 0 20px rgba(0,212,255,.2)' }}>
                Weiter →
              </button>
            </form>
          )}

          {/* STEP 1 — Plan */}
          {step===1&&(
            <div className="fu">
              <h2 style={{ fontWeight:800, fontSize:22, color:'#E4E6EF', marginBottom:4 }}>Paket wählen</h2>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:20 }}>Jederzeit ändern. Kein Vertrag.</p>

              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                {(['gratis','bronze','silber','gold'] as const).map(p=>{
                  const pl = PLANS[p];
                  const active = plan===p;
                  return (
                    <button key={p} type="button" onClick={()=>setPlan(p)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background: active?pl.color+'12':'#0B0F18', border:`1.5px solid ${active?pl.color+'60':'#1F2937'}`, borderRadius:10, cursor:'pointer', transition:'all .15s', textAlign:'left', width:'100%' }}>
                      <span style={{ fontSize:22, flexShrink:0 }}>{pl.emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ fontWeight:800, fontSize:13, color: active?pl.color:'#E4E6EF' }}>{pl.name}</span>
                          {p==='gratis'&&<span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'1px 6px', background:'#10B98120', border:'1px solid #10B98140', color:'#10B981', borderRadius:4 }}>EMPFOHLEN ZUM START</span>}
                          {p==='silber'&&<span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'1px 6px', background:'#00D4FF20', border:'1px solid #00D4FF40', color:'#00D4FF', borderRadius:4 }}>BELIEBT</span>}
                        </div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)', marginTop:2 }}>
                          {pl.price.monthly===0?'Für immer kostenlos':`€${pl.price.monthly}/Monat`} · {pl.tagline}
                        </div>
                      </div>
                      <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${active?pl.color:'#374151'}`, background: active?pl.color:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {active&&<span style={{ color:'#000', fontSize:10, fontWeight:800 }}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <button type="button" onClick={()=>setStep(0)}
                  style={{ padding:'11px 20px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'rgba(255,255,255,.4)', fontFamily:"'DM Mono',monospace", fontSize:11, cursor:'pointer' }}>
                  ← Zurück
                </button>
                <button type="button" onClick={handleFinish} disabled={loading}
                  style={{ flex:1, padding:'12px', background: loading?'rgba(0,212,255,.2)':'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:8, color: loading?'rgba(255,255,255,.4)':'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, letterSpacing:'.04em', cursor: loading?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: loading?'none':'0 0 20px rgba(0,212,255,.2)' }}>
                  {loading?(
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Wird erstellt…
                    </>
                  ):'Account erstellen →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Success */}
          {step===2&&(
            <div className="fu" style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#10B98120', border:'2px solid #10B981', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', animation:'checkPop .5s cubic-bezier(.34,1.56,.64,1)' }}>
                <span style={{ fontSize:28, color:'#10B981' }}>✓</span>
              </div>
              <h2 style={{ fontWeight:800, fontSize:22, color:'#E4E6EF', marginBottom:6 }}>Willkommen, {form.name.split(' ')[0]}!</h2>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.35)' }}>
                {PLANS[plan].emoji} {PLANS[plan].name} Plan aktiviert<br/>
                Du wirst in Kürze weitergeleitet…
              </p>
              <div style={{ marginTop:16, height:2, background:'#1A2130', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', background:'linear-gradient(90deg,#00D4FF,#00C853)', borderRadius:2, animation:'shimmer 1.2s ease infinite', backgroundSize:'200% 100%' }}/>
              </div>
            </div>
          )}

        </div>

        <p style={{ textAlign:'center', marginTop:20, fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.15)' }}>
          Mit der Registrierung stimmst du den{' '}
          <Link href="/agb" style={{ color:'rgba(255,255,255,.3)', textDecoration:'none' }}>AGB</Link> und der{' '}
          <Link href="/datenschutz" style={{ color:'rgba(255,255,255,.3)', textDecoration:'none' }}>Datenschutzerklärung</Link> zu.
        </p>

      </div>
    </div>
  );
}
