import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ArticleListItem } from "@/components/blog/article-list-item";
import type { BlogCategory, BlogPostSummary } from "@/lib/blog-types";

/**
 * One front-page category block: an underlined category title with a "Lihat
 * Semua" link to the full category page, followed by a few preview articles.
 */
export function CategorySection({
  category,
  posts,
}: {
  category: BlogCategory;
  posts: BlogPostSummary[];
}) {
  if (posts.length === 0) return null;
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4 border-b border-sume-line">
        <h2 className="-mb-px border-b-[3px] border-sume-blue pb-2 font-display text-xl font-extrabold tracking-tight text-sume-ink sm:text-2xl">
          {category.name}
        </h2>
        <Link
          href={`/blog/category/${category.slug}`}
          className="mb-2 inline-flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-sume-blue transition hover:text-sume-blue-hover"
        >
          Lihat Semua
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-sume-line">
        {posts.map((post) => (
          <div key={post.id} className="py-5 first:pt-0 last:pb-0">
            <ArticleListItem post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}
