'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  { icon:'📺', label:'YouTube-Ad erstellen',     prompt:'Erstell mir eine YouTube-Ad für Creator-Tools. Hook, Script und CTA für 15 Sekunden.' },
  { icon:'⭐', label:'Reviews beantworten',      prompt:'Analysiere meine negativen Google Reviews und erstelle professionelle KI-Antworten.' },
  { icon:'📡', label:'Trending Topics',          prompt:'Was sind die viralen Trends diese Woche für Creator? Welche sollte ich sofort nutzen?' },
  { icon:'✍️', label:'TikTok Hook schreiben',   prompt:'Schreib mir 5 starke TikTok Hooks für Content-Creator im Tech-Bereich.' },
  { icon:'💳', label:'Revenue optimieren',       prompt:'Analysiere meine Revenue-Streams und empfehle wie ich mein Einkommen als Creator optimieren kann.' },
  { icon:'📊', label:'Performance analysieren', prompt:'Analysiere meine Cross-Platform Performance und zeig mir wo ich am meisten wachsen kann.' },
  { icon:'🚀', label:'Launch-Strategie',         prompt:'Erstelle eine komplette Launch-Strategie für ein neues Creator-Produkt in 7 Tagen.' },
  { icon:'🪙', label:'Coins optimieren',         prompt:'Wie verdiene ich am schnellsten mehr RealSyncCoins? Welche Strategie empfiehlst du?' },
];

const MODELS = [
  { id:'fast',   label:'⚡ sonar',        desc:'$1/$1/M · 5 Coins',    color:'#10B981' },
  { id:'sonar',  label:'🔍 sonar-pro',    desc:'$3/$15/M · 15 Coins',  color:'#00D4FF' },
  { id:'deep',   label:'🧠 deep-research', desc:'$2/$8/M · 50 Coins',  color:'#8B5CF6' },
];

const COIN_PACKAGES = [
  { id:'starter', coins:500,   price:5.00, label:'Starter',  bonus:0   },
  { id:'creator', coins:2000,  price:15.00, label:'Creator',  bonus:200 },
  { id:'pro',     coins:5000,  price:30.00, label:'Pro',      bonus:800 },
  { id:'mega',    coins:15000, price:75.00, label:'Mega',     bonus:3000},
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  detectedApps?: { app: string; route: string; reason: string }[];
  coinCost?: number;
  citations?: string[];
  timestamp: string;
}

export default function OptimusPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `## 👋 Hallo! Ich bin OPTIMUS.\n\nDein KI-Agent für das gesamte RealSync Creator OS.\n\nIch habe Zugriff auf alle 16 Apps und kann app-übergreifend für dich arbeiten — in Echtzeit, mit Web-Suche via Perplexity AI.\n\n**Sag mir einfach was du willst**, oder wähle eine Schnell-Aktion unten.`,
      timestamp: 'jetzt',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('sonar');
  const [coinBalance, setCoinBalance] = useState(3750);
  const [showPackages, setShowPackages] = useState(false);
  const [activeApp, setActiveApp] = useState<string|null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(prompt?: string) {
    const text = prompt || input.trim();
    if (!text || loading) return;

    const coinCost = model === 'deep' ? 50 : model === 'fast' ? 5 : 15;
    if (coinBalance < coinCost) { setShowPackages(true); return; }

    setInput('');
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, timestamp: 'gerade' };
    setMessages(m => [...m, userMsg]);

    try {
      const res = await fetch('/api/optimus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          model,
          context: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          appContext: activeApp,
        }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response || data.error || 'Fehler bei der Verarbeitung',
        detectedApps: data.detectedApps || [],
        coinCost: data.coinCost || coinCost,
        citations: data.citations || [],
        timestamp: 'gerade',
      };

      setMessages(m => [...m, assistantMsg]);
      setCoinBalance(b => b - coinCost);

      if (data.detectedApps?.[0]) {
        setActiveApp(data.detectedApps[0].app);
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Verbindungsfehler. Bitte erneut versuchen.', timestamp: 'gerade' }]);
    }
    setLoading(false);
  }

  function renderMarkdown(text: string) {
    return text
      .replace(/^## (.+)$/gm, '<div style="font-size:15px;font-weight:800;color:#00D4FF;margin:12px 0 6px">$1</div>')
      .replace(/^### (.+)$/gm, '<div style="font-size:13px;font-weight:700;color:#C9A84C;margin:8px 0 4px">$1</div>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E4E6EF">$1</strong>')
      .replace(/`(.+?)`/g, '<code style="background:#1A2130;color:#00D4FF;padding:1px 6px;border-radius:4px;font-size:11px;font-family:monospace">$1</code>')
      .replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0"><span style="color:#C9A84C;flex-shrink:0">▸</span><span>$1</span></div>')
      .replace(/^> (.+)$/gm, '<div style="border-left:2px solid #00D4FF;padding:8px 12px;margin:8px 0;background:rgba(0,212,255,.05);color:rgba(255,255,255,.8);font-style:italic;border-radius:0 6px 6px 0;font-size:12px">$1</div>')
      .replace(/\n/g, '<br/>');
  }

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#03050A', color:'white', fontFamily:"'Syne',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .msg{animation:fadeUp .3s ease both}
        textarea{resize:none!important}
        textarea:focus{outline:none!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080C14}
        ::-webkit-scrollbar-thumb{background:#1A2130;border-radius:2px}
      `}</style>

      {/* Header */}
      <div style={{ background:'rgba(3,5,10,.98)', borderBottom:'1px solid #0F1520', padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link href="/hub" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', textDecoration:'none' }}>← Hub</Link>
          <span style={{ color:'#1A2130' }}>|</span>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#00D4FF,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🤖</div>
            <div>
              <div style={{ fontWeight:800, fontSize:13 }}>OPTIMUS</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'#10B981', letterSpacing:'.1em' }}>● ONLINE · Perplexity AI</div>
            </div>
          </div>
          {activeApp && (
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'3px 8px', background:'rgba(0,212,255,.1)', border:'1px solid rgba(0,212,255,.25)', borderRadius:4, color:'#00D4FF' }}>
              {activeApp}
            </div>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Model selector */}
          <div style={{ display:'flex', gap:4 }}>
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setModel(m.id)}
                style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'4px 10px', borderRadius:6, border:`1px solid ${model===m.id?m.color+'60':'#1A2130'}`, background:model===m.id?m.color+'15':'transparent', color:model===m.id?m.color:'rgba(255,255,255,.3)', cursor:'pointer' }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Coin balance */}
          <button onClick={() => setShowPackages(!showPackages)}
            style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.3)', borderRadius:20, padding:'5px 12px', cursor:'pointer' }}>
            <span style={{ fontSize:13 }}>🪙</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:700, color:'#C9A84C' }}>{coinBalance.toLocaleString('de')}</span>
          </button>
        </div>
      </div>

      {/* Coin packages modal */}
      {showPackages && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }} onClick={() => setShowPackages(false)}>
          <div style={{ background:'#080C14', border:'1px solid rgba(201,168,76,.3)', borderRadius:20, padding:'28px', maxWidth:440, width:'90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>🪙 Coins für OPTIMUS</div>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,.4)', marginBottom:20 }}>
              Turbo 5 · Pro 15 · Deep 30 Coins/Anfrage
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {COIN_PACKAGES.map(pkg => (
                <div key={pkg.id} style={{ background:'#0B0F18', border:'1px solid #1A2130', borderRadius:12, padding:'14px', cursor:'pointer' }}
                  onClick={() => { setCoinBalance(b => b + pkg.coins + pkg.bonus); setShowPackages(false); }}>
                  <div style={{ fontWeight:800, fontSize:18, color:'#C9A84C' }}>{(pkg.coins+pkg.bonus).toLocaleString('de')}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.4)', marginTop:2 }}>Coins</div>
                  {pkg.bonus > 0 && <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'#10B981', marginTop:4 }}>+{pkg.bonus} Bonus</div>}
                  <div style={{ marginTop:8, fontWeight:700, fontSize:14 }}>€{pkg.price.toFixed(2).replace('.', ',')}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.3)' }}>{pkg.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)', textAlign:'center' }}>
              100 Coins = €1 · Nie verfallen · Auch für Store nutzbar
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* Quick actions — show only at start */}
        {messages.length <= 1 && (
          <div style={{ marginBottom:8 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.25)', letterSpacing:'.15em', textTransform:'uppercase', marginBottom:10 }}>// Schnell-Aktionen</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} onClick={() => send(a.prompt)}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'#080C14', border:'1px solid #1A2130', borderRadius:10, cursor:'pointer', textAlign:'left', transition:'all .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#374151')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2130')}>
                  <span style={{ fontSize:18 }}>{a.icon}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.6)' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="msg" style={{ display:'flex', gap:10, flexDirection:msg.role==='user'?'row-reverse':'row', alignItems:'flex-start' }}>
            {/* Avatar */}
            <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background:msg.role==='user'?'rgba(0,212,255,.2)':'linear-gradient(135deg,#00D4FF,#8B5CF6)' }}>
              {msg.role==='user'?'👤':'🤖'}
            </div>

            <div style={{ maxWidth:'80%' }}>
              {/* Bubble */}
              <div style={{ background:msg.role==='user'?'rgba(0,212,255,.08)':'#080C14', border:`1px solid ${msg.role==='user'?'rgba(0,212,255,.2)':'#1A2130'}`, borderRadius:msg.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'12px 16px', fontSize:13, lineHeight:1.7, color:'rgba(255,255,255,.85)' }}
                dangerouslySetInnerHTML={{__html: renderMarkdown(msg.content)}}/>

              {/* Coin cost + model */}
              {msg.role==='assistant' && msg.coinCost && (
                <div style={{ display:'flex', gap:8, marginTop:6, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(201,168,76,.5)' }}>🪙 -{msg.coinCost} Coins</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)' }}>{msg.timestamp}</span>
                </div>
              )}

              {/* Detected apps */}
              {msg.detectedApps && msg.detectedApps.length > 0 && (
                <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.25)', alignSelf:'center' }}>Apps öffnen:</span>
                  {msg.detectedApps.map(app => (
                    <Link key={app.app} href={app.route}
                      style={{ fontFamily:"'DM Mono',monospace", fontSize:9, padding:'3px 10px', background:'rgba(0,212,255,.1)', border:'1px solid rgba(0,212,255,.2)', borderRadius:20, color:'#00D4FF', textDecoration:'none' }}>
                      → {app.app}
                    </Link>
                  ))}
                </div>
              )}

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={{ marginTop:6, fontFamily:"'DM Mono',monospace", fontSize:8, color:'rgba(255,255,255,.2)' }}>
                  {msg.citations.slice(0,3).map((c, ci) => (
                    <span key={ci} style={{ marginRight:8 }}>[{ci+1}] {c.slice(0,40)}...</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg" style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:'linear-gradient(135deg,#00D4FF,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🤖</div>
            <div style={{ background:'#080C14', border:'1px solid #1A2130', borderRadius:'4px 14px 14px 14px', padding:'14px 18px' }}>
              <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#00D4FF', animation:'blink 1.2s ease-in-out infinite', animationDelay:`${i*0.3}s` }}/>
                ))}
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,.3)', marginLeft:6 }}>Perplexity analysiert...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input area */}
      <div style={{ background:'rgba(3,5,10,.98)', borderTop:'1px solid #0F1520', padding:'14px 20px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:10, alignItems:'flex-end', background:'#080C14', border:'1px solid #1A2130', borderRadius:14, padding:'10px 14px', transition:'border-color .15s' }}
          onFocus={() => {}} onBlur={() => {}}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
            placeholder="Sag OPTIMUS was du willst... (Enter zum Senden)"
            rows={2}
            style={{ flex:1, background:'transparent', border:'none', color:'rgba(255,255,255,.85)', fontFamily:"'Syne',sans-serif", fontSize:13, lineHeight:1.6, maxHeight:120, overflowY:'auto' }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            style={{ width:36, height:36, borderRadius:10, background:input.trim()&&!loading?'linear-gradient(135deg,#00D4FF,#0070F3)':'#1A2130', border:'none', cursor:input.trim()&&!loading?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, transition:'all .15s' }}>
            {loading?'⟳':'↑'}
          </button>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(255,255,255,.2)' }}>
            Powered by Perplexity Sonar API · Echtzeit-Web · Quellen mit Citations
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'rgba(201,168,76,.5)' }}>
            {MODELS.find(m=>m.id===model)?.label} · {MODELS.find(m=>m.id===model)?.desc}
          </div>
        </div>
      </div>
    </div>
  );
}
