import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCatalog } from "@/components/project-catalog";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader, PageHeaderStats } from "@/components/sections/page-header";
import { getProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects — SUME Group",
  description:
    "Selected projects across commercial, industrial, and mission-critical facilities — delivering power, cooling, monitoring, and integrated M&E infrastructure.",
};

const headerStats = [
  {
    value: (
      <>
        <span className="text-white/40">[ ]</span>+
      </>
    ),
    label: "Projects Delivered",
  },
  { value: "50+ MWp", label: "Solar PV Installed" },
  {
    value: (
      <>
        <span className="text-white/40">[ ]</span>+ TR
      </>
    ),
    label: "Cooling Optimized",
  },
  { value: "3", label: "Countries" },
];

type Metric = { k: string; v: string; pos?: boolean };

const featured: { tag: string; name: string; cap: string; metrics: Metric[] }[] =
  [
    {
      tag: "Industrial · Precision Cooling",
      name: "PT Autoplastik Indonesia",
      cap: "Chiller Retrofit · 2 × 500 TR",
      metrics: [
        { k: "COP Before Optimization", v: "3.34" },
        { k: "COP After Optimization", v: "3.61", pos: true },
        { k: "Annual Energy Savings", v: "IDR 651.6M", pos: true },
      ],
    },
    {
      tag: "Industrial · Precision Cooling",
      name: "SKF Factory",
      cap: "Cakung, Jakarta · 3 × 550 TR",
      metrics: [
        { k: "Plant Efficiency Before", v: "1.10 kW/TR" },
        { k: "Plant Efficiency After", v: "0.77 kW/TR", pos: true },
        { k: "Annual Energy Savings", v: "IDR 1.117B", pos: true },
      ],
    },
  ];

const portfolio = [
  ["Festival Citilink", "Bandung", "3 × 1,000 TR", "Chiller Optimization"],
  ["Lenmarc Mall", "Surabaya", "3 × 1,050 TR", "Chiller Optimization"],
  ["Sheraton Gandaria", "Jakarta", "3 × 500 TR", "Chiller Optimization"],
  ["Aston Simatupang", "Jakarta", "3 × 400 TR", "Chiller Systems"],
  ["Papandayan Hotel", "Bandung", "300 + 200 TR", "Cooling Systems"],
  ["Santos Jaya Abadi", "Semarang", "8 × 150 TR", "Air-cooled Plant"],
  ["Isuzu", "Karawang", "6 × 150 TR", "Air-cooled Plant"],
];

const powerItems = [
  {
    num: "01",
    title: "Authorized IHI / Niigata Service Partner",
    body: "Authorized distributor and service for IHI / Niigata land and marine engines — one of the few certified operations in the region.",
  },
  {
    num: "02",
    title: "Japan-Trained Engineers",
    body: "8 certified engineers trained at Niigata Power Systems, Japan — with combined 20+ years of maintenance, overhaul, and troubleshooting experience.",
  },
  {
    num: "03",
    title: "National-Scale Operations Serviced",
    body: "Engines serviced by SUME power critical operations at PLN and Pertamina — operators with non-negotiable uptime requirements.",
  },
  {
    num: "04",
    title: "Yuchai Genset Supply & Commissioning",
    body: "Diesel and gas gensets in containerized and site-built configurations, sized and commissioned to facility load requirements.",
  },
];

const powerStats: { value: ReactNode; label: string }[] = [
  { value: "8", label: "Certified Engineers · IHI / Niigata Trained, Japan" },
  { value: "20+", label: "Years Combined Engine Service Experience" },
  {
    value: "50+ MWp",
    label: "Solar PV Installed Across Commercial & Industrial Sites",
  },
  {
    value: (
      <>
        <span className="font-medium text-sume-line">[ ]</span>+
      </>
    ),
    label: "Gensets Maintained, Serviced & Commissioned",
  },
];

export default async function OurProjectPage() {
  const projects = await getProjects();

  return (
    <main>
      <PageHeader
        eyebrow="Our Work"
        title="Selected Projects"
        description="A track record across commercial, industrial, and mission-critical facilities — delivering power, cooling, monitoring, and integrated M&E infrastructure."
      >
        <PageHeaderStats stats={headerStats} />
      </PageHeader>

      {/* ── Project Portfolio (Hygraph-fed grid) ─────────────────── */}
      <section className="bg-white py-26">
        <div className="sume-wrap">
          <div className="mb-4 max-w-[58ch]">
            <span className="sume-eyebrow mb-4 block">Project Portfolio</span>
            <h2 className="font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              Delivering infrastructure across industries and geographies.
            </h2>
            <p className="mt-4 text-[17.5px] leading-[1.55] text-sume-body">
              From precision cooling retrofits to integrated M&amp;E contracting
              — built for facilities that operate without interruption.
            </p>
          </div>

          <ProjectCatalog projects={projects} />
        </div>
      </section>

      {/* ── Featured Results ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sume-navy py-26">
        <Image
          src="/images/home/city-building.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(14,36,60,0.88)_0%,rgba(0,88,190,0.55)_60%,rgba(14,36,60,0.82)_100%)]" />

        <div className="sume-wrap relative z-[2]">
          <div className="mb-14 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
                Proven Results
              </span>
              <h2 className="max-w-[22ch] font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
                Precision Cooling — Measured Outcomes
              </h2>
            </div>
            <p className="max-w-[44ch] text-[17px] leading-[1.55] text-white/[0.68]">
              Cooling is the single largest energy load in any high-density
              facility. These results demonstrate the chiller and
              energy-efficiency capability SUME brings to critical environments.
            </p>
          </div>

          <div className="mb-11 grid gap-[22px] lg:grid-cols-2">
            {featured.map((card) => (
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
                  {["Project", "Location", "Cooling Capacity", "Scope"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="border-b border-white/[0.14] px-5 py-3.5 text-left font-head text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/[0.44]"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {portfolio.map((row, index) => (
                  <tr
                    key={row[0]}
                    className="transition hover:bg-white/[0.04]"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-5 py-3.5 ${
                          index === portfolio.length - 1
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
        </div>
      </section>

      {/* ── Power Capability ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-sume-line bg-sume-mist py-26">
        <Image
          src="/images/home/pattern-2.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-[0.07]"
        />
        <div className="sume-wrap relative z-[1]">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="sume-eyebrow mb-4 block">
                Power &amp; Engine Capability
              </span>
              <h2 className="font-head text-[clamp(26px,2.8vw,40px)] font-semibold leading-[1.2] tracking-[-0.02em] text-sume-navy">
                Power Reliability You Can Verify
              </h2>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.55] text-sume-body">
                Backup power is non-negotiable for uptime. SUME&apos;s engine
                capability is built on authorized, certified service — backed by
                engineers trained directly in Japan.
              </p>

              <div className="mt-11 flex flex-col">
                {powerItems.map((item, index) => (
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
                      <h4 className="mb-1.5 font-head text-[15.5px] font-semibold text-sume-navy">
                        {item.title}
                      </h4>
                      <p className="text-[14.5px] leading-[1.55] text-sume-body">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col border border-sume-line bg-white">
              {powerStats.map((stat, index) => (
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
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <CtaBand
        title="Let's engineer your infrastructure."
        description="From mission-critical power systems to data center environments, we build infrastructure designed for performance, reliability, and uptime."
      >
        <Link href="/contact" className="sume-btn sume-btn-white">
          Request a Consultation
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </CtaBand>
    </main>
  );
}
