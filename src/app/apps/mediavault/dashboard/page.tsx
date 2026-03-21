'use client';

import { useState } from 'react';

interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'document';
  size: string;
  uploaded: string;
  status: 'protected' | 'pending' | 'archived';
  blockchain: boolean;
}

const MOCK_FILES: MediaFile[] = [
  { id: '1', name: 'brand_video_final.mp4', type: 'video', size: '2.4 GB', uploaded: '2024-06-01', status: 'protected', blockchain: true },
  { id: '2', name: 'podcast_ep45.mp3', type: 'audio', size: '89 MB', uploaded: '2024-05-28', status: 'protected', blockchain: true },
  { id: '3', name: 'thumbnail_pack.zip', type: 'document', size: '156 MB', uploaded: '2024-05-25', status: 'pending', blockchain: false },
  { id: '4', name: 'photo_shoot_raw.zip', type: 'image', size: '4.1 GB', uploaded: '2024-05-22', status: 'protected', blockchain: true },
  { id: '5', name: 'intro_animation.mov', type: 'video', size: '780 MB', uploaded: '2024-05-20', status: 'archived', blockchain: true },
  { id: '6', name: 'social_assets_q2.zip', type: 'image', size: '320 MB', uploaded: '2024-05-18', status: 'protected', blockchain: false },
];

const TYPE_ICONS: Record<string, string> = { video: '🎬', image: '🖼️', audio: '🎵', document: '📄' };
const STATUS_COLORS: Record<string, string> = { protected: '#10B981', pending: '#F59E0B', archived: '#6B7280' };

export default function MediaVaultDashboard() {
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'audio' | 'document'>('all');

  const filteredFiles = filter === 'all' ? MOCK_FILES : MOCK_FILES.filter(f => f.type === filter);

  const stats = [
    { label: 'Total Storage', value: '48.2 GB', sub: 'of 100 GB' },
    { label: 'Protected Files', value: '847', sub: '94% secured' },
    { label: 'Blockchain Verified', value: '623', sub: 'C2PA certified' },
    { label: 'Downloads', value: '2,341', sub: 'this month' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MediaVault</h1>
            <p className="text-gray-400 text-sm">Secure Media Storage & Blockchain Protection</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-700">Upload Files</button>
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
              <p className="text-cyan-400 text-sm mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '48.2%' }} />
          </div>
          <p className="text-gray-400 text-sm mt-2">48.2 GB / 100 GB used</p>
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'video', 'image', 'audio', 'document'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                filter === t ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Files' : t}
            </button>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="text-[10px] font-mono uppercase text-gray-500 bg-black/20">
              <tr>
                <th className="p-4 text-left">File</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Size</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Blockchain</th>
                <th className="p-4 text-left">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr key={file.id} className="border-t border-gray-800 hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{TYPE_ICONS[file.type]}</span>
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 capitalize">{file.type}</td>
                  <td className="p-4 text-gray-400">{file.size}</td>
                  <td className="p-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                      style={{ backgroundColor: STATUS_COLORS[file.status] + '20', color: STATUS_COLORS[file.status] }}
                    >
                      {file.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {file.blockchain ? (
                      <span className="text-green-400 text-sm">Verified</span>
                    ) : (
                      <span className="text-gray-500 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{file.uploaded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Storage by Type</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm">Videos</span><span className="text-cyan-400">28.4 GB</span></div>
              <div className="flex justify-between"><span className="text-sm">Images</span><span className="text-cyan-400">12.1 GB</span></div>
              <div className="flex justify-between"><span className="text-sm">Audio</span><span className="text-cyan-400">5.2 GB</span></div>
              <div className="flex justify-between"><span className="text-sm">Documents</span><span className="text-cyan-400">2.5 GB</span></div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Protection Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-sm">Protected: 623 files</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-sm">Pending: 89 files</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-500" /><span className="text-sm">Archived: 135 files</span></div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-600/30">Bulk Upload</button>
              <button className="w-full px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30">Verify All Pending</button>
              <button className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
