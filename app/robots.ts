import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL || "https://realsyncdynamics.de";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/dashboard",
          "/admin",
          "/r/"
        ]
      }
    ],
    sitemap: `${site}/sitemap.xml`
  };
}
