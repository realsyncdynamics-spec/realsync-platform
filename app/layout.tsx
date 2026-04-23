import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RealSync Dynamics — Creator Trust Platform",
    template: "%s | RealSync Dynamics"
  },
  description:
    "Creator Trust-Score und Content-Verifikation für den DACH-Markt. Beta — jetzt testen.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
