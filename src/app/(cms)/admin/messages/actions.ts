"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { MESSAGES_CACHE_TAG } from "@/lib/messages";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { ok: boolean; error: string | null; ts: number };

// Field name format: field:{locale}:{sourceNamespace}:{key}
const FIELD = /^field:(id|en):([^:]+):(.+)$/;

// Saves every translation cell in a form section. Each field name encodes its
// source namespace so merged sections (e.g. Hero + Home) upsert to the correct
// DB namespace per field. Admin is re-verified here — proxy gating alone is
// not sufficient for server actions.
export async function saveNamespace(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const { claims } = await requireAdmin();

  const namespace = String(formData.get("namespace") ?? "").trim();
  if (!namespace) {
    return { ok: false, error: "Namespace tidak valid.", ts: Date.now() };
  }

  const rows: {
    namespace: string;
    key: string;
    locale: "id" | "en";
    value: string;
    updated_by: string | undefined;
  }[] = [];

  for (const [name, value] of formData.entries()) {
    const match = FIELD.exec(name);
    if (!match) continue;
    rows.push({
      namespace: match[2], // sourceNamespace encoded in the field name
      key: match[3],
      locale: match[1] as "id" | "en",
      value: String(value),
      updated_by: claims?.sub,
    });
  }

  if (rows.length === 0) {
    return { ok: false, error: "Tidak ada bidang untuk disimpan.", ts: Date.now() };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("translation_messages")
    .upsert(rows, { onConflict: "namespace,key,locale" });

  if (error) {
    return { ok: false, error: `Gagal menyimpan: ${error.message}`, ts: Date.now() };
  }

  // Make edits show up on the next request, everywhere. Both primitives are
  // required (per Next 16 docs) because the data and the HTML are cached in
  // separate layers:
  //  - updateTag: immediately EXPIRES the cached message data (the
  //    `unstable_cache` in lib/messages.ts) so a re-render reads fresh values.
  //    Read-your-own-writes; valid only inside a Server Action (this is one).
  //  - revalidatePath("/", "layout"): invalidates EVERY route's cache entry so
  //    statically prerendered (SSG) pages actually re-render instead of serving
  //    build-time HTML. Without this, updateTag refreshes the data but the old
  //    prerendered page keeps being served; without updateTag, the page
  //    re-renders but reads the still-cached (stale) data.
  updateTag(MESSAGES_CACHE_TAG);
  revalidatePath("/", "layout");

  return { ok: true, error: null, ts: Date.now() };
}
