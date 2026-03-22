'use client';
import { useState } from 'react';
import Link from 'next/link';

const STATS = [
  { v:'12.400+', l:'Aktive Waitlists', c:'#8B5CF6' },
  { v:'3,2x',    l:'Viraler Multiplikator', c:'#10B981' },
  { v:'47%',     l:'Referral-Rate', c:'#C9A84C' },
  { v:'48h',     l:'Ø bis Launch', c:'#00D4FF' },
];

const SEQUENCE = [
  { step:'01', title:'Waitlist erstellen',   desc:'In 2 Minuten live · Custom Domain · Branding', icon:'🚀', color:'#8B5CF6' },
  { step:'02', title:'Referral-Loop aktiv', desc:'Jeder Signup bekommt seinen persönlichen Link', icon:'🔗', color:'#10B981' },
  { step:'03', title:'Viraler Effekt',      desc:'Ø 3,2 weitere Signups pro initialem Signup', icon:'📈', color:'#C9A84C' },
  { step:'04', title:'Launch mit Daten',    desc:'Segmentierung · Analytics · E-Mail-Sequenz', icon:'🎯', color:'#00D4FF' },
];

const DEMO_WAITLIST = [
  { pos:1,  name:'Max K.',    ref:12, joined:'vor 2h',  badge:'👑 Top' },
  { pos:2,  name:'Lisa M.',   ref:8,  joined:'vor 3h',  badge:'🔥 Hot' },
  { pos:3,  name:'Tom S.',    ref:6,  joined:'vor 5h',  badge:null     },
  { pos:47, name:'Du',        ref:0,  joined:'gerade',  badge:'NEU'    },
];

export default function WaitlistKitLanding() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [pos, setPos] = useState(0);
  const [loading, setLoading] = useState(false);

  async function joinDemo() {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setPos(Math.floor(Math.random() * 40) + 20);
    setJoined(true);
    setLoading(false);
  }

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}.fu{animation:fu .4s ease both}@keyframes bump{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}`}</style>

      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
          <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
          <span style={{fontWeight:800,fontSize:12,color:'#E4E6EF'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <Link href="/register?source=waitlistkit" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 18px',background:'linear-gradient(135deg,#8B5CF6,#6D28D9)',borderRadius:8,color:'white',fontWeight:700,textDecoration:'none'}}>
          Kostenlos starten
        </Link>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'60px 24px 40px'}}>

        {/* Hero */}
        <div className="fu" style={{textAlign:'center',marginBottom:52}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8B5CF6',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:14}}>
            🚀 WaitlistKit · Viral Waitlist Builder
          </div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5vw,56px)',lineHeight:1.1,marginBottom:16}}>
            Baue Hype.<br/>
            <span style={{background:'linear-gradient(90deg,#8B5CF6,#EC4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Wachse viral.</span><br/>
            Launche mit Momentum.
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.45)',maxWidth:460,margin:'0 auto 24px',lineHeight:1.8}}>
            Waitlist erstellen · Referral-Loop · Analytics · E-Mail-Sequenz<br/>
            Ø 3,2x viraler Multiplikator · Jetzt live testen.
          </p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            {STATS.map(s=>(
              <div key={s.l} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:10,padding:'10px 18px',textAlign:'center'}}>
                <div style={{fontWeight:900,fontSize:20,color:s.c}}>{s.v}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE DEMO — join the demo waitlist */}
        <div style={{background:'#080C14',border:'1px solid rgba(139,92,246,.25)',borderRadius:20,padding:'32px',marginBottom:32,maxWidth:520,margin:'0 auto 32px'}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#8B5CF6',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:14}}>// LIVE DEMO · Tritt dieser Waitlist bei</div>
          <div style={{fontWeight:800,fontSize:18,marginBottom:6}}>RealSync Creator OS — Early Access</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',marginBottom:20}}>
            Bereits <strong style={{color:'#8B5CF6'}}>4.847</strong> Creator auf der Liste
          </div>

          {/* Waitlist slots */}
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
            {DEMO_WAITLIST.map(u=>(
              <div key={u.pos} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:u.pos===47&&joined?'rgba(139,92,246,.1)':'rgba(255,255,255,.03)',border:`1px solid ${u.pos===47&&joined?'rgba(139,92,246,.3)':'rgba(255,255,255,.06)'}`,borderRadius:9}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(139,92,246,.15)',border:'1px solid rgba(139,92,246,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8B5CF6',flexShrink:0,fontWeight:700}}>
                  {u.pos===47&&joined?pos:u.pos}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12,color:u.pos===47?'#8B5CF6':'rgba(255,255,255,.7)'}}>{u.pos===47?'Du':u.name}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:1}}>{u.ref>0?`${u.ref} Referrals · `:''}{u.joined}</div>
                </div>
                {u.badge&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:'rgba(139,92,246,.15)',border:'1px solid rgba(139,92,246,.3)',borderRadius:3,color:'#8B5CF6'}}>{u.badge}</span>}
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)'}}>#{u.pos===47&&joined?pos:u.pos}</div>
              </div>
            ))}
          </div>

          {!joined ? (
            <div>
              <div style={{display:'flex',gap:8}}>
                <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&email&&joinDemo()}
                  placeholder="deine@email.de"
                  style={{flex:1,background:'#0B0F18',border:'1px solid rgba(139,92,246,.3)',borderRadius:9,padding:'11px 14px',color:'rgba(255,255,255,.85)',fontFamily:"'DM Mono',monospace",fontSize:12,outline:'none'}}/>
                <button onClick={joinDemo} disabled={loading||!email.trim()}
                  style={{padding:'11px 20px',background:email.trim()&&!loading?'linear-gradient(135deg,#8B5CF6,#6D28D9)':'#1A2130',border:'none',borderRadius:9,color:email.trim()&&!loading?'white':'rgba(255,255,255,.25)',fontFamily:"'DM Mono',monospace",fontSize:11,cursor:email.trim()&&!loading?'pointer':'default',fontWeight:700,minWidth:90,transition:'all .2s'}}>
                  {loading?<span style={{display:'flex',gap:3,alignItems:'center',justifyContent:'center'}}>{[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'#8B5CF6',display:'inline-block',animation:'blink 1.2s ease infinite',animationDelay:`${i*.3}s`}}/>)}</span>:'Beitreten'}
                </button>
              </div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.2)',marginTop:8,textAlign:'center'}}>🔒 Kein Spam · Jederzeit abmeldbar · DSGVO konform</div>
            </div>
          ) : (
            <div style={{background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.25)',borderRadius:12,padding:'16px',textAlign:'center'}}>
              <div style={{fontSize:28,marginBottom:8}}>🎉</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:4,color:'#10B981'}}>Du bist auf Platz #{pos}!</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.5)',marginBottom:12}}>Lade 3 Freunde ein um auf Platz #{Math.max(1,pos-15)} zu steigen</div>
              <div style={{background:'#080C14',border:'1px solid rgba(139,92,246,.25)',borderRadius:8,padding:'10px',fontFamily:"'DM Mono',monospace",fontSize:10,color:'#8B5CF6'}}>
                🔗 realsync.de/waitlist?ref=demo-{Math.random().toString(36).slice(2,8)}
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:40}}>
          {SEQUENCE.map((s,i)=>(
            <div key={s.step} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:14,padding:'18px',textAlign:'center',position:'relative'}}>
              {i<3&&<div style={{position:'absolute',top:'50%',right:-7,width:14,height:2,background:'linear-gradient(90deg,#1A2130,transparent)',transform:'translateY(-50%)'}}/>}
              <div style={{fontSize:26,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:s.color,letterSpacing:'.1em',marginBottom:5}}>SCHRITT {s.step}</div>
              <div style={{fontWeight:800,fontSize:13,marginBottom:5}}>{s.title}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',background:'linear-gradient(135deg,rgba(139,92,246,.06),rgba(236,72,153,.04))',border:'1px solid rgba(139,92,246,.15)',borderRadius:20,padding:'44px 24px'}}>
          <div style={{fontSize:40,marginBottom:14}}>🚀</div>
          <h2 style={{fontWeight:900,fontSize:26,marginBottom:10}}>Deine nächste Waitlist. In 2 Minuten.</h2>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:24,lineHeight:1.8}}>
            Kostenlos starten · Custom Domain · Referral-Loop · Analytics<br/>
            Bereits in 50+ Creator-Launches im Einsatz
          </p>
          <Link href="/register?source=waitlistkit"
            style={{padding:'13px 32px',background:'linear-gradient(135deg,#8B5CF6,#6D28D9)',borderRadius:12,color:'white',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,textDecoration:'none',boxShadow:'0 4px 24px rgba(139,92,246,.35)'}}>
            🚀 Kostenlos starten
          </Link>
        </div>
      </div>
    </div>
  );
}
