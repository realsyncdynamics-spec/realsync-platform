import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div style={{ background: '#03050A', minHeight: '100vh', color: '#E4E6EF', fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <nav style={{ background: 'rgba(3,5,10,.97)', borderBottom: '1px solid #0F1520', height: 54, display: 'flex', alignItems: 'center', padding: '0 40px', gap: 16 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 12, height: 12, border: '2px solid #C9A84C', transform: 'rotate(45deg)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 2, background: '#C9A84C' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 13, color: '#E4E6EF' }}>RealSync<span style={{ color: '#C9A84C' }}>Dynamics</span></span>
        </Link>
        <span style={{ color: '#1A2130' }}>·</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,.3)' }}>Impressum</span>
      </nav>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '60px 40px' }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Impressum</h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 48 }}>
          Angaben gemäß § 5 TMG
        </p>

        <Section title="Anbieter">
          <p>RealSync Dynamics</p>
          <p>— Straße und Hausnummer —</p>
          <p>98724 Neuhaus am Rennweg</p>
          <p>Deutschland</p>
        </Section>

        <Section title="Kontakt">
          <p>E-Mail: <a href="mailto:kontakt@realsyncdynamics.de" style={{ color: '#C9A84C', textDecoration: 'none' }}>kontakt@realsyncdynamics.de</a></p>
          {/* TODO: Telefonnummer eintragen sobald verfügbar */}
        </Section>

        <Section title="Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)">
          <p>— Name und Anschrift des Verantwortlichen —</p>
          {/* TODO: Namen und vollständige Adresse des Verantwortlichen eintragen */}
        </Section>

        <Section title="Gewerbeanmeldung / Handelsregister">
          <p style={{ color: 'rgba(255,255,255,.4)', fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
            {/* TODO: Handelsregisternummer, Amtsgericht und ggf. USt-IdNr. eintragen */}
            Angaben folgen nach Gewerbeanmeldung.
          </p>
        </Section>

        <Section title="EU-Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p style={{ marginTop: 8 }}>
            Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet,
            an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #0F1520', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/datenschutz" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Datenschutzerklärung</Link>
          <Link href="/agb" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>AGB</Link>
          <Link href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>← Zurück zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontWeight: 700, fontSize: 16, color: '#C9A84C', marginBottom: 12, fontFamily: "'DM Mono', monospace", letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 11 }}>
        {title}
      </h2>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </div>
    </div>
  );
}
