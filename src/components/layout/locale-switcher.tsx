"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  /** `dropdown` for the desktop navbar, `inline` for the mobile menu. */
  variant?: "dropdown" | "inline";
  className?: string;
};

export function LocaleSwitcher({
  variant = "dropdown",
  className,
}: LocaleSwitcherProps) {
  const t = useTranslations("LocaleSwitcher");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function selectLocale(nextLocale: Locale) {
    setOpen(false);
    if (nextLocale === activeLocale) return;
    startTransition(() => {
      // `pathname` from next-intl is locale-agnostic; the router re-applies the
      // correct prefix so the visitor stays on the same page in the new language.
      router.replace(pathname, { locale: nextLocale });
    });
  }

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "inline-flex rounded-[2px] border border-sume-line p-0.5",
          className,
        )}
        role="group"
        aria-label={t("label")}
      >
        {routing.locales.map((locale) => {
          const isActive = locale === activeLocale;
          return (
            <button
              key={locale}
              type="button"
              onClick={() => selectLocale(locale)}
              disabled={isPending}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "min-w-[64px] rounded-[2px] px-3 py-2 font-head text-[13px] font-semibold uppercase tracking-[0.06em] transition",
                isActive
                  ? "bg-sume-blue text-white"
                  : "text-sume-body hover:text-sume-blue",
              )}
            >
              {locale}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        className="flex items-center gap-1.5 rounded-[2px] px-3 py-2 font-head text-[14px] font-semibold text-sume-navy  transition hover:border-sume-blue hover:text-sume-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue "
      >
        <Globe className="h-4 w-4 text-sume-muted" />
        <span className="uppercase tracking-[0.04em]">{activeLocale}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-sume-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        role="listbox"
        className={cn(
          "absolute right-0 top-full z-50 mt-2 min-w-[176px] overflow-hidden rounded-[3px] bg-white border border-sume-line  py-1.5 shadow-[0_18px_44px_-20px_rgba(14,36,60,0.45)] transition-all duration-150",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {routing.locales.map((locale) => {
          const isActive = locale === activeLocale;
          return (
            <button
              key={locale}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => selectLocale(locale)}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left font-head text-[14.5px] transition",
                isActive
                  ? "font-semibold text-sume-blue"
                  : "font-medium text-sume-body hover:bg-sume-mist hover:text-sume-blue",
              )}
            >
              {t(locale)}
              <span className="font-head text-[12px] font-semibold uppercase tracking-[0.08em] text-sume-muted">
                {locale}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
