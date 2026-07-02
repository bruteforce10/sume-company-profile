import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function buildHref(
  basePath: string,
  page: number,
  categorySlug?: string,
  query?: string,
): string {
  const sp = new URLSearchParams();
  if (categorySlug) sp.set("kategori", categorySlug);
  if (query) sp.set("q", query);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  page,
  total,
  pageSize,
  categorySlug,
  query,
  basePath = "/blog",
}: {
  page: number;
  total: number;
  pageSize: number;
  categorySlug?: string;
  query?: string;
  /** Route the page links point at (taxonomy pages pass their own path). */
  basePath?: string;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const cell =
    "flex h-9 min-w-9 items-center justify-center rounded-[2px] border px-2 text-sm font-semibold transition";

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Paginasi">
      {page > 1 ? (
        <Link
          href={buildHref(basePath, page - 1, categorySlug, query)}
          className={cn(cell, "border-sume-line text-sume-body hover:border-sume-blue hover:text-sume-blue")}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeftIcon className="size-4" />
        </Link>
      ) : null}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p, categorySlug, query)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            cell,
            p === page
              ? "border-sume-blue bg-sume-blue text-white"
              : "border-sume-line text-sume-body hover:border-sume-blue hover:text-sume-blue",
          )}
        >
          {p}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref(basePath, page + 1, categorySlug, query)}
          className={cn(cell, "border-sume-line text-sume-body hover:border-sume-blue hover:text-sume-blue")}
          aria-label="Halaman berikutnya"
        >
          <ChevronRightIcon className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
