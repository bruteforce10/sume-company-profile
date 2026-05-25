import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { company, heroContent } from "@/constants/site";
import { cn } from "@/lib/utils";

const heroCardPositionClass = {
  left: "left-[-2%] top-[45%] sm:left-[-5%] lg:left-[-15%] xl:left-[-60px]",
  right:
    "right-[-2%] bottom-[10%] sm:right-[-5%] lg:right-0 lg:bottom-[30%] xl:right-[11px]",
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-linear-to-t from-[#E5EBF7] to-white pt-28 lg:pt-52 xl:pt-14"
    >
      <div className="absolute inset-0 max-sm:bg-[image:var(--sume-hero-surface)]" />
      <div className="section-shell relative flex min-h-[755px] flex-col items-center justify-between py-0 xl:flex-row">
        <div className="relative z-10 w-full flex-1 pt-10 text-center lg:pt-0 xl:text-left">
          <h1 className="font-hero text-[42px] font-bold leading-[1.1] text-sume-ink sm:text-[54px] lg:text-[64px] xl:text-[68px]">
            {heroContent.heading.prefix}
            <span className="text-sume-blue">
              {heroContent.heading.highlight}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[526px] text-lg leading-relaxed text-sume-body sm:text-xl xl:mx-0">
            {company.description}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row xl:justify-start">
            <LinkButton
              href="#contact"
              className="group h-[60px] w-full px-8 sm:w-auto"
            >
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </LinkButton>
            <LinkButton
              href="/our-project"
              variant="secondary"
              className="h-[60px] w-full px-8 sm:w-auto"
            >
              View Our Projects
            </LinkButton>
          </div>
        </div>

        <div className="relative flex min-h-[400px] w-full shrink-0 items-end justify-center sm:min-h-[500px] lg:min-h-[755px] lg:w-[600px] xl:w-[600px]">
          <div className="relative mt-10 aspect-[583/578] w-full max-w-[480px] sm:max-w-[600px] lg:mt-0 lg:-mr-10 lg:max-w-none xl:-mr-16">
            <Image
              src="/images/sections/hero.webp"
              alt="Modern mechanical and electrical building solution"
              fill
              priority
              sizes="(min-width: 1280px) 750px, (min-width: 1024px) 550px, 90vw"
              className="object-cover object-bottom drop-shadow-2xl"
            />

            {heroContent.cards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className={cn(
                    "absolute w-[180px] sm:w-[220px] lg:w-[240px]",
                    card.position === "left"
                      ? heroCardPositionClass.left
                      : heroCardPositionClass.right,
                    card.position === "right" && "sm:w-[240px] lg:w-[266px]",
                  )}
                >
                  <div className="flex flex-col items-start justify-center gap-2 rounded-xl border border-white/40 bg-white/70 px-5 py-3 shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                    <Icon className="h-8 w-8 shrink-0 text-sume-blue lg:h-11 lg:w-11" />
                    <div className="flex flex-col items-start">
                      <h3 className="text-[14px] font-bold leading-snug text-sume-ink lg:text-base">
                        {card.title}
                      </h3>
                      <p className="mt-1 hidden text-[11px] leading-relaxed text-slate-600 sm:block lg:text-xs">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
