import { ArrowRight, Cable, Fan, ServerCog, Zap } from "lucide-react";
import Image from "next/image";
import { solutions } from "@/constants/site";

const icons = [Fan, Zap, Cable, ServerCog];

export function BusinessSolutions() {
  return (
    <section id="solutions" className="bg-sume-bg-solutions py-20 lg:py-[130px]">
      <div className="section-shell">
        <div className="mx-auto max-w-[768px] text-center">
          <h2 className="font-display text-[36px] font-extrabold leading-tight text-sume-blue sm:text-[48px] sm:leading-[48px]">Our Business Solutions</h2>
          <p className="mx-auto mt-6 max-w-[730px] text-lg leading-7 text-sume-body">We partner with global leaders to bring you the highest quality infrastructure technology.</p>
        </div>

        <div className="mx-auto mt-[45px] grid max-w-[1250px] gap-6 lg:grid-cols-12">
          <article className="overflow-hidden rounded-[28px] bg-white shadow-[var(--sume-shadow-soft)] lg:col-span-12 lg:grid lg:min-h-[508px] lg:grid-cols-[432px_1fr]">
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <h3 className="font-display text-[30px] font-extrabold leading-tight text-sume-ink">{solutions[0].title}</h3>
              <p className="mt-5 text-base leading-7 text-sume-body">{solutions[0].description}</p>
              <div className="mt-9 flex items-center gap-3 border-t border-sume-line/50 pt-5 text-sm font-bold text-sume-blue">
                {solutions[0].metric}
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="relative min-h-[330px] overflow-hidden lg:min-h-[416px]">
              <Image src="/images/sections/solution-main.png" alt="Chiller systems and engineering solution" fill sizes="(min-width: 1024px) 696px, 100vw" className="object-cover" />
            </div>
          </article>

          {solutions.slice(1).map((solution, index) => {
            const Icon = icons[index + 1];
            return (
              <article key={solution.title} className={`${index === 0 ? "lg:col-span-5" : "lg:col-span-3"} rounded-[24px] bg-white p-8 shadow-[var(--sume-shadow-card)]`}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sume-bg-blue-soft text-sume-blue">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-8 font-display text-2xl font-extrabold leading-tight text-sume-ink">{solution.title}</h3>
                <p className="mt-5 text-base leading-7 text-sume-body">{solution.description}</p>
                <div className="mt-8 border-t border-sume-line/50 pt-4 text-sm font-bold text-sume-blue">{solution.metric}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
