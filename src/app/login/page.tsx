"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center glow">
            <span className="text-black font-black text-xl">R</span>
          </div>
          <h1 className="text-2xl font-bold">RealSync Login</h1>
        </div>
        {sent ? (
          <p className="text-cyan-400 text-center py-8">Magic Link gesendet! Check deine E-Mail.</p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="E-Mail" required />
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
              {loading ? "..." : "Magic Link senden"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
