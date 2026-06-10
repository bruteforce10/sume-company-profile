import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { createPublicClient } from "@/lib/supabase/public";

// Cache tag for the Supabase-backed message catalog. The CMS revalidates this
// tag after every save so edits go live without a redeploy.
export const MESSAGES_CACHE_TAG = "translation-messages";

export type MessageCatalog = Record<string, Record<string, string>>;

// Bundled JSON acts as the fallback/base layer. It also remains the source of
// truth for the TypeScript message shape (see src/global.d.ts).
async function loadBundled(locale: Locale): Promise<MessageCatalog> {
  return (await import(`../../messages/${locale}.json`)).default as MessageCatalog;
}

// Fetch the editable overrides from Supabase, grouped into a namespace/key map.
async function fetchOverrides(locale: Locale): Promise<MessageCatalog> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("translation_messages")
    .select("namespace, key, value")
    .eq("locale", locale);

  if (error) {
    // Never break rendering on a DB issue — the bundled catalog covers us.
    console.error(`[messages] Supabase fetch failed for "${locale}": ${error.message}`);
    return {};
  }

  const catalog: MessageCatalog = {};
  for (const { namespace, key, value } of data ?? []) {
    (catalog[namespace] ??= {})[key] = value;
  }
  return catalog;
}

const getCachedOverrides = unstable_cache(fetchOverrides, ["translation-messages"], {
  tags: [MESSAGES_CACHE_TAG],
  revalidate: 600,
});

// Returns the full catalog for a locale: Supabase overrides layered on top of
// the bundled defaults so missing keys always resolve.
export async function getLocaleMessages(locale: Locale): Promise<MessageCatalog> {
  const [bundled, overrides] = await Promise.all([
    loadBundled(locale),
    getCachedOverrides(locale),
  ]);

  const namespaces = new Set([...Object.keys(bundled), ...Object.keys(overrides)]);
  const merged: MessageCatalog = {};
  for (const namespace of namespaces) {
    merged[namespace] = { ...bundled[namespace], ...overrides[namespace] };
  }
  return merged;
}
