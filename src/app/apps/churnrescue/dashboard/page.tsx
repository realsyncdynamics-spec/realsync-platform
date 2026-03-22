'use client';
import { useState } from 'react';
import OptimusButton from '@/components/OptimusButton';
import Link from 'next/link';
import { PlanId, PLANS, hasFeature, formatLimit } from '@/lib/plans';

const PAYMENTS = [
  {id:1,company:'StartupHub GmbH',  months:14,amount:99, code:'insufficient_funds',time:'vor 2h', status:'retry',  saved:false},
  {id:2,company:'CreatorTools AG',  months:3, amount:49, code:'card_declined',      time:'vor 5h', status:'retry',  saved:false},
  {id:3,company:'DigitalFlow UG',   months:8, amount:149,code:'expired_card',       time:'gestern',status:'email',  saved:false},
  {id:4,company:'MediaStar GbR',    months:22,amount:29, code:'insufficient_funds', time:'vor 3T', status:'saved',  saved:true},
  {id:5,company:'TechVision KG',    months:6, amount:299,code:'do_not_honor',       time:'vor 4T', status:'saved',  saved:true},
];
const STATUS_META:Record<string,{label:string;color:string;bg:string}>={
  retry:   {label:'Retry geplant', color:'#3B82F6',bg:'#3B82F618'},
  retrying:{label:'Wird retried', color:'#FFD700', bg:'#FFD70018'},
  email:   {label:'Mail gesendet',color:'#8B5CF6',bg:'#8B5CF618'},
  saved:   {label:'✓ Gerettet',  color:'#10B981',bg:'#10B98118'},
};
const WINBACK_TMPL = `Betreff: Ihr Zugang läuft in 24h ab ⚠️\n\nHallo {{Name}},\n\nleider konnten wir Ihre letzte Zahlung nicht verarbeiten.\n\n→ Jetzt Zahlungsmethode aktualisieren und 1 Monat gratis erhalten!\n\nHerzliche Grüße\nRealSync Dynamics`;

function LockGate({required,current,children,label}:{required:PlanId;current:PlanId;children:React.ReactNode;label:string}){
  const order:PlanId[]=['gratis','bronze','silber','gold','platin','diamant'];
  if(order.indexOf(current)>=order.indexOf(required)) return <>{children}</>;
  const req=PLANS[required];
  return (
    <div className="relative">
      <div className="blur-[2px] pointer-events-none select-none opacity-35">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 rounded-xl backdrop-blur-[1px] border border-gray-700">
        <span className="text-2xl mb-2">🔒</span>
        <div className="font-black text-sm mb-1">{label}</div>
        <div className="text-xs text-gray-400 mb-3">Ab <span style={{color:req.color}} className="font-bold">{req.emoji} {req.name}</span></div>
        <Link href={`/pricing?app=churnrescue&highlight=${required}`}
          className="text-xs font-bold px-4 py-1.5 rounded-full" style={{background:req.color,color:'#000'}}>
          Upgraden →
        </Link>
      </div>
    </div>
  );
}

export default function ChurnRescueDashboard(){
  const [currentPlan,setCurrentPlan]=useState<PlanId>('bronze');
  const [payments,setPayments]=useState(PAYMENTS);
  const [retrying,setRetrying]=useState<Set<number>>(new Set());
  const [showEmail,setShowEmail]=useState<number|null>(null);
  const [emailText,setEmailText]=useState('');
  const [showPredict,setShowPredict]=useState(false);

  const plan=PLANS[currentPlan];
  const tools=hasFeature(currentPlan,'dashboardTools');
  const predict=hasFeature(currentPlan,'churnPrediction');
  const bulkRetry=hasFeature(currentPlan,'bulkActions');
  const retryLimit=plan.limits.churnRetries;
  const [retriesDone,setRetriesDone]=useState(3);

  const saved=payments.filter(p=>p.saved).reduce((s,p)=>s+p.amount,0);
  const atRisk=payments.filter(p=>!p.saved).reduce((s,p)=>s+p.amount,0);
  const recoveryRate=Math.round(payments.filter(p=>p.saved).length/payments.length*100);

  function retryPayment(id:number){
    if(retryLimit>0&&retriesDone>=retryLimit){alert(`Retry-Limit (${retryLimit}/Mo) erreicht. Upgrade für mehr.`);return;}
    setRetrying(p=>new Set(p).add(id));
    setRetriesDone(p=>p+1);
    setTimeout(()=>{
      const success=Math.random()>0.4;
      setPayments(p=>p.map(x=>x.id===id?{...x,status:success?'saved':'email',saved:success}:x));
      setRetrying(p=>{const n=new Set(p);n.delete(id);return n;});
    },2200);
  }

  function openEmail(id:number){
    const p=payments.find(x=>x.id===id);
    setEmailText(WINBACK_TMPL.replace('{{Name}}',p?.company||'Kunde'));
    setShowEmail(id);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-red-950/30 border-b border-red-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-red-400">💳 ChurnRescue</span>
          <span className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full font-mono">Live Monitoring</span>
        </div>
        <div className="flex items-center gap-3">
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
          <Link href="/pricing?app=churnrescue" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:plan.color,color:'#000'}}>
            {plan.emoji} {plan.name}
          </Link>
        </div>
      </div>

      {currentPlan==='gratis'&&(
        <div className="bg-amber-950/30 border-b border-amber-800/30 px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs text-amber-300">🔒 Gratis: Kein Zugriff auf Retry-Engine. Bronze für Smart Retry & Win-Back E-Mails.</span>
          <Link href="/pricing?highlight=bronze" className="text-xs font-bold px-3 py-1 rounded-full bg-amber-600 text-black">Bronze ab €19 →</Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
        {[
          {v:`€${saved}`,l:'Diese Woche gerettet',c:'#10B981',s:`${recoveryRate}% Recovery-Rate`},
          {v:`€${atRisk}`,l:'Aktuell gefährdet',c:'#EF4444',s:'Jetzt handeln'},
          {v:payments.filter(p=>!p.saved).length.toString(),l:'Failed Payments',c:'#9CA3AF',s:'Offen'},
          {v:retryLimit===-1?'∞':`${retriesDone}/${retryLimit}`,l:'Retries genutzt',c:'#3B82F6',s:retryLimit===-1?'Unbegrenzt':'Diesen Monat'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* TOOLS */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Tools & Workflows</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <LockGate required="bronze" current={currentPlan} label="KI Win-Back E-Mail">
              <button onClick={()=>{const p=payments.find(x=>!x.saved);if(p)openEmail(p.id);}}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-center hover:scale-105 transition-all w-full h-full">
                <span className="text-2xl">🤖</span>
                <span className="text-xs font-bold text-cyan-400">KI Win-Back Mail</span>
                <span className="text-xs text-gray-500">KI generiert Vorlage</span>
              </button>
            </LockGate>

            <LockGate required="bronze" current={currentPlan} label="Smart Retry">
              <button onClick={()=>payments.filter(p=>!p.saved)[0]&&retryPayment(payments.filter(p=>!p.saved)[0].id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-center hover:scale-105 transition-all w-full h-full">
                <span className="text-2xl">💳</span>
                <span className="text-xs font-bold text-blue-400">Smart Retry</span>
                <span className="text-xs text-gray-500">{formatLimit(retryLimit)}/Mo verfügbar</span>
              </button>
            </LockGate>

            <LockGate required="silber" current={currentPlan} label="Bulk Retry">
              <button onClick={()=>payments.filter(p=>!p.saved).forEach((p,i)=>setTimeout(()=>retryPayment(p.id),i*1200))}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-center hover:scale-105 transition-all w-full h-full">
                <span className="text-2xl">🔄</span>
                <span className="text-xs font-bold text-purple-400">Bulk Retry</span>
                <span className="text-xs text-gray-500">Alle auf einmal</span>
              </button>
            </LockGate>

            <LockGate required="gold" current={currentPlan} label="Churn Prediction KI">
              <button onClick={()=>setShowPredict(p=>!p)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-center hover:scale-105 transition-all w-full h-full"
                style={{borderColor:showPredict?'#FFD700':''}}>
                <span className="text-2xl">📈</span>
                <span className="text-xs font-bold text-yellow-400">Churn Prediction</span>
                <span className="text-xs text-gray-500">14 Tage vorher</span>
              </button>
            </LockGate>

          </div>
        </div>
      </div>

      {/* CHURN PREDICTION PANEL */}
      {showPredict && predict && (
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-5">
            <div className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-3">// KI Churn Prediction — Nächste 30 Tage</div>
            <div className="space-y-2">
              {[
                {name:'BrandForce GmbH',risk:87,months:2,reason:'Wenig Login-Aktivität'},
                {name:'DevTeam Pro',    risk:64,months:7,reason:'Downgrade-Anfrage offen'},
                {name:'Startup42 UG',  risk:41,months:4,reason:'Support-Tickets gestiegen'},
                {name:'MarketGenius',  risk:23,months:11,reason:'Engagement normal'},
              ].map(p=>(
                <div key={p.name} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="text-sm font-bold">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.months} Mo. · {p.reason}</div>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{color:p.risk>70?'#EF4444':p.risk>40?'#FFD700':'#10B981'}}>Risiko {p.risk}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${p.risk}%`,background:p.risk>70?'#EF4444':p.risk>40?'#FFD700':'#10B981'}}/>
                    </div>
                  </div>
                  <button onClick={()=>openEmail(0)} className="text-xs px-3 py-1.5 rounded-full" style={{background:'#00D4FF18',border:'1px solid #00D4FF40',color:'#00D4FF'}}>
                    KI-Mail
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENTS TABLE */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Failed Payments · Smart Retry Engine</span>
            <span className="text-xs font-mono text-green-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Aktiv</span>
          </div>
          <div className="divide-y divide-gray-800">
            {payments.map(p=>{
              const sm=STATUS_META[p.status]||STATUS_META.retry;
              const isRet=retrying.has(p.id);
              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm">{p.company}</span>
                      <span className="text-gray-500 text-xs">{p.months} Mo.</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500">{p.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€{p.amount}<span className="text-gray-500 text-xs">/Mo</span></div>
                    <div className="text-xs text-gray-600">{p.time}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{color:sm.color,background:sm.bg}}>
                    {isRet?'⟳ Läuft...':sm.label}
                  </span>
                  {!p.saved && tools && (
                    <div className="flex gap-2">
                      <button onClick={()=>retryPayment(p.id)} disabled={isRet}
                        className="text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-40"
                        style={{background:'#3B82F618',border:'1px solid #3B82F640',color:'#3B82F6'}}>
                        {isRet?'⟳':'▶ Retry'}
                      </button>
                      <button onClick={()=>openEmail(p.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{background:'#00D4FF10',border:'1px solid #00D4FF35',color:'#00D4FF'}}>
                        📧 KI-Mail
                      </button>
                    </div>
                  )}
                  {!p.saved && !tools && (
                    <Link href="/pricing?highlight=bronze"
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{background:'#CD7F3218',border:'1px solid #CD7F3245',color:'#CD7F32'}}>
                      🔒 Bronze
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PROJECTION */}
        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Jahres-Projektion</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div><div className="text-xs text-gray-400">Ohne ChurnRescue (8% Verlust/Mo)</div><div className="text-2xl font-black text-red-400">-€3.456/Jahr</div></div>
            <div className="text-3xl text-gray-700">→</div>
            <div><div className="text-xs text-gray-400">Mit ChurnRescue ({recoveryRate}% Recovery)</div><div className="text-2xl font-black text-green-400">+€2.488/Jahr</div></div>
          </div>
        </div>
      </div>

      {/* EMAIL MODAL */}
      {showEmail!==null&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowEmail(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🤖</span><span className="font-black">KI Win-Back E-Mail</span>
              <span className="ml-auto text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-mono">KI generiert</span>
            </div>
            <textarea rows={9} value={emailText} onChange={e=>setEmailText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-cyan-500 font-mono mb-4"/>
            <div className="flex gap-3">
              <button onClick={()=>setShowEmail(null)} className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-black font-black text-sm hover:bg-cyan-400">📧 Jetzt senden</button>
              <button onClick={()=>setEmailText(WINBACK_TMPL)} className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-sm">🔄 Neu</button>
              <button onClick={()=>setShowEmail(null)} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-600 text-sm">✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
