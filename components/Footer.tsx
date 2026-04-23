import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#030509",
        borderTop: "1px solid var(--border-subtle)",
        padding: "32px 0",
        marginTop: 80
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 11,
              height: 11,
              border: "2px solid var(--gold)",
              transform: "rotate(45deg)",
              position: "relative"
            }}
          >
            <div
              style={{ position: "absolute", inset: 2, background: "var(--gold)" }}
            />
          </div>
          <span style={{ fontWeight: 700, fontSize: 12 }}>
            RealSync<span style={{ color: "var(--gold)" }}>Dynamics</span>
          </span>
          <span
            className="mono"
            style={{ fontSize: 9, color: "var(--text-subtle)", marginLeft: 8 }}
          >
            © 2026 · Neuhaus am Rennweg · Deutschland
          </span>
        </div>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <Link
            href="/impressum"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            Datenschutz
          </Link>
          <Link
            href="/agb"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            AGB
          </Link>
          <a
            href="mailto:kontakt@realsyncdynamics.de"
            className="mono"
            style={{ fontSize: 10, color: "var(--text-subtle)" }}
          >
            Kontakt
          </a>
        </div>
      </div>
    </footer>
  );
}
