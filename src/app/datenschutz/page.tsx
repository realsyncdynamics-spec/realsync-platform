import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
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
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,.3)' }}>Datenschutzerklärung</span>
      </nav>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '60px 40px' }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Datenschutzerklärung</h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 48 }}>
          Stand: April 2026 · gemäß DSGVO / GDPR
        </p>

        <Section title="1. Verantwortlicher">
          <p>
            Verantwortlicher im Sinne der DSGVO ist:<br />
            RealSync Dynamics, Neuhaus am Rennweg, Deutschland<br />
            E-Mail: <a href="mailto:datenschutz@realsyncdynamics.de" style={{ color: '#C9A84C', textDecoration: 'none' }}>datenschutz@realsyncdynamics.de</a>
          </p>
          {/* TODO: vollständige Adresse und ggf. Datenschutzbeauftragter eintragen */}
        </Section>

        <Section title="2. Welche Daten wir erheben">
          <p><strong style={{ color: '#E4E6EF' }}>Beim Erstellen eines Kontos:</strong></p>
          <ul style={{ marginLeft: 16, lineHeight: 2 }}>
            <li>E-Mail-Adresse (erforderlich)</li>
            <li>Name / Anzeigename (optional)</li>
            <li>Passwort (gehasht, nie im Klartext gespeichert)</li>
          </ul>
          <p style={{ marginTop: 12 }}><strong style={{ color: '#E4E6EF' }}>Bei der Nutzung der Plattform:</strong></p>
          <ul style={{ marginLeft: 16, lineHeight: 2 }}>
            <li>Nutzungsdaten (aufgerufene Seiten, Zeitstempel)</li>
            <li>Technische Daten (Browser, IP-Adresse, Geräteinformationen)</li>
            <li>Zahlungsdaten — werden ausschließlich über Stripe verarbeitet. RealSync speichert keine Kreditkartendaten.</li>
          </ul>
        </Section>

        <Section title="3. Zweck der Datenverarbeitung">
          <ul style={{ marginLeft: 16, lineHeight: 2 }}>
            <li>Bereitstellung und Betrieb der Plattform (Art. 6 Abs. 1 lit. b DSGVO)</li>
            <li>Authentifizierung und Kontoverwaltung</li>
            <li>Zahlungsabwicklung via Stripe</li>
            <li>Sicherheit und Missbrauchsschutz</li>
            <li>Verbesserung des Dienstes (pseudonymisiert)</li>
          </ul>
        </Section>

        <Section title="4. Drittanbieter und Datenübermittlung">
          <p><strong style={{ color: '#E4E6EF' }}>Supabase (Datenbank &amp; Auth)</strong></p>
          <p>Wir nutzen Supabase als Backend-Anbieter. Daten werden in der EU gespeichert.</p>
          <p style={{ marginTop: 8 }}><strong style={{ color: '#E4E6EF' }}>Stripe (Zahlungen)</strong></p>
          <p>Stripe, Inc., 185 Berry Street, San Francisco, USA. Zahlungsdaten werden direkt von Stripe verarbeitet. Datenschutzerklärung: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>stripe.com/de/privacy</a></p>
          <p style={{ marginTop: 8 }}><strong style={{ color: '#E4E6EF' }}>Vercel (Hosting)</strong></p>
          <p>Die Plattform wird über Vercel, Inc. gehostet. Serverstandorte in der EU verfügbar.</p>
          {/* TODO: weitere Drittanbieter (Perplexity AI, Analytics) ergänzen sobald aktiv */}
        </Section>

        <Section title="5. Deine Rechte">
          <p>Du hast folgende Rechte bezüglich deiner personenbezogenen Daten:</p>
          <ul style={{ marginLeft: 16, lineHeight: 2 }}>
            <li><strong style={{ color: '#E4E6EF' }}>Auskunft</strong> — welche Daten wir über dich gespeichert haben (Art. 15 DSGVO)</li>
            <li><strong style={{ color: '#E4E6EF' }}>Berichtigung</strong> — Korrektur unrichtiger Daten (Art. 16 DSGVO)</li>
            <li><strong style={{ color: '#E4E6EF' }}>Löschung</strong> — Löschung deiner Daten (&ldquo;Recht auf Vergessenwerden&rdquo;, Art. 17 DSGVO)</li>
            <li><strong style={{ color: '#E4E6EF' }}>Datenübertragbarkeit</strong> — Export deiner Daten (Art. 20 DSGVO)</li>
            <li><strong style={{ color: '#E4E6EF' }}>Widerspruch</strong> — Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p style={{ marginTop: 12 }}>
            Für Anfragen wende dich an:{' '}
            <a href="mailto:datenschutz@realsyncdynamics.de" style={{ color: '#C9A84C', textDecoration: 'none' }}>
              datenschutz@realsyncdynamics.de
            </a>
          </p>
        </Section>

        <Section title="6. Cookies und lokaler Speicher">
          <p>
            Wir verwenden technisch notwendige Cookies für die Sitzungsverwaltung (Auth-Token via Supabase).
            Es werden keine Tracking- oder Werbe-Cookies ohne deine Einwilligung gesetzt.
          </p>
          {/* TODO: Cookie-Banner implementieren und hier verlinken sobald aktiv */}
        </Section>

        <Section title="7. Datensicherheit">
          <p>
            Alle Verbindungen zur Plattform erfolgen verschlüsselt über HTTPS/TLS.
            Passwörter werden gehasht gespeichert (bcrypt via Supabase Auth).
            Stripe-Zahlungen laufen über eine PCI-DSS-zertifizierte Infrastruktur.
          </p>
        </Section>

        <Section title="8. Beschwerderecht">
          <p>
            Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.
            Zuständig ist die Aufsichtsbehörde des jeweiligen Bundeslandes (hier: Thüringen —
            Thüringer Landesbeauftragter für den Datenschutz und die Informationsfreiheit).
          </p>
        </Section>

        <Section title="9. Änderungen dieser Erklärung">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.
            Die jeweils aktuelle Version ist unter{' '}
            <Link href="/datenschutz" style={{ color: '#C9A84C', textDecoration: 'none' }}>realsyncdynamics.de/datenschutz</Link>{' '}
            abrufbar. Stand: April 2026.
          </p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #0F1520', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/impressum" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Impressum</Link>
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
      <h2 style={{ fontWeight: 700, fontSize: 11, color: '#C9A84C', marginBottom: 12, fontFamily: "'DM Mono', monospace", letterSpacing: '.08em', textTransform: 'uppercase' }}>
        {title}
      </h2>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {children}
      </div>
    </div>
  );
}
