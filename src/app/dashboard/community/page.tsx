"use client";

import { useState } from "react";
import { MessageSquare, Users, Shield, Send, Heart, Share2 } from "lucide-react";

const DEMO_POSTS = [
  { id: 1, user: "@creator_max", verified: true, score: 92, content: "Gerade mein erstes Video mit CreatorSeal verifiziert! Trust Score 92 - stark!", likes: 24, time: "vor 2h" },
  { id: 2, user: "@foto_anna", verified: true, score: 88, content: "Hat jemand Erfahrung mit C2PA Manifesten fuer Fotografie? Suche Tipps.", likes: 15, time: "vor 4h" },
  { id: 3, user: "@technik_paul", verified: false, score: 0, content: "Neuer Artikel ueber Deepfake-Erkennung im Journalismus. Link in Bio.", likes: 8, time: "vor 6h" },
  { id: 4, user: "@musik_lisa", verified: true, score: 95, content: "Trust Score 95 erreicht! Blockchain-Timestamp fuer alle meine Tracks.", likes: 42, time: "vor 8h" },
];

export default function CommunityPage() {
  const [tab, setTab] = useState<"feed"|"groups"|"marketplace">("feed");

  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><MessageSquare size={16} className="text-yellow-400" /></div>
          <div>
            <h1 className="text-white text-sm font-semibold">RealSync Community</h1>
            <p className="text-zinc-600 text-xs font-mono">Creator-Netzwerk · DSGVO · E2E · by RealSync Apps</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Users size={12} className="text-zinc-600" />
          <span className="text-zinc-500 font-mono">1.247 Mitglieder</span>
        </div>
      </div>

      <div className="px-6 py-2 border-b border-zinc-800 flex gap-4">
        {(["feed","groups","marketplace"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`text-xs pb-2 transition-all border-b-2 ${
            tab === t ? "border-white text-white" : "border-transparent text-zinc-600 hover:text-zinc-400"
          }`}>{t === "feed" ? "Feed" : t === "groups" ? "Gruppen" : "Marketplace"}</button>
        ))}
      </div>

      <div className="px-6 py-4 space-y-3">
        {DEMO_POSTS.map(p => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-mono">{p.user[1].toUpperCase()}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-medium">{p.user}</span>
                  {p.verified && <Shield size={10} className="text-yellow-400" />}
                  {p.score > 0 && <span className="text-[10px] font-mono text-yellow-600">TS {p.score}</span>}
                </div>
                <span className="text-zinc-600 text-[10px]">{p.time}</span>
              </div>
            </div>
            <p className="text-zinc-300 text-sm mb-3">{p.content}</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-zinc-600 hover:text-red-400 text-xs"><Heart size={12} />{p.likes}</button>
              <button className="flex items-center gap-1 text-zinc-600 hover:text-zinc-400 text-xs"><MessageSquare size={12} />Reply</button>
              <button className="flex items-center gap-1 text-zinc-600 hover:text-zinc-400 text-xs"><Share2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
