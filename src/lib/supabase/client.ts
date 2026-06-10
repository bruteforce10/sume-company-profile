import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Client Components. `createBrowserClient`
// is a singleton internally, so calling this repeatedly is cheap.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
