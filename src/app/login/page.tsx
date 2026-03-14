"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-xl mb-4">
            <ShieldCheck size={28} className="text-zinc-950" />
          </div>
          <h1 className="text-3xl font-black text-yellow-300 tracking-tight">RealSync</h1>
          <p className="text-yellow-600 text-sm font-mono mt-1 tracking-widest uppercase">Creator Verification</p>
          <p className="text-zinc-500 text-xs mt-3 max-w-xs mx-auto">
            Verifiziere deine Inhalte. Automatisiere dein Social Media. Alles in einer Plattform.
          </p>
        </div>

        {/* Card */}
        <div className="border border-yellow-900/50 bg-zinc-900 rounded-xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="text-yellow-400 mx-auto mb-3" />
              <h2 className="text-yellow-300 font-semibold text-lg">Magic Link gesendet!</h2>
              <p className="text-zinc-400 text-sm mt-2">
                Prüfe deine E-Mails und klicke auf den Link, um dich anzumelden.
              </p>
              <p className="text-zinc-600 text-xs mt-4 font-mono">{email}</p>
            </div>
          ) : (
            <>
              <h2 className="text-yellow-300 font-semibold mb-1">Anmelden</h2>
              <p className="text-zinc-500 text-xs mb-6">Kein Passwort nötig — wir senden dir einen Magic Link.</p>
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
                {error && (
                  <p className="text-red-400 text-xs border border-red-900/50 bg-red-950/30 rounded px-3 py-2">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-zinc-950 font-bold py-2.5 rounded transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {loading ? "Sende Link..." : "Magic Link senden"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Creator Verif.", desc: "C2PA Standard" },
            { label: "Auto-Posting", desc: "Alle Plattformen" },
            { label: "Analytics", desc: "Echtzeit Daten" },
          ].map(({ label, desc }) => (
            <div key={label} className="border border-yellow-900/30 bg-zinc-900/50 rounded-lg p-3">
              <div className="text-yellow-400 text-xs font-semibold">{label}</div>
              <div className="text-zinc-600 text-xs mt-0.5">{desc}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          &copy; 2026 RealSync — Creator Verification Platform
        </p>
      </div>
    </div>
  );
}
