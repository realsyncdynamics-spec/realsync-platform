'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login fehlgeschlagen');
        return;
      }

      router.push(redirect);
    } catch {
      setError('Netzwerk-Fehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-yellow-900/50 bg-zinc-900 rounded-xl p-8">
      {registered && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          Registrierung erfolgreich! Bitte melde dich jetzt an.
        </div>
      )}

      <h2 className="text-yellow-300 font-semibold mb-1">Anmelden</h2>
      <p className="text-zinc-500 text-xs mb-6">Melde dich mit deiner E-Mail und Passwort an.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs text-yellow-600 font-mono uppercase tracking-widest mb-1.5">
            E-Mail Adresse
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="creator@example.com"
            className="w-full bg-zinc-800 border border-yellow-900/50 rounded px-4 py-2.5 text-yellow-50 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-yellow-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-yellow-600 font-mono uppercase tracking-widest mb-1.5">
            Passwort
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dein Passwort"
            className="w-full bg-zinc-800 border border-yellow-900/50 rounded px-4 py-2.5 text-yellow-50 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-yellow-600 transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs border border-red-900/50 bg-red-950/30 rounded px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-zinc-950 font-bold py-2.5 rounded transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Anmelden...' : 'Jetzt anmelden'}
        </button>
      </form>

      <p className="text-center text-zinc-500 text-xs mt-6">
        Noch kein Konto?{' '}
        <Link href="/register" className="text-yellow-400 hover:underline">
          Kostenlos registrieren
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-950"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <h1 className="text-3xl font-black text-yellow-300 tracking-tight">RealSync</h1>
          <p className="text-yellow-600 text-sm font-mono mt-1 tracking-widest uppercase">Creator Verification</p>
          <p className="text-zinc-500 text-xs mt-3 max-w-xs mx-auto">
            Verifiziere deine Inhalte. Automatisiere dein Social Media. Alles in einer Plattform.
          </p>
        </div>

        <Suspense fallback={<div className="border border-yellow-900/50 bg-zinc-900 rounded-xl p-8 text-center text-zinc-500">Laden...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Creator Verif.', desc: 'C2PA Standard' },
            { label: 'Auto-Posting', desc: 'Alle Plattformen' },
            { label: 'Analytics', desc: 'Echtzeit Daten' },
          ].map(({ label, desc }) => (
            <div key={label} className="border border-yellow-900/30 bg-zinc-900/50 rounded-lg p-3">
              <div className="text-yellow-400 text-xs font-semibold">{label}</div>
              <div className="text-zinc-600 text-xs mt-0.5">{desc}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          &copy; 2026 RealSync - Creator Verification Platform
        </p>
      </div>
    </div>
  );
}
