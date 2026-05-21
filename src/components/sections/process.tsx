"use client";

import { useState } from "react";
import Image from "next/image";
import { processContent, processSteps } from "@/constants/site";

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
              return (
                <article
                  key={item.step}
                  className="relative flex cursor-pointer items-start gap-6 transition-all"
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="z-10 flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-sume-blue text-lg font-bold text-white shadow-md">
                    {item.step}
                  </div>
                  <div className="flex w-full flex-col justify-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
                    <h3 className="font-display text-[18px] font-bold text-sume-ink">
                      {item.title}
                    </h3>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isActive
                          ? "mt-3 grid-rows-[1fr] opacity-100"
                          : "mt-0 grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm leading-6 text-sume-body">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
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
