import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";

export const metadata = {
  title: "Solutions — SUME Group",
  description:
    "The full mechanical & electrical scope — power & energy, precision cooling, monitoring & security, and integrated M&E contracting for mission-critical facilities.",
};

type Cap = { title: string; body: string };

type Pillar = {
  id: string;
  tagnum: string;
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  flip?: boolean;
  caps: Cap[];
};

const pillars: Pillar[] = [
  {
    id: "power",
    tagnum: "01 — Power",
    eyebrow: "Power & Energy",
    title: "The backbone of any critical facility.",
    lead: "Primary and standby power engineered for continuous operation, with the monitoring and maintenance to keep it reliable across its full life.",
    image: "/images/home/solution-1.png",
    caps: [
      {
        title: "Standby & Prime Generators",
        body: "Yuchai diesel & gas gensets; containerized and site-built configurations, sized to facility load.",
      },
      {
        title: "Solar PV Systems",
        body: "Rooftop and ground-mount design and installation, delivered with Powerbrain; 50+ MWp installed.",
      },
      {
        title: "Fuel Monitoring Systems",
        body: "Real-time fuel level, consumption, and theft detection, powered by Ramus instrumentation.",
      },
      {
        title: "Engine Maintenance & Overhaul",
        body: "Authorized spare parts and overhaul for IHI / Niigata land and marine engines through Ramoco.",
      },
    ],
  },
  {
    id: "cooling",
    tagnum: "02 — Cooling",
    eyebrow: "Precision Cooling & HVAC",
    title: "Cooling that performs under load.",
    lead: "Cooling typically consumes 40–60% of a facility's electricity. We design and optimize for both performance and energy efficiency.",
    image: "/images/home/solution-2.png",
    flip: true,
    caps: [
      {
        title: "Chiller Plants & VRF Systems",
        body: "Midea, Broad, and Hisense systems for high-density and commercial loads.",
      },
      {
        title: "Chiller Optimization & Retrofit",
        body: "Plant automation, VSD retrofits, pump rewinding; measurable gains (e.g. 1.10 → 0.77 kW/TR on a 3×550 TR plant).",
      },
      {
        title: "Cooling-as-a-Service",
        body: "Zero-CAPEX cooling under a performance-guaranteed energy service agreement, delivered with Powerbrain; backed by an insurance-grade performance bond and IPMVP measurement & verification.",
      },
    ],
  },
  {
    id: "monitoring",
    tagnum: "03 — Monitoring",
    eyebrow: "Monitoring & Security",
    title: "Total visibility over critical infrastructure.",
    lead: "Critical infrastructure requires constant visibility. We integrate instrumentation and surveillance into a unified operational view.",
    image: "/images/home/solution-3.png",
    caps: [
      {
        title: "Flow Metering",
        body: "Emerson and Endress+Hauser meters for chilled-water and process monitoring, integrated by Ramus.",
      },
      {
        title: "Surveillance Systems",
        body: "KINGSAT surveillance solutions through Ramus.",
      },
      {
        title: "Smart Control & Monitoring",
        body: "Centralized monitoring of power, cooling, and fuel systems.",
      },
    ],
  },
];

const aftersales = [
  {
    bold: "8 certified Indonesian engineers",
    rest: " trained in Niigata Power Systems, Japan.",
  },
  {
    bold: "20+ years",
    rest: " combined experience in maintenance, overhaul, and troubleshooting — marine and land-use engines.",
  },
  {
    bold: "Dedicated Niigata engineers",
    rest: " from the Customer Support Center for the Indonesian region — troubleshooting, supervision, and overhaul.",
  },
  {
    bold: "Annual courtesy visits",
    rest: " to each customer in Indonesia by the principal.",
  },
  {
    bold: "Open communication channel",
    rest: " between manufacturer and customer for any clarification or troubleshooting.",
  },
  {
    bold: "Case-by-case field reports",
    rest: " — photo details, findings, and manufacturer recommendations.",
  },
];

const brands = [
  { name: "Ramus", image: "/partner/ramus.webp" },
  { name: "Powerbrain", image: "/partner/powerbrain.webp" },
  { name: "Ramoco", image: "/partner/ramoco.webp" },
  { name: "Yuchai", image: "/partner/yuchai.jpg" },
  { name: "Midea", image: "/partner/midea.png" },
  { name: "Broad", image: "/partner/broad.webp" },
  { name: "Hisense", image: "/partner/hisense.webp" },
  { name: "Emerson", image: "/partner/emerson.png" },
  { name: "Endress+Hauser", image: "/partner/endress-hauser.webp" },
  { name: "KINGSAT", image: "/partner/kingsat.webp" },
  { name: "IHI", image: "/partner/ihi.webp" },
  { name: "Niigata", image: "/partner/niigata.webp" },
];

function brandInitials(name: string) {
  if (name === "+ more") return "…";
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}

export default function SolutionsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Solutions"
        title={
          <>
            The Full Mechanical &amp; Electrical Scope.
          </>
        }
        description="Engineered for environments where downtime is not an option — drawing on a network of specialist capabilities that mission-critical facilities depend on."
      />

      {/* ── Pillars ──────────────────────────────────────────────── */}
      {pillars.map((pillar, index) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={`scroll-mt-20 border-b border-sume-line py-26 ${
            index % 2 === 1 ? "bg-sume-mist" : "bg-white"
          }`}
        >
          <div className="sume-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
            <div className={`flex flex-col gap-6 w-full ${pillar.flip ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-sume-line">
                <span className="absolute left-[18px] top-[18px] z-[2] rounded-[2px] bg-sume-navy/[0.78] px-[13px] py-[7px] font-head text-[12px] font-semibold tracking-[0.16em] text-white">
                  {pillar.tagnum}
                </span>
                <Image
                  src={pillar.image}
                  alt={pillar.eyebrow}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {pillar.id === "power" && (
                <div className="w-full overflow-hidden border border-sume-line flex bg-white">
                  <img
                    src="/power-aftersales-service.webp"
                    alt="Power Aftersales Service"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>

            <div>
              <span className="sume-eyebrow mb-4 block">{pillar.eyebrow}</span>
              <h2 className="mb-[18px] font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                {pillar.title}
              </h2>
              <p className="mb-[34px] max-w-[46ch] text-[17.5px] leading-[1.6] text-sume-body">
                {pillar.lead}
              </p>

              <ul className="flex flex-col">
                {pillar.caps.map((cap, capIndex) => (
                  <li
                    key={cap.title}
                    className={`flex gap-[18px] border-t border-sume-line py-5 ${
                      capIndex === pillar.caps.length - 1
                        ? "border-b border-sume-line"
                        : ""
                    }`}
                  >
                    <span className="mt-[9px] h-2 w-2 flex-none rounded-full bg-sume-blue" />
                    <div>
                      <h4 className="mb-[5px] font-head text-[17px] font-semibold text-sume-navy">
                        {cap.title}
                      </h4>
                      <p className="text-[15px] leading-[1.55] text-sume-body">
                        {cap.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {pillar.id === "power" ? (
                <div className="mt-[34px] border border-l-[3px] border-sume-line border-l-sume-blue bg-white p-7 sm:px-[30px]">
                  <h3 className="mb-1.5 font-head text-[18px] font-semibold text-sume-navy">
                    Aftersales Service — IHI / Niigata Engines
                  </h3>
                  <p className="mb-5 max-w-[50ch] text-[14.5px] leading-[1.55] text-sume-body">
                    Reliability does not end at commissioning. Engine systems are
                    backed by a structured aftersales program delivered with the
                    manufacturer.
                  </p>
                  <ul className="grid gap-3.5">
                    {aftersales.map((item) => (
                      <li
                        key={item.bold}
                        className="flex gap-[13px] text-[14.5px] leading-[1.5] text-sume-body"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 h-[18px] w-[18px] flex-none stroke-sume-blue"
                        >
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        <span>
                          <b className="font-semibold text-sume-navy">
                            {item.bold}
                          </b>
                          {item.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      {/* ── Integrated M&E ───────────────────────────────────────── */}
      <section
        id="integrated"
        className="relative scroll-mt-20 overflow-hidden border-b border-sume-line bg-white py-30"
      >
        <Image
          src="/images/home/pattern-3.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.92)_38%,rgba(248,251,255,0.55)_70%,rgba(248,251,255,0.1)_100%)]" />

        <div className="sume-wrap relative z-[2]">
          <div className="max-w-[620px]">
            <span className="sume-eyebrow mb-4 block">
              Integrated M&amp;E Contracting
            </span>
            <h2 className="mb-5 font-head text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.02em] text-sume-navy">
              One partner, not a dozen vendors.
            </h2>
            <p className="mb-3.5 max-w-[44ch] text-[18px] leading-[1.6] text-sume-body">
              SUME&apos;s core: a single accountable contractor across the full
              mechanical and electrical scope —{" "}
              <strong className="font-semibold text-sume-navy">
                design, procurement, installation, commissioning, and ongoing
                maintenance.
              </strong>
            </p>
            <p className="max-w-[44ch] text-[18px] leading-[1.6] text-sume-body">
              Where most projects coordinate across many specialists, SUME
              delivers the entire M&amp;E lifecycle under one line of
              accountability — reducing risk, simplifying delivery, and keeping
              every critical system aligned.
            </p>
          </div>
        </div>
      </section>

      {/* ── Capabilities & Brands ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sume-navy py-26">
        <div className="sume-wrap">
          <span className="sume-eyebrow mb-4 block text-[#7fb4ff]">
            Capabilities &amp; Brands
          </span>
          <h2 className="max-w-[20ch] font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            The specialist names behind every solution.
          </h2>
          <p className="mb-13 mt-3.5 max-w-[48ch] text-[17px] leading-[1.55] text-white/[0.68]">
            The technologies and capabilities that mission-critical facilities
            depend on — delivered as one connected network.
          </p>

          <div className="grid grid-cols-2 gap-px border border-white/[0.12] bg-white/[0.12] sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className={`group relative flex aspect-[3/2] flex-col items-center justify-center gap-2.5 p-4 transition ${
                  brand.image
                    ? "bg-white"
                    : "bg-sume-navy hover:bg-[#13304d]"
                }`}
              >
                {brand.image ? (
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    className="object-contain p-6 mix-blend-multiply opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : (
                  <>
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[3px] border-[1.5px] border-dashed border-white/[0.28] font-head text-[18px] font-semibold text-white/40">
                      {brandInitials(brand.name)}
                    </div>
                    <div className="text-center font-head text-[13px] font-medium tracking-[0.02em] text-white/70">
                      {brand.name}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CtaBand
        title="Discuss your requirements."
        description="Tell us about your facility — power, cooling, monitoring, or full M&E scope. Our engineering team will assess and respond."
      >
        <Link href="/contact" className="sume-btn sume-btn-white">
          Discuss Your Requirements
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </CtaBand>
    </main>
  );
}
