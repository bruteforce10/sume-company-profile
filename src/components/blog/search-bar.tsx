"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

// Client search box. Receives current values as props (rather than reading
// useSearchParams) so it needs no Suspense boundary; navigation preserves the
// active category.
export function SearchBar({
  defaultQuery = "",
  categorySlug,
}: {
  defaultQuery?: string;
  categorySlug?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultQuery);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const sp = new URLSearchParams();
    if (value.trim()) sp.set("q", value.trim());
    if (categorySlug) sp.set("kategori", categorySlug);
    const qs = sp.toString();
    router.push(qs ? `/blog?${qs}` : "/blog");
  }

  return (
    <form onSubmit={submit} className="relative w-full sm:max-w-xs">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sume-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari artikel…"
        aria-label="Cari artikel"
        className="h-10 w-full rounded-[2px] border border-sume-line bg-white pl-9 pr-3 text-sm text-sume-ink outline-none transition placeholder:text-sume-muted/70 focus-visible:border-sume-blue focus-visible:ring-2 focus-visible:ring-sume-blue/15"
      />
    </form>
  );
}
