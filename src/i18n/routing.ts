import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales the site supports.
  locales: ["id", "en"],

  // Indonesian is the default — served at the root path (e.g. sumeid.com).
  defaultLocale: "id",

  // Omit the prefix for the default locale (`/about`) but keep it for the
  // others (`/en/about`). This makes Indonesian live at `/` and English at `/en`.
  localePrefix: "as-needed",

  // The root path is always Indonesian — never auto-redirect based on the
  // browser's Accept-Language header or a cookie. Visitors switch via the navbar.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
