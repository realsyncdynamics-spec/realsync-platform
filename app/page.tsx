import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section
        className="container"
        style={{ padding: "80px 24px 60px" }}
      >
        <div className="fade-up" style={{ maxWidth: 720 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--gold)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--gold)"
              }}
            />
            Beta · für Creator aus dem DACH-Markt
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 22
            }}
          >
            Content mit{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--gold) 0%, var(--gold-bright) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              beweisbarer Herkunft.
            </span>
          </h1>

          <p
            className="mono"
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.8,
              marginBottom: 30,
              maxWidth: 560
            }}
          >
            RealSync Dynamics verifiziert deine Inhalte mit digitalen Signaturen und
            Blockchain-Zeitstempel. Für Creator die beweisen wollen, dass ihr
            Content echt ist — bevor KI-Fälschungen das Thema dominieren.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/login" className="btn-primary">
              Kostenlos starten →
            </Link>
            <Link
              href="/starter"
              className="btn-secondary"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              3 Monate alles drin · €9,90 →
            </Link>
            <Link href="#features" className="btn-secondary">
              Was kann das?
            </Link>
          </div>

          <div
            style={{
              marginTop: 24,
              padding: "12px 16px",
              background: "rgba(0, 212, 255, 0.05)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              borderRadius: 10,
              display: "inline-block"
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 11, color: "var(--cyan)" }}
            >
              🧪 Closed Beta · aktuell kostenlos · keine Kreditkarte nötig
            </span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        style={{
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "60px 0"
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--text-subtle)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 10
              }}
            >
              // Was funktioniert heute
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800 }}>
              Ehrliche Feature-Übersicht.
            </h2>
            <p
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--text-subtle)",
                marginTop: 10
              }}
            >
              Wir sagen dir was läuft — und was noch nicht.
            </p>
          </div>

          <div
            className="grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16
            }}
          >
            <FeatureCard
              status="live"
              icon="🛡"
              title="Content-Signatur (Ed25519)"
              desc="Jedes hochgeladene Bild/Video wird kryptographisch mit deinem persönlichen Schlüssel signiert. Verifizierbar von jedem."
            />
            <FeatureCard
              status="live"
              icon="⛓"
              title="Blockchain-Timestamp"
              desc="Signatur-Hashes werden gebündelt auf Polygon verankert. Damit ist das Alter deines Contents unverfälschbar nachweisbar."
            />
            <FeatureCard
              status="live"
              icon="🔐"
              title="Öffentliche Verifikations-URL"
              desc="Jede Verifikation bekommt eine eigene URL. Andere können dort Signatur, Zeitstempel und Hash prüfen."
            />
            <FeatureCard
              status="beta"
              icon="🤖"
              title="KI-Fälschungs-Check"
              desc="Automatische Deepfake-Erkennung bei Upload. Noch in Entwicklung — Ergebnisse sind indikativ."
            />
            <FeatureCard
              status="beta"
              icon="📊"
              title="Trust-Score"
              desc="Aggregierter Score aus Content-Signatur, Blockchain-Verankerung und Fälschungs-Check."
            />
            <FeatureCard
              status="roadmap"
              icon="💼"
              title="Brand-Deals"
              desc="Matching zwischen verifizierten Creatorn und Marken. Nächstes Quartal."
            />
          </div>
        </div>
      </section>

      {/* STARTER-PAKET SPOTLIGHT */}
      <section
        id="starter"
        style={{
          padding: "60px 0",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255, 215, 0, 0.04) 50%, transparent 100%)"
        }}
      >
        <div className="container" style={{ maxWidth: 720 }}>
          <div
            className="card fade-up"
            style={{
              padding: 36,
              border: "1px solid rgba(255, 215, 0, 0.35)",
              background: "rgba(255, 215, 0, 0.03)"
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--gold)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 14
              }}
            >
              Starter-Paket · Launch-Angebot
            </div>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.015em",
                lineHeight: 1.15,
                marginBottom: 14
              }}
            >
              3 Monate alles drin — €9,90 einmalig.
            </h2>
            <p
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: 22,
                maxWidth: 560
              }}
            >
              Einmalzahlung, 90 Tage Vollzugriff, kein Abo. Danach entscheidest
              du neu. Lade 3 Freunde ein, die auch bezahlen → automatisch +30
              Tage für dich.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <Link
                href="/starter"
                className="btn-primary"
                style={{
                  background: "var(--gold)",
                  color: "#0a0a0a",
                  fontWeight: 700
                }}
              >
                Starter für €9,90 holen →
              </Link>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--text-subtle)",
                  lineHeight: 1.6
                }}
              >
                14 Tage Widerrufsrecht · keine stille Verlängerung
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--text-subtle)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 10
              }}
            >
              // Preise
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>
              Während der Beta: alles kostenlos.
            </h2>
            <p
              className="mono"
              style={{ fontSize: 11, color: "var(--text-subtle)" }}
            >
              Wenn wir stabil laufen, starten wir mit diesen Paketen. Bestandskunden
              aus der Beta bekommen 50 % Rabatt für 6 Monate.
            </p>
          </div>

          <div
            className="grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14
            }}
          >
            <PriceCard
              tier="Gratis"
              price="€0"
              interval="für immer"
              features={[
                "3 Verifikationen/Monat",
                "Öffentliche Verify-URL",
                "Basis-Badge"
              ]}
            />
            <PriceCard
              tier="Silber"
              price="€49"
              interval="/Monat"
              highlighted
              features={[
                "100 Verifikationen/Monat",
                "Blockchain-Verankerung inkl.",
                "Priority-Support"
              ]}
            />
            <PriceCard
              tier="Gold"
              price="€99"
              interval="/Monat"
              features={[
                "500 Verifikationen/Monat",
                "API-Zugang",
                "Custom Badge-Design"
              ]}
            />
          </div>

          <p
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--text-subtle)",
              textAlign: "center",
              marginTop: 20
            }}
          >
            Kleinunternehmer gemäß § 19 UStG — keine Umsatzsteuer.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 0",
          textAlign: "center",
          background: "linear-gradient(180deg, var(--bg-elevated), var(--bg))",
          borderTop: "1px solid var(--border)"
        }}
      >
        <div className="container" style={{ maxWidth: 560 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡</div>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 14
            }}
          >
            Teste die Beta.
          </h2>
          <p
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 28,
              lineHeight: 1.8
            }}
          >
            Anmeldung mit Google · Keine Kreditkarte · Jederzeit kündbar.
          </p>
          <Link href="/login" className="btn-primary" style={{ fontSize: 15 }}>
            🚀 Kostenlos starten
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function FeatureCard({
  status,
  icon,
  title,
  desc
}: {
  status: "live" | "beta" | "roadmap";
  icon: string;
  title: string;
  desc: string;
}) {
  const statusConfig = {
    live: { label: "LIVE", color: "var(--green)", bg: "rgba(16, 185, 129, 0.1)" },
    beta: { label: "BETA", color: "var(--cyan)", bg: "rgba(0, 212, 255, 0.1)" },
    roadmap: {
      label: "ROADMAP",
      color: "var(--text-subtle)",
      bg: "rgba(255, 255, 255, 0.04)"
    }
  };
  const s = statusConfig[status];

  return (
    <div className="card" style={{ padding: 22, position: "relative" }}>
      <div
        className="mono"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 8,
          padding: "3px 8px",
          background: s.bg,
          border: `1px solid ${s.color}`,
          borderRadius: 3,
          color: s.color,
          letterSpacing: "0.1em"
        }}
      >
        {s.label}
      </div>
      <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
      <div
        className="mono"
        style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}
      >
        {desc}
      </div>
    </div>
  );
}

function PriceCard({
  tier,
  price,
  interval,
  features,
  highlighted
}: {
  tier: string;
  price: string;
  interval: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className="card"
      style={{
        position: "relative",
        borderColor: highlighted ? "rgba(201, 168, 76, 0.4)" : undefined
      }}
    >
      {highlighted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, var(--gold), var(--gold-bright))",
            borderRadius: "16px 16px 0 0"
          }}
        />
      )}
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: "var(--text-subtle)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 8
        }}
      >
        {tier}
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 32,
          color: highlighted ? "var(--gold)" : "var(--text)",
          marginBottom: 2
        }}
      >
        {price}
      </div>
      <div
        className="mono"
        style={{ fontSize: 10, color: "var(--text-subtle)", marginBottom: 18 }}
      >
        {interval}
      </div>
      {features.map((f) => (
        <div
          key={f}
          style={{
            display: "flex",
            gap: 8,
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 6
          }}
        >
          <span style={{ color: highlighted ? "var(--gold)" : "var(--text-subtle)" }}>
            ▸
          </span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}
