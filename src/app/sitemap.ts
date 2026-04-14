import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://realsyncdynamics.de';

  const now = new Date();

  // Public-facing routes only (no auth-gated pages)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/register`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/products`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // App landing pages
    { url: `${base}/creatorseal`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reviewradar`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/churnrescue`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/waitlistkit`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/optimus`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/workflows`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // Legal (required for indexing)
    { url: `${base}/impressum`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/datenschutz`,lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/agb`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  return staticRoutes;
}
