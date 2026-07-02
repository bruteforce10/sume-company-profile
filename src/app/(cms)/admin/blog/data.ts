// Admin-side reads. These use the server (cookie-bound) Supabase client, so the
// signed-in admin's session satisfies the "blog_posts_select_admin" RLS policy
// and drafts / scheduled posts are visible here (unlike the public reads in
// src/lib/blog.ts, which use the anon client and see published posts only).
import { DETAIL_SELECT, mapDetail, type RawPostRow } from "@/lib/blog-query";
import type { BlogAuthor, BlogCategory, BlogPostDetail, BlogTag } from "@/lib/blog-types";
import { createClient } from "@/lib/supabase/server";

export type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  is_draft: boolean;
  featured: boolean;
  views: number;
  published_at: string | null;
  scheduled_at: string | null;
  updated_at: string;
  author: { name: string } | null;
  category: { name: string } | null;
};

export async function listAdminPosts(): Promise<AdminPostRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, is_draft, featured, views, published_at, scheduled_at, updated_at, author:blog_authors(name), category:blog_categories(name)",
    )
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as AdminPostRow[];
}

export async function getAdminPost(id: string): Promise<BlogPostDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapDetail(data as unknown as RawPostRow);
}

export type FormOptions = {
  authors: BlogAuthor[];
  categories: BlogCategory[];
  tags: BlogTag[];
};

export async function getFormOptions(): Promise<FormOptions> {
  const supabase = await createClient();
  const [authors, categories, tags] = await Promise.all([
    supabase.from("blog_authors").select("*").order("name"),
    supabase.from("blog_categories").select("*").order("name"),
    supabase.from("blog_tags").select("*").order("name"),
  ]);
  return {
    authors: (authors.data as unknown as BlogAuthor[]) ?? [],
    categories: (categories.data as unknown as BlogCategory[]) ?? [],
    tags: (tags.data as unknown as BlogTag[]) ?? [],
  };
}

// Taxonomy list reads for the CRUD screens (Phase 7). Server (cookie-bound)
// client; taxonomy is public-readable so the admin sees the same rows the public
// does, just editable here.
export async function listAuthors(): Promise<BlogAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_authors").select("*").order("name");
  return (data as unknown as BlogAuthor[]) ?? [];
}

export async function listCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_categories").select("*").order("name");
  return (data as unknown as BlogCategory[]) ?? [];
}

export async function listTags(): Promise<BlogTag[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_tags").select("*").order("name");
  return (data as unknown as BlogTag[]) ?? [];
}
