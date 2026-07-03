-- Drops the {legal} placeholder from the footer copyright line. The legal
-- entity name is no longer shown, so the CMS-managed Footer.copyright value is
-- overwritten in place (unlike the do-nothing seed). The footer still passes an
-- empty `legal` arg, so any lingering fallback string renders without error and
-- this cleaned value shows no dangling "·" separator.

insert into public.translation_messages (namespace, key, locale, value) values
  ('Footer', 'copyright', 'id', '© {year} {brand}. Seluruh hak cipta dilindungi.'),
  ('Footer', 'copyright', 'en', '© {year} {brand}. All rights reserved.')
on conflict (namespace, key, locale) do update set value = excluded.value;
