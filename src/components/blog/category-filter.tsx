import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { BlogCategory } from "@/lib/blog-types";

function buildHref(kategori?: string, q?: string): string {
  const sp = new URLSearchParams();
  if (kategori) sp.set("kategori", kategori);
  if (q) sp.set("q", q);
  const qs = sp.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

const chip = (active: boolean) =>
  cn(
    "rounded-full border px-3 py-1 text-[13px] font-semibold transition",
    active
      ? "border-sume-blue bg-sume-blue text-white"
      : "border-sume-line text-sume-body hover:border-sume-blue hover:text-sume-blue",
  );

export function CategoryFilter({
  categories,
  activeSlug,
  query,
}: {
  categories: BlogCategory[];
  activeSlug?: string;
  query?: string;
}) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={buildHref(undefined, query)} className={chip(!activeSlug)}>
        Semua
      </Link>
      {categories.map((c) => (
        <Link key={c.id} href={buildHref(c.slug, query)} className={chip(activeSlug === c.slug)}>
          {c.name}
        </Link>
      ))}
    </div>
  );
}
