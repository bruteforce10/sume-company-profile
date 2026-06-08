import type { MetadataRoute } from "next";
import { siteUrl } from "@/constants/site";

type Route = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
