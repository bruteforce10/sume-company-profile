// Shared PostgREST select strings + row mappers, used by both the public cached
// reads (src/lib/blog.ts, anon client) and the admin reads/writes (server
// client). Pure functions — no client/server-only imports — so either side can
// use them.
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostDetail,
  BlogPostSummary,
  BlogReference,
  BlogTag,
} from "@/lib/blog-types";

// Tags come back nested as `{ tag: {...} }` via the junction table.
export const SUMMARY_SELECT =
  "*, author:blog_authors(*), category:blog_categories(*), tags:blog_post_tags(tag:blog_tags(*))";
export const DETAIL_SELECT = `${SUMMARY_SELECT}, references:blog_references(*)`;

// Raw row shape as returned by the Data API (relations embedded).
export type RawPostRow = BlogPost & {
  author: BlogAuthor | null;
  category: BlogCategory | null;
  tags: { tag: BlogTag | null }[] | null;
  references: BlogReference[] | null;
};

// Build a BlogPost explicitly (avoids leaking embedded join columns and keeps
// the mappers lint-clean without spreads/unused destructures).
export function mapSummary(row: RawPostRow): BlogPostSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    thumbnail: row.thumbnail,
    content: row.content,
    excerpt: row.excerpt,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    author_id: row.author_id,
    category_id: row.category_id,
    reading_time: row.reading_time,
    views: row.views,
    featured: row.featured,
    is_draft: row.is_draft,
    published_at: row.published_at,
    scheduled_at: row.scheduled_at,
    internal_links: row.internal_links ?? [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: row.author ?? null,
    category: row.category ?? null,
    tags: (row.tags ?? [])
      .map((t) => t.tag)
      .filter((t): t is BlogTag => Boolean(t)),
  };
}

export function mapDetail(row: RawPostRow): BlogPostDetail {
  return {
    ...mapSummary(row),
    references: [...(row.references ?? [])].sort((a, b) => a.position - b.position),
  };
}
