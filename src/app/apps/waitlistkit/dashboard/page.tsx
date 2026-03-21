'use client';
import Link from 'next/link';
import { useState } from 'react';

const mockSignups = [
  { id: '1', email: 'max@startup.de', position: 1, referrals: 12, joinedAt: 'vor 5 Min', source: 'Twitter' },
  { id: '2', email: 'lisa@creative.de', position: 2, referrals: 8, joinedAt: 'vor 12 Min', source: 'Direct' },
  { id: '3', email: 'tom@agency.de', position: 3, referrals: 5, joinedAt: 'vor 1h', source: 'Referral' },
  { id: '4', email: 'anna@tech.de', position: 4, referrals: 3, joinedAt: 'vor 2h', source: 'Product Hunt' },
  { id: '5', email: 'jan@design.de', position: 5, referrals: 1, joinedAt: 'vor 3h', source: 'Direct' },
  { id: '6', email: 'sarah@media.de', position: 6, referrals: 0, joinedAt: 'vor 4h', source: 'Referral' },
];

export default function WaitlistKitDashboard() {
  const [copied, setCopied] = useState(false);
  const total = 847;
  const todayNew = 23;
  const topReferrer = mockSignups[0];

  const copyEmbed = () => {
    navigator.clipboard.writeText('<script src="https://waitlistkit.de/embed.js"></script>\n<waitlist-widget project="wk_demo" lang="de" referral="true"></waitlist-widget>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 text-sm hover:text-white">← RealSync</Link>
            <span className="text-gray-700">|</span>
            <span className="font-bold text-lg">🚀 WaitlistKit</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold px-3 py-1 rounded-full">{total} auf Waitlist</span>
            <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">+{todayNew} heute</span>
            <a href="/pricing?app=waitlistkit" className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold px-3 py-1 rounded-full hover:bg-purple-500/20 transition-all">💎 Upgrade</a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-lime-400/10 border border-lime-400/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-lime-400">{total}</div>
            <div className="text-lime-600 text-xs mt-1">Gesamt Signups</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">+{todayNew}</div>
            <div className="text-gray-500 text-xs mt-1">Heute neu</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">68%</div>
            <div className="text-purple-600 text-xs mt-1">via Referral</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-3xl font-bold text-white">12</div>
            <div className="text-gray-500 text-xs mt-1">Top Referrals ({topReferrer.email.split('@')[0]})</div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">// Embed Code</span>
            <button onClick={copyEmbed} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${copied ? 'bg-lime-400 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {copied ? '✓ Kopiert!' : 'Kopieren'}
            </button>
          </div>
          <div className="p-5 font-mono text-xs text-gray-400 leading-relaxed">
            <span className="text-gray-600">{'<'}script </span><span className="text-blue-400">src</span>=<span className="text-green-400">&quot;https://waitlistkit.de/embed.js&quot;</span><span className="text-gray-600">{'><'}/script{'>'}</span><br />
            <span className="text-gray-600">{'<'}waitlist-widget </span><br />
            <span className="text-gray-600 ml-4">  </span><span className="text-blue-400">project</span>=<span className="text-green-400">&quot;wk_dein-key&quot;</span><br />
            <span className="text-gray-600 ml-4">  </span><span className="text-blue-400">lang</span>=<span className="text-green-400">&quot;de&quot;</span><br />
            <span className="text-gray-600 ml-4">  </span><span className="text-blue-400">referral</span>=<span className="text-green-400">&quot;true&quot;</span><br />
            <span className="text-gray-600">{'>'}<br />{'<'}/waitlist-widget{'>'}</span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">// Top Referrer</span>
          </div>
          <div className="divide-y divide-gray-800">
            {mockSignups.map((s, i) => (
              <div key={s.id} className="px-5 py-3 flex items-center gap-4">
                <div className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="flex-1 font-mono text-sm text-gray-300">{s.email}</div>
                <div className="text-gray-500 text-xs">{s.source}</div>
                <div className="text-right">
                  {s.referrals > 0 && (
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-0.5 rounded-full">+{s.referrals} Refs</span>
                  )}
                </div>
                <div className="text-gray-600 text-xs w-20 text-right">{s.joinedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
