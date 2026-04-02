'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEMO_REVIEWS = [
  { id:'r1', platform:'Google',    stars:2, text:'Lieferung dauerte 3 Wochen, kein Update. Sehr enttäuscht.', time:'vor 2h',  urgency:'hoch'   },
  { id:'r2', platform:'Trustpilot',stars:1, text:'Support antwortet nicht. Absolut inakzeptabel!',            time:'vor 5h',  urgency:'kritisch'},
  { id:'r3', platform:'Google',    stars:4, text:'Tolles Produkt aber Verpackung war beschädigt.',             time:'vor 1d',  urgency:'mittel' },
  { id:'r4', platform:'App Store', stars:3, text:'Nützliche App, aber crashes auf iOS 17.2.',                  time:'vor 2d',  urgency:'mittel' },
];

const PLATFORMS = ['Google', 'Trustpilot', 'App Store', 'Yelp', 'Amazon'];
const STATS = [
  { v:'4.7★', l:'Ø Bewertung',      c:'#C9A84C' },
  { v:'<3 Min', l:'Antwortzeit',    c:'#10B981' },
  { v:'89%',  l:'Sentiment +',      c:'#00D4FF' },
  { v:'5',    l:'Plattformen',      c:'#8B5CF6' },
];

export default function ReviewRadarLanding() {
  const [activeReview, setActiveReview] = useState<string|null>(null);
  const [generating, setGenerating] = useState<string|null>(null);
  const [replies, setReplies] = useState<Record<string,string>>({});
  const [demoMode, setDemoMode] = useState(false);

  async function generateReply(review: typeof DEMO_REVIEWS[0]) {
    setGenerating(review.id);
    try {
      const res = await fetch('/api/optimus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Schreib eine professionelle, empathische Antwort auf diese ${review.stars}-Sterne-Bewertung auf ${review.platform}: "${review.text}". Auf Deutsch. Max 3 Sätze. Lösungsorientiert.`,
          model: 'fast',
          appContext: 'ReviewRadar',
        }),
      });
      const d = await res.json();
      setReplies(r => ({ ...r, [review.id]: d.response || 'KI-Antwort generiert...' }));
    } catch {
      setReplies(r => ({ ...r, [review.id]: 'Vielen Dank für Ihr Feedback. Wir nehmen Ihre Erfahrung sehr ernst und werden uns umgehend darum kümmern. Bitte kontaktieren Sie unseren Support direkt für eine schnelle Lösung.' }));
    }
    setGenerating(null);
  }

  const urgencyColor = (u: string) => u==='kritisch'?'#EF4444':u==='hoch'?'#F59E0B':'#6B7280';

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}.fu{animation:fu .4s ease both}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
            <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
            <span style={{fontWeight:800,fontSize:12,color:'#E4E6EF'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
          </Link>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Link href="/pricing" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',textDecoration:'none',padding:'5px 10px'}}>Pakete</Link>
          <Link href="/register?source=reviewradar" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 18px',background:'linear-gradient(135deg,#C9A84C,#FFD700)',borderRadius:8,color:'#000',fontWeight:700,textDecoration:'none'}}>
            Kostenlos starten
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{maxWidth:1000,margin:'0 auto',padding:'60px 24px 40px'}}>
        <div style={{textAlign:'center',marginBottom:48}} className="fu">
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#00D4FF',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:14}}>
            ⭐ ReviewRadar · KI-Review-Management
          </div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5vw,54px)',lineHeight:1.1,marginBottom:16}}>
            Beantworte alle Reviews<br/>
            <span style={{background:'linear-gradient(90deg,#00D4FF,#8B5CF6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>in unter 3 Minuten</span> — mit KI.
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.45)',maxWidth:480,margin:'0 auto 24px',lineHeight:1.8}}>
            Google · Trustpilot · App Store · Yelp · Amazon<br/>
            OPTIMUS + Perplexity generiert professionelle Antworten automatisch.
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

        {/* LIVE DEMO */}
        <div style={{background:'#080C14',border:'1px solid rgba(0,212,255,.2)',borderRadius:20,padding:'28px',marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#00D4FF',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:4}}>// LIVE DEMO</div>
              <div style={{fontWeight:800,fontSize:16}}>Echte Reviews · KI-Antworten testen</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {PLATFORMS.map(p=>(
                <span key={p} style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:'3px 8px',background:'rgba(255,255,255,.05)',border:'1px solid #1A2130',borderRadius:4,color:'rgba(255,255,255,.4)'}}>{p}</span>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {DEMO_REVIEWS.map(r=>(
              <div key={r.id} style={{background:'#0B0F18',border:`1px solid ${activeReview===r.id?'rgba(0,212,255,.35)':'#1A2130'}`,borderRadius:12,padding:'14px 16px',transition:'border-color .15s'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                  <div style={{flexShrink:0,textAlign:'center'}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'#F59E0B',marginBottom:2}}>
                      {'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}
                    </div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 6px',background:urgencyColor(r.urgency)+'20',borderRadius:3,color:urgencyColor(r.urgency)}}>{r.urgency}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:5}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#00D4FF',fontWeight:700}}>{r.platform}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.25)'}}>{r.time}</span>
                    </div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,.7)',lineHeight:1.5,marginBottom:10}}>&ldquo;{r.text}&rdquo;</div>

                    {/* Reply if generated */}
                    {replies[r.id] && (
                      <div style={{background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.15)',borderRadius:8,padding:'10px 12px',marginBottom:8}}>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'#00D4FF',marginBottom:5}}>// OPTIMUS-Antwort</div>
                        <div style={{fontSize:11,color:'rgba(255,255,255,.75)',lineHeight:1.6}}
                          dangerouslySetInnerHTML={{__html:replies[r.id].replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>')}}/>
                        <div style={{display:'flex',gap:6,marginTop:8}}>
                          <button style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'4px 12px',background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.3)',borderRadius:6,color:'#10B981',cursor:'pointer'}}>✓ Senden</button>
                          <button style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'4px 10px',background:'transparent',border:'1px solid #1A2130',borderRadius:6,color:'rgba(255,255,255,.3)',cursor:'pointer'}}>📋 Kopieren</button>
                        </div>
                      </div>
                    )}

                    <button onClick={()=>generateReply(r)} disabled={generating===r.id}
                      style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'6px 14px',background:generating===r.id?'rgba(0,212,255,.08)':'rgba(0,212,255,.12)',border:`1px solid rgba(0,212,255,${generating===r.id?'.1':'.3'})`,borderRadius:7,color:generating===r.id?'rgba(0,212,255,.5)':'#00D4FF',cursor:generating===r.id?'default':'pointer',transition:'all .15s'}}>
                      {generating===r.id?(
                        <span style={{display:'flex',alignItems:'center',gap:5}}>
                          {[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'#00D4FF',display:'inline-block',animation:'blink 1.2s ease infinite',animationDelay:`${i*.3}s`}}/>)}
                          KI generiert...
                        </span>
                      ):'🤖 KI-Antwort generieren'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',background:'linear-gradient(135deg,rgba(0,212,255,.06),rgba(139,92,246,.04))',border:'1px solid rgba(0,212,255,.15)',borderRadius:20,padding:'44px 24px'}}>
          <div style={{fontSize:40,marginBottom:14}}>⭐</div>
          <h2 style={{fontWeight:900,fontSize:26,marginBottom:10}}>Bereit, alle Reviews zu meistern?</h2>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:24,lineHeight:1.8}}>
            Alle Plattformen · KI-Antworten · Sentiment-Analyse · Bulk-Modus<br/>
            Ab Bronze €19,00/Monat · Kostenlos starten
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register?source=reviewradar"
              style={{padding:'13px 30px',background:'linear-gradient(135deg,#00D4FF,#0070F3)',borderRadius:12,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,textDecoration:'none',boxShadow:'0 4px 24px rgba(0,212,255,.3)'}}>
              🚀 Kostenlos starten
            </Link>
            <Link href="/apps/reviewradar/dashboard"
              style={{padding:'13px 22px',background:'transparent',border:'1px solid rgba(255,255,255,.2)',borderRadius:12,color:'rgba(255,255,255,.6)',fontFamily:"'DM Mono',monospace",fontSize:11,textDecoration:'none'}}>
              Dashboard Demo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
