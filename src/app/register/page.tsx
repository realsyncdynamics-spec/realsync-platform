'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwoerter stimmen nicht ueberein');
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registrierung fehlgeschlagen');
        return;
      }

      router.push('/login?registered=true');
    } catch {
      setError('Netzwerk-Fehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">RealSync Creator OS</h1>
          <p className="text-zinc-400 mt-2">Erstelle dein kostenloses Konto</p>
          <p className="text-green-400 text-sm mt-1">Free-Paket fuer immer kostenlos</p>
        </div>

        <form onSubmit={handleRegister} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              placeholder="Dein Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              placeholder="deine@email.de"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              placeholder="Min. 6 Zeichen"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">Passwort bestaetigen</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              placeholder="Passwort wiederholen"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? 'Registriere...' : 'Kostenlos registrieren'}
          </button>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Bereits ein Konto?{' '}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Jetzt einloggen
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
