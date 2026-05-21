import Image from "next/image";
import { clients } from "@/constants/site";
import { Marquee } from "@/components/ui/marquee";

export function Clients() {
  const firstRow = clients.slice(0, Math.ceil(clients.length / 2));
  const secondRow = clients.slice(Math.ceil(clients.length / 2));

  return (
    <section className="bg-sume-bg-clients py-12 sm:py-16 lg:min-h-[470px] lg:py-12">
      <div className="section-shell flex min-h-[374px] flex-col items-center justify-center gap-12">
        <p className="text-center text-md font-bold uppercase tracking-widest text-sume-body/40">
          TRUSTED BY INDUSTRY LEADERS
        </p>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6">
          <Marquee pauseOnHover className="[--duration:30s]">
            {firstRow.map((client) => (
              <div key={client.name} className="flex h-28 w-[280px] sm:w-[330px] items-center justify-center grayscale transition hover:grayscale-0 px-4">
                <Image src={client.image} alt={`${client.name} logo`} width={client.width} height={client.height} className="h-auto max-h-[72px] sm:max-h-[90px] w-auto max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </Marquee>

          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((client) => (
              <div key={client.name} className="flex h-28 w-[280px] sm:w-[330px] items-center justify-center grayscale transition hover:grayscale-0 px-4">
                <Image src={client.image} alt={`${client.name} logo`} width={client.width} height={client.height} className="h-auto max-h-[72px] sm:max-h-[90px] w-auto max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-sume-bg-clients to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-sume-bg-clients to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
