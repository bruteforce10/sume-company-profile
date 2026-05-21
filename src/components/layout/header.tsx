"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { company, navLinks } from "@/constants/site";
import { cn } from "@/lib/utils";

const SCROLLED_THRESHOLD = 20;
const ACTIVE_SECTION_OFFSET = 200;
const firstNavHref = navLinks[0]?.href ?? "";

function getSectionId(href: string) {
  return href.includes("#") ? href.split("#")[1] : undefined;
}

function getActiveSectionHref() {
  for (const link of navLinks) {
    const id = getSectionId(link.href);
    if (!id) continue;

    const element = document.getElementById(id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    if (
      rect.top <= ACTIVE_SECTION_OFFSET &&
      rect.bottom >= ACTIVE_SECTION_OFFSET
    ) {
      return link.href;
    }
  }

  return window.scrollY < 100 ? firstNavHref : "";
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(firstNavHref);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLLED_THRESHOLD);

      if (pathname === "/") {
        setActiveSection(getActiveSectionHref());
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-white/70 text-sume-ink shadow-[var(--sume-shadow-line)] backdrop-blur-xl"
            : "bg-transparent py-2 text-sume-ink lg:py-4",
        )}
      >
        <div className="section-shell flex h-20 items-center justify-between gap-4 lg:h-24">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
          >
            <Image
              src="/images/brand/logo-sume.webp"
              alt="PT. SUME logo"
              width={192}
              height={25}
              priority
              className="h-auto w-40 sm:w-48"
            />
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname === "/" && activeSection === link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "min-h-11 py-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sume-blue",
                    isActive
                      ? "font-bold text-sume-blue"
                      : "font-medium text-sume-body hover:text-sume-blue",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <span className="px-3 py-2 text-xs font-semibold text-sume-body">
              IDN
            </span>
            <Link
              href={company.whatsapp}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-sume-blue px-6 text-sm font-bold text-white transition hover:bg-sume-blue-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sume-blue"
            >
              <FaWhatsapp className="h-6 w-6" />
              Call Whatsapp
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md transition-all duration-300 lg:hidden",
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <Image
              src="/images/brand/logo-sume.webp"
              alt="PT. SUME logo"
              width={140}
              height={18}
              className="h-auto w-32"
            />
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-sume-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto py-6"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col">
              {navLinks.map((link, index) => {
                const isActive =
                  pathname === link.href ||
                  (pathname === "/" && activeSection === link.href);

                return (
                  <div
                    key={link.href}
                    className={cn(
                      "border-slate-100",
                      index !== navLinks.length - 1 && "border-b",
                    )}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-[60px] items-center py-2 text-[15px] transition-colors",
                        isActive
                          ? "font-bold text-sume-blue"
                          : "font-medium text-slate-700 hover:text-sume-blue",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <Link
              href={company.whatsapp}
              className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg bg-sume-blue px-5 text-[15px] font-bold text-white shadow-[var(--sume-shadow-blue)] transition-all hover:bg-sume-blue-hover"
            >
              <FaWhatsapp className="h-[18px] w-[18px]" />
              Call Whatsapp
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
