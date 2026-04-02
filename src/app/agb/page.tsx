import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB — Allgemeine Geschäftsbedingungen',
  robots: { index: false, follow: false },
};

export default function AGBPage() {
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
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,.3)' }}>AGB</span>
      </nav>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '60px 40px' }}>
        <h1 style={{ fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Allgemeine Geschäftsbedingungen</h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 48 }}>
          Stand: April 2026 · RealSync Dynamics, Neuhaus am Rennweg, Deutschland
        </p>

        {/* TODO: Diese AGB wurden als Entwurf erstellt und müssen vor dem Go-Live von einem Rechtsanwalt geprüft werden. */}
        <div style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 40, fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(245,158,11,.8)', lineHeight: 1.7 }}>
          ⚠ Diese AGB befinden sich in Abstimmung. Die vollständigen, rechtsverbindlichen AGB werden
          vor dem kommerziellen Launch veröffentlicht. Bei Fragen: kontakt@realsyncdynamics.de
        </div>

        <Section title="§ 1 Geltungsbereich">
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen
            RealSync Dynamics (nachfolgend &ldquo;Anbieter&rdquo;) und den Nutzern der Plattform
            RealSync Dynamics (nachfolgend &ldquo;Nutzer&rdquo;) über die Nutzung der bereitgestellten
            Creator-OS-Dienste.
          </p>
        </Section>

        <Section title="§ 2 Leistungsbeschreibung">
          <p>
            RealSync Dynamics bietet eine cloudbasierte Creator-Plattform mit verschiedenen
            KI-gestützten Werkzeugen für Content-Creator im DACH-Markt an. Der genaue
            Leistungsumfang richtet sich nach dem gewählten Tarif (Free, Bronze, Silber, Gold,
            Platin, Diamant).
          </p>
          <p style={{ marginTop: 8, color: 'rgba(255,255,255,.4)' }}>
            Hinweis: Einzelne Features befinden sich noch in der Beta-Phase und können sich ändern.
            Features die als &ldquo;Coming Soon&rdquo; oder &ldquo;Beta&rdquo; gekennzeichnet sind, sind nicht Bestandteil
            einer verbindlichen Leistungszusage.
          </p>
        </Section>

        <Section title="§ 3 Registrierung und Konto">
          <p>
            Die Nutzung kostenpflichtiger Dienste setzt eine Registrierung voraus. Nutzer müssen
            mindestens 18 Jahre alt sein oder mit Zustimmung eines Erziehungsberechtigten handeln.
            Die angegebenen Daten müssen vollständig und wahrheitsgemäß sein.
          </p>
        </Section>

        <Section title="§ 4 Preise und Zahlung">
          <p>
            Alle Preisangaben verstehen sich als Bruttopreise in Euro (EUR) inklusive der
            jeweils gültigen Mehrwertsteuer. Zahlungen werden über den Drittanbieter Stripe
            abgewickelt. Abonnements verlängern sich automatisch, sofern sie nicht fristgerecht
            gekündigt werden.
          </p>
        </Section>

        <Section title="§ 5 Kündigung und Widerruf">
          <p>
            Kostenpflichtige Abonnements können jederzeit zum Ende der laufenden Abrechnungsperiode
            gekündigt werden. Das Konto bleibt bis zum Ende der bezahlten Laufzeit aktiv.
            Für Verbraucher gilt das gesetzliche Widerrufsrecht von 14 Tagen ab Vertragsschluss,
            sofern der Vertrag vollständig online geschlossen wurde.
          </p>
        </Section>

        <Section title="§ 6 Nutzerpflichten">
          <p>Nutzer verpflichten sich:</p>
          <ul style={{ marginLeft: 16, lineHeight: 2 }}>
            <li>Keine Inhalte hochzuladen, die gegen geltendes Recht verstoßen</li>
            <li>Keine automatisierten Zugriffe ohne ausdrückliche Erlaubnis vorzunehmen</li>
            <li>Zugangsdaten vertraulich zu behandeln</li>
            <li>Den Dienst nicht für Spam, Deepfakes oder Täuschung zu missbrauchen</li>
          </ul>
        </Section>

        <Section title="§ 7 Haftungsbeschränkung">
          <p>
            Der Anbieter haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem
            Verhalten beruhen. Eine Haftung für Datenverlust ist auf den Schaden begrenzt,
            der bei ordnungsgemäßer Datensicherung durch den Nutzer entstanden wäre.
          </p>
        </Section>

        <Section title="§ 8 Gerichtsstand und anwendbares Recht">
          <p>
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
            Gerichtsstand für Kaufleute ist Neuhaus am Rennweg, Deutschland.
          </p>
        </Section>

        <Section title="§ 9 Salvatorische Klausel">
          <p>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen davon unberührt.
          </p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #0F1520', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/impressum" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Impressum</Link>
          <Link href="/datenschutz" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>Datenschutz</Link>
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
