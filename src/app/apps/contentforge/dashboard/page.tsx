'use client';

import { useState } from 'react';

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'video' | 'social' | 'email';
  status: 'draft' | 'review' | 'published' | 'scheduled';
  platform: string;
  words: number;
  createdAt: string;
}

const MOCK_CONTENT: ContentItem[] = [
  { id: '1', title: 'How AI is Transforming Content Creation', type: 'blog', status: 'published', platform: 'WordPress', words: 2400, createdAt: '2025-01-15' },
  { id: '2', title: 'Product Launch Announcement Video', type: 'video', status: 'review', platform: 'YouTube', words: 850, createdAt: '2025-01-14' },
  { id: '3', title: 'Weekly Newsletter: Creator Economy', type: 'email', status: 'scheduled', platform: 'Mailchimp', words: 1200, createdAt: '2025-01-13' },
  { id: '4', title: 'Instagram Carousel: 10 Creator Tips', type: 'social', status: 'draft', platform: 'Instagram', words: 500, createdAt: '2025-01-12' },
  { id: '5', title: 'SEO Guide for Small Businesses', type: 'blog', status: 'published', platform: 'WordPress', words: 3100, createdAt: '2025-01-11' },
  { id: '6', title: 'TikTok Series: Behind the Scenes', type: 'video', status: 'draft', platform: 'TikTok', words: 300, createdAt: '2025-01-10' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  review: 'bg-yellow-500/20 text-yellow-400',
  published: 'bg-green-500/20 text-green-400',
  scheduled: 'bg-blue-500/20 text-blue-400',
};

const TYPE_COLORS: Record<string, string> = {
  blog: 'bg-purple-500/20 text-purple-400',
  video: 'bg-red-500/20 text-red-400',
  social: 'bg-pink-500/20 text-pink-400',
  email: 'bg-cyan-500/20 text-cyan-400',
};

export default function ContentForgeDashboard() {
  const [content] = useState<ContentItem[]>(MOCK_CONTENT);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? content : content.filter(c => c.status === filterStatus);
  const totalWords = content.reduce((s, c) => s + c.words, 0);
  const published = content.filter(c => c.status === 'published').length;
  const drafts = content.filter(c => c.status === 'draft').length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">ContentForge Dashboard</h1>
            <p className="text-gray-400 mt-1">AI-powered content generation & management</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg text-sm font-medium transition-all">+ New Content</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Content</p>
            <p className="text-2xl font-bold mt-1">{content.length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Published</p>
            <p className="text-2xl font-bold mt-1 text-green-400">{published}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Drafts</p>
            <p className="text-2xl font-bold mt-1 text-yellow-400">{drafts}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Words</p>
            <p className="text-2xl font-bold mt-1 text-purple-400">{(totalWords / 1000).toFixed(1)}K</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'draft', 'review', 'scheduled', 'published'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filterStatus === s ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{s}</button>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-mono text-gray-500 uppercase">Content Library</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] font-mono text-gray-600 uppercase bg-black/30">
              <tr><th className="text-left p-4">Title</th><th className="p-4">Type</th><th className="p-4">Platform</th><th className="p-4">Words</th><th className="p-4">Status</th><th className="p-4">Created</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-t border-gray-800 hover:bg-gray-800/30 cursor-pointer">
                  <td className="p-4 font-bold">{c.title}</td>
                  <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${TYPE_COLORS[c.type]}`}>{c.type}</span></td>
                  <td className="p-4 text-center text-gray-400">{c.platform}</td>
                  <td className="p-4 text-center">{c.words.toLocaleString()}</td>
                  <td className="p-4 text-center"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status}</span></td>
                  <td className="p-4 text-center text-gray-500">{c.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
