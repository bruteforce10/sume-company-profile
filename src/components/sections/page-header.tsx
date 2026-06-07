import type { ReactNode } from "react";
import { OverlaySection } from "@/components/ui/overlay-section";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional content rendered below the description — e.g. a stats row. */
  children?: ReactNode;
};

/**
 * Shared dark page header used across the interior pages
 * (Solutions, Data Center, About, Projects, Regional, Contact).
 * Mirrors the `.phead` block from the design handoff.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <OverlaySection
      className="bg-sume-navy"
      image="/images/home/bg-overlay-header.png"
      priority
      overlayClassName="z-[1] bg-[linear-gradient(105deg,rgba(14,36,60,0.9)_0%,rgba(0,88,190,0.38)_60%,rgba(0,88,190,0.08)_100%)]"
      contentClassName="sume-wrap relative z-[2] pb-24 pt-[140px] sm:pb-[108px]"
    >
      <span className="sume-eyebrow mb-[22px] inline-block text-[#7fb4ff]">
        {eyebrow}
      </span>
      <h1 className="max-w-[16ch] font-head text-[clamp(40px,5.6vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em] text-white">
        {title}
      </h1>
      {description ? (
        <p className="mt-[22px] max-w-[58ch] text-[clamp(17px,1.4vw,20px)] leading-[1.56] text-white/80">
          {description}
        </p>
      ) : null}
      {children}
    </OverlaySection>
  );
}

type PageHeaderStat = {
  value: ReactNode;
  label: string;
};

/** Stats row rendered inside a PageHeader (Projects / Regional). */
export function PageHeaderStats({ stats }: { stats: PageHeaderStat[] }) {
  return (
    <div className="mt-14 flex max-w-[860px] flex-wrap gap-x-14 gap-y-8 border-t border-white/[0.16] pt-8">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className="font-head text-[clamp(26px,3vw,36px)] font-semibold leading-none text-white">
            {stat.value}
          </div>
          <div className="mt-2 font-head text-[12.5px] font-medium uppercase tracking-[0.06em] text-white/65">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
