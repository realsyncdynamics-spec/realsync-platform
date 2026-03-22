'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const METRICS = [
  {v:'4.923',  l:'Registrierte User',  c:'#00D4FF', trend:'+47 heute'},
  {v:'€12.847',l:'MRR',                c:'#10B981', trend:'+€890 diese Woche'},
  {v:'68',     l:'Bronze+ Abos',        c:'#CD7F32', trend:'+8 heute'},
  {v:'€2.341', l:'Referral Revenue',   c:'#C9A84C', trend:'via Coins'},
  {v:'98.7%',  l:'Uptime',             c:'#10B981', trend:'Alle Systeme OK'},
  {v:'1.247',  l:'Verifikationen/Tag', c:'#8B5CF6', trend:'CreatorSeal'},
];
const RECENT_USERS = [
  {name:'max_creator',    plan:'gold',    joined:'vor 2 Min', coins:950,  ref:'rs-dominik'},
  {name:'lisa_startup',   plan:'silber',  joined:'vor 8 Min', coins:0,    ref:null},
  {name:'tom_influencer', plan:'bronze',  joined:'vor 15 Min',coins:475,  ref:'rs-dominik'},
  {name:'anna_media',     plan:'gratis',  joined:'vor 22 Min',coins:0,    ref:null},
  {name:'jan_designer',   plan:'gold',    joined:'vor 31 Min',coins:2450, ref:'rs-sarah'},
];
const PLAN_COLORS: Record<string,string> = {gold:'#FFD700',silber:'#C0C0C0',bronze:'#CD7F32',gratis:'#6B7280',platin:'#00D4FF',diamant:'#93C5FD'};
const APP_STATUS = [
  {name:'CreatorSeal',   status:'operational', latency:'45ms',  uptime:'99.9%'},
  {name:'ReviewRadar',   status:'operational', latency:'78ms',  uptime:'99.8%'},
  {name:'ChurnRescue',   status:'operational', latency:'56ms',  uptime:'100%'},
  {name:'WaitlistKit',   status:'operational', latency:'34ms',  uptime:'99.9%'},
  {name:'Supabase DB',   status:'operational', latency:'12ms',  uptime:'100%'},
  {name:'Stripe',        status:'operational', latency:'89ms',  uptime:'99.9%'},
  {name:'OAuth Google',  status:'operational', latency:'234ms', uptime:'100%'},
];

export default function AdminDashboard() {
  const [liveUsers, setLiveUsers] = useState(23);
  useEffect(()=>{
    const t = setInterval(()=>setLiveUsers(u=>u+Math.floor(Math.random()*3-1)),4000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-cyan-400">⚡ Admin Dashboard</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border flex items-center gap-1.5 bg-green-500/10 text-green-400 border-green-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
            {liveUsers} User online
          </span>
        </div>
        <div className="flex gap-2 text-xs font-mono text-gray-500">
          <span>22. März 2026</span>
          <span className="text-gray-700">·</span>
          <span className="text-green-400">Alle Systeme OK</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-5">
        {METRICS.map(m=>(
          <div key={m.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:m.c}}>{m.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide leading-tight">{m.l}</div>
            <div className="text-xs mt-1.5 font-semibold" style={{color:m.c}}>{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-8 grid md:grid-cols-2 gap-4">
        {/* Recent Signups */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// Neue Registrierungen</span>
            <Link href="/admin/users" className="text-xs text-cyan-400 font-mono hover:underline">Alle →</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {RECENT_USERS.map((u,i)=>(
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold" style={{color:PLAN_COLORS[u.plan]}}>
                  {u.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium font-mono">@{u.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{u.joined}{u.ref&&<span className="text-cyan-500"> · via @{u.ref}</span>}</div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full font-mono capitalize" style={{color:PLAN_COLORS[u.plan],background:PLAN_COLORS[u.plan]+'18'}}>{u.plan}</span>
                {u.coins>0&&<span className="text-xs text-amber-400 font-mono">🪙 +{u.coins}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">// System Status</span>
            <span className="text-xs text-green-400 font-mono flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400"/>Alle OK</span>
          </div>
          <div className="divide-y divide-gray-800">
            {APP_STATUS.map(s=>(
              <div key={s.name} className="px-5 py-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"/>
                <span className="text-sm font-medium flex-1">{s.name}</span>
                <span className="text-xs font-mono text-gray-500">{s.latency}</span>
                <span className="text-xs font-mono text-green-400">{s.uptime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// Revenue Breakdown</div>
          {[
            {plan:'Gold',   users:18, mrr:1782, color:'#FFD700'},
            {plan:'Silber', users:22, mrr:1078, color:'#C0C0C0'},
            {plan:'Bronze', users:28, mrr:532,  color:'#CD7F32'},
            {plan:'Platin', users:4,  mrr:796,  color:'#00D4FF'},
          ].map(r=>(
            <div key={r.plan} className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono w-14" style={{color:r.color}}>{r.plan}</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${r.mrr/1782*100}%`,background:r.color}}/>
              </div>
              <span className="text-xs font-mono text-gray-400 w-16 text-right">€{r.mrr}/Mo</span>
              <span className="text-xs font-mono text-gray-600 w-12 text-right">{r.users} User</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">// Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {icon:'👥',label:'Alle User',       href:'/admin/users'},
              {icon:'💰',label:'Revenue',         href:'/admin/revenue'},
              {icon:'🤖',label:'KI-Kosten',       href:'/admin/ai-costs'},
              {icon:'📊',label:'App Nutzung',     href:'/admin/usage'},
              {icon:'🏥',label:'System Health',   href:'/admin/health'},
              {icon:'⚡',label:'Workflows Hub',   href:'/workflows'},
            ].map(a=>(
              <Link key={a.label} href={a.href}
                className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-all text-sm font-medium">
                <span>{a.icon}</span><span className="text-gray-300">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
