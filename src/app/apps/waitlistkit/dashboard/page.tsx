'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PlanId, PLANS, hasFeature, formatLimit } from '@/lib/plans';

const SIGNUPS=[
  {id:1,email:'max@startup.de',  name:'Max Müller',  refs:12,source:'Twitter',     rank:1,joined:'vor 5 Min',reward:'Lifetime Deal'},
  {id:2,email:'lisa@creative.de',name:'Lisa Kreativ',refs:8, source:'Direct',       rank:2,joined:'vor 12 Min',reward:'3 Mo. gratis'},
  {id:3,email:'tom@agency.de',   name:'Tom Schmidt', refs:5, source:'Referral',     rank:3,joined:'vor 1h',    reward:'1 Mo. gratis'},
  {id:4,email:'anna@tech.de',    name:'Anna Tech',   refs:3, source:'Product Hunt', rank:4,joined:'vor 2h',    reward:'Early Access'},
  {id:5,email:'jan@design.de',   name:'Jan Design',  refs:1, source:'Direct',       rank:5,joined:'vor 3h',    reward:'Early Access'},
  {id:6,email:'sarah@media.de',  name:'Sarah Media', refs:0, source:'Referral',     rank:6,joined:'vor 4h',    reward:'—'},
];
const MILESTONES=[
  {refs:1,  reward:'Early Access',  icon:'🎯',color:'#6B7280'},
  {refs:3,  reward:'1 Mo. gratis',  icon:'🎁',color:'#3B82F6'},
  {refs:5,  reward:'3 Mo. gratis',  icon:'⭐',color:'#8B5CF6'},
  {refs:10, reward:'6 Mo. gratis',  icon:'🏆',color:'#FFD700'},
  {refs:25, reward:'Lifetime Deal!',icon:'💎',color:'#00D4FF'},
];

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
        <Link href={`/pricing?app=waitlistkit&highlight=${required}`}
          className="text-xs font-bold px-4 py-1.5 rounded-full" style={{background:req.color,color:'#000'}}>
          Upgraden →
        </Link>
      </div>
    </div>
  );
}

export default function WaitlistKitDashboard(){
  const [currentPlan,setCurrentPlan]=useState<PlanId>('bronze');
  const [signups,setSignups]=useState(SIGNUPS);
  const [total,setTotal]=useState(847);
  const [showInvite,setShowInvite]=useState(false);
  const [showLaunch,setShowLaunch]=useState(false);
  const [showConfig,setShowConfig]=useState(false);
  const [launching,setLaunching]=useState(false);
  const [launchStep,setLaunchStep]=useState(0);
  const [copiedId,setCopiedId]=useState<number|null>(null);
  const [inviteEmails,setInviteEmails]=useState('');

  const plan=PLANS[currentPlan];
  const tools=hasFeature(currentPlan,'dashboardTools');
  const canLaunch=hasFeature(currentPlan,'launchSequence');
  const maxSignups=plan.limits.waitlistSignups;
  const planOrder:PlanId[]=['gratis','bronze','silber','gold','platin','diamant'];

  function copyLink(id:number,email:string){
    navigator.clipboard?.writeText(`https://app.waitlistkit.de/ref/${id}-${email.split('@')[0]}`).catch(()=>{});
    setCopiedId(id); setTimeout(()=>setCopiedId(null),2000);
  }

  function addSignup(){
    setSignups(p=>[{id:p.length+1,email:`user${total+1}@test.de`,name:`User ${total+1}`,refs:0,source:'Direct',rank:total+1,joined:'gerade',reward:'—'},...p]);
    setTotal(p=>p+1);
  }

  const LAUNCH_STEPS=['Top 10% identifizieren','Einladungs-E-Mails generieren','Batch 1 (10%) versenden','Slack-Announcement','✓ Launch abgeschlossen'];
  function runLaunch(){
    setLaunching(true); setLaunchStep(0);
    let s=0;
    const t=setInterval(()=>{setLaunchStep(s);s++;if(s>LAUNCH_STEPS.length){clearInterval(t);setLaunching(false);setTimeout(()=>setShowLaunch(false),1500);}},800);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-purple-950/30 border-b border-purple-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-purple-400">🚀 WaitlistKit</span>
          <span className="text-xs bg-lime-400/10 border border-lime-400/30 text-lime-400 px-2 py-0.5 rounded-full font-mono">{total} Signups</span>
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
          <Link href="/pricing?app=waitlistkit" className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:plan.color,color:'#000'}}>
            {plan.emoji} {plan.name}
          </Link>
        </div>
      </div>

      {currentPlan==='gratis'&&(
        <div className="bg-amber-950/30 border-b border-amber-800/30 px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs text-amber-300">🔒 Gratis: max. 100 Signups, keine Tools. Bronze für volle Funktion.</span>
          <Link href="/pricing?highlight=bronze" className="text-xs font-bold px-3 py-1 rounded-full bg-amber-600 text-black">Bronze ab €19 →</Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5">
        {[
          {v:total.toString(),l:'Gesamt Signups',c:'#A78BFA',s:maxSignups===-1?'Unbegrenzt':`${total}/${maxSignups}`},
          {v:'+23',l:'Heute neu',c:'#10B981',s:'↑ Viral Loop aktiv'},
          {v:'68%',l:'Via Referral',c:'#8B5CF6',s:'Viral Rate'},
          {v:plan.limits.workflows===-1?'∞':plan.limits.workflows.toString(),l:'Workflows aktiv',c:'#00D4FF',s:`${currentPlan} Plan`},
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">

            <LockGate required="bronze" current={currentPlan} label="Signup hinzufügen">
              <button onClick={addSignup}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-center hover:scale-105 transition-all w-full h-full">
                <span className="text-2xl">➕</span>
                <span className="text-xs font-bold text-green-400">Signup</span>
                <span className="text-xs text-gray-500">Simulieren/Hinzufügen</span>
              </button>
            </LockGate>

            <LockGate required="gold" current={currentPlan} label="Launch Sequence">
              <button onClick={()=>setShowLaunch(true)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-center hover:scale-105 transition-all w-full h-full">
                <span className="text-2xl">🚀</span>
                <span className="text-xs font-bold text-purple-400">Launch Sequence</span>
                <span className="text-xs text-gray-500">Gestaffelt einladen</span>
              </button>
            </LockGate>

            <LockGate required="bronze" current={currentPlan} label="Massen-Einladung">
              <button onClick={()=>setShowInvite(true)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-center hover:scale-105 transition-all w-full h-full">
                <span className="text-2xl">✉️</span>
                <span className="text-xs font-bold text-cyan-400">Einladungen</span>
                <span className="text-xs text-gray-500">E-Mails versenden</span>
              </button>
            </LockGate>

            <LockGate required="silber" current={currentPlan} label="Milestone Config">
              <button onClick={()=>setShowConfig(p=>!p)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-center hover:scale-105 transition-all w-full h-full"
                style={{borderColor:showConfig?'#FFD700':''}}>
                <span className="text-2xl">⚙️</span>
                <span className="text-xs font-bold text-yellow-400">Milestones</span>
                <span className="text-xs text-gray-500">Rewards konfigurieren</span>
              </button>
            </LockGate>

            <LockGate required="bronze" current={currentPlan} label="Embed Widget">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-orange-500/30 bg-orange-500/10 text-center w-full h-full">
                <span className="text-2xl">📊</span>
                <span className="text-xs font-bold text-orange-400">Embed-Widget</span>
                <span className="text-xs text-gray-500">Auf Website einbinden</span>
              </div>
            </LockGate>

          </div>
        </div>
      </div>

      {/* EMBED CODE */}
      {tools && (
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Embed-Code · Website Widget</span>
              <button onClick={()=>navigator.clipboard?.writeText('<waitlist-widget project="wk_dein-key" lang="de" referral="true"/>')}
                className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white">Kopieren</button>
            </div>
            <div className="p-4 font-mono text-xs leading-relaxed bg-gray-900/50">
              <span className="text-gray-600">&lt;script </span><span className="text-blue-400">src</span>=<span className="text-green-400">&quot;https://waitlistkit.de/embed.js&quot;</span><span className="text-gray-600">&gt;&lt;/script&gt;</span><br/>
              <span className="text-gray-600">&lt;waitlist-widget</span><br/>
              <span className="text-gray-600">&nbsp;&nbsp;</span><span className="text-blue-400">project</span>=<span className="text-green-400">&quot;wk_dein-key&quot;</span><br/>
              <span className="text-gray-600">&nbsp;&nbsp;</span><span className="text-blue-400">referral</span>=<span className="text-green-400">&quot;true&quot;</span><br/>
              <span className="text-gray-600">&nbsp;&nbsp;</span><span className="text-blue-400">lang</span>=<span className="text-green-400">&quot;de&quot;</span><br/>
              <span className="text-gray-600">/&gt;</span>
            </div>
          </div>
        </div>
      )}

      {/* MILESTONE CONFIG */}
      {showConfig && (
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-5">
            <div className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-4">// Milestone Rewards</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {MILESTONES.map(m=>(
                <div key={m.refs} className="bg-gray-800 rounded-lg p-3 text-center border" style={{borderColor:m.color+'30'}}>
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="font-black" style={{color:m.color}}>{m.refs} Refs</div>
                  <div className="text-xs text-gray-400 mt-1">{m.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Top Referrer · Live Leaderboard</span>
          </div>
          <div className="divide-y divide-gray-800">
            {signups.map(u=>{
              const re=u.rank===1?'🥇':u.rank===2?'🥈':u.rank===3?'🥉':`#${u.rank}`;
              const ms=MILESTONES.filter(m=>u.refs>=m.refs).at(-1);
              return (
                <div key={u.id} className="px-5 py-3 flex items-center gap-3 flex-wrap">
                  <div className="w-8 text-center font-bold text-sm text-gray-400 flex-shrink-0">{re}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{u.name}</div>
                    <div className="text-xs font-mono text-gray-500">{u.email} · {u.source}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'#8B5CF618',color:'#8B5CF6'}}>+{u.refs} Refs</span>
                  {ms&&<span className="text-xs px-2 py-0.5 rounded-full" style={{background:ms.color+'18',color:ms.color}}>{ms.icon} {ms.reward}</span>}
                  {tools&&(
                    <button onClick={()=>copyLink(u.id,u.email)}
                      className="text-xs px-2.5 py-1 rounded-full font-mono transition-all"
                      style={copiedId===u.id?{background:'#10B98118',border:'1px solid #10B98140',color:'#10B981'}:{background:'#374151',color:'#6B7280',border:'1px solid transparent'}}>
                      {copiedId===u.id?'✓ Kopiert':'🔗 Link'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INVITE MODAL */}
      {showInvite&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowInvite(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-2">✉️ Massen-Einladung</div>
            <div className="text-xs text-gray-400 mb-4">E-Mails eingeben (eine pro Zeile)</div>
            <textarea rows={5} value={inviteEmails} onChange={e=>setInviteEmails(e.target.value)}
              placeholder="max@startup.de&#10;lisa@creative.de&#10;tom@agency.de"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-purple-500 font-mono mb-3"/>
            <div className="flex gap-3">
              <button onClick={()=>{alert(`${inviteEmails.split('\n').filter(Boolean).length} Einladungen versendet!`);setShowInvite(false);}}
                className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-black text-sm hover:bg-purple-400">📣 Einladungen senden</button>
              <button onClick={()=>setShowInvite(false)} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm">✕</button>
            </div>
          </div>
        </div>
      )}

      {/* LAUNCH MODAL */}
      {showLaunch&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>!launching&&setShowLaunch(false)}>
          <div className="bg-gray-900 border border-purple-500/40 rounded-2xl p-6 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-4">🚀 Launch Sequence</div>
            {!launching?(
              <>
                <div className="space-y-2 mb-4">
                  {[`Batch 1: Top 10% (${Math.round(total*0.1)} User)`,`Batch 2: 24h später — nächste 10%`,`Batch 3: 48h später — alle weiteren`].map((s,i)=>(
                    <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg p-3 text-sm">
                      <span className="text-purple-400 font-bold">{i+1}.</span><span className="text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={runLaunch} className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-black text-sm">🚀 Launch starten</button>
                  <button onClick={()=>setShowLaunch(false)} className="px-4 rounded-xl bg-gray-800 text-gray-400 text-sm">✕</button>
                </div>
              </>
            ):(
              <div className="space-y-2">
                {LAUNCH_STEPS.slice(0,launchStep+1).map((s,i)=>(
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span><span className="text-gray-300">{s}</span>
                  </div>
                ))}
                {launching&&launchStep<LAUNCH_STEPS.length&&<div className="flex items-center gap-2 text-sm animate-pulse"><span className="text-cyan-400">⟳</span><span className="text-gray-400">{LAUNCH_STEPS[launchStep]}</span></div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
