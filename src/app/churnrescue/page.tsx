'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEMO_PAYMENTS = [
  { id:'p1', customer:'StartupHub GmbH',    amount:'€297,00', plan:'Gold',   error:'Karte abgelaufen',       risk:94, days:3  },
  { id:'p2', customer:'Lisa M.',            amount:'€49,00',  plan:'Silber', error:'Insufficient funds',     risk:78, days:1  },
  { id:'p3', customer:'TechFlow Agency',    amount:'€499,00', plan:'Platin', error:'Card declined',          risk:88, days:5  },
  { id:'p4', customer:'Max Creator',        amount:'€19,00',  plan:'Bronze', error:'Stripe timeout',         risk:45, days:0  },
];

const RECOVERY_SEQUENCE = [
  { step:1, icon:'⚡', title:'Sofort-Retry',     desc:'Automatischer Retry nach 2h · Smart-Routing',     success:'34%', time:'2h'   },
  { step:2, icon:'📧', title:'KI-E-Mail',        desc:'Personalisierte E-Mail via OPTIMUS generiert',    success:'28%', time:'24h'  },
  { step:3, icon:'📱', title:'SMS-Erinnerung',   desc:'Freundliche Erinnerung mit Zahlungslink',         success:'18%', time:'72h'  },
  { step:4, icon:'💬', title:'WhatsApp-Follow',  desc:'Letzter Versuch · Persönlich · Lösungsorientiert',success:'12%', time:'7d'   },
];

const STATS = [
  { v:'72%',    l:'Recovery-Rate',     c:'#10B981' },
  { v:'€4.200', l:'Ø monatl. gerettet',c:'#C9A84C' },
  { v:'2h',     l:'Erstes Retry',      c:'#00D4FF' },
  { v:'4',      l:'Auto-Sequenz',      c:'#8B5CF6' },
];

export default function ChurnRescueLanding() {
  const [recovering, setRecovering] = useState<string|null>(null);
  const [recovered, setRecovered] = useState<string[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);

  async function retryPayment(p: typeof DEMO_PAYMENTS[0]) {
    setRecovering(p.id);
    await new Promise(r => setTimeout(r, 2000));
    const success = p.risk > 60;
    if (success) {
      setRecovered(r => [...r, p.id]);
      const amount = parseFloat(p.amount.replace('€','').replace(',00','').replace('.',''));
      setTotalSaved(t => t + amount);
    }
    setRecovering(null);
  }

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}.fu{animation:fu .4s ease both}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
          <div style={{width:12,height:12,border:'2px solid #C9A84C',transform:'rotate(45deg)',position:'relative'}}><div style={{position:'absolute',inset:2,background:'#C9A84C'}}/></div>
          <span style={{fontWeight:800,fontSize:12,color:'#E4E6EF'}}>RealSync<span style={{color:'#C9A84C'}}>Dynamics</span></span>
        </Link>
        <div style={{display:'flex',gap:8}}>
          <Link href="/pricing" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',textDecoration:'none',padding:'5px 10px'}}>Pakete</Link>
          <Link href="/register?source=churnrescue" style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'7px 18px',background:'linear-gradient(135deg,#3B82F6,#1D4ED8)',borderRadius:8,color:'white',fontWeight:700,textDecoration:'none'}}>
            Kostenlos starten
          </Link>
        </div>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'60px 24px 40px'}}>

        {/* Hero */}
        <div className="fu" style={{textAlign:'center',marginBottom:52}}>
          {totalSaved > 0 && (
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'#10B981',marginBottom:12,animation:'fu .3s ease'}}>
              🎉 Demo: €{totalSaved.toLocaleString('de')},00 gerade gerettet!
            </div>
          )}
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#3B82F6',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:14}}>
            💳 ChurnRescue · Automatisches Payment-Recovery
          </div>
          <h1 style={{fontWeight:900,fontSize:'clamp(28px,5vw,54px)',lineHeight:1.1,marginBottom:16}}>
            Rette bis zu <span style={{background:'linear-gradient(90deg,#3B82F6,#10B981)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>72% deiner</span><br/>
            failed Payments — automatisch.
          </h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.45)',maxWidth:500,margin:'0 auto 24px',lineHeight:1.8}}>
            Smart Retry · KI-E-Mails · SMS-Sequenz · WhatsApp<br/>
            OPTIMUS generiert personalisierte Win-Back-Nachrichten.
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
        <div style={{background:'#080C14',border:'1px solid rgba(59,130,246,.25)',borderRadius:20,padding:'28px',marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#3B82F6',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:4}}>// LIVE DEMO · Failed Payments</div>
              <div style={{fontWeight:800,fontSize:16}}>Klick auf &ldquo;Retry&rdquo; um die KI zu testen</div>
            </div>
            {totalSaved > 0 && (
              <div style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.3)',borderRadius:10,padding:'8px 16px',textAlign:'center'}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(16,185,129,.7)'}}>GERETTET</div>
                <div style={{fontWeight:900,fontSize:18,color:'#10B981'}}>€{totalSaved.toLocaleString('de')},00</div>
              </div>
            )}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {DEMO_PAYMENTS.map(p => {
              const isRecovered = recovered.includes(p.id);
              const isRetrying = recovering === p.id;
              return (
                <div key={p.id} style={{background:'#0B0F18',border:`1px solid ${isRecovered?'rgba(16,185,129,.3)':isRetrying?'rgba(59,130,246,.3)':'#1A2130'}`,borderRadius:12,padding:'14px 18px',transition:'all .2s'}}>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    {/* Risk indicator */}
                    <div style={{width:44,height:44,borderRadius:11,background:isRecovered?'rgba(16,185,129,.15)':p.risk>80?'rgba(239,68,68,.12)':'rgba(245,158,11,.12)',border:`1px solid ${isRecovered?'rgba(16,185,129,.3)':p.risk>80?'rgba(239,68,68,.3)':'rgba(245,158,11,.3)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',flexShrink:0}}>
                      <div style={{fontWeight:900,fontSize:13,color:isRecovered?'#10B981':p.risk>80?'#EF4444':'#F59E0B'}}>{isRecovered?'✓':p.risk}
                      </div>
                      {!isRecovered&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:'rgba(255,255,255,.3)'}}>Risiko</div>}
                    </div>

                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{p.customer}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)'}}>{p.plan} · {p.error} · {p.days===0?'heute':p.days===1?'gestern':`vor ${p.days} Tagen`}</div>
                    </div>

                    <div style={{fontWeight:900,fontSize:16,color:isRecovered?'#10B981':'#EF4444',marginRight:8,minWidth:70,textAlign:'right'}}>
                      {p.amount}
                    </div>

                    <button onClick={()=>!isRecovered&&!isRetrying&&retryPayment(p)} disabled={isRecovered||isRetrying}
                      style={{padding:'8px 16px',background:isRecovered?'rgba(16,185,129,.15)':isRetrying?'rgba(59,130,246,.1)':'linear-gradient(135deg,#3B82F6,#1D4ED8)',border:isRecovered?'1px solid rgba(16,185,129,.3)':isRetrying?'1px solid rgba(59,130,246,.3)':'none',borderRadius:8,color:isRecovered?'#10B981':isRetrying?'#3B82F6':'white',fontFamily:"'DM Mono',monospace",fontSize:10,cursor:isRecovered||isRetrying?'default':'pointer',minWidth:100,fontWeight:700}}>
                      {isRecovered?'✓ Gerettet':isRetrying?(
                        <span style={{display:'flex',alignItems:'center',gap:4,justifyContent:'center'}}>
                          {[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'#3B82F6',display:'inline-block',animation:'blink 1.2s ease infinite',animationDelay:`${i*.3}s`}}/>)}
                        </span>
                      ):'⚡ Retry'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recovery Sequence */}
        <div style={{marginBottom:36}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16,textAlign:'center'}}>// Automatische 4-Schritt-Sequenz</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {RECOVERY_SEQUENCE.map((s,i)=>(
              <div key={s.step} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:14,padding:'16px',textAlign:'center',position:'relative'}}>
                {i<3&&<div style={{position:'absolute',top:'50%',right:-7,width:14,height:2,background:'linear-gradient(90deg,#1A2130,transparent)',transform:'translateY(-50%)'}}/>}
                <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'#3B82F6',letterSpacing:'.1em',marginBottom:5}}>SCHRITT {s.step} · {s.time}</div>
                <div style={{fontWeight:800,fontSize:13,marginBottom:6}}>{s.title}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.5,marginBottom:8}}>{s.desc}</div>
                <div style={{fontWeight:900,fontSize:18,color:'#10B981'}}>{s.success}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(16,185,129,.5)'}}>Erfolgsrate</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',background:'linear-gradient(135deg,rgba(59,130,246,.06),rgba(16,185,129,.04))',border:'1px solid rgba(59,130,246,.15)',borderRadius:20,padding:'44px 24px'}}>
          <div style={{fontSize:40,marginBottom:14}}>💳</div>
          <h2 style={{fontWeight:900,fontSize:26,marginBottom:10}}>Höre auf, Geld zu verlieren.</h2>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:24,lineHeight:1.8}}>
            Jeder failed Payment ist verlorenes Geld. ChurnRescue rettet es automatisch.<br/>
            Setup in 5 Minuten · Stripe-Integration · Kostenlos starten
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register?source=churnrescue"
              style={{padding:'13px 30px',background:'linear-gradient(135deg,#3B82F6,#1D4ED8)',borderRadius:12,color:'white',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,textDecoration:'none',boxShadow:'0 4px 24px rgba(59,130,246,.35)'}}>
              🚀 Kostenlos starten
            </Link>
            <Link href="/apps/churnrescue/dashboard"
              style={{padding:'13px 22px',background:'transparent',border:'1px solid rgba(255,255,255,.2)',borderRadius:12,color:'rgba(255,255,255,.6)',fontFamily:"'DM Mono',monospace",fontSize:11,textDecoration:'none'}}>
              Dashboard Demo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
