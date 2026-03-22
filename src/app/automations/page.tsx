'use client';
import { useState } from 'react';
import Link from 'next/link';

const AGENTS = [
  {
    id:'creatorseal-agent',
    name:'CreatorSeal Guard',
    icon:'🛡',
    color:'#C9A84C',
    status:'active',
    category:'Security',
    desc:'Scannt Content automatisch auf C2PA-Konformität, Deepfakes und Blockchain-Ankerpunkte',
    triggers:['Content-Upload','Scheduled Daily Scan','API-Request'],
    actions:['C2PA signieren','Deepfake-Scan ausführen','Blockchain-Timestamp setzen','Trust-Score aktualisieren'],
    lastRun:'vor 2 Min',
    runsToday:847,
    coinCost:5,
  },
  {
    id:'review-agent',
    name:'ReviewRadar Agent',
    icon:'⭐',
    color:'#00D4FF',
    status:'active',
    category:'Reputation',
    desc:'Überwacht alle Plattformen auf neue Reviews und generiert automatisch KI-Antworten',
    triggers:['Neue Google Review','Neue Trustpilot Review','Täglicher Scan 08:00'],
    actions:['Review analysieren','KI-Antwort generieren','Urgency-Score berechnen','Benachrichtigung senden'],
    lastRun:'vor 14 Min',
    runsToday:312,
    coinCost:3,
  },
  {
    id:'churn-agent',
    name:'ChurnRescue Agent',
    icon:'💳',
    color:'#3B82F6',
    status:'active',
    category:'Revenue',
    desc:'Überwacht Stripe-Events und startet automatisch Recovery-Sequenzen bei Failed Payments',
    triggers:['Stripe payment_failed','Stripe invoice.payment_failed','Abo-Kündigung erkannt'],
    actions:['Smart-Retry planen','KI-E-Mail generieren','SMS senden','WhatsApp-Follow-up'],
    lastRun:'vor 1h',
    runsToday:23,
    coinCost:8,
  },
  {
    id:'trend-agent',
    name:'TrendRadar Agent',
    icon:'📡',
    color:'#EF4444',
    status:'active',
    category:'Intelligence',
    desc:'Analysiert via Perplexity sonar täglich Trends und pusht Alert wenn Creator-relevante Themen viral gehen',
    triggers:['Stündlicher Trend-Scan','Keyword-Alert','Competitor-Monitoring'],
    actions:['Perplexity sonar-Anfrage','Trend-Score berechnen','OPTIMUS-Empfehlung generieren','Creator-Alert senden'],
    lastRun:'vor 34 Min',
    runsToday:168,
    coinCost:5,
  },
  {
    id:'deal-agent',
    name:'DealFlow Agent',
    icon:'🎯',
    color:'#10B981',
    status:'idle',
    category:'Revenue',
    desc:'Matched Creator-Profil automatisch mit passenden Brands und sendet personalisierte Deal-Anfragen',
    triggers:['Trust-Score-Update','Wöchentlicher Brand-Scan','Manueller Trigger'],
    actions:['Perplexity Brand-Recherche','Fit-Score berechnen','Deal-Email generieren','Pipeline aktualisieren'],
    lastRun:'vor 2h',
    runsToday:7,
    coinCost:20,
  },
  {
    id:'content-agent',
    name:'ContentForge Agent',
    icon:'✍️',
    color:'#F59E0B',
    status:'idle',
    category:'Content',
    desc:'Generiert täglich Content-Vorschläge basierend auf aktuellen Trends und Creator-Performance',
    triggers:['Täglicher Report 07:00','Trend-Alert vom TrendRadar','Manueller Trigger'],
    actions:['Trend-Daten abrufen','6 Content-Formate generieren','ScheduleMaster eintragen','Creator benachrichtigen'],
    lastRun:'vor 6h',
    runsToday:4,
    coinCost:10,
  },
  {
    id:'coins-agent',
    name:'Coins & Referral Agent',
    icon:'🪙',
    color:'#FFD700',
    status:'active',
    category:'Growth',
    desc:'Überwacht Referral-Events und vergibt automatisch Coins — 50% des Planpreises bei jedem Signup',
    triggers:['Referral-Signup','Plan-Upgrade via Referral','Meilenstein-Bonus'],
    actions:['Coins berechnen','award_referral_coins() ausführen','Supabase aktualisieren','Benachrichtigung senden'],
    lastRun:'vor 5 Min',
    runsToday:1247,
    coinCost:0,
  },
  {
    id:'optimus-orchestrator',
    name:'OPTIMUS Orchestrator',
    icon:'🤖',
    color:'#8B5CF6',
    status:'active',
    category:'Orchestration',
    desc:'Zentraler Agent-Orchestrator — koordiniert alle anderen Agenten, Model Council und cross-app Workflows',
    triggers:['Creator-Anfrage','Kritisches Event','Scheduled Workflow','Perplexity Webhook'],
    actions:['Agent auswählen','Workflow orchestrieren','Model Council aktivieren','Ergebnis aggregieren','Creator informieren'],
    lastRun:'vor 30 Sek',
    runsToday:3891,
    coinCost:15,
  },
];

const FLOW_STEPS = [
  { icon:'📥', label:'Trigger',      desc:'Event erkannt', color:'#C9A84C' },
  { icon:'🔀', label:'Router',       desc:'Agent auswählen', color:'#00D4FF' },
  { icon:'🤖', label:'Agent',        desc:'Task ausführen',  color:'#8B5CF6' },
  { icon:'⬡',  label:'Perplexity',   desc:'KI-Analyse',     color:'#20B2AA' },
  { icon:'📤', label:'Aktion',       desc:'Ergebnis liefern',color:'#10B981' },
  { icon:'🔄', label:'Feedback',     desc:'Score updaten',   color:'#EC4899' },
];

const CATEGORIES = ['Alle','Security','Revenue','Reputation','Intelligence','Content','Growth','Orchestration'];

const STATUS_META: Record<string,{l:string;c:string}> = {
  active: { l:'● Aktiv', c:'#10B981' },
  idle:   { l:'○ Bereit', c:'#6B7280' },
  error:  { l:'⚠ Fehler',  c:'#EF4444' },
};

export default function AutomationsPage() {
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [expandedAgent, setExpandedAgent] = useState<string|null>(null);

  const filtered = activeCategory === 'Alle'
    ? AGENTS
    : AGENTS.filter(a => a.category === activeCategory);

  const totalRuns = AGENTS.reduce((s, a) => s + a.runsToday, 0);
  const activeCount = AGENTS.filter(a => a.status === 'active').length;

  return (
    <div style={{minHeight:'100vh',background:'#03050A',color:'white',fontFamily:"'Syne',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&display=swap');@keyframes fu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}.fu{animation:fu .35s ease both}.pulse{animation:pulse 2s ease infinite}`}</style>

      {/* Nav */}
      <div style={{background:'rgba(3,5,10,.98)',borderBottom:'1px solid #0F1520',height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,backdropFilter:'blur(20px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/hub" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.3)',textDecoration:'none'}}>← Hub</Link>
          <span style={{color:'#1A2130'}}>|</span>
          <span style={{fontWeight:800,fontSize:14}}>⚡ Automations</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'2px 8px',background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.25)',borderRadius:4,color:'#10B981'}}>{activeCount} aktiv · {totalRuns.toLocaleString('de')} Runs/Tag</span>
        </div>
        <Link href="/optimus" style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:'5px 12px',background:'rgba(139,92,246,.1)',border:'1px solid rgba(139,92,246,.25)',borderRadius:7,color:'#8B5CF6',textDecoration:'none'}}>🤖 OPTIMUS →</Link>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'28px 24px'}}>

        {/* Hero */}
        <div className="fu" style={{marginBottom:28}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8}}>// Agent Registry · Event-driven Architecture</div>
          <h1 style={{fontWeight:900,fontSize:26,marginBottom:6}}>KI-Agenten · Vollautomatisch.</h1>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.7,maxWidth:560}}>
            8 spezialisierte Agenten arbeiten rund um die Uhr für dich — orchestriert durch OPTIMUS,
            angetrieben von Perplexity AI. Event-driven, lose gekoppelt, vollständig automatisiert.
          </p>
        </div>

        {/* Stats */}
        <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
          {[
            {v:activeCount.toString(),       l:'Aktive Agenten',    c:'#10B981'},
            {v:totalRuns.toLocaleString('de'),l:'Runs heute',         c:'#C9A84C'},
            {v:'< 200ms',                    l:'Ø Response-Zeit',   c:'#00D4FF'},
            {v:'99,8%',                      l:'Uptime',            c:'#8B5CF6'},
          ].map(s=>(
            <div key={s.l} style={{background:'#080C14',border:'1px solid #1A2130',borderRadius:10,padding:'10px 16px',textAlign:'center'}}>
              <div style={{fontWeight:900,fontSize:18,color:s.c}}>{s.v}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div style={{background:'#080C14',border:'1px solid rgba(139,92,246,.2)',borderRadius:16,padding:'20px 24px',marginBottom:24}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:16}}>// Event-Driven Flow · OPTIMUS Orchestrator</div>
          <div style={{display:'flex',alignItems:'center',gap:0,overflowX:'auto'}}>
            {FLOW_STEPS.map((s,i)=>(
              <div key={s.label} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                <div style={{textAlign:'center',padding:'0 8px'}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:s.color+'15',border:`1.5px solid ${s.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,margin:'0 auto 6px'}}>{s.icon}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:s.color,fontWeight:700}}>{s.label}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',marginTop:1}}>{s.desc}</div>
                </div>
                {i<FLOW_STEPS.length-1&&<div style={{width:24,height:2,background:`linear-gradient(90deg,${s.color}40,${FLOW_STEPS[i+1].color}40)`,flexShrink:0,marginBottom:20}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
          {CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)}
              style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'5px 12px',borderRadius:20,border:`1px solid ${activeCategory===cat?'rgba(139,92,246,.5)':'#1A2130'}`,background:activeCategory===cat?'rgba(139,92,246,.12)':'transparent',color:activeCategory===cat?'#8B5CF6':'rgba(255,255,255,.35)',cursor:'pointer',transition:'all .15s'}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Agents */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {filtered.map((agent,i)=>{
            const st = STATUS_META[agent.status];
            const isExpanded = expandedAgent === agent.id;
            return (
              <div key={agent.id} className="fu" style={{animationDelay:`${i*.04}s`,background:'#080C14',border:`1px solid ${isExpanded?agent.color+'40':'#1A2130'}`,borderRadius:14,overflow:'hidden',transition:'border-color .2s'}}>
                {/* Header */}
                <div onClick={()=>setExpandedAgent(isExpanded?null:agent.id)}
                  style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
                  <div style={{width:40,height:40,borderRadius:11,background:agent.color+'14',border:`1px solid ${agent.color}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{agent.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                      <span style={{fontWeight:800,fontSize:14}}>{agent.name}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,padding:'2px 7px',background:st.c+'15',border:`1px solid ${st.c}30`,borderRadius:3,color:st.c,display:'flex',alignItems:'center',gap:4}}>
                        {agent.status==='active'&&<span className="pulse" style={{width:5,height:5,borderRadius:'50%',background:st.c,display:'inline-block'}}/>}
                        {st.l.slice(2)}
                      </span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.25)',padding:'2px 7px',background:'rgba(255,255,255,.04)',borderRadius:3}}>{agent.category}</span>
                    </div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.5}}>{agent.desc}</div>
                  </div>
                  <div style={{display:'flex',gap:16,flexShrink:0,textAlign:'right'}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:agent.color}}>{agent.runsToday.toLocaleString('de')}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.25)'}}>Runs/Tag</div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(255,255,255,.35)'}}>{agent.lastRun}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.25)'}}>letzter Run</div>
                    </div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.2)'}}>{isExpanded?'▲':'▼'}</div>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{padding:'0 18px 16px',borderTop:'1px solid rgba(255,255,255,.05)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:14}}>
                      <div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:8}}>Triggers</div>
                        {agent.triggers.map(t=>(
                          <div key={t} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
                            <span style={{width:6,height:6,borderRadius:'50%',background:agent.color+'60',display:'inline-block',flexShrink:0}}/>
                            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.5)'}}>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(255,255,255,.3)',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:8}}>Actions</div>
                        {agent.actions.map(a=>(
                          <div key={a} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
                            <span style={{color:agent.color,fontSize:10,flexShrink:0}}>▸</span>
                            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.55)'}}>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{marginTop:14,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                      <button style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'6px 14px',background:agent.color+'18',border:`1px solid ${agent.color}35`,borderRadius:7,color:agent.color,cursor:'pointer',fontWeight:700}}>
                        ▶ Manuell ausführen
                      </button>
                      <button style={{fontFamily:"'DM Mono',monospace",fontSize:9,padding:'6px 14px',background:'transparent',border:'1px solid #1A2130',borderRadius:7,color:'rgba(255,255,255,.35)',cursor:'pointer'}}>
                        ⚙ Konfigurieren
                      </button>
                      {agent.coinCost > 0 && (
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(201,168,76,.5)'}}>
                          🪙 {agent.coinCost} Coins/Run
                        </span>
                      )}
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.2)',marginLeft:'auto'}}>
                        ⬡ Perplexity-powered
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Architecture note */}
        <div style={{marginTop:24,background:'rgba(32,178,170,.05)',border:'1px solid rgba(32,178,170,.15)',borderRadius:14,padding:'18px 20px'}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'#20B2AA',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:8}}>// Langfristige Architektur-Vision</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {[
              {icon:'🏗', title:'Event-driven',     desc:'Kafka/NATS Event-Bus als Backbone · Agenten kommunizieren über Events statt direkte Calls'},
              {icon:'🧠', title:'RAG + Vector DB',  desc:'Perplexity + Qdrant für Langzeit-Wissen · Creator-Historie · Marktdaten kontextuell'},
              {icon:'🛡', title:'Policy Engine',    desc:'Guard-Agent überprüft alle kritischen Aktionen · Compliance vor jeder On-Chain-Write'},
            ].map(item=>(
              <div key={item.title} style={{background:'rgba(255,255,255,.02)',borderRadius:10,padding:'12px'}}>
                <div style={{fontSize:22,marginBottom:6}}>{item.icon}</div>
                <div style={{fontWeight:700,fontSize:12,color:'#20B2AA',marginBottom:4}}>{item.title}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.4)',lineHeight:1.6}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
