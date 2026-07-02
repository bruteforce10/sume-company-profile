// Pure helpers for reasoning about blog-assets Storage objects. No Supabase or
// client/server-only imports, so both the browser editor/forms and the server
// actions can use them to keep uploaded images from orphaning in the bucket.

/** The public Storage bucket that holds all blog images (created in Phase 1). */
export const BLOG_BUCKET = "blog-assets";

const PUBLIC_MARKER = `/storage/v1/object/public/${BLOG_BUCKET}/`;

/**
 * Extracts the in-bucket object path from a blog-assets public URL. Returns null
 * for anything that isn't one of our uploads (external images pasted into an
 * article, empty values), so callers never try to delete a file they don't own.
 */
export function blogAssetPath(url: string | null | undefined): string | null {
  if (!url) return null;
  const i = url.indexOf(PUBLIC_MARKER);
  if (i === -1) return null;
  const path = url.slice(i + PUBLIC_MARKER.length).split(/[?#]/)[0];
  return path || null;
}

/** Every `<img>` source referenced in a blob of article HTML (Tiptap output). */
export function contentImageUrls(html: string): string[] {
  const urls: string[] = [];
  const re = /<img\b[^>]*?\ssrc="([^"]+)"/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) urls.push(match[1]);
  return urls;
}

/**
 * Given the image URLs a record referenced *before* an edit and the ones it
 * references *now*, returns the unique in-bucket paths that are safe to delete:
 * referenced before, gone now, and owned by our bucket. Used to reconcile
 * Storage whenever a record is saved.
 */
export function orphanedAssetPaths(
  oldUrls: (string | null | undefined)[],
  newUrls: (string | null | undefined)[],
): string[] {
  const keep = new Set(newUrls.filter((u): u is string => Boolean(u)));
  const paths = new Set<string>();
  for (const url of oldUrls) {
    if (!url || keep.has(url)) continue;
    const path = blogAssetPath(url);
    if (path) paths.add(path);
  }
  return [...paths];
}
