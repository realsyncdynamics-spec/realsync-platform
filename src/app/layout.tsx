import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealSync Platform",
  description: "Multi-Tenant SaaS Platform for Creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen">{children}</body>
    </html>
  );
}
