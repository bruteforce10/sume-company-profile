// Draft preview read. Unlike the public reads in src/lib/blog.ts (anon client,
// published posts only), this uses the server (cookie-bound) client so a
// signed-in admin can preview an unpublished or scheduled article at its real
// public URL. It is deliberately NOT cached — a preview must always reflect the
// latest saved content — and returns null for non-admins so drafts stay private.
import { getAuthContext } from "@/lib/auth";
import { DETAIL_SELECT, mapDetail, type RawPostRow } from "@/lib/blog-query";
import type { BlogPostDetail } from "@/lib/blog-types";
import { createClient } from "@/lib/supabase/server";

export async function getDraftPreviewBySlug(slug: string): Promise<BlogPostDetail | null> {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapDetail(data as unknown as RawPostRow);
}
