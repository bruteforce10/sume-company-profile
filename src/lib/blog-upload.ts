// Client helpers for blog-asset uploads/deletes. The real Storage calls run
// server-side (src/app/api/blog/upload/route.ts): the self-hosted Supabase is
// HTTP-only, so uploading straight from the browser on the deployed HTTPS site
// is blocked as mixed content. The returned URL is a same-origin proxy path
// (src/app/api/blog/image/[...path]) that loads fine over HTTPS.

/**
 * Uploads an image to the blog-assets bucket and returns its (same-origin)
 * proxy URL. Throws on invalid type or upload error (callers surface the
 * message via toast).
 */
export async function uploadBlogImage(file: File, folder = "posts"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya berkas gambar yang dapat diunggah.");
  }
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  const res = await fetch("/api/blog/upload", { method: "POST", body });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) {
    throw new Error(data?.error ?? "Gagal mengunggah gambar.");
  }
  return data.url;
}

/**
 * Removes a previously-uploaded image from the bucket. Best-effort: the server
 * route no-ops for URLs that aren't our uploads and only warns on failure (a
 * lingering file is harmless, whereas throwing would break the form UX). Callers
 * should only pass URLs they know are unreferenced (e.g. a file uploaded and
 * discarded in the same form session, before it was ever persisted).
 */
export async function deleteBlogImage(url: string): Promise<void> {
  if (!url) return;
  await fetch(`/api/blog/upload?url=${encodeURIComponent(url)}`, {
    method: "DELETE",
  }).catch(() => {});
}
