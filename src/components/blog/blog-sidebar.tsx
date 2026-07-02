import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/blog-utils";
import type { BlogCategory, BlogPost, BlogPostSummary } from "@/lib/blog-types";

function MiniPost({
  slug,
  title,
  thumbnail,
  date,
}: {
  slug: string;
  title: string;
  thumbnail: string | null;
  date: string | null;
}) {
  return (
    <Link href={`/blog/${slug}`} className="group flex gap-3">
      <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[3px] bg-sume-mist">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </span>
      <span className="flex flex-col">
        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-sume-ink group-hover:text-sume-blue">
          {title}
        </span>
        {date ? (
          <span className="mt-1 text-[11px] text-sume-muted">
            {formatDate(date)}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-sume-line pb-2 font-head text-sm font-bold uppercase tracking-wide text-sume-ink">
      {children}
    </h3>
  );
}

export function BlogSidebar({
  categories,
  popular,
  latest,
}: {
  categories: BlogCategory[];
  popular: BlogPost[];
  latest: BlogPostSummary[];
}) {
  return (
    <aside className="flex flex-col gap-8">
      {popular.length > 0 ? (
        <section className="flex flex-col gap-4">
          <SidebarHeading>Artikel Terpopuler</SidebarHeading>
          <div className="flex flex-col gap-3">
            {popular.map((p) => (
              <MiniPost
                key={p.id}
                slug={p.slug}
                title={p.title}
                thumbnail={p.thumbnail}
                date={p.published_at}
              />
            ))}
          </div>
        </section>
      ) : null}

      {latest.length > 0 ? (
        <section className="flex flex-col gap-4">
          <SidebarHeading>Artikel Terbaru</SidebarHeading>
          <div className="flex flex-col gap-3">
            {latest.map((p) => (
              <MiniPost
                key={p.id}
                slug={p.slug}
                title={p.title}
                thumbnail={p.thumbnail}
                date={p.published_at}
              />
            ))}
          </div>
        </section>
      ) : null}

      {categories.length > 0 ? (
        <section className="flex flex-col gap-4">
          <SidebarHeading>Kategori</SidebarHeading>
          <ul className="flex flex-col gap-1.5">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/blog/category/${c.slug}`}
                  className="text-sm text-sume-body transition hover:text-sume-blue"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
