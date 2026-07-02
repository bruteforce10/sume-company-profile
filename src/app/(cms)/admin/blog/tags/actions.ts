"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { BLOG_CACHE_TAG } from "@/lib/blog";
import { slugify } from "@/lib/blog-utils";
import { createClient } from "@/lib/supabase/server";
import type { TaxActionState } from "../taxonomy";

function fail(error: string): TaxActionState {
  return { ok: false, error, ts: Date.now() };
}

function revalidate() {
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/blog", "layout");
  revalidatePath("/admin/blog/tags");
}

export async function saveTag(
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

  const row = { name, slug };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("blog_tags").update(row).eq("id", id)
    : await supabase.from("blog_tags").insert(row);
  if (error) {
    const dup = error.code === "23505";
    return fail(dup ? "Slug sudah digunakan tag lain." : `Gagal menyimpan: ${error.message}`);
  }

  revalidate();
  return { ok: true, error: null, ts: Date.now() };
}

export async function deleteTag(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = await createClient();
  // blog_post_tags rows cascade on delete, so the tag drops off its articles.
  await supabase.from("blog_tags").delete().eq("id", id);
  revalidate();
}
