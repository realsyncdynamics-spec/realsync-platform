import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RealSync Starter — 3 Monate alles drin für €9,90";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1408 60%, #2a1f0c 100%)",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: "4px solid #ffd700",
                transform: "rotate(45deg)",
                display: "flex"
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: -0.5
              }}
            >
              RealSync<span style={{ color: "#ffd700" }}>Dynamics</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              padding: "8px 14px",
              background: "rgba(255, 215, 0, 0.1)",
              border: "1px solid rgba(255, 215, 0, 0.4)",
              color: "#ffd700",
              borderRadius: 999,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700
            }}
          >
            Launch-Angebot
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#ffd700"
            }}
          >
            €9,90
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 1000
            }}
          >
            3 Monate alles drin. Einmalig.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#9aa0ac",
              letterSpacing: 0.5,
              maxWidth: 900
            }}
          >
            Kein Abo · keine stille Verlängerung · 3 Einladungen = +30 Tage.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#b8bcc5"
          }}
        >
          <div style={{ display: "flex" }}>realsyncdynamics.de/starter</div>
          <div style={{ display: "flex", color: "#6a6f78" }}>
            14 Tage Widerrufsrecht
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
