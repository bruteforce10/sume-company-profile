import Image from "next/image";
import { whyChooseContent, whyChooseUs } from "@/constants/site";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <Image
        src="/why-choose.webp"
        alt="Why Choose PT. SUME"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="section-shell relative">
        <div className="mx-auto max-w-[800px] text-center text-white">
          <h2 className="font-display text-[36px] font-extrabold leading-tight sm:text-[48px] sm:leading-[48px]">
            {whyChooseContent.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-[646px] text-lg leading-7 text-white/90">
            {whyChooseContent.description}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-[900px] gap-4 md:grid-cols-2 lg:gap-6">
          {whyChooseUs.map((item, index) => (
            <article
              key={item.title}
              className={`rounded-md border border-white/80 bg-white/[70%] p-8 shadow-[var(--sume-shadow-card)] backdrop-blur-md ${
                index === 4 ? "md:col-span-2" : ""
              }`}
            >
              <h3 className="font-display text-xl font-extrabold text-sume-blue">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-sume-body">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
