"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Records a single page view for a published article. Calls the security-definer
 * `record_post_view` RPC once per mount (guarded against React's dev double-invoke)
 * using the anon browser client — the RPC is the only public write surface and it
 * safely no-ops for drafts/unpublished slugs. Failures are ignored (best-effort).
 */
export function ViewTracker({ slug }: { slug: string }) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    const supabase = createClient();
    void supabase.rpc("record_post_view", { p_slug: slug });
  }, [slug]);

  return null;
}
