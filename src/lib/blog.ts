import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  DETAIL_SELECT,
  mapDetail,
  mapSummary,
  SUMMARY_SELECT,
  type RawPostRow,
} from "@/lib/blog-query";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostDetail,
  BlogPostSummary,
  BlogTag,
  PaginatedPosts,
} from "@/lib/blog-types";

// Cache tag for all public blog reads. The CMS revalidates this tag after every
// mutation so edits go live without a redeploy (mirrors MESSAGES_CACHE_TAG).
export const BLOG_CACHE_TAG = "blog";

// Reads are cached for a few minutes. Because the published-visibility predicate
// (in RLS) is evaluated with now() per query, a scheduled post becomes visible
// within one revalidate window with no deploy — see Phase 8 of the plan.
const BLOG_REVALIDATE = 300;

export const DEFAULT_PAGE_SIZE = 9;

// SELECT strings and row mappers are shared with the admin server-side reads —
// see src/lib/blog-query.ts.

// Escape user search input for a PostgREST `or()` filter (commas/parens are
// syntactically significant; `%`/`*` are ilike wildcards).
function sanitizeTerm(query: string): string {
  return query.trim().replace(/[%,()*]/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------

type ListOptions = {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  query?: string;
};

async function fetchPublishedPosts(opts: ListOptions = {}): Promise<PaginatedPosts> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, categorySlug, query } = opts;
  const supabase = createPublicClient();

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (!cat) return { posts: [], total: 0, page, pageSize };
    categoryId = (cat as { id: string }).id;
  }

  let q = supabase
    .from("blog_posts")
    .select(SUMMARY_SELECT, { count: "exact" })
    .order("published_at", { ascending: false });

  if (categoryId) q = q.eq("category_id", categoryId);

  const term = query ? sanitizeTerm(query) : "";
  if (term) {
    q = q.or(
      `title.ilike.%${term}%,excerpt.ilike.%${term}%,meta_description.ilike.%${term}%`,
    );
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await q.range(from, from + pageSize - 1);

  if (error) {
    console.error(`[blog] getPublishedPosts failed: ${error.message}`);
    return { posts: [], total: 0, page, pageSize };
  }

  return {
    posts: (data as unknown as RawPostRow[]).map(mapSummary),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export const getPublishedPosts = unstable_cache(fetchPublishedPosts, ["blog:published"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

// Category listing is just a filtered published-posts query.
export function getPostsByCategory(
  slug: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedPosts> {
  return getPublishedPosts({ categorySlug: slug, page, pageSize });
}

export type CategoryWithPosts = { category: BlogCategory; posts: BlogPostSummary[] };

// Front-page grouping: every category paired with its most recent posts (empty
// categories dropped). N+1 queries, but cached as one unit — fine for the handful
// of blog categories this site has.
async function fetchPostsGroupedByCategory(perCategory = 3): Promise<CategoryWithPosts[]> {
  const categories = await fetchCategories();
  const groups = await Promise.all(
    categories.map(async (category) => {
      const { posts } = await fetchPublishedPosts({
        categorySlug: category.slug,
        page: 1,
        pageSize: perCategory,
      });
      return { category, posts };
    }),
  );
  return groups.filter((group) => group.posts.length > 0);
}

export const getPostsGroupedByCategory = unstable_cache(
  fetchPostsGroupedByCategory,
  ["blog:grouped"],
  { tags: [BLOG_CACHE_TAG], revalidate: BLOG_REVALIDATE },
);

async function fetchPostsByTag(
  slug: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedPosts> {
  const supabase = createPublicClient();
  const { data: tag } = await supabase
    .from("blog_tags")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!tag) return { posts: [], total: 0, page, pageSize };

  const from = (page - 1) * pageSize;
  // `!inner` on an aliased second embed of the junction filters parent posts to
  // those carrying the tag, while the first embed still returns all their tags.
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select(`${SUMMARY_SELECT}, match_tag:blog_post_tags!inner(tag_id)`, {
      count: "exact",
    })
    .eq("match_tag.tag_id", (tag as { id: string }).id)
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error(`[blog] getPostsByTag failed: ${error.message}`);
    return { posts: [], total: 0, page, pageSize };
  }

  return {
    posts: (data as unknown as RawPostRow[]).map(mapSummary),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export const getPostsByTag = unstable_cache(fetchPostsByTag, ["blog:by-tag"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

async function fetchPostsByAuthor(
  slug: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Promise<PaginatedPosts> {
  const supabase = createPublicClient();
  const { data: author } = await supabase
    .from("blog_authors")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!author) return { posts: [], total: 0, page, pageSize };

  const from = (page - 1) * pageSize;
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select(SUMMARY_SELECT, { count: "exact" })
    .eq("author_id", (author as { id: string }).id)
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error(`[blog] getPostsByAuthor failed: ${error.message}`);
    return { posts: [], total: 0, page, pageSize };
  }

  return {
    posts: (data as unknown as RawPostRow[]).map(mapSummary),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export const getPostsByAuthor = unstable_cache(fetchPostsByAuthor, ["blog:by-author"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

// ---------------------------------------------------------------------------
// Single post + related collections
// ---------------------------------------------------------------------------

async function fetchPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapDetail(data as unknown as RawPostRow);
}

export const getPostBySlug = unstable_cache(fetchPostBySlug, ["blog:by-slug"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

async function fetchFeaturedPost(): Promise<BlogPostSummary | null> {
  const supabase = createPublicClient();
  const featured = await supabase
    .from("blog_posts")
    .select(SUMMARY_SELECT)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (featured.data) return mapSummary(featured.data as unknown as RawPostRow);

  const newest = await supabase
    .from("blog_posts")
    .select(SUMMARY_SELECT)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return newest.data ? mapSummary(newest.data as unknown as RawPostRow) : null;
}

export const getFeaturedPost = unstable_cache(fetchFeaturedPost, ["blog:featured"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

async function fetchRecentPosts(limit = 5, excludeId?: string): Promise<BlogPostSummary[]> {
  const supabase = createPublicClient();
  let q = supabase
    .from("blog_posts")
    .select(SUMMARY_SELECT)
    .order("published_at", { ascending: false });
  if (excludeId) q = q.neq("id", excludeId);
  const { data, error } = await q.limit(limit);
  if (error || !data) return [];
  return (data as unknown as RawPostRow[]).map(mapSummary);
}

export const getRecentPosts = unstable_cache(fetchRecentPosts, ["blog:recent"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

// Popular within the last N days, ranked by view count. Backed by the
// get_popular_posts RPC so the private blog_post_views table stays unreadable.
async function fetchPopularPosts(days = 30, limit = 5): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_popular_posts", {
    p_days: days,
    p_limit: limit,
  });
  if (error || !data) return [];
  return data as unknown as BlogPost[];
}

export const getPopularPosts = unstable_cache(fetchPopularPosts, ["blog:popular"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

// Related = same category, newest first, excluding the current post. Falls back
// to recent posts when the post has no category.
async function fetchRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3,
): Promise<BlogPostSummary[]> {
  const supabase = createPublicClient();
  let q = supabase
    .from("blog_posts")
    .select(SUMMARY_SELECT)
    .neq("id", postId)
    .order("published_at", { ascending: false });
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data, error } = await q.limit(limit);
  if (error || !data) return [];
  return (data as unknown as RawPostRow[]).map(mapSummary);
}

export const getRelatedPosts = unstable_cache(fetchRelatedPosts, ["blog:related"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

// ---------------------------------------------------------------------------
// Taxonomy lookups
// ---------------------------------------------------------------------------

async function fetchCategories(): Promise<BlogCategory[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data as unknown as BlogCategory[];
}

export const getCategories = unstable_cache(fetchCategories, ["blog:categories"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

async function fetchCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as unknown as BlogCategory) ?? null;
}

export const getCategoryBySlug = unstable_cache(fetchCategoryBySlug, ["blog:category"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

async function fetchAuthorBySlug(slug: string): Promise<BlogAuthor | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_authors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as unknown as BlogAuthor) ?? null;
}

export const getAuthorBySlug = unstable_cache(fetchAuthorBySlug, ["blog:author"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

async function fetchTagBySlug(slug: string): Promise<BlogTag | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as unknown as BlogTag) ?? null;
}

export const getTagBySlug = unstable_cache(fetchTagBySlug, ["blog:tag"], {
  tags: [BLOG_CACHE_TAG],
  revalidate: BLOG_REVALIDATE,
});

// ---------------------------------------------------------------------------
// Sitemap support
// ---------------------------------------------------------------------------

export type PublishedSlug = { slug: string; updated_at: string };

async function fetchAllPublishedSlugs(): Promise<PublishedSlug[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as PublishedSlug[];
}

export const getAllPublishedSlugs = unstable_cache(
  fetchAllPublishedSlugs,
  ["blog:all-slugs"],
  { tags: [BLOG_CACHE_TAG], revalidate: BLOG_REVALIDATE },
);
