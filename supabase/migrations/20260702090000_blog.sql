-- Blog feature — schema, RLS, storage, and seed.
--
-- Mirrors the security model established in 20260610090000_cms_translations.sql:
--   * Public (anon) may READ published content only.
--   * All writes are admin-only, gated by the existing public.is_admin() helper.
--   * Explicit Data API GRANTs are required — new public tables are no longer
--     auto-exposed to the anon/authenticated roles (see supabase/config.toml).
--
-- Reuses existing helpers from the translations migration:
--   * public.is_admin()      — SECURITY INVOKER admin check (respects RLS)
--   * public.set_updated_at()— keeps updated_at fresh on UPDATE
--
-- Tables (all snake_case, blog_ prefixed):
--   blog_authors, blog_categories, blog_tags, blog_posts,
--   blog_post_tags (junction), blog_references, blog_post_views (analytics)

-- ===========================================================================
-- Reusable published-visibility predicate is inlined in each policy/function:
--   is_draft = false
--   and published_at is not null and published_at <= now()
--   and (scheduled_at is null or scheduled_at <= now())
-- A post is public only once it is not a draft, its publish time has passed,
-- and any schedule time has passed. now() is evaluated per query, so scheduled
-- posts appear automatically once cached reads revalidate (see src/lib/blog.ts).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- blog_authors
-- ---------------------------------------------------------------------------
create table if not exists public.blog_authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  photo      text,
  bio        text,
  linkedin   text,
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_authors enable row level security;

drop trigger if exists blog_authors_set_updated_at on public.blog_authors;
create trigger blog_authors_set_updated_at
  before update on public.blog_authors
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog_categories
-- ---------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.blog_categories enable row level security;

drop trigger if exists blog_categories_set_updated_at on public.blog_categories;
create trigger blog_categories_set_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog_tags
-- ---------------------------------------------------------------------------
create table if not exists public.blog_tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

alter table public.blog_tags enable row level security;

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  thumbnail        text,
  content          text not null default '',
  excerpt          text,
  meta_title       text,
  meta_description text,
  author_id        uuid references public.blog_authors (id) on delete set null,
  category_id      uuid references public.blog_categories (id) on delete set null,
  reading_time     int not null default 0,
  views            int not null default 0,
  featured         boolean not null default false,
  is_draft         boolean not null default true,
  published_at     timestamptz,
  scheduled_at     timestamptz,
  internal_links   jsonb not null default '[]'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_category_id_idx  on public.blog_posts (category_id);
create index if not exists blog_posts_author_id_idx    on public.blog_posts (author_id);
create index if not exists blog_posts_featured_idx     on public.blog_posts (featured);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blog_post_tags (many-to-many)
-- ---------------------------------------------------------------------------
create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id  uuid not null references public.blog_tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.blog_post_tags enable row level security;
create index if not exists blog_post_tags_tag_id_idx on public.blog_post_tags (tag_id);

-- ---------------------------------------------------------------------------
-- blog_references (article citations)
-- ---------------------------------------------------------------------------
create table if not exists public.blog_references (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.blog_posts (id) on delete cascade,
  title       text not null,
  url         text not null,
  accessed_at timestamptz,
  position    int not null default 0
);

alter table public.blog_references enable row level security;
create index if not exists blog_references_post_id_idx on public.blog_references (post_id);

-- ---------------------------------------------------------------------------
-- blog_post_views (append-only analytics for "popular last 30 days")
-- ---------------------------------------------------------------------------
create table if not exists public.blog_post_views (
  id        bigint generated always as identity primary key,
  post_id   uuid not null references public.blog_posts (id) on delete cascade,
  viewed_at timestamptz not null default now()
);

alter table public.blog_post_views enable row level security;
create index if not exists blog_post_views_viewed_at_idx      on public.blog_post_views (viewed_at);
create index if not exists blog_post_views_post_viewed_at_idx on public.blog_post_views (post_id, viewed_at);

-- ===========================================================================
-- RLS policies
-- ===========================================================================

-- blog_posts: public sees published; admins see everything. The two SELECT
-- policies are OR-combined, so an admin (authenticated) sees drafts too.
drop policy if exists "blog_posts_select_published" on public.blog_posts;
create policy "blog_posts_select_published"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    is_draft = false
    and published_at is not null and published_at <= now()
    and (scheduled_at is null or scheduled_at <= now())
  );

drop policy if exists "blog_posts_select_admin" on public.blog_posts;
create policy "blog_posts_select_admin"
  on public.blog_posts
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "blog_posts_insert_admin" on public.blog_posts;
create policy "blog_posts_insert_admin"
  on public.blog_posts for insert to authenticated
  with check (public.is_admin());

drop policy if exists "blog_posts_update_admin" on public.blog_posts;
create policy "blog_posts_update_admin"
  on public.blog_posts for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_posts_delete_admin" on public.blog_posts;
create policy "blog_posts_delete_admin"
  on public.blog_posts for delete to authenticated
  using (public.is_admin());

-- Taxonomy + junction + references: publicly readable (catalog data, not
-- sensitive), admin-only writes. This matches the simple, proven model used by
-- translation_messages.
do $$
declare
  t text;
begin
  foreach t in array array[
    'blog_authors', 'blog_categories', 'blog_tags', 'blog_post_tags', 'blog_references'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_select_public', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_select_public', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_insert_admin', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_admin())',
      t || '_insert_admin', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_update_admin', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_update_admin', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_delete_admin', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_admin())',
      t || '_delete_admin', t
    );
  end loop;
end $$;

-- blog_post_views: no public read/write. Admins may read for analytics; writes
-- happen only through the SECURITY DEFINER record_post_view() function below.
drop policy if exists "blog_post_views_select_admin" on public.blog_post_views;
create policy "blog_post_views_select_admin"
  on public.blog_post_views for select to authenticated
  using (public.is_admin());

-- ===========================================================================
-- Functions
-- ===========================================================================

-- Records a view for a published post: appends an event row (for the 30-day
-- popularity window) and bumps the denormalized total counter. SECURITY DEFINER
-- so anonymous visitors can call it without any table-level write grant; it only
-- ever touches these two tables and only for a post that is actually public.
create or replace function public.record_post_view(p_slug text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_post_id uuid;
begin
  select id into v_post_id
  from public.blog_posts
  where slug = p_slug
    and is_draft = false
    and published_at is not null and published_at <= now()
    and (scheduled_at is null or scheduled_at <= now());

  if v_post_id is null then
    return;
  end if;

  insert into public.blog_post_views (post_id) values (v_post_id);
  update public.blog_posts set views = views + 1 where id = v_post_id;
end;
$$;

-- Returns published posts ordered by view count within the last p_days days.
-- SECURITY DEFINER so anon can rank by the private blog_post_views table without
-- being able to read it directly; published-only filter is enforced inside.
create or replace function public.get_popular_posts(p_days int default 30, p_limit int default 5)
returns setof public.blog_posts
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.blog_posts p
  left join public.blog_post_views v
    on v.post_id = p.id
   and v.viewed_at >= now() - make_interval(days => p_days)
  where p.is_draft = false
    and p.published_at is not null and p.published_at <= now()
    and (p.scheduled_at is null or p.scheduled_at <= now())
  group by p.id
  order by count(v.id) desc, p.published_at desc
  limit p_limit;
$$;

-- ===========================================================================
-- Data API grants (RLS still gates which rows are visible/editable)
-- ===========================================================================
grant select on public.blog_posts      to anon, authenticated;
grant select on public.blog_authors    to anon, authenticated;
grant select on public.blog_categories to anon, authenticated;
grant select on public.blog_tags       to anon, authenticated;
grant select on public.blog_post_tags  to anon, authenticated;
grant select on public.blog_references to anon, authenticated;

grant insert, update, delete on public.blog_posts      to authenticated;
grant insert, update, delete on public.blog_authors    to authenticated;
grant insert, update, delete on public.blog_categories to authenticated;
grant insert, update, delete on public.blog_tags       to authenticated;
grant insert, update, delete on public.blog_post_tags  to authenticated;
grant insert, update, delete on public.blog_references to authenticated;

grant select on public.blog_post_views to authenticated;

grant execute on function public.record_post_view(text) to anon, authenticated;
grant execute on function public.get_popular_posts(int, int) to anon, authenticated;

-- ===========================================================================
-- Storage bucket: blog-assets (public read, admin-only write)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true)
on conflict (id) do nothing;

drop policy if exists "blog_assets_read_public" on storage.objects;
create policy "blog_assets_read_public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'blog-assets');

drop policy if exists "blog_assets_insert_admin" on storage.objects;
create policy "blog_assets_insert_admin"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-assets' and public.is_admin());

drop policy if exists "blog_assets_update_admin" on storage.objects;
create policy "blog_assets_update_admin"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-assets' and public.is_admin())
  with check (bucket_id = 'blog-assets' and public.is_admin());

drop policy if exists "blog_assets_delete_admin" on storage.objects;
create policy "blog_assets_delete_admin"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-assets' and public.is_admin());

-- ===========================================================================
-- Seed: one author + starter categories/tags (idempotent).
-- Content is Indonesian (the blog is ID-only).
-- ===========================================================================
insert into public.blog_authors (name, slug, bio, email)
values (
  'Tim Redaksi SUME',
  'tim-redaksi-sume',
  'Tim editorial PT. Solusi Utama Mekanikal Elektrikal (SUME) yang membahas solusi mekanikal, elektrikal, dan data center.',
  'projects@sumeid.com'
)
on conflict (slug) do nothing;

insert into public.blog_categories (name, slug, description)
values
  ('Data Center',            'data-center',            'Wawasan seputar perancangan, operasi, dan keandalan data center.'),
  ('Kelistrikan & Energi',   'kelistrikan-energi',     'Topik kelistrikan, efisiensi energi, dan keandalan daya.'),
  ('Precision Cooling',      'precision-cooling',      'Sistem pendingin presisi untuk fasilitas kritikal.'),
  ('Insight Industri',       'insight-industri',       'Tren dan analisis industri mekanikal & elektrikal.')
on conflict (slug) do nothing;

insert into public.blog_tags (name, slug)
values
  ('Data Center',       'data-center'),
  ('Efisiensi Energi',  'efisiensi-energi'),
  ('Keandalan',         'keandalan'),
  ('Precision Cooling', 'precision-cooling')
on conflict (slug) do nothing;
