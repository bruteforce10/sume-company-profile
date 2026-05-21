import Image from "next/image";
import Link from "next/link";
import { company, navLinks, solutions } from "@/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-sume-line/10 bg-sume-bg-hero text-sume-ink">
      <div className="section-shell py-14 sm:py-16">
        <div className="grid gap-10 border-b border-sume-line/30 pb-10 lg:grid-cols-[1.6fr_0.7fr_0.7fr]">
          <div>
            <Image
              src="/images/brand/logo-sume-vertical.webp"
              alt="PT. SUME logo"
              width={192}
              height={25}
              className="h-auto w-44"
            />
            <p className="mt-6 max-w-xl text-sm leading-7 text-sume-body">
              {company.description}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-sume-blue">
              Navigation
            </h2>
            <div className="mt-5 grid gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="min-h-8 text-sm text-sume-body transition hover:text-sume-blue"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-sume-blue">
              Solutions
            </h2>
            <div className="mt-5 grid gap-3">
              {solutions.slice(0, 4).map((solution) => (
                <span key={solution.title} className="text-sm text-sume-body">
                  {solution.title}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-sume-body md:flex-row md:items-center md:justify-between">
          <p>(c) 2024 PT. SUME. {company.address}. {company.phone}</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-sume-blue">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-sume-blue">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
