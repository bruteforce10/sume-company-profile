import { createClient } from "@supabase/supabase-js";

// Cookie-less Supabase client for anonymous, cacheable public reads (e.g.
// loading translation messages inside `unstable_cache`, which forbids touching
// request cookies/headers). RLS still applies — this client only sees rows that
// the `anon` role is allowed to read.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
