import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProjectCatalog } from "@/components/project-catalog";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader, PageHeaderStats } from "@/components/sections/page-header";
import { OverlaySection } from "@/components/ui/overlay-section";
import {
  coolingPortfolio,
  featuredResults,
  powerCapabilities,
  powerStats,
  projectStats,
} from "@/constants/our-project";
import { getProjects } from "@/lib/projects";
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
    namespace: "ProjectsPage",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/our-project")[locale],
      languages: languageAlternates("/our-project"),
    },
  };
}

export default async function OurProjectPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("ProjectsPage");
  const projects = await getProjects();

  return (
    <main>
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("headerTitle")}
        description={t("headerDescription")}
      >
        <PageHeaderStats stats={projectStats[loc]} />
      </PageHeader>

      {/* ── Project Portfolio (Hygraph-fed grid) ─────────────────── */}
      <section className="bg-white py-26">
        <div className="sume-wrap">
          <div className="mb-4 max-w-[58ch]">
            <h2 className="sume-eyebrow mb-4 block">{t("portfolioEyebrow")}</h2>
            <span className="font-head block text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              {t("portfolioHeading")}
            </span>
            <p className="mt-4 text-[17.5px] leading-[1.55] text-sume-body">
              {t("portfolioBody")}
            </p>
          </div>

          <ProjectCatalog projects={projects} />
        </div>
      </section>

      {/* ── Featured Results ─────────────────────────────────────── */}
      <OverlaySection
        className="bg-sume-navy py-26"
        image="/images/home/city-building.png"
        imageClassName="object-cover opacity-[0.18] mix-blend-luminosity"
        overlayClassName="bg-[linear-gradient(105deg,rgba(14,36,60,0.88)_0%,rgba(0,88,190,0.55)_60%,rgba(14,36,60,0.82)_100%)]"
      >
        <div className="mb-14 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
              {t("resultsEyebrow")}
            </span>
            <h2 className="max-w-[22ch] font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              {t("resultsHeading")}
            </h2>
          </div>
          <p className="max-w-[44ch] text-[17px] leading-[1.55] text-white/[0.68]">
            {t("resultsBody")}
          </p>
        </div>

        <div className="mb-11 grid gap-[22px] lg:grid-cols-2">
          {featuredResults[loc].map((card) => (
            <div
              key={card.name}
              className="border border-white/[0.13] bg-white/[0.055] p-9 transition hover:border-white/[0.26] hover:bg-white/[0.085]"
            >
              <div className="mb-[18px] font-head text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/[0.44]">
                {card.tag}
              </div>
              <div className="mb-[5px] font-head text-[22px] font-semibold tracking-[-0.01em] text-white">
                {card.name}
              </div>
              <div className="mb-7 font-head text-[14px] text-white/[0.58]">
                {card.cap}
              </div>
              <div className="flex flex-col">
                {card.metrics.map((metric, index) => (
                  <div
                    key={metric.k}
                    className={`flex items-baseline justify-between gap-5 py-3.5 ${
                      index === card.metrics.length - 1
                        ? "pb-0"
                        : "border-b border-white/[0.09]"
                    }`}
                  >
                    <span className="text-[13.5px] text-white/[0.58]">
                      {metric.k}
                    </span>
                    <span
                      className={`font-head text-[17px] font-semibold ${
                        metric.pos ? "text-[#5bc8a0]" : "text-white"
                      }`}
                    >
                      {metric.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[15px]">
            <thead>
              <tr>
                {[
                  t("tableProject"),
                  t("tableLocation"),
                  t("tableCoolingCapacity"),
                  t("tableScope"),
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border-b border-white/[0.14] px-5 py-3.5 text-left font-head text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/[0.44]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coolingPortfolio[loc].map((row, index) => (
                <tr key={row[0]} className="transition hover:bg-white/[0.04]">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-5 py-3.5 ${
                        index === coolingPortfolio[loc].length - 1
                          ? ""
                          : "border-b border-white/[0.07]"
                      } ${
                        cellIndex === 0
                          ? "font-head font-medium text-white"
                          : cellIndex === row.length - 1
                            ? "text-[13.5px] text-white/[0.52]"
                            : "text-white/[0.78]"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OverlaySection>

      {/* ── Power Capability ─────────────────────────────────────── */}
      <OverlaySection
        className="border-t border-sume-line bg-sume-mist py-26"
        image="/images/home/pattern-2.png"
        imageClassName="pointer-events-none object-cover opacity-[0.07]"
        contentClassName="sume-wrap relative z-[1]"
      >
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="sume-eyebrow mb-4 block">{t("powerEyebrow")}</span>
            <h2 className="font-head text-[clamp(26px,2.8vw,40px)] font-semibold leading-[1.2] tracking-[-0.02em] text-sume-navy">
              {t("powerHeading")}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.55] text-sume-body">
              {t("powerBody")}
            </p>

            <div className="mt-11 flex flex-col">
              {powerCapabilities[loc].map((item, index) => (
                <div
                  key={item.num}
                  className={`flex gap-[22px] border-b border-sume-line py-[22px] ${
                    index === 0 ? "border-t border-sume-line" : ""
                  }`}
                >
                  <div className="min-w-7 flex-none pt-[3px] font-head text-[12.5px] font-semibold tracking-[0.12em] text-sume-blue">
                    {item.num}
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-head text-[15.5px] font-semibold text-sume-navy">
                      {item.title}
                    </h3>
                    <p className="text-[14.5px] leading-[1.55] text-sume-body">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col border border-sume-line bg-white">
            {powerStats[loc].map((stat, index) => (
              <div
                key={index}
                className="border-b border-sume-line px-9 py-8 last:border-b-0"
              >
                <div className="font-head text-[38px] font-semibold leading-none tracking-[-0.02em] text-sume-navy">
                  {stat.value}
                </div>
                <div className="mt-2.5 max-w-[26ch] text-[13.5px] leading-[1.45] text-sume-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </OverlaySection>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <CtaBand title={t("ctaTitle")} description={t("ctaBody")}>
        <Link href="/contact" className="sume-btn sume-btn-white">
          {t("ctaButton")}
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </CtaBand>
    </main>
  );
}
