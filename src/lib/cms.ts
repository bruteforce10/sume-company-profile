import "server-only";
import enMessages from "../../messages/en.json";
import idMessages from "../../messages/id.json";
import { NAMESPACE_SCHEMAS, NAMESPACE_GROUPS } from "@/lib/cms-schema";
import type { EditorField, EditorNamespace } from "@/lib/cms-types";
import { createClient } from "@/lib/supabase/server";

type Catalog = Record<string, Record<string, string>>;

const bundled: Record<"id" | "en", Catalog> = {
  id: idMessages as Catalog,
  en: enMessages as Catalog,
};

function buildNamespaceFields(
  namespace: string,
  overrides: Record<"id" | "en", Catalog>,
): Array<Omit<EditorField, "sourceNamespace">> {
  const schema = NAMESPACE_SCHEMAS[namespace];
  const keys = new Set<string>([
    ...Object.keys(bundled.en[namespace] ?? {}),
    ...Object.keys(bundled.id[namespace] ?? {}),
    ...Object.keys(overrides.en[namespace] ?? {}),
    ...Object.keys(overrides.id[namespace] ?? {}),
  ]);

  const orderedKeys = schema?.order
    ? [
        ...schema.order.filter((key) => keys.has(key)),
        ...[...keys].filter((key) => !schema.order!.includes(key)).sort(),
      ]
    : [...keys].sort();

  return orderedKeys.map((key) => {
    const en = overrides.en[namespace]?.[key] ?? bundled.en[namespace]?.[key] ?? "";
    const id = overrides.id[namespace]?.[key] ?? bundled.id[namespace]?.[key] ?? "";
    const fieldSchema = schema?.fields?.[key];
    return {
      key,
      label: fieldSchema?.label ?? key,
      id,
      en,
      isLong: Math.max(en.length, id.length) > 70,
      rich: fieldSchema?.kind === "rich",
    };
  });
}

// Builds the editor model: every namespace/key from the bundled catalog (the
// canonical shape) plus anything extra already in the DB, with each cell's
// current value (DB override → bundled fallback). Namespaces listed in
// NAMESPACE_GROUPS are merged into a single EditorNamespace under the group
// name. Read live (uncached) so the editor always reflects the latest state.
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

  // Build reverse lookup: member namespace → group display name
  const memberToGroup: Record<string, string> = {};
  for (const [groupName, members] of Object.entries(NAMESPACE_GROUPS)) {
    for (const member of members) {
      memberToGroup[member] = groupName;
    }
  }

  const allRawNamespaces = new Set<string>([
    ...Object.keys(bundled.en),
    ...Object.keys(bundled.id),
    ...Object.keys(overrides.en),
    ...Object.keys(overrides.id),
  ]);

  // Replace group members with their group display name for the sorted display list
  const displayNamespaces = new Set<string>();
  for (const ns of allRawNamespaces) {
    displayNamespaces.add(memberToGroup[ns] ?? ns);
  }

  const NAMESPACE_ORDER = ["Meta", "Header", "Home", "AboutPage", "SolutionsPage"];

  const sorted = [...displayNamespaces].sort((a, b) => {
    const ai = NAMESPACE_ORDER.indexOf(a);
    const bi = NAMESPACE_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  const model: EditorNamespace[] = [];
  for (const displayNs of sorted) {
    const groupMembers = NAMESPACE_GROUPS[displayNs];
    if (groupMembers) {
      const fields: EditorField[] = [];
      for (const member of groupMembers) {
        for (const field of buildNamespaceFields(member, overrides)) {
          fields.push({ ...field, sourceNamespace: member });
        }
      }
      model.push({ namespace: displayNs, fields });
    } else {
      const fields = buildNamespaceFields(displayNs, overrides).map((field) => ({
        ...field,
        sourceNamespace: displayNs,
      }));
      model.push({ namespace: displayNs, fields });
    }
  }

  return model;
}
