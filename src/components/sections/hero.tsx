"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { company, heroSlides } from "@/constants/site";
import { cn } from "@/lib/utils";

const DURATION = 6000;

export function Hero() {
  const t = useTranslations("Hero");
  const slides = heroSlides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => setCurrent((index) => (index + 1) % slides.length),
      DURATION,
    );
    return () => clearTimeout(timer);
  }, [current, slides.length]);

  const slide = slides[current];

  return (
    <section
      id="hero"
      className="relative h-[min(90vh,950px)] min-h-[600px] overflow-hidden bg-sume-navy"
    >
      {slides.map((item, index) => (
        <div
          key={item.num}
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-[1100ms] ease-in-out",
            index === current ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,36,60,0.88)_0%,rgba(14,36,60,0.66)_42%,rgba(14,36,60,0.22)_100%)]" />
        </div>
      ))}

      <div className="sume-wrap relative z-[3] flex h-full flex-col justify-center">
        <div key={current} className="max-w-[90ch] pb-20 animate-fade-in">
          <h2 className="mt-5 max-w-[120ch]  font-head text-[clamp(38px,5.6vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em] text-white">
            {t(slide.titleKey)}
          </h2>
          <p className="mt-5 max-w-[50ch] text-[clamp(17px,1.5vw,21px)] leading-[1.5] text-white/80">
            {t(slide.subtitleKey)}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/solutions" className="sume-btn sume-btn-primary">
              {t("exploreSolutions")}
            </Link>
            <a
              href={company.whatsapp}
              className="sume-btn sume-btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("talkToTeam")}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[4]">
        <div className="sume-wrap grid grid-cols-2 md:grid-cols-4">
          {slides.map((item, index) => {
            const isActive = index === current;
            const label = t(item.labelKey);

            return (
              <button
                key={item.num}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={t("slideAria", { label })}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group cursor-pointer pb-6 pr-6 pt-4 text-left font-head transition md:pt-[22px]",
                  isActive ? "text-white" : "text-white/60 hover:text-white",
                )}
              >
                <div className="relative mb-4 h-0.5 overflow-hidden bg-white/20">
                  {isActive ? (
                    <span
                      key={current}
                      className="absolute inset-y-0 left-0 w-0 animate-rail-fill bg-white"
                    />
                  ) : null}
                </div>
                <div className="text-xs font-semibold tracking-[0.14em] opacity-70">
                  {item.num}
                </div>
                <div className="mt-0.5 text-base font-semibold">{label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
