'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: 'text-pink-400' },
  { id: 'facebook', label: 'Facebook', color: 'text-blue-400' },
  { id: 'twitter', label: 'Twitter / X', color: 'text-sky-400' },
  { id: 'tiktok', label: 'TikTok', color: 'text-zinc-200' },
  { id: 'youtube', label: 'YouTube', color: 'text-red-400' },
  { id: 'linkedin', label: 'LinkedIn', color: 'text-blue-500' },
];

export default function SocialAccountsPage() {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: 'instagram', username: '', access_token: '' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('social_accounts').select('*').order('created_at', { ascending: false });
    if (data) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    setConnecting(form.platform);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('social_accounts').insert({
      user_id: user.id,
      platform: form.platform,
      username: form.username,
      access_token: form.access_token,
      is_active: true,
    });
    if (!error) {
      setMsg('Konto erfolgreich verbunden!');
      setShowForm(false);
      setForm({ platform: 'instagram', username: '', access_token: '' });
      load();
    }
    setConnecting(null);
  };

  const handleRemove = async (id: string) => {
    await supabase.from('social_accounts').delete().eq('id', id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-yellow-300">Social-Media-Konten</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
        >
          + Konto verbinden
        </button>
      </div>
      {msg && <div className="mb-4 p-3 bg-green-950 border border-green-800 text-green-400 rounded-lg text-sm">{msg}</div>}
      {showForm && (
        <div className="mb-6 p-4 bg-zinc-900 border border-yellow-900 rounded-xl space-y-4">
          <h2 className="text-sm font-semibold text-yellow-400">Neues Konto hinzufügen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500"
            >
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="@Benutzername"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
            />
            <input
              type="password"
              placeholder="Access Token"
              value={form.access_token}
              onChange={e => setForm({ ...form, access_token: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!form.username || !form.access_token || !!connecting}
            className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 disabled:opacity-50"
          >
            {connecting ? 'Verbinde...' : 'Verbinden'}
          </button>
        </div>
      )}
      {loading ? (
        <p className="text-zinc-500">Lade Konten...</p>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-700 rounded-xl">
          <p className="text-zinc-400 mb-2">Noch keine Konten verbunden</p>
          <p className="text-zinc-600 text-sm">Klicke auf «Konto verbinden» um zu starten</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(acc => (
            <div key={acc.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-yellow-900 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-400 capitalize">{acc.platform}</p>
                  <p className="text-zinc-100 font-semibold">@{acc.username}</p>
                  <p className="text-xs text-zinc-500 mt-1">{acc.is_active ? '• Aktiv' : '○ Inaktiv'}</p>
                </div>
                <button
                  onClick={() => handleRemove(acc.id)}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
