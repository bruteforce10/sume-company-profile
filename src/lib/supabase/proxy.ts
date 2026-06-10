import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

// Refreshes the Supabase auth session for an incoming request, writing any
// rotated cookies (and the required no-cache headers) onto `response`. Returns
// the verified JWT claims, or `null` when the visitor is not signed in.
//
// `getClaims()` is used deliberately: it validates the JWT signature on every
// call, unlike `getSession()` which must never be trusted in proxy code.
export async function refreshSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          // Prevent CDNs/proxies from caching a response that sets auth cookies.
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // IMPORTANT: do not run other logic between client creation and getClaims().
  const { data } = await supabase.auth.getClaims();

  return { claims: data?.claims ?? null };
}
