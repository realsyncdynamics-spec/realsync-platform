import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Dashboard"
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile: { plan_code: string | null; email: string | null } | null = null;
  let verificationsCount = 0;
  let monthlyLimit = 3;

  try {
    const { data: profileData } = await supabase
      .schema("creatorseal")
      .from("profiles")
      .select("plan_code, email")
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
        .select("plan_code, email")
        .maybeSingle();
      profile = inserted || { plan_code: "gratis", email: user.email || "" };
    }

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
