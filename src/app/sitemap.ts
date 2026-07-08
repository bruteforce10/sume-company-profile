import type { MetadataRoute } from "next";
import { siteUrl } from "@/constants/site";
import { routing } from "@/i18n/routing";
import { getSitemapData, type SitemapEntry } from "@/lib/blog";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

type Route = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

const routes: Route[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/data-center", changeFrequency: "monthly", priority: 0.9 },
  { path: "/our-project", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/regional", changeFrequency: "monthly", priority: 0.6 },
];

/** Builds an absolute URL for a locale-prefixed path. */
function localizedUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const suffix = path === "/" ? "" : path;
  return `${siteUrl}${prefix}${suffix}`;
}

// The blog is Indonesian-only (non-default locales 404), so blog URLs carry no
// locale prefix and no hreflang alternates — matching each page's canonical.
function blogSection(
  basePath: string,
  entries: SitemapEntry[],
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap {
  return entries.map(({ slug, lastModified }) => ({
    url: `${siteUrl}${basePath}/${slug}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = routes.flatMap(
    ({ path, changeFrequency, priority }) => {
      const languages = Object.fromEntries(
        routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
      );

      return routing.locales.map((locale) => ({
        url: localizedUrl(locale, path),
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages },
      }));
    },
  );

  const blog = await getSitemapData();

  // The blog index effectively changed when its newest entry did; fall back to
  // the build date while there are no posts yet.
  const blogLastModified = blog.posts.reduce<string | null>(
    (max, post) =>
      !max || new Date(post.lastModified) > new Date(max)
        ? post.lastModified
        : max,
    null,
  );

  return [
    ...staticEntries,
    {
      url: `${siteUrl}/blog`,
      lastModified: blogLastModified ?? lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogSection("/blog", blog.posts, "monthly", 0.7),
    ...blogSection("/blog/category", blog.categories, "weekly", 0.6),
    ...blogSection("/blog/tag", blog.tags, "weekly", 0.5),
    ...blogSection("/blog/author", blog.authors, "monthly", 0.4),
  ];
}
