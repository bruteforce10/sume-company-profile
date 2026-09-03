-- CMS for i18n translation messages.
--
-- Two tables:
--   * admin_users         — who is allowed to edit translations
--   * translation_messages — the editable message catalog (namespace/key/locale)
--
-- Security model (see Supabase RLS checklist):
--   * translation_messages is publicly readable (the marketing site renders it
--     for anonymous visitors) but only admins may write.
--   * admin_users is private: a signed-in user may read only their own row to
--     learn whether they are an admin. Membership is managed via SQL only.

-- ---------------------------------------------------------------------------
-- admin_users
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- A signed-in user can check whether they themselves are an admin.
drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies: membership is only ever changed by trusted
-- SQL (migrations / dashboard), never by the Data API.

-- ---------------------------------------------------------------------------
-- is_admin() helper
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER (the default): it runs with the caller's privileges and
-- respects RLS. Because the admin_users SELECT policy above lets a user see
-- their own row, this returns true only for genuine admins. No SECURITY
-- DEFINER is needed, so there is no RLS-bypass surface.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- translation_messages
-- ---------------------------------------------------------------------------
create table if not exists public.translation_messages (
  id         uuid primary key default gen_random_uuid(),
  namespace  text not null,
  key        text not null,
  locale     text not null check (locale in ('id', 'en')),
  value      text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  unique (namespace, key, locale)
);

alter table public.translation_messages enable row level security;

create index if not exists translation_messages_locale_idx
  on public.translation_messages (locale);

-- Keep updated_at fresh on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists translation_messages_set_updated_at on public.translation_messages;
create trigger translation_messages_set_updated_at
  before update on public.translation_messages
  for each row
  execute function public.set_updated_at();

-- Public read: the site renders translations for everyone.
drop policy if exists "translation_messages_select_public" on public.translation_messages;
create policy "translation_messages_select_public"
  on public.translation_messages
  for select
  to anon, authenticated
  using (true);

-- Writes are admin-only. UPDATE needs both USING and WITH CHECK so a row can
-- never be edited into a state that fails the admin check.
drop policy if exists "translation_messages_insert_admin" on public.translation_messages;
create policy "translation_messages_insert_admin"
  on public.translation_messages
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "translation_messages_update_admin" on public.translation_messages;
create policy "translation_messages_update_admin"
  on public.translation_messages
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "translation_messages_delete_admin" on public.translation_messages;
create policy "translation_messages_delete_admin"
  on public.translation_messages
  for delete
  to authenticated
  using (public.is_admin());

-- Explicit Data API grants (RLS still gates which rows are visible/editable).
grant select on public.translation_messages to anon, authenticated;
grant insert, update, delete on public.translation_messages to authenticated;
grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------------
-- Seed the admin. The auth user must already exist (created in Supabase Auth).
-- ---------------------------------------------------------------------------
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'audifirdi@gmail.com'
on conflict (user_id) do nothing;
