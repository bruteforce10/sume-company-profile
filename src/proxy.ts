import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { refreshSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

const isCmsPath = (pathname: string) =>
  pathname === "/login" ||
  pathname === "/admin" ||
  pathname.startsWith("/admin/") ||
  pathname.startsWith("/login/");

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CMS routes (`/login`, `/admin/**`) are not localized. Keep the Supabase
  // session fresh and gate `/admin` on being signed in. The admin role itself
  // is re-checked in the admin layout and every server action.
  if (isCmsPath(pathname)) {
    const response = NextResponse.next({ request });
    const { claims } = await refreshSession(request, response);

    // Gate /admin on being signed in. The admin *role* is verified in the
    // admin layout (and every server action); a signed-in non-admin landing on
    // /login is handled there, so we don't bounce /login here and risk a loop.
    if (!claims && pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    return response;
  }

  // The blog is Indonesian-only. Redirect any English blog URL (/en/blog…) to
  // the Indonesian blog (/blog…) so it never renders a soft 404 and English
  // visitors still reach the content. Runs before next-intl routing.
  if (pathname === "/en/blog" || pathname.startsWith("/en/blog/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/en".length);
    return NextResponse.redirect(url, 308);
  }

  // Marketing site: run next-intl, then attach refreshed auth cookies to its
  // response so the session survives across the localized pages too.
  const response = handleI18nRouting(request);
  await refreshSession(request, response);
  return response;
}

export const config = {
  // Match all pathnames except:
  // - API routes (`/api`)
  // - Next.js internals (`/_next`, `/_vercel`)
  // - files with an extension (`/favicon.ico`, `/sitemap.xml`, images, …)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
