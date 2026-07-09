import { useTranslations } from "next-intl";
import { trustStats } from "@/constants/site";
import { SafeHtml } from "@/lib/safe-html";
import { cn } from "@/lib/utils";

export function PositioningStrip() {
  const t = useTranslations("Home");
  const stats = trustStats
    .map((stat) => ({
      ...stat,
      value: t(stat.valueKey),
      label: t(stat.labelKey),
    }))
    .filter((stat) => stat.value.trim() || stat.label.trim());

  return (
    <section id="about" className="border-b border-sume-line py-24">
      <div className="sume-wrap grid items-start gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-[72px]">
        <div>
          <SafeHtml
            as="h2"
            html={t.raw("tagline")}
            className="font-head text-[clamp(26px,2.6vw,38px)] font-semibold leading-[1.22] text-sume-navy [&_strong]:font-semibold [&_strong]:text-sume-blue"
          />
          <SafeHtml
            html={t.raw("description")}
            className="mt-6 max-w-[54ch] text-lg text-sume-body"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-[30px] pt-1.5">
          {stats.map((stat) => (
            <div
              key={stat.labelKey}
              className="border-l-2 border-sume-accent pl-[18px]"
            >
              <div className="font-head text-[34px] font-semibold leading-none text-sume-navy">
                <h3
                  className={cn(
                    stat.placeholder &&
                      "font-medium text-sume-line inline-block",
                  )}
                >
                  {stat.value}
                </h3>
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
