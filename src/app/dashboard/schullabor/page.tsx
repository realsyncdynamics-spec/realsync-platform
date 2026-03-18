"use client";

import { useState } from "react";
import { FlaskConical, Atom, Flame, Leaf, Play, RotateCcw } from "lucide-react";

const LABS = [
  { id: "pendel", name: "Pendel-Simulation", subject: "Physik", icon: Atom, color: "#3B82F6", desc: "Schwingungsdauer, Laenge, Gravitation" },
  { id: "titration", name: "Saeure-Base Titration", subject: "Chemie", icon: Flame, color: "#EF4444", desc: "pH-Wert, Indikator, Aequivalenzpunkt" },
  { id: "photosynthese", name: "Photosynthese", subject: "Biologie", icon: Leaf, color: "#22C55E", desc: "Lichtreaktion, CO2-Fixierung, Glucose" },
  { id: "optik", name: "Lichtbrechung", subject: "Physik", icon: Atom, color: "#3B82F6", desc: "Snellius, Brechungsindex, Totalreflexion" },
  { id: "elektro", name: "Elektrische Schaltungen", subject: "Physik", icon: Atom, color: "#3B82F6", desc: "Reihen- und Parallelschaltung, Ohm" },
  { id: "zelle", name: "Zellbiologie", subject: "Biologie", icon: Leaf, color: "#22C55E", desc: "Mitose, Organellen, Membrantransport" },
];

export default function SchulLaborPage() {
  const [active, setActive] = useState<string|null>(null);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? LABS : LABS.filter(l => l.subject === filter);

  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><FlaskConical size={16} className="text-yellow-400" /></div>
          <div>
            <h1 className="text-white text-sm font-semibold">RealSync SchulLabor</h1>
            <p className="text-zinc-600 text-xs font-mono">MINT-Simulationen · DACH · by RealSync Apps</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-yellow-600 border border-yellow-900 px-2 py-0.5 rounded-full">BETA</span>
      </div>

      <div className="px-6 py-2 border-b border-zinc-800 flex gap-3">
        {["all","Physik","Chemie","Biologie"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1 rounded-md transition ${
            filter === f ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
          }`}>{f === "all" ? "Alle Faecher" : f}</button>
        ))}
      </div>

      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(lab => (
          <div key={lab.id} className={`bg-zinc-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-zinc-600 ${
            active === lab.id ? "border-yellow-800" : "border-zinc-800"
          }`} onClick={() => setActive(lab.id)}>
            <div className="flex items-center gap-2 mb-2">
              <lab.icon size={14} style={{color: lab.color}} />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800" style={{color: lab.color}}>{lab.subject}</span>
            </div>
            <h3 className="text-white text-sm font-medium mb-1">{lab.name}</h3>
            <p className="text-zinc-600 text-xs mb-3">{lab.desc}</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md hover:bg-zinc-700 transition"><Play size={11} />Starten</button>
              <button className="flex items-center gap-1 text-xs text-zinc-600 px-3 py-1.5 rounded-md hover:text-zinc-400 transition"><RotateCcw size={11} />Reset</button>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="mx-6 mb-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="h-64 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center">
            <div className="text-center">
              <FlaskConical size={32} className="text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-600 text-sm">Canvas-Simulation: {LABS.find(l=>l.id===active)?.name}</p>
              <p className="text-zinc-700 text-xs mt-1">Interaktive Simulation wird geladen...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
