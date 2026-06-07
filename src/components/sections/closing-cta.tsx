import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ClosingCta() {
  return (
    <section id="contact" className="relative overflow-hidden bg-sume-blue">
      <Image
        src="/images/home/pattern-1.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-50 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,88,190,0.96),rgba(14,36,60,0.3))]" />

      <div className="sume-wrap relative z-[2] py-30 text-center">
        <h2 className="mx-auto max-w-[20ch] font-head text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          Let&apos;s engineer your infrastructure.
        </h2>
        <p className="mx-auto my-6 mb-10 max-w-[60ch] text-[19px] leading-[1.55] text-white/85">
          From mission-critical power systems to data center environments, we
          build infrastructure designed for performance, reliability, and
          uptime.
        </p>
        <Link href="/contact" className="sume-btn sume-btn-white">
          Request a Consultation
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </section>
  );
}
