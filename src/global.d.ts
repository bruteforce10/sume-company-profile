import type { routing } from "@/i18n/routing";
import type messages from "../messages/en.json";

// Register the app's locales and message shape with next-intl so that
// `useLocale()` returns the `Locale` union and `useTranslations()` keys are
// type-checked against the message catalog.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
