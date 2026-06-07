import type { ReactNode } from "react";
import Image from "next/image";

type CtaBandProps = {
  title: ReactNode;
  description: ReactNode;
  /** Action buttons. */
  children: ReactNode;
};

/**
 * Shared blue closing CTA band used across interior pages.
 * Mirrors the `.cta` block (pattern-1 overlay + blue→navy gradient) from the design.
 */
export function CtaBand({ title, description, children }: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-sume-blue">
      <Image
        src="/images/home/pattern-1.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-45 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,88,190,0.93),rgba(14,36,60,0.82))]" />

      <div className="sume-wrap relative z-[2] py-28 text-center">
        <h2 className="mx-auto max-w-[24ch] font-head text-[clamp(30px,4vw,54px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          {title}
        </h2>
        <p className="mx-auto mb-9 mt-6 max-w-[58ch] text-[19px] leading-[1.55] text-white/85">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">{children}</div>
      </div>
    </section>
  );
}
