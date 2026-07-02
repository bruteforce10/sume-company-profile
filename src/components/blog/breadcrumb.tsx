import { Link } from "@/i18n/navigation";

export type Crumb = { label: string; href?: string };

/** Simple breadcrumb trail. The last item is rendered as the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Remah roti" className="text-[13px] text-sume-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="transition hover:text-sume-blue">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={last ? "line-clamp-1 text-sume-body" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
