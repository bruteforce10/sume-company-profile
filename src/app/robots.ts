import type { MetadataRoute } from "next";
import { siteUrl } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes hold no indexable content.
      disallow: "/api/",
    },
    // Static pages + the dedicated blog sitemap (src/app/blog/sitemap.ts).
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/blog/sitemap.xml`],
    host: siteUrl,
  };
}
