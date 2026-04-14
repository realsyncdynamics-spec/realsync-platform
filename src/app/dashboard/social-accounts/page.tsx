'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
];

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [form, setForm] = useState({ platform: 'instagram', username: '' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // load is at component level so handleAdd/handleRemove can call it
  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('social_accounts')
      .select('id,platform,username,is_active,created_at')
      .order('created_at', { ascending: false });
    if (data) setAccounts(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.username.trim()) { setError('Benutzername erforderlich'); return; }
    setConnecting(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Nicht angemeldet'); setConnecting(false); return; }
    const { error: dbError } = await supabase.from('social_accounts').insert({
      user_id: user.id,
      platform: form.platform,
      username: form.username.replace(/^@/, ''), // strip leading @
      is_active: true,
    });
    if (dbError) {
      setError('Fehler: ' + dbError.message);
    } else {
      setMsg('Konto hinzugefügt. OAuth-Verbindung folgt nach Plattform-Integration.');
      setShowForm(false);
      setForm({ platform: 'instagram', username: '' });
      await load();
    }
    setConnecting(false);
  };

  const handleRemove = async (id: string) => {
    const supabase = createClient();
    await supabase.from('social_accounts').delete().eq('id', id);
    await load();
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-yellow-300">Social-Media-Konten</h1>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
        >
          + Konto hinzufügen
        </button>
      </div>

      {/* OAuth notice */}
      <div className="mb-6 p-3 bg-blue-950/40 border border-blue-800/40 rounded-lg">
        <p className="text-xs text-blue-300">
          ⓘ OAuth-Integration (Instagram, YouTube, TikTok, etc.) ist in Entwicklung.
          Du kannst deinen Benutzernamen bereits hinterlegen — die Plattformverbindung wird automatisch aktualisiert sobald OAuth aktiv ist.
        </p>
      </div>

      {msg && <div className="mb-4 p-3 bg-green-950 border border-green-800 text-green-400 rounded-lg text-sm">{msg}</div>}
      {error && <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>}

      {showForm && (
        <div className="mb-6 p-4 bg-zinc-900 border border-yellow-900/50 rounded-xl space-y-3">
          <h2 className="text-sm font-semibold text-yellow-400">Konto hinzufügen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500 text-sm"
            >
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="@benutzername"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
          <p className="text-xs text-zinc-600">
            Kein API-Schlüssel oder Token nötig — nur Benutzername. OAuth folgt.
          </p>
          <button
            onClick={handleAdd}
            disabled={!form.username.trim() || connecting}
            className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 disabled:opacity-50 transition-colors"
          >
            {connecting ? 'Speichern…' : 'Hinzufügen'}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-500 text-sm">Lädt…</p>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-700 rounded-xl">
          <p className="text-zinc-400 mb-1">Noch keine Konten hinterlegt</p>
          <p className="text-zinc-600 text-sm">Klicke auf &ldquo;Konto hinzufügen&rdquo; um zu starten</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map(acc => (
            <div key={acc.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-yellow-900/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">{acc.platform}</p>
                  <p className="text-zinc-100 font-semibold">@{acc.username}</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {acc.is_active ? '● Aktiv (OAuth ausstehend)' : '○ Inaktiv'}
                  </p>
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
