import Image from "next/image";
import Link from "next/link";
import { company, footerOffices, solutionsOverview } from "@/constants/site";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/our-project" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sume-navy pt-20 font-body text-white/[0.66]">
      <div className="sume-wrap">
        <div className="grid gap-10 border-b border-white/[0.12] pb-16 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/images/home/sume-logo.png"
              alt="SUME Group"
              width={1745}
              height={431}
              className="mb-5 h-7 w-auto brightness-0 invert"
            />
            <p className="max-w-[30ch] text-[15px] leading-[1.55] text-white/60">
              Mechanical &amp; Electrical Infrastructure for Mission-Critical
              Facilities.
            </p>
          </div>

          <FooterColumn title="Solutions">
            {solutionsOverview.map((solution) => (
              <FooterLink
                key={solution.title}
                href={`/solutions#${solution.anchor}`}
              >
                {solution.title}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {companyLinks.map((link) => (
              <FooterLink key={link.label} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Offices">
            {footerOffices.map((office) => (
              <FooterLink key={office} href="/regional">
                {office}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <FooterLink href={`mailto:${company.email}`}>
              {company.email}
            </FooterLink>
            <FooterLink href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
              {company.phone}
            </FooterLink>
          </FooterColumn>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 py-6">
          <p className="text-[13.5px] text-white/50">
            © {year} {company.brand} · {company.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[13.5px] text-white/[0.62] hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[13.5px] text-white/[0.62] hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-5 font-head text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
        {title}
      </h2>
      <ul className="grid gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[15px] text-white/[0.64] transition hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
