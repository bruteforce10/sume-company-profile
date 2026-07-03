import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatRelativeTime } from "@/lib/blog-utils";
import type { BlogPostSummary } from "@/lib/blog-types";

/**
 * Horizontal article row (thumbnail left, meta/title/excerpt right) used in the
 * front-page per-category previews.
 */
export function ArticleListItem({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex gap-4 sm:gap-5">
      <Link
        href={`/blog/${post.slug}`}
        className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-[4px] bg-sume-mist sm:w-52"
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(min-width:640px) 208px, 128px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-sume-muted">
          {post.author ? (
            <span className="font-medium text-sume-body">{post.author.name}</span>
          ) : null}
          {post.author && post.published_at ? <span aria-hidden>|</span> : null}
          {post.published_at ? <span>{formatRelativeTime(post.published_at)}</span> : null}
        </div>
        <h3 className="font-head text-base font-bold leading-snug text-sume-ink sm:text-lg">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-sume-blue">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-2 text-[13.5px] leading-relaxed text-sume-muted sm:line-clamp-3 sm:text-[14px]">
            {post.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  );
}
