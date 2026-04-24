import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PLANS } from "@/lib/plans";

export const metadata = { title: "Admin" };

export const dynamic = "force-dynamic";

function parseAdmins(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const admins = parseAdmins();
  if (!user.email || !admins.includes(user.email.toLowerCase())) {
    return (
      <>
        <Nav />
        <main
          className="container"
          style={{ padding: "60px 24px", minHeight: 500 }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>403 — kein Zugriff</h1>
          <p className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
            Nur Admin-E-Mails (siehe ADMIN_EMAILS env var) dürfen diese Seite
            sehen.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const admin = createServiceRoleClient();

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 86_400_000).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const nowIso = now.toISOString();

  const [
    { count: starterActiveCount },
    { count: starterSignups24h },
    { count: starterSignups7d },
    { count: paidReferralsCount },
    { count: webhookErrors24h },
    { data: recentSignups }
  ] = await Promise.all([
    admin
      .schema("creatorseal")
      .from("profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("plan_code", "starter")
      .gt("starter_access_until", nowIso),
    admin
      .schema("creatorseal")
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "checkout.session.completed")
      .gte("created_at", dayAgo),
    admin
      .schema("creatorseal")
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "checkout.session.completed")
      .gte("created_at", weekAgo),
    admin
      .schema("creatorseal")
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .not("paid_at", "is", null),
    admin
      .schema("creatorseal")
      .from("webhook_events")
      .select("id", { count: "exact", head: true })
      .not("processing_error", "is", null)
      .gte("created_at", dayAgo),
    admin
      .schema("creatorseal")
      .from("profiles")
      .select("email, plan_code, starter_access_until, referral_code")
      .eq("plan_code", "starter")
      .order("starter_access_until", { ascending: false })
      .limit(10)
  ]);

  const starterPrice = PLANS.starter.priceEur;
  const grossRevenue7d = (starterSignups7d ?? 0) * starterPrice;
  const grossRevenueAllTime = ((starterActiveCount ?? 0) + 0) * starterPrice; // active today
  const goalProgress = Math.min(
    100,
    Math.round(((starterActiveCount ?? 0) / 1000) * 100)
  );

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
            Admin · {user.email}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.01em" }}>
            Funnel-Zahlen.
          </h1>
        </div>

        <div
          className="card"
          style={{
            padding: 22,
            marginBottom: 20,
            border: "1px solid rgba(255, 215, 0, 0.3)",
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
              marginBottom: 8
            }}
          >
            Scale-Ziel
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            {starterActiveCount ?? 0} / 1000 aktive Starter · {goalProgress}%
          </div>
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 3,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${goalProgress}%`,
                height: "100%",
                background: "var(--gold)",
                transition: "width 300ms ease"
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 24
          }}
        >
          <Metric
            label="Aktive Starter"
            value={starterActiveCount ?? 0}
            color="var(--gold)"
          />
          <Metric
            label="Signups (24h)"
            value={starterSignups24h ?? 0}
            color="var(--cyan)"
          />
          <Metric
            label="Signups (7d)"
            value={starterSignups7d ?? 0}
            color="var(--cyan)"
          />
          <Metric
            label="Bezahlte Referrals"
            value={paidReferralsCount ?? 0}
            color="var(--green)"
          />
          <Metric
            label="Revenue (24h)"
            value={`€${((starterSignups24h ?? 0) * starterPrice).toFixed(2)}`}
            color="var(--green)"
          />
          <Metric
            label="Revenue (7d)"
            value={`€${grossRevenue7d.toFixed(2)}`}
            color="var(--green)"
          />
          <Metric
            label="Active starter-value"
            value={`€${grossRevenueAllTime.toFixed(2)}`}
            color="var(--gold)"
          />
          <Metric
            label="Webhook-Errors (24h)"
            value={webhookErrors24h ?? 0}
            color={(webhookErrors24h ?? 0) > 0 ? "#ff6b6b" : "var(--text-muted)"}
          />
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--text-subtle)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 14
            }}
          >
            Letzte 10 Starter (nach Ablaufdatum absteigend)
          </div>
          {!recentSignups || recentSignups.length === 0 ? (
            <div className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Noch keine Starter-Signups.
            </div>
          ) : (
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--text-subtle)" }}>
                  <th style={{ padding: "8px 6px", borderBottom: "1px solid var(--border)" }}>E-Mail</th>
                  <th style={{ padding: "8px 6px", borderBottom: "1px solid var(--border)" }}>Plan</th>
                  <th style={{ padding: "8px 6px", borderBottom: "1px solid var(--border)" }}>Läuft bis</th>
                  <th style={{ padding: "8px 6px", borderBottom: "1px solid var(--border)" }}>Ref-Code</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((row) => (
                  <tr key={row.email ?? Math.random()}>
                    <td style={{ padding: "8px 6px", borderBottom: "1px solid var(--border-subtle)" }}>
                      {row.email}
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid var(--border-subtle)",
                        color: "var(--gold)"
                      }}
                    >
                      {row.plan_code}
                    </td>
                    <td
                      className="mono"
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid var(--border-subtle)",
                        color: "var(--text-muted)"
                      }}
                    >
                      {row.starter_access_until
                        ? new Date(row.starter_access_until).toLocaleDateString("de-DE")
                        : "—"}
                    </td>
                    <td
                      className="mono"
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid var(--border-subtle)",
                        color: "var(--text-subtle)"
                      }}
                    >
                      {row.referral_code ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function Metric({
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
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
