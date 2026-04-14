'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [niche, setNiche] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email || '');
      // Fetch profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name,username,bio,niche,website')
        .eq('id', user.id)
        .single();
      if (profile) {
        setFullName(profile.full_name || user.user_metadata?.full_name || '');
        setUsername(profile.username || '');
        setBio(profile.bio || '');
        setNiche(profile.niche || '');
        setWebsite(profile.website || '');
      } else {
        setFullName(user.user_metadata?.full_name || '');
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- supabase client is stable

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    setError('');
    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (authError) throw authError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, bio, niche, website })
        .eq('id', userId);
      if (profileError) throw profileError;

      setMsg('Einstellungen gespeichert.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-yellow-300 mb-6">Einstellungen</h1>

      {msg && <div className="mb-4 p-3 bg-green-950 border border-green-800 text-green-400 rounded-lg text-sm">{msg}</div>}
      {error && <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>}

      <div className="space-y-6">
        {/* Profile section */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
          <h2 className="text-sm font-semibold text-yellow-400">Profil</h2>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Benutzername</label>
            <input
              type="text"
              value={username}
              disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-500 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-zinc-600 mt-1">Benutzername kann derzeit nicht geändert werden</p>
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

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Nische / Kategorie</label>
            <input
              type="text"
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="z.B. Tech, Fitness, Food, Gaming…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Kurze Beschreibung für dein Creator-Profil…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500 text-sm resize-none"
            />
            <p className="text-xs text-zinc-600 mt-1">{bio.length}/280</p>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://deine-website.de"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 disabled:opacity-50"
          >
            {saving ? 'Speichern…' : 'Speichern'}
          </button>
        </div>

        {/* Account section */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
          <h2 className="text-sm font-semibold text-yellow-400">Konto</h2>
          <p className="text-xs text-zinc-500">User-ID: {userId || '—'}</p>
          <div className="flex gap-3">
            <a
              href="/forgot-password"
              className="px-4 py-2 border border-zinc-700 text-zinc-400 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
            >
              Passwort ändern
            </a>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-red-800 text-red-400 rounded-lg text-sm hover:bg-red-950 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
