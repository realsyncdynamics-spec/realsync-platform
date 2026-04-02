'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setEmail(user.email || '');
        setName(user.user_metadata?.full_name || '');
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- supabase client is stable

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (!error) setMsg('Einstellungen gespeichert.');
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-yellow-300 mb-6">Einstellungen</h1>
      {msg && <div className="mb-4 p-3 bg-green-950 border border-green-800 text-green-400 rounded-lg text-sm">{msg}</div>}
      <div className="space-y-6">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <h2 className="text-sm font-semibold text-yellow-400">Profil</h2>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-500 text-sm cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 disabled:opacity-50"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h2 className="text-sm font-semibold text-yellow-400 mb-3">Konto</h2>
          <p className="text-xs text-zinc-500 mb-3">User-ID: {user?.id}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-red-800 text-red-400 rounded-lg text-sm hover:bg-red-950 transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
}
