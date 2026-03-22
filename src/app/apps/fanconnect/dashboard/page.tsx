'use client';
import { useState } from 'react';
import Link from 'next/link';

const MEMBERS = [
  {id:1, name:'MaxCreatorFan', tier:'VIP',      joined:'vor 1h',  spent:'€89', badge:'🌟', messages:3},
  {id:2, name:'Lisa_1987',     tier:'Premium',  joined:'gestern', spent:'€49', badge:'💎', messages:1},
  {id:3, name:'TomGaming',     tier:'Standard', joined:'vor 3T',  spent:'€9',  badge:'🎯', messages:0},
  {id:4, name:'AnnaCreates',   tier:'VIP',      joined:'vor 5T',  spent:'€89', badge:'🌟', messages:5},
  {id:5, name:'Stefan_K',      tier:'Free',     joined:'vor 1W',  spent:'€0',  badge:'🆓', messages:0},
];
const TIER_COLORS: Record<string,string> = {VIP:'#FFD700',Premium:'#00D4FF',Standard:'#8B5CF6',Free:'#6B7280'};
const POSTS = [
  {id:1, type:'Exclusive Video', icon:'🎬', likes:234, comments:18, tier:'VIP',      preview:'Behind the Scenes: Mein Studio Setup'},
  {id:2, type:'Early Access',    icon:'⏰', likes:156, comments:9,  tier:'Premium',  preview:'Neues Tutorial schon jetzt anschauen'},
  {id:3, type:'Community Post',  icon:'📢', likes:892, comments:67, tier:'Standard', preview:'Was soll ich als nächstes machen?'},
];

export default function FanConnectDashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const totalMembers = MEMBERS.length;
  const vipCount = MEMBERS.filter(m=>m.tier==='VIP').length;
  const monthlyRevenue = MEMBERS.reduce((s,m)=>s+parseInt(m.spent.replace('€','')||'0'),0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-rose-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(244,114,182,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-rose-400">❤️ FanConnect</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 bg-rose-500 text-white rounded-full">Upgrade</Link>
      </div>

      <div className="grid grid-cols-4 gap-3 p-5">
        {[
          {v:totalMembers.toString(),        l:'Mitglieder',       c:'#F472B6',s:'Community'},
          {v:vipCount.toString(),             l:'VIP-Mitglieder',   c:'#FFD700',s:'Top-Tier'},
          {v:`€${monthlyRevenue}`,            l:'Community Revenue',c:'#10B981',s:'Diesen Monat'},
          {v:'8',                             l:'Nachrichten offen',c:'#EF4444',s:'Unbeantwortet'},
        ].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wide">{s.l}</div>
            <div className="text-xs mt-1 font-semibold" style={{color:s.c}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4 flex gap-2">
        {['members','posts','messages'].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            className="text-xs font-bold px-4 py-2 rounded-full transition-all capitalize"
            style={activeTab===t?{background:'rgba(244,114,182,.2)',border:'1px solid rgba(244,114,182,.4)',color:'#F472B6'}:{border:'1px solid #374151',color:'#6B7280',background:'transparent'}}>
            {t==='members'?'👥 Mitglieder':t==='posts'?'📝 Posts':'💬 Nachrichten'}
          </button>
        ))}
      </div>

      {activeTab==='members' && (
        <div className="px-5 pb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-800">
              {MEMBERS.map(m=>(
                <div key={m.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-lg flex-shrink-0">{m.badge}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">Dabei seit {m.joined}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full font-mono" style={{color:TIER_COLORS[m.tier],background:TIER_COLORS[m.tier]+'18'}}>{m.tier}</span>
                  <div className="text-sm font-bold text-rose-400">{m.spent}</div>
                  {m.messages>0 && <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">{m.messages}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==='posts' && (
        <div className="px-5 pb-8 space-y-3">
          {POSTS.map(p=>(
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{p.preview}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono ml-auto" style={{color:TIER_COLORS[p.tier],background:TIER_COLORS[p.tier]+'18'}}>{p.tier}+</span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">{p.type} · ❤️ {p.likes} · 💬 {p.comments}</div>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-3 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-bold rounded-xl">+ Neuer Exclusive Post</button>
        </div>
      )}
    </div>
  );
}
