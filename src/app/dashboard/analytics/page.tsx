'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({ total: 0, published: 0, scheduled: 0, draft: 0, failed: 0 });
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [postsRes, analyticsRes] = await Promise.all([
        supabase.from('posts').select('status'),
        supabase.from('post_analytics').select('*, posts(content, platform)').order('created_at', { ascending: false }).limit(20),
      ]);
      if (postsRes.data) {
        const d = postsRes.data;
        setStats({
          total: d.length,
          published: d.filter(p => p.status === 'published').length,
          scheduled: d.filter(p => p.status === 'scheduled').length,
          draft: d.filter(p => p.status === 'draft').length,
          failed: d.filter(p => p.status === 'failed').length,
        });
      }
      if (analyticsRes.data) setAnalytics(analyticsRes.data);
      setLoading(false);
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- supabase client is stable

  const cards = [
    { label: 'Gesamt Posts', value: stats.total, color: 'text-yellow-300' },
    { label: 'Veröffentlicht', value: stats.published, color: 'text-green-400' },
    { label: 'Geplant', value: stats.scheduled, color: 'text-blue-400' },
    { label: 'Entwurf', value: stats.draft, color: 'text-zinc-400' },
    { label: 'Fehlgeschlagen', value: stats.failed, color: 'text-red-400' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-300 mb-6">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-xs text-zinc-500 mb-1">{c.label}</p>
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-yellow-400 mb-4">Post-Performance</h2>
      {loading ? (
        <p className="text-zinc-500">Lade Analytics...</p>
      ) : analytics.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-700 rounded-xl">
          <p className="text-zinc-400">Noch keine Analytics-Daten vorhanden</p>
          <p className="text-zinc-600 text-sm mt-1">Erstelle und veröffentliche Posts um Analytics zu sehen</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 px-3 text-zinc-500 font-medium">Plattform</th>
                <th className="text-left py-2 px-3 text-zinc-500 font-medium">Inhalt</th>
                <th className="text-right py-2 px-3 text-zinc-500 font-medium">Impressionen</th>
                <th className="text-right py-2 px-3 text-zinc-500 font-medium">Likes</th>
                <th className="text-right py-2 px-3 text-zinc-500 font-medium">Kommentare</th>
                <th className="text-right py-2 px-3 text-zinc-500 font-medium">Shares</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map(a => (
                <tr key={a.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="py-2 px-3 text-yellow-400 capitalize">{a.posts?.platform}</td>
                  <td className="py-2 px-3 text-zinc-300 max-w-xs truncate">{a.posts?.content}</td>
                  <td className="py-2 px-3 text-right text-zinc-300">{a.impressions ?? 0}</td>
                  <td className="py-2 px-3 text-right text-zinc-300">{a.likes ?? 0}</td>
                  <td className="py-2 px-3 text-right text-zinc-300">{a.comments ?? 0}</td>
                  <td className="py-2 px-3 text-right text-zinc-300">{a.shares ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
