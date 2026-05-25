import Image from "next/image";
import { solutions } from "@/constants/site";
import { BiBuildingHouse } from "react-icons/bi";
import { FiSliders } from "react-icons/fi";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const airConditioningLogos = [
  {
    src: "/images/business/midea.png",
    alt: "Midea",
    className: "h-8",
  },
  {
    src: "/images/business/hisene.png",
    alt: "Hisense",
    className: "h-5",
  },
  {
    src: "/images/business/broad.png",
    alt: "Broad",
    className: "h-7",
  },
];

const metricCards = [
  {
    solution: solutions[2],
    icon: BiBuildingHouse,
  },
  {
    solution: solutions[3],
    icon: FiSliders,
  },
];

function LogoStrip({
  children,
  className = "mt-8 pt-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-sume-line/50", className)}>
      {children}
    </div>
  );
}

function MetricSolutionCard({
  icon: Icon,
  solution,
}: {
  icon: IconType;
  solution: (typeof solutions)[number];
}) {
  return (
    <article className="flex flex-col rounded-md bg-white p-8 shadow-[var(--sume-shadow-card)] lg:col-span-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-sume-bg-blue-soft text-sume-blue">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-8 font-display text-2xl font-extrabold leading-tight text-sume-ink">
        {solution.title}
      </h3>
      <p className="my-5 text-sm leading-6 text-sume-body">
        {solution.description}
      </p>
      <div className="mt-8 border-t border-sume-line/50 pt-4 text-xs font-bold uppercase tracking-widest text-slate-400 lg:mt-auto">
        {solution.metric}
      </div>
    </article>
  );
}

export function BusinessSolutions() {
  const [airConditioning, elevators] = solutions;

  return (
    <section
      id="solutions"
      className="bg-sume-bg-solutions py-20 lg:py-[130px]"
    >
      <div className="section-shell">
        <div className="mx-auto max-w-[768px] text-center">
          <h2 className="section-title-blue">Our Business Solutions</h2>
          <p className="mx-auto mt-6 max-w-[730px] text-lg leading-7 text-sume-body">
            We partner with global leaders to bring you the highest quality
            infrastructure technology.
          </p>
        </div>

        <div className="mx-auto mt-[45px] grid max-w-[1250px] gap-6 lg:grid-cols-12">
          <article className="overflow-hidden rounded-md bg-white shadow-[var(--sume-shadow-soft)] lg:col-span-12 lg:grid lg:min-h-[508px] lg:grid-cols-[432px_1fr]">
            <div className="flex flex-col p-8 lg:p-12">
              <h3 className="font-display text-[30px] font-extrabold leading-tight text-sume-ink">
                {airConditioning.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-sume-body">
                {airConditioning.description}
              </p>
              <LogoStrip className="mt-9 flex max-md:flex-wrap items-center gap-6 pt-6">
                {airConditioningLogos.map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={80}
                    height={32}
                    className={cn("w-auto object-contain", logo.className)}
                  />
                ))}
              </LogoStrip>
            </div>
            <div className="relative min-h-[330px] overflow-hidden lg:min-h-[416px] lg:pl-4">
              <Image
                src="/images/sections/solution-main.png"
                alt="Air conditioning and chiller solutions"
                fill
                sizes="(min-width: 1024px) 696px, 100vw"
                className="object-contain object-bottom lg:object-right-bottom lg:p-4 lg:pb-0"
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-md bg-white shadow-[var(--sume-shadow-card)] lg:col-span-6 lg:flex">
            <div className="relative min-h-[300px] w-full lg:w-[220px] lg:shrink-0 xl:w-[260px]">
              <Image
                src="/images/sections/solution-side.png"
                alt="Elevators & Escalators"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8">
              <h3 className="font-display text-2xl font-extrabold leading-tight text-sume-ink">
                {elevators.title}
              </h3>
              <p className="mt-5 text-sm leading-6 text-sume-body">
                {elevators.description}
              </p>
              <LogoStrip>
                <Image
                  src="/images/business/linvol.png"
                  alt="LINVOL"
                  width={120}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
              </LogoStrip>
            </div>
          </article>

          {metricCards.map((card) => (
            <MetricSolutionCard
              key={card.solution.title}
              icon={card.icon}
              solution={card.solution}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
