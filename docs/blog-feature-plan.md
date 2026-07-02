# Blog Feature — Implementation Plan

## Context

The SUME company-profile site (Next.js 16 App Router + Supabase + next-intl) has no
content-publishing surface. This plan adds a full blog: a public reading experience
(`/blog`) and an admin CMS (`/admin/blog`) for authoring rich articles, backed by
Supabase Postgres + Storage. Goal: SEO-driven organic traffic and thought leadership,
built on the patterns already proven by the existing i18n CMS.

### Locked decisions
- **Language:** Indonesian only. The blog lives at `/blog` (default locale). `/en/blog`
  → **308 redirect to `/blog`** (via `src/proxy.ts`; a page-level `notFound()` guard
  stays as defense-in-depth). Articles are single-language; UI chrome uses the message
  catalog (ID).
- **Scope:** Full PRD, delivered in the phases below (one phase ≈ one work session).
- **Taxonomy:** Seeded via SQL in Phase 1; full CRUD screens land in Phase 7.
- **DB naming:** `snake_case`, plural, `blog_` prefixed (matches `translation_messages`).
  PRD's camelCase field names map to snake_case columns (mapping in Phase 1).
- **Reuse over new:** CMS auth gate, server-action + cache-revalidation pattern, the
  Tiptap editor, `SafeHtml`, the public-read data pattern, and localized routing all
  already exist — extend them, don't reinvent.

### Execution protocol (token efficiency)
1. Do **one phase per session**. Each phase lists the exact files to read first — read
   only those, not the whole repo.
2. **Before writing any Next.js code, read the relevant guide in
   `node_modules/next/dist/docs/01-app/`** (per `AGENTS.md`: this Next.js has breaking
   changes vs. training data — `params`/`searchParams` are Promises, caching APIs
   differ). For Tiptap/Supabase specifics, use Context7 or official docs.
3. After each phase, tick its checklist here and run its **Verify** step.
4. Follow existing conventions: `cn()` for classes, `sume-*` design tokens, `@/…`
   import aliases, `useActionState` + `FormData` for mutations (no react-hook-form/zod
   in this repo), `sonner` toasts, `lucide-react` icons.

### Progress
- [x] Phase 0 — Prerequisites (deps + config) ✅ image + table Tiptap pkgs installed; Supabase image remotePattern added
- [x] Phase 1 — Database & storage foundation ✅ applied to prod (egrneczouptvozcytfia); seed (4 cat / 4 tag / 1 author) + RLS + RPC verified via anon REST
- [x] Phase 2 — Blog editor ✅ `BlogEditor` (image upload + paste/drop, link, table via TableKit, code, placeholder) + `SafeHtml` "article" profile + shared editor/article CSS; tsc+lint clean _(live upload/render test happens in Phase 3 when the editor is mounted)_
- [x] Phase 3 — Admin CMS: article CRUD ✅ `/admin/blog` list + new/edit form (`BlogEditor`, thumbnail/tags/refs/internal-links, draft/schedule/featured) + server actions (create/update/delete/togglePublish, server-side sanitize + reading-time) + admin nav; build/tsc/lint clean _(live CRUD test needs admin login)_
- [x] Phase 4 — Public blog: list page + sidebar ✅ `/blog` (hero, grid, category filter, search, pagination, sidebar) verified live (200); `/en/blog` → **308 redirect to `/blog`** via proxy (see note)
- [x] Phase 5 — Public blog: article detail page ✅ `/blog/[slug]` (breadcrumb, hero image, meta line, `SafeHtml` article body, tags, internal-links, references, share buttons, author card, related strip, sidebar) + `generateMetadata` (canonical + OG `article` w/ published/modified time) + `ViewTracker` (calls `record_post_view` RPC once) + `[slug]/loading.tsx`; build/tsc/lint clean, verified live
- [x] Phase 6 — Public taxonomy pages (category / tag / author) ✅ `/blog/category|tag|author/[slug]` reuse `ArticleCard`/`Pagination`(now `basePath`-aware)/`BlogSidebar`; unknown slug → `notFound()`; canonical metadata; verified live — valid pages 200 & indexable, unknown slugs 200 **+ auto `noindex`** (see soft-404 note under Phase 9)
- [x] Phase 7 — Admin CMS: taxonomy CRUD ✅ `/admin/blog/{authors,categories,tags}` via one generic `TaxonomyManager` (list + create/edit/delete, image upload for photo/icon) + per-entity `save*`/`delete*` server actions (`requireAdmin` + slug auto-derive + FK-safe deletes + revalidate) + `BlogAdminNav` sub-nav; build/tsc/lint clean _(live CRUD test needs admin login)_
- [ ] Phase 8 — Drafts, scheduling & view analytics
- [ ] Phase 9 — SEO: metadata, JSON-LD, TOC, sitemap, OG
- [ ] Phase 10 — Performance, i18n chrome, polish & QA

---

## Reference patterns (already in the repo — reuse these)

| Concern | Reuse | Path |
| --- | --- | --- |
| Admin auth gate | `requireAdmin()` + `is_admin()` RLS | `src/lib/auth.ts`, `src/app/(cms)/admin/layout.tsx` |
| Mutations | server action → `upsert` → `updateTag` + `revalidatePath` | `src/app/(cms)/admin/messages/actions.ts` |
| Public cached reads | `createPublicClient()` + `unstable_cache` + cache tag | `src/lib/messages.ts`, `src/lib/supabase/public.ts` |
| Migration + RLS style | tables, `is_admin()`, `set_updated_at()` trigger, grants | `supabase/migrations/20260610090000_cms_translations.sql` |
| Client form | `useActionState` + hidden inputs + toast + dirty bar | `src/app/(cms)/admin/messages/messages-editor.tsx` |
| Rich text | `RichEditor` (Tiptap: StarterKit, Underline, TextAlign) | `src/components/rich-editor.tsx` |
| Render HTML safely | `SafeHtml` (DOMPurify) | `src/lib/safe-html.tsx` |
| Localized page + SEO | `generateMetadata` + `setRequestLocale` + `languageAlternates` | `src/app/[locale]/about/page.tsx`, `src/i18n/metadata.ts` |
| Data-driven page | fetch in server component (like `getProjects`) | `src/app/[locale]/our-project/page.tsx`, `src/lib/projects.ts` |
| Sitemap/robots | `MetadataRoute` builders | `src/app/sitemap.ts`, `src/app/robots.ts` |
| UI kit | button, card, field, input, textarea, badge, skeleton, spinner | `src/components/ui/*` |

Key constants: `siteUrl = "https://www.sumeid.com"` (`src/constants/site.ts`);
Supabase host `egrneczouptvozcytfia.supabase.co` (`.env.local`); admin email
`audifirdi@gmail.com`.

---

## Phase 0 — Prerequisites

**Read first:** `package.json`, `next.config.ts`.

**Steps**
- [ ] Add Tiptap extensions (match existing `3.26.1`): `@tiptap/extension-link`,
  `@tiptap/extension-image`, `@tiptap/extension-placeholder`, and the table set
  (`@tiptap/extension-table`, `-table-row`, `-table-cell`, `-table-header`).
  **Check Tiptap v3 docs first** — StarterKit 3.x may already bundle some of these
  (e.g. CodeBlock, Link); Tiptap throws on duplicate extensions.
- [ ] `next.config.ts`: add a `remotePatterns` entry for
  `egrneczouptvozcytfia.supabase.co` (path `/storage/v1/object/public/**`) so
  `next/image` can serve uploaded media. Keep existing graphassets patterns.

**Verify:** `npm run dev` boots clean; no missing-module errors.

---

## Phase 1 — Database & storage foundation

**Read first:** `supabase/migrations/20260610090000_cms_translations.sql`,
`src/lib/messages.ts`, `src/lib/supabase/public.ts`, `src/lib/cms-types.ts`,
`supabase/config.toml`.

**New migration:** `supabase/migrations/20260702090000_blog.sql`
(reuse existing `public.is_admin()` and `public.set_updated_at()` — do not redefine).

**Schema (PRD → columns).** All tables `blog_` prefixed, `snake_case`.

- `blog_authors` — `id, name, slug (unique), photo, bio, linkedin, email, created_at, updated_at`
- `blog_categories` — `id, name, slug (unique), description, icon, created_at, updated_at`
- `blog_tags` — `id, name, slug (unique), created_at`
- `blog_posts` — `id, title, slug (unique), thumbnail, content (text, Tiptap HTML),
  excerpt, meta_title, meta_description, author_id→blog_authors, category_id→blog_categories,
  reading_time int, views int default 0, featured bool default false,
  is_draft bool default true, published_at timestamptz, scheduled_at timestamptz,
  internal_links jsonb default '[]', created_at, updated_at`
- `blog_post_tags` — junction `(post_id→blog_posts on delete cascade, tag_id→blog_tags on delete cascade)`, PK both
- `blog_references` — `id, post_id→blog_posts on delete cascade, title, url, accessed_at, position int`
- `blog_post_views` — `id bigint identity, post_id→blog_posts on delete cascade, viewed_at timestamptz default now()` (for "popular last 30 days")

**Indexes:** `blog_posts (published_at desc)`, `(category_id)`, `(author_id)`,
`(featured)`; `blog_post_views (viewed_at)`, `(post_id, viewed_at)`.
Add `set_updated_at` triggers on tables with `updated_at`.

**RLS (mirror the translations migration):**
- Published-visibility predicate:
  `is_draft = false AND published_at is not null AND published_at <= now() AND (scheduled_at is null OR scheduled_at <= now())`.
- `blog_posts`: two SELECT policies (OR-combined) — public sees published; admin
  (`is_admin()`) sees all. Write policies (`insert/update/delete`) admin-only.
- `blog_authors/categories/tags/references`: public SELECT (`using (true)`), admin writes.
- `blog_post_views`: **no** direct public write. Views are recorded via a
  `security definer` RPC `public.record_post_view(p_slug text)` (`set search_path=''`)
  that inserts a view row and `update blog_posts set views = views + 1`; `grant execute
  to anon, authenticated`. This is the only RLS-bypass surface and it does exactly one
  safe thing.
- Explicit `grant` statements like the reference migration.

**Storage:** `insert into storage.buckets (id, name, public) values ('blog-assets','blog-assets', true)`.
Add `storage.objects` policies: public read for `bucket_id = 'blog-assets'`;
insert/update/delete gated by `is_admin()`.

**Seed:** insert the primary author (link to `audifirdi@gmail.com` profile),
a few starter categories, and a few tags (idempotent `on conflict do nothing`).

**Types:** `src/lib/blog-types.ts` — hand-authored types (`BlogPost`, `BlogAuthor`,
`BlogCategory`, `BlogTag`, `BlogReference`, plus a `BlogPostWithRelations`), following
the `src/lib/cms-types.ts` convention (no generated `database.types.ts` in this repo).

**Data-access:** `src/lib/blog.ts` — `BLOG_CACHE_TAG = "blog"`, reads via
`createPublicClient()` wrapped in `unstable_cache` (mirror `src/lib/messages.ts`):
`getPublishedPosts({page,pageSize,categorySlug,query})`, `getPostBySlug`,
`getFeaturedPost`, `getRecentPosts`, `getPopularPosts(days=30)`, `getRelatedPosts`,
`getCategories`, `getPostsByCategory/Tag/Author`, `getAuthorBySlug`,
`getCategoryBySlug`, `getTagBySlug`, `getAllPublishedSlugs` (for the sitemap).

**Utils:** `src/lib/blog-utils.ts` — `slugify(text)`, `calcReadingTime(html)`
(~200 wpm), `formatDate(date, locale="id")`.

**Verify:** apply migration (Supabase CLI `db push` or MCP); confirm tables + seed via
a `select`; confirm anon can read a manually-published row and cannot read a draft.

---

## Phase 2 — Blog editor (Tiptap + image upload)

**Read first:** `src/components/rich-editor.tsx`, `src/lib/supabase/client.ts`,
`src/lib/safe-html.tsx`.

**Steps**
- [ ] `src/components/blog/blog-editor.tsx` — extend the `RichEditor` pattern (keep the
  existing one untouched for the messages CMS). Add extensions: Link, Image,
  Placeholder, CodeBlock (verify StarterKit inclusion), Table set. Same
  hidden-input-sync + toolbar approach.
- [ ] Toolbar additions: link add/edit/unset, code block, table insert, and an
  **image** button + drag/drop + paste handler.
- [ ] Image upload: use the browser client (`src/lib/supabase/client.ts` — carries the
  logged-in admin session) → `.storage.from("blog-assets").upload(path, file)` →
  `.getPublicUrl()` → insert image node. Path e.g. `posts/{uuid}-{filename}`. Show a
  spinner during upload; toast on error.
- [ ] Extend `SafeHtml` for article bodies: DOMPurify config allowing `img/figure/
  figcaption/a/pre/code/table/...` with `target`,`rel`,`loading`,`class`,`src`,`href`
  attrs. Add a variant/prop rather than loosening the shared messages usage.

**Verify:** temporary harness page or Phase-3 form — type text, add a link, upload an
image (appears in bucket, renders), confirm `getHTML()` lands in the hidden input.

---

## Phase 3 — Admin CMS: article CRUD

**Read first:** `src/app/(cms)/admin/messages/{page.tsx,messages-editor.tsx,actions.ts}`,
`src/app/(cms)/admin/layout.tsx`, `src/components/ui/{field,input,button,card}.tsx`.

Routes live under `/admin/blog` and inherit the admin gate from
`src/app/(cms)/admin/layout.tsx` (already calls `requireAdmin()`).

**Steps**
- [ ] `src/app/(cms)/admin/blog/page.tsx` — server component: list posts (title, status
  badge draft/scheduled/published, category, date, views) with new/edit/delete actions.
- [ ] `src/app/(cms)/admin/blog/new/page.tsx` and `.../[id]/edit/page.tsx` — render the
  shared form; edit page loads the post + its tags/references server-side.
- [ ] `src/app/(cms)/admin/blog/article-form.tsx` — client form (`useActionState` +
  `FormData`, dirty bar + toast like `messages-editor.tsx`). Fields: title, slug
  (auto-suggest from title via `slugify`, editable), thumbnail upload, category select,
  tags multiselect, author select, `<BlogEditor>` for content, meta title/description,
  excerpt, references (repeatable rows), internal links (repeatable), featured toggle,
  draft toggle, `scheduled_at`.
- [ ] `src/app/(cms)/admin/blog/actions.ts` — `createPost`, `updatePost`, `deletePost`,
  `togglePublish`. Each: `requireAdmin()`; server-side DOMPurify sanitize of content;
  recompute `reading_time`; upsert post; sync `blog_post_tags`; replace
  `blog_references`; then `updateTag(BLOG_CACHE_TAG)` + `revalidatePath("/blog","layout")`.
- [ ] Add a "Blog" link into the admin shell nav (`src/app/(cms)/admin/layout.tsx`).

**Verify:** create → edit → publish → delete a post end-to-end in `/admin/blog`;
confirm draft is hidden from anon reads and published is visible.

---

## Phase 4 — Public blog: list page + sidebar

**Read first:** `src/app/[locale]/our-project/page.tsx` (+ `loading.tsx`),
`src/i18n/{routing.ts,navigation.ts,metadata.ts}`, `src/lib/blog.ts`,
`src/components/ui/{card,badge,skeleton}.tsx`.

**Steps**
- [ ] `src/app/[locale]/blog/layout.tsx` — `if (locale !== routing.defaultLocale) notFound()`
  (ID-only) + `setRequestLocale(locale)`. Reuses the `[locale]` shell (header/footer).
- [ ] `src/app/[locale]/blog/page.tsx` — hero (featured/newest), recent grid, category
  filter + search via `searchParams` (Promise), pagination (`range()`, page size ~9).
  `generateMetadata` for `/blog`.
- [ ] `src/components/blog/` — `article-card.tsx`, `article-hero.tsx`,
  `blog-sidebar.tsx` (popular 30d, latest, categories), `search-bar.tsx` (client, edits
  `searchParams`), `category-filter.tsx`, `pagination.tsx`.
- [ ] `src/app/[locale]/blog/loading.tsx` — skeletons (reuse `skeleton.tsx` /
  `project-skeleton` pattern).

**Verify:** `/blog` lists published posts; search + category filter + pagination work
via URL params; `/en/blog` → 404.

---

## Phase 5 — Public blog: article detail page

**Read first:** `src/app/[locale]/blog/page.tsx` (Phase 4), `src/lib/safe-html.tsx`,
`src/i18n/metadata.ts`, `src/lib/blog.ts`.

**Steps**
- [ ] `src/app/[locale]/blog/[slug]/page.tsx` — fetch by slug (`notFound()` if absent/
  unpublished). Render title, thumbnail (`next/image`), category, author, published/
  updated dates, reading time, `<SafeHtml>` body, references + internal links,
  related-articles strip, sidebar (latest + popular).
- [ ] `generateMetadata` — title/description (meta fields → fallback to title/excerpt),
  canonical (`/blog/[slug]`), OpenGraph (`type: "article"`, `publishedTime`,
  `modifiedTime`, thumbnail image), Twitter card. (No hreflang — ID-only.)
- [ ] `src/components/blog/breadcrumb.tsx`, `share-buttons.tsx` (client: WhatsApp,
  Facebook, LinkedIn, X, Telegram, Copy Link), `view-tracker.tsx` (client — calls
  `record_post_view` RPC once on mount).

**Verify:** open a published article; content/images render; share links target the
correct URL; a page view increments `views` (visible in `/admin/blog`).

---

## Phase 6 — Public taxonomy pages (category / tag / author)

**Read first:** `src/app/[locale]/blog/page.tsx`, `src/lib/blog.ts`.

**Steps** — three sibling routes reusing the Phase-4 card/pagination components and the
localized `generateMetadata` pattern:
- [ ] `src/app/[locale]/blog/category/[slug]/page.tsx` — banner + description + posts.
- [ ] `src/app/[locale]/blog/tag/[slug]/page.tsx` — posts for a tag.
- [ ] `src/app/[locale]/blog/author/[slug]/page.tsx` — author photo/bio/LinkedIn +
  article count + their posts.
Each: `notFound()` on unknown slug; canonical metadata.

**Verify:** each page lists the right posts and 404s on unknown slugs.

---

## Phase 7 — Admin CMS: taxonomy CRUD

**Read first:** `src/app/(cms)/admin/blog/{article-form.tsx,actions.ts}` (Phase 3).

**Steps** — CRUD for the seeded taxonomy (same server-action + toast pattern; one
shared list+form pattern applied three times):
- [ ] `src/app/(cms)/admin/blog/authors/` — list/create/edit/delete; photo upload to
  `blog-assets`.
- [ ] `src/app/(cms)/admin/blog/categories/` — CRUD; optional icon upload.
- [ ] `src/app/(cms)/admin/blog/tags/` — CRUD.
- [ ] Actions in each folder; `requireAdmin()` + revalidate. Deletes must handle FK
  references gracefully (posts' `author_id`/`category_id` are `on delete set null`).

**Verify:** create/edit/delete an author, category, tag; confirm the article form
dropdowns reflect changes.

---

## Phase 8 — Drafts, scheduling & view analytics

**Read first:** `src/lib/blog.ts`, `src/app/(cms)/admin/blog/actions.ts`,
`supabase/config.toml`.

**Steps**
- [ ] Drafts already hidden by RLS + query predicate. Confirm admin list shows draft /
  scheduled / published states distinctly.
- [ ] Scheduling: the published predicate already includes `scheduled_at <= now()`.
  Because reads are cached with `revalidate` (mirror `messages.ts`'s 600s; use ~300s for
  blog), a scheduled post goes live within the revalidate window with no deploy.
  Document this; note `pg_cron` as an optional later upgrade for exact-minute flips.
- [ ] "Popular (last 30 days)" already backed by `blog_post_views` + `getPopularPosts`.
  Confirm the `record_post_view` RPC path from Phase 5 works and is debounced client-side
  (one call per mount).

**Verify:** set `scheduled_at` in the near future → post appears after the revalidate
window; popular list reflects recent views.

---

## Phase 9 — SEO: metadata, JSON-LD, TOC, sitemap, OG

**Read first:** `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/[locale]/blog/[slug]/page.tsx`.

**Steps**
- [ ] `src/components/blog/json-ld.tsx` — emit `<script type="application/ld+json">` for
  `BlogPosting` (headline, image, author, dates), `BreadcrumbList`, and author `Person`.
  Render on detail (and author) pages.
- [ ] Table of Contents: `buildTableOfContents(html)` in `src/lib/blog-utils.ts` — inject
  `id`s into `h2/h3` and return `{ html, toc[] }`; render a TOC component on the detail
  page (sanitize before render).
- [ ] `src/app/sitemap.ts` — make async; append `/blog`, all published post slugs, and
  category/tag/author slugs (via `getAllPublishedSlugs` etc.). ID-only URLs (no `/en`).
- [ ] Optional: dynamic OG image via `src/app/[locale]/blog/[slug]/opengraph-image.tsx`
  (`next/og`); otherwise thumbnail URL in metadata is sufficient.

> **Soft-404 note (Phase 5/6):** unknown blog slugs correctly call `notFound()`, but
> because these routes are dynamically **streamed** (nested under the prerendered
> `[locale]` layout), Next 16 returns HTTP **200** rather than 404 — this is documented
> behavior (`node_modules/next/dist/docs/.../file-conventions/loading.md` → *Status
> Codes*). Next auto-injects `<meta name="robots" content="noindex">` on those responses,
> so they are **not indexed** (verified live). This satisfies SEO. If a *hard* 404 status
> is later required (compliance/analytics), add a fast slug-existence check in `src/proxy.ts`
> that rewrites/produces a 404 before the body streams — do NOT fetch full content there.

**Verify:** validate JSON-LD (Google Rich Results / Schema validator); `/sitemap.xml`
includes blog URLs; TOC anchors scroll correctly.

---

## Phase 10 — Performance, i18n chrome, polish & QA

**Read first:** `messages/id.json`, `messages/en.json`, `src/global.d.ts`,
`src/lib/cms-schema.ts`.

**Steps**
- [ ] i18n chrome: add a `BlogPage` namespace to **both** `messages/id.json` and
  `messages/en.json` (keys must exist in both to satisfy the next-intl type shape in
  `src/global.d.ts`) — labels like `readingTime`, `share`, `categories`, `latest`,
  `popular`, `relatedArticles`, `references`, `searchPlaceholder`, `allCategories`,
  `byAuthor`, `publishedOn`, `updatedOn`. Swap hardcoded strings in blog components for
  `t()`. Optionally register the namespace in `src/lib/cms-schema.ts` so it's editable at
  `/admin/messages`.
- [ ] Images: `next/image` everywhere with proper `sizes`; lazy by default; confirm the
  Supabase remote pattern from Phase 0.
- [ ] Caching: tune `revalidate`; verify `updateTag(BLOG_CACHE_TAG)` +
  `revalidatePath("/blog","layout")` fire on every mutation (read-your-writes).
- [ ] Responsive/a11y pass across all blog pages; `loading.tsx` skeletons where missing.

**Verify:** Lighthouse on `/blog` + an article (perf/SEO/a11y); edit a post in the CMS
and confirm the change appears on the public page without redeploy; full responsive check.

---

## Cross-cutting security & QA checklist
- [ ] RLS: anon can read only published posts and public taxonomy; drafts/scheduled
  invisible until due; no write path for anon except the scoped `record_post_view` RPC.
- [ ] All content sanitized server-side (on save) **and** on render (`SafeHtml`).
- [ ] Storage: only admins can upload/delete in `blog-assets`; bucket is public-read only.
- [ ] Every server action re-checks `requireAdmin()` (defense-in-depth; the proxy/layout
  gate is not sufficient alone).
- [ ] `npm run lint` and `npm run build` clean before merge.
