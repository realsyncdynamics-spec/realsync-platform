import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Login"
};

async function signInWithGoogle() {
  "use server";

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.url) {
    redirect(data.url);
  }

  redirect("/login?error=no_redirect_url");
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = await searchParams;

  // If already logged in, go straight to dashboard
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Nav />

      <main
        style={{
          minHeight: "calc(100vh - 60px - 120px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px"
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div className="card fade-up" style={{ padding: 36 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--gold)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 12
              }}
            >
              Login · Registrierung
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                marginBottom: 10,
                letterSpacing: "-0.01em"
              }}
            >
              Willkommen.
            </h1>
            <p
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 28,
                lineHeight: 1.7
              }}
            >
              Ein Klick, dann bist du drin. Keine Passwörter, keine Formulare.
            </p>

            {params.error && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 8,
                  marginBottom: 20
                }}
              >
                <div className="mono" style={{ fontSize: 11, color: "var(--red)" }}>
                  {decodeURIComponent(params.error)}
                </div>
              </div>
            )}

            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="google-btn"
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  background: "#FFFFFF",
                  color: "#1F1F1F",
                  border: "1px solid #DADCE0",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transition: "box-shadow 0.2s, background 0.2s",
                  cursor: "pointer"
                }}
              >
                <GoogleLogo />
                Mit Google fortfahren
              </button>
            </form>

            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid var(--border)"
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-subtle)",
                  lineHeight: 1.7
                }}
              >
                🔒 Sichere Anmeldung via Google OAuth 2.0.
                <br />
                Wir speichern keine Passwörter und sehen dein Google-Passwort nicht.
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid var(--border-subtle)"
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-subtle)",
                  lineHeight: 1.7
                }}
              >
                Mit der Anmeldung akzeptierst du unsere{" "}
                <Link href="/agb" style={{ color: "var(--gold)" }}>
                  AGB
                </Link>{" "}
                und{" "}
                <Link href="/datenschutz" style={{ color: "var(--gold)" }}>
                  Datenschutzerklärung
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// Google "G" logo - official multi-color SVG
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.26h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
