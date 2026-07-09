import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    namespace: "RegionalPage",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/regional")[locale],
      languages: languageAlternates("/regional"),
    },
  };
}

export default async function RegionalPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;

  setRequestLocale(loc);

  return (
    <main className="min-h-[60vh] bg-white">
      <div className="sume-wrap flex min-h-[60vh] items-center py-24">
        <div className="max-w-2xl">
          <p className="sume-eyebrow mb-3.5 block">Temporarily unavailable</p>
          <h1 className="font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
            This page is temporarily disabled.
          </h1>
          <p className="mt-4 max-w-[54ch] text-lg text-sume-body">
            We are updating this section and it is not available for now. Please
            check back soon.
          </p>
          <Link href="/" className="sume-btn sume-btn-primary mt-8 inline-flex">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

/*
  Previous implementation kept below for reference while this page is disabled.

  import { CtaBand } from "@/components/sections/cta-band";
  import { PageHeader, PageHeaderStats } from "@/components/sections/page-header";
  import { RegionalMap } from "@/components/regional-map";
  import { regionalStats } from "@/constants/regional";

  export default async function RegionalPage({ params }: PageProps) {
    const { locale } = await params;
    const loc = locale as Locale;
    setRequestLocale(loc);
    const t = await getTranslations("RegionalPage");

    return (
      <main>
        <PageHeader
          eyebrow={t("headerEyebrow")}
          title={t("headerTitle")}
          description={t("headerDescription")}
        >
          <PageHeaderStats stats={regionalStats[loc]} />
        </PageHeader>

        <section className="bg-white py-24">
          <div className="sume-wrap">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="sume-eyebrow mb-3.5 block">
                  {t("officesEyebrow")}
                </h2>
                <span className="max-w-[18ch] block font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                  {t("officesHeading")}
                </span>
              </div>
              <p className="max-w-[38ch] text-[17px] text-sume-body">
                {t("officesBody")}
              </p>
            </div>

            <RegionalMap />
          </div>
        </section>

        <CtaBand title={t("ctaTitle")} description={t("ctaBody")}>
          <Link href="/contact" className="sume-btn sume-btn-white">
            {t("ctaButton")}
          </Link>
        </CtaBand>
      </main>
    );
  }
*/
