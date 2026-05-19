import Image from "next/image";
import { clients } from "@/constants/site";

export function Clients() {
  return (
    <section className="bg-sume-bg-clients py-12 sm:py-16 lg:min-h-[470px] lg:py-12">
      <div className="section-shell flex min-h-[374px] flex-col items-center justify-center gap-9">
        <p className="text-center text-sm font-bold uppercase tracking-[0.08em] text-sume-body">Trusted by Industry Leaders</p>
        <div className="grid w-full gap-5 rounded-[20px] border border-white/60 bg-white/70 p-5 shadow-[var(--sume-shadow-card)] backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((client) => (
            <div key={client.name} className="flex min-h-[78px] items-center justify-center rounded-xl px-3 grayscale transition hover:grayscale-0">
              <Image src={client.image} alt={`${client.name} logo`} width={client.width} height={client.height} className="h-auto max-h-14 w-auto max-w-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
