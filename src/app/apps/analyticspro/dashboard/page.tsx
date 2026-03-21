'use client';

import { ArrowUpRight } from 'lucide-react';

const PLATFORMS = [
  { name: 'YouTube', followers: '124.5k', growth: '+2.4%', engagement: '8.2%', color: '#FF0000' },
  { name: 'TikTok', followers: '89.2k', growth: '+12.1%', engagement: '14.6%', color: '#00F2EA' },
  { name: 'Instagram', followers: '67.8k', growth: '+3.8%', engagement: '6.1%', color: '#E4405F' },
  { name: 'LinkedIn', followers: '12.1k', growth: '+1.2%', engagement: '4.8%', color: '#0A66C2' },
];

const METRICS = [
  { label: 'Total Reach', value: '2.4M', change: '+18%' },
  { label: 'Engagement Rate', value: '9.8%', change: '+2.1%' },
  { label: 'New Followers', value: '+4.2k', change: '+24%' },
  { label: 'Content Score', value: '94/100', change: '+5' },
];

export default function AnalyticsProDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <p className="text-[10px] font-mono text-[#6366F1] uppercase tracking-[0.5em] mb-2">Cross-Platform Intelligence</p>
          <h1 className="text-3xl font-black italic uppercase">Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <p className="text-[10px] font-mono text-gray-500 uppercase mb-2">{m.label}</p>
              <p className="text-2xl font-black italic">{m.value}</p>
              <span className="text-green-400 text-xs flex items-center gap-1 mt-1"><ArrowUpRight size={12} />{m.change}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-6">Engagement Timeline</h3>
            <div className="h-[200px] flex items-end gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-[#6366F1]/20 to-[#6366F1] rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
              ))}
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-6">KI-Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-xl text-sm">Beste Posting-Zeit: Di und Do 18-20 Uhr</div>
              <div className="p-4 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-xl text-sm">Top Content: Tutorial-Format +34% Retention</div>
              <div className="p-4 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-xl text-sm">TikTok waechst am schnellsten: +12.1%</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono uppercase text-gray-500">Platform Performance</h3>
          </div>
          <table className="w-full">
            <thead className="text-[10px] font-mono uppercase text-gray-500 bg-black/20">
              <tr><th className="p-4 text-left">Platform</th><th className="p-4 text-left">Followers</th><th className="p-4 text-left">Growth</th><th className="p-4 text-left">Engagement</th></tr>
            </thead>
            <tbody>
              {PLATFORMS.map((p) => (
                <tr key={p.name} className="border-t border-gray-800 hover:bg-white/5">
                  <td className="p-4 font-bold" style={{ color: p.color }}>{p.name}</td>
                  <td className="p-4">{p.followers}</td>
                  <td className="p-4 text-green-400">{p.growth}</td>
                  <td className="p-4">{p.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
