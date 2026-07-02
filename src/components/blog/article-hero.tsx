import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/blog-utils";
import type { BlogPostSummary } from "@/lib/blog-types";

/** Large featured card at the top of the blog index. */
export function ArticleHero({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-[6px] border border-sume-line bg-sume-navy text-white"
    >
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority
            sizes="(min-width:1024px) 66vw, 100vw"
            className="object-cover opacity-85 transition duration-300 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-8">
        {post.category ? (
          <span className="text-[12px] font-semibold uppercase tracking-wide text-white/80">
            {post.category.name}
          </span>
        ) : null}
        <h2 className="max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-4xl">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="line-clamp-2 max-w-2xl text-sm text-white/85 sm:text-base">
            {post.excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-white/70">
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
    </Link>
  );
}
