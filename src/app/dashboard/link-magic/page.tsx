"use client";

import { useState } from "react";
import { Link2, Sparkles, Instagram, Globe, Copy, Download } from "lucide-react";

export default function LinkMagicPage() {
  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<{platform:string;hook:string;cta:string;copy:string}[]>([]);

  const generate = () => {
    if (!url.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setResults([
        { platform: "Instagram", hook: "Dieses Tool veraendert alles.", cta: "Link in Bio", copy: "Dein Content verdient Schutz. CreatorSeal macht es moeglich - kostenlos starten!" },
        { platform: "TikTok", hook: "POV: Du schuetzt deinen Content", cta: "Jetzt testen", copy: "98% Deepfake-Erkennung. Blockchain-Timestamp. Trust Score. Alles in einer App." },
        { platform: "LinkedIn", hook: "Content-Schutz wird Pflicht", cta: "Mehr erfahren", copy: "Ab August 2026 schreibt die EU C2PA vor. CreatorSeal ist schon heute ready." },
      ]);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Link2 size={16} className="text-yellow-400" /></div>
        <div>
          <h1 className="text-white text-sm font-semibold">RealSync Link-Magic</h1>
          <p className="text-zinc-600 text-xs font-mono">KI Ad Generation · DACH-First · by RealSync Apps</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <label className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2 block">Produkt-URL eingeben</label>
          <div className="flex gap-3">
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://realsyncdynamics.de" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none focus:border-zinc-600" />
            <button onClick={generate} disabled={generating} className="px-6 py-3 bg-white text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-50 flex items-center gap-2">
              <Sparkles size={14} />{generating ? "Generiert..." : "Ads generieren"}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs text-zinc-600 font-mono uppercase tracking-wider">Generierte Ads</h2>
            {results.map((r, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-yellow-600">{r.platform}</span>
                    <span className="text-[10px] text-zinc-700">Auto-generiert</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-zinc-600 hover:text-zinc-400"><Copy size={12} /></button>
                    <button className="text-zinc-600 hover:text-zinc-400"><Download size={12} /></button>
                  </div>
                </div>
                <div className="text-white text-sm font-medium mb-1">{r.hook}</div>
                <p className="text-zinc-400 text-sm mb-2">{r.copy}</p>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{r.cta}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
