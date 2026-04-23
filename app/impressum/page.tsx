import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Impressum"
};

export default function ImpressumPage() {
  return (
    <>
      <Nav />
      <main
        className="container"
        style={{ maxWidth: 720, padding: "60px 24px" }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Impressum</h1>
        <p
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-subtle)",
            marginBottom: 48
          }}
        >
          Angaben gemäß § 5 TMG
        </p>

        <Section title="Anbieter">
          <p>Dominik Steiner</p>
          <p>RealSync Dynamics</p>
          <p>Schwarzburger Straße 31</p>
          <p>98724 Neuhaus am Rennweg</p>
          <p>Deutschland</p>
        </Section>

        <Section title="Kontakt">
          <p>
            E-Mail:{" "}
            <a
              href="mailto:kontakt@realsyncdynamics.de"
              style={{ color: "var(--gold)" }}
            >
              kontakt@realsyncdynamics.de
            </a>
          </p>
          <p>Telefon: +49 176 40132161</p>
        </Section>

        <Section title="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)">
          <p>Dominik Steiner</p>
          <p>Anschrift wie oben</p>
        </Section>

        <Section title="Umsatzsteuerliche Angaben">
          <p style={{ color: "var(--text-muted)" }}>
            Kleinunternehmer gemäß § 19 UStG. Umsatzsteuer wird nicht erhoben.
          </p>
        </Section>

        <Section title="EU-Streitbeilegung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)" }}
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p style={{ marginTop: 10, color: "var(--text-muted)" }}>
            Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht
            bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p style={{ color: "var(--text-muted)" }}>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
            übermittelte oder gespeicherte fremde Informationen zu überwachen oder
            nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p style={{ color: "var(--text-muted)" }}>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
            Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
            Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
            verantwortlich.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p style={{ color: "var(--text-muted)" }}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
            Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
            jeweiligen Autors bzw. Erstellers.
          </p>
        </Section>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: 24,
            flexWrap: "wrap"
          }}
        >
          <Link
            href="/datenschutz"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            Datenschutzerklärung
          </Link>
          <Link
            href="/agb"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            AGB
          </Link>
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
          gap: 2
        }}
      >
        {children}
      </div>
    </div>
  );
}
