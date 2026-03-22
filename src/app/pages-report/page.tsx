'use client';
import { useState } from 'react';
import Link from 'next/link';

const REPORT_TYPES = [
  { id:'monthly',  icon:'📊', name:'Monatsbericht',     desc:'Metriken, Top-Content, Learnings',  coins:75  },
  { id:'strategy', icon:'🎯', name:'Strategie-Report',  desc:'Marktanalyse, Wachstumsplan, KPIs',  coins:100 },
  { id:'trends',   icon:'📡', name:'Trend-Report',      desc:'Virale Trends, Timing, Quick Wins',  coins:60  },
  { id:'launch',   icon:'🚀', name:'Launch-Plan',       desc:'7-Tage-Plan, Content, Kanäle',       coins:90  },
];

const EXAMPLE_TOPICS = [
  'Creator-Tools und KI-Automatisierung 2026',
  'YouTube Monetarisierung im DACH-Raum',
  'TikTok-Wachstum für Tech-Creator',
  'Brand Deals und Sponsoring-Strategie',
  'RealSync Creator OS Launch-Kampagne',
];

export default function PagesReportPage() {
  const [topic, setTopic] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState('');
  const [citations, setCitations] = useState<string[]>([]);
  const [reportTitle, setReportTitle] = useState('');

  async function generate() {
    if (!topic.trim()) return;
    setGenerating(true);
    setReport('');
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, reportType }),
      });
      const data = await res.json();
      setReport(data.report || data.error || 'Fehler');
      setCitations(data.citations || []);
      setReportTitle(data.title || topic);
    } catch {
      setReport('⚠️ Generierungsfehler. Bitte erneut versuchen.');
    }
    setGenerating(false);
  }

  function renderReport(text: string) {
    return text
      .replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:900;color:#E4E6EF;margin:16px 0 8px;line-height:1.2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:15px;font-weight:800;color:#00D4FF;margin:20px 0 8px;padding-bottom:6px;border-bottom:1px solid rgba(0,212,255,.15)">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size:13px;font-weight:700;color:#C9A84C;margin:12px 0 5px">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E4E6EF;font-weight:800">$1</strong>')
      .replace(/^▸ (.+)$/gm, '<div style="display:flex;gap:8px;align-items:flex-start;margin:4px 0;padding:4px 0"><span style="color:#C9A84C;flex-shrink:0;margin-top:2px">▸</span><span>$1</span></div>')
      .replace(/^\d+\. \*\*(.+?)\*\*(.+)$/gm, '<div style="display:flex;gap:8px;margin:6px 0;background:rgba(255,255,255,.03);padding:8px 12px;border-radius:8px;border-left:2px solid #C9A84C"><strong style="color:#C9A84C;flex-shrink:0">$1</strong><span>$2</span></div>')
      .replace(/\n\n/g, '<div style="margin:8px 0"/>')
      .replace(/\n/g, '<br/>');
  }

  const selectedType = REPORT_TYPES.find(r => r.id === reportType)!;

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}.pulse{animation:pulse 1.4s ease infinite}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',padding:'0 20px',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Hub</Link>
          <span style={{color:'#1A2130'}}>|</span>
          <span style={{fontWeight:800,fontSize:14}}>
            <span style={{color:'#20B2AA'}}>⬡</span> Perplexity <span style={{color:'#20B2AA'}}>Pages</span>
          </span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'2px 7px',background:'rgba(32,178,170,.1)',border:'1px solid rgba(32,178,170,.25)',borderRadius:4,color:'#20B2AA'}}>sonar-pro · Citations</span>
        </div>
        <Link href="/optimus" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>🤖 OPTIMUS →</Link>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'28px 20px'}}>

        {!report ? (
          <>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{fontSize:40,marginBottom:12}}>📄</div>
              <h1 style={{fontWeight:900,fontSize:28,marginBottom:6}}>Creator Report Generator</h1>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.4)'}}>
                Perplexity Sonar Pro · Echtzeit-Web · Strukturierte Reports mit Citations
              </p>
            </div>

            {/* Report Type */}
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:12}}>// Report-Typ wählen</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                {REPORT_TYPES.map(r=>(
                  <button key={r.id} onClick={()=>setReportType(r.id)}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:reportType===r.id?'rgba(0,212,255,.08)':'#080C14',border:`1px solid ${reportType===r.id?'rgba(0,212,255,.4)':'#1A2130'}`,borderRadius:12,cursor:'pointer',textAlign:'left',transition:'all .15s'}}>
                    <span style={{fontSize:22,flexShrink:0}}>{r.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:reportType===r.id?'#00D4FF':'#E4E6EF'}}>{r.name}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.35)',marginTop:1}}>{r.desc}</div>
                    </div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#C9A84C'}}>🪙 {r.coins}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:12}}>// Thema / Fokus</div>
              <textarea value={topic} onChange={e=>setTopic(e.target.value)}
                placeholder="z.B. 'Creator-Tools und KI-Automatisierung 2026' oder 'Meine YouTube-Kanal-Strategie Q2'"
                rows={3}
                style={{width:'100%',background:'#080C14',border:'1px solid #1A2130',borderRadius:12,padding:'14px 16px',color:'rgba(255,255,255,.85)',fontFamily:"'Syne',sans-serif",fontSize:13,lineHeight:1.6,boxSizing:'border-box',resize:'none'}}
                onFocus={e=>e.target.style.borderColor='#00D4FF'}
                onBlur={e=>e.target.style.borderColor='#1A2130'}/>

              {/* Examples */}
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.2)',alignSelf:'center'}}>Beispiele:</span>
                {EXAMPLE_TOPICS.map(t=>(
                  <button key={t} onClick={()=>setTopic(t)}
                    style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'3px 10px',background:'rgba(255,255,255,.04)',border:'1px solid #1A2130',borderRadius:20,color:'rgba(255,255,255,.4)',cursor:'pointer',transition:'all .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='#374151'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='#1A2130'}>
                    {t.slice(0,35)}…
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={generating||!topic.trim()}
              style={{width:'100%',padding:'14px',background:topic.trim()&&!generating?'linear-gradient(135deg,#20B2AA,#008B8B)':'#1A2130',border:'none',borderRadius:12,color:topic.trim()&&!generating?'#000':'rgba(255,255,255,.2)',fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,cursor:topic.trim()&&!generating?'pointer':'default',transition:'all .2s'}}>
              {generating?'⟳ Generiere Report mit Perplexity Sonar Pro…':`📄 ${selectedType.name} generieren · 🪙 ${selectedType.coins} Coins`}
            </button>
          </>
        ) : (
          <>
            {/* Report Header */}
            <div style={{background:'#080C14',border:'1px solid rgba(32,178,170,.25)',borderRadius:16,padding:'20px 24px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
              <div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#20B2AA',letterSpacing:'.15em',marginBottom:4}}>⬡ PERPLEXITY PAGES · sonar-pro</div>
                <div style={{fontWeight:800,fontSize:16}}>{reportTitle}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)',marginTop:2}}>
                  {new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'})} · {citations.length} Citations
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>navigator.clipboard?.writeText(report)}
                  style={{padding:'7px 14px',background:'rgba(32,178,170,.1)',border:'1px solid rgba(32,178,170,.3)',borderRadius:8,color:'#20B2AA',fontFamily:"'DM Mono',monospace",fontSize:10,cursor:'pointer'}}>
                  📋 Kopieren
                </button>
                <button onClick={()=>{setReport('');setCitations([]);}}
                  style={{padding:'7px 14px',background:'transparent',border:'1px solid #1A2130',borderRadius:8,color:'rgba(255,255,255,.4)',fontFamily:"'DM Mono',monospace",fontSize:10,cursor:'pointer'}}>
                  ← Neu
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:16,padding:'28px 32px',fontSize:13,lineHeight:1.8,color:'rgba(255,255,255,.75)',marginBottom:16}}
              dangerouslySetInnerHTML={{__html:renderReport(report)}}/>

            {/* Citations */}
            {citations.length > 0 && (
              <div style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:12,padding:'16px 20px'}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:10}}>
                  // {citations.length} Quellen · Perplexity Citations
                </div>
                {citations.slice(0,6).map((c,i)=>(
                  <div key={i} style={{display:'flex',gap:8,fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.35)',marginBottom:4,alignItems:'flex-start'}}>
                    <span style={{color:'#20B2AA',flexShrink:0}}>[{i+1}]</span>
                    <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
