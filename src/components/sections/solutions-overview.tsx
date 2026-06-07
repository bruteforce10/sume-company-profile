import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { solutionsOverview } from "@/constants/site";

export function SolutionsOverview() {
  return (
    <section id="solutions" className="bg-sume-mist py-26">
      <div className="sume-wrap">
        <div className="mb-13 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="sume-eyebrow mb-4 block">Our Solutions</span>
            <h2 className="font-head text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              Built for environments where
              <br />
              downtime is not an option.
            </h2>
          </div>
          <p className="max-w-[42ch] text-lg text-sume-body">
            A complete mechanical &amp; electrical scope — engineered,
            delivered, and maintained under one accountable partner.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {solutionsOverview.map((solution) => (
            <Link
              key={solution.num}
              href={`/solutions#${solution.anchor}`}
              className="group flex flex-col overflow-hidden border border-sume-line bg-white transition duration-300 hover:-translate-y-[3px] hover:border-sume-blue hover:shadow-[0_18px_40px_-24px_rgba(14,36,60,0.4)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <span className="absolute left-4 top-4 z-[2] rounded-[2px] bg-sume-navy/70 px-3 py-1.5 font-head text-[13px] font-semibold tracking-[0.12em] text-white">
                  {solution.num}
                </span>
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-[30px] pb-8">
                <h3 className="mb-3 font-head text-[23px] font-semibold text-sume-navy">
                  {solution.title}
                </h3>
                <p className="mb-[22px] text-base text-sume-body">
                  {solution.description}
                </p>
                <span className="inline-flex items-center gap-2 font-head text-sm font-semibold text-sume-blue transition-all duration-200 group-hover:gap-[13px]">
                  Explore solution
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
