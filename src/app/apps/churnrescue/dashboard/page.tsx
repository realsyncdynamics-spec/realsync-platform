'use client';
import { useState } from 'react';
import Link from 'next/link';

const PAYMENTS = [
  {id:1, company:'StartupHub GmbH',    months:14, amount:99,  code:'insufficient_funds', time:'vor 2h',  status:'retry',    retryIn:'46h',  saved:false, email:'startup@hub.de'},
  {id:2, company:'CreatorTools AG',    months:3,  amount:49,  code:'card_declined',       time:'vor 5h',  status:'retrying', retryIn:'1h',   saved:false, email:'info@creatortools.ag'},
  {id:3, company:'DigitalFlow UG',     months:8,  amount:149, code:'expired_card',        time:'gestern', status:'email',    retryIn:null,   saved:false, email:'flow@digital.de'},
  {id:4, company:'MediaStar GbR',      months:22, amount:29,  code:'insufficient_funds', time:'vor 3T',  status:'saved',    retryIn:null,   saved:true,  email:'media@star.de'},
  {id:5, company:'TechVision KG',      months:6,  amount:299, code:'do_not_honor',        time:'vor 4T',  status:'saved',    retryIn:null,   saved:true,  email:'tech@vision.de'},
];

const STATUS_META: Record<string,{label:string;color:string;bg:string}> = {
  retry:    {label:'Retry geplant', color:'#3B82F6', bg:'#3B82F620'},
  retrying: {label:'Wird versucht', color:'#FFD700', bg:'#FFD70020'},
  email:    {label:'Mail gesendet', color:'#8B5CF6', bg:'#8B5CF620'},
  saved:    {label:'✓ Gerettet',    color:'#10B981', bg:'#10B98120'},
  failed:   {label:'Fehlgeschl.',   color:'#EF4444', bg:'#EF444420'},
};

const WINBACK_TEMPLATES = [
  'Betreff: Wir vermissen Sie — Exklusiv-Angebot für Sie 🎁\n\nHallo {{Name}},\n\nwir haben festgestellt, dass Ihre Zahlung leider nicht geklappt hat. Damit Sie keinen Zugang verlieren, haben wir Ihre Karte als ungültig markiert.\n\n→ Jetzt Zahlungsmethode aktualisieren und 20% Rabatt auf nächsten Monat sichern!\n\nMit freundlichen Grüßen\nIhr RealSync Team',
  'Betreff: Ihr Konto läuft in 24h ab ⚠️\n\nHallo {{Name}},\n\nleider konnten wir Ihre letzte Zahlung nicht verarbeiten. Ihr Premium-Zugang wird in 24 Stunden eingeschränkt.\n\n→ Jetzt aktualisieren: 1 Monat gratis als Dankeschön!\n\nHerzliche Grüße\nRealSync Dynamics',
];

export default function ChurnRescueDashboard() {
  const [payments, setPayments] = useState(PAYMENTS);
  const [retrying, setRetrying] = useState<Set<number>>(new Set());
  const [showEmail, setShowEmail] = useState<number|null>(null);
  const [emailText, setEmailText] = useState('');
  const [emailSent, setEmailSent] = useState<Set<number>>(new Set());
  const [showPredict, setShowPredict] = useState(false);

  const saved = payments.filter(p=>p.saved).reduce((s,p)=>s+p.amount,0);
  const atRisk = payments.filter(p=>!p.saved).reduce((s,p)=>s+p.amount,0);
  const recoveryRate = Math.round(payments.filter(p=>p.saved).length/payments.length*100);

  function retryPayment(id:number){
    setRetrying(prev=>new Set(prev).add(id));
    setTimeout(()=>{
      const rand=Math.random()>0.4;
      setPayments(prev=>prev.map(p=>p.id===id?{...p,status:rand?'saved':'email',saved:rand}:p));
      setRetrying(prev=>{const n=new Set(prev);n.delete(id);return n;});
    },2200);
  }

  function openEmail(id:number){
    const p=payments.find(x=>x.id===id)!;
    const tmpl=WINBACK_TEMPLATES[Math.floor(Math.random()*WINBACK_TEMPLATES.length)];
    setEmailText(tmpl.replace('{{Name}}',p.company));
    setShowEmail(id);
  }

  function sendEmail(id:number){
    setEmailSent(prev=>new Set(prev).add(id));
    setPayments(prev=>prev.map(p=>p.id===id?{...p,status:'email'}:p));
    setShowEmail(null);
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
        <div className="flex gap-2">
          <Link href="/workflows" className="text-xs font-bold px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full">⚡ Workflows</Link>
          <a href="/pricing?app=churnrescue" className="text-xs font-bold px-3 py-1.5 bg-red-500 text-white rounded-full">💎 Upgrade</a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:`€${saved}`,l:'Diese Woche gerettet',c:'#10B981',s:'via Smart Retry'},
          {v:`€${atRisk}`,l:'Aktuell gefährdet',c:'#EF4444',s:'Sofort handeln'},
          {v:payments.filter(p=>!p.saved).length.toString(),l:'Failed Payments',c:'#9CA3AF',s:'Offen'},
          {v:`${recoveryRate}%`,l:'Recovery-Rate',c:'#3B82F6',s:'Ø Erfolgsrate'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{s.l}</div>
            <div className="text-xs mt-1" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Tools & Workflows</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              {icon:'🤖',name:'KI Win-Back',      desc:'E-Mail KI generiert',     color:'#00D4FF', action:()=>{ const open=payments.find(p=>!p.saved); if(open) openEmail(open.id);}},
              {icon:'🔄',name:'Bulk Retry',        desc:'Alle failed retrien',      color:'#8B5CF6', action:()=>{ payments.filter(p=>!p.saved&&p.status!=='email').forEach((p,i)=>setTimeout(()=>retryPayment(p.id),i*1200));}},
              {icon:'📈',name:'Churn Prediction',  desc:'KI-Risikoanalyse',        color:'#FFD700', action:()=>setShowPredict(p=>!p)},
              {icon:'📊',name:'Jahres-Projektion', desc:'ROI ohne/mit ChurnRescue',color:'#10B981', action:()=>{}},
            ].map(t=>(
              <button key={t.name} onClick={t.action}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all hover:scale-105"
                style={{borderColor:t.color+'40',background:t.color+'10'}}>
                <span className="text-2xl">{t.icon}</span>
                <span className="text-xs font-bold" style={{color:t.color}}>{t.name}</span>
                <span className="text-xs text-gray-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Churn Prediction Panel */}
      {showPredict&&(
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-5">
            <div className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-3">// KI Churn Prediction — Nächste 30 Tage</div>
            <div className="space-y-2">
              {[
                {name:'BrandForce GmbH', risk:87, months:2, reason:'Wenig Login-Aktivität'},
                {name:'DevTeam Pro',     risk:64, months:7, reason:'Downgrade-Anfrage offen'},
                {name:'Startup42 UG',   risk:41, months:4, reason:'Support-Tickets gestiegen'},
                {name:'MarketGenius',   risk:23, months:11,reason:'Engagement normal'},
              ].map(p=>(
                <div key={p.name} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="text-sm font-bold">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.months} Mo. Kunde · {p.reason}</div>
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{color:p.risk>70?'#EF4444':p.risk>40?'#FFD700':'#10B981'}}>Risiko: {p.risk}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${p.risk}%`,background:p.risk>70?'#EF4444':p.risk>40?'#FFD700':'#10B981'}}></div>
                    </div>
                  </div>
                  <button onClick={()=>openEmail(0)} className="text-xs px-3 py-1.5 rounded-full" style={{background:'#00D4FF20',border:'1px solid #00D4FF40',color:'#00D4FF'}}>
                    KI-Mail
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Failed Payments */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Failed Payments · Smart Retry Engine aktiv</span>
            <span className="text-xs font-mono text-green-400">⟳ Läuft</span>
          </div>
          <div className="divide-y divide-gray-800">
            {payments.map(p=>{
              const sm=STATUS_META[p.status]||STATUS_META.retry;
              const isRetrying=retrying.has(p.id);
              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{p.company}</span>
                      <span className="text-gray-500 text-xs">{p.months} Mo. Kunde</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500">{p.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">€{p.amount}<span className="text-gray-500 text-xs">/Mo</span></div>
                    <div className="text-xs text-gray-600">{p.time}</div>
                  </div>
                  <div className="text-right w-32">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{color:sm.color,background:sm.bg}}>
                      {isRetrying?'⟳ Wird retried...':sm.label}
                    </span>
                    {p.retryIn&&<div className="text-xs text-gray-600 mt-1">in {p.retryIn}</div>}
                  </div>
                  {!p.saved&&(
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={()=>retryPayment(p.id)} disabled={isRetrying}
                        className="text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-40"
                        style={{background:'#3B82F620',border:'1px solid #3B82F650',color:'#3B82F6'}}>
                        {isRetrying?'⟳':'▶ Retry'}
                      </button>
                      <button onClick={()=>openEmail(p.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{background:'#00D4FF15',border:'1px solid #00D4FF40',color:'#00D4FF'}}>
                        📧 KI-Mail
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Projection */}
        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">// Jahres-Projektion</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs text-gray-400">Ohne ChurnRescue (8% Verlust/Mo)</div>
              <div className="text-2xl font-black text-red-400">-€3.456/Jahr</div>
            </div>
            <div className="text-3xl text-gray-700">→</div>
            <div>
              <div className="text-xs text-gray-400">Mit ChurnRescue ({recoveryRate}% Recovery)</div>
              <div className="text-2xl font-black text-green-400">+€2.488/Jahr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmail!==null&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowEmail(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🤖</span>
              <span className="font-black">KI Win-Back E-Mail</span>
              <span className="ml-auto text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-mono">KI generiert</span>
            </div>
            <textarea rows={10} value={emailText} onChange={e=>setEmailText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-cyan-500 font-mono mb-4"/>
            <div className="flex gap-3">
              <button onClick={()=>showEmail&&sendEmail(showEmail)}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-black font-black text-sm hover:bg-cyan-400">
                📧 Jetzt senden
              </button>
              <button onClick={()=>{
                setEmailText(WINBACK_TEMPLATES[Math.floor(Math.random()*WINBACK_TEMPLATES.length)]);
              }} className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 text-sm">
                🔄 Neu
              </button>
              <button onClick={()=>setShowEmail(null)} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-600 text-sm">✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
