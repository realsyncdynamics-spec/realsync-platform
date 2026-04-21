'use client';

export default function AIGeneratedBadge({ compact = false }: { compact?: boolean }) {
  const sizing = compact
    ? { fontSize: 8, padding: '2px 6px', borderRadius: 4 }
    : { fontSize: 10, padding: '3px 8px', borderRadius: 5 };

  return (
    <span
      title="Dieser Inhalt wurde von einer KI generiert (EU AI Act Art. 50)"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontFamily: "'DM Mono', monospace",
        background: 'rgba(201,168,76,.12)',
        border: '1px solid rgba(201,168,76,.3)',
        color: '#C9A84C',
        letterSpacing: '.05em',
        fontWeight: 600,
        ...sizing,
      }}
    >
      🤖 KI-generiert
    </span>
  );
}
