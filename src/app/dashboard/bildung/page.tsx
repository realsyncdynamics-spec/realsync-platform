"use client";
import { BookOpen, GraduationCap, FileText, Users, Clock } from "lucide-react";
const MODULES = [
  { id: 1, name: "Physik Grundlagen", grade: "7-8", lessons: 12, status: "live", progress: 100 },
  { id: 2, name: "Chemie: Atombau", grade: "9-10", lessons: 8, status: "live", progress: 85 },
  { id: 3, name: "Biologie: Genetik", grade: "10-12", lessons: 15, status: "beta", progress: 60 },
  { id: 4, name: "Mathematik: Analysis", grade: "11-12", lessons: 20, status: "coming", progress: 30 },
  { id: 5, name: "Informatik: Python", grade: "8-10", lessons: 10, status: "live", progress: 90 },
  { id: 6, name: "Medienkompetenz", grade: "5-12", lessons: 6, status: "beta", progress: 70 },
];
export default function BildungPage() {
  return (
    <div className="flex-1 bg-[#0a0a0a] min-h-screen">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><BookOpen size={16} className="text-yellow-400" /></div>
        <div>
          <h1 className="text-white text-sm font-semibold">RealSync Bildung</h1>
          <p className="text-zinc-600 text-xs font-mono">Digitaler Schulraum · DACH · by RealSync Apps</p>
        </div>
      </div>
      <div className="px-6 py-4 grid grid-cols-3 gap-3 border-b border-zinc-800">
        {[{icon:GraduationCap,label:"Module",val:"6"},{icon:Users,label:"Schueler",val:"0"},{icon:Clock,label:"Stunden",val:"71"}].map((s,i)=>(
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <s.icon size={16} className="text-zinc-600 mx-auto mb-1" />
            <div className="text-white text-lg font-bold">{s.val}</div>
            <div className="text-zinc-600 text-[10px] font-mono">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 space-y-3">
        {MODULES.map(m=>(
          <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={14} className="text-zinc-600" />
              <div>
                <div className="text-white text-sm">{m.name}</div>
                <div className="text-zinc-600 text-[10px] font-mono">Klasse {m.grade} · {m.lessons} Lektionen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-1.5 bg-zinc-800 rounded-full"><div className="h-full bg-yellow-600 rounded-full" style={{width:`${m.progress}%`}} /></div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${m.status==="live"?"text-green-500 border-green-900":m.status==="beta"?"text-yellow-500 border-yellow-900":"text-zinc-600 border-zinc-800"}`}>{m.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
