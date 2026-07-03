import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { company } from "@/constants/site";

const phoneHref = `tel:${company.phone.replace(/[^+\d]/g, "")}`;
const mapQuery = encodeURIComponent(`${company.address}, Indonesia`);

/** Embedded Google Maps URL for the Jakarta headquarters. */
export const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;

const infoIcon = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px] stroke-sume-blue",
};

// Shared (non-translated) icons and values referenced from both locales.
const emailIcon: ReactNode = (
  <svg {...infoIcon}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);
const phoneIcon: ReactNode = (
  <svg {...infoIcon}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L9.09 10.9a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const addressIcon: ReactNode = (
  <svg {...infoIcon}>
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const officesIcon: ReactNode = (
  <svg {...infoIcon}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const emailValue: ReactNode = (
  <a
    href={`mailto:${company.email}`}
    className="transition hover:text-sume-blue"
  >
    {company.email}
  </a>
);
const phoneValue: ReactNode = (
  <a href={phoneHref} className="transition hover:text-sume-blue">
    {company.phone}
  </a>
);

function OfficesValue({ offices }: { offices: string[] }) {
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      {offices.map((office) => (
        <span
          key={office}
          className="flex items-start gap-[7px] text-[14.5px] font-normal leading-[1.5] text-sume-body before:mt-[8px] before:block before:h-[5px] before:w-[5px] before:flex-none before:rounded-full before:bg-sume-blue before:content-['']"
        >
          {office}
        </span>
      ))}
    </div>
  );
}

const regionalOfficesEn = [
  "Bandung, Indonesia (Jl Jend Sudirman no 660)",
  // "Singapore",
  // "Myanmar — Yangon",
];
const regionalOfficesId = [
  "Bandung, Indonesia (Jl Jend Sudirman no 660)",
  // "Singapura",
  // "Myanmar — Yangon",
];

export type ContactInfoItem = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
};

export const contactInfoItems: Record<Locale, ContactInfoItem[]> = {
  en: [
    { label: "Email", value: emailValue, icon: emailIcon },
    { label: "Phone", value: phoneValue, icon: phoneIcon },
    {
      label: "HQ Address",
      value: <>{company.address}, Indonesia</>,
      icon: addressIcon,
    },
    {
      label: "Branch Offices",
      value: <OfficesValue offices={regionalOfficesEn} />,
      icon: officesIcon,
    },
  ],
  id: [
    { label: "Email", value: emailValue, icon: emailIcon },
    { label: "Telepon", value: phoneValue, icon: phoneIcon },
    {
      label: "Alamat Kantor Pusat",
      value: <>{company.address}, Indonesia</>,
      icon: addressIcon,
    },
    {
      label: "Kantor Cabang",
      value: <OfficesValue offices={regionalOfficesId} />,
      icon: officesIcon,
    },
  ],
};
