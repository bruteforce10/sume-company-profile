"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { requireAdmin } from "@/lib/auth";
import { BLOG_CACHE_TAG } from "@/lib/blog";
import { calcReadingTime, slugify } from "@/lib/blog-utils";
import {
  BLOG_BUCKET,
  blogAssetPath,
  contentImageUrls,
  orphanedAssetPaths,
} from "@/lib/blog-storage";
import { createClient } from "@/lib/supabase/server";

export type PostActionState = { ok: boolean; error: string | null; ts: number };

type ServerClient = Awaited<ReturnType<typeof createClient>>;

// Keep the sanitize profile in sync with SafeHtml's "article" profile: article
// bodies are sanitized here on save AND again on render (defense in depth).
const SANITIZE_CONFIG = { ADD_ATTR: ["target", "rel", "loading"] };

function fail(error: string): PostActionState {
  return { ok: false, error, ts: Date.now() };
}

function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

type ParsedRef = { title: string; url: string; accessed_at: string | null };

type ParsedPost = {
  row: Record<string, unknown>;
  tagIds: string[];
  references: ParsedRef[];
  isDraft: boolean;
};

function parsePost(formData: FormData): ParsedPost | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Judul wajib diisi." };

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(title);
  if (!slug) return { error: "Slug tidak valid." };

  const content = DOMPurify.sanitize(String(formData.get("content") ?? ""), SANITIZE_CONFIG);
  const isDraft = formData.get("isDraft") === "on";
  const featured = formData.get("featured") === "on";

  const scheduledInput = String(formData.get("scheduledAt") ?? "").trim();
  const scheduled_at = scheduledInput ? new Date(scheduledInput).toISOString() : null;

  const internalLinks = parseJsonArray<{ label?: string; url?: string }>(
    formData.get("internalLinks"),
  )
    .filter((l) => typeof l?.url === "string" && l.url.trim() !== "")
    .map((l) => ({ label: String(l.label ?? "").trim() || String(l.url), url: String(l.url).trim() }));

  const references: ParsedRef[] = parseJsonArray<{
    title?: string;
    url?: string;
    accessed_at?: string | null;
  }>(formData.get("references"))
    .filter((r) => typeof r?.url === "string" && r.url.trim() !== "")
    .map((r) => ({
      title: String(r.title ?? "").trim() || String(r.url),
      url: String(r.url).trim(),
      accessed_at: r.accessed_at ? new Date(r.accessed_at).toISOString() : null,
    }));

  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);
  const authorId = String(formData.get("authorId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const thumbnail = String(formData.get("thumbnail") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();

  return {
    tagIds,
    references,
    isDraft,
    row: {
      title,
      slug,
      thumbnail: thumbnail || null,
      content,
      excerpt: excerpt || null,
      // SEO metadata mirrors the article's own title/summary — no separate fields.
      meta_title: title,
      meta_description: excerpt || null,
      author_id: authorId || null,
      category_id: categoryId || null,
      reading_time: calcReadingTime(content),
      featured,
      is_draft: isDraft,
      scheduled_at,
      internal_links: internalLinks,
    },
  };
}

// Replace a post's tags + references (simple delete-then-insert).
async function syncRelations(
  supabase: ServerClient,
  postId: string,
  tagIds: string[],
  references: ParsedRef[],
): Promise<string | null> {
  await supabase.from("blog_post_tags").delete().eq("post_id", postId);
  if (tagIds.length) {
    const { error } = await supabase
      .from("blog_post_tags")
      .insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
    if (error) return `Gagal menyimpan tag: ${error.message}`;
  }

  await supabase.from("blog_references").delete().eq("post_id", postId);
  if (references.length) {
    const { error } = await supabase.from("blog_references").insert(
      references.map((r, position) => ({ post_id: postId, ...r, position })),
    );
    if (error) return `Gagal menyimpan referensi: ${error.message}`;
  }
  return null;
}

// Deletes the given in-bucket object paths from Storage (deduped). Best-effort:
// a failure is logged, not surfaced — the DB write already succeeded and a
// lingering file is harmless (and re-cleanable), whereas failing the whole action
// over a storage hiccup would be worse.
async function removeStoragePaths(
  supabase: ServerClient,
  paths: string[],
): Promise<void> {
  const unique = [...new Set(paths)].filter(Boolean);
  if (unique.length === 0) return;
  const { error } = await supabase.storage.from(BLOG_BUCKET).remove(unique);
  if (error) console.error(`[blog] gagal menghapus aset storage: ${error.message}`);
}

// Collects the bucket paths for a post's thumbnail + all its content images.
function postAssetPaths(thumbnail: string | null, content: string): string[] {
  return [thumbnail, ...contentImageUrls(content)]
    .map(blogAssetPath)
    .filter((p): p is string => Boolean(p));
}

function revalidateBlog() {
  // Both primitives, per Next 16 docs: expire the cached data (blog reads) AND
  // invalidate prerendered routes so public pages re-render with fresh content.
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/blog", "layout");
  revalidatePath("/admin/blog");
}

export async function createPost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  await requireAdmin();
  const parsed = parsePost(formData);
  if ("error" in parsed) return fail(parsed.error);

  const supabase = await createClient();
  const published_at = parsed.isDraft ? null : new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...parsed.row, published_at })
    .select("id")
    .single();
  if (error || !data) {
    return fail(`Gagal membuat artikel: ${error?.message ?? "kesalahan tak terduga"}`);
  }

  const syncError = await syncRelations(
    supabase,
    (data as { id: string }).id,
    parsed.tagIds,
    parsed.references,
  );
  if (syncError) return fail(syncError);

  revalidateBlog();
  redirect("/admin/blog");
}

export async function updatePost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return fail("ID artikel tidak ditemukan.");

  const parsed = parsePost(formData);
  if ("error" in parsed) return fail(parsed.error);

  const supabase = await createClient();

  // Preserve the original publish time; stamp it the first time it goes live.
  // Also read the current thumbnail + content so we can free any images this
  // edit drops from the bucket.
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at, thumbnail, content")
    .eq("id", id)
    .maybeSingle();
  const prev = existing as
    | { published_at: string | null; thumbnail: string | null; content: string | null }
    | null;
  const current = prev?.published_at ?? null;
  const published_at = !parsed.isDraft && !current ? new Date().toISOString() : current;

  const { error } = await supabase
    .from("blog_posts")
    .update({ ...parsed.row, published_at })
    .eq("id", id);
  if (error) return fail(`Gagal menyimpan: ${error.message}`);

  const syncError = await syncRelations(supabase, id, parsed.tagIds, parsed.references);
  if (syncError) return fail(syncError);

  // Reconcile Storage: delete the old thumbnail / content images that this save
  // no longer references. Runs only after the DB write succeeds.
  const newThumbnail = parsed.row.thumbnail as string | null;
  const newContent = parsed.row.content as string;
  await removeStoragePaths(
    supabase,
    orphanedAssetPaths(
      [prev?.thumbnail ?? null, ...contentImageUrls(prev?.content ?? "")],
      [newThumbnail, ...contentImageUrls(newContent)],
    ),
  );

  revalidateBlog();
  return { ok: true, error: null, ts: Date.now() };
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();

  // Read the images first so we can free them once the row (and its DB cascade)
  // is gone — nothing else can reference a post's own uploads.
  const { data } = await supabase
    .from("blog_posts")
    .select("thumbnail, content")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("blog_posts").delete().eq("id", id); // cascades tags/refs/views

  if (data) {
    const row = data as { thumbnail: string | null; content: string | null };
    await removeStoragePaths(supabase, postAssetPaths(row.thumbnail, row.content ?? ""));
  }
  revalidateBlog();
}

export async function togglePublish(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("is_draft, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) return;
  const row = data as { is_draft: boolean; published_at: string | null };
  const nextDraft = !row.is_draft;
  const published_at =
    !nextDraft && !row.published_at ? new Date().toISOString() : row.published_at;
  await supabase.from("blog_posts").update({ is_draft: nextDraft, published_at }).eq("id", id);
  revalidateBlog();
}
