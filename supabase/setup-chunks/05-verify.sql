-- Defensive grant + verification (run last).
grant execute on function public.is_admin() to authenticated;

select 'admin_users' as tbl, count(*)::text as row_count from public.admin_users
union all select 'translation_messages', count(*)::text from public.translation_messages
union all select 'blog_authors',    count(*)::text from public.blog_authors
union all select 'blog_categories', count(*)::text from public.blog_categories
union all select 'blog_tags',       count(*)::text from public.blog_tags
union all select 'blog_posts',      count(*)::text from public.blog_posts
union all select 'bucket:blog-assets', count(*)::text from storage.buckets where id = 'blog-assets';
