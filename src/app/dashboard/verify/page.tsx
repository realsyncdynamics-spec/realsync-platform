'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VerifyPage() {
  const supabase = createClient();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verifizierung fehlgeschlagen');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-yellow-300 mb-2">Creator Verifizierung</h1>
      <p className="text-zinc-400 text-sm mb-8">Verifiziere deine Identität als Content Creator und erhalte den RealSync Verified Badge.</p>
      <div className="space-y-6">
        <div className="p-4 bg-zinc-900 border border-yellow-900 rounded-xl">
          <h2 className="text-sm font-semibold text-yellow-400 mb-3">Social Media Profil verifizieren</h2>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://instagram.com/deinprofil"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 text-sm"
            />
            <button
              onClick={handleVerify}
              disabled={loading || !url}
              className="px-4 py-2 bg-yellow-400 text-zinc-950 rounded-lg font-semibold text-sm hover:bg-yellow-300 disabled:opacity-50"
            >
              {loading ? 'Prüfe...' : 'Verifizieren'}
            </button>
          </div>
        </div>
        {error && (
          <div className="p-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm">{error}</div>
        )}
        {result && (
          <div className="p-4 bg-zinc-900 border border-green-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400 text-lg">✓</span>
              <span className="text-green-400 font-semibold">Verifiziert</span>
            </div>
            <div className="space-y-2 text-sm">
              {result.platform && <p className="text-zinc-300"><span className="text-zinc-500">Plattform:</span> <span className="capitalize">{result.platform}</span></p>}
              {result.username && <p className="text-zinc-300"><span className="text-zinc-500">Benutzername:</span> @{result.username}</p>}
              {result.followers && <p className="text-zinc-300"><span className="text-zinc-500">Follower:</span> {result.followers.toLocaleString()}</p>}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Profil eingeben', desc: 'Füge deine Social-Media-URL ein' },
            { step: '2', title: 'Verifizierung', desc: 'Wir prüfen dein Konto automatisch' },
            { step: '3', title: 'Badge erhalten', desc: 'Zeige deinen Verified-Status' },
          ].map(s => (
            <div key={s.step} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="w-7 h-7 rounded-full border border-yellow-700 text-yellow-400 text-xs font-bold flex items-center justify-center mb-2">{s.step}</div>
              <p className="text-sm font-medium text-zinc-200">{s.title}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
