'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const BRANDS = [
  { id:'b1', name:'TechGear Pro',    niche:'Tech',     budget:'€500–2.000', fit:94, logo:'⚡', color:'#00D4FF', type:'Affiliate',  contacts:3, status:'offen'  },
  { id:'b2', name:'CloudHost DE',    niche:'Tech',     budget:'€400–1.500', fit:91, logo:'☁️', color:'#3B82F6', type:'Affiliate',  contacts:1, status:'aktiv'  },
  { id:'b3', name:'CreatorFuel',     niche:'Lifestyle',budget:'€200–800',   fit:88, logo:'🔋', color:'#10B981', type:'Sponsored',  contacts:2, status:'offen'  },
  { id:'b4', name:'DesignKit Studio',niche:'Design',   budget:'€300–1.200', fit:85, logo:'🎨', color:'#8B5CF6', type:'Brand Deal', contacts:1, status:'offen'  },
  { id:'b5', name:'GreenBrand DE',   niche:'Lifestyle',budget:'€250–900',   fit:83, logo:'🌱', color:'#10B981', type:'Brand Deal', contacts:0, status:'neu'    },
  { id:'b6', name:'LearnNow',        niche:'Education',budget:'€150–600',   fit:79, logo:'📚', color:'#F59E0B', type:'Sponsored',  contacts:0, status:'neu'    },
];

const DEAL_STATS = [
  { v:'€6.400', l:'Max. monatl. Potenzial', c:'#C9A84C' },
  { v:'6',      l:'Brand-Matches',          c:'#00D4FF' },
  { v:'91%',    l:'Ø Fit-Score',            c:'#10B981' },
  { v:'€0,50',  l:'Pro Coin · OPTIMUS',     c:'#8B5CF6' },
];

export default function DealFlowPage() {
  const [recLoading, setRecLoading] = useState(false);
  const [rec, setRec] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string|null>(null);
  const [applying, setApplying] = useState<string|null>(null);
  const [applied, setApplied] = useState<string[]>([]);

  async function getRecommendations() {
    setRecLoading(true);
    try {
      const res = await fetch('/api/dealflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: '@dominik_steiner', score: 87, niche: 'Tech' }),
      });
      const d = await res.json();
      setRec(d.recommendations || '');
    } catch { setRec('Fehler beim Laden.'); }
    setRecLoading(false);
  }

  async function apply(brandId: string) {
    setApplying(brandId);
    await new Promise(r => setTimeout(r, 1500));
    setApplied(a => [...a, brandId]);
    setApplying(null);
  }

  const md = (t: string) => t
    .replace(/^## (.+)$/gm,'<div style="font-size:14px;font-weight:800;color:#C9A84C;margin:14px 0 6px">$1</div>')
    .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#E4E6EF">$1</strong>')
    .replace(/^▸ (.+)$/gm,'<div style="display:flex;gap:6px;margin:2px 0"><span style="color:#10B981">▸</span><span>$1</span></div>')
    .replace(/\n/g,'<br/>');

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.fu{animation:fu .4s ease both}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Hub</Link>
          <span style={{color:'#1A2130'}}>|</span>
          <span style={{fontWeight:800,fontSize:14}}>🎯 DealFlow</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'2px 8px',background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.25)',borderRadius:4,color:'#10B981'}}>6 Matches · DACH</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Link href="/creatorseal" style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'4px 10px',background:'rgba(201,168,76,.1)',border:'1px solid rgba(201,168,76,.25)',borderRadius:6,color:'#C9A84C',textDecoration:'none'}}>← CreatorSeal</Link>
          <Link href="/optimus" style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'4px 10px',background:'rgba(139,92,246,.1)',border:'1px solid rgba(139,92,246,.25)',borderRadius:6,color:'#8B5CF6',textDecoration:'none'}}>🤖 OPTIMUS</Link>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'28px 20px'}}>
        {/* Hero */}
        <div className="fu" style={{marginBottom:28}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#10B981',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#10B981',display:'inline-block'}}/>
            Trust-Score 87/100 · Brand-Deal-Matching aktiv
          </div>
          <h1 style={{fontWeight:900,fontSize:'clamp(22px,3.5vw,36px)',lineHeight:1.1,marginBottom:10}}>
            Deine Brand-Deal-Matches<br/>
            <span style={{background:'linear-gradient(90deg,#10B981,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>basierend auf deinem Trust-Score</span>
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:20}}>
            OPTIMUS × Perplexity analysiert Brands die zu deinem Content-Profil passen
          </p>

          {/* Stats */}
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {DEAL_STATS.map(s=>(
              <div key={s.l} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:10,padding:'10px 16px',textAlign:'center'}}>
                <div style={{fontWeight:900,fontSize:18,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:16,alignItems:'start'}}>
          {/* Brand cards */}
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:12}}>// Brand-Matches · Score ≥67</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {BRANDS.map(b=>{
                const isApplied = applied.includes(b.id);
                const isApplying = applying === b.id;
                return (
                  <div key={b.id}
                    style={{background:selectedBrand===b.id?'rgba(255,255,255,.04)':'#080C14',border:`1px solid ${selectedBrand===b.id?b.color+'50':'#1A2130'}`,borderRadius:14,padding:'16px 18px',cursor:'pointer',transition:'all .15s',position:'relative',overflow:'hidden'}}
                    onClick={()=>setSelectedBrand(selectedBrand===b.id?null:b.id)}>
                    {b.status==='neu'&&<div style={{position:'absolute',top:10,right:10,fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.3)',borderRadius:3,color:'#10B981'}}>NEU</div>}
                    {b.status==='aktiv'&&<div style={{position:'absolute',top:10,right:10,fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:'rgba(0,212,255,.15)',border:'1px solid rgba(0,212,255,.3)',borderRadius:3,color:'#00D4FF'}}>AKTIV</div>}

                    <div style={{display:'flex',alignItems:'center',gap:14}}>
                      <div style={{width:44,height:44,borderRadius:12,background:b.color+'15',border:`1px solid ${b.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{b.logo}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:14,marginBottom:2}}>{b.name}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)'}}>{b.type} · {b.niche} · {b.budget}/Mo</div>
                      </div>
                      <div style={{textAlign:'center',flexShrink:0}}>
                        <div style={{fontWeight:900,fontSize:20,color:b.color}}>{b.fit}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)'}}>Fit-%</div>
                      </div>
                    </div>

                    {/* Fit bar */}
                    <div style={{height:3,background:'#1A2130',borderRadius:2,overflow:'hidden',marginTop:12}}>
                      <div style={{height:'100%',background:`linear-gradient(90deg,${b.color}60,${b.color})`,width:`${b.fit}%`,borderRadius:2}}/>
                    </div>

                    {selectedBrand===b.id&&(
                      <div style={{marginTop:14,display:'flex',gap:8}}>
                        <button onClick={e=>{e.stopPropagation();apply(b.id)}} disabled={isApplied||isApplying}
                          style={{flex:1,padding:'9px',background:isApplied?'rgba(16,185,129,.15)':isApplying?'rgba(201,168,76,.1)':'linear-gradient(135deg,#10B981,#059669)',border:isApplied?'1px solid rgba(16,185,129,.3)':'none',borderRadius:8,color:isApplied?'#10B981':isApplying?'#C9A84C':'#000',fontFamily:"'DM Mono',monospace",fontSize:10,cursor:isApplied?'default':'pointer',fontWeight:700}}>
                          {isApplied?'✓ Beworben':isApplying?'⟳ Sende...':'📨 Jetzt bewerben'}
                        </button>
                        <button onClick={e=>{e.stopPropagation();}} style={{padding:'9px 14px',background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.25)',borderRadius:8,color:'#00D4FF',fontFamily:"'DM Mono',monospace",fontSize:10,cursor:'pointer'}}>
                          💬 Nachricht
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* OPTIMUS sidebar */}
          <div style={{position:'sticky',top:70}}>
            <div style={{background:'#080C14',border:'1px solid rgba(139,92,246,.25)',borderRadius:16,padding:'20px',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#00D4FF,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🤖</div>
                <div>
                  <div style={{fontWeight:800,fontSize:13}}>OPTIMUS Analyse</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'#8B5CF6'}}>Perplexity sonar-pro · 🪙 20 Coins</div>
                </div>
              </div>

              {!rec?(
                <>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',lineHeight:1.6,marginBottom:14}}>
                    OPTIMUS analysiert dein Profil und empfiehlt die 5 besten Brand-Deal-Strategien via Perplexity Echtzeit-Daten.
                  </p>
                  <button onClick={getRecommendations} disabled={recLoading}
                    style={{width:'100%',padding:'10px',background:recLoading?'rgba(139,92,246,.1)':'linear-gradient(135deg,#8B5CF6,#6D28D9)',border:recLoading?'1px solid rgba(139,92,246,.3)':'none',borderRadius:10,color:recLoading?'#8B5CF6':'white',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,cursor:recLoading?'default':'pointer'}}>
                    {recLoading?(
                      <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                        {[0,1,2].map(i=><span key={i} style={{width:5,height:5,borderRadius:'50%',background:'#8B5CF6',display:'inline-block',animation:'blink 1.2s ease infinite',animationDelay:`${i*.3}s`}}/>)}
                        <span>Analysiere...</span>
                      </span>
                    ):'🎯 KI-Analyse starten'}
                  </button>
                </>
              ):(
                <div style={{maxHeight:300,overflowY:'auto'}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(139,92,246,.6)',letterSpacing:'.15em',marginBottom:8}}>// OPTIMUS × PERPLEXITY</div>
                  <div style={{fontSize:11,lineHeight:1.7,color:'rgba(255,255,255,.75)'}} dangerouslySetInnerHTML={{__html:md(rec)}}/>
                  <button onClick={()=>setRec('')} style={{marginTop:10,width:'100%',padding:'7px',background:'transparent',border:'1px solid #1A2130',borderRadius:7,color:'rgba(255,255,255,.3)',fontFamily:"'DM Mono',monospace",fontSize:9,cursor:'pointer'}}>← Neu</button>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:12,padding:'16px'}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.15em',marginBottom:12}}>// DEAL-PIPELINE</div>
              {[
                { label:'Aktive Deals',   v:'1', c:'#00D4FF' },
                { label:'Bewerbungen',    v:`${applied.length}`, c:'#10B981' },
                { label:'Offen',          v:`${BRANDS.length-1-applied.length}`, c:'#F59E0B' },
                { label:'Monat. Potenzial',v:'€6.400', c:'#C9A84C' },
              ].map(s=>(
                <div key={s.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)'}}>{s.label}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:s.c}}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
