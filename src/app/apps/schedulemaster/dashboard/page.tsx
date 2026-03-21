'use client';

import { useState } from 'react';

interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'draft' | 'failed';
  type: 'video' | 'image' | 'story' | 'reel';
}

const MOCK_POSTS: ScheduledPost[] = [
  { id: '1', title: 'Summer Collection Launch', platform: 'Instagram', scheduledDate: '2024-06-05', scheduledTime: '10:00 AM', status: 'scheduled', type: 'reel' },
  { id: '2', title: 'Behind the Scenes Vlog', platform: 'YouTube', scheduledDate: '2024-06-04', scheduledTime: '2:00 PM', status: 'scheduled', type: 'video' },
  { id: '3', title: 'Product Review Thread', platform: 'Twitter/X', scheduledDate: '2024-06-03', scheduledTime: '9:00 AM', status: 'published', type: 'image' },
  { id: '4', title: 'Quick Tips Series #12', platform: 'TikTok', scheduledDate: '2024-06-02', scheduledTime: '6:00 PM', status: 'published', type: 'reel' },
  { id: '5', title: 'Weekly Newsletter Promo', platform: 'LinkedIn', scheduledDate: '2024-06-06', scheduledTime: '8:00 AM', status: 'draft', type: 'image' },
  { id: '6', title: 'Live Q&A Announcement', platform: 'Instagram', scheduledDate: '2024-06-01', scheduledTime: '4:00 PM', status: 'failed', type: 'story' },
];

const STATUS_COLORS: Record<string, string> = { scheduled: '#3B82F6', published: '#10B981', draft: '#9CA3AF', failed: '#EF4444' };
const PLATFORM_COLORS: Record<string, string> = { Instagram: '#E1306C', YouTube: '#FF0000', 'Twitter/X': '#1DA1F2', TikTok: '#000000', LinkedIn: '#0A66C2' };

export default function ScheduleMasterDashboard() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const stats = [
    { label: 'Scheduled Posts', value: '24', sub: 'Next 7 days' },
    { label: 'Published Today', value: '8', sub: '+3 vs yesterday' },
    { label: 'Best Post Time', value: '10 AM', sub: 'Tue & Thu' },
    { label: 'Auto-Post Rate', value: '98.5%', sub: 'Success rate' },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ScheduleMaster</h1>
            <p className="text-gray-400 text-sm">Cross-Platform Content Scheduling & Auto-Publishing</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700">New Post</button>
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
              <p className="text-indigo-400 text-sm mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
            <button onClick={() => setView('list')} className={`px-4 py-2 rounded-md text-sm ${view === 'list' ? 'bg-indigo-600' : 'text-gray-400'}`}>List</button>
            <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-md text-sm ${view === 'calendar' ? 'bg-indigo-600' : 'text-gray-400'}`}>Calendar</button>
          </div>
          <div className="flex gap-2">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <span key={status} className="flex items-center gap-1 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="capitalize">{status}</span>
              </span>
            ))}
          </div>
        </div>

        {view === 'list' ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="text-[10px] font-mono uppercase text-gray-500 bg-black/20">
                <tr>
                  <th className="p-4 text-left">Content</th>
                  <th className="p-4 text-left">Platform</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Date & Time</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_POSTS.map((post) => (
                  <tr key={post.id} className="border-t border-gray-800 hover:bg-white/5">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: (PLATFORM_COLORS[post.platform] || '#666') + '20', color: PLATFORM_COLORS[post.platform] || '#999' }}>
                        {post.platform}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 capitalize">{post.type}</td>
                    <td className="p-4 text-gray-400 text-sm">{post.scheduledDate} {post.scheduledTime}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: STATUS_COLORS[post.status] + '20', color: STATUS_COLORS[post.status] }}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-mono text-gray-500 pb-2">{day}</div>
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="border border-gray-800 rounded-lg p-2 min-h-[80px]">
                  <span className="text-xs text-gray-500">{i + 3}</span>
                  {i < 4 && (
                    <div className="mt-1 px-1 py-0.5 rounded text-[10px] bg-indigo-600/20 text-indigo-400 truncate">
                      {MOCK_POSTS[i]?.title.slice(0, 15)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Connected Platforms</h3>
            <div className="space-y-3">
              {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm">{platform}</span>
                  </div>
                  <span className="text-green-400 text-xs">Connected</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Posting Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm">Posts This Week</span><span className="text-indigo-400">18</span></div>
              <div className="flex justify-between"><span className="text-sm">Avg. Engagement</span><span className="text-indigo-400">4.2%</span></div>
              <div className="flex justify-between"><span className="text-sm">Best Platform</span><span className="text-indigo-400">Instagram</span></div>
              <div className="flex justify-between"><span className="text-sm">Queue Length</span><span className="text-indigo-400">24 posts</span></div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm hover:bg-indigo-600/30">Schedule Batch</button>
              <button className="w-full px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm hover:bg-green-600/30">AI Suggest Times</button>
              <button className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30">Content Calendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
