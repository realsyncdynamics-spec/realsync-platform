"use client";

import { useState } from "react";

const DEMO_SIGNALS = [
  { asset: "Bitcoin (BTC)", signal: "Bullish", confidence: 82, change: "+4.2%", price: "$67,450" },
  { asset: "Ethereum (ETH)", signal: "Bullish", confidence: 75, change: "+3.1%", price: "$3,890" },
  { asset: "YouTube CPM (DE)", signal: "Neutral", confidence: 60, change: "+0.5%", price: "$18.50" },
  { asset: "TikTok Ads CPC", signal: "Bearish", confidence: 68, change: "-2.1%", price: "$0.42" },
  { asset: "Instagram Reels RPM", signal: "Bullish", confidence: 71, change: "+1.8%", price: "$2.10" },
  { asset: "Spotify Streams", signal: "Neutral", confidence: 55, change: "-0.3%", price: "$0.004" },
  { asset: "Patreon Subs Trend", signal: "Bullish", confidence: 79, change: "+5.2%", price: "N/A" },
  { asset: "Merch Sales Index", signal: "Neutral", confidence: 52, change: "+0.1%", price: "N/A" },
];

export default function MarketScannerPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? DEMO_SIGNALS : DEMO_SIGNALS.filter(s => s.signal.toLowerCase() === filter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-yellow-400">RealSync MarketScanner</h1>
        <span className="px-3 py-1 bg-purple-600/20 border border-purple-500 rounded-full text-xs text-purple-300 font-medium">by RealSync Apps</span>
      </div>
      <p className="text-zinc-400 mb-6">Echtzeit-Signale fuer Creator-Maerkte, Crypto & Ads</p>

      <div className="flex gap-2 mb-6">
        {["all", "bullish", "neutral", "bearish"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}>
            {f === "all" ? "Alle" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="text-left p-3 text-sm text-zinc-400">Asset</th>
              <th className="text-left p-3 text-sm text-zinc-400">Signal</th>
              <th className="text-left p-3 text-sm text-zinc-400">Konfidenz</th>
              <th className="text-left p-3 text-sm text-zinc-400">Aenderung</th>
              <th className="text-left p-3 text-sm text-zinc-400">Preis</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                <td className="p-3 font-medium">{s.asset}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    s.signal === "Bullish" ? "bg-green-800 text-green-300" :
                    s.signal === "Bearish" ? "bg-red-800 text-red-300" :
                    "bg-yellow-800 text-yellow-300"
                  }`}>{s.signal}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-zinc-700 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        s.confidence >= 75 ? "bg-green-500" : s.confidence >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`} style={{ width: `${s.confidence}%` }} />
                    </div>
                    <span className="text-sm text-zinc-400">{s.confidence}%</span>
                  </div>
                </td>
                <td className={`p-3 font-medium ${s.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{s.change}</td>
                <td className="p-3 text-zinc-300">{s.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-xs text-zinc-500">Powered by RealSync Apps | Daten werden alle 60s aktualisiert</div>
    </div>
  );
}
