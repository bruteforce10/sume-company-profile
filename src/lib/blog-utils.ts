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

// Void/self-closing elements that never wrap children, so at the top level each
// is its own block (e.g. a full-width image between paragraphs).
const VOID_TAGS = new Set(["img", "hr", "br", "input", "source", "wbr"]);

/**
 * Splits editor HTML into its top-level block elements (`<p>`, `<h2>`, `<ul>`,
 * `<img>`, …). Tracks tag depth so nested lists/tables/links stay inside a single
 * block and a tag is never cut in half — lets a caller drop something (e.g. a
 * "Baca juga" card) between two blocks in the middle of an article.
 */
export function splitHtmlBlocks(html: string): string[] {
  const blocks: string[] = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  let depth = 0;
  let start = 0;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(html)) !== null) {
    const isClosing = match[1] === "/";
    const isVoid = match[3] === "/" || VOID_TAGS.has(match[2].toLowerCase());
    if (isVoid) {
      if (depth === 0) {
        blocks.push(html.slice(start, tagRe.lastIndex));
        start = tagRe.lastIndex;
      }
      continue;
    }
    if (isClosing) {
      depth = Math.max(0, depth - 1);
      if (depth === 0) {
        blocks.push(html.slice(start, tagRe.lastIndex));
        start = tagRe.lastIndex;
      }
    } else {
      depth += 1;
    }
  }
  if (start < html.length && html.slice(start).trim()) blocks.push(html.slice(start));
  return blocks.map((b) => b.trim()).filter(Boolean);
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

/**
 * True when `updated` lands on a *later calendar day* than `published`. Same-day
 * saves aren't a meaningful update, so they're not surfaced on the article (the
 * "Diperbarui" line) or in SEO metadata (OpenGraph modifiedTime / JSON-LD
 * dateModified). Returns false if either date is missing or invalid.
 */
export function isMeaningfulUpdate(
  published: string | null,
  updated: string | null,
): boolean {
  if (!published || !updated) return false;
  const p = new Date(published);
  const u = new Date(updated);
  if (Number.isNaN(p.getTime()) || Number.isNaN(u.getTime())) return false;
  return u.toDateString() !== p.toDateString();
}
