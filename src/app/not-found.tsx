import Link from 'next/link';

export default function NotFound() {
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
          <div style={{ width: 20, height: 20, border: '2.5px solid #C9A84C', transform: 'rotate(45deg)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 3.5, background: '#C9A84C' }} />
          </div>
        </div>

        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 72,
            fontWeight: 800,
            color: '#C9A84C',
            lineHeight: 1,
            marginBottom: 8,
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <h1 style={{ fontWeight: 800, fontSize: 22, color: '#E4E6EF', marginBottom: 10 }}>
          Seite nicht gefunden
        </h1>
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            color: 'rgba(255,255,255,.35)',
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          Diese Seite existiert nicht oder wurde verschoben.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '10px 22px',
              background: '#C9A84C',
              color: '#000',
              borderRadius: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '.06em',
            }}
          >
            Zur Startseite
          </Link>
          <Link
            href="/hub"
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
            Creator Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
