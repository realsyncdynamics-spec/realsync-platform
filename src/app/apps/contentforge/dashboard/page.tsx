'use client';
import { useState } from 'react';
import Link from 'next/link';

const TEMPLATES = [
  {id:'youtube-script',  label:'YouTube Script',    icon:'🎬', platform:'YouTube'},
  {id:'tiktok-hook',     label:'TikTok Hook',        icon:'⚡', platform:'TikTok'},
  {id:'instagram-caption',label:'Instagram Caption', icon:'📸', platform:'Instagram'},
  {id:'blog-post',       label:'Blog Artikel',       icon:'✍️', platform:'Blog'},
  {id:'email-newsletter',label:'E-Mail Newsletter',  icon:'📧', platform:'E-Mail'},
  {id:'seo-title',       label:'SEO Meta Titel',     icon:'🔍', platform:'SEO'},
];
const EXAMPLES: Record<string,string> = {
  'youtube-script': `🎬 HOOK (0-3 Sek.):\n"Die meisten Creator machen diesen Fehler — ich zeige dir heute warum."\n\n📖 INTRO (3-15 Sek.):\n"Was wäre wenn du in nur 7 Tagen deinen Content auf das nächste Level bringst? Genau das haben 3.000 Creator mit RealSync gemacht."\n\n📌 HAUPTTEIL:\n[Punkt 1] Das Problem\n[Punkt 2] Die Lösung  \n[Punkt 3] Das Ergebnis\n\n🎯 CTA:\n"Link in der Beschreibung — kostenlos starten!"`,
  'tiktok-hook': `⚡ HOOK:\n"POV: Du bist Creator und weißt nicht dass dein Content geklaut wird"\n\n🎵 TEXT:\n3 Zeichen dass dein Content ungeschützt ist:\n1. Kein QR-Code\n2. Kein Blockchain-Timestamp\n3. Kein Creator Badge\n\nRealSync schützt alles automatisch ✓\n\n#Creator #ContentCreator #RealSync`,
  'instagram-caption': `📸 CAPTION:\n\nKein Creator sollte 2026 noch ungeschützt sein. 🛡️\n\nMit @RealSyncDynamics verifizierst du deinen Content in Sekunden:\n✓ C2PA 2.3 Standard\n✓ Blockchain Zeitstempel\n✓ Deepfake-Erkennung\n\nKostenlos starten → Link in Bio\n\n#ContentCreator #CreatorEconomy #DigitalRights`,
};

export default function ContentForgeDashboard() {
  const [selected, setSelected] = useState('youtube-script');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [generating, setGenerating] = useState(false);

  function generate() {
    if(!topic.trim()) return;
    setGenerating(true);
    setTimeout(()=>{
      const base = EXAMPLES[selected] || `✍️ Content für: "${topic}"\n\nHier erscheint dein KI-generierter Content...`;
      setResult(base.replace(/Creator|RealSync/gi, m => topic || m));
      setGenerating(false);
    },1500);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-purple-900/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{background:'rgba(168,85,247,.04)'}}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-gray-500 text-sm">← Hub</Link>
          <span className="text-gray-700">|</span>
          <span className="font-black text-lg text-purple-400">✍️ ContentForge</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono border bg-purple-500/10 text-purple-400 border-purple-500/30">KI-Generator</span>
        </div>
        <Link href="/pricing" className="text-xs font-bold px-3 py-1.5 rounded-full text-white bg-purple-500">Upgrade</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5">
        {[{v:'6',l:'Content-Typen',c:'#A855F7'},{v:'15s',l:'Ø Generierungszeit',c:'#00D4FF'},{v:'GPT-4',l:'KI Modell',c:'#10B981'}].map(s=>(
          <div key={s.l} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-black" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-gray-500 mt-1 font-mono">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-8 grid md:grid-cols-2 gap-4">
        {/* Left: Input */}
        <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-5">
          <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-4">// KI Content Generator</div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {TEMPLATES.map(t=>(
              <button key={t.id} onClick={()=>setSelected(t.id)}
                className="flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all"
                style={selected===t.id?{borderColor:'#A855F7',background:'rgba(168,85,247,.12)'}:{borderColor:'#374151',background:'#111827'}}>
                <span className="text-base">{t.icon}</span>
                <div>
                  <div className="text-xs font-bold" style={{color:selected===t.id?'#A855F7':'#9CA3AF'}}>{t.label}</div>
                  <div className="text-xs text-gray-600 font-mono">{t.platform}</div>
                </div>
              </button>
            ))}
          </div>

          <input value={topic} onChange={e=>setTopic(e.target.value)}
            placeholder="Thema eingeben (z.B. 'Content-Schutz für Creator')"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 mb-3"/>

          <button onClick={generate} disabled={generating||!topic.trim()}
            className="w-full py-2.5 font-black text-sm rounded-lg text-white transition-all disabled:opacity-40"
            style={{background:'linear-gradient(135deg,#A855F7,#7C3AED)'}}>
            {generating?'⟳ Generiere...':'🤖 Content generieren'}
          </button>
        </div>

        {/* Right: Output */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">// Output</div>
            {result && (
              <button onClick={()=>navigator.clipboard?.writeText(result)}
                className="text-xs px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400">
                📋 Kopieren
              </button>
            )}
          </div>
          {result ? (
            <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">{result}</pre>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm font-mono">
              ← Template wählen + Thema eingeben
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
