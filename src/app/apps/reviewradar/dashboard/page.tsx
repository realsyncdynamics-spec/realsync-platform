'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const REVIEWS = [
  { id:1, name:'Marcus K.',  stars:5, platform:'google',       text:'Absolut top Service! Schnell, freundlich und super kompetent. Sehr empfehlenswert!', time:'vor 2h',  answered:false, sentiment:'positive' },
  { id:2, name:'Sandra M.',  stars:3, platform:'trustpilot',   text:'Gute Leistung, Wartezeit etwas lang. Insgesamt zufrieden.',                          time:'vor 5h',  answered:false, sentiment:'neutral'  },
  { id:3, name:'Peter W.',   stars:1, platform:'google',        text:'Schlechter Service, nie wieder! Warte seit 2 Wochen auf Rückruf.',                   time:'vor 8h',  answered:false, sentiment:'negative' },
  { id:4, name:'Anna S.',    stars:5, platform:'provenexpert',  text:'Wunderbarer Betrieb, immer gerne wieder!',                                            time:'gestern', answered:true,  sentiment:'positive' },
  { id:5, name:'Tom B.',     stars:4, platform:'trustpilot',    text:'Sehr zufrieden, komme gerne wieder. Nur Parkplatz war schwierig.',                    time:'vor 2T',  answered:true,  sentiment:'positive' },
  { id:6, name:'Lisa R.',    stars:2, platform:'yelp',           text:'Leider enttäuscht. Service OK aber Preis-Leistung stimmt nicht.',                     time:'vor 3T',  answered:false, sentiment:'negative' },
];

const PM: Record<string,{icon:string;color:string;name:string}> = {
  google:       {icon:'🔵',color:'#4285F4',name:'Google'},
  trustpilot:   {icon:'🟢',color:'#00B67A',name:'Trustpilot'},
  provenexpert: {icon:'🟡',color:'#FFA500',name:'ProvenExpert'},
  yelp:         {icon:'🔴',color:'#FF1A1A',name:'Yelp'},
};

const AI_REPLIES: Record<number,string> = {
  1:'Herzlichen Dank, Marcus! Ihr positives Feedback freut uns wirklich sehr. Wir freuen uns auf Ihren nächsten Besuch! 🙏',
  2:'Vielen Dank für Ihr ehrliches Feedback, Sandra! Die Wartezeit tut uns leid — wir arbeiten bereits an Verbesserungen. Beim nächsten Besuch werden wir Sie begeistern! 💪',
  3:'Lieber Peter, das tut uns sehr leid! Bitte kontaktieren Sie uns direkt unter info@betrieb.de, damit wir das sofort lösen. Wir melden uns noch heute! 🙏',
  6:'Danke Lisa! Wir nehmen Ihr Feedback ernst und würden gern in einem Gespräch klären, wie wir es besser machen können.',
};

export default function ReviewRadarDashboard() {
  const [filter, setFilter] = useState('all');
  const [activeReview, setActiveReview] = useState<number|null>(null);
  const [replies, setReplies] = useState<Record<number,string>>({});
  const [generating, setGenerating] = useState<number|null>(null);
  const [posted, setPosted] = useState<Set<number>>(new Set());
  const [activeTool, setActiveTool] = useState<string|null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertToggles, setAlertToggles] = useState({push:true, email:true, slack:false, daily:true});

  const filtered = REVIEWS.filter(r => {
    if(filter==='open') return !r.answered && !posted.has(r.id);
    if(filter==='negative') return r.stars<=2;
    if(filter==='positive') return r.stars>=4;
    return true;
  });
  const openCount = REVIEWS.filter(r=>!r.answered&&!posted.has(r.id)).length;
  const answeredCount = REVIEWS.filter(r=>r.answered||posted.has(r.id)).length;
  const avgRating = (REVIEWS.reduce((s,r)=>s+r.stars,0)/REVIEWS.length).toFixed(1);

  function genReply(id:number){
    setGenerating(id);
    setTimeout(()=>{
      setReplies(p=>({...p,[id]:AI_REPLIES[id]||'Vielen Dank für Ihre Bewertung! Wir freuen uns über Ihr Feedback und werden es für kontinuierliche Verbesserungen nutzen.'}));
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
    const t=setInterval(()=>{ s++; setSyncStep(s); if(s>=4){clearInterval(t);setSyncing(false);}},800);
  }

  function bulkReply(){
    const open=REVIEWS.filter(r=>!r.answered&&!posted.has(r.id)&&AI_REPLIES[r.id]);
    open.forEach((r,i)=>setTimeout(()=>genReply(r.id),i*900));
    setActiveTool(null);
  }

  const stars=(n:number)=>Array.from({length:5},(_,i)=><span key={i} style={{color:i<n?'#FFD700':'#374151'}}>★</span>);

  const TOOLS=[
    {id:'ai-reply',    icon:'🤖', name:'KI-Auto-Antwort',  desc:'<3s generieren',       color:'#00D4FF', action:()=>{}},
    {id:'bulk-reply',  icon:'📨', name:'Bulk-Antwort',      desc:'Alle offenen auf einmal',color:'#8B5CF6', action:bulkReply},
    {id:'sync',        icon:'🔄', name:'Plattform-Sync',    desc:'Alle Plattformen jetzt', color:'#FFD700', action:runSync},
    {id:'analytics',   icon:'📊', name:'KI-Analyse',        desc:'Trend & Insights',       color:'#10B981', action:()=>setActiveTool(t=>t==='analytics'?null:'analytics')},
    {id:'alert',       icon:'🔔', name:'Alert',             desc:'Bei ≤ 2★ benachrichtigen',color:'#F97316', action:()=>setShowAlert(true)},
    {id:'export',      icon:'📥', name:'Export',            desc:'CSV/PDF Bericht',        color:'#6B7280', action:()=>alert('Bericht wird generiert...')},
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-blue-950/40 border-b border-blue-900/40 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-blue-400">⭐ ReviewRadar</span>
          <span className="text-xs font-mono text-gray-500">Mein Betrieb · München</span>
        </div>
        <div className="flex gap-2">
          <Link href="/workflows" className="text-xs font-bold px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full">⚡ Workflows</Link>
          <Link href="/pricing?app=reviewradar" className="text-xs font-bold px-3 py-1.5 bg-blue-500 text-white rounded-full">💎 Upgrade</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:REVIEWS.length.toString(),l:'Gesamt',c:'#3B82F6',s:'+3 diese Woche'},
          {v:avgRating,l:'Ø Rating',c:'#FFD700',s:'↑ +0.2'},
          {v:answeredCount.toString(),l:'Beantwortet',c:'#10B981',s:`${Math.round(answeredCount/REVIEWS.length*100)}%`},
          {v:openCount.toString(),l:'Offen',c:openCount>0?'#EF4444':'#10B981',s:openCount>0?'Jetzt antworten':'Alles erledigt ✓'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* TOOLS */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Tools & Workflows</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {TOOLS.map(t=>(
              <button key={t.id} onClick={t.action}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all hover:scale-105"
                style={{borderColor:activeTool===t.id?t.color:'#374151',background:activeTool===t.id?t.color+'15':'#111827'}}>
                <span className="text-xl">{t.id==='sync'&&syncing?'⟳':t.icon}</span>
                <span className="text-xs font-bold" style={{color:t.color}}>{t.name}</span>
                <span className="text-xs text-gray-500 leading-tight">
                  {t.id==='sync'&&syncing?`${syncStep}/4 Plattformen…`:t.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      {activeTool==='analytics'&&(
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-5">
            <div className="text-xs font-mono text-green-400 uppercase tracking-widest mb-3">// KI Trend-Analyse</div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">Häufigste Themen</div>
                {[['Service',4],['Freundlichkeit',3],['Wartezeit',2],['Preis',2]].map(([t,n])=>(
                  <div key={t as string} className="flex items-center gap-2 mt-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500 flex-shrink-0" style={{width:`${(n as number)*20}%`}}></div>
                    <span className="text-xs text-gray-400">{t} ({n}x)</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">Sentiment</div>
                {[['Positiv','50%','#10B981'],['Neutral','17%','#FFD700'],['Negativ','33%','#EF4444']].map(([l,v,c])=>(
                  <div key={l} className="flex items-center gap-2 mt-1.5">
                    <div className="h-2 rounded-full flex-shrink-0" style={{width:v,background:c,minWidth:8}}></div>
                    <span className="text-xs text-gray-400">{l} {v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">KI-Empfehlung</div>
                <div className="text-xs text-green-300 leading-relaxed mt-1">
                  💡 Wartezeiten reduzieren → Ø-Rating +0.4★. 3 offene negative Reviews sofort beantworten erhöht Vertrauen um ~23%.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlert&&(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={()=>setShowAlert(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-4">🔔 Alert-Einstellungen</div>
            <div className="space-y-3">
              {([['push','Push-Notification'],['email','E-Mail bei ≤ 2★'],['slack','Slack-Integration'],['daily','Tages-Zusammenfassung']] as [keyof typeof alertToggles,string][]).map(([k,l])=>(
                <div key={k} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{l}</span>
                  <div onClick={()=>setAlertToggles(p=>({...p,[k]:!p[k]}))}
                    className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                    style={{background:alertToggles[k]?'#10B981':'#374151'}}>
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all" style={{left:alertToggles[k]?'1.25rem':'0.125rem'}}></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowAlert(false)} className="w-full mt-4 py-2 bg-blue-500 rounded-lg text-sm font-bold hover:bg-blue-400">Speichern</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="px-5 mb-3 flex gap-2 flex-wrap">
        {[['all','Alle'],['open',`Offen (${openCount})`],['negative','Negativ'],['positive','Positiv']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
            style={filter===v?{background:'#3B82F620',border:'1px solid #3B82F6',color:'#3B82F6'}:{background:'transparent',border:'1px solid #374151',color:'#6B7280'}}>
            {l}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="px-5 pb-8 space-y-3">
        {filtered.map(r=>{
          const pm=PM[r.platform];
          const isPosted=posted.has(r.id)||r.answered;
          const hasReply=!!replies[r.id];
          return (
            <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{background:pm.color+'20',border:`1px solid ${pm.color}40`}}>{pm.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black text-sm">{r.name}</span>
                    <span className="text-sm">{stars(r.stars)}</span>
                    <span className="text-xs text-gray-500">{r.time}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{background:pm.color+'20',color:pm.color}}>{pm.name}</span>
                    {isPosted
                      ?<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">✓ Beantwortet</span>
                      :<span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">NEU</span>}
                  </div>
                  <p className="text-sm text-gray-300">{r.text}</p>
                </div>
              </div>
              {!isPosted&&(
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={()=>genReply(r.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                    style={{background:'#00D4FF20',border:'1px solid #00D4FF50',color:'#00D4FF'}}>
                    {generating===r.id?'⟳ Generiere...':'🤖 KI-Antwort'}
                  </button>
                  <button onClick={()=>setActiveReview(activeReview===r.id?null:r.id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                    ✏️ Manuell
                  </button>
                </div>
              )}
              {hasReply&&(
                <div className="mx-4 mb-4 bg-blue-950/40 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-xs font-mono text-blue-400 mb-2">// KI-Antwort Vorschlag</div>
                  <p className="text-sm text-gray-200 leading-relaxed mb-3">{replies[r.id]}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>postReply(r.id)} className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400">✓ Posten auf {pm.name}</button>
                    <button onClick={()=>genReply(r.id)} className="text-xs font-bold px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400">🔄 Neu</button>
                    <button onClick={()=>setReplies(p=>{const n={...p};delete n[r.id];return n;})} className="text-xs px-3 py-2 rounded-lg bg-gray-800 text-gray-600">✕</button>
                  </div>
                </div>
              )}
              {activeReview===r.id&&!hasReply&&(
                <div className="mx-4 mb-4">
                  <textarea rows={3} placeholder="Eigene Antwort..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500 mb-2"/>
                  <button onClick={()=>postReply(r.id)} className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-500 text-white">✓ Posten</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
