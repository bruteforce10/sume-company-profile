"use client";

import { useState } from "react";
import Image from "next/image";
import { processContent, processSteps } from "@/constants/site";
import { cn } from "@/lib/utils";

export function Process() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-[image:var(--sume-process-surface)] py-20 lg:py-32">
      <div className="section-shell">
        <div className="mx-auto max-w-[1073px] text-center">
          <h2 className="paper-heading">{processContent.heading}</h2>
          <p className="mx-auto mt-6 max-w-[821px] paper-body">
            {processContent.description}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1072px] gap-10 lg:grid-cols-[512px_1fr] lg:items-start">
          <div className="relative grid gap-5">
            <div className="absolute bottom-16 left-8 top-16 hidden border-l-2 border-dashed border-sume-blue/30 sm:block" />
            {processSteps.map((item, index) => {
              const isActive = activeIndex === index;
              const panelId = `process-step-${item.step}`;

              return (
                <button
                  key={item.step}
                  type="button"
                  className="relative flex cursor-pointer appearance-none items-start gap-6 border-0 bg-transparent p-0 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sume-blue"
                  onClick={() => setActiveIndex(index)}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                >
                  <span className="z-10 flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-sume-blue text-lg font-bold text-white shadow-md">
                    {item.step}
                  </span>
                  <span className="flex w-full flex-col justify-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
                    <span className="font-display text-[18px] font-bold text-sume-ink">
                      {item.title}
                    </span>
                    <span
                      id={panelId}
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isActive
                          ? "mt-3 grid-rows-[1fr] opacity-100"
                          : "mt-0 grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block text-sm leading-6 text-sume-body">
                          {item.description}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative min-h-[604px] overflow-hidden rounded-md shadow-[var(--sume-shadow-image)]">
            <Image
              src="/images/sections/process.png"
              alt="Engineering delivery process"
              fill
              sizes="(min-width: 1024px) 515px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
