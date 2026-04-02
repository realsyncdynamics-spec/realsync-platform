'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError('Bitte E-Mail eingeben.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Fehler beim Senden. Bitte nochmals versuchen.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Verbindungsfehler. Bitte nochmals versuchen.');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:'100vh', background:'#03050A', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fu{animation:fadeUp .4s cubic-bezier(.34,1.56,.64,1) both}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #0B0F18 inset!important;-webkit-text-fill-color:#E4E6EF!important}
      `}</style>

      <div style={{ width:'100%', maxWidth:400 }} className="fu">
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:36, justifyContent:'center' }}>
          <div style={{ width:14, height:14, border:'2px solid #C9A84C', transform:'rotate(45deg)', position:'relative' }}>
            <div style={{ position:'absolute', inset:2.5, background:'#C9A84C' }}/>
          </div>
          <span style={{ fontWeight:800, fontSize:14, color:'#E4E6EF' }}>RealSync<span style={{ color:'#C9A84C' }}>Dynamics</span></span>
        </Link>

        <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'32px 28px' }}>
          {!sent ? (
            <>
              <h1 style={{ fontWeight:800, fontSize:22, color:'#E4E6EF', marginBottom:6 }}>Passwort zurücksetzen</h1>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.3)', marginBottom:28, lineHeight:1.7 }}>
                Gib deine E-Mail ein. Wir schicken dir einen Link zum Zurücksetzen.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.35)', textTransform:'uppercase', display:'block', marginBottom:7 }}>
                  E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="deine@email.de"
                  autoComplete="email"
                  style={{ width:'100%', padding:'11px 13px', background:'#0B0F18', border:'1px solid #1F2937', borderRadius:8, color:'#E4E6EF', fontFamily:"'DM Mono',monospace", fontSize:12, boxSizing:'border-box', marginBottom:16, transition:'border-color .15s' }}
                  onFocus={e => e.target.style.borderColor='#00D4FF'}
                  onBlur={e => e.target.style.borderColor=email?'#374151':'#1F2937'}
                />
                {error && (
                  <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', borderRadius:7, padding:'8px 11px', fontFamily:"'DM Mono',monospace", fontSize:11, color:'#FCA5A5', marginBottom:14 }}>
                    ⚠ {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width:'100%', padding:'12px', background: loading?'rgba(0,212,255,.2)':'linear-gradient(135deg,#00D4FF,#0070F3)', border:'none', borderRadius:8, color: loading?'rgba(255,255,255,.4)':'#000', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, cursor: loading?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {loading ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Senden…
                    </>
                  ) : 'Link senden →'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'10px 0' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'#10B98120', border:'2px solid #10B981', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:24 }}>
                ✉
              </div>
              <h2 style={{ fontWeight:800, fontSize:20, color:'#E4E6EF', marginBottom:10 }}>E-Mail gesendet!</h2>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)', lineHeight:1.8 }}>
                Falls ein Konto mit <span style={{ color:'#E4E6EF' }}>{email}</span> existiert,<br/>
                erhältst du in Kürze einen Reset-Link.
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.2)' }}>
          <Link href="/login" style={{ color:'rgba(0,212,255,.5)', textDecoration:'none' }}>← Zurück zum Login</Link>
        </p>
      </div>
    </div>
  );
}
