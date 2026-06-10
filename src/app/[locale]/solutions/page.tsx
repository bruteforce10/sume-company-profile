import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { OverlaySection } from "@/components/ui/overlay-section";
import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import {
  aftersalesPoints,
  partnerBrands,
  solutionPillars,
} from "@/constants/solutions";
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
    namespace: "SolutionsPage",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/solutions")[locale],
      languages: languageAlternates("/solutions"),
    },
  };
}

function brandInitials(name: string) {
  if (name === "+ more") return "…";
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("SolutionsPage");

  return (
    <main>
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("headerTitle")}
        description={t("headerDescription")}
      />

      {/* ── Pillars ──────────────────────────────────────────────── */}
      {solutionPillars[loc].map((pillar, index) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={`scroll-mt-20 border-b border-sume-line py-26 ${
            index % 2 === 1 ? "bg-sume-mist" : "bg-white"
          }`}
        >
          <div className="sume-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
            <div className={`flex flex-col gap-6 w-full ${pillar.flip ? "lg:order-2" : ""}`}>
              <div className="sume-chamfer relative aspect-[4/3] w-full overflow-hidden">
                <span className="absolute left-[18px] top-[18px] z-[2] rounded-[2px] bg-sume-navy/[0.78] px-[13px] py-[7px] font-head text-[12px] font-semibold tracking-[0.16em] text-white">
                  {pillar.tagnum}
                </span>
                <Image
                  src={pillar.image}
                  alt={pillar.eyebrow}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {pillar.id === "power" && (
                <div className="w-full overflow-hidden border border-sume-line flex bg-white">
                  <img
                    src="/power-aftersales-service.webp"
                    alt="Power Aftersales Service"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>

            <div>
              <span className="sume-eyebrow mb-4 block">{pillar.eyebrow}</span>
              <h2 className="mb-[18px] font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                {pillar.title}
              </h2>
              <p className="mb-[34px] max-w-[46ch] text-[17.5px] leading-[1.6] text-sume-body">
                {pillar.lead}
              </p>

              <ul className="flex flex-col">
                {pillar.caps.map((cap, capIndex) => (
                  <li
                    key={cap.title}
                    className={`flex gap-[18px] border-t border-sume-line py-5 ${
                      capIndex === pillar.caps.length - 1
                        ? "border-b border-sume-line"
                        : ""
                    }`}
                  >
                    <span className="mt-[9px] h-2 w-2 flex-none rounded-full bg-sume-blue" />
                    <div>
                      <h4 className="mb-[5px] font-head text-[17px] font-semibold text-sume-navy">
                        {cap.title}
                      </h4>
                      <p className="text-[15px] leading-[1.55] text-sume-body">
                        {cap.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {pillar.id === "power" ? (
                <div className="mt-[34px] border border-l-[3px] border-sume-line border-l-sume-blue bg-white p-7 sm:px-[30px]">
                  <h3 className="mb-1.5 font-head text-[18px] font-semibold text-sume-navy">
                    {t("aftersalesTitle")}
                  </h3>
                  <p className="mb-5 max-w-[50ch] text-[14.5px] leading-[1.55] text-sume-body">
                    {t("aftersalesBody")}
                  </p>
                  <ul className="grid gap-3.5">
                    {aftersalesPoints[loc].map((item) => (
                      <li
                        key={item.bold}
                        className="flex gap-[13px] text-[14.5px] leading-[1.5] text-sume-body"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 h-[18px] w-[18px] flex-none stroke-sume-blue"
                        >
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        <span>
                          <b className="font-semibold text-sume-navy">
                            {item.bold}
                          </b>
                          {item.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      {/* ── Yuchai Industrial Plant Video ────────────────────────── */}
      <section
        id="yuchai-plant"
        className="scroll-mt-20 border-b border-sume-line bg-sume-navy py-26"
      >
        <div className="sume-wrap grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
              {t("yuchaiEyebrow")}
            </span>
            <h2 className="mb-[18px] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              {t("yuchaiHeading")}
            </h2>
            <p className="mb-7 max-w-[46ch] text-[17.5px] leading-[1.6] text-white/[0.7]">
              {t("yuchaiBody")}
            </p>
            <Link
              href="/solutions#power"
              className="inline-flex items-center gap-2 font-head text-[15px] font-semibold text-[#7fb4ff] transition hover:text-white"
            >
              {t("yuchaiCta")}
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>

          <YouTubeEmbed
            id="zUhNpLl-DxE"
            title="Yuchai Industrial Plant"
            poster="/yuchai-plant-poster.jpg"
          />
        </div>
      </section>

      {/* ── Integrated M&E ───────────────────────────────────────── */}
      <OverlaySection
        id="integrated"
        className="scroll-mt-20 border-b border-sume-line bg-white py-30"
        image="/images/home/pattern-3.png"
        imageClassName="object-cover object-right"
        overlayClassName="bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.92)_38%,rgba(248,251,255,0.55)_70%,rgba(248,251,255,0.1)_100%)]"
      >
        <div className="max-w-[620px]">
          <span className="sume-eyebrow mb-4 block">
            {t("integratedEyebrow")}
          </span>
          <h2 className="mb-5 font-head text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.02em] text-sume-navy">
            {t("integratedHeading")}
          </h2>
          <p className="mb-3.5 max-w-[44ch] text-[18px] leading-[1.6] text-sume-body">
            {t.rich("integratedP1", {
              strong: (chunks) => (
                <strong className="font-semibold text-sume-navy">
                  {chunks}
                </strong>
              ),
            })}
          </p>
          <p className="max-w-[44ch] text-[18px] leading-[1.6] text-sume-body">
            {t("integratedP2")}
          </p>
        </div>
      </OverlaySection>

      {/* ── Capabilities & Brands ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sume-navy py-26">
        <div className="sume-wrap">
          <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
            {t("brandsEyebrow")}
          </span>
          <h2 className="max-w-[20ch] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            {t("brandsHeading")}
          </h2>
          <p className="mb-13 mt-3.5 max-w-[48ch] text-[17px] leading-[1.55] text-white/[0.68]">
            {t("brandsBody")}
          </p>

          <div className="grid grid-cols-2 gap-px border border-white/[0.12] bg-white/[0.12] sm:grid-cols-3 lg:grid-cols-6">
            {partnerBrands.map((brand) => (
              <div
                key={brand.name}
                className="group relative flex aspect-[3/2] flex-col items-center justify-center gap-2.5 bg-white p-4 transition hover:bg-gray-50"
              >
                {brand.image ? (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className={`object-contain mix-blend-multiply opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100 ${
                      "className" in brand && brand.className ? brand.className : "p-6"
                    }`}
                  />
                ) : (
                  <>
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[3px] border-[1.5px] border-dashed border-sume-navy/20 font-head text-[18px] font-semibold text-sume-navy/40 transition group-hover:border-sume-navy/40 group-hover:text-sume-navy/60">
                      {brandInitials(brand.name)}
                    </div>
                    <div className="text-center font-head text-[13px] font-medium tracking-[0.02em] text-sume-navy/70 transition group-hover:text-sume-navy">
                      {brand.name}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

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
