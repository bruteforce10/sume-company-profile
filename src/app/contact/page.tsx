import type { ReactNode } from "react";
import { ContactDetailForm } from "@/components/contact-detail-form";
import { PageHeader } from "@/components/sections/page-header";
import { company } from "@/constants/site";

export const metadata = {
  title: "Contact — SUME Group",
  description:
    "Let's engineer your infrastructure. Whether you're building a new facility or optimizing an existing one, our team is ready to assess your requirements.",
};

const phoneHref = `tel:${company.phone.replace(/[^+\d]/g, "")}`;
const mapQuery = encodeURIComponent(`${company.address}, Indonesia`);
const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;

const infoIcon = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px] stroke-sume-blue",
};

const infoItems: { label: string; value: ReactNode; icon: ReactNode }[] = [
  {
    label: "Email",
    value: (
      <a href={`mailto:${company.email}`} className="transition hover:text-sume-blue">
        {company.email}
      </a>
    ),
    icon: (
      <svg {...infoIcon}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: (
      <a href={phoneHref} className="transition hover:text-sume-blue">
        {company.phone}
      </a>
    ),
    icon: (
      <svg {...infoIcon}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L9.09 10.9a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: "HQ Address",
    value: <>{company.address}, Indonesia</>,
    icon: (
      <svg {...infoIcon}>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Regional Offices",
    value: (
      <div className="mt-1.5 flex flex-col gap-1">
        {[
          "Indonesia — Jakarta (HQ)",
          "Singapore",
          "Myanmar — Yangon",
          "Myanmar — Mandalay",
        ].map((office) => (
          <span
            key={office}
            className="flex items-center gap-[7px] text-[14.5px] font-normal text-sume-body before:block before:h-[5px] before:w-[5px] before:flex-none before:rounded-full before:bg-sume-blue before:content-['']"
          >
            {office}
          </span>
        ))}
      </div>
    ),
    icon: (
      <svg {...infoIcon}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Let's Engineer Your Infrastructure."
        description="Whether you're building a new facility or optimizing an existing one, our team is ready to assess your requirements."
      />

      <section className="bg-white py-24">
        <div className="sume-wrap">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.55fr] lg:gap-[72px]">
            {/* LEFT — info panel */}
            <div>
              <h2 className="mb-2 font-head text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                Get in Touch
              </h2>
              <p className="mb-11 max-w-[36ch] text-[16.5px] leading-[1.6] text-sume-body">
                Reach our team directly or use the form — we respond within one
                business day.
              </p>

              <div className="flex flex-col">
                {infoItems.map((item, index) => (
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
                      <div className="mb-[5px] font-head text-[12px] font-semibold uppercase tracking-[0.16em] text-sume-muted">
                        {item.label}
                      </div>
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
                Request a Consultation
              </h2>
              <ContactDetailForm />
            </div>
          </div>

          {/* Map */}
          <div className="mt-20 border-t border-sume-line">
            <div className="mb-8 pt-13">
              <span className="sume-eyebrow mb-3.5 block">Headquarters</span>
              <h2 className="font-head text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                Our Jakarta Headquarters
              </h2>
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
