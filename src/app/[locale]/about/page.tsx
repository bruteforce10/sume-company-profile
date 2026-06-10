import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { OverlaySection } from "@/components/ui/overlay-section";
import { certifications, milestones, whatSetsApart } from "@/constants/about";
import { languageAlternates } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "AboutPage",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/about")[locale],
      languages: languageAlternates("/about"),
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("AboutPage");

  return (
    <main>
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("headerTitle")}
        description={t("headerDescription")}
      />

      {/* ── Mission ──────────────────────────────────────────────── */}
      <section className="border-b border-sume-line py-26">
        <div className="sume-wrap grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[72px]">
          <div>
            <span className="sume-eyebrow mb-[18px] block">
              {t("whoWeAreEyebrow")}
            </span>
            <h2 className="font-head text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.2] tracking-[-0.02em] text-sume-navy">
              {t("whoWeAreHeading")}
            </h2>
          </div>
          <div className="max-w-[56ch] space-y-[22px] text-[18px] leading-[1.7] text-sume-body">
            <p>{t("missionP1")}</p>
            <p>
              {t.rich("missionP2", {
                ph: (chunks) => (
                  <span className="font-semibold text-sume-muted">{chunks}</span>
                ),
                strong: (chunks) => (
                  <strong className="font-semibold text-sume-navy">
                    {chunks}
                  </strong>
                ),
              })}
            </p>
            <p>{t("missionP3")}</p>
          </div>
        </div>
      </section>

      {/* ── Milestones ───────────────────────────────────────────── */}
      <section className="border-b border-sume-line bg-sume-mist py-26">
        <div className="sume-wrap">
          <div className="mb-15">
            <span className="sume-eyebrow mb-4 block">{t("journeyEyebrow")}</span>
            <h2 className="max-w-[20ch] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              {t("journeyHeading")}
            </h2>
            <p className="mt-3.5 text-[13.5px] italic text-sume-muted">
              {t("journeyNote")}
            </p>
          </div>

          <div className="relative">
            {/* connector line */}
            <div className="absolute left-0 right-0 top-[11px] hidden h-0.5 bg-sume-line lg:block" />
            <div className="absolute bottom-2 left-[11px] top-0 w-0.5 bg-sume-line lg:hidden" />

            <div className="grid gap-y-9 lg:grid-cols-6 lg:gap-y-0">
              {milestones[loc].map((m, index) => (
                <div
                  key={index}
                  className="relative pl-11 lg:pl-0 lg:pr-[18px]"
                >
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-sume-blue bg-white lg:relative">
                    <span className="h-[9px] w-[9px] rounded-full bg-sume-blue" />
                  </div>
                  <div className="font-head text-[22px] font-semibold tracking-[-0.01em] text-sume-navy lg:mt-6">
                    <span className="text-sume-line">{m.year}</span>
                  </div>
                  <div className="mt-2 text-[14.5px] leading-[1.5] text-sume-body lg:max-w-[22ch]">
                    {m.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart ───────────────────────────────────── */}
      <section className="border-b border-sume-line py-26">
        <div className="sume-wrap">
          <div className="mb-13">
            <span className="sume-eyebrow mb-4 block">{t("apartEyebrow")}</span>
            <h2 className="max-w-[20ch] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              {t("apartHeading")}
            </h2>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-sume-line sm:grid-cols-2 lg:grid-cols-4">
            {whatSetsApart[loc].map((card) => (
              <div
                key={card.num}
                className="border-b border-r border-sume-line px-8 pb-11 pt-10 transition hover:bg-sume-mist"
              >
                <div className="mb-[26px] font-head text-[12px] font-semibold tracking-[0.16em] text-sume-blue">
                  {card.num}
                </div>
                <h3 className="mb-3 font-head text-[19px] font-semibold leading-[1.3] text-sume-navy">
                  {card.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-sume-body">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────── */}
      <OverlaySection
        className="bg-sume-navy py-24"
        image="/section-licence-bg.webp"
        imageClassName="object-cover mix-blend-luminosity"
        overlayClassName="bg-sume-navy/80"
      >
        <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
          {t("certsEyebrow")}
        </span>
        <h2 className="max-w-[22ch] font-head text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          {t("certsHeading")}
        </h2>
        <p className="mb-12 mt-3.5 max-w-[52ch] text-[16px] leading-[1.55] text-white/[0.66]">
          {t("certsBody")}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certifications[loc].map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-start gap-3.5 rounded-[3px] border border-white/[0.14] bg-white/[0.04] p-[22px] pt-[30px] transition hover:border-[#7fb4ff]/50 hover:bg-white/[0.08]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#7fb4ff]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 stroke-[#7fb4ff]"
                >
                  {cert.icon}
                </svg>
              </div>
              <h4 className="text-[15px] font-semibold leading-[1.35] text-white">
                {cert.name}
              </h4>
              <div className="font-head text-[13px] font-semibold tracking-[0.04em] text-[#7fb4ff]">
                {cert.detail}
              </div>
            </div>
          ))}
        </div>
      </OverlaySection>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CtaBand title={t("ctaTitle")} description={t("ctaBody")}>
        <Link href="/contact" className="sume-btn sume-btn-white">
          {t("ctaButton")}
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </CtaBand>
    </main>
  );
}
