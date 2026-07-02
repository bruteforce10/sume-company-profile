"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/blog", label: "Artikel", exact: true },
  { href: "/admin/blog/authors", label: "Penulis" },
  { href: "/admin/blog/categories", label: "Kategori" },
  { href: "/admin/blog/tags", label: "Tag" },
];

/** Secondary nav across the blog CMS sections (articles + taxonomy). */
export function BlogAdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 border-b border-sume-line pb-3" aria-label="Navigasi blog">
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-[2px] px-3 py-1.5 font-head text-[13px] font-semibold transition",
              active
                ? "bg-sume-bg-blue-soft text-sume-blue"
                : "text-sume-muted hover:bg-sume-mist hover:text-sume-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
