'use client';

import { useState } from 'react';

interface ContentClaim {
  id: string;
  contentTitle: string;
  platform: string;
  violationType: 'copyright' | 'deepfake' | 'unauthorized' | 'impersonation';
  status: 'detected' | 'reviewing' | 'resolved' | 'escalated';
  detectedDate: string;
  confidence: number;
}

const MOCK_CLAIMS: ContentClaim[] = [
  { id: '1', contentTitle: 'My Tutorial Video Re-upload', platform: 'YouTube', violationType: 'copyright', status: 'escalated', detectedDate: '2024-06-01', confidence: 97 },
  { id: '2', contentTitle: 'Deepfake Face Swap', platform: 'TikTok', violationType: 'deepfake', status: 'detected', detectedDate: '2024-05-30', confidence: 94 },
  { id: '3', contentTitle: 'Unauthorized Merch Use', platform: 'Instagram', violationType: 'unauthorized', status: 'reviewing', detectedDate: '2024-05-28', confidence: 88 },
  { id: '4', contentTitle: 'Fake Profile Impersonation', platform: 'Twitter/X', violationType: 'impersonation', status: 'resolved', detectedDate: '2024-05-25', confidence: 99 },
  { id: '5', contentTitle: 'Audio Clip Stolen', platform: 'Spotify', violationType: 'copyright', status: 'reviewing', detectedDate: '2024-05-22', confidence: 91 },
];

const STATUS_COLORS: Record<string, string> = { detected: '#EF4444', reviewing: '#F59E0B', resolved: '#10B981', escalated: '#8B5CF6' };
const VIOLATION_COLORS: Record<string, string> = { copyright: '#3B82F6', deepfake: '#EF4444', unauthorized: '#F59E0B', impersonation: '#8B5CF6' };

export default function RightsGuardDashboard() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'detected' | 'reviewing' | 'resolved' | 'escalated'>('all');

  const filtered = statusFilter === 'all' ? MOCK_CLAIMS : MOCK_CLAIMS.filter(c => c.status === statusFilter);

  const stats = [
    { label: 'Active Violations', value: '23', change: '-12%', color: 'text-red-400' },
    { label: 'Content Scanned', value: '15,847', change: '+8.4%', color: 'text-green-400' },
    { label: 'DMCA Sent', value: '156', change: '+3', color: 'text-blue-400' },
    { label: 'Resolution Rate', value: '94.2%', change: '+2.1%', color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">RightsGuard</h1>
            <p className="text-gray-400 text-sm">AI-Powered Content Protection & DMCA Management</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700">Scan Now</button>
            <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">Settings</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
              <p className={`${stat.color} text-sm mt-1`}>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'detected', 'reviewing', 'resolved', 'escalated'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                statusFilter === s ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono uppercase text-gray-500">Violation Reports</h3>
          </div>
          <table className="w-full">
            <thead className="text-[10px] font-mono uppercase text-gray-500 bg-black/20">
              <tr>
                <th className="p-4 text-left">Content</th>
                <th className="p-4 text-left">Platform</th>
                <th className="p-4 text-left">Violation</th>
                <th className="p-4 text-left">Confidence</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((claim) => (
                <tr key={claim.id} className="border-t border-gray-800 hover:bg-white/5">
                  <td className="p-4 font-medium">{claim.contentTitle}</td>
                  <td className="p-4 text-gray-400">{claim.platform}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: VIOLATION_COLORS[claim.violationType] + '20', color: VIOLATION_COLORS[claim.violationType] }}>
                      {claim.violationType}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${claim.confidence}%` }} />
                      </div>
                      <span className="text-sm text-gray-400">{claim.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: STATUS_COLORS[claim.status] + '20', color: STATUS_COLORS[claim.status] }}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{claim.detectedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Violations by Type</h3>
            {Object.entries(VIOLATION_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize text-sm">{type}</span>
                </div>
                <span className="text-gray-400 text-sm">{type === 'copyright' ? '45%' : type === 'deepfake' ? '25%' : type === 'unauthorized' ? '18%' : '12%'}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Platform Coverage</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm">YouTube</span><span className="text-green-400">Active</span></div>
              <div className="flex justify-between"><span className="text-sm">TikTok</span><span className="text-green-400">Active</span></div>
              <div className="flex justify-between"><span className="text-sm">Instagram</span><span className="text-green-400">Active</span></div>
              <div className="flex justify-between"><span className="text-sm">Twitter/X</span><span className="text-green-400">Active</span></div>
              <div className="flex justify-between"><span className="text-sm">Spotify</span><span className="text-yellow-400">Partial</span></div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30">File DMCA Takedown</button>
              <button className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30">Deep Scan Content</button>
              <button className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30">Export Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
