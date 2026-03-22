'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { icon:'📺', label:'YouTube-Ad',         prompt:'Erstell mir eine YouTube-Ad für Creator-Tools. Hook, Script und CTA für 15 Sekunden.' },
  { icon:'⭐', label:'Reviews antworten',  prompt:'Analysiere meine negativen Google Reviews und erstelle professionelle KI-Antworten auf Deutsch.' },
  { icon:'📡', label:'Trends',             prompt:'Was sind die viralen Trends diese Woche für Creator? Welche sollte ich sofort nutzen?' },
  { icon:'✍️', label:'TikTok Hook',        prompt:'Schreib mir 5 starke TikTok Hooks für Content-Creator im Tech-Bereich.' },
  { icon:'💳', label:'Revenue',            prompt:'Analysiere meine Revenue-Streams und empfehle wie ich mein Einkommen als Creator optimieren kann.' },
  { icon:'📊', label:'Analytics',          prompt:'Analysiere meine Cross-Platform Performance und zeig mir wo ich am meisten wachsen kann.' },
  { icon:'🚀', label:'Launch',             prompt:'Erstelle eine komplette Launch-Strategie für ein neues Creator-Produkt in 7 Tagen.' },
  { icon:'🪙', label:'Coins',              prompt:'Wie verdiene ich am schnellsten mehr RealSyncCoins? Welche B2B-Strategie empfiehlst du?' },
  { icon:'⬡', label:'Deep Research',      prompt:'Recherchiere tiefgehend: Was sind die besten Creator-Tools in 2026? Strukturierter Report mit Citations.' },
];

const MODELS = [
  { id:'fast',  label:'sonar',        sub:'$1/$1/M · 5 Coins',   color:'#10B981' },
  { id:'sonar', label:'sonar-pro',    sub:'$3/$15/M · 15 Coins', color:'#00D4FF' },
  { id:'deep',  label:'sonar-deep',   sub:'$2/$8/M · 50 Coins',  color:'#8B5CF6' },
  { id:'council',label:'⚖️ Council', sub:'3 Perspektiven · 35 Coins', color:'#FFD700' },
];

const COIN_PACKAGES = [
  { id:'starter', coins:500,   price:5.00,  label:'Starter',  bonus:0    },
  { id:'creator', coins:2000,  price:15.00, label:'Creator',  bonus:200  },
  { id:'pro',     coins:5000,  price:30.00, label:'Pro',      bonus:800  },
  { id:'mega',    coins:15000, price:75.00, label:'Mega',     bonus:3000 },
];

const SPACES = [
  { id:'ads',      name:'Ad Strategy',       icon:'📺', color:'#FF6888', app:'AdEngine'    },
  { id:'trends',   name:'Trend Research',    icon:'📡', color:'#10B981', app:'TrendRadar'  },
  { id:'content',  name:'Content Pipeline',  icon:'✍️', color:'#8B5CF6', app:'ContentForge'},
  { id:'revenue',  name:'Revenue Analysis',  icon:'💰', color:'#FFD700', app:'MonetizeMax' },
];

interface Message {
  role: 'user'|'assistant'|'council';
  content: string;
  council?: Array<{perspective:{name:string;icon:string;color:string};content:string;citations:string[]}>;
  detectedApps?: {app:string;route:string}[];
  coinCost?: number;
  citations?: string[];
  timestamp: string;
}

export default function OptimusPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role:'assistant',
    content:'## 👋 OPTIMUS bereit\n\nDein KI-Agent für alle 16 RealSync Apps.\n\n**Powered by Perplexity Sonar API** — Echtzeit-Web-Suche mit Citations.\n\n> Sag mir was du brauchst oder wähle eine Schnell-Aktion.',
    timestamp:'jetzt',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('sonar');
  const [coinBalance, setCoinBalance] = useState(3750);
  const [showPackages, setShowPackages] = useState(false);
  const [activeSpace, setActiveSpace] = useState<string|null>(null);
  const [showSpaces, setShowSpaces] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(()=>{ messagesEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);

  const coinCostForModel = model==='deep'?50:model==='council'?35:model==='fast'?5:15;

  async function send(prompt?: string) {
    const text = prompt || input.trim();
    if (!text || loading) return;
    if (coinBalance < coinCostForModel) { setShowPackages(true); return; }

    setInput('');
    setLoading(true);
    setMessages(m=>[...m,{role:'user',content:text,timestamp:'gerade'}]);

    try {
      if (model === 'council') {
        // Model Council — parallel perspectives
        const res = await fetch('/api/optimus/council',{
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        setMessages(m=>[...m,{
          role:'council', content:'', council:data.council,
          coinCost:data.coinCost||35, timestamp:'gerade',
        }]);
        setCoinBalance(b=>b-(data.coinCost||35));
      } else {
        const res = await fetch('/api/optimus',{
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            message:text, model,
            context:messages.slice(-4).map(m=>({role:m.role==='council'?'assistant':m.role,content:m.content})),
            appContext: activeSpace ? SPACES.find(s=>s.id===activeSpace)?.app : null,
          }),
        });
        const data = await res.json();
        setMessages(m=>[...m,{
          role:'assistant', content:data.response||data.error||'Fehler',
          detectedApps:data.detectedApps||[], coinCost:data.coinCost||coinCostForModel,
          citations:data.citations||[], timestamp:'gerade',
        }]);
        setCoinBalance(b=>b-coinCostForModel);
      }
    } catch {
      setMessages(m=>[...m,{role:'assistant',content:'⚠️ Verbindungsfehler.',timestamp:'gerade'}]);
    }
    setLoading(false);
  }

  function md(t:string){
    return t
      .replace(/^## (.+)$/gm,'<div style="font-size:14px;font-weight:800;color:#00D4FF;margin:10px 0 5px">$1</div>')
      .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#E4E6EF">$1</strong>')
      .replace(/`(.+?)`/g,'<code style="background:#1A2130;color:#00D4FF;padding:1px 5px;border-radius:3px;font-size:11px;font-family:monospace">$1</code>')
      .replace(/^▸ (.+)$/gm,'<div style="display:flex;gap:7px;margin:2px 0"><span style="color:#C9A84C">▸</span><span>$1</span></div>')
      .replace(/^- (.+)$/gm,'<div style="display:flex;gap:7px;margin:2px 0"><span style="color:#C9A84C">▸</span><span>$1</span></div>')
      .replace(/^> (.+)$/gm,'<div style="border-left:2px solid #00D4FF;padding:6px 10px;margin:6px 0;background:rgba(0,212,255,.05);font-style:italic;font-size:12px;border-radius:0 5px 5px 0">$1</div>')
      .replace(/\n/g,'<br/>');
  }

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .msg{animation:fu .25s ease both}
        textarea:focus{outline:none}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#1A2130;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{background:'rgba(3,5,10,.98)',borderBottom:'1px solid #0F1520',padding:'0 16px',height:50,display:'flex',alignItems:'center',gap:10,flexShrink:0,zIndex:100}}>
        <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>←</Link>
        <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#00D4FF,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>🤖</div>
        <div>
          <div style={{fontWeight:800,fontSize:13}}>OPTIMUS</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'#10B981',letterSpacing:'.1em'}}>● Perplexity Sonar API</div>
        </div>

        {/* Spaces selector */}
        <div style={{marginLeft:8,position:'relative'}}>
          <button onClick={()=>setShowSpaces(!showSpaces)}
            style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',background:activeSpace?'rgba(0,212,255,.1)':'rgba(255,255,255,.04)',border:`1px solid ${activeSpace?'rgba(0,212,255,.35)':'#1A2130'}`,borderRadius:20,cursor:'pointer',fontFamily:"'DM Mono',monospace",fontSize:9,color:activeSpace?'#00D4FF':'rgba(255,255,255,.3)'}}>
            <span>🗂</span>{activeSpace?SPACES.find(s=>s.id===activeSpace)?.name:'Space wählen'}
          </button>
          {showSpaces && (
            <div style={{position:'absolute',top:30,left:0,background:'#0B0F18',border:'1px solid #1A2130',borderRadius:10,overflow:'hidden',zIndex:200,minWidth:160}}>
              <div onClick={()=>{setActiveSpace(null);setShowSpaces(false)}} style={{padding:'8px 14px',fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.4)',cursor:'pointer'}}>Kein Space</div>
              {SPACES.map(s=>(
                <div key={s.id} onClick={()=>{setActiveSpace(s.id);setShowSpaces(false)}}
                  style={{padding:'8px 14px',display:'flex',alignItems:'center',gap:8,cursor:'pointer',borderTop:'1px solid #0F1520'}}>
                  <span>{s.icon}</span>
                  <div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:s.color}}>{s.name}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.25)'}}>{s.app}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8}}>
          {/* Models */}
          <div style={{display:'flex',gap:3}}>
            {MODELS.map(m=>(
              <button key={m.id} onClick={()=>setModel(m.id)}
                style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'3px 8px',borderRadius:5,border:`1px solid ${model===m.id?m.color+'50':'#1A2130'}`,background:model===m.id?m.color+'12':'transparent',color:model===m.id?m.color:'rgba(255,255,255,.25)',cursor:'pointer'}}>
                {m.id==='council'?'⚖️':''}{m.label}
              </button>
            ))}
          </div>

          <button onClick={()=>setShowPackages(true)}
            style={{display:'flex',alignItems:'center',gap:5,background:'rgba(201,168,76,.1)',border:'1px solid rgba(201,168,76,.3)',borderRadius:20,padding:'4px 10px',cursor:'pointer'}}>
            <span style={{fontSize:12}}>🪙</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:700,color:'#C9A84C'}}>{coinBalance.toLocaleString('de')}</span>
          </button>
          <Link href="/perplexity" style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(32,178,170,.6)',textDecoration:'none'}}>⬡</Link>
        </div>
      </div>

      {/* Coin packages */}
      {showPackages && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300}} onClick={()=>setShowPackages(false)}>
          <div style={{background:'#080C14',border:'1px solid rgba(201,168,76,.3)',borderRadius:20,padding:'26px',maxWidth:400,width:'90%'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🪙 Coins für OPTIMUS</div>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',marginBottom:18}}>sonar 5 · sonar-pro 15 · deep 50 · council 35</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
              {COIN_PACKAGES.map(pkg=>(
                <div key={pkg.id} style={{background:'#0B0F18',border:'1px solid #1A2130',borderRadius:12,padding:'12px',cursor:'pointer'}}
                  onClick={()=>{setCoinBalance(b=>b+pkg.coins+pkg.bonus);setShowPackages(false);}}>
                  <div style={{fontWeight:800,fontSize:16,color:'#C9A84C'}}>{(pkg.coins+pkg.bonus).toLocaleString('de')}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)'}}>Coins{pkg.bonus>0?` +${pkg.bonus} Bonus`:''}</div>
                  <div style={{marginTop:7,fontWeight:700,fontSize:13}}>€{pkg.price.toFixed(2).replace('.',',')}</div>
                </div>
              ))}
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.2)',textAlign:'center'}}>100 Coins = €1,00 · Nie verfallen · Auch im Store nutzbar</div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:12}}>
        {messages.length<=1 && (
          <div style={{marginBottom:8}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.2)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8}}>// Schnell-Aktionen</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
              {QUICK_ACTIONS.map(a=>(
                <button key={a.label} onClick={()=>send(a.prompt)}
                  style={{display:'flex',alignItems:'center',gap:6,padding:'8px 10px',background:'#080C14',border:'1px solid #1A2130',borderRadius:9,cursor:'pointer',textAlign:'left',transition:'border-color .15s'}}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor='#374151')}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='#1A2130')}>
                  <span style={{fontSize:16,flexShrink:0}}>{a.icon}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.5)'}}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg,i)=>(
          <div key={i} className="msg" style={{display:'flex',gap:8,flexDirection:msg.role==='user'?'row-reverse':'row',alignItems:'flex-start'}}>
            <div style={{width:28,height:28,borderRadius:7,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,background:msg.role==='user'?'rgba(0,212,255,.2)':msg.role==='council'?'rgba(255,215,0,.2)':'linear-gradient(135deg,#00D4FF,#8B5CF6)'}}>
              {msg.role==='user'?'👤':msg.role==='council'?'⚖️':'🤖'}
            </div>
            <div style={{maxWidth:'82%'}}>
              {/* Council response */}
              {msg.role==='council' && msg.council && (
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#FFD700',letterSpacing:'.15em',marginBottom:4}}>⚖️ MODEL COUNCIL — 3 PERSPEKTIVEN</div>
                  {msg.council.map((c,ci)=>(
                    <div key={ci} style={{background:'#080C14',border:`1px solid ${c.perspective.color}30`,borderRadius:'4px 12px 12px 12px',overflow:'hidden'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',background:c.perspective.color+'0C',borderBottom:`1px solid ${c.perspective.color}20`}}>
                        <span style={{fontSize:14}}>{c.perspective.icon}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:700,color:c.perspective.color}}>{c.perspective.name}</span>
                      </div>
                      <div style={{padding:'10px 14px',fontSize:12,lineHeight:1.7,color:'rgba(255,255,255,.8)'}}
                        dangerouslySetInnerHTML={{__html:md(c.content)}}/>
                    </div>
                  ))}
                </div>
              )}

              {/* Normal response */}
              {msg.role!=='council' && (
                <div style={{background:msg.role==='user'?'rgba(0,212,255,.08)':'#080C14',border:`1px solid ${msg.role==='user'?'rgba(0,212,255,.2)':'#1A2130'}`,borderRadius:msg.role==='user'?'12px 4px 12px 12px':'4px 12px 12px 12px',padding:'10px 14px',fontSize:12,lineHeight:1.7,color:'rgba(255,255,255,.85)'}}
                  dangerouslySetInnerHTML={{__html:md(msg.content)}}/>
              )}

              {/* Meta */}
              <div style={{display:'flex',gap:8,marginTop:5,flexWrap:'wrap',alignItems:'center'}}>
                {msg.coinCost && <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(201,168,76,.4)'}}>🪙 -{msg.coinCost}</span>}
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.15)'}}>{msg.timestamp}</span>
                {msg.detectedApps?.map(app=>(
                  <Link key={app.app} href={app.route} style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 8px',background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.15)',borderRadius:20,color:'#00D4FF',textDecoration:'none'}}>
                    → {app.app}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg" style={{display:'flex',gap:8,alignItems:'flex-start'}}>
            <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#00D4FF,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>
              {model==='council'?'⚖️':'🤖'}
            </div>
            <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:'4px 12px 12px 12px',padding:'12px 16px'}}>
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:'50%',background:model==='council'?'#FFD700':'#00D4FF',animation:'blink 1.2s ease infinite',animationDelay:`${i*0.3}s`}}/>)}
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',marginLeft:6}}>
                  {model==='council'?'3 Perspektiven werden generiert...':'Perplexity analysiert...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      <div style={{background:'rgba(3,5,10,.98)',borderTop:'1px solid #0F1520',padding:'12px 16px',flexShrink:0}}>
        <div style={{display:'flex',gap:8,alignItems:'flex-end',background:'#080C14',border:'1px solid #1A2130',borderRadius:12,padding:'8px 12px'}}>
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder={model==='council'?'Frage für 3 Perspektiven...':'OPTIMUS fragen...'}
            rows={2} style={{flex:1,background:'transparent',border:'none',color:'rgba(255,255,255,.85)',fontFamily:"'Syne',sans-serif",fontSize:13,lineHeight:1.6,maxHeight:100,overflowY:'auto',resize:'none'}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()}
            style={{width:34,height:34,borderRadius:9,background:input.trim()&&!loading?model==='council'?'linear-gradient(135deg,#FFD700,#F59E0B)':'linear-gradient(135deg,#00D4FF,#0070F3)':'#1A2130',border:'none',cursor:input.trim()&&!loading?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0,transition:'all .15s'}}>
            {loading?'⟳':'↑'}
          </button>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.15)'}}>
            ⬡ Perplexity Sonar API · Echtzeit-Web · Citations
          </div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:MODELS.find(m=>m.id===model)?.color+'80'}}>
            {MODELS.find(m=>m.id===model)?.label} · {MODELS.find(m=>m.id===model)?.sub}
          </div>
        </div>
      </div>
    </div>
  );
}
