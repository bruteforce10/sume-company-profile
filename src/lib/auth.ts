import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Resolved once per request (React `cache`): verifies the session via
// `getClaims()` (validates the JWT signature) and checks admin membership
// through the `is_admin()` RLS helper.
export const getAuthContext = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  let isAdmin = false;
  if (claims) {
    const { data: result } = await supabase.rpc("is_admin");
    isAdmin = result === true;
  }

  return { claims, isAdmin };
});

export type AuthContext = Awaited<ReturnType<typeof getAuthContext>>;

// Guard for the admin layout and admin server components. Redirects rather than
// throwing so unauthorized users land somewhere sensible.
export async function requireAdmin(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx.claims) redirect("/login");
  if (!ctx.isAdmin) redirect("/login?error=forbidden");
  return ctx;
}
