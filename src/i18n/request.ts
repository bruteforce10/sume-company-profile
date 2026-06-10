import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { getLocaleMessages } from "@/lib/messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` corresponds to the `[locale]` segment.
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Loaded from Supabase (cached + tag-revalidated), layered over the
    // bundled JSON so a missing key or DB hiccup never breaks a page.
    messages: await getLocaleMessages(locale),
  };
});
