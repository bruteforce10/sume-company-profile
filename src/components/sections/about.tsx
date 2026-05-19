import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

const points = [
  "Comprehensive M&E systems for commercial and industrial buildings.",
  "Technical precision combined with practical field execution.",
];

export function About() {
  return (
    <section id="about" className="bg-sume-bg-about py-20 lg:py-24">
      <div className="section-shell grid items-start gap-[45px] lg:grid-cols-[568px_1fr]">
        <div className="relative min-h-[568px]">
          <div className="absolute left-0 top-0 h-[468px] w-full max-w-[469px] overflow-hidden rounded-[28px] shadow-[var(--sume-shadow-image)]">
            <Image src="/images/sections/about.png" alt="PT. SUME engineering team and site work" fill sizes="(min-width: 1024px) 469px, 90vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 max-w-[280px] rounded-2xl bg-white p-8 shadow-[var(--sume-shadow-soft)]">
            <div className="font-display text-[40px] font-extrabold leading-none text-sume-blue">10+</div>
            <div className="mt-3 text-base font-bold text-sume-ink">Years of Excellence</div>
            <p className="mt-3 text-sm leading-[22px] text-sume-body">delivering world-class engineering.</p>
          </div>
        </div>

        <div className="pt-0 lg:pt-0">
          <p className="inline-flex rounded-full bg-sume-bg-blue-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-sume-blue">Since 2014</p>
          <h2 className="mt-6 paper-heading">About PT. SUME</h2>
          <p className="mt-6 max-w-[523px] paper-body">
            We specialize in providing comprehensive, integrated M&E systems that serve as the backbone for modern buildings. Our mission is to combine technical precision with innovative technology to ensure safety, efficiency, and long-term reliability.
          </p>
          <div className="mt-8 grid max-w-[523px] gap-5">
            {points.map((point) => (
              <div key={point} className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-sume-blue" />
                <p className="text-base leading-7 text-sume-body">{point}</p>
              </div>
            ))}
          </div>
          <LinkButton href="#solutions" className="mt-8 h-[52px]">Learn More</LinkButton>
        </div>
      </div>
    </section>
  );
}
