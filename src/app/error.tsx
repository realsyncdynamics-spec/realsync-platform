'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#03050A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Syne', sans-serif",
        padding: 24,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        {/* Diamond logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: 20, height: 20, border: '2.5px solid #EF4444', transform: 'rotate(45deg)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 3.5, background: '#EF4444' }} />
          </div>
        </div>

        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            color: '#EF4444',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          // Fehler
        </div>

        <h1 style={{ fontWeight: 800, fontSize: 22, color: '#E4E6EF', marginBottom: 10 }}>
          Etwas ist schiefgelaufen
        </h1>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: 'rgba(255,255,255,.3)',
            lineHeight: 1.7,
            marginBottom: 8,
          }}
        >
          Ein unerwarteter Fehler ist aufgetreten.
        </p>
        {error.digest && (
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'rgba(255,255,255,.15)',
              marginBottom: 28,
            }}
          >
            Fehler-ID: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '10px 22px',
              background: '#EF4444',
              color: '#fff',
              borderRadius: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '.06em',
            }}
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            style={{
              padding: '10px 22px',
              background: 'transparent',
              color: 'rgba(255,255,255,.4)',
              border: '1px solid #1A2130',
              borderRadius: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              textDecoration: 'none',
              letterSpacing: '.06em',
            }}
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
