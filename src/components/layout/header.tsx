"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { type NavLink, navLinks } from "@/constants/site";
import { cn } from "@/lib/utils";

function hrefPath(href: string) {
  return href.split("#")[0];
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Header");
  const links = navLinks[locale];

  const isLinkActive = (link: NavLink) =>
    pathname === link.href ||
    (link.children?.some((child) => hrefPath(child.href) === pathname) ??
      false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sume-line bg-white/90 backdrop-blur-[10px]">
        <div className="sume-wrap flex h-[78px] items-center justify-between">
          <Link
            href="/"
            aria-label={t("homeAria")}
            className="flex items-center gap-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sume-blue"
          >
            <Image
              src="/images/home/sume-logo.png"
              alt="SUME"
              width={1745}
              height={431}
              priority
              className="h-[26px] w-auto"
            />
            <span className="border-l border-sume-line pl-[11px] font-head text-sm font-semibold uppercase tracking-[0.22em] text-sume-muted">
              Group
            </span>
          </Link>

          <nav
            className="hidden items-center gap-[34px] lg:flex"
            aria-label="Primary navigation"
          >
            {links.map((link) => {
              const active = isLinkActive(link);

              if (!link.children) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-1 font-head text-[15px] transition",
                      active
                        ? "font-semibold text-sume-navy after:absolute after:inset-x-0 after:-bottom-[28px] after:h-0.5 after:bg-sume-blue"
                        : "font-medium text-sume-body hover:text-sume-blue",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div
                  key={link.href}
                  className="group relative flex items-center"
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-1 font-head text-[15px] transition",
                      active
                        ? "font-semibold text-sume-navy after:absolute after:inset-x-0 after:-bottom-[28px] after:h-0.5 after:bg-sume-blue"
                        : "font-medium text-sume-body hover:text-sume-blue",
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3 w-3 text-sume-muted transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  <div
                    className={cn(
                      "invisible absolute top-full z-50 pt-[30px] opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                      link.menuAlign === "right" ? "right-0" : "left-0",
                    )}
                  >
                    <div className="min-w-[244px] overflow-hidden rounded-[3px] border border-sume-line bg-white py-2 shadow-[0_18px_44px_-20px_rgba(14,36,60,0.45)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2.5 font-head text-[14.5px] font-medium text-sume-body transition hover:bg-sume-mist hover:text-sume-blue"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            <Link href="/contact" className="sume-btn sume-btn-primary">
              {t("getInTouch")}
            </Link>
          </div>

          <button
            type="button"
            aria-label={t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-sume-line bg-white/60 backdrop-blur-sm lg:hidden"
          >
            <Menu className="h-5 w-5 text-sume-navy" />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-md transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      >
        <div
          id="mobile-navigation"
          className={cn(
            "ml-auto flex min-h-dvh w-[85vw] max-w-sm flex-col bg-white p-6 shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-sume-line/60 pb-6">
            <div className="flex items-center gap-[11px]">
              <Image
                src="/images/home/sume-logo.png"
                alt="SUME"
                width={1745}
                height={431}
                className="h-6 w-auto"
              />
              <span className="border-l border-sume-line pl-[11px] font-head text-[13px] font-semibold uppercase tracking-[0.22em] text-sume-muted">
                Group
              </span>
            </div>
            <button
              type="button"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-sume-navy"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto py-6"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col">
              {links.map((link, index) => {
                const active = isLinkActive(link);

                return (
                  <div
                    key={link.href}
                    className={cn(
                      "border-sume-line/60",
                      index !== links.length - 1 && "border-b",
                    )}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[60px] items-center font-head text-[15px] transition-colors",
                        active
                          ? "font-semibold text-sume-blue"
                          : "font-medium text-sume-body hover:text-sume-blue",
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children ? (
                      <div className="flex flex-col border-t border-sume-line/40 pb-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="flex min-h-[46px] items-center pl-4 font-head text-[14px] font-medium text-sume-muted transition-colors hover:text-sume-blue"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto flex flex-col gap-4 border-t border-sume-line/60 pt-6 ">
            <LocaleSwitcher variant="inline" className="self-start" />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="sume-btn sume-btn-primary w-full"
            >
              {t("getInTouch")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
