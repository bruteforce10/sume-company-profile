import "server-only";
import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import type { EditorNamespace } from "@/lib/cms-types";
import { createClient } from "@/lib/supabase/server";

type Catalog = Record<string, Record<string, string>>;

const bundled: Record<"id" | "en", Catalog> = {
  id: idMessages as Catalog,
  en: enMessages as Catalog,
};

// Builds the editor model: every namespace/key from the bundled catalog (the
// canonical shape) plus anything extra already in the DB, with each cell's
// current value (DB override → bundled fallback). Read live (uncached) so the
// editor always reflects the latest saved state.
export async function getTranslationEditorData(): Promise<EditorNamespace[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translation_messages")
    .select("namespace, key, locale, value");

  if (error) {
    throw new Error(`Failed to load translations: ${error.message}`);
  }

  const overrides: Record<"id" | "en", Catalog> = { id: {}, en: {} };
  for (const row of (data ?? []) as {
    namespace: string;
    key: string;
    locale: "id" | "en";
    value: string;
  }[]) {
    (overrides[row.locale][row.namespace] ??= {})[row.key] = row.value;
  }

  const namespaces = new Set<string>([
    ...Object.keys(bundled.en),
    ...Object.keys(bundled.id),
    ...Object.keys(overrides.en),
    ...Object.keys(overrides.id),
  ]);

  const model: EditorNamespace[] = [];
  for (const namespace of [...namespaces].sort()) {
    const keys = new Set<string>([
      ...Object.keys(bundled.en[namespace] ?? {}),
      ...Object.keys(bundled.id[namespace] ?? {}),
      ...Object.keys(overrides.en[namespace] ?? {}),
      ...Object.keys(overrides.id[namespace] ?? {}),
    ]);

    const fields = [...keys].sort().map((key) => {
      const en = overrides.en[namespace]?.[key] ?? bundled.en[namespace]?.[key] ?? "";
      const id = overrides.id[namespace]?.[key] ?? bundled.id[namespace]?.[key] ?? "";
      return { key, id, en, isLong: Math.max(en.length, id.length) > 70 };
    });

    model.push({ namespace, fields });
  }

  return model;
}
