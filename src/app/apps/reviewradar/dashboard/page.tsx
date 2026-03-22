'use client';
import { useState } from 'react';
import OptimusButton from '@/components/OptimusButton';
import Link from 'next/link';
import { PlanId, PLANS, hasFeature, formatLimit, getRequiredPlan } from '@/lib/plans';

// ── MOCK DATA ─────────────────────────────────────────────
const REVIEWS = [
  {id:1,name:'Marcus K.',  stars:5,platform:'google',      text:'Absolut top Service! Schnell, freundlich und super kompetent. Sehr empfehlenswert!',time:'vor 2h', answered:false},
  {id:2,name:'Sandra M.',  stars:3,platform:'trustpilot',  text:'Gute Leistung, Wartezeit etwas lang. Insgesamt zufrieden.',                         time:'vor 5h', answered:false},
  {id:3,name:'Peter W.',   stars:1,platform:'google',      text:'Schlechter Service, nie wieder! Warte seit 2 Wochen auf Rückruf.',                  time:'vor 8h', answered:false},
  {id:4,name:'Anna S.',    stars:5,platform:'provenexpert',text:'Wunderbarer Betrieb, immer gerne wieder!',                                          time:'gestern',answered:true },
  {id:5,name:'Tom B.',     stars:4,platform:'trustpilot',  text:'Sehr zufrieden, komme gerne wieder. Parkplatz war schwierig.',                      time:'vor 2T', answered:true },
  {id:6,name:'Lisa R.',    stars:2,platform:'yelp',         text:'Leider enttäuscht. Preis-Leistung stimmt nicht.',                                   time:'vor 3T', answered:false},
];
const PM:Record<string,{icon:string;color:string;name:string}> = {
  google:      {icon:'🔵',color:'#4285F4',name:'Google'},
  trustpilot:  {icon:'🟢',color:'#00B67A',name:'Trustpilot'},
  provenexpert:{icon:'🟡',color:'#FFA500',name:'ProvenExpert'},
  yelp:        {icon:'🔴',color:'#FF1A1A',name:'Yelp'},
};
const AI_REPLIES:Record<number,string> = {
  1:'Herzlichen Dank, Marcus! Ihr positives Feedback freut uns wirklich sehr. Wir freuen uns auf Ihren nächsten Besuch! 🙏',
  2:'Vielen Dank, Sandra! Die Wartezeit tut uns leid — wir arbeiten bereits an Verbesserungen. Beim nächsten Besuch werden wir Sie begeistern! 💪',
  3:'Lieber Peter, das tut uns sehr leid! Bitte kontaktieren Sie uns direkt, damit wir das sofort lösen. 🙏',
  6:'Danke Lisa! Wir nehmen Ihr Feedback ernst und klären das gern persönlich.',
};

// ── LOCK GATE ─────────────────────────────────────────────
function LockGate({required,current,children,label}:{required:PlanId;current:PlanId;children:React.ReactNode;label:string}) {
  const planOrder:PlanId[]=['gratis','bronze','silber','gold','platin','diamant'];
  const hasAccess = planOrder.indexOf(current) >= planOrder.indexOf(required);
  if(hasAccess) return <>{children}</>;
  const req = PLANS[required];
  return (
    <div className="relative">
      <div className="blur-[2px] pointer-events-none select-none opacity-40">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 rounded-xl backdrop-blur-[1px] border border-gray-700">
        <span className="text-2xl mb-2">🔒</span>
        <div className="font-black text-sm mb-1">{label}</div>
        <div className="text-xs text-gray-400 mb-3">
          Ab <span style={{color:req.color}} className="font-bold">{req.emoji} {req.name} (€{req.price.monthly}/Mo)</span>
        </div>
        <Link href={`/pricing?app=reviewradar&highlight=${required}`}
          className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:opacity-90"
          style={{background:req.color,color:'#000'}}>
          Jetzt upgraden →
        </Link>
      </div>
    </div>
  );
}

// ── USAGE BADGE ───────────────────────────────────────────
function UsageBadge({used,max,label,color}:{used:number;max:number;label:string;color:string}) {
  const pct = max===-1?0:Math.round(used/max*100);
  const isUnlimited = max===-1;
  return (
    <div className="bg-gray-800 rounded-lg px-3 py-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span style={{color}} className="font-bold">{used} / {isUnlimited?'∞':max}</span>
      </div>
      {!isUnlimited && (
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:pct>80?'#EF4444':color}}/>
        </div>
      )}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────
export default function ReviewRadarDashboard() {
  const [currentPlan, setCurrentPlan] = useState<PlanId>('bronze');
  const [filter, setFilter] = useState('all');
  const [posted, setPosted] = useState<Set<number>>(new Set());
  const [replies, setReplies] = useState<Record<number,string>>({});
  const [generating, setGenerating] = useState<number|null>(null);
  const [activeReview, setActiveReview] = useState<number|null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertToggles, setAlertToggles] = useState({push:true,email:true,slack:false,daily:true});
  const [showAnalytics, setShowAnalytics] = useState(false);

  const plan = PLANS[currentPlan];
  const tools = hasFeature(currentPlan,'dashboardTools');
  const bulk = hasFeature(currentPlan,'bulkActions');
  const analytics = hasFeature(currentPlan,'aiAnalytics');
  const aiLimit = plan.limits.aiReplies;
  const [aiUsed, setAiUsed] = useState(7);

  const filtered = REVIEWS.filter(r=>{
    if(filter==='open') return !r.answered&&!posted.has(r.id);
    if(filter==='negative') return r.stars<=2;
    if(filter==='positive') return r.stars>=4;
    return true;
  });
  const openCount = REVIEWS.filter(r=>!r.answered&&!posted.has(r.id)).length;
  const answeredCount = REVIEWS.filter(r=>r.answered||posted.has(r.id)).length;
  const avgRating = (REVIEWS.reduce((s,r)=>s+r.stars,0)/REVIEWS.length).toFixed(1);

  function genReply(id:number){
    if(aiLimit>0&&aiUsed>=aiLimit){
      alert(`KI-Limit erreicht! (${aiUsed}/${aiLimit}/Mo). Upgrade für mehr.`); return;
    }
    setGenerating(id);
    setTimeout(()=>{
      setReplies(p=>({...p,[id]:AI_REPLIES[id]||'Vielen Dank für Ihre Bewertung!'}));
      setAiUsed(p=>p+1);
      setGenerating(null);
    },1400);
  }
  function postReply(id:number){
    setPosted(p=>new Set(p).add(id));
    setReplies(p=>{const n={...p};delete n[id];return n;});
    setActiveReview(null);
  }
  function runSync(){
    setSyncing(true); setSyncStep(0);
    let s=0;
    const t=setInterval(()=>{s++;setSyncStep(s);if(s>=4){clearInterval(t);setSyncing(false);}},800);
  }
  function bulkReply(){
    if(!bulk){return;}
    REVIEWS.filter(r=>!r.answered&&!posted.has(r.id)&&AI_REPLIES[r.id]).forEach((r,i)=>setTimeout(()=>genReply(r.id),i*900));
  }
  const stars=(n:number)=>Array.from({length:5},(_,i)=><span key={i} style={{color:i<n?'#FFD700':'#374151'}}>★</span>);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="bg-blue-950/40 border-b border-blue-900/40 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-blue-400">⭐ ReviewRadar</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Plan Switcher (Demo) */}
          <div className="flex items-center gap-1 bg-gray-900 rounded-full p-1 border border-gray-800">
            {(['gratis','bronze','silber','gold'] as PlanId[]).map(p=>(
              <button key={p} onClick={()=>setCurrentPlan(p)}
                className="text-xs font-bold px-2.5 py-1 rounded-full transition-all"
                style={currentPlan===p?{background:PLANS[p].color,color:'#000'}:{color:'#6B7280'}}>
                {PLANS[p].emoji}
              </button>
            ))}
          </div>
          <Link href="/workflows" className="text-xs font-bold px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full">⚡ Workflows</Link>
          <Link href={`/pricing?app=reviewradar`} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:plan.color,color:'#000'}}>
            {plan.emoji} {plan.name}
          </Link>
        </div>
      </div>

      {/* PLAN BANNER */}
      {currentPlan==='gratis'&&(
        <div className="bg-amber-950/30 border-b border-amber-800/30 px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs text-amber-300">🔒 Gratis-Plan: Tools & KI-Antworten gesperrt. Upgrade auf Bronze für volle Funktion.</span>
          <Link href="/pricing?app=reviewradar&highlight=bronze" className="text-xs font-bold px-3 py-1 rounded-full bg-amber-600 text-black hover:bg-amber-500">
            Bronze ab €19/Mo →
          </Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
        {[
          {v:REVIEWS.length.toString(),l:'Gesamt',c:'#3B82F6',s:'+3 diese Woche'},
          {v:avgRating,l:'Ø Rating',c:'#FFD700',s:'↑ +0.2'},
          {v:answeredCount.toString(),l:'Beantwortet',c:'#10B981',s:`${Math.round(answeredCount/REVIEWS.length*100)}%`},
          {v:openCount.toString(),l:'Offen',c:openCount>0?'#EF4444':'#10B981',s:openCount>0?'⚠ Antworten ausstehend':'✓ Alles erledigt'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* USAGE METERS */}
      {tools && (
        <div className="px-5 mb-4 grid grid-cols-3 gap-3">
          <UsageBadge used={aiUsed} max={aiLimit} label="KI-Antworten" color="#00D4FF"/>
          <UsageBadge used={3} max={plan.limits.workflows} label="Workflows aktiv" color="#8B5CF6"/>
          <UsageBadge used={plan.limits.platforms<=3?2:plan.limits.platforms} max={plan.limits.platforms} label="Plattformen" color="#10B981"/>
        </div>
      )}

      {/* TOOLS GRID */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Tools & Workflows</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">

            {/* KI-Antwort — Bronze */}
            <LockGate required="bronze" current={currentPlan} label="KI-Antwort">
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-center hover:scale-105 transition-all w-full">
                <span className="text-xl">🤖</span>
                <span className="text-xs font-bold text-blue-400">KI-Antwort</span>
                <span className="text-xs text-gray-500">{formatLimit(aiLimit)}/Mo verfügbar</span>
              </button>
            </LockGate>

            {/* Bulk-Antwort — Silber */}
            <LockGate required="silber" current={currentPlan} label="Bulk-Antwort">
              <button onClick={bulkReply} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-center hover:scale-105 transition-all w-full">
                <span className="text-xl">📨</span>
                <span className="text-xs font-bold text-purple-400">Bulk-Antwort</span>
                <span className="text-xs text-gray-500">Alle auf einmal</span>
              </button>
            </LockGate>

            {/* Plattform-Sync — Bronze */}
            <LockGate required="bronze" current={currentPlan} label="Plattform-Sync">
              <button onClick={runSync} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-center hover:scale-105 transition-all w-full">
                <span className="text-xl">{syncing?'⟳':'🔄'}</span>
                <span className="text-xs font-bold text-yellow-400">Plattform-Sync</span>
                <span className="text-xs text-gray-500">{syncing?`${syncStep}/4…`:`${plan.limits.platforms} Plattf.`}</span>
              </button>
            </LockGate>

            {/* KI-Analyse — Silber */}
            <LockGate required="silber" current={currentPlan} label="KI-Analyse">
              <button onClick={()=>setShowAnalytics(p=>!p)} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-center hover:scale-105 transition-all w-full"
                style={{borderColor:showAnalytics?'#10B981':''}}>
                <span className="text-xl">📊</span>
                <span className="text-xs font-bold text-green-400">KI-Analyse</span>
                <span className="text-xs text-gray-500">Trends & Insights</span>
              </button>
            </LockGate>

            {/* Alert — Bronze */}
            <LockGate required="bronze" current={currentPlan} label="Alerts">
              <button onClick={()=>setShowAlert(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-orange-500/30 bg-orange-500/10 text-center hover:scale-105 transition-all w-full">
                <span className="text-xl">🔔</span>
                <span className="text-xs font-bold text-orange-400">Alert</span>
                <span className="text-xs text-gray-500">Bei ≤ 2★</span>
              </button>
            </LockGate>

            {/* Export — Bronze */}
            <LockGate required="bronze" current={currentPlan} label="Export">
              <button onClick={()=>alert(`Bericht wird generiert… (${formatLimit(plan.limits.exports)}/Mo verfügbar)`)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-500/30 bg-gray-500/10 text-center hover:scale-105 transition-all w-full">
                <span className="text-xl">📥</span>
                <span className="text-xs font-bold text-gray-400">Export</span>
                <span className="text-xs text-gray-500">{formatLimit(plan.limits.exports)}/Mo</span>
              </button>
            </LockGate>

          </div>
        </div>
      </div>

      {/* KI ANALYTICS PANEL — Silber+ */}
      {showAnalytics && analytics && (
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-5">
            <div className="text-xs font-mono text-green-400 uppercase tracking-widest mb-3">// KI Trend-Analyse</div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">Häufigste Themen</div>
                {[['Service',4],['Freundlichkeit',3],['Wartezeit',2],['Preis',2]].map(([t,n])=>(
                  <div key={t as string} className="flex items-center gap-2 mt-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500 flex-shrink-0" style={{width:`${(n as number)*20}%`}}/>
                    <span className="text-xs text-gray-400">{t} ({n}x)</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">Sentiment</div>
                {[['Positiv','50%','#10B981'],['Neutral','17%','#FFD700'],['Negativ','33%','#EF4444']].map(([l,v,c])=>(
                  <div key={l} className="flex items-center gap-2 mt-1.5">
                    <div className="h-2 rounded-full flex-shrink-0" style={{width:v,background:c,minWidth:8}}/>
                    <span className="text-xs text-gray-400">{l} {v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">KI-Empfehlung</div>
                <div className="text-xs text-green-300 mt-2 leading-relaxed">
                  💡 Wartezeiten reduzieren → Ø-Rating +0.4★.<br/>3 offene negative Reviews beantworten erhöht Vertrauen ~23%.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}
      {showAlert&&(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={()=>setShowAlert(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-4">🔔 Alert-Einstellungen</div>
            {([['push','Push-Notification'],['email','E-Mail bei ≤ 2★'],['slack','Slack-Integration'],['daily','Tages-Zusammenfassung']] as const).map(([k,l])=>(
              <div key={k} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300">{l}</span>
                <div onClick={()=>setAlertToggles(p=>({...p,[k]:!p[k]}))}
                  className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                  style={{background:alertToggles[k]?'#10B981':'#374151'}}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{left:alertToggles[k]?'1.25rem':'0.125rem'}}/>
                </div>
              </div>
            ))}
            <button onClick={()=>setShowAlert(false)} className="w-full mt-4 py-2 bg-blue-500 rounded-lg text-sm font-black">Speichern</button>
          </div>
        </div>
      )}

      {/* FILTER */}
      <div className="px-5 mb-3 flex gap-2 flex-wrap">
        {[['all','Alle'],['open',`Offen (${openCount})`],['negative','Negativ ≤2★'],['positive','Positiv ≥4★']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
            style={filter===v?{background:'#3B82F620',border:'1px solid #3B82F6',color:'#3B82F6'}:{background:'transparent',border:'1px solid #374151',color:'#6B7280'}}>
            {l}
          </button>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="px-5 pb-8 space-y-3">
        {filtered.map(r=>{
          const pm=PM[r.platform];
          const isPosted=posted.has(r.id)||r.answered;
          const hasReply=!!replies[r.id];
          return (
            <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
                  style={{background:pm.color+'18',borderColor:pm.color+'35'}}>{pm.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black text-sm">{r.name}</span>
                    <span className="text-base">{stars(r.stars)}</span>
                    <span className="text-xs text-gray-500">{r.time}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{background:pm.color+'18',color:pm.color}}>{pm.name}</span>
                    {isPosted
                      ?<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">✓ Beantwortet</span>
                      :<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">NEU</span>}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{r.text}</p>
                </div>
              </div>

              {!isPosted && tools && (
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={()=>genReply(r.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                    style={{background:'#00D4FF18',border:'1px solid #00D4FF45',color:'#00D4FF'}}>
                    {generating===r.id?'⟳ Generiere...':'🤖 KI-Antwort'}
                    {aiLimit>0&&<span className="ml-1 opacity-60">({aiLimit-aiUsed} übrig)</span>}
                  </button>
                  <button onClick={()=>setActiveReview(activeReview===r.id?null:r.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white">
                    ✏️ Manuell
                  </button>
                </div>
              )}

              {!isPosted && !tools && (
                <div className="px-4 pb-4">
                  <Link href="/pricing?app=reviewradar&highlight=bronze"
                    className="text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
                    style={{background:'#CD7F3220',border:'1px solid #CD7F3250',color:'#CD7F32'}}>
                    🔒 Bronze upgraden für KI-Antworten
                  </Link>
                </div>
              )}

              {hasReply&&(
                <div className="mx-4 mb-4 bg-blue-950/40 border border-blue-500/25 rounded-xl p-4">
                  <div className="text-xs font-mono text-blue-400 mb-2">// KI-Antwort Vorschlag</div>
                  <p className="text-sm text-gray-200 leading-relaxed mb-3">{replies[r.id]}</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={()=>postReply(r.id)} className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400">✓ Auf {pm.name} posten</button>
                    <button onClick={()=>genReply(r.id)} className="text-xs font-bold px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400">🔄 Neu</button>
                    <button onClick={()=>setReplies(p=>{const n={...p};delete n[r.id];return n;})} className="text-xs px-3 py-2 rounded-lg bg-gray-800 text-gray-600">✕</button>
                  </div>
                </div>
              )}

              {activeReview===r.id&&!hasReply&&(
                <div className="mx-4 mb-4">
                  <textarea rows={3} placeholder="Eigene Antwort eingeben..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500 mb-2"/>
                  <button onClick={()=>postReply(r.id)} className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400">✓ Posten</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
