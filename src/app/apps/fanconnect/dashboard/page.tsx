'use client';

import { useState } from 'react';

interface Fan {
  id: string;
  name: string;
  tier: 'free' | 'supporter' | 'vip' | 'superfan';
  joinDate: string;
  totalSpent: number;
  engagementScore: number;
  lastActive: string;
}

interface CommunityPost {
  id: string;
  title: string;
  type: 'announcement' | 'poll' | 'exclusive' | 'behind-scenes';
  likes: number;
  comments: number;
  date: string;
}

const MOCK_FANS: Fan[] = [
  { id: '1', name: 'Alex M.', tier: 'superfan', joinDate: '2024-01-15', totalSpent: 249.99, engagementScore: 98, lastActive: '2 min ago' },
  { id: '2', name: 'Sarah K.', tier: 'vip', joinDate: '2024-02-20', totalSpent: 149.99, engagementScore: 87, lastActive: '1 hour ago' },
  { id: '3', name: 'Mike T.', tier: 'supporter', joinDate: '2024-03-10', totalSpent: 49.99, engagementScore: 72, lastActive: '3 hours ago' },
  { id: '4', name: 'Emma L.', tier: 'free', joinDate: '2024-04-05', totalSpent: 0, engagementScore: 45, lastActive: '1 day ago' },
  { id: '5', name: 'James R.', tier: 'vip', joinDate: '2024-01-28', totalSpent: 199.99, engagementScore: 91, lastActive: '30 min ago' },
];

const MOCK_POSTS: CommunityPost[] = [
  { id: '1', title: 'New merch drop coming Friday!', type: 'announcement', likes: 342, comments: 89, date: '2024-06-01' },
  { id: '2', title: 'What content do you want next?', type: 'poll', likes: 567, comments: 234, date: '2024-05-28' },
  { id: '3', title: 'Behind the scenes: Studio tour', type: 'behind-scenes', likes: 891, comments: 156, date: '2024-05-25' },
  { id: '4', title: 'Exclusive early access: New video', type: 'exclusive', likes: 1203, comments: 312, date: '2024-05-22' },
];

const TIER_COLORS: Record<string, string> = {
  free: '#9CA3AF',
  supporter: '#60A5FA',
  vip: '#A78BFA',
  superfan: '#F59E0B',
};

const TYPE_COLORS: Record<string, string> = {
  announcement: '#3B82F6',
  poll: '#10B981',
  exclusive: '#F59E0B',
  'behind-scenes': '#8B5CF6',
};

export default function FanConnectDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'fans' | 'community' | 'monetize'>('overview');

  const stats = [
    { label: 'Total Fans', value: '12,847', change: '+18.3%' },
    { label: 'Active Members', value: '8,932', change: '+12.1%' },
    { label: 'Monthly Revenue', value: '$4,280', change: '+24.7%' },
    { label: 'Engagement Rate', value: '67.4%', change: '+5.2%' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FanConnect</h1>
            <p className="text-gray-400 text-sm">Community & Fan Engagement Platform</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-pink-600 rounded-lg text-sm font-medium hover:bg-pink-700">Create Post</button>
            <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">Settings</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-1 mb-6 bg-gray-900 rounded-lg p-1 w-fit">
          {(['overview', 'fans', 'community', 'monetize'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
              <p className="text-green-400 text-sm mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-mono uppercase text-gray-500">Top Fans</h3>
            </div>
            <table className="w-full">
              <thead className="text-[10px] font-mono uppercase text-gray-500 bg-black/20">
                <tr>
                  <th className="p-4 text-left">Fan</th>
                  <th className="p-4 text-left">Tier</th>
                  <th className="p-4 text-left">Engagement</th>
                  <th className="p-4 text-left">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_FANS.map((fan) => (
                  <tr key={fan.id} className="border-t border-gray-800 hover:bg-white/5">
                    <td className="p-4 font-bold">{fan.name}</td>
                    <td className="p-4">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                        style={{ backgroundColor: TIER_COLORS[fan.tier] + '20', color: TIER_COLORS[fan.tier] }}
                      >
                        {fan.tier}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: `${fan.engagementScore}%` }} />
                        </div>
                        <span className="text-sm text-gray-400">{fan.engagementScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{fan.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-mono uppercase text-gray-500">Community Posts</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {MOCK_POSTS.map((post) => (
                <div key={post.id} className="p-4 hover:bg-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded capitalize"
                        style={{ backgroundColor: TYPE_COLORS[post.type] + '20', color: TYPE_COLORS[post.type] }}
                      >
                        {post.type.replace('-', ' ')}
                      </span>
                      <p className="font-medium mt-2">{post.title}</p>
                    </div>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-gray-400">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Tier Distribution</h3>
            {Object.entries(TIER_COLORS).map(([tier, color]) => (
              <div key={tier} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize text-sm">{tier}</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {tier === 'free' ? '68%' : tier === 'supporter' ? '18%' : tier === 'vip' ? '10%' : '4%'}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Revenue Sources</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm">Memberships</span><span className="text-green-400">$2,840</span></div>
              <div className="flex justify-between"><span className="text-sm">Tips & Donations</span><span className="text-green-400">$720</span></div>
              <div className="flex justify-between"><span className="text-sm">Exclusive Content</span><span className="text-green-400">$520</span></div>
              <div className="flex justify-between"><span className="text-sm">Merch Sales</span><span className="text-green-400">$200</span></div>
            </div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono uppercase text-gray-500 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-pink-600/20 text-pink-400 rounded-lg text-sm hover:bg-pink-600/30">Send Mass Message</button>
              <button className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm hover:bg-purple-600/30">Create Exclusive Content</button>
              <button className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30">Launch Poll</button>
              <button className="w-full px-4 py-2 bg-amber-600/20 text-amber-400 rounded-lg text-sm hover:bg-amber-600/30">Schedule Event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
