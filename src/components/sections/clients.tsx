import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { clients } from "@/constants/site";

type ClientLogo = (typeof clients)[number];

function ClientLogoItem({ client }: { client: ClientLogo }) {
  return (
    <div className="flex h-28 w-[280px] items-center justify-center px-4 grayscale transition hover:grayscale-0 sm:w-[330px]">
      <Image
        src={client.image}
        alt={`${client.name} logo`}
        width={client.width}
        height={client.height}
        className="h-auto max-h-[72px] w-auto max-w-full object-contain opacity-60 transition-opacity hover:opacity-100 sm:max-h-[90px]"
      />
    </div>
  );
}

export function Clients() {
  const midpoint = Math.ceil(clients.length / 2);
  const firstRow = clients.slice(0, midpoint);
  const secondRow = clients.slice(midpoint);

  return (
    <section className="bg-sume-bg-clients py-12 sm:py-16 lg:min-h-[470px] lg:py-12">
      <div className="section-shell flex min-h-[374px] flex-col items-center justify-center gap-12">
        <p className="text-center text-base font-bold uppercase tracking-widest text-sume-body/40">
          TRUSTED BY INDUSTRY LEADERS
        </p>

        <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:30s]">
            {firstRow.map((client) => (
              <ClientLogoItem key={client.name} client={client} />
            ))}
          </Marquee>

          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((client) => (
              <ClientLogoItem key={client.name} client={client} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-sume-bg-clients to-transparent sm:w-1/3" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-sume-bg-clients to-transparent sm:w-1/3" />
        </div>
      </div>
    </section>
  );
}
