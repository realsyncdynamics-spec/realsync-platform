'use client';
import { useState } from 'react';
import Link from 'next/link';

const FACTORS = [
  { icon:'🛡', label:'C2PA 2.3',       score:92, color:'#10B981', desc:'Content signiert · Ed25519',   change:'+2'  },
  { icon:'⛓', label:'Blockchain',      score:88, color:'#8B5CF6', desc:'Polygon · Hash verankert',     change:'+1'  },
  { icon:'🤖', label:'Deepfake-Scan',  score:97, color:'#00D4FF', desc:'FaceForensics++ · 98.4% Acc.',  change:'0'   },
  { icon:'📸', label:'Style-Konsistenz',score:74, color:'#C9A84C', desc:'Brand-Cohesion · Verbesserbar', change:'-3'  },
  { icon:'📊', label:'Engagement-Ratio',score:68, color:'#F59E0B', desc:'Authentic 6,8% · Ziel >8%',    change:'+4'  },
  { icon:'🎯', label:'Brand-Fitness',  score:85, color:'#EC4899', desc:'Deal-bereit · 3 Marken Match',  change:'+7'  },
];

const CONTENT = [
  { id:'c1', title:'KI-Tools Review 2026',  platform:'YouTube', status:'verified',  score:94, time:'vor 2h',  size:'12.4 MB' },
  { id:'c2', title:'Creator Morning Routine',platform:'TikTok',  status:'verified',  score:89, time:'vor 5h',  size:'4.1 MB'  },
  { id:'c3', title:'Brand Deal Breakdown',   platform:'Instagram',status:'pending',   score:null,time:'vor 8h', size:'2.8 MB'  },
  { id:'c4', title:'Podcast Ep. 47',         platform:'Spotify', status:'unverified', score:61, time:'vor 1d',  size:'87 MB'   },
];

const PLAN_DAYS = [
  { day:'Mo', platform:'TikTok',    action:'Hook: "KI-Creator-Tools 2026"',         coins:'+120', done:true  },
  { day:'Di', platform:'YouTube',   action:'Short: Content-Verifikation Demo',       coins:'+80',  done:true  },
  { day:'Mi', platform:'Instagram', action:'Reel + B2B-QR-Code Story',               coins:'+200', done:false },
  { day:'Do', platform:'LinkedIn',  action:'Post: Creator Economy DACH Report',      coins:'+60',  done:false },
  { day:'Fr', platform:'YouTube',   action:'Tutorial: Deepfake-Schutz 2 Min.',       coins:'+90',  done:false },
  { day:'Sa', platform:'OPTIMUS',   action:'Reviews beantworten · Engagement-Boost', coins:'+50',  done:false },
  { day:'So', platform:'Analytics', action:'Wochenrückblick + nächste Woche planen', coins:'+30',  done:false },
];

const STATUS_META: Record<string, {l:string;c:string;bg:string}> = {
  verified:   { l:'✓ Verifiziert', c:'#10B981', bg:'rgba(16,185,129,.12)'  },
  pending:    { l:'⟳ Prüfung',    c:'#F59E0B', bg:'rgba(245,158,11,.12)'   },
  unverified: { l:'⚠ Ungeprüft',  c:'#EF4444', bg:'rgba(239,68,68,.12)'    },
};

export default function CreatorSealDashboard() {
  const [tab, setTab] = useState<'score'|'content'|'plan'|'optimus'>('score');
  const [optimusInput, setOptimusinput] = useState('');
  const [optimusLoading, setOptimusLoading] = useState(false);
  const [optimusAnswer, setOptimusAnswer] = useState('');
  const [plan, setPlan] = useState('');
  const [planLoading, setPlanLoading] = useState(false);

  const totalScore = Math.round(FACTORS.reduce((s, f) => s + f.score, 0) / FACTORS.length);

  async function askOptimus(prompt?: string) {
    const q = prompt || optimusInput.trim();
    if (!q) return;
    setOptimusinput('');
    setOptimusLoading(true);
    setOptimusAnswer('');
    try {
      const res = await fetch('/api/optimus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, model: 'fast', appContext: 'CreatorSeal' }),
      });
      const d = await res.json();
      setOptimusAnswer(d.response || d.error || '');
    } catch { setOptimusAnswer('⚠️ Fehler. Erneut versuchen.'); }
    setOptimusLoading(false);
  }

  async function generatePlan() {
    setPlanLoading(true);
    try {
      const res = await fetch('/api/creatorseal/promo-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: '@dominik_steiner', score: totalScore, niche: 'Creator Tools', platforms: ['YouTube', 'TikTok', 'Instagram'], trustFactors: FACTORS }),
      });
      const d = await res.json();
      setPlan(d.plan || '');
    } catch { setPlan('Fehler beim Generieren.'); }
    setPlanLoading(false);
  }

  const md = (t: string) => t
    .replace(/^## (.+)$/gm,'<div style="font-size:13px;font-weight:800;color:#C9A84C;margin:12px 0 4px">$1</div>')
    .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#E4E6EF">$1</strong>')
    .replace(/^▸ (.+)$/gm,'<div style="display:flex;gap:6px;margin:2px 0"><span style="color:#8B5CF6">▸</span><span>$1</span></div>')
    .replace(/\n/g,'<br/>');

  return (
    <div style={{ minHeight:'100vh', background:'#03050A', color:'white', fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>

      {/* Header */}
      <div style={{ background:'rgba(3,5,10,.97)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(20px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link href="/hub" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>← Hub</Link>
          <span style={{ color:'#1A2130' }}>|</span>
          <div style={{ fontWeight:800, fontSize:14 }}>🛡 CreatorSeal</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'3px 8px', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', borderRadius:4, color:'#10B981' }}>C2PA 2.3 · Aktiv</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:700, color:'#C9A84C' }}>Score: {totalScore}/100</div>
          <Link href="/creatorseal" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'4px 10px', background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.25)', borderRadius:6, color:'#C9A84C', textDecoration:'none' }}>Landing →</Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'#080C14', borderBottom:'1px solid #1A2130', padding:'0 20px', display:'flex', gap:4 }}>
        {[
          { id:'score'  as const, label:'📊 Trust-Score' },
          { id:'content'as const, label:'🛡 Content'     },
          { id:'plan'   as const, label:'🚀 7-Tage-Plan' },
          { id:'optimus'as const, label:'🤖 OPTIMUS'     },
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ fontFamily:"'DM Mono',monospace", fontSize:11, padding:'11px 16px', background:'transparent', border:'none', borderBottom:`2px solid ${tab===t.id?'#C9A84C':'transparent'}`, color:tab===t.id?'#C9A84C':'rgba(255,255,255,.35)', cursor:'pointer', transition:'all .15s', whiteSpace:'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'24px 20px' }}>

        {/* ── SCORE TAB ── */}
        {tab==='score' && (
          <div>
            {/* Score hero */}
            <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,.06),rgba(139,92,246,.04))', border:'1px solid rgba(201,168,76,.2)', borderRadius:16, padding:'28px', marginBottom:18, display:'flex', gap:24, alignItems:'center' }}>
              <div style={{ textAlign:'center', flexShrink:0 }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.35)', letterSpacing:'.2em', marginBottom:4 }}>TRUST-SCORE</div>
                <div style={{ fontWeight:900, fontSize:72, color:'#C9A84C', lineHeight:1 }}>{totalScore}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.4)' }}>/100</div>
                <div style={{ marginTop:6, fontFamily:"'DM Mono',monospace", fontSize:9, color:'#10B981' }}>↑ +12 diese Woche</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {FACTORS.map(f=>(
                    <div key={f.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:14, width:20, textAlign:'center', flexShrink:0 }}>{f.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.5)' }}>{f.label}</span>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:f.change.startsWith('+')?'#10B981':f.change==='-3'?'#EF4444':'rgba(255,255,255,.3)' }}>{f.change}</span>
                        </div>
                        <div style={{ height:5, background:'#1A2130', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ height:'100%', borderRadius:3, background:`linear-gradient(90deg,${f.color}80,${f.color})`, width:`${f.score}%`, transition:'width 1s ease' }}/>
                        </div>
                      </div>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:f.color, fontWeight:700, minWidth:24, textAlign:'right' }}>{f.score}</span>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.25)', minWidth:120 }}>{f.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { icon:'🚀', label:'Promo-Plan generieren',   action:()=>{ setTab('plan'); if(!plan) generatePlan(); }, color:'#C9A84C' },
                { icon:'🤖', label:'OPTIMUS fragen',          action:()=>setTab('optimus'),                              color:'#8B5CF6' },
                { icon:'📄', label:'Report erstellen',        action:()=>window.open('/pages-report','_blank'),          color:'#00D4FF' },
                { icon:'📱', label:'Plattform verbinden',     action:()=>setTab('content'),                              color:'#10B981' },
                { icon:'🎯', label:'Brands finden (DealFlow)',action:()=>{},                                             color:'#EC4899' },
                { icon:'⛓', label:'Blockchain verifizieren', action:()=>setTab('content'),                              color:'#8B5CF6' },
              ].map(a=>(
                <button key={a.label} onClick={a.action}
                  style={{ padding:'13px 14px', background:'#080C14', border:`1px solid ${a.color}20`, borderRadius:12, cursor:'pointer', textAlign:'left', transition:'all .15s', display:'flex', alignItems:'center', gap:8 }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor=a.color+'50')}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor=a.color+'20')}>
                  <span style={{ fontSize:20 }}>{a.icon}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.55)', lineHeight:1.4 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTENT TAB ── */}
        {tab==='content' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.3)', letterSpacing:'.2em', textTransform:'uppercase' }}>// {CONTENT.length} Content-Stücke</div>
              <button style={{ fontFamily:"'DM Mono',monospace", fontSize:10, padding:'6px 14px', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.3)', borderRadius:7, color:'#10B981', cursor:'pointer' }}>
                + Content hochladen
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {CONTENT.map(c=>{
                const st = STATUS_META[c.status];
                return (
                  <div key={c.id} style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                      {c.platform==='YouTube'?'📺':c.platform==='TikTok'?'🎵':c.platform==='Instagram'?'📸':'🎙'}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13 }}>{c.title}</div>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.35)', marginTop:2 }}>{c.platform} · {c.size} · {c.time}</div>
                    </div>
                    {c.score && (
                      <div style={{ textAlign:'center', marginRight:8 }}>
                        <div style={{ fontWeight:900, fontSize:18, color:'#C9A84C' }}>{c.score}</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.3)' }}>Score</div>
                      </div>
                    )}
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'4px 10px', background:st.bg, color:st.c, borderRadius:20, flexShrink:0 }}>{st.l}</span>
                    {c.status==='unverified' && (
                      <button style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'4px 12px', background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.3)', borderRadius:7, color:'#C9A84C', cursor:'pointer', flexShrink:0 }}>
                        Verifizieren
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PLAN TAB ── */}
        {tab==='plan' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:17 }}>🚀 7-Tage-Promo-Plan</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#8B5CF6', marginTop:3 }}>⬡ OPTIMUS · Perplexity sonar-pro</div>
              </div>
              <button onClick={generatePlan} disabled={planLoading}
                style={{ fontFamily:"'DM Mono',monospace", fontSize:10, padding:'7px 16px', background:'rgba(201,168,76,.12)', border:'1px solid rgba(201,168,76,.3)', borderRadius:8, color:'#C9A84C', cursor:'pointer' }}>
                {planLoading?'⟳ Generiere…':'↻ Neu generieren'}
              </button>
            </div>

            {/* Static plan tiles */}
            {!plan && (
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
                {PLAN_DAYS.map((d,i)=>(
                  <div key={d.day} style={{ background:'#080C14', border:`1px solid ${d.done?'rgba(16,185,129,.2)':'#1A2130'}`, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:d.done?'rgba(16,185,129,.15)':'rgba(255,255,255,.04)', border:`1px solid ${d.done?'rgba(16,185,129,.3)':'#1A2130'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:700, color:d.done?'#10B981':'rgba(255,255,255,.4)' }}>{d.done?'✓':d.day}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.35)', marginBottom:2 }}>{d.platform}</div>
                      <div style={{ fontSize:12, color:d.done?'rgba(255,255,255,.5)':'rgba(255,255,255,.8)', textDecoration:d.done?'line-through':'none' }}>{d.action}</div>
                    </div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#C9A84C', fontWeight:700 }}>{d.coins} 🪙</div>
                  </div>
                ))}
              </div>
            )}

            {/* AI-generated plan */}
            {planLoading && (
              <div style={{ background:'#080C14', border:'1px solid rgba(139,92,246,.2)', borderRadius:14, padding:'28px', textAlign:'center', marginBottom:16 }}>
                <div style={{ display:'flex', gap:5, justifyContent:'center', marginBottom:8 }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#8B5CF6', animation:'blink 1.2s ease infinite', animationDelay:`${i*.3}s` }}/>)}
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)' }}>OPTIMUS generiert mit Perplexity Echtzeit-Trends…</div>
              </div>
            )}
            {plan && !planLoading && (
              <div style={{ background:'#080C14', border:'1px solid rgba(139,92,246,.25)', borderRadius:14, padding:'18px 22px' }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'#8B5CF6', letterSpacing:'.15em', marginBottom:12 }}>// OPTIMUS × PERPLEXITY SONAR-PRO · ECHTZEIT-DATEN</div>
                <div style={{ fontSize:12, lineHeight:1.8, color:'rgba(255,255,255,.8)' }} dangerouslySetInnerHTML={{__html:md(plan)}}/>
              </div>
            )}
          </div>
        )}

        {/* ── OPTIMUS TAB ── */}
        {tab==='optimus' && (
          <div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:17, marginBottom:4 }}>🤖 OPTIMUS × CreatorSeal</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.35)' }}>Perplexity Sonar API · Kontext: CreatorSeal Dashboard</div>
            </div>

            {/* Quick prompts */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
              {[
                '🔍 Wie verbessere ich meinen Engagement-Score von 68 auf 80+?',
                '🎯 Welche 3 Brands passen zu meinem Trust-Score 84?',
                '📡 Was sind die viralen Trends diese Woche für Creator?',
                '🚀 Erstelle meinen Promo-Plan für nächste Woche',
              ].map(p=>(
                <button key={p} onClick={()=>askOptimus(p.slice(2))}
                  style={{ padding:'10px 12px', background:'#080C14', border:'1px solid #1A2130', borderRadius:10, cursor:'pointer', textAlign:'left', fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.5)', lineHeight:1.5, transition:'border-color .15s' }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor='#374151')}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='#1A2130')}>
                  {p}
                </button>
              ))}
            </div>

            {/* Answer */}
            {optimusLoading && (
              <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:12, padding:'20px', display:'flex', gap:5, alignItems:'center', marginBottom:14 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#00D4FF', animation:'blink 1.2s ease infinite', animationDelay:`${i*.3}s` }}/>)}
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', marginLeft:6 }}>Perplexity analysiert…</span>
              </div>
            )}
            {optimusAnswer && !optimusLoading && (
              <div style={{ background:'#080C14', border:'1px solid rgba(0,212,255,.2)', borderRadius:12, padding:'16px 18px', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                  <div style={{ width:22, height:22, borderRadius:6, background:'linear-gradient(135deg,#00D4FF,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>🤖</div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#00D4FF' }}>OPTIMUS · CreatorSeal</span>
                </div>
                <div style={{ fontSize:12, lineHeight:1.8, color:'rgba(255,255,255,.8)' }} dangerouslySetInnerHTML={{__html:md(optimusAnswer)}}/>
              </div>
            )}

            {/* Input */}
            <div style={{ display:'flex', gap:8, background:'#080C14', border:'1px solid #1A2130', borderRadius:12, padding:'8px 12px' }}>
              <input value={optimusInput} onChange={e=>setOptimusinput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&optimusInput.trim()) askOptimus(); }}
                placeholder="OPTIMUS für CreatorSeal fragen…"
                style={{ flex:1, background:'transparent', border:'none', color:'rgba(255,255,255,.8)', fontFamily:"'Syne',sans-serif", fontSize:13, outline:'none' }}/>
              <button onClick={()=>askOptimus()} disabled={optimusLoading||!optimusInput.trim()}
                style={{ width:32, height:32, borderRadius:8, background:optimusInput.trim()&&!optimusLoading?'linear-gradient(135deg,#00D4FF,#0070F3)':'#1A2130', border:'none', cursor:optimusInput.trim()&&!optimusLoading?'pointer':'default', color:optimusInput.trim()?'#000':'rgba(255,255,255,.2)', fontWeight:700, fontSize:14, flexShrink:0 }}>↑</button>
            </div>
            <div style={{ marginTop:8, textAlign:'center' }}>
              <Link href="/optimus" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)', textDecoration:'none' }}>Vollbild OPTIMUS öffnen →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
