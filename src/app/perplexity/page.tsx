'use client';
import { useState } from 'react';
import Link from 'next/link';

const PARTNERSHIP_TIERS = [
  {
    id:'api-partner',
    icon:'🔌',
    name:'API Partner',
    desc:'Sonar API Integration im Creator OS',
    status:'aktiv',
    color:'#10B981',
    features:[
      'sonar · sonar-pro · sonar-deep-research',
      'Echtzeit-Web-Suche in allen 16 Apps',
      'Citations in Creator-Content eingebettet',
      '~$0,006–0,40 pro Anfrage (Pay-as-you-go)',
    ],
  },
  {
    id:'tech-partner',
    icon:'🤝',
    name:'Technology Partner',
    desc:'Offizielles Partnership-Programm',
    status:'angestrebt',
    color:'#00D4FF',
    features:[
      'Co-Marketing mit Perplexity Brand',
      'Früher Zugang zu neuen API-Features',
      'Gemeinsames Go-to-Market DACH',
      'Revenue-Share Modell für Creator',
    ],
  },
  {
    id:'publisher',
    icon:'📰',
    name:'Publishers Program',
    desc:'Creator-Content als zitierfähige Quelle',
    status:'angestrebt',
    color:'#C9A84C',
    features:[
      'Creator-Profile indexiert als Authority Sources',
      'Advertising Revenue Share für Creator',
      'Verifizierte Creator = höhere Citation-Rate',
      'C2PA-Signatur → Perplexity-Trust-Signal',
    ],
  },
  {
    id:'computer-enterprise',
    icon:'🖥',
    name:'Computer Enterprise',
    desc:'Perplexity Computer für Creator-Workflows',
    status:'roadmap',
    color:'#8B5CF6',
    features:[
      'Multi-Agenten-Orchestrierung für Creator',
      'Slack-Integration für Team-Workflows',
      '20+ Modelle (GPT-5 · Claude 4.6 · Grok)',
      'Snowflake-Connector für Analytics',
    ],
  },
];

const FUTURES = [
  {
    id:'model-council',
    icon:'⚖️',
    name:'Model Council',
    phase:'Q2 2026',
    color:'#FFD700',
    desc:'Mehrere KI-Modelle gleichzeitig vergleichen',
    detail:'Perplexity Model Council erlaubt simultane Ausgabe von GPT-5.2 + Claude 4.6 + Grok für dieselbe Anfrage. RealSync Creator können die beste Antwort wählen oder kombinieren.',
    status:'integrating',
  },
  {
    id:'perplexity-spaces',
    icon:'🗂',
    name:'Perplexity Spaces',
    phase:'Q2 2026',
    color:'#00D4FF',
    desc:'Persistente Research-Workspaces pro Creator',
    detail:'Spaces speichern Recherchen, Links, Dokumente und Chat-Verlauf dauerhaft. OPTIMUS bekommt eigene Creator-Spaces: separate Workspaces für "AdEngine Research", "Trend Analysis", "Content Calendar".',
    status:'planned',
  },
  {
    id:'perplexity-pages',
    icon:'📄',
    name:'Perplexity Pages',
    phase:'Q3 2026',
    color:'#10B981',
    desc:'Automatisch generierte Creator-Reports',
    detail:'Pages generiert aus OPTIMUS-Gesprächen strukturierte, zitierbare Reports. Ein Creator fragt "Erstelle meinen Monatsbericht" → OPTIMUS erstellt eine vollständige Seite mit Citations, Metriken und Empfehlungen.',
    status:'planned',
  },
  {
    id:'computer-agent',
    icon:'🖥',
    name:'Perplexity Computer',
    phase:'Q3 2026',
    color:'#8B5CF6',
    desc:'Multi-Step autonome Creator-Workflows',
    detail:'Computer delegiert komplexe Creator-Aufgaben autonom: "Analysiere meine letzten 30 Videos, finde den besten Trend, erstelle eine Ad, plane sie für morgen 19 Uhr." — vollständig automatisch über alle 16 Apps.',
    status:'roadmap',
  },
  {
    id:'connectors',
    icon:'🔗',
    name:'Perplexity Connectors',
    phase:'Q4 2026',
    color:'#F59E0B',
    desc:'Google Drive · Notion · Slack · YouTube-Daten',
    detail:'Connectors verbinden OPTIMUS direkt mit Creator-Daten: YouTube Analytics, Google Drive Assets, Notion-Dokumente. "Analysiere meine letzten 10 Video-Skripte und schlage Verbesserungen vor."',
    status:'roadmap',
  },
  {
    id:'finance-module',
    icon:'💹',
    name:'Finance Intelligence',
    phase:'Q4 2026',
    color:'#EF4444',
    desc:'Echtzeit Revenue-Tracking + KI-Prognosen',
    detail:'Perplexity Finance-Modul mit Creator-Revenue-Daten. OPTIMUS analysiert Sponsoring-Rates, Ad-CPM-Trends, empfiehlt optimale Paket-Preise basierend auf Echtzeit-Marktdaten.',
    status:'roadmap',
  },
];

const STATUS_META: Record<string, { l: string; c: string }> = {
  aktiv:       { l:'✓ Aktiv',      c:'#10B981' },
  angestrebt:  { l:'◎ Ziel',       c:'#00D4FF' },
  roadmap:     { l:'◷ Roadmap',    c:'#8B5CF6' },
  integrating: { l:'⟳ In Arbeit',  c:'#FFD700' },
  planned:     { l:'○ Geplant',    c:'#6B7280' },
};

export default function PerplexityPage() {
  const [activeTab, setActiveTab] = useState<'partnership'|'futures'|'pitch'>('partnership');

  return (
    <div className="min-h-screen bg-[#03050A] text-white" style={{fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.97)',borderBottom:'1px solid #0F1520',padding:'0 20px',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Hub</Link>
          <span style={{color:'#1A2130'}}>|</span>
          <span style={{fontWeight:800,fontSize:14}}>
            <span style={{color:'#20B2AA'}}>⬡</span> RealSync × <span style={{color:'#20B2AA'}}>Perplexity</span>
          </span>
        </div>
        <Link href="/optimus" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'5px 14px',background:'rgba(32,178,170,.15)',border:'1px solid rgba(32,178,170,.35)',borderRadius:8,color:'#20B2AA',textDecoration:'none'}}>
          🤖 OPTIMUS öffnen →
        </Link>
      </div>

      {/* Hero */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'48px 20px 32px',textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:600,height:300,background:'radial-gradient(ellipse, rgba(32,178,170,.08), transparent 70%)',pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16,marginBottom:20}}>
          <div style={{width:56,height:56,background:'linear-gradient(135deg,#03050A,#0A0F1A)',border:'2px solid #C9A84C',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>
            <span style={{fontWeight:900,fontSize:14,color:'#C9A84C'}}>RS</span>
          </div>
          <div style={{fontWeight:900,fontSize:24,color:'rgba(255,255,255,.4)'}}>×</div>
          <div style={{width:56,height:56,background:'linear-gradient(135deg,#20B2AA22,#20B2AA44)',border:'2px solid #20B2AA',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>⬡</div>
        </div>
        <h1 style={{fontWeight:900,fontSize:'clamp(24px,4vw,42px)',lineHeight:1.15,marginBottom:12}}>
          RealSync Dynamics<br/>
          <span style={{color:'#20B2AA'}}>× Perplexity Partnership</span>
        </h1>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'rgba(255,255,255,.4)',maxWidth:520,margin:'0 auto 28px',lineHeight:1.8}}>
          Das Creator OS der Zukunft — gebaut auf der schnellsten,<br/>
          zitierfähigsten KI-Such-Infrastruktur der Welt.<br/>
          <span style={{color:'#20B2AA'}}>780M+ Queries/Monat · $20B Bewertung · 238 Länder</span>
        </p>

        {/* Stats */}
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginBottom:32}}>
          {[
            {v:'780M+', l:'Queries/Monat', c:'#20B2AA'},
            {v:'$20B',  l:'Bewertung 2025',c:'#FFD700'},
            {v:'16',    l:'Apps integriert',c:'#C9A84C'},
            {v:'3',     l:'Sonar Modelle',  c:'#8B5CF6'},
          ].map(s=>(
            <div key={s.l} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:12,padding:'12px 20px',textAlign:'center'}}>
              <div style={{fontWeight:900,fontSize:22,color:s.c}}>{s.v}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginTop:3,letterSpacing:'.08em'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:6,justifyContent:'center'}}>
          {[
            {id:'partnership' as const, label:'🤝 Partnership'},
            {id:'futures'     as const, label:'🚀 Perplexity Futures'},
            {id:'pitch'       as const, label:'📋 Partnership Pitch'},
          ].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{fontFamily:"'DM Mono',monospace",fontSize:11,padding:'8px 18px',borderRadius:20,border:`1px solid ${activeTab===t.id?'rgba(32,178,170,.5)':'#1A2130'}`,background:activeTab===t.id?'rgba(32,178,170,.12)':'transparent',color:activeTab===t.id?'#20B2AA':'rgba(255,255,255,.4)',cursor:'pointer',transition:'all .15s'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'0 20px 60px'}}>

        {/* PARTNERSHIP TAB */}
        {activeTab==='partnership' && (
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16}}>// Partnership Stufen</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:32}}>
              {PARTNERSHIP_TIERS.map(tier=>{
                const st = STATUS_META[tier.status];
                return (
                  <div key={tier.id} style={{background:'#080C14',border:`1px solid ${tier.color}25`,borderRadius:16,padding:'20px',position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg, ${tier.color}, transparent)`}}/>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:22}}>{tier.icon}</span>
                        <div>
                          <div style={{fontWeight:800,fontSize:14}}>{tier.name}</div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.35)',marginTop:1}}>{tier.desc}</div>
                        </div>
                      </div>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'3px 8px',borderRadius:20,background:st.c+'18',color:st.c,border:`1px solid ${st.c}30`}}>{st.l}</span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {tier.features.map((f,i)=>(
                        <div key={i} style={{display:'flex',gap:8,fontSize:11,color:'rgba(255,255,255,.55)'}}>
                          <span style={{color:tier.color,flexShrink:0}}>▸</span>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:10}}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current integration status */}
            <div style={{background:'rgba(32,178,170,.06)',border:'1px solid rgba(32,178,170,.2)',borderRadius:16,padding:'24px'}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'#20B2AA',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:16}}>// Aktuelle Integration</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {[
                  {icon:'✓', label:'sonar API',              sub:'Bronze+ · 5 Coins',    c:'#10B981'},
                  {icon:'✓', label:'sonar-pro API',          sub:'Silber+ · 15 Coins',   c:'#10B981'},
                  {icon:'✓', label:'sonar-deep-research',    sub:'Gold+ · 50 Coins',     c:'#10B981'},
                  {icon:'✓', label:'Echtzeit Citations',     sub:'In allen Responses',   c:'#10B981'},
                  {icon:'✓', label:'OPTIMUS Agent',          sub:'/optimus live',        c:'#10B981'},
                  {icon:'⟳', label:'PERPLEXITY_API_KEY',     sub:'ENV setzen → aktiv',   c:'#FFD700'},
                ].map(i=>(
                  <div key={i.label} style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.03)',borderRadius:8,padding:'10px'}}>
                    <span style={{color:i.c,fontWeight:700,fontSize:14,flexShrink:0}}>{i.icon}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:11}}>{i.label}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginTop:1}}>{i.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16,padding:'10px 14px',background:'rgba(255,215,0,.08)',border:'1px solid rgba(255,215,0,.2)',borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:10,color:'#FFD700'}}>
                📋 Nächster Schritt: <strong>PERPLEXITY_API_KEY</strong> in Vercel ENV → perplexity.ai/settings/api → OPTIMUS mit echtem Echtzeit-Web
              </div>
            </div>
          </div>
        )}

        {/* FUTURES TAB */}
        {activeTab==='futures' && (
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8}}>// Perplexity Futures → OPTIMUS Integration Roadmap</div>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:20}}>
              Basierend auf Perplexity Ask 2026 Conference · Model Council Launch Feb 2026 · Computer for Enterprise März 2026
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {FUTURES.map((f,i)=>{
                const st = STATUS_META[f.status];
                return (
                  <div key={f.id} style={{background:'#080C14',border:`1px solid ${f.color}20`,borderRadius:14,padding:'18px 20px',display:'flex',gap:16,position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:f.color}}/>
                    <div style={{width:44,height:44,borderRadius:12,background:f.color+'18',border:`1px solid ${f.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                      {f.icon}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4,flexWrap:'wrap'}}>
                        <span style={{fontWeight:800,fontSize:14}}>{f.name}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:f.color,background:f.color+'15',padding:'2px 7px',borderRadius:4}}>{f.phase}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'2px 7px',borderRadius:4,background:st.c+'15',color:st.c,border:`1px solid ${st.c}25`,marginLeft:'auto'}}>{st.l}</span>
                      </div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.5)',marginBottom:6}}>{f.desc}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,.65)',lineHeight:1.6}}>{f.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PITCH TAB */}
        {activeTab==='pitch' && (
          <div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16}}>// Partnership Pitch — RealSync × Perplexity</div>

            <div style={{background:'#080C14',border:'1px solid rgba(32,178,170,.25)',borderRadius:16,padding:'28px',marginBottom:14}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#20B2AA',letterSpacing:'.2em',marginBottom:12}}>// EXECUTIVE SUMMARY</div>
              <p style={{fontSize:14,lineHeight:1.8,color:'rgba(255,255,255,.8)',marginBottom:12}}>
                <strong>RealSync Dynamics</strong> ist das erste <strong>Creator OS</strong> mit 16 integrierten SaaS-Apps, C2PA-Verifikation und einem KI-Agenten-Layer. Mit <strong>Perplexity Sonar API</strong> als Kern-Infrastruktur positionieren wir uns als die führende <strong>KI-gesteuerte Creator-Plattform im DACH-Raum</strong>.
              </p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {[
                  {v:'16', l:'Apps im Ökosystem', c:'#C9A84C'},
                  {v:'DACH', l:'Primärmarkt', c:'#20B2AA'},
                  {v:'B2B', l:'QR Referral-Modell', c:'#8B5CF6'},
                ].map(s=>(
                  <div key={s.l} style={{background:'rgba(255,255,255,.03)',borderRadius:8,padding:'10px',textAlign:'center'}}>
                    <div style={{fontWeight:900,fontSize:20,color:s.c}}>{s.v}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title:'🎯 Warum Perplexity?',
                color:'#20B2AA',
                items:[
                  'Einzige KI mit echten Citations → Creator-Content bleibt verifizierbar',
                  '$20B Bewertung · 780M Queries/Mo · schnellstes Wachstum im AI-Markt',
                  'Publishers Program → RealSync-Creator als zitierbare Quellen indexiert',
                  'Model Council → Multi-Modell für optimale Creator-Ergebnisse',
                ],
              },
              {
                title:'💎 Was wir einbringen',
                color:'#C9A84C',
                items:[
                  '16-App Creator OS als Showcase für Perplexity Enterprise-Capabilities',
                  'DACH-Markt Distribution · Creator Community',
                  'C2PA-verifizierten Creator-Content als hochwertige Perplexity-Quellen',
                  'B2B QR-Referral-Netzwerk als viraler Perplexity-Growth-Kanal',
                  'OPTIMUS Agent als Best-Practice Implementierung der Sonar API',
                ],
              },
              {
                title:'🚀 Partnership-Ziele',
                color:'#8B5CF6',
                items:[
                  'Technology Partner Status → Co-Marketing DACH',
                  'Publishers Program → Revenue-Share für Creator',
                  'Früher Zugang zu Perplexity Computer für OPTIMUS-Integration',
                  'Case Study: "Creator OS powered by Perplexity" → Ask 2027 Conference',
                  'Perplexity als Standard-KI-Layer im gesamten Creator OS',
                ],
              },
            ].map(section=>(
              <div key={section.title} style={{background:'#080C14',border:`1px solid ${section.color}20`,borderRadius:14,padding:'20px',marginBottom:10}}>
                <div style={{fontWeight:800,fontSize:15,color:section.color,marginBottom:12}}>{section.title}</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {section.items.map((item,i)=>(
                    <div key={i} style={{display:'flex',gap:10,fontSize:13,color:'rgba(255,255,255,.7)'}}>
                      <span style={{color:section.color,flexShrink:0}}>▸</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{marginTop:20,display:'flex',gap:10,flexWrap:'wrap'}}>
              <a href="https://www.perplexity.ai/api-platform" target="_blank" rel="noopener noreferrer"
                style={{padding:'10px 20px',background:'rgba(32,178,170,.15)',border:'1px solid rgba(32,178,170,.4)',borderRadius:10,color:'#20B2AA',fontFamily:"'DM Mono',monospace",fontSize:11,textDecoration:'none',fontWeight:700}}>
                ⬡ Perplexity API Platform →
              </a>
              <a href="https://www.perplexity.ai/hub/blog" target="_blank" rel="noopener noreferrer"
                style={{padding:'10px 20px',background:'transparent',border:'1px solid #1A2130',borderRadius:10,color:'rgba(255,255,255,.45)',fontFamily:"'DM Mono',monospace",fontSize:11,textDecoration:'none'}}>
                Publishers Program →
              </a>
              <Link href="/optimus"
                style={{padding:'10px 20px',background:'linear-gradient(135deg,#20B2AA,#008B8B)',border:'none',borderRadius:10,color:'#000',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,textDecoration:'none'}}>
                🤖 OPTIMUS jetzt nutzen →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
