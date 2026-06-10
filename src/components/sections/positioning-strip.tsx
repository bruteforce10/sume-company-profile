import { useLocale, useTranslations } from "next-intl";
import { trustStats } from "@/constants/site";
import { cn } from "@/lib/utils";

export function PositioningStrip() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const stats = trustStats[locale];

  return (
    <section id="about" className="border-b border-sume-line py-24">
      <div className="sume-wrap grid items-start gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-[72px]">
        <div>
          <h2 className="font-head text-[clamp(26px,2.6vw,38px)] font-semibold leading-[1.22] text-sume-navy">
            <b className="font-semibold text-sume-blue">
              {t("positioningHeadingStrong")}
            </b>{" "}
            {t("positioningHeadingRest")}
          </h2>
          <p className="mt-6 max-w-[54ch] text-lg text-sume-body">
            {t("positioningBody")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-[30px] pt-1.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-l-2 border-sume-accent pl-[18px]"
            >
              <div className="font-head text-[34px] font-semibold leading-none text-sume-navy">
                <span className={cn(stat.placeholder && "font-medium text-sume-line")}>
                  {stat.value}
                </span>
                {stat.suffix}
              </div>
              <div className="mt-2 text-sm tracking-[0.02em] text-sume-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
