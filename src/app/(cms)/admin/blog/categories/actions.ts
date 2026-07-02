"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { BLOG_CACHE_TAG } from "@/lib/blog";
import { slugify } from "@/lib/blog-utils";
import { BLOG_BUCKET, blogAssetPath } from "@/lib/blog-storage";
import { createClient } from "@/lib/supabase/server";
import type { TaxActionState } from "../taxonomy";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

function fail(error: string): TaxActionState {
  return { ok: false, error, ts: Date.now() };
}

// Best-effort removal of a single uploaded image (icon) from the bucket.
async function removeAsset(supabase: ServerClient, url: string | null): Promise<void> {
  const path = blogAssetPath(url);
  if (!path) return;
  const { error } = await supabase.storage.from(BLOG_BUCKET).remove([path]);
  if (error) console.error(`[blog] gagal menghapus aset: ${error.message}`);
}

function revalidate() {
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/blog", "layout");
  revalidatePath("/admin/blog/categories");
}

export async function saveCategory(
  _prev: TaxActionState,
  formData: FormData,
): Promise<TaxActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return fail("Nama wajib diisi.");

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return fail("Slug tidak valid.");

  const row = {
    name,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    icon: String(formData.get("icon") ?? "").trim() || null,
  };

  const supabase = await createClient();

  // On update, remember the current icon so we can free it if it changed.
  let oldIcon: string | null = null;
  if (id) {
    const { data: existing } = await supabase
      .from("blog_categories")
      .select("icon")
      .eq("id", id)
      .maybeSingle();
    oldIcon = (existing as { icon: string | null } | null)?.icon ?? null;
  }

  const { error } = id
    ? await supabase.from("blog_categories").update(row).eq("id", id)
    : await supabase.from("blog_categories").insert(row);
  if (error) {
    const dup = error.code === "23505";
    return fail(dup ? "Slug sudah digunakan kategori lain." : `Gagal menyimpan: ${error.message}`);
  }

  if (id && oldIcon && oldIcon !== row.icon) await removeAsset(supabase, oldIcon);

  revalidate();
  return { ok: true, error: null, ts: Date.now() };
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_categories")
    .select("icon")
    .eq("id", id)
    .maybeSingle();
  // posts.category_id is ON DELETE SET NULL, so existing articles are preserved.
  await supabase.from("blog_categories").delete().eq("id", id);
  if (data) await removeAsset(supabase, (data as { icon: string | null }).icon);
  revalidate();
}
