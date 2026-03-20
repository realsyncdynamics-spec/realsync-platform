'use client';

import { useState, useEffect } from 'react';

interface Trend {
  id: string;
  keyword: string;
  platform: string;
  volume: number;
  growth: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
}

const MOCK_TRENDS: Trend[] = [
  { id: '1', keyword: 'AI Video Editing', platform: 'YouTube', volume: 284000, growth: 156, sentiment: 'positive', category: 'Technology' },
  { id: '2', keyword: 'Sustainable Fashion', platform: 'Instagram', volume: 192000, growth: 89, sentiment: 'positive', category: 'Lifestyle' },
  { id: '3', keyword: 'Crypto Regulation', platform: 'Twitter', volume: 341000, growth: -12, sentiment: 'negative', category: 'Finance' },
  { id: '4', keyword: 'Home Fitness 2025', platform: 'TikTok', volume: 528000, growth: 234, sentiment: 'positive', category: 'Health' },
  { id: '5', keyword: 'Remote Work Tools', platform: 'LinkedIn', volume: 167000, growth: 45, sentiment: 'neutral', category: 'Business' },
  { id: '6', keyword: 'Plant-Based Recipes', platform: 'Pinterest', volume: 412000, growth: 67, sentiment: 'positive', category: 'Food' },
];

const PLATFORMS = ['All', 'YouTube', 'Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'Pinterest'];

export default function TrendRadarDashboard() {
  const [trends, setTrends] = useState<Trend[]>(MOCK_TRENDS);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = trends.filter(t => {
    const matchPlatform = selectedPlatform === 'All' || t.platform === selectedPlatform;
    const matchSearch = t.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const topGrowth = [...trends].sort((a, b) => b.growth - a.growth)[0];
  const totalVolume = trends.reduce((s, t) => s + t.volume, 0);
  const avgGrowth = Math.round(trends.reduce((s, t) => s + t.growth, 0) / trends.length);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">TrendRadar Dashboard</h1>
            <p className="text-gray-400 mt-1">Real-time trend analysis across platforms</p>
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Search trends..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Volume</p>
            <p className="text-2xl font-bold mt-1">{(totalVolume / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Avg Growth</p>
            <p className="text-2xl font-bold mt-1 text-green-400">+{avgGrowth}%</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Top Trend</p>
            <p className="text-2xl font-bold mt-1 text-cyan-400">{topGrowth?.keyword}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Tracked Trends</p>
            <p className="text-2xl font-bold mt-1">{trends.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setSelectedPlatform(p)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPlatform === p ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{p}</button>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono text-gray-500 uppercase">Trend Analysis</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono text-gray-600 uppercase bg-black/30">
              <tr><th className="text-left p-4">Keyword</th><th className="p-4">Platform</th><th className="p-4">Volume</th><th className="p-4">Growth</th><th className="p-4">Sentiment</th><th className="p-4">Category</th></tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-t border-gray-800">
                  <td className="p-4 font-bold">{t.keyword}</td>
                  <td className="p-4 text-center">{t.platform}</td>
                  <td className="p-4 text-center">{(t.volume / 1000).toFixed(0)}K</td>
                  <td className={`p-4 text-center ${t.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>{t.growth >= 0 ? '+' : ''}{t.growth}%</td>
                  <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${t.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' : t.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{t.sentiment}</span></td>
                  <td className="p-4 text-center text-gray-400">{t.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
