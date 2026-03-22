'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SCORES = [
  { handle:'@max_creator',  score:94, niche:'Tech',      platform:'YouTube', change:'+12',  verified:true  },
  { handle:'@lisa_style',   score:78, niche:'Fashion',   platform:'TikTok',  change:'+23',  verified:false },
  { handle:'@tom_eats',     score:86, niche:'Food',      platform:'IG',      change:'+8',   verified:true  },
  { handle:'@anna_startup', score:91, niche:'Business',  platform:'LinkedIn',change:'+17',  verified:true  },
];

const TRUST_FACTORS = [
  { icon:'🛡', label:'C2PA 2.3',         score:100, color:'#10B981', desc:'Content signiert'      },
  { icon:'⛓', label:'Blockchain',        score:97,  color:'#8B5CF6', desc:'Polygon verankert'     },
  { icon:'🤖', label:'Deepfake-Scan',    score:98,  color:'#00D4FF', desc:'KI-verifiziert'        },
  { icon:'📸', label:'Style-Konsistenz', score:82,  color:'#C9A84C', desc:'Brand-Cohesion'        },
  { icon:'📊', label:'Engagement-Ratio', score:76,  color:'#F59E0B', desc:'Authentic engagement'  },
  { icon:'🎯', label:'Brand-Fitness',    score:89,  color:'#EC4899', desc:'Deal-bereit'            },
];

export default function CreatorSealLanding() {
  const [activeScore, setActiveScore] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [handle, setHandle] = useState('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveScore(i => (i + 1) % SCORES.length), 3000);
    return () => clearInterval(t);
  }, []);

  function startScan() {
    if (!handle.trim()) return;
    setScanning(true);
    setScanStep(0);
    const steps = [
      { delay: 600,  msg: 'Content analysieren...' },
      { delay: 1200, msg: 'C2PA-Signatur prüfen...' },
      { delay: 1900, msg: 'Deepfake-Scan läuft...' },
      { delay: 2600, msg: 'Engagement-Ratio berechnen...' },
      { delay: 3200, msg: 'Trust-Score generieren...' },
    ];
    steps.forEach(({ delay }, i) => {
      setTimeout(() => setScanStep(i + 1), delay);
    });
    setTimeout(() => { setScanning(false); setShowReport(true); }, 3800);
  }

  const currentDemo = SCORES[activeScore];

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,.2)}50%{box-shadow:0 0 50px rgba(201,168,76,.5)}}
        .fu{animation:fadeUp .5s cubic-bezier(.34,1.56,.64,1) both}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}
        .scan-line{animation:scan 1.8s ease-in-out infinite}
        .glow{animation:glow 2.5s ease infinite}
        .pulse{animation:pulse 1.4s ease infinite}
        .ticker{display:flex;animation:ticker 22s linear infinite;width:max-content}
      `}</style>

      {/* Top ticker */}
      <div style={{ height: 32, background: '#080C14', borderBottom: '1px solid #1A2130', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div className="ticker">
          {[...Array(2)].map((_, x) => (
            [
              '🛡 C2PA 2.3 verifiziert',
              '⛓ Blockchain-Zeitstempel',
              '🤖 98% Deepfake-Erkennung',
              '📊 Trust-Score in Echtzeit',
              '🎯 Brand-Fitness-Analyse',
              '🪙 Coins via B2B-Referral',
            ].map((item, i) => (
              <span key={`${x}-${i}`} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.35)', padding: '0 28px', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>
                {item} <span style={{ color: '#1A2130' }}>·</span>
              </span>
            ))
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '0 40px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #0F1520', background: 'rgba(3,5,10,.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 14, height: 14, border: '2px solid #C9A84C', transform: 'rotate(45deg)', position: 'relative' }}><div style={{ position: 'absolute', inset: 2.5, background: '#C9A84C' }}/></div>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#E4E6EF' }}>RealSync<span style={{ color: '#C9A84C' }}>Dynamics</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/pricing" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.4)', textDecoration: 'none', padding: '5px 12px' }}>Pakete</Link>
          <Link href="/login" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.4)', textDecoration: 'none', padding: '5px 12px' }}>Login</Link>
          <Link href="/register" style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, padding: '7px 18px', background: 'linear-gradient(135deg,#C9A84C,#FFD700)', borderRadius: 8, color: '#000', fontWeight: 700, textDecoration: 'none' }}>
            Kostenlos starten
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 40px 60px', display: 'grid', gridTemplateColumns: '1fr 480px', gap: 60, alignItems: 'center' }}>

        {/* Left: Copy */}
        <div>
          <div className="fu" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#C9A84C', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="glow" style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }}/>
            CreatorSeal · Das Signature-Produkt
          </div>

          <h1 className="fu d1" style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 20 }}>
            Finde heraus, wie<br/>
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>markenfähig</span> dein<br/>
            Content wirklich ist.
          </h1>

          <p className="fu d2" style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>
            Dein persönlicher Creator Trust-Score — C2PA-verifiziert,<br/>
            Deepfake-geprüft, Brand-analysiert. In 30 Sekunden.<br/>
            <span style={{ color: '#C9A84C' }}>Und dann: dein 7-Tage-Promo-Plan. Automatisch.</span>
          </p>

          {/* Input + Scan */}
          <div className="fu d3">
            {!showReport ? (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <input
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && startScan()}
                    placeholder="@dein_creator_handle"
                    style={{ flex: 1, background: '#080C14', border: '1px solid rgba(201,168,76,.4)', borderRadius: 10, padding: '13px 16px', color: '#E4E6EF', fontFamily: "'DM Mono',monospace", fontSize: 13, maxWidth: 280 }}
                    onFocus={e => e.target.style.borderColor = '#C9A84C'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,.4)'}
                  />
                  <button onClick={startScan} disabled={scanning || !handle.trim()}
                    style={{ padding: '13px 24px', background: handle.trim() && !scanning ? 'linear-gradient(135deg,#C9A84C,#FFD700)' : '#1A2130', border: 'none', borderRadius: 10, color: handle.trim() && !scanning ? '#000' : 'rgba(255,255,255,.2)', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, cursor: handle.trim() && !scanning ? 'pointer' : 'default', transition: 'all .2s', minWidth: 140 }}>
                    {scanning ? '⟳ Scanne...' : '🔍 Trust-Score'}
                  </button>
                </div>

                {/* Scan progress */}
                {scanning && (
                  <div style={{ background: '#080C14', border: '1px solid rgba(201,168,76,.25)', borderRadius: 12, padding: '16px 20px' }}>
                    {['Content analysieren', 'C2PA-Signatur prüfen', 'Deepfake-Scan', 'Engagement-Ratio berechnen', 'Trust-Score generieren'].map((step, i) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: scanStep > i ? '#10B981' : scanStep === i ? '#C9A84C' : '#1A2130', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0 }}>
                          {scanStep > i ? '✓' : scanStep === i ? <span className="pulse">●</span> : '○'}
                        </div>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: scanStep > i ? '#10B981' : scanStep === i ? '#C9A84C' : 'rgba(255,255,255,.2)' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Demo handles */}
                {!scanning && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.2)', alignSelf: 'center' }}>Beispiele:</span>
                    {['@dominik_steiner', '@max_creator', '@lisa_style'].map(h => (
                      <button key={h} onClick={() => setHandle(h)}
                        style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '3px 10px', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 20, color: '#C9A84C', cursor: 'pointer' }}>
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Mini-report teaser */
              <div style={{ background: '#080C14', border: '1px solid rgba(201,168,76,.4)', borderRadius: 14, padding: '20px 24px' }} className="fu">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#C9A84C', letterSpacing: '.15em', marginBottom: 3 }}>TRUST-SCORE · {handle}</div>
                    <div style={{ fontWeight: 900, fontSize: 36, color: '#C9A84C', lineHeight: 1 }}>87<span style={{ fontSize: 18, color: 'rgba(201,168,76,.6)' }}>/100</span></div>
                  </div>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛡</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
                  {TRUST_FACTORS.slice(0, 4).map(f => (
                    <div key={f.label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 12 }}>{f.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 3, background: '#1A2130', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 2, background: f.color, width: `${f.score}%` }}/>
                        </div>
                      </div>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: f.color, minWidth: 24, textAlign: 'right' }}>{f.score}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register?source=creatorseal&score=87"
                  style={{ display: 'block', textAlign: 'center', padding: '11px', background: 'linear-gradient(135deg,#C9A84C,#FFD700)', borderRadius: 9, color: '#000', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
                  🚀 Vollständigen Report + 7-Tage-Plan
                </Link>
                <button onClick={() => { setShowReport(false); setHandle(''); }}
                  style={{ display: 'block', width: '100%', marginTop: 8, fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.3)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  ← Neuer Scan
                </button>
              </div>
            )}
          </div>

          {/* Social proof */}
          <div className="fu d4" style={{ display: 'flex', gap: 14, marginTop: 24, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {['🧑‍💻', '👩‍🎤', '🧑‍🍳', '👩‍💼'].map((e, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A2130', border: '2px solid #03050A', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>4.900+ Creator bereits verifiziert</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.35)' }}>DACH · Ø Trust-Score: 84/100</div>
            </div>
          </div>
        </div>

        {/* Right: Live Score Card */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(ellipse, rgba(201,168,76,.08), transparent 70%)', pointerEvents: 'none' }}/>

          <div style={{ background: '#080C14', border: '1px solid rgba(201,168,76,.3)', borderRadius: 20, padding: '28px', position: 'relative', overflow: 'hidden' }}>
            {/* Scan line animation */}
            <div className="scan-line" style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.6), transparent)', zIndex: 1 }}/>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.35)', letterSpacing: '.15em', marginBottom: 3 }}>LIVE · TRUST-SCORE</div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{currentDemo.handle}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{currentDemo.niche} · {currentDemo.platform}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: 44, color: '#C9A84C', lineHeight: 1 }}>{currentDemo.score}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#10B981', marginTop: 2 }}>↑ {currentDemo.change} diese Woche</div>
              </div>
            </div>

            {/* Trust Factors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {TRUST_FACTORS.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, width: 22, textAlign: 'center', flexShrink: 0 }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.5)' }}>{f.label}</span>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: f.color, fontWeight: 700 }}>{f.score}</span>
                    </div>
                    <div style={{ height: 4, background: '#1A2130', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${f.color}88, ${f.color})`, width: `${f.score}%`, transition: 'width 1s ease' }}/>
                    </div>
                  </div>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: f.color, background: f.color + '15', padding: '1px 6px', borderRadius: 3, flexShrink: 0 }}>
                    {f.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Verified badge */}
            {currentDemo.verified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
                <span style={{ color: '#10B981', fontSize: 14 }}>✓</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#10B981' }}>C2PA-verifizierter Creator · Blockchain-Timestamp aktiv</span>
              </div>
            )}

            {/* CTA */}
            <Link href="/register?source=creatorseal"
              style={{ display: 'block', textAlign: 'center', padding: '12px', background: 'linear-gradient(135deg,#C9A84C,#FFD700)', borderRadius: 10, color: '#000', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 24px rgba(201,168,76,.3)' }}>
              🎯 Meinen Score jetzt prüfen
            </Link>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS — 4 steps */}
      <div style={{ background: '#080C14', borderTop: '1px solid #1A2130', borderBottom: '1px solid #1A2130', padding: '60px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10 }}>// In 4 Schritten</div>
            <h2 style={{ fontWeight: 900, fontSize: 28 }}>Von 0 auf Promo-Ready</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { step:'01', icon:'🔍', title:'Trust-Score',    color:'#C9A84C', desc:'Handle eingeben → C2PA + Deepfake + Brand-Analyse → Score in 30s' },
              { step:'02', icon:'📊', title:'Report',         color:'#00D4FF', desc:'Vollständiger Bericht: Schwächen, Stärken, sofortige Quick-Wins' },
              { step:'03', icon:'🚀', title:'7-Tage-Plan',   color:'#8B5CF6', desc:'OPTIMUS generiert deinen persönlichen Promo-Plan mit Perplexity' },
              { step:'04', icon:'🎯', title:'Brands finden',  color:'#10B981', desc:'DealFlow: Passende Brand-Deals auf Basis deines Trust-Scores' },
            ].map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 30, left: '62%', width: '76%', height: 1, background: `linear-gradient(90deg,${s.color}40,transparent)` }}/>}
                <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${s.color}40`, background: s.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>{s.icon}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: s.color, letterSpacing: '.15em', marginBottom: 6 }}>SCHRITT {s.step}</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROMO PLAN TEASER */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10 }}>// OPTIMUS + Perplexity</div>
          <h2 style={{ fontWeight: 900, fontSize: 26, marginBottom: 10 }}>Dein persönlicher 7-Tage-Promo-Plan</h2>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,.4)' }}>KI-generiert · Echtzeit-Trends · Plattform-optimiert</p>
        </div>

        <div style={{ background: '#080C14', border: '1px solid rgba(139,92,246,.3)', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,5,10,.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 10, gap: 16 }}>
            <div style={{ fontSize: 32 }}>🔒</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Freigeschaltet nach Signup</div>
            <Link href="/register?source=creatorseal"
              style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#C9A84C,#FFD700)', borderRadius: 10, color: '#000', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              Kostenlos starten →
            </Link>
          </div>

          {/* Blurred preview */}
          <div style={{ padding: '24px 28px', filter: 'blur(3px)', pointerEvents: 'none' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#8B5CF6', marginBottom: 16 }}>// 7-TAGE-PROMO-PLAN · @dein_handle · Trust-Score 87</div>
            {['Mo: TikTok Hook zu "KI-Creator-Tools" posten — Trend +142%', 'Di: YouTube Short über C2PA-Verifikation — SEO-Potential hoch', 'Mi: Instagram Story mit QR-Code → +12 Referrals erwartet', 'Do: LinkedIn-Post über Creator Economy DACH — B2B Reichweite', 'Fr: Collaboration-Anfrage an 3 passende Creator senden', 'Sa: Review-Antworten optimieren → Trust-Score +5 Punkte', 'So: Weekly Analytics → nächste Woche planen mit OPTIMUS'].map((day, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139,92,246,.2)', border: '1px solid rgba(139,92,246,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono',monospace", fontSize: 9, color: '#8B5CF6', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,.7)', lineHeight: 1.5 }}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,.08),rgba(0,212,255,.04))', borderTop: '1px solid rgba(201,168,76,.15)', padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🛡</div>
          <h2 style={{ fontWeight: 900, fontSize: 30, marginBottom: 12 }}>Bereit, markenfähig zu werden?</h2>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 28, lineHeight: 1.8 }}>
            Trust-Score · 7-Tage-Plan · Brand-Deals · RealSyncCoins<br/>
            Alles in einem Creator OS. Kostenlos starten.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register?source=creatorseal"
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#C9A84C,#FFD700)', borderRadius: 12, color: '#000', fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 30px rgba(201,168,76,.35)' }}>
              🚀 Kostenlos starten
            </Link>
            <Link href="/join/rs-dominik"
              style={{ padding: '14px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, color: 'rgba(255,255,255,.6)', fontFamily: "'DM Mono',monospace", fontSize: 12, textDecoration: 'none' }}>
              📱 Demo-QR scannen
            </Link>
          </div>
          <div style={{ marginTop: 16, fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.2)' }}>
            🔒 DSGVO · Kein Kreditkarte nötig · 🇩🇪 Server DE · C2PA 2.3
          </div>
        </div>
      </div>
    </div>
  );
}
