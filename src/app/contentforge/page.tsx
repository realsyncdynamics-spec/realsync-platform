'use client';
import { useState } from 'react';
import Link from 'next/link';

const FORMATS = [
  { id:'hook',   icon:'⚡', label:'TikTok Hook',      color:'#00F2EA', preview:'Diese 3 Creator-Fehler kostet dich täglich Geld — und du weißt es nicht mal.' },
  { id:'title',  icon:'📺', label:'YouTube Titel',    color:'#FF0000', preview:'Ich habe 30 Tage lang JEDEN TAG meinen Content verifiziert. Das ist passiert.' },
  { id:'caption',icon:'📸', label:'Instagram Caption',color:'#E1306C', preview:'Dein Content ist so gut — aber kennst du seinen wahren Wert? 🛡\n\nCreatorSeal gibt dir in 30 Sekunden deinen persönlichen Trust-Score. Verifiziert. Blockchain-gesichert.\n\nLink in Bio ↑' },
  { id:'thread', icon:'𝕏',  label:'X Thread',         color:'#E4E6EF', preview:'Thread: Warum die nächsten 6 Monate entscheidend für Creator sind 🧵\n\n1/ Der Markt verändert sich gerade schneller als je zuvor. Deepfakes, KI-Content, Authentizitätskrise.\n\n2/ Was unterscheidet Top-Creator? Trust. Verifikation. Echtes Engagement.' },
  { id:'script', icon:'🎬', label:'Video Skript',      color:'#C9A84C', preview:'[HOOK - 0-3 Sek]\n"Wusstest du, dass 68% aller Creator-Inhalte bereits KI-generiert oder manipuliert sind?"\n\n[PROBLEM - 3-15 Sek]\nZeige Screen: Fake-Reviews, Deepfakes, unverifizieter Content' },
  { id:'email',  icon:'📧', label:'Newsletter',        color:'#10B981', preview:'Betreff: Dein Trust-Score ist bereit\n\nHallo [Name],\n\ndu hast heute 3 neue Scans durchgeführt. Dein Score: 87/100 — über dem DACH-Durchschnitt.\n\nDeine größte Chance diese Woche: Engagement-Ratio verbessern (+5 Punkte möglich).' },
];

const STATS = [
  { v:'6',      l:'Content-Formate', c:'#C9A84C' },
  { v:'30s',    l:'Generierungszeit', c:'#10B981' },
  { v:'DACH',   l:'Markt-optimiert', c:'#00D4FF' },
  { v:'⬡',     l:'Perplexity Trends',c:'#8B5CF6' },
];

export default function ContentForgeLanding() {
  const [activeFormat, setActiveFormat] = useState('hook');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<Record<string,string>>({});

  const format = FORMATS.find(f=>f.id===activeFormat)!;

  async function generate() {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/optimus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Erstelle einen ${format.label} für das Thema "${topic}". Für DACH-Creator. Auf Deutsch. Direkt verwertbar, kein Intro.`,
          model: 'fast',
          appContext: 'ContentForge',
        }),
      });
      const d = await res.json();
      setGenerated(g => ({ ...g, [activeFormat+topic]: d.response || format.preview }));
    } catch {
      setGenerated(g => ({ ...g, [activeFormat+topic]: format.preview }));
    }
    setGenerating(false);
  }

  const currentContent = generated[activeFormat+topic] || '';

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}.fu{animation:fu .4s ease both}`}</style>

      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
          <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
          <span style={{fontWeight:800,fontSize:12,color:'#E4E6EF'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <Link href="/register?source=contentforge" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 18px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:8,color:'#000',fontWeight:700,textDecoration:'none'}}>
          Kostenlos starten
        </Link>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'60px 24px 40px'}}>

        {/* Hero */}
        <div className="fu" style={{textAlign:'center',marginBottom:48}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#C9A84C',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:14}}>
            ✍️ ContentForge · KI-Content-Generator
          </div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5vw,54px)',lineHeight:1.1,marginBottom:16}}>
            Von Idee zu viralwürdigem<br/>
            <span style={{background:'linear-gradient(90deg,#C9A84C,#8B5CF6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Content in 30 Sekunden.</span>
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.45)',maxWidth:460,margin:'0 auto 24px',lineHeight:1.8}}>
            TikTok Hooks · YouTube Titel · Instagram Captions · X Threads<br/>
            Video-Skripte · Newsletter · OPTIMUS mit Echtzeit-Trends
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

        {/* Live Generator */}
        <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.2)',borderRadius:20,padding:'28px',marginBottom:32}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#C9A84C',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:18}}>// LIVE GENERATOR · Probiere es jetzt</div>

          {/* Format tabs */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
            {FORMATS.map(f=>(
              <button key={f.id} onClick={()=>setActiveFormat(f.id)}
                style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',background:activeFormat===f.id?f.color+'18':'rgba(255,255,255,.04)',border:`1px solid ${activeFormat===f.id?f.color+'50':'#1A2130'}`,borderRadius:8,cursor:'pointer',color:activeFormat===f.id?f.color:'rgba(255,255,255,.4)',fontFamily:"'DM Mono',monospace",fontSize:10,transition:'all .15s',fontWeight:activeFormat===f.id?700:400}}>
                <span>{f.icon}</span>{f.label}
              </button>
            ))}
          </div>

          {/* Topic input */}
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==='Enter'&&topic.trim()&&generate()}
              placeholder={`Thema für ${format.label}... z.B. "Creator-Tools 2026" oder "Deepfake-Schutz"`}
              style={{flex:1,background:'#0B0F18',border:'1px solid rgba(201,168,76,.3)',borderRadius:9,padding:'11px 14px',color:'rgba(255,255,255,.85)',fontFamily:"'DM Mono',monospace",fontSize:12,outline:'none'}}
              onFocus={e=>e.target.style.borderColor='#C9A84C'}
              onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.3)'}/>
            <button onClick={generate} disabled={generating||!topic.trim()}
              style={{padding:'11px 24px',background:topic.trim()&&!generating?'linear-gradient(135deg,#C9A84C,#FFD700)':'#1A2130',border:'none',borderRadius:9,color:topic.trim()&&!generating?'#000':'rgba(255,255,255,.2)',fontFamily:"'DM Mono',monospace",fontSize:11,cursor:topic.trim()&&!generating?'pointer':'default',fontWeight:700,minWidth:120,transition:'all .2s'}}>
              {generating?(
                <span style={{display:'flex',gap:3,alignItems:'center',justifyContent:'center'}}>
                  {[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'#C9A84C',display:'inline-block',animation:'blink 1.2s ease infinite',animationDelay:`${i*.3}s`}}/>)}
                </span>
              ):`✍️ Generieren`}
            </button>
          </div>

          {/* Preview / Output */}
          <div style={{background:'#0B0F18',border:`1px solid ${format.color}25`,borderRadius:12,padding:'18px',minHeight:120}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
              <span style={{fontSize:16}}>{format.icon}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:format.color}}>{format.label}</span>
              {currentContent && (
                <button onClick={()=>navigator.clipboard?.writeText(currentContent)}
                  style={{marginLeft:'auto',fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 8px',background:'rgba(255,255,255,.06)',border:'1px solid #1A2130',borderRadius:4,color:'rgba(255,255,255,.3)',cursor:'pointer'}}>
                  📋 Kopieren
                </button>
              )}
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.7)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>
              {currentContent || format.preview}
            </div>
          </div>

          {/* Example topics */}
          {!topic && (
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:10}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.2)',alignSelf:'center'}}>Beispiele:</span>
              {['Creator-Tools 2026','Trust-Score für Creator','Deepfake-Schutz'].map(t=>(
                <button key={t} onClick={()=>setTopic(t)}
                  style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 8px',background:'rgba(201,168,76,.08)',border:'1px solid rgba(201,168,76,.2)',borderRadius:20,color:'#C9A84C',cursor:'pointer'}}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',background:'linear-gradient(135deg,rgba(201,168,76,.06),rgba(139,92,246,.04))',border:'1px solid rgba(201,168,76,.15)',borderRadius:20,padding:'44px 24px'}}>
          <div style={{fontSize:40,marginBottom:14}}>✍️</div>
          <h2 style={{fontWeight:900,fontSize:26,marginBottom:10}}>Content-Maschine an. Jeden Tag.</h2>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:24,lineHeight:1.8}}>
            Alle 6 Formate · ScheduleMaster-Integration · OPTIMUS-Trends<br/>
            Ab Bronze €19,00/Mo · Heute kostenlos starten
          </p>
          <Link href="/register?source=contentforge"
            style={{padding:'13px 32px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:12,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,textDecoration:'none',boxShadow:'0 4px 24px rgba(201,168,76,.35)'}}>
            🚀 Kostenlos starten
          </Link>
        </div>
      </div>
    </div>
  );
}
