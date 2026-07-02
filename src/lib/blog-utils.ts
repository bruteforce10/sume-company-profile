// Pure blog helpers — safe to import from both server and client components.
import type { Locale } from "@/i18n/routing";

/**
 * Builds an SEO-friendly slug from arbitrary text. Strips diacritics, lowercases,
 * and collapses non-alphanumerics into single hyphens. Used to pre-fill the slug
 * field in the editor (still user-editable).
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Estimates reading time in minutes from rendered HTML (~200 words/minute).
 * Always at least 1. Tags are stripped before counting words.
 */
export function calcReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Formats an ISO date (or Date) as a human-readable string. Defaults to
 * Indonesian, since the blog is ID-only.
 */
export function formatDate(date: string | Date, locale: Locale = "id"): string {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}
