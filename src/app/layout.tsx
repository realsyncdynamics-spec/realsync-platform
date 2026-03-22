import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'RealSync Dynamics — The Creator OS',
    template: '%s | RealSync Dynamics',
  },
  description: 'Das Creator OS für DACH — Trust-Score, KI-Reviews, Payment-Recovery, Brand Deals und OPTIMUS KI-Agent. Powered by Perplexity AI.',
  keywords: ['Creator OS', 'CreatorSeal', 'C2PA', 'Trust Score', 'Review Management', 'DACH', 'RealSync'],
  authors: [{ name: 'RealSync Dynamics', url: 'https://realsyncdynamics.de' }],
  openGraph: {
    title: 'RealSync Dynamics — The Creator OS',
    description: 'Trust-Score · KI-Reviews · Payment-Recovery · Brand Deals · OPTIMUS KI-Agent',
    url: 'https://realsyncdynamics.de',
    siteName: 'RealSync Dynamics',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealSync Dynamics — The Creator OS',
    description: 'Trust-Score · KI-Reviews · Payment-Recovery · Brand Deals · OPTIMUS',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
