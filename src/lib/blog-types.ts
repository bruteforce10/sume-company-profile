// Pure, dependency-free blog types. Field names are snake_case to mirror the
// Supabase row shape 1:1 (this repo has no generated database.types.ts), so
// query results map onto these types without a translation layer.

export type BlogAuthor = {
  id: string;
  name: string;
  slug: string;
  photo: string | null;
  bio: string | null;
  linkedin: string | null;
  email: string | null;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

export type BlogReference = {
  id: string;
  post_id: string;
  title: string;
  url: string;
  accessed_at: string | null;
  position: number;
};

/** Manually-curated "internal links" block on a post (stored as jsonb). */
export type BlogInternalLink = {
  label: string;
  url: string;
};

/** A row from blog_posts, exactly as returned by the Data API. */
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  author_id: string | null;
  category_id: string | null;
  reading_time: number;
  views: number;
  featured: boolean;
  is_draft: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  internal_links: BlogInternalLink[];
  created_at: string;
  updated_at: string;
};

/** Post + the relations needed by cards and listing pages. */
export type BlogPostSummary = BlogPost & {
  author: BlogAuthor | null;
  category: BlogCategory | null;
  tags: BlogTag[];
};

/** Everything the article detail page needs. */
export type BlogPostDetail = BlogPostSummary & {
  references: BlogReference[];
};

/** Paginated result shape returned by the listing queries. */
export type PaginatedPosts = {
  posts: BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
};
