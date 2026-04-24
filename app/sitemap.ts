import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";
  const now = new Date();

  const pages: { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/starter", changeFrequency: "weekly", priority: 0.9 },
    { path: "/login", changeFrequency: "monthly", priority: 0.5 },
    { path: "/impressum", changeFrequency: "monthly", priority: 0.3 },
    { path: "/datenschutz", changeFrequency: "monthly", priority: 0.3 },
    { path: "/agb", changeFrequency: "monthly", priority: 0.3 }
  ];

  return pages.map((p) => ({
    url: `${site}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority
  }));
}
