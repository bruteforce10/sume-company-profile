import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactDetailForm } from "@/components/contact-detail-form";
import { PageHeader } from "@/components/sections/page-header";
import { contactInfoItems, mapSrc } from "@/constants/contact";
import { company, siteUrl } from "@/constants/site";
import { languageAlternates } from "@/i18n/metadata";
import { JsonLd, ORGANIZATION_ID } from "@/lib/json-ld";
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
    namespace: "ContactPage",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/contact")[locale],
      languages: languageAlternates("/contact"),
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("ContactPage");

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url: `${siteUrl}${languageAlternates("/contact")[loc]}`,
    inLanguage: loc,
    mainEntity: { "@id": ORGANIZATION_ID },
  };

  return (
    <main>
      <JsonLd data={contactJsonLd} />
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("headerTitle")}
        description={t("headerDescription")}
      />

      <section className="bg-white py-24">
        <div className="sume-wrap">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.55fr] lg:gap-[72px]">
            {/* LEFT — info panel */}
            <div>
              <h2 className="mb-2 font-head text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                {t("infoHeading")}
              </h2>
              <p className="mb-11 max-w-[36ch] text-[16.5px] leading-[1.6] text-sume-body">
                {t("infoBody")}
              </p>

              <div className="flex flex-col">
                {contactInfoItems[loc].map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex gap-[18px] border-b border-sume-line py-[22px] last:border-b-0 ${
                      index === 0 ? "pt-0" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[2px] bg-sume-accent">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="mb-[5px] font-head text-[12px] font-semibold uppercase tracking-[0.16em] text-sume-muted">
                        {item.label}
                      </h3>
                      <div className="text-[15.5px] font-medium leading-[1.5] text-sume-navy">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — form */}
            <div>
              <h2 className="mb-7 font-head text-[clamp(22px,2.2vw,30px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                {t("formHeading")}
              </h2>
              <ContactDetailForm />
            </div>
          </div>

          {/* Map */}
          <div className="mt-20 border-t border-sume-line">
            <div className="mb-8 pt-13">
              <h2 className="sume-eyebrow mb-3.5 block">{t("mapEyebrow")}</h2>
              <span className="font-head block text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                {t("mapHeading")}
              </span>
              <p className="mt-2.5 text-[16px] text-sume-body">
                {company.address}, Indonesia
              </p>
            </div>
            <iframe
              src={mapSrc}
              title="SUME Group Headquarters — Jakarta"
              width="100%"
              height={480}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border border-sume-line contrast-[1.04] grayscale-[18%]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
