import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReferralCopy from "./ReferralCopy";

export const metadata = {
  title: "Dashboard"
};

type DashboardProfile = {
  plan_code: string | null;
  email: string | null;
  starter_access_until: string | null;
  referral_code: string | null;
};

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ starter?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const showStarterSuccess = params.starter === "success";

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile: DashboardProfile | null = null;
  let verificationsCount = 0;
  let monthlyLimit = 3;
  let paidReferrals = 0;

  try {
    const { data: profileData } = await supabase
      .schema("creatorseal")
      .from("profiles")
      .select("plan_code, email, starter_access_until, referral_code")
      .eq("user_id", user.id)
      .maybeSingle();

    profile = profileData;

    if (!profile) {
      const { data: inserted } = await supabase
        .schema("creatorseal")
        .from("profiles")
        .insert({
          user_id: user.id,
          email: user.email || "",
          plan_code: "gratis"
        })
        .select("plan_code, email, starter_access_until, referral_code")
        .maybeSingle();
      profile =
        inserted ||
        {
          plan_code: "gratis",
          email: user.email || "",
          starter_access_until: null,
          referral_code: null
        };
    }

    const { count: refCount } = await supabase
      .schema("creatorseal")
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .not("paid_at", "is", null);
    paidReferrals = refCount || 0;

    const monthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString();

    const { count } = await supabase
      .schema("creatorseal")
      .from("verifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart);
    verificationsCount = count || 0;

    if (profile?.plan_code) {
      const { data: planData } = await supabase
        .schema("creatorseal")
        .from("plans")
        .select("monthly_verification_limit")
        .eq("code", profile.plan_code)
        .maybeSingle();
      if (
        planData?.monthly_verification_limit !== undefined &&
        planData.monthly_verification_limit !== null
      ) {
        monthlyLimit = planData.monthly_verification_limit;
      }
    }
  } catch (e) {
    console.error("[dashboard] DB error:", e);
  }

  const planLabel = (profile?.plan_code || "gratis").toUpperCase();
  const limitLabel = monthlyLimit === -1 ? "∞" : monthlyLimit;

  const starterUntil = profile?.starter_access_until
    ? new Date(profile.starter_access_until)
    : null;
  const starterActive = starterUntil && starterUntil > new Date();
  const daysLeft = starterUntil
    ? Math.max(
        0,
        Math.ceil((starterUntil.getTime() - Date.now()) / 86_400_000)
      )
    : null;
  const starterExpiringSoon =
    starterActive && daysLeft !== null && daysLeft <= 30;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";
  const referralUrl = profile?.referral_code
    ? `${siteUrl}/r/${profile.referral_code}`
    : null;
  const nextBonusAt = 3 - (paidReferrals % 3);

  return (
    <>
      <Nav />

      <main className="container" style={{ padding: "40px 24px 60px", minHeight: 600 }}>
        <div style={{ marginBottom: 32 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--gold)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 10
            }}
          >
            Dashboard · {user.email}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.01em" }}>
            Willkommen zurück.
          </h1>
        </div>

        {showStarterSuccess && (
          <div
            className="card"
            style={{
              padding: 18,
              marginBottom: 20,
              border: "1px solid rgba(16, 185, 129, 0.45)",
              background: "rgba(16, 185, 129, 0.06)"
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--green)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 6
              }}
            >
              Zahlung bestätigt
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              Starter-Paket ist aktiv. Webhook kann ein paar Sekunden brauchen
              — lade die Seite neu, falls der Zähler noch 0 Tage zeigt.
            </div>
          </div>
        )}

        {starterActive && (
          <div
            className="card"
            style={{
              padding: 18,
              marginBottom: 20,
              border: starterExpiringSoon
                ? "1px solid rgba(255, 107, 107, 0.45)"
                : "1px solid rgba(255, 215, 0, 0.35)",
              background: starterExpiringSoon
                ? "rgba(255, 107, 107, 0.05)"
                : "rgba(255, 215, 0, 0.04)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: starterExpiringSoon ? "#ff6b6b" : "var(--gold)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 6
                }}
              >
                Starter-Paket aktiv
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                Noch <strong>{daysLeft}</strong>{" "}
                {daysLeft === 1 ? "Tag" : "Tage"} Vollzugriff
              </div>
            </div>
            {starterExpiringSoon && (
              <Link
                href="/starter"
                style={{
                  background: "#ff6b6b",
                  color: "#0a0a0a",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none"
                }}
              >
                Jetzt verlängern →
              </Link>
            )}
          </div>
        )}

        {!starterActive && profile?.plan_code === "gratis" && (
          <div
            className="card"
            style={{
              padding: 18,
              marginBottom: 20,
              border: "1px dashed rgba(255, 215, 0, 0.35)",
              background: "rgba(255, 215, 0, 0.04)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--gold)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 6
                }}
              >
                Starter-Paket
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                3 Monate alles drin für €9,90 — einmalig, kein Abo.
              </div>
            </div>
            <Link
              href="/starter"
              style={{
                background: "var(--gold)",
                color: "#0a0a0a",
                padding: "10px 18px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none"
              }}
            >
              Starter aktivieren →
            </Link>
          </div>
        )}

        <div
          className="grid-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginBottom: 32
          }}
        >
          <StatCard label="Plan" value={planLabel} color="var(--gold)" />
          <StatCard
            label="Verifikationen diesen Monat"
            value={`${verificationsCount} / ${limitLabel}`}
            color="var(--cyan)"
          />
          <StatCard label="Status" value="BETA" color="var(--green)" />
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Content verifizieren
          </h2>
          <p
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.7,
              marginBottom: 20
            }}
          >
            Lade ein Bild oder Video hoch, um eine kryptographische Signatur zu
            erzeugen. Diese beweist, dass der Content zum angegebenen Zeitpunkt von
            deinem Account signiert wurde.
          </p>

          <div
            style={{
              padding: 24,
              background: "rgba(0, 212, 255, 0.05)",
              border: "1px dashed rgba(0, 212, 255, 0.3)",
              borderRadius: 12,
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🚧</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "var(--cyan)",
                marginBottom: 6
              }}
            >
              Upload kommt nächste Woche
            </div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                lineHeight: 1.7,
                maxWidth: 480,
                margin: "0 auto"
              }}
            >
              Die Upload- und Signatur-Funktion wird gerade in der aktuellen
              Beta-Iteration getestet. Wir geben dir Bescheid per E-Mail, sobald das
              Feature live geht.
            </div>
          </div>
        </div>

        {referralUrl && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--gold)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 10
              }}
            >
              Dein Referral-Link
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: 14
              }}
            >
              Teile diesen Link. Sobald 3 Personen das Starter-Paket über
              deinen Link bezahlen, bekommst du <strong>+30 Tage</strong>{" "}
              geschenkt.
            </div>
            <ReferralCopy url={referralUrl} />
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--text-subtle)",
                marginTop: 12
              }}
            >
              Bezahlte Einladungen: <strong>{paidReferrals}</strong>
              {paidReferrals > 0 &&
                ` · noch ${nextBonusAt} bis zum nächsten Bonus`}
            </div>
          </div>
        )}

        <div
          className="grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14
          }}
        >
          <div className="card">
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--text-subtle)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 10
              }}
            >
              Account
            </div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>{user.email}</div>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--text-subtle)" }}
            >
              Registriert:{" "}
              {new Date(user.created_at).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </div>
          </div>

          <div className="card">
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--text-subtle)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 10
              }}
            >
              Support
            </div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                lineHeight: 1.7
              }}
            >
              Fragen oder Feedback?{" "}
              <a
                href="mailto:kontakt@realsyncdynamics.de"
                style={{ color: "var(--gold)" }}
              >
                kontakt@realsyncdynamics.de
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatCard({
  label,
  value,
  color
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="card">
      <div
        className="mono"
        style={{
          fontSize: 9,
          color: "var(--text-subtle)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 10
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
