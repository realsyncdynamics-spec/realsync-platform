import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Allgemeine Geschäftsbedingungen"
};

export default function AGBPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 720, padding: "60px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          Allgemeine Geschäftsbedingungen
        </h1>
        <p
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-subtle)",
            marginBottom: 48
          }}
        >
          Stand:{" "}
          {new Date().toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>

        <Section title="§ 1 Geltungsbereich">
          <p>
            Diese AGB gelten für alle Verträge zwischen Dominik Steiner
            (RealSync Dynamics, Schwarzburger Straße 31, 98724 Neuhaus am Rennweg —
            „Anbieter") und den Nutzern seiner Plattform unter
            realsyncdynamics.de („Nutzer").
          </p>
        </Section>

        <Section title="§ 2 Leistungen">
          <p>
            Der Anbieter stellt Tools zur kryptographischen Signatur und
            Blockchain-Verankerung digitaler Inhalte bereit. Der Umfang ergibt sich
            aus dem jeweils gebuchten Paket.
          </p>
          <p>
            Die Plattform befindet sich aktuell in einer Beta-Phase. Funktionen
            können sich ändern, ausfallen oder entfernt werden.
          </p>
        </Section>

        <Section title="§ 3 Vertragsschluss">
          <p>
            Der Vertrag kommt durch Account-Registrierung (Gratis-Plan) bzw. durch
            Abschluss eines Abonnements über den Checkout-Prozess zustande.
          </p>
        </Section>

        <Section title="§ 4 Preise und Zahlung">
          <p>
            Während der Beta-Phase ist die Nutzung kostenlos. Kostenpflichtige
            Pakete sind monatlich in Euro zu zahlen. Preise gelten als
            Nettopreise; als Kleinunternehmer nach § 19 UStG wird keine
            Umsatzsteuer erhoben.
          </p>
          <p>Zahlungsabwickler ist Stripe.</p>
        </Section>

        <Section title="§ 5 Laufzeit und Kündigung">
          <p>
            Monatsabos haben eine Mindestlaufzeit von einem Monat und verlängern
            sich automatisch, wenn nicht gekündigt wird.
          </p>
          <p>
            Die Kündigung ist jederzeit über das Customer-Portal möglich und wird
            zum Ende der aktuellen Abrechnungsperiode wirksam.
          </p>
        </Section>

        <Section title="§ 6 Widerrufsrecht (Verbraucher)">
          <p>
            Verbraucher haben ein 14-tägiges Widerrufsrecht ab Vertragsschluss. Mit
            der ausdrücklichen Zustimmung zur sofortigen Leistungserbringung
            erlischt das Widerrufsrecht, sobald der Anbieter mit der
            Leistungserbringung beginnt (§ 356 Abs. 4 BGB).
          </p>
        </Section>

        <Section title="§ 7 Pflichten des Nutzers">
          <p>
            Der Nutzer darf nur Inhalte hochladen, an denen er die erforderlichen
            Rechte besitzt. Rechtswidrige Inhalte (strafbare Inhalte, Urheber­rechts­
            verletzungen, etc.) sind untersagt.
          </p>
        </Section>

        <Section title="§ 8 Haftung">
          <p>
            Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit
            sowie bei Verletzung von Leben, Körper oder Gesundheit.
          </p>
          <p>
            Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung
            vertragswesentlicher Pflichten, begrenzt auf den vorhersehbaren,
            vertragstypischen Schaden.
          </p>
          <p>
            Für die Beta-Phase wird die Haftung zusätzlich auf die dreifache
            Monatsgebühr des höchsten Pakets begrenzt, sofern kein Vorsatz, grobe
            Fahrlässigkeit oder Verletzung von Leben, Körper, Gesundheit vorliegt.
          </p>
        </Section>

        <Section title="§ 9 Änderungen der AGB">
          <p>
            Der Anbieter kann diese AGB mit einer Ankündigungsfrist von 4 Wochen
            per E-Mail an den Nutzer ändern. Widerspricht der Nutzer nicht
            innerhalb dieser Frist, gelten die neuen AGB.
          </p>
        </Section>

        <Section title="§ 10 Schlussbestimmungen">
          <p>
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gegenüber
            Verbrauchern gilt dies nur, soweit dadurch nicht zwingende Bestimmungen
            des Rechts des Staates, in dem der Verbraucher seinen gewöhnlichen
            Aufenthalt hat, ausgeschlossen werden.
          </p>
          <p>
            Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit
            der übrigen Bestimmungen unberührt.
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
