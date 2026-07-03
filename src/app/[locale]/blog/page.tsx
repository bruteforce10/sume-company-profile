import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/constants/site";
import { routing } from "@/i18n/routing";
import {
  DEFAULT_PAGE_SIZE,
  getCategories,
  getFeaturedPost,
  getPopularPosts,
  getPublishedPosts,
  getRecentPosts,
} from "@/lib/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { ArticleHero } from "@/components/blog/article-hero";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { CategoryFilter } from "@/components/blog/category-filter";
import { Pagination } from "@/components/blog/pagination";
import { SearchBar } from "@/components/blog/search-bar";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; kategori?: string; q?: string }>;
};

const DESCRIPTION =
  "Wawasan dan artikel seputar solusi mekanikal, elektrikal, dan data center dari SUME.";

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== routing.defaultLocale) return {};
  return {
    title: "Blog",
    description: DESCRIPTION,
    alternates: { canonical: "/blog" },
    openGraph: {
      type: "website",
      url: `${siteUrl}/blog`,
      title: "Blog SUME",
      description: DESCRIPTION,
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  if (locale !== routing.defaultLocale) notFound();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const categorySlug = sp.kategori || undefined;
  const query = sp.q || undefined;
  const showHero = page === 1 && !categorySlug && !query;

  const [listing, categories, popular, latest] = await Promise.all([
    getPublishedPosts({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      categorySlug,
      query,
    }),
    getCategories(),
    getPopularPosts(30, 5),
    getRecentPosts(6),
  ]);
  const featured = showHero ? await getFeaturedPost() : null;
  const gridPosts = featured
    ? listing.posts.filter((p) => p.id !== featured.id)
    : listing.posts;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <header className="mb-8 flex flex-col gap-3">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Blog SUME
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          Artikel
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
          Informasi dan wawasan seputar solusi mekanikal, elektrikal, dan data
          center terkini.
        </p>
      </header>

      {featured ? (
        <div className="mb-10">
          <ArticleHero post={featured} />
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilter
              categories={categories}
              activeSlug={categorySlug}
              query={query}
            />
            <SearchBar defaultQuery={query ?? ""} categorySlug={categorySlug} />
          </div>

          {query ? (
            <p className="text-sm text-sume-muted">
              Menampilkan hasil untuk “{query}”.
            </p>
          ) : null}

          {gridPosts.length === 0 ? (
            <div className="rounded-[4px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
              Belum ada artikel yang cocok.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {gridPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            total={listing.total}
            pageSize={listing.pageSize}
            categorySlug={categorySlug}
            query={query}
          />
        </div>

        <BlogSidebar
          categories={categories}
          popular={popular}
          latest={latest}
          categoryPlacement="hidden"
        />
      </div>
    </main>
  );
}
