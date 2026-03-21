'use client';

import { useState } from 'react';

interface RevenueStream {
  id: string;
  source: string;
  type: 'subscription' | 'sponsorship' | 'affiliate' | 'digital_product' | 'tip';
  revenue: number;
  currency: string;
  period: string;
  growth: number;
}

const MOCK_REVENUE: RevenueStream[] = [
  { id: '1', source: 'YouTube AdSense', type: 'subscription', revenue: 4250, currency: 'EUR', period: 'Jan 2025', growth: 23 },
  { id: '2', source: 'Patreon Members', type: 'subscription', revenue: 3800, currency: 'EUR', period: 'Jan 2025', growth: 15 },
  { id: '3', source: 'Nike Sponsorship', type: 'sponsorship', revenue: 5000, currency: 'EUR', period: 'Jan 2025', growth: 0 },
  { id: '4', source: 'Amazon Affiliates', type: 'affiliate', revenue: 1200, currency: 'EUR', period: 'Jan 2025', growth: -8 },
  { id: '5', source: 'Online Course Sales', type: 'digital_product', revenue: 8500, currency: 'EUR', period: 'Jan 2025', growth: 45 },
  { id: '6', source: 'Ko-fi Tips', type: 'tip', revenue: 350, currency: 'EUR', period: 'Jan 2025', growth: 12 },
];

const TYPE_COLORS: Record<string, string> = {
  subscription: 'bg-blue-500/20 text-blue-400',
  sponsorship: 'bg-purple-500/20 text-purple-400',
  affiliate: 'bg-green-500/20 text-green-400',
  digital_product: 'bg-yellow-500/20 text-yellow-400',
  tip: 'bg-pink-500/20 text-pink-400',
};

export default function MonetizeMaxDashboard() {
  const [streams] = useState<RevenueStream[]>(MOCK_REVENUE);

  const totalRevenue = streams.reduce((s, r) => s + r.revenue, 0);
  const avgGrowth = Math.round(streams.reduce((s, r) => s + r.growth, 0) / streams.length);
  const topStream = [...streams].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">MonetizeMax Dashboard</h1>
            <p className="text-gray-400 mt-1">Revenue optimization & monetization tracking</p>
          </div>
          <button className="bg-yellow-600 hover:bg-yellow-500 px-6 py-2 rounded-lg text-sm font-medium transition-all text-black">+ Add Stream</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold mt-1 text-green-400">{totalRevenue.toLocaleString()} EUR</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Avg Growth</p>
            <p className="text-2xl font-bold mt-1 text-cyan-400">+{avgGrowth}%</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Top Stream</p>
            <p className="text-2xl font-bold mt-1 text-yellow-400">{topStream?.source}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Active Streams</p>
            <p className="text-2xl font-bold mt-1">{streams.length}</p>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono text-gray-500 uppercase">Revenue Streams</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono text-gray-600 uppercase bg-black/30">
              <tr><th className="text-left p-4">Source</th><th className="p-4">Type</th><th className="p-4">Revenue</th><th className="p-4">Growth</th><th className="p-4">Period</th></tr>
            </thead>
            <tbody>
              {streams.map(r => (
                <tr key={r.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4 font-bold">{r.source}</td>
                  <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${TYPE_COLORS[r.type]}`}>{r.type.replace('_', ' ')}</span></td>
                  <td className="p-4 text-center font-mono">{r.revenue.toLocaleString()} {r.currency}</td>
                  <td className={`p-4 text-center ${r.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>{r.growth >= 0 ? '+' : ''}{r.growth}%</td>
                  <td className="p-4 text-center text-gray-500">{r.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
