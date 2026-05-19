import Image from "next/image";
import { processSteps } from "@/constants/site";

export function Process() {
  return (
    <section className="bg-[image:var(--sume-process-surface)] py-20 lg:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-[1073px] text-center">
          <h2 className="paper-heading">How We Deliver Excellence</h2>
          <p className="mx-auto mt-6 max-w-[821px] paper-body">A structured and reliable approach to delivering Mechanical and Electrical systems from consultation to handover.</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1072px] gap-10 lg:grid-cols-[512px_1fr] lg:items-center">
          <div className="relative grid gap-5">
            <div className="absolute bottom-16 left-8 top-16 hidden w-px bg-sume-blue/25 sm:block" />
            {processSteps.map((item) => (
              <article key={item.step} className="relative flex gap-5 rounded-[18px] border border-white/70 bg-white/70 p-5 shadow-[var(--sume-shadow-card)] backdrop-blur-xl">
                <div className="z-10 flex h-16 w-16 flex-none items-center justify-center rounded-full bg-sume-blue text-lg font-black text-white">{item.step}</div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-sume-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-sume-body">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="relative min-h-[604px] overflow-hidden rounded-[28px] shadow-[var(--sume-shadow-image)]">
            <Image src="/images/sections/process.png" alt="Engineering delivery process" fill sizes="(min-width: 1024px) 515px, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
