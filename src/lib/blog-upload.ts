import { createClient } from "@/lib/supabase/client";
import { BLOG_BUCKET, blogAssetPath } from "@/lib/blog-storage";

// Uploads/deletes use the browser client, which carries the signed-in admin's
// session, so the blog_assets insert/delete RLS policies (is_admin()) are
// satisfied. Client-only. The bucket + path helpers live in @/lib/blog-storage.

/**
 * Uploads an image to the blog-assets bucket and returns its public URL.
 * Throws on invalid type or upload error (callers surface the message via toast).
 */
export async function uploadBlogImage(file: File, folder = "posts"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya berkas gambar yang dapat diunggah.");
  }
  const supabase = createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BLOG_BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Removes a previously-uploaded image from the bucket. Best-effort: no-ops for
 * URLs that aren't our uploads and only warns on failure (a lingering file is
 * harmless, whereas throwing would break the form UX). Callers should only pass
 * URLs they know are unreferenced (e.g. a file uploaded and discarded in the
 * same form session, before it was ever persisted).
 */
export async function deleteBlogImage(url: string): Promise<void> {
  const path = blogAssetPath(url);
  if (!path) return;
  const supabase = createClient();
  const { error } = await supabase.storage.from(BLOG_BUCKET).remove([path]);
  if (error) console.warn(`[blog] gagal menghapus gambar: ${error.message}`);
}
