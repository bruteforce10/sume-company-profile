import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { trustedLogos } from "@/constants/site";

export function TrustedBy() {
  return (
    <section className="overflow-hidden border-t border-sume-line bg-sume-mist pb-22 pt-18">
      <p className="mb-12 text-center font-head text-[13px] font-semibold uppercase tracking-[0.2em] text-sume-muted">
        Trusted by Leading Organizations
      </p>

      <div className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Marquee
          pauseOnHover
          repeat={3}
          className="[--duration:46s] [--gap:20px]"
        >
          {trustedLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex h-[84px] w-[180px] flex-none items-center justify-center   px-4 text-center font-head text-[15px] font-semibold text-sume-muted"
            >
              <Image
                src={logo.image}
                alt={logo.name}
                width={140}
                height={60}
                className="max-h-[60px] w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
