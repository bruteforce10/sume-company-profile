import { whyChooseUs } from "@/constants/site";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-sume-bg-dark py-20 text-white lg:py-32">
      <div className="absolute inset-0 bg-[image:var(--sume-dark-surface)]" />
      <div className="section-shell relative">
        <div className="max-w-[646px]">
          <h2 className="font-display text-[36px] font-extrabold leading-tight sm:text-[48px] sm:leading-[48px]">Why Choose PT. SUME</h2>
          <p className="mt-6 text-lg leading-7 text-white/78">We go beyond installation, providing a partnership focused on the long-term success of your engineering investment.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, index) => (
            <article key={item.title} className={`rounded-[20px] border border-white/15 bg-white/10 p-7 backdrop-blur-xl ${index === 4 ? "md:col-span-2 lg:col-span-4" : ""}`}>
              <h3 className="font-display text-xl font-extrabold">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/72">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
