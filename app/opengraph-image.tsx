import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RealSync Dynamics — Content mit beweisbarer Herkunft";
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
            "linear-gradient(135deg, #03050a 0%, #0a0a0a 60%, #1a1408 100%)",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif"
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000
            }}
          >
            Content mit{" "}
            <span style={{ color: "#ffd700", marginLeft: 18 }}>
              beweisbarer Herkunft.
            </span>
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
            C2PA-Signatur · Blockchain-Zeitstempel · Deepfake-Check — für
            Creator im DACH-Markt.
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
          <div style={{ display: "flex" }}>realsyncdynamics.de</div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              background: "#ffd700",
              color: "#0a0a0a",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 20
            }}
          >
            Starter · €9,90 / 3 Monate
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
