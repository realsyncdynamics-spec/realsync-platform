'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const supabase = createClient();
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('social_accounts').select('*').then(({ data }) => {
      if (data) setAccounts(data);
    });
  }, []);

  const togglePlatform = (id: string) => {
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSubmit = async (status: 'draft' | 'scheduled' | 'published') => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error: err } = await supabase.from('posts').insert({
        user_id: user.id,
        content,
        platform: platforms[0] || 'instagram',
        status,
        scheduled_at: scheduledAt || null,
      });
      if (err) throw err;
      if (status === 'published' && platforms.length > 0) {
        await fetch('/api/posts/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, accountIds: platforms }),
        });
      }
      router.push('/dashboard/posts');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-yellow-300 mb-6">Neuen Post erstellen</h1>
      {error && <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-yellow-400 mb-2">Inhalt</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            placeholder="Was möchtest du posten?"
            className="w-full bg-zinc-900 border border-yellow-900 rounded-lg p-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 resize-none"
          />
          <p className="text-xs text-zinc-500 mt-1">{content.length} / 2200 Zeichen</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-yellow-400 mb-2">Plattformen</label>
          {accounts.length === 0 ? (
            <p className="text-zinc-500 text-sm">Keine Social-Media-Konten verbunden. <a href="/dashboard/social-accounts" className="text-yellow-400 underline">Jetzt verbinden</a></p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => togglePlatform(acc.id)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    platforms.includes(acc.id)
                      ? 'border-yellow-500 bg-yellow-950 text-yellow-300'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-yellow-700'
                  }`}
                >
                  {acc.platform} · @{acc.username}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-yellow-400 mb-2">Zeitplan (optional)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            className="bg-zinc-900 border border-yellow-900 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading || !content}
            className="px-4 py-2 border border-zinc-700 rounded-lg text-zinc-400 hover:border-yellow-700 hover:text-yellow-400 text-sm transition-colors disabled:opacity-50"
          >
            Als Entwurf speichern
          </button>
          <button
            onClick={() => handleSubmit('scheduled')}
            disabled={loading || !content || !scheduledAt}
            className="px-4 py-2 border border-yellow-700 rounded-lg text-yellow-300 hover:bg-yellow-950 text-sm transition-colors disabled:opacity-50"
          >
            Planen
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading || !content}
            className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'Wird gepostet...' : 'Jetzt posten'}
          </button>
        </div>
      </div>
    </div>
  );
}
