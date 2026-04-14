import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://realsyncdynamics.de';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/hub',
          '/api/',
          '/admin/',
          '/checkout/',
          '/onboarding/',
          '/apps/',
        ],
      },
      {
        // Block AI training crawlers
        userAgent: [
          'GPTBot',
          'Google-Extended',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
