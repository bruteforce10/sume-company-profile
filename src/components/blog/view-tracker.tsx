"use client";

import { useEffect, useRef } from "react";

/**
 * Records a single page view for a published article by POSTing to the
 * `/api/blog/view` route once per mount (guarded against React's dev
 * double-invoke). The write happens server-side because the self-hosted Supabase
 * is HTTP-only — calling it straight from the browser is blocked as mixed content
 * on the deployed HTTPS site. Failures are ignored (best-effort).
 */
export function ViewTracker({ slug }: { slug: string }) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    void fetch("/api/blog/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
