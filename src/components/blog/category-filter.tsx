import { Link } from "@/i18n/navigation";
import type { BlogCategory } from "@/lib/blog-types";

/**
 * Category chips on the blog index. Each one links straight to that category's
 * page (no in-page query filtering).
 */
export function CategoryFilter({ categories }: { categories: BlogCategory[] }) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/blog/category/${c.slug}`}
          className="rounded-full border border-sume-line px-3 py-1 text-[13px] font-semibold text-sume-body transition hover:border-sume-blue hover:text-sume-blue"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
