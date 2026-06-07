import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DataCenterTeaser() {
  return (
    <section
      id="data-center"
      className="relative overflow-hidden bg-sume-navy py-32"
    >
      <Image
        src="/images/home/hiro-6.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover object-center opacity-[0.32]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,36,60,0.94),rgba(14,36,60,0.6))]" />

      <div className="sume-wrap relative z-[2]">
        <span className="sume-eyebrow mb-5 block text-[#7fb4ff]">
          Data Center Infrastructure
        </span>
        <h2 className="max-w-[18ch] font-head text-[clamp(32px,4.4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          Built for the demands of the data center.
        </h2>
        <p className="my-6 max-w-[54ch] text-xl text-white/80">
          Power, cooling, monitoring, and security — engineered for 24/7
          operation with zero tolerance for downtime.
        </p>
        <Link href="/data-center" className="sume-btn sume-btn-primary">
          See Our Data Center Capabilities
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </section>
  );
}
