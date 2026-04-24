import { cookies } from "next/headers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StarterCheckoutButton from "./StarterCheckoutButton";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "Starter — 3 Monate alles drin für €9,90",
  description:
    "Einmalzahlung €9,90. 90 Tage Vollzugriff. Kein Abo, keine stille Verlängerung."
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
type UtmKey = (typeof UTM_KEYS)[number];
type Utm = Partial<Record<UtmKey, string>>;

function sanitizeUtm(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 64);
  return cleaned || undefined;
}

export default async function StarterPage({
  searchParams
}: {
  searchParams: Promise<
    { ref?: string; canceled?: string } & Partial<Record<UtmKey, string>>
  >;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const referralCode =
    params.ref?.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 16) ||
    cookieStore.get("rs_ref")?.value ||
    null;

  const utm: Utm = {};
  for (const k of UTM_KEYS) {
    const v = sanitizeUtm(params[k]);
    if (v) utm[k] = v;
  }

  const plan = PLANS.starter;

  return (
    <>
      <Nav />

      <main
        className="container"
        style={{ padding: "60px 24px 80px", minHeight: 700 }}
      >
        {params.canceled && (
          <div
            className="card"
            style={{
              padding: 14,
              marginBottom: 24,
              border: "1px solid rgba(255, 170, 0, 0.35)",
              background: "rgba(255, 170, 0, 0.06)"
            }}
          >
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--gold)" }}
            >
              Bezahlung abgebrochen. Kein Problem — du kannst jederzeit neu
              starten.
            </div>
          </div>
        )}

        <div style={{ maxWidth: 640 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--gold)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 18
            }}
          >
            Starter-Paket
          </div>

          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16
            }}
          >
            3 Monate alles drin — für €9,90.
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 28,
              maxWidth: 560
            }}
          >
            Einmalzahlung. 90 Tage Vollzugriff auf alle RealSync-Features. Kein
            Abo, keine stille Verlängerung. Danach entscheidest du neu.
          </p>

          <div
            className="card"
            style={{
              padding: 28,
              marginBottom: 24,
              maxWidth: 560
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 18
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "var(--gold)",
                  lineHeight: 1
                }}
              >
                €{plan.priceEur.toFixed(2).replace(".", ",")}
              </div>
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--text-muted)" }}
              >
                einmalig · 90 Tage
              </div>
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 24px",
                display: "grid",
                gap: 8
              }}
            >
              {[
                "Unbegrenzte Verifikationen (während 90 Tagen)",
                "Magic-Link-Login, SSR-Dashboard, Stripe Billing Portal",
                "Referral-Code: 3 Einladungen = +30 Tage Starter",
                "Keine automatische Verlängerung"
              ].map((feature) => (
                <li
                  key={feature}
                  className="mono"
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.6
                  }}
                >
                  <span style={{ color: "var(--green)", marginRight: 8 }}>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <StarterCheckoutButton referralCode={referralCode} utm={utm} />

            {referralCode && (
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--green)",
                  marginTop: 14,
                  lineHeight: 1.5
                }}
              >
                ✓ Referral erkannt: <strong>{referralCode}</strong> — die
                Person, die dich eingeladen hat, bekommt bei 3 bezahlten
                Einladungen +30 Tage geschenkt.
              </div>
            )}
          </div>

          <p
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--text-subtle)",
              lineHeight: 1.7,
              maxWidth: 560
            }}
          >
            Bezahlt wird über Stripe Checkout. 14 Tage Widerrufsrecht laut
            deutschem Verbraucherrecht. Nach 90 Tagen endet der Starter-Zugriff
            automatisch — ohne dass etwas weiter abgebucht wird.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
