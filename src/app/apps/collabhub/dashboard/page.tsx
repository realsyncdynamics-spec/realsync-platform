'use client';

import { useState } from 'react';

interface Collaboration {
  id: string;
  brand: string;
  creator: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  budget: number;
  platform: string;
  deadline: string;
  deliverables: number;
}

const MOCK_COLLABS: Collaboration[] = [
  { id: '1', brand: 'Nike Sports', creator: '@fitnessguru', status: 'active', budget: 5000, platform: 'Instagram', deadline: '2025-02-15', deliverables: 3 },
  { id: '2', brand: 'TechFlow AI', creator: '@techreviewer', status: 'pending', budget: 3500, platform: 'YouTube', deadline: '2025-02-20', deliverables: 2 },
  { id: '3', brand: 'GreenEats', creator: '@veganlife', status: 'completed', budget: 2000, platform: 'TikTok', deadline: '2025-01-30', deliverables: 5 },
  { id: '4', brand: 'CloudSync Pro', creator: '@devdaily', status: 'active', budget: 4500, platform: 'Twitter', deadline: '2025-03-01', deliverables: 4 },
  { id: '5', brand: 'StyleHouse', creator: '@fashionista', status: 'declined', budget: 1500, platform: 'Instagram', deadline: '2025-01-25', deliverables: 2 },
  { id: '6', brand: 'MindfulApp', creator: '@wellness_coach', status: 'pending', budget: 6000, platform: 'YouTube', deadline: '2025-03-10', deliverables: 6 },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  declined: 'bg-red-500/20 text-red-400',
};

export default function CollabHubDashboard() {
  const [collabs] = useState<Collaboration[]>(MOCK_COLLABS);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? collabs : collabs.filter(c => c.status === filter);
  const totalBudget = collabs.reduce((s, c) => s + c.budget, 0);
  const activeDeals = collabs.filter(c => c.status === 'active').length;
  const completedDeals = collabs.filter(c => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">CollabHub Dashboard</h1>
            <p className="text-gray-400 mt-1">Brand collaboration & partnership management</p>
          </div>
          <button className="bg-orange-600 hover:bg-orange-500 px-6 py-2 rounded-lg text-sm font-medium transition-all">+ New Collab</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Deals</p>
            <p className="text-2xl font-bold mt-1">{collabs.length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-2xl font-bold mt-1 text-green-400">{activeDeals}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold mt-1 text-blue-400">{completedDeals}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Budget</p>
            <p className="text-2xl font-bold mt-1 text-orange-400">{totalBudget.toLocaleString()} EUR</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'active', 'completed', 'declined'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === s ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{s}</button>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono text-gray-500 uppercase">Collaborations</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono text-gray-600 uppercase bg-black/30">
              <tr><th className="text-left p-4">Brand</th><th className="p-4">Creator</th><th className="p-4">Platform</th><th className="p-4">Budget</th><th className="p-4">Deliverables</th><th className="p-4">Status</th><th className="p-4">Deadline</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4 font-bold">{c.brand}</td>
                  <td className="p-4 text-center text-cyan-400">{c.creator}</td>
                  <td className="p-4 text-center text-gray-400">{c.platform}</td>
                  <td className="p-4 text-center">{c.budget.toLocaleString()} EUR</td>
                  <td className="p-4 text-center">{c.deliverables}</td>
                  <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status}</span></td>
                  <td className="p-4 text-center text-gray-500">{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
