'use client';
import React, { useState } from 'react';

const platforms = [
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600', connected: true, followers: '12.4K' },
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-600', connected: true, followers: '8.2K' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-gray-800', connected: false, followers: '-' },
  { id: 'twitter', name: 'X / Twitter', color: 'bg-blue-500', connected: true, followers: '3.1K' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', connected: false, followers: '-' },
];

const scheduledPosts = [
  { id: 1, title: 'Neues Video: CreatorSeal Tutorial', platform: 'YouTube', time: '2025-01-20 14:00', status: 'geplant' },
  { id: 2, title: 'Behind the Scenes - RealSync Lab', platform: 'Instagram', time: '2025-01-20 18:00', status: 'geplant' },
  { id: 3, title: 'Content-Schutz Tipps Thread', platform: 'X / Twitter', time: '2025-01-21 10:00', status: 'entwurf' },
  { id: 4, title: 'Wochenrueckblick Analytics', platform: 'YouTube', time: '2025-01-22 12:00', status: 'geplant' },
];

export default function SocialAutomationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [postText, setPostText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">RealSync SozialNetzwerk</h1>
      <p className="text-gray-400 mb-6">Social Media Automation & Content-Planung</p>

      <div className="flex gap-2 mb-8 border-b border-gray-700 pb-2">
        {['overview', 'planen', 'analytics', 'automation'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium capitalize ${
              activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}>{tab === 'overview' ? 'Uebersicht' : tab === 'planen' ? 'Beitraege planen' : tab === 'analytics' ? 'Analytics' : 'Automation'}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Verbundene Plattformen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {platforms.map(p => (
              <div key={p.id} className={`p-4 rounded-xl border ${
                p.connected ? 'border-green-700 bg-green-900/20' : 'border-gray-700 bg-gray-900'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${p.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {p.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm text-gray-400">{p.followers} Follower</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.connected ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
                  }`}>{p.connected ? 'Verbunden' : 'Nicht verbunden'}</span>
                </div>
                <button className={`w-full py-2 rounded-lg text-sm font-medium ${
                  p.connected ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
                }`}>{p.connected ? 'Verwalten' : 'Verbinden'}</button>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Geplante Beitraege</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-3 text-sm">Titel</th>
                  <th className="text-left p-3 text-sm">Plattform</th>
                  <th className="text-left p-3 text-sm">Zeit</th>
                  <th className="text-left p-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduledPosts.map(post => (
                  <tr key={post.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="p-3">{post.title}</td>
                    <td className="p-3 text-gray-400">{post.platform}</td>
                    <td className="p-3 text-gray-400">{post.time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.status === 'geplant' ? 'bg-blue-800 text-blue-300' : 'bg-yellow-800 text-yellow-300'
                      }`}>{post.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'planen' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Neuen Beitrag erstellen</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <label className="block text-sm font-medium mb-2">Beitragstext</label>
            <textarea value={postText} onChange={e => setPostText(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg resize-none"
              placeholder="Was moechtest du teilen?" />
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Plattformen auswaehlen</label>
              <div className="flex gap-2">
                {platforms.filter(p => p.connected).map(p => (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                      selectedPlatforms.includes(p.id) ? 'border-purple-500 bg-purple-500/20' : 'border-gray-700'
                    }`}>{p.name}</button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium">
                Jetzt posten
              </button>
              <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium">
                Planen
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">RealSync SozialNetzwerk Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Gesamte Reichweite', value: '45.2K', change: '+12%' },
              { label: 'Engagement Rate', value: '4.8%', change: '+0.3%' },
              { label: 'Neue Follower (7T)', value: '+284', change: '+18%' },
              { label: 'Geplante Posts', value: '12', change: '' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {stat.change && <p className="text-green-400 text-sm mt-1">{stat.change}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">RealSync Automation Regeln</h2>
          <div className="space-y-4">
            {[
              { name: 'Auto-Post bei neuem YouTube Video', active: true, desc: 'Teile automatisch neue Videos auf allen Plattformen' },
              { name: 'Engagement Auto-Reply', active: false, desc: 'Automatische Antworten auf haeufige Kommentare' },
              { name: 'Content Recycling', active: true, desc: 'Teile Top-Beitraege erneut nach 30 Tagen' },
              { name: 'Analytics Report', active: true, desc: 'Woechentlicher Performance-Bericht per E-Mail' },
            ].map((rule, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{rule.name}</h3>
                  <p className="text-gray-400 text-sm">{rule.desc}</p>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  rule.active ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
                }`}>{rule.active ? 'Aktiv' : 'Inaktiv'}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
