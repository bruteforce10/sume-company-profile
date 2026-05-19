import { ArrowRight, Award, TrendingUp } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { company } from "@/constants/site";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-sume-bg-hero pt-52 xl:pt-14 ">
      <div className="absolute inset-0 bg-[image:var(--sume-hero-surface)]" />
      <div className="section-shell relative flex flex-col xl:flex-row min-h-[755px] items-center justify-between  py-12 lg:py-0">

        {/* Left Content */}
        <div className="flex-1 w-full relative z-10 pt-10 lg:pt-0">
          <h1 className="font-hero font-bold leading-[1.1] tracking-[-0.03em] text-sume-ink text-[42px] sm:text-[54px] lg:text-[5vw] xl:text-[68px]">
            Modern Buildings Solution is Our <span className="text-sume-blue">Focus</span>
          </h1>
          <p className="mt-6 max-w-[526px] text-lg leading-relaxed text-sume-body sm:text-xl">
            {company.description}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <LinkButton href="#contact" className="group h-[60px] w-full sm:w-auto px-8">
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </LinkButton>
            <LinkButton
              href="/our-project"
              variant="secondary"
              className="h-[60px] w-full sm:w-auto px-8"
            >
              View Our Projects
            </LinkButton>
          </div>
        </div>

        {/* Right Content */}
        <div className="shrink-0 relative w-full lg:w-[600px] xl:w-[600px] min-h-[400px] sm:min-h-[500px] lg:min-h-[755px] flex items-end justify-center ">
          <div className="relative w-full max-w-[480px] sm:max-w-[600px] lg:max-w-none aspect-[583/578] mt-10 lg:mt-0 lg:-mr-10 xl:-mr-16">
            <Image
              src="/images/sections/hero.webp"
              alt="Modern mechanical and electrical building solution"
              fill
              priority
              sizes="(min-width: 1280px) 750px, (min-width: 1024px) 550px, 90vw"
              className="object-cover object-bottom drop-shadow-2xl"
            />

            {/* Floating Card 1: Reliable Execution */}
            <div className="absolute left-[-2%] sm:left-[-5%] lg:left-[-15%] xl:left-[-60px] top-[15%] lg:top-[45%] w-[180px] sm:w-[220px] lg:w-[240px] flex flex-col items-start justify-center rounded-xl py-3 px-5 gap-2 backdrop-blur-md bg-white/70 border border-white/40 shadow-xl transition-transform hover:-translate-y-1 duration-300">
              <TrendingUp className="h-7 w-7 lg:h-9 lg:w-9 text-sume-blue shrink-0" />
              <div className="flex flex-col items-start">
                <h2 className="font-bold text-sume-ink text-[14px] lg:text-[16px] leading-snug">
                  Reliable Execution
                </h2>
                <p className="hidden sm:block text-slate-600 text-[11px] lg:text-[12px] leading-relaxed mt-1">
                  We deliver projects with precision and long-term performance.
                </p>
              </div>
            </div>

            {/* Floating Card 2: Certificate Global */}
            <div className="absolute right-[-2%] sm:right-[-5%] lg:right-[0%] xl:right-[11px] bottom-[10%] lg:bottom-[30%] w-[180px] sm:w-[240px] lg:w-[266px] flex flex-col items-start justify-center rounded-xl py-3 px-5 gap-2 backdrop-blur-md bg-white/70 border border-white/40 shadow-xl transition-transform hover:-translate-y-1 duration-300">
              <Award className="h-8 w-8 lg:h-11 lg:w-11 text-sume-blue shrink-0" />
              <div className="flex flex-col items-start">
                <h2 className="font-bold text-sume-ink text-[14px] lg:text-[18px] leading-snug">
                  Certificate Global
                </h2>
                <p className="hidden sm:block text-slate-600 text-[11px] lg:text-[13px] leading-relaxed mt-1">
                  Aligned with trusted manufacturers and certified systems.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
