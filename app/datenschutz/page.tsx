import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Datenschutzerklärung"
};

export default function DatenschutzPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 720, padding: "60px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Datenschutzerklärung
        </h1>
        <p
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-subtle)",
            marginBottom: 48
          }}
        >
          Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <Section title="1. Verantwortlicher">
          <p>Dominik Steiner</p>
          <p>RealSync Dynamics</p>
          <p>Schwarzburger Straße 31, 98724 Neuhaus am Rennweg</p>
          <p>E-Mail: kontakt@realsyncdynamics.de</p>
        </Section>

        <Section title="2. Welche Daten wir erheben">
          <p>Bei der Registrierung: deine E-Mail-Adresse.</p>
          <p>Bei der Nutzung: Metadaten zu von dir verifizierten Inhalten (Hashes, Signaturen, Zeitstempel).</p>
          <p>
            Automatisch: IP-Adresse, Browser-Typ, Zugriffszeitpunkte (Server-Logs,
            gespeichert max. 30 Tage).
          </p>
        </Section>

        <Section title="3. Zweck und Rechtsgrundlage">
          <p>
            <strong>Login und Vertragsdurchführung</strong> (Art. 6 Abs. 1 lit. b
            DSGVO): E-Mail zur Anmeldung und für Benachrichtigungen.
          </p>
          <p>
            <strong>Bezahlung</strong> (Art. 6 Abs. 1 lit. b DSGVO): Weitergabe
            zahlungsrelevanter Daten an Stripe Payments Europe Ltd.
          </p>
          <p>
            <strong>Sicherheit und Betrieb</strong> (Art. 6 Abs. 1 lit. f DSGVO):
            Server-Logs zur Abwehr von Angriffen und zur Fehleranalyse.
          </p>
        </Section>

        <Section title="4. Auftragsverarbeiter">
          <p>
            <strong>Google Ireland Ltd.</strong> — Authentifizierung via Google
            OAuth 2.0. Bei der Anmeldung wird deine Google-E-Mail-Adresse und dein
            Name an uns übertragen. Google erhält die Information, dass du dich bei
            uns anmeldest. Details:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)" }}
            >
              policies.google.com/privacy
            </a>
          </p>
          <p>
            <strong>Supabase</strong> (Supabase Inc., USA) — Datenbank und
            Authentifizierung. Datenübertragung auf Basis der
            EU-Standardvertragsklauseln.
          </p>
          <p>
            <strong>Vercel</strong> (Vercel Inc., USA) — Hosting. Datenübertragung
            auf Basis der EU-Standardvertragsklauseln.
          </p>
          <p>
            <strong>Stripe</strong> (Stripe Payments Europe Ltd., Irland) —
            Zahlungsabwicklung.
          </p>
        </Section>

        <Section title="5. Deine Rechte">
          <p>
            Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
            Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
            Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21).
          </p>
          <p style={{ marginTop: 10 }}>
            Zur Ausübung: E-Mail an{" "}
            <a
              href="mailto:kontakt@realsyncdynamics.de"
              style={{ color: "var(--gold)" }}
            >
              kontakt@realsyncdynamics.de
            </a>
            .
          </p>
          <p style={{ marginTop: 10 }}>
            Zudem hast du das Recht auf Beschwerde bei einer Aufsichtsbehörde, z.B.
            dem Thüringer Landesbeauftragten für den Datenschutz.
          </p>
        </Section>

        <Section title="6. Speicherdauer">
          <p>
            Account-Daten: bis zur Kündigung des Accounts plus 6 Monate
            (Nachweispflichten).
          </p>
          <p>Rechnungsdaten: 10 Jahre (§ 147 AO).</p>
          <p>Server-Logs: 30 Tage.</p>
        </Section>

        <Section title="7. Cookies">
          <p>
            Wir verwenden ausschließlich technisch notwendige Cookies (Supabase-Auth-
            Session-Cookie). Keine Tracking-, Werbe- oder Analyse-Cookies.
          </p>
        </Section>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid var(--border-subtle)"
          }}
        >
          <Link
            href="/"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--gold)",
          marginBottom: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 700
        }}
      >
        {title}
      </h2>
      <div
        className="mono"
        style={{
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.7)",
          lineHeight: 1.9,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        {children}
      </div>
    </div>
  );
}
