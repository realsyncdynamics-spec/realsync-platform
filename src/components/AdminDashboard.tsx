'use client';

import React from 'react';
import { TrendingUp, Users, Cpu, Wallet, ArrowUpRight, ArrowDownRight, MoreHorizontal, Activity, Globe } from 'lucide-react';

const USER_DATA = [
  { id: '1', name: 'Dominik Steiner', email: 'd.steiner@realsync.de', plan: 'Gold', status: 'Active', usage: '92%' },
  { id: '2', name: 'Laura Miller', email: 'laura@creator.io', plan: 'Silver', status: 'Active', usage: '45%' },
  { id: '3', name: 'Alex Rivera', email: 'alex@vault.com', plan: 'Bronze', status: 'Paused', usage: '12%' },
  { id: '4', name: 'Sarah Tech', email: 'sarah@ai.com', plan: 'Free', status: 'Active', usage: '98%' },
];

const APP_STATS = [
  { name: 'CreatorSeal', calls: '12.4k', cost: '42', revenue: '840' },
  { name: 'AdEngine', calls: '45.1k', cost: '128', revenue: '1240' },
  { name: 'TrendRadar', calls: '8.2k', cost: '15', revenue: '450' },
  { name: 'ContentForge', calls: '22.8k', cost: '65', revenue: '980' },
];

const HEALTH_ITEMS = [
  { label: 'Supabase DB', status: 'Operational', latency: '12ms' },
  { label: 'Vercel Edge', status: 'Operational', latency: '8ms' },
  { label: 'Stripe Connect', status: 'Operational', latency: '24ms' },
  { label: 'Gemini AI', status: 'Operational', latency: '180ms' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* TOP LEVEL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="MRR (Revenue)" value="14.820 EUR" change="+12.5%" icon={<Wallet className="text-[#C9A84C]" />} color="#C9A84C" />
        <StatCard title="Total Users" value="2.104" change="+48" icon={<Users className="text-cyan-400" />} color="#22D3EE" />
        <StatCard title="AI Cost (mtl.)" value="842 EUR" change="+5.2%" icon={<Cpu className="text-red-400" />} color="#F87171" isNegative />
        <StatCard title="Net Profit" value="13.978 EUR" change="+14.1%" icon={<TrendingUp className="text-green-400" />} color="#4ADE80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-[#0B0F18] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500 mb-8">Revenue Stream vs AI Tokens</h3>
          <div className="h-[250px] w-full flex items-end gap-2 px-4 border-b border-white/5 pb-2">
            {[40, 70, 45, 90, 65, 80, 95, 75, 85, 100, 90, 110].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div style={{ height: `${h}%` }} className="bg-gradient-to-t from-[#C9A84C]/20 to-[#C9A84C] rounded-t-sm" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <span>Jan 2026</span><span>Mar 2026 (Current)</span>
          </div>
        </div>

        {/* SYSTEM HEALTH */}
        <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500 mb-8">Infrastructure</h3>
          <div className="space-y-6">
            {HEALTH_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500">{item.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500">Active Subscriptions</h3>
          <button className="text-[10px] font-mono text-[#C9A84C] uppercase border border-[#C9A84C]/30 px-4 py-1 rounded-full">Export CSV</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-black/20 text-[10px] font-mono uppercase text-gray-500">
            <tr>
              <th className="p-6">User</th>
              <th className="p-6">Plan</th>
              <th className="p-6">Usage</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {USER_DATA.map((user) => (
              <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{user.email}</div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.plan === 'Gold' ? 'bg-[#C9A84C] text-black' : 'bg-white/10 text-white'}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="p-6">
                  <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: user.usage }} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 mt-1 block">{user.usage}</span>
                </td>
                <td className="p-6">
                  <span className={`flex items-center gap-2 text-[10px] font-mono uppercase ${user.status === 'Active' ? 'text-green-500' : 'text-orange-500'}`}>
                    <span className={`w-1 h-1 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* APP PERFORMANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {APP_STATS.map((app) => (
          <div key={app.name} className="p-6 bg-[#0B0F18] border border-white/5 rounded-[24px]">
            <h4 className="text-xs font-mono uppercase text-gray-500 mb-4">{app.name}</h4>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] text-gray-600 font-mono">Revenue</div>
                <div className="text-xl font-black italic">{app.revenue} EUR</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-600 font-mono">AI Cost</div>
                <div className="text-sm font-bold text-red-400">-{app.cost} EUR</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color, isNegative = false }: any) {
  return (
    <div className="bg-[#0B0F18] border border-white/5 p-6 rounded-[32px] hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-black/40 rounded-2xl">{icon}</div>
        <span className={`flex items-center gap-1 text-[10px] font-black ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
          {change} {isNegative ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
        </span>
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">{title}</div>
      <div className="text-3xl font-black italic tracking-tighter" style={{ color }}>{value}</div>
    </div>
  );
}
