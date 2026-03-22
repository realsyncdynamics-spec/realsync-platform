'use client';
import { useState } from 'react';
import Link from 'next/link';

interface OptimusButtonProps {
  app: string;
  context?: string;
  suggestions?: string[];
}

export default function OptimusButton({ app, context, suggestions = [] }: OptimusButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [input, setInput] = useState('');

  const defaultSuggestions = suggestions.length ? suggestions : [
    `Analysiere meine ${app} Daten und gib mir 3 schnelle Verbesserungen`,
    `Was sind die besten Strategien für ${app} im DACH-Raum?`,
    `Erstelle einen Aktionsplan für ${app} diese Woche`,
  ];

  async function ask(prompt: string) {
    setLoading(true);
    setAnswer('');
    setInput(prompt);
    try {
      const res = await fetch('/api/optimus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, model: 'fast', appContext: app }),
      });
      const data = await res.json();
      setAnswer(data.response || data.error || '');
    } catch {
      setAnswer('⚠️ Fehler. Bitte erneut versuchen.');
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 90,
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 20,
          boxShadow: '0 4px 20px rgba(0,212,255,.4)',
          transition: 'transform .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="OPTIMUS KI-Assistent"
      >
        🤖
      </button>

      {/* Slide-in panel */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        }}>
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)' }}
            onClick={() => setOpen(false)} />

          {/* Panel */}
          <div style={{
            position: 'relative', width: 360, height: '80vh',
            background: '#080C14', borderLeft: '1px solid #1A2130',
            borderTop: '1px solid #1A2130', borderTopLeftRadius: 20,
            display: 'flex', flexDirection: 'column', zIndex: 1,
            fontFamily: "'Syne', sans-serif",
          }}>
            {/* Header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #1A2130', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#00D4FF,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: 'white' }}>OPTIMUS</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: '#00D4FF' }}>● {app}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href="/optimus" style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '3px 8px', background: 'rgba(0,212,255,.1)', border: '1px solid rgba(0,212,255,.25)', borderRadius: 6, color: '#00D4FF', textDecoration: 'none' }}>
                  Vollbild →
                </Link>
                <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>✕</button>
              </div>
            </div>

            {/* Suggestions */}
            {!answer && !loading && (
              <div style={{ padding: '14px 18px', flex: 1, overflow: 'auto' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.25)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                  // Schnell-Fragen für {app}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {defaultSuggestions.map((s, i) => (
                    <button key={i} onClick={() => ask(s)}
                      style={{ padding: '10px 12px', background: '#0B0F18', border: '1px solid #1A2130', borderRadius: 9, color: 'rgba(255,255,255,.65)', fontFamily: "'DM Mono',monospace", fontSize: 10, textAlign: 'left', cursor: 'pointer', lineHeight: 1.5, transition: 'border-color .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#374151')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2130')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4FF', animation: 'blink 1.2s ease infinite', animationDelay: `${i*0.3}s` }}/>)}
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.3)' }}>Perplexity analysiert…</div>
                <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
              </div>
            )}

            {/* Answer */}
            {answer && !loading && (
              <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,.25)', marginBottom: 10 }}>// {input.slice(0,50)}…</div>
                <div style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,.8)', whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: answer
                    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E4E6EF">$1</strong>')
                    .replace(/^▸ (.+)$/gm, '<div style="display:flex;gap:6px;margin:2px 0"><span style="color:#C9A84C">▸</span><span>$1</span></div>')
                    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:6px;margin:2px 0"><span style="color:#C9A84C">▸</span><span>$1</span></div>')
                    .replace(/\n/g, '<br/>')
                  }} />
                <button onClick={() => { setAnswer(''); setInput(''); }}
                  style={{ marginTop: 12, fontFamily: "'DM Mono',monospace", fontSize: 9, padding: '5px 12px', background: 'rgba(255,255,255,.05)', border: '1px solid #1A2130', borderRadius: 6, color: 'rgba(255,255,255,.35)', cursor: 'pointer', width: '100%' }}>
                  ← Neue Frage
                </button>
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid #1A2130' }}>
              <div style={{ display: 'flex', gap: 8, background: '#0B0F18', border: '1px solid #1A2130', borderRadius: 10, padding: '8px 12px' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && input.trim()) ask(input.trim()); }}
                  placeholder={`OPTIMUS für ${app} fragen…`}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'rgba(255,255,255,.8)', fontFamily: "'Syne',sans-serif", fontSize: 12, outline: 'none' }}
                />
                <button onClick={() => input.trim() && ask(input.trim())} disabled={loading || !input.trim()}
                  style={{ width: 28, height: 28, borderRadius: 7, background: input.trim() ? 'linear-gradient(135deg,#00D4FF,#0070F3)' : '#1A2130', border: 'none', cursor: input.trim() ? 'pointer' : 'default', color: input.trim() ? '#000' : 'rgba(255,255,255,.2)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  ↑
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
