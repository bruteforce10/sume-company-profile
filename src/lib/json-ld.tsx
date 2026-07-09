import { company, siteUrl } from "@/constants/site";

/**
 * Schema.org JSON-LD helpers. Per the Next.js guide, structured data is
 * rendered as a native <script type="application/ld+json"> tag (not
 * next/script), with `<` escaped so string fields can't break out of the tag.
 *
 * The Organization and WebSite nodes are rendered site-wide from the locale
 * layout under stable `@id`s; page-level schema references them via
 * `{ "@id": ORGANIZATION_ID }` instead of repeating the full node.
 */

export type JsonLdObject = Record<string, unknown>;

export const ORGANIZATION_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

/** Renders one or more schema.org nodes as a JSON-LD script tag. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: company.brand,
    legalName: company.name,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/brand/logo-sume.webp`,
    },
    description: company.description,
    slogan: company.tagline,
    // Structured form of company.address — keep in sync with constants/site.ts.
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Cideng Timur No. 59",
      addressLocality: "Central Jakarta",
      addressRegion: "DKI Jakarta",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: company.phone.replace(/[^+\d]/g, ""),
      email: company.email,
      availableLanguage: ["id", "en"],
    },
  };
}

export function websiteJsonLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: company.brand,
    url: siteUrl,
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export type BreadcrumbEntry = { name: string; path?: string };

/**
 * BreadcrumbList from root-relative paths. The last crumb (current page) may
 * omit `path`; Google infers its URL from the page itself.
 */
export function breadcrumbJsonLd(items: BreadcrumbEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: item.path === "/" ? siteUrl : `${siteUrl}${item.path}` }
        : {}),
    })),
  };
}
