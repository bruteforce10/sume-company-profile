import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/blog-utils";
import type { BlogPostSummary } from "@/lib/blog-types";

export function ArticleCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[4px] border border-sume-line bg-white transition hover:shadow-[var(--sume-shadow-card)]">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-sume-mist"
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {post.category ? (
          <Link
            href={`/blog/category/${post.category.slug}`}
            className="text-[12px] font-semibold uppercase tracking-wide text-sume-blue hover:underline"
          >
            {post.category.name}
          </Link>
        ) : null}
        <h3 className="font-head text-lg font-semibold leading-snug text-sume-ink">
          <Link href={`/blog/${post.slug}`} className="hover:text-sume-blue">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm text-sume-body">{post.excerpt}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[12px] text-sume-muted">
          {post.author ? <span>{post.author.name}</span> : null}
          {post.published_at ? (
            <>
              <span aria-hidden>·</span>
              <span>{formatDate(post.published_at)}</span>
            </>
          ) : null}
          <span aria-hidden>·</span>
          <span>{post.reading_time} mnt baca</span>
        </div>
      </div>
    </article>
  );
}
