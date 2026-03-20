'use client';

import { Rocket, BarChart2, Plus, Eye, MousePointer, DollarSign } from 'lucide-react';
import Link from 'next/link';

const CAMPAIGNS = [
  { id: 1, name: 'CreatorSeal Launch', platform: 'TikTok', status: 'Active', ctr: '14.2%', spend: '120' },
  { id: 2, name: 'Spring Promo', platform: 'Instagram', status: 'Active', ctr: '8.7%', spend: '85' },
  { id: 3, name: 'B2B Outreach', platform: 'LinkedIn', status: 'Paused', ctr: '3.1%', spend: '200' },
];

export default function AdEngineDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <nav className="flex items-center justify-between mb-10">
        <Link href="/apps/adengine" className="text-gray-500 hover:text-white text-sm">&larr; AdEngine</Link>
        <h1 className="text-2xl font-black italic" style={{ color: '#FF6B35' }}>ADENGINE COMMAND</h1>
        <button className="bg-[#FF6B35] text-black px-4 py-2 font-bold text-sm rounded-lg flex items-center gap-2"><Plus size={16} /> New Campaign</button>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <Rocket size={24} className="text-[#FF6B35] mb-3" />
          <div className="text-3xl font-black">12</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Active Campaigns</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <Eye size={24} className="text-blue-400 mb-3" />
          <div className="text-3xl font-black">84.2k</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Impressions</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <MousePointer size={24} className="text-green-400 mb-3" />
          <div className="text-3xl font-black">14.2%</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Avg CTR</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <DollarSign size={24} className="text-yellow-400 mb-3" />
          <div className="text-3xl font-black">405 EUR</div>
          <div className="text-xs text-gray-500 font-mono uppercase">Total Spend</div>
        </div>
      </div>
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-mono text-gray-500 uppercase">Campaign Overview</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] font-mono text-gray-600 uppercase bg-black/30">
            <tr><th className="text-left p-4">Campaign</th><th className="p-4">Platform</th><th className="p-4">CTR</th><th className="p-4">Spend</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c) => (
              <tr key={c.id} className="border-t border-gray-800">
                <td className="p-4 font-bold">{c.name}</td>
                <td className="p-4 text-center">{c.platform}</td>
                <td className="p-4 text-center text-green-400">{c.ctr}</td>
                <td className="p-4 text-center">{c.spend} EUR</td>
                <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${c.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
