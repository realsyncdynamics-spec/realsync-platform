'use client';

import { TrendingUp, DollarSign } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REVENUE = [4800, 8400, 5400, 10800, 7800, 9600, 11400, 9000, 10200, 12000, 10800, 14820];

const PLAN_DIST = [
  { plan: 'Free', users: 1240, revenue: '0 EUR', color: 'bg-white/10' },
  { plan: 'Bronze', users: 420, revenue: '2.100 EUR', color: 'bg-orange-700' },
  { plan: 'Silver', users: 310, revenue: '4.650 EUR', color: 'bg-gray-400' },
  { plan: 'Gold', users: 134, revenue: '8.070 EUR', color: 'bg-[#C9A84C]' },
];

export default function AdminRevenuePage() {
  const maxRev = Math.max(...REVENUE);
  return (
    <div className="p-8 md:p-12 space-y-8">
      <div>
        <p className="text-[10px] font-mono text-[#C9A84C] uppercase tracking-[0.5em] mb-2">Revenue & Stripe</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">MRR Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0B0F18] border border-white/5 p-6 rounded-[32px]">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-[#C9A84C]" size={18} />
            <span className="text-[10px] font-mono uppercase text-gray-500">Current MRR</span>
          </div>
          <p className="text-4xl font-black italic text-[#C9A84C]">14.820 EUR</p>
          <p className="text-green-400 text-xs font-bold mt-1">+12.5% vs last month</p>
        </div>
        <div className="bg-[#0B0F18] border border-white/5 p-6 rounded-[32px]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-400" size={18} />
            <span className="text-[10px] font-mono uppercase text-gray-500">Total Users</span>
          </div>
          <p className="text-4xl font-black italic">2.104</p>
          <p className="text-green-400 text-xs font-bold mt-1">+48 this week</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] p-8">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500 mb-8">Revenue Stream 2026</h2>
        <div className="h-[250px] w-full flex items-end gap-2 px-4 border-b border-white/5 pb-2">
          {REVENUE.map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div className="bg-gradient-to-t from-[#C9A84C]/20 to-[#C9A84C] rounded-t-sm transition-all" style={{ height: `${(h / maxRev) * 100}%` }} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {h} EUR
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          {MONTHS.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-[#0B0F18] border border-white/5 rounded-[32px] p-8">
        <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-gray-500 mb-6">Plan Distribution</h2>
        <div className="space-y-4">
          {PLAN_DIST.map((p) => (
            <div key={p.plan} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${p.color}`} />
                <span className="font-bold text-sm">{p.plan}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-xs">{p.users} users</span>
                <span className="ml-4 font-bold text-sm">{p.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
