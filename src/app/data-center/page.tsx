import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata = {
  title: "Data Center — SUME Group",
  description:
    "Built for the demands of the data center. SUME delivers and sustains the power, cooling, monitoring, and security infrastructure that mission-critical facilities run on 24/7.",
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 flex-none stroke-sume-blue",
};

type Tag = { label: string; green?: boolean };

const capabilities: {
  icon: ReactNode;
  need: string;
  capability: string;
  tags: Tag[];
}[] = [
  {
    icon: (
      <svg {...iconProps}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    need: "Uninterrupted Backup Power",
    capability:
      "Standby gensets, fuel monitoring, engine maintenance — sized and serviced for 24/7 critical load.",
    tags: [{ label: "Power & Energy" }, { label: "Yuchai · IHI / Niigata" }],
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    need: "High-Density Cooling",
    capability:
      "Precision HVAC, chiller plants, and efficiency optimization — engineered for continuous high-density thermal loads.",
    tags: [
      { label: "Precision Cooling" },
      { label: "Midea · Broad · Hisense" },
    ],
  },
  {
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    need: "Energy Cost Control",
    capability:
      "Cooling-as-a-Service (zero CAPEX, performance-guaranteed), solar PV, and chiller retrofits that measurably reduce operational spend.",
    tags: [
      { label: "Cooling-as-a-Service" },
      { label: "Solar PV · 50+ MWp", green: true },
    ],
  },
  {
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    need: "Operational Visibility",
    capability:
      "Flow metering, fuel monitoring, and smart control — integrated into a centralized operational view.",
    tags: [
      { label: "Monitoring" },
      { label: "Emerson · Endress+Hauser · Ramus" },
    ],
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    need: "Physical Security",
    capability:
      "CCTV and surveillance integration via Ramus and KINGSAT — protecting physical access to critical infrastructure.",
    tags: [{ label: "Monitoring & Security" }, { label: "KINGSAT · Ramus" }],
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    need: "Single Accountable Delivery",
    capability:
      "Integrated M&E contracting — one partner across design, procurement, installation, commissioning, and maintenance.",
    tags: [{ label: "Integrated M&E" }],
  },
];

const whyItMatters = [
  {
    num: "01",
    title: "Cooling is the Largest Operational Cost",
    body: "Cooling systems typically account for 40–60% of a data center's electricity. Every percentage point of efficiency improvement translates directly to operational spend.",
    stat: "40–60%",
    statLabel: "of facility electricity",
  },
  {
    num: "02",
    title: "Power Reliability is Non-Negotiable",
    body: "Backup power and fuel reliability underpin every uptime SLA. Engine maintenance, fuel monitoring, and genset sizing must be engineered — not assumed.",
    stat: "24/7",
    statLabel: "no tolerance for downtime",
  },
  {
    num: "03",
    title: "One Partner Reduces Coordination Risk",
    body: "A single accountable M&E partner eliminates the coordination gaps between specialist subcontractors — reducing risk across every critical system.",
    stat: "1",
    statLabel: "accountable partner",
  },
];

const scope = [
  {
    num: "01",
    title: "Power & Energy",
    body: "Standby generation, fuel monitoring, solar PV, and authorized engine maintenance.",
    anchor: "power",
  },
  {
    num: "02",
    title: "Precision Cooling",
    body: "Chiller plants, VRF, optimization, and Cooling-as-a-Service for high-density loads.",
    anchor: "cooling",
  },
  {
    num: "03",
    title: "Monitoring & Security",
    body: "Flow metering, fuel monitoring, CCTV, and smart control — integrated visibility.",
    anchor: "monitoring",
  },
  {
    num: "04",
    title: "Integrated M&E",
    body: "Design, procurement, installation, commissioning, and lifetime maintenance under one scope.",
    anchor: "integrated",
  },
];

export default function DataCenterPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex h-[min(90vh,860px)] min-h-[620px] flex-col justify-end overflow-hidden bg-sume-navy">
        <Image
          src="/images/home/hiro-7.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(14,36,60,0.92)_0%,rgba(14,36,60,0.68)_46%,rgba(0,40,100,0.22)_100%)]" />

        <div className="sume-wrap relative z-[2] w-full pb-[88px]">
          <h1 className="max-w-[14ch] font-head text-[clamp(44px,6vw,80px)] font-semibold leading-[1.03] tracking-[-0.02em] text-white">
            Built for the Demands of the Data Center.
          </h1>
          <p className="mt-6 max-w-[56ch] text-[clamp(17px,1.5vw,21px)] leading-[1.55] text-white/[0.82]">
            Data centers run 24/7 with zero tolerance for downtime. Every system
            — power, cooling, monitoring, security — must perform continuously
            and be maintained without disruption. SUME delivers and sustains
            that infrastructure.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="sume-btn sume-btn-primary">
              Discuss Your Facility
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/solutions" className="sume-btn sume-btn-ghost">
              Explore Our Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* ── Capability Mapping ───────────────────────────────────── */}
      <section className="bg-white py-26">
        <div className="sume-wrap">
          <div className="mb-13 max-w-[60ch]">
            <span className="sume-eyebrow mb-4 block">Capability Mapping</span>
            <h2 className="max-w-[22ch] font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
              Every data center need, matched to a SUME capability.
            </h2>
            <p className="mt-3.5 text-[17px] leading-[1.6] text-sume-body">
              A single M&amp;E partner delivering the full infrastructure scope
              — from standby power and precision cooling to monitoring,
              security, and long-term maintenance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="w-[42%] border-b-2 border-sume-line bg-sume-mist px-4 py-3.5 text-left font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue sm:px-6">
                    Data Center Need
                  </th>
                  <th className="border-b-2 border-sume-line bg-sume-mist px-4 py-3.5 text-left font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue sm:px-6">
                    SUME Capability
                  </th>
                </tr>
              </thead>
              <tbody>
                {capabilities.map((row) => (
                  <tr
                    key={row.need}
                    className="border-b border-sume-line transition last:border-b-0 hover:bg-sume-mist"
                  >
                    <td className="px-4 py-5 align-top font-head text-base font-semibold text-sume-navy sm:px-6 sm:py-[22px]">
                      <span className="inline-flex items-center gap-3">
                        {row.icon}
                        {row.need}
                      </span>
                    </td>
                    <td className="px-4 py-5 align-top text-[15.5px] leading-[1.55] text-sume-body sm:px-6 sm:py-[22px]">
                      {row.capability}
                      <div className="mt-[9px] flex flex-wrap gap-[7px]">
                        {row.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={
                              tag.green
                                ? "rounded-[2px] bg-[#e6f7ef] px-2.5 py-1 font-head text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[#1a7a4b]"
                                : "rounded-[2px] bg-sume-accent px-2.5 py-1 font-head text-[11.5px] font-semibold uppercase tracking-[0.07em] text-sume-blue"
                            }
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Why It Matters ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sume-navy py-25">
        <Image
          src="/images/home/city-building.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,36,60,0.95),rgba(0,60,140,0.7))]" />

        <div className="sume-wrap relative z-[2]">
          <span className="sume-eyebrow mb-5 block text-[#7fb4ff]">
            Why It Matters
          </span>
          <h2 className="mb-13 max-w-[22ch] font-head text-[clamp(28px,3.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            The infrastructure decisions that determine uptime.
          </h2>

          <div className="grid grid-cols-1 border-l border-t border-white/[0.12] sm:grid-cols-2 lg:grid-cols-3">
            {whyItMatters.map((item) => (
              <div
                key={item.num}
                className="border-b border-r border-white/[0.12] px-8 pb-10 pt-9 transition hover:bg-white/[0.04]"
              >
                <div className="mb-5 font-head text-[12px] font-semibold tracking-[0.18em] text-[#7fb4ff]">
                  {item.num}
                </div>
                <h3 className="mb-3 font-head text-[19px] font-semibold leading-[1.3] text-white">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-white/[0.66]">
                  {item.body}
                </p>
                <div className="mt-4 font-head text-[28px] font-semibold leading-none text-white">
                  {item.stat}
                  <span className="ml-1.5 text-[15px] font-normal text-white/50">
                    {item.statLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scope Strip ──────────────────────────────────────────── */}
      <section className="border-t border-sume-line bg-sume-mist py-22">
        <div className="sume-wrap">
          <span className="sume-eyebrow mb-4 block">
            Full Infrastructure Scope
          </span>
          <h2 className="max-w-[22ch] font-head text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
            What SUME delivers for data center clients.
          </h2>
          <p className="mb-13 mt-3.5 max-w-[58ch] text-[17px] leading-[1.6] text-sume-body">
            From initial design through lifetime maintenance — the full
            mechanical and electrical scope under one accountable partner.
          </p>

          <div className="grid grid-cols-1 border-l border-t border-sume-line sm:grid-cols-2 lg:grid-cols-4">
            {scope.map((card) => (
              <Link
                key={card.num}
                href={`/solutions#${card.anchor}`}
                className="group border-b border-r border-sume-line bg-white px-7 pb-9 pt-8 transition hover:bg-sume-accent"
              >
                <div className="mb-[18px] font-head text-[12px] font-semibold tracking-[0.16em] text-sume-blue">
                  {card.num}
                </div>
                <h3 className="mb-2.5 font-head text-[18px] font-semibold text-sume-navy">
                  {card.title}
                </h3>
                <p className="text-[14.5px] leading-[1.55] text-sume-body">
                  {card.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-[7px] font-head text-[13px] font-semibold text-sume-blue transition-all group-hover:gap-3">
                  View capability
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <CtaBand
        title="Standby power, precision cooling — uptime assured."
        description="SUME supports the facilities that power Indonesia's digital infrastructure. Tell us about your facility and requirements."
      >
        <Link href="/contact" className="sume-btn sume-btn-white">
          Discuss Your Facility
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
        <Link href="/solutions" className="sume-btn sume-btn-ghost">
          Explore Our Solutions
        </Link>
      </CtaBand>
    </main>
  );
}
