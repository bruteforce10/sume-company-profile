import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { aboutContent } from "@/constants/site";

export function About() {
  return (
    <section id="about" className="bg-sume-bg-about py-20 lg:py-24">
      <div className="section-shell grid items-start gap-[45px] lg:grid-cols-[568px_1fr]">
        <div className="order-2 lg:order-1 relative min-h-[568px]">
          <div className="absolute left-0 top-0 h-[468px] w-full lg:max-w-[469px] overflow-hidden rounded-md shadow-[var(--sume-shadow-image)]">
            <Image
              src="/images/sections/about.png"
              alt="PT. SUME engineering team and site work"
              fill
              sizes="(min-width: 1024px) 469px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 max-w-[280px] rounded-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 shadow-[var(--sume-shadow-soft)]">
            <div className="font-display text-[40px] font-extrabold leading-none text-sume-blue">
              10+
            </div>
            <div className="mt-3 text-base font-bold text-sume-ink">
              Years of Excellence
            </div>
            <p className="mt-3 text-sm leading-[22px] text-sume-body">
              delivering world-class engineering.
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2 pt-0 lg:pt-0 w-fit mx-auto lg:w-full lg:mx-0">
          <p className="section-eyebrow mx-auto lg:mx-0">
            {aboutContent.preheading}
          </p>
          <h2 className="mt-6 paper-heading w-full text-center lg:text-left">
            {aboutContent.heading}
          </h2>
          <p className="mt-6 max-w-full lg:max-w-[523px] paper-body text-center lg:text-left mx-auto lg:mx-0">
            {aboutContent.body}
          </p>
          <div className="mt-8 grid w-full max-w-full lg:max-w-[523px] gap-6">
            {aboutContent.points.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex gap-4">
                  <Icon className="mt-0.5 h-6 w-6 flex-none text-sume-blue" />
                  <div>
                    <h3 className="text-base font-bold text-sume-ink">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-sume-body">
                      {point.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <LinkButton
            href={aboutContent.buttonHref}
            className="mt-8 h-[52px] w-full bg-gray-200 text-sume-ink shadow-none hover:bg-gray-300 sm:w-auto"
          >
            {aboutContent.buttonLabel}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
