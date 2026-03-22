'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PLATFORMS = [
  { id:'youtube',   name:'YouTube',   icon:'📺', color:'#FF4444' },
  { id:'tiktok',    name:'TikTok',    icon:'🎵', color:'#00F2EA' },
  { id:'instagram', name:'Instagram', icon:'📸', color:'#E1306C' },
  { id:'x',         name:'X / Twitter',icon:'𝕏', color:'#E4E6EF' },
  { id:'linkedin',  name:'LinkedIn',  icon:'💼', color:'#0A66C2' },
  { id:'facebook',  name:'Facebook',  icon:'🔵', color:'#1877F2' },
];

const FACTORS = [
  { icon:'🛡', label:'C2PA 2.3',      color:'#10B981' },
  { icon:'⛓', label:'Blockchain',    color:'#8B5CF6' },
  { icon:'🤖', label:'Deepfake-Scan', color:'#00D4FF' },
  { icon:'📸', label:'Style-Check',   color:'#C9A84C' },
  { icon:'📊', label:'Engagement',    color:'#F59E0B' },
  { icon:'🎯', label:'Brand-Fitness', color:'#EC4899' },
];

const SCAN_STEPS = ['C2PA-Signatur prüfen','Deepfake-Scan','Engagement berechnen','Brand-Fitness analysieren','Trust-Score generieren'];

function Content() {
  const router = useRouter();
  const params = useSearchParams();
  const initScore = parseInt(params.get('score') || '87');

  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState<string[]>(['youtube','instagram']);
  const [scanStep, setScanStep] = useState(-1);
  const [scanDone, setScanDone] = useState(false);
  const [plan, setPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const scores = FACTORS.map((f,i) => ({ ...f, score: [92,88,97,74,68,85][i] }));

  function toggle(id: string) {
    setPlatforms(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  }

  async function runScan() {
    setStep(2); setScanStep(0);
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setScanStep(i + 1);
    }
    setScanDone(true);
  }

  async function genPlan() {
    setStep(3); setLoadingPlan(true);
    try {
      const res = await fetch('/api/creatorseal/promo-plan', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ handle:'@mein_creator', score:initScore, niche:'Creator Tools', platforms, trustFactors:scores }),
      });
      const d = await res.json();
      setPlan(d.plan || '');
    } catch { setPlan('Fehler beim Laden.'); }
    setLoadingPlan(false);
  }

  const md = (t:string) => t
    .replace(/^## (.+)$/gm,'<div style="font-size:13px;font-weight:800;color:#C9A84C;margin:14px 0 5px">$1</div>')
    .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#E4E6EF">$1</strong>')
    .replace(/^▸ (.+)$/gm,'<div style="display:flex;gap:6px;margin:3px 0"><span style="color:#8B5CF6">▸</span><span>$1</span></div>')
    .replace(/\n/g,'<br/>');

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}.fu{animation:fu .4s ease both}`}</style>

      {/* Header */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:13,height:13,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2.5,background:'#C9A84C'}}/></div>
          <span style={{fontWeight:800,fontSize:13}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)'}}>🛡 CreatorSeal · Schritt {step+1}/4</div>
      </div>

      {/* Progress */}
      <div style={{height:3,background:'#0D1117'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#C9A84C,#FFD700)',width:`${(step+1)*25}%`,transition:'width .5s'}}/>
      </div>

      <div style={{maxWidth:520,margin:'0 auto',padding:'36px 20px'}}>

        {/* STEP 0 – Score */}
        {step===0 && (
          <div className="fu">
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:44,marginBottom:10}}>🛡</div>
              <h1 style={{fontWeight:900,fontSize:24,marginBottom:6}}>Dein Trust-Score ist bereit!</h1>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.7}}>
                Verbinde jetzt deine Plattformen<br/>und erhalte deinen 7-Tage-Promo-Plan.
              </p>
            </div>

            <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.35)',borderRadius:16,padding:'22px',marginBottom:20,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#C9A84C,#FFD700)'}}/>
              <div style={{textAlign:'center',marginBottom:16}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#C9A84C',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:4}}>Creator Trust-Score</div>
                <div style={{fontWeight:900,fontSize:60,color:'#C9A84C',lineHeight:1}}>{initScore}<span style={{fontSize:22,color:'rgba(201,168,76,.5)' }}>/100</span></div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#10B981',marginTop:4}}>↑ Über DACH-Durchschnitt (Ø 84)</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
                {scores.map(f=>(
                  <div key={f.label} style={{display:'flex',gap:7,alignItems:'center',background:'rgba(255,255,255,.03)',borderRadius:7,padding:'6px 10px'}}>
                    <span style={{fontSize:14,flexShrink:0}}>{f.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{height:3,background:'#1A2130',borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',background:f.color,width:`${f.score}%`,borderRadius:2}}/>
                      </div>
                    </div>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:f.color,minWidth:20,textAlign:'right'}}>{f.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={()=>setStep(1)} style={{width:'100%',padding:'13px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',border:'none',borderRadius:12,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,cursor:'pointer'}}>
              Plattformen verbinden →
            </button>
          </div>
        )}

        {/* STEP 1 – Platforms */}
        {step===1 && (
          <div className="fu">
            <div style={{textAlign:'center',marginBottom:22}}>
              <div style={{fontSize:36,marginBottom:8}}>📱</div>
              <h2 style={{fontWeight:900,fontSize:22,marginBottom:5}}>Deine Plattformen</h2>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)'}}>Für deinen personalisierten Promo-Plan</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:22}}>
              {PLATFORMS.map(p=>(
                <button key={p.id} onClick={()=>toggle(p.id)}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',background:platforms.includes(p.id)?p.color+'12':'#080C14',border:`1px solid ${platforms.includes(p.id)?p.color+'50':'#1A2130'}`,borderRadius:11,cursor:'pointer',textAlign:'left',transition:'all .15s'}}>
                  <span style={{fontSize:20,flexShrink:0}}>{p.icon}</span>
                  <span style={{fontWeight:700,fontSize:12,color:platforms.includes(p.id)?p.color:'rgba(255,255,255,.55)',flex:1}}>{p.name}</span>
                  {platforms.includes(p.id)&&<span style={{color:p.color,fontSize:14}}>✓</span>}
                </button>
              ))}
            </div>
            <button onClick={runScan} disabled={!platforms.length}
              style={{width:'100%',padding:'13px',background:platforms.length?'linear-gradient(135deg,#C9A84C,#FFD700)':'#1A2130',border:'none',borderRadius:12,color:platforms.length?'#000':'rgba(255,255,255,.3)',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,cursor:platforms.length?'pointer':'default',transition:'all .2s'}}>
              🔍 Erstscan starten →
            </button>
          </div>
        )}

        {/* STEP 2 – Scan */}
        {step===2 && (
          <div className="fu" style={{textAlign:'center'}}>
            <div style={{fontSize:44,marginBottom:12}}>{scanDone?'✅':'🔍'}</div>
            <h2 style={{fontWeight:900,fontSize:22,marginBottom:6}}>{scanDone?'Scan abgeschlossen!':'Analysiere deine Plattformen…'}</h2>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:22}}>
              {scanDone?`${platforms.length} Plattformen analysiert`:'C2PA · Deepfake · Brand · Engagement'}
            </p>
            <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.2)',borderRadius:14,padding:'18px',marginBottom:20,textAlign:'left'}}>
              {SCAN_STEPS.map((s,i)=>(
                <div key={s} style={{display:'flex',alignItems:'center',gap:10,marginBottom:i<4?10:0}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:scanStep>i?'rgba(16,185,129,.2)':scanStep===i?'rgba(201,168,76,.2)':'rgba(255,255,255,.04)',border:`1px solid ${scanStep>i?'#10B981':scanStep===i?'#C9A84C':'#1A2130'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,flexShrink:0,color:scanStep>i?'#10B981':scanStep===i?'#C9A84C':'rgba(255,255,255,.2)',fontWeight:700}}>
                    {scanStep>i?'✓':scanStep===i?<span style={{animation:'blink 1s ease infinite',display:'inline-block'}}>●</span>:'○'}
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:scanStep>i?'#10B981':scanStep===i?'#C9A84C':'rgba(255,255,255,.3)'}}>{s}</span>
                </div>
              ))}
            </div>
            {scanDone&&(
              <button onClick={genPlan} style={{width:'100%',padding:'13px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',border:'none',borderRadius:12,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,cursor:'pointer'}}>
                🚀 7-Tage-Plan mit OPTIMUS generieren →
              </button>
            )}
          </div>
        )}

        {/* STEP 3 – Plan */}
        {step===3 && (
          <div className="fu">
            <div style={{textAlign:'center',marginBottom:18}}>
              <div style={{fontSize:36,marginBottom:8}}>🚀</div>
              <h2 style={{fontWeight:900,fontSize:22,marginBottom:4}}>Dein 7-Tage-Promo-Plan</h2>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8B5CF6'}}>⬡ OPTIMUS · Perplexity sonar-pro · Echtzeit-Trends</div>
            </div>

            {loadingPlan?(
              <div style={{background:'#080C14',border:'1px solid rgba(139,92,246,.25)',borderRadius:14,padding:'32px',textAlign:'center'}}>
                <div style={{display:'flex',gap:5,justifyContent:'center',marginBottom:10}}>
                  {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:'#8B5CF6',animation:`blink 1.2s ease infinite`,animationDelay:`${i*.3}s`}}/>)}
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)'}}>OPTIMUS generiert deinen Plan via Perplexity…</div>
              </div>
            ):plan?(
              <>
                <div style={{background:'#080C14',border:'1px solid rgba(139,92,246,.25)',borderRadius:14,padding:'18px 20px',marginBottom:14,maxHeight:320,overflowY:'auto'}}>
                  <div style={{fontSize:12,lineHeight:1.8,color:'rgba(255,255,255,.8)'}} dangerouslySetInnerHTML={{__html:md(plan)}}/>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>router.push('/apps/creatorseal/dashboard')}
                    style={{flex:1,padding:'12px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',border:'none',borderRadius:11,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,cursor:'pointer'}}>
                    🎬 Zum CreatorSeal Dashboard →
                  </button>
                  <button onClick={()=>router.push('/hub')}
                    style={{padding:'12px 14px',background:'transparent',border:'1px solid #1A2130',borderRadius:11,color:'rgba(255,255,255,.4)',fontFamily:"'DM Mono',monospace",fontSize:11,cursor:'pointer'}}>Hub</button>
                </div>
              </>
            ):null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div style={{minHeight:'100vh',background:'#03050A'}}/>}><Content/></Suspense>;
}
