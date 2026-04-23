import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(3, 5, 10, 0.95)",
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(12px)",
        height: 60,
        display: "flex",
        alignItems: "center"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              border: "2px solid var(--gold)",
              transform: "rotate(45deg)",
              position: "relative"
            }}
          >
            <div
              style={{ position: "absolute", inset: 2.5, background: "var(--gold)" }}
            />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-0.01em" }}>
            RealSync<span style={{ color: "var(--gold)" }}>Dynamics</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Link
            href="/#features"
            className="mono nav-link"
            style={{
              fontSize: 11,
              padding: "6px 12px",
              color: "var(--text-muted)"
            }}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="mono nav-link"
            style={{
              fontSize: 11,
              padding: "6px 12px",
              color: "var(--text-muted)"
            }}
          >
            Preise
          </Link>
          <div
            style={{
              width: 1,
              height: 18,
              background: "var(--border)",
              margin: "0 6px"
            }}
          />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="mono"
                style={{
                  fontSize: 11,
                  padding: "6px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  color: "var(--text-muted)"
                }}
              >
                Dashboard
              </Link>
              <form action="/auth/signout" method="post" style={{ display: "inline" }}>
                <button
                  type="submit"
                  className="mono"
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    color: "var(--text-subtle)"
                  }}
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mono"
                style={{
                  fontSize: 11,
                  padding: "6px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  color: "var(--text-muted)"
                }}
              >
                Login
              </Link>
              <Link
                href="/login"
                className="btn-primary"
                style={{
                  fontSize: 12,
                  padding: "8px 18px",
                  marginLeft: 6
                }}
              >
                Kostenlos starten
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
