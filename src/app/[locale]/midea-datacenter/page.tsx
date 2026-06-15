import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { mideaCatalogProducts } from "@/constants/midea-datacenter";
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
    namespace: "MideaDataCenterPage",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/midea-datacenter")[locale],
      languages: languageAlternates("/midea-datacenter"),
    },
  };
}

export default async function MideaDataCenterPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("MideaDataCenterPage");

  return (
    <main>
      <PageHeader
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        description={t("heroBody")}
      />

      {/* ── Overview · Liquid cooling architectures ──────────────── */}
      <section className="border-b border-sume-line bg-sume-mist py-24">
        <div className="sume-wrap">
          <div className="max-w-[68ch]">
            <h2 className="sume-eyebrow mb-4 block">{t("overviewEyebrow")}</h2>
            <span className="block max-w-[24ch] font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              {t("overviewHeading")}
            </span>
            <p className="mt-4 text-[17px] leading-[1.6] text-sume-body">
              {t("overviewBody")}
            </p>
          </div>

          <figure className="mt-12 overflow-hidden rounded-[4px] border border-sume-line bg-white shadow-[0_24px_70px_-32px_rgba(14,36,60,0.45)]">
            {/* Plain <img> (not next/image) so the CMS-managed overviewImage can
                point at any local or remote URL without remotePatterns config. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t("overviewImage")}
              alt={t("overviewImageAlt")}
              loading="lazy"
              className="block h-auto w-full"
            />
          </figure>
        </div>
      </section>

      {/* ── Image catalog ────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="sume-wrap">
          <div className="mx-auto max-w-[64ch] text-center">
            <h2 className="sume-eyebrow mb-4 block">{t("catalogEyebrow")}</h2>
            <span className="block font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              {t("catalogHeading")}
            </span>
            <p className="mx-auto mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-sume-body">
              {t("catalogBody")}
            </p>
          </div>

          <figure className="mt-12">
            <div className="mx-auto max-w-[820px] overflow-hidden rounded-[4px] border border-sume-line bg-white shadow-[0_24px_70px_-32px_rgba(14,36,60,0.45)]">
              {/* Plain <img> (not next/image) so the CMS-managed catalogImage can
                  point at any local or remote URL without remotePatterns config. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t("catalogImage")}
                alt={t("catalogImageAlt")}
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mx-auto mt-6 max-w-[820px] text-[14px] leading-[1.5] text-sume-muted">
              {t("catalogCaption")}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Product range ────────────────────────────────────────── */}
      <section className="border-t border-sume-line bg-sume-mist py-24">
        <div className="sume-wrap">
          <div className="mb-12 max-w-[60ch]">
            <h2 className="sume-eyebrow mb-4 block">{t("productsEyebrow")}</h2>
            <span className="block max-w-[22ch] font-head text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              {t("productsHeading")}
            </span>
            <p className="mt-3.5 text-[17px] leading-[1.6] text-sume-body">
              {t("productsBody")}
            </p>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-sume-line sm:grid-cols-2 lg:grid-cols-4">
            {mideaCatalogProducts.map((card) => (
              <div
                key={card.titleKey}
                className="flex flex-col border-b border-r border-sume-line bg-white px-7 pb-8 pt-7"
              >
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[3px] bg-sume-accent">
                  {card.icon}
                </span>
                <h3 className="mb-2.5 font-head text-[18px] font-semibold leading-[1.25] text-sume-navy">
                  {t(card.titleKey)}
                </h3>
                <p className="text-[14.5px] leading-[1.55] text-sume-body">
                  {t(card.bodyKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
