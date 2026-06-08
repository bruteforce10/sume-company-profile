import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { OverlaySection } from "@/components/ui/overlay-section";
import { certifications, milestones, whatSetsApart } from "@/constants/about";

export const metadata = {
  title: "About — SUME Group",
  description:
    "A decade of building what cannot fail. PT. SUME (Solusi Utama Mekanikal Elektrikal) delivers integrated power, cooling, monitoring, and security systems for facilities that operate around the clock.",
};

function Ph({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-sume-muted">{children}</span>;
}

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About SUME Group"
        title="A Decade of Building What Cannot Fail."
        description="The systems behind a building — its power, its cooling, its controls — deserve the same rigor as the structure itself."
      />

      {/* ── Mission ──────────────────────────────────────────────── */}
      <section className="border-b border-sume-line py-26">
        <div className="sume-wrap grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[72px]">
          <div>
            <span className="sume-eyebrow mb-[18px] block">Who We Are</span>
            <h2 className="font-head text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.2] tracking-[-0.02em] text-sume-navy">
              Engineering the infrastructure that cannot afford to fail.
            </h2>
          </div>
          <div className="max-w-[56ch] space-y-[22px] text-[18px] leading-[1.7] text-sume-body">
            <p>
              PT. SUME (Solusi Utama Mekanikal Elektrikal) began as a mechanical
              and electrical contractor with a simple conviction: that the
              systems behind a building — its power, its cooling, its controls —
              deserve the same rigor as the structure itself.
            </p>
            <p>
              Over <Ph>[years]</Ph> years, that conviction has grown into a
              comprehensive M&amp;E capability. What started with commercial
              building installations has expanded into critical infrastructure —
              where SUME now delivers{" "}
              <strong className="font-semibold text-sume-navy">
                integrated power, cooling, monitoring, and security systems
              </strong>{" "}
              for facilities that operate around the clock.
            </p>
            <p>
              Today, SUME serves clients across Indonesia and the region,
              supported by offices in Singapore and Myanmar, and an ecosystem of
              specialized capabilities spanning standby power, solar energy,
              precision cooling, and intelligent monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* ── Milestones ───────────────────────────────────────────── */}
      <section className="border-b border-sume-line bg-sume-mist py-26">
        <div className="sume-wrap">
          <div className="mb-15">
            <span className="sume-eyebrow mb-4 block">Our Journey</span>
            <h2 className="max-w-[20ch] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              From M&amp;E contractor to critical infrastructure partner.
            </h2>
            <p className="mt-3.5 text-[13.5px] italic text-sume-muted">
              Milestone dates to be confirmed before launch.
            </p>
          </div>

          <div className="relative">
            {/* connector line */}
            <div className="absolute left-0 right-0 top-[11px] hidden h-0.5 bg-sume-line lg:block" />
            <div className="absolute bottom-2 left-[11px] top-0 w-0.5 bg-sume-line lg:hidden" />

            <div className="grid gap-y-9 lg:grid-cols-6 lg:gap-y-0">
              {milestones.map((m, index) => (
                <div
                  key={index}
                  className="relative pl-11 lg:pl-0 lg:pr-[18px]"
                >
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-sume-blue bg-white lg:relative">
                    <span className="h-[9px] w-[9px] rounded-full bg-sume-blue" />
                  </div>
                  <div className="font-head text-[22px] font-semibold tracking-[-0.01em] text-sume-navy lg:mt-6">
                    <span className="text-sume-line">{m.year}</span>
                  </div>
                  <div className="mt-2 text-[14.5px] leading-[1.5] text-sume-body lg:max-w-[22ch]">
                    {m.event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart ───────────────────────────────────── */}
      <section className="border-b border-sume-line py-26">
        <div className="sume-wrap">
          <div className="mb-13">
            <span className="sume-eyebrow mb-4 block">What Sets Us Apart</span>
            <h2 className="max-w-[20ch] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              Why enterprise clients choose SUME.
            </h2>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-sume-line sm:grid-cols-2 lg:grid-cols-4">
            {whatSetsApart.map((card) => (
              <div
                key={card.num}
                className="border-b border-r border-sume-line px-8 pb-11 pt-10 transition hover:bg-sume-mist"
              >
                <div className="mb-[26px] font-head text-[12px] font-semibold tracking-[0.16em] text-sume-blue">
                  {card.num}
                </div>
                <h3 className="mb-3 font-head text-[19px] font-semibold leading-[1.3] text-sume-navy">
                  {card.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-sume-body">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────── */}
      <OverlaySection
        className="bg-sume-navy py-24"
        image="/section-licence-bg.webp"
        imageClassName="object-cover mix-blend-luminosity"
        overlayClassName="bg-sume-navy/80"
      >
        <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
          Certifications &amp; Accreditation
        </span>
        <h2 className="max-w-[22ch] font-head text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
          Standards verified, not just stated.
        </h2>
        <p className="mb-12 mt-3.5 max-w-[52ch] text-[16px] leading-[1.55] text-white/[0.66]">
          Quality, environmental, and safety management systems backing every
          project we deliver.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex flex-col items-start gap-3.5 rounded-[3px] border border-white/[0.14] bg-white/[0.04] p-[22px] pt-[30px] transition hover:border-[#7fb4ff]/50 hover:bg-white/[0.08]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#7fb4ff]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 stroke-[#7fb4ff]"
                >
                  {cert.icon}
                </svg>
              </div>
              <h4 className="text-[15px] font-semibold leading-[1.35] text-white">
                {cert.name}
              </h4>
              <div className="font-head text-[13px] font-semibold tracking-[0.04em] text-[#7fb4ff]">
                {cert.detail}
              </div>
            </div>
          ))}
        </div>
      </OverlaySection>

      {/* ── Company Profile Download ─────────────────────────────── */}
      {/* <section className="bg-sume-mist py-24">
        <div className="sume-wrap">
          <div className="grid items-center gap-8 border border-sume-line bg-white p-8 sm:p-[52px] lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <span className="sume-eyebrow mb-3.5 block">Company Profile</span>
              <h2 className="mb-3 font-head text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                Download Our Company Profile
              </h2>
              <p className="max-w-[46ch] text-[16.5px] leading-[1.55] text-sume-body">
                Our capabilities, track record, and certifications in one
                document.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3.5">
              <div className="relative flex h-[88px] w-[72px] flex-none items-end justify-center rounded-[3px] border-2 border-sume-blue pb-3.5">
                <span className="absolute right-0 top-0 h-5 w-5 border-b-2 border-l-2 border-sume-blue bg-sume-mist" />
                <span className="font-head text-[14px] font-bold tracking-[0.05em] text-sume-blue">
                  PDF
                </span>
              </div>
              <a href="#" className="sume-btn sume-btn-primary">
                Download PDF (English)
                <span className="text-[17px] leading-none">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CtaBand
        title="Let's engineer your infrastructure."
        description="Talk to our team about your power, cooling, monitoring, or full M&E requirements."
      >
        <Link href="/contact" className="sume-btn sume-btn-white">
          Get in Touch
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </CtaBand>
    </main>
  );
}
