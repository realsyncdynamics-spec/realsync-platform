'use client';
import { useState } from 'react';
import Link from 'next/link';

const INITIAL_SIGNUPS = [
  {id:1,email:'max@startup.de',     name:'Max Müller',   refs:12, source:'Twitter',      rank:1,  joined:'vor 5 Min', reward:'Lifetime Deal'},
  {id:2,email:'lisa@creative.de',   name:'Lisa Kreativ', refs:8,  source:'Direct',        rank:2,  joined:'vor 12 Min',reward:'3 Monate gratis'},
  {id:3,email:'tom@agency.de',      name:'Tom Schmidt',  refs:5,  source:'Referral',      rank:3,  joined:'vor 1h',    reward:'1 Monat gratis'},
  {id:4,email:'anna@tech.de',       name:'Anna Tech',    refs:3,  source:'Product Hunt', rank:4,  joined:'vor 2h',    reward:'Early Access'},
  {id:5,email:'jan@design.de',      name:'Jan Design',   refs:1,  source:'Direct',        rank:5,  joined:'vor 3h',    reward:'Early Access'},
  {id:6,email:'sarah@media.de',     name:'Sarah Media',  refs:0,  source:'Referral',      rank:6,  joined:'vor 4h',    reward:'—'},
];

const MILESTONES = [
  {refs:1,  reward:'Early Access',     icon:'🎯', color:'#6B7280'},
  {refs:3,  reward:'1 Monat gratis',   icon:'🎁', color:'#3B82F6'},
  {refs:5,  reward:'3 Monate gratis',  icon:'⭐', color:'#8B5CF6'},
  {refs:10, reward:'6 Monate gratis',  icon:'🏆', color:'#FFD700'},
  {refs:25, reward:'Lifetime Deal!',   icon:'💎', color:'#00D4FF'},
];

export default function WaitlistKitDashboard() {
  const [signups, setSignups] = useState(INITIAL_SIGNUPS);
  const [total, setTotal] = useState(847);
  const [todayNew] = useState(23);
  const [selectedUser, setSelectedUser] = useState<number|null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [launchDate, setLaunchDate] = useState('2026-04-01');
  const [inviteTop, setInviteTop] = useState(10);
  const [showLaunch, setShowLaunch] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [launchStep, setLaunchStep] = useState(0);
  const [copiedLink, setCopiedLink] = useState<number|null>(null);

  function addSignup(){
    const newEntry = {
      id: signups.length+1,
      email:`user${total+1}@example.de`,
      name:`Neuer User ${total+1}`,
      refs:0, source:'Direct', rank:total+1,
      joined:'gerade eben', reward:'—',
    };
    setSignups(p=>[newEntry,...p]);
    setTotal(p=>p+1);
  }

  function copyRefLink(id:number, email:string){
    navigator.clipboard?.writeText(`https://app.waitlistkit.de/ref/${id}-${email.split('@')[0]}`).catch(()=>{});
    setCopiedLink(id);
    setTimeout(()=>setCopiedLink(null),2000);
  }

  function sendInvites(){
    setLaunching(true); setLaunchStep(0);
    let s=0;
    const t=setInterval(()=>{ s++; setLaunchStep(s); if(s>=5){clearInterval(t);setLaunching(false);setInviteSent(true);setShowInvite(false);}},700);
  }

  function runLaunch(){
    setLaunching(true); setLaunchStep(0);
    const steps=['Top 10% identifizieren','Einladungs-E-Mails generieren','Batch 1 (10%) senden','Slack-Announcement posten','Launch abgeschlossen ✓'];
    let s=0;
    const t=setInterval(()=>{
      setLaunchStep(s);
      s++;
      if(s>steps.length){clearInterval(t);setLaunching(false);setShowLaunch(false);}
    },800);
  }

  const LAUNCH_STEPS=['Top 10% identifizieren','Einladungs-E-Mails generieren','Batch 1 (10%) senden','Slack-Announcement','✓ Launch abgeschlossen'];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-purple-950/30 border-b border-purple-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-purple-400">🚀 WaitlistKit</span>
          <span className="text-xs bg-lime-400/10 border border-lime-400/30 text-lime-400 px-2 py-0.5 rounded-full font-mono">{total} Signups</span>
          <span className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full font-mono">+{todayNew} heute</span>
        </div>
        <div className="flex gap-2">
          <Link href="/workflows" className="text-xs font-bold px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full">⚡ Workflows</Link>
          <a href="/pricing?app=waitlistkit" className="text-xs font-bold px-3 py-1.5 bg-purple-500 text-white rounded-full">💎 Upgrade</a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:total.toString(),   l:'Gesamt Signups', c:'#A78BFA',s:`+${todayNew} heute`},
          {v:`${Math.round(signups.reduce((s,u)=>s+u.refs,0)/signups.length*100)/100}`,l:'Ø Referrals/User',c:'#00D4FF',s:'Via Viral Loop'},
          {v:'68%',              l:'Via Referral',   c:'#8B5CF6',s:'Viral Rate'},
          {v:`${inviteTop}%`,    l:'Launch-Batch',   c:'#10B981', s:'Top-Referrer zuerst'},
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              {icon:'➕',name:'Signup simulieren',  desc:'Test-Entry hinzufügen',   color:'#10B981', action:addSignup},
              {icon:'📣',name:'Launch Sequence',    desc:'Gestaffelt einladen',     color:'#8B5CF6', action:()=>setShowLaunch(true)},
              {icon:'✉️',name:'Massen-Einladung',   desc:'E-Mails versenden',       color:'#00D4FF', action:()=>setShowInvite(true)},
              {icon:'⚙️',name:'Einstellungen',      desc:'Milestones konfigurieren',color:'#FFD700', action:()=>setShowConfig(p=>!p)},
              {icon:'📊',name:'Embed-Code',         desc:'Widget für deine Website',color:'#F97316', action:()=>{}},
            ].map(t=>(
              <button key={t.name} onClick={t.action}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all hover:scale-105"
                style={{borderColor:t.color+'40',background:t.color+'10'}}>
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs font-bold" style={{color:t.color}}>{t.name}</span>
                <span className="text-xs text-gray-500 leading-tight">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Config Panel */}
      {showConfig&&(
        <div className="px-5 mb-4">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-5">
            <div className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-4">// Milestone Rewards konfigurieren</div>
            <div className="grid md:grid-cols-5 gap-3 mb-4">
              {MILESTONES.map(m=>(
                <div key={m.refs} className="bg-gray-800 rounded-lg p-3 text-center border" style={{borderColor:m.color+'30'}}>
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-lg font-black" style={{color:m.color}}>{m.refs} Refs</div>
                  <div className="text-xs text-gray-400 mt-1">{m.reward}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Launch-Datum</label>
                <input type="date" value={launchDate} onChange={e=>setLaunchDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Erster Batch (Top %)</label>
                <input type="number" value={inviteTop} onChange={e=>setInviteTop(parseInt(e.target.value)||10)} min={5} max={100}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Panel */}
      <div className="px-5 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Widget Embed-Code</span>
            <button className="text-xs px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white">Kopieren</button>
          </div>
          <div className="p-5 font-mono text-xs text-gray-400 leading-relaxed bg-gray-900/50">
            <span className="text-gray-600">&lt;script </span>
            <span className="text-blue-400">src</span>=<span className="text-green-400">&quot;https://waitlistkit.de/embed.js&quot;</span>
            <span className="text-gray-600">&gt;&lt;/script&gt;</span><br/>
            <span className="text-gray-600">&lt;waitlist-widget<br/>
            &nbsp;&nbsp;</span><span className="text-blue-400">project</span>=<span className="text-green-400">&quot;wk_dein-key&quot;</span><br/>
            <span className="text-gray-600">&nbsp;&nbsp;</span><span className="text-blue-400">lang</span>=<span className="text-green-400">&quot;de&quot;</span><br/>
            <span className="text-gray-600">&nbsp;&nbsp;</span><span className="text-blue-400">referral</span>=<span className="text-green-400">&quot;true&quot;</span><br/>
            <span className="text-gray-600">&gt;&lt;/waitlist-widget&gt;</span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-5 pb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Top Referrer · Live Leaderboard</span>
          </div>
          <div className="divide-y divide-gray-800">
            {signups.map(u=>{
              const rankEmoji = u.rank===1?'🥇':u.rank===2?'🥈':u.rank===3?'🥉':`#${u.rank}`;
              const milestone = MILESTONES.filter(m=>u.refs>=m.refs).at(-1);
              return (
                <div key={u.id} className="px-5 py-3 flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-sm text-gray-400 flex-shrink-0">{rankEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{u.name}</div>
                    <div className="text-xs font-mono text-gray-500">{u.email}</div>
                  </div>
                  <div className="text-xs text-gray-500">{u.source}</div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'#8B5CF620',color:'#8B5CF6'}}>
                      +{u.refs} Refs
                    </span>
                  </div>
                  {milestone&&(
                    <div className="text-xs px-2 py-0.5 rounded-full" style={{background:milestone.color+'20',color:milestone.color}}>
                      {milestone.icon} {milestone.reward}
                    </div>
                  )}
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={()=>copyRefLink(u.id,u.email)}
                      className="text-xs px-2 py-1 rounded-full font-mono transition-all"
                      style={copiedLink===u.id?{background:'#10B98120',border:'1px solid #10B98140',color:'#10B981'}:{background:'#374151',color:'#6B7280'}}>
                      {copiedLink===u.id?'✓ Kopiert':'🔗 Link'}
                    </button>
                    <button onClick={()=>setSelectedUser(selectedUser===u.id?null:u.id)}
                      className="text-xs px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-500">
                      ···
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>setShowInvite(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-2">✉️ Massen-Einladung</div>
            <div className="text-xs text-gray-400 mb-4">E-Mails eingeben oder Top-Referrer automatisch auswählen</div>
            {!inviteSent&&!launching?(
              <>
                <textarea rows={5} value={inviteEmails} onChange={e=>setInviteEmails(e.target.value)}
                  placeholder="max@startup.de&#10;lisa@creative.de&#10;..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-purple-500 font-mono mb-3"/>
                <div className="flex gap-3">
                  <button onClick={sendInvites} className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-black text-sm hover:bg-purple-400">📣 Einladungen senden</button>
                  <button onClick={()=>setShowInvite(false)} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm">✕</button>
                </div>
              </>
            ):(
              <div className="space-y-2">
                {LAUNCH_STEPS.slice(0,launchStep+1).map((s,i)=>(
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span><span className="text-gray-300">{s}</span>
                  </div>
                ))}
                {launching&&<div className="flex items-center gap-2 text-sm animate-pulse"><span className="text-cyan-400">⟳</span><span className="text-gray-400">Wird verarbeitet...</span></div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Launch Modal */}
      {showLaunch&&(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={()=>!launching&&setShowLaunch(false)}>
          <div className="bg-gray-900 border border-purple-500/40 rounded-2xl p-6 max-w-md w-full" onClick={e=>e.stopPropagation()}>
            <div className="font-black text-lg mb-2">🚀 Launch Sequence</div>
            <div className="text-xs text-gray-400 mb-4">Gestaffelte Einladungen — Top-Referrer zuerst</div>
            {!launching?(
              <>
                <div className="space-y-2 mb-4">
                  {[`Batch 1: Top ${inviteTop}% (${Math.round(total*inviteTop/100)} User)`,`Batch 2: 24h später — nächste ${inviteTop}%`,`Batch 3: 48h später — alle weiteren`].map((s,i)=>(
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
                {launching&&<div className="flex items-center gap-2 text-sm animate-pulse"><span className="text-cyan-400">⟳</span><span className="text-gray-400">Läuft...</span></div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
