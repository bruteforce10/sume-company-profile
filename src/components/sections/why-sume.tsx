import { useTranslations } from "next-intl";
import Image from "next/image";
import { whySume } from "@/constants/site";

export function WhySume() {
  const t = useTranslations("Home");
  const items = whySume;

  return (
    <section className="relative overflow-hidden py-26">
      <Image
        src="/images/home/pattern-2.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-70"
      />

      <div className="sume-wrap relative z-[1]">
        <div className="mb-13">
          <span className="sume-eyebrow mb-4 block">{t("whyEyebrow")}</span>
          <h2 className="font-head text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
            {t("whyHeading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 border-l border-t border-sume-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.num}
              className="border-b border-r border-sume-line bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(248,251,255,0.88)_100%)] px-8 pb-11 pt-10 backdrop-blur-[2px] transition hover:bg-[linear-gradient(160deg,rgba(255,255,255,1)_0%,rgba(231,241,255,0.95)_100%)]"
            >
              <div className="mb-7 font-head text-[13px] font-semibold tracking-[0.14em] text-sume-blue">
                {item.num}
              </div>
              <h3 className="mb-3.5 font-head text-xl font-semibold leading-[1.25] text-sume-navy">
                {t(item.titleKey)}
              </h3>
              <p className="text-[15.5px] text-sume-body">
                {item.placeholderPrefix ? (
                  <span className="text-sume-line">{item.placeholderPrefix}</span>
                ) : null}
                {t(item.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
