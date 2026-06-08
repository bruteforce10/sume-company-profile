export type SolutionCapability = { title: string; body: string };

export type SolutionPillar = {
  id: string;
  tagnum: string;
  eyebrow: string;
  title: string;
  lead: string;
  image: string;
  flip?: boolean;
  caps: SolutionCapability[];
};

export const solutionPillars: SolutionPillar[] = [
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

export const aftersalesPoints = [
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

export const partnerBrands = [
  // { name: "Ramoco", image: "/partner/ramoco.webp" },
  { name: "Midea", image: "/partner/midea.png" },
  { name: "Yuchai", image: "/partner/yuchai.jpg", className: "p-2 scale-[1.15]" },
  { name: "Broad", image: "/partner/broad.webp" },
  { name: "Hisense", image: "/partner/hisense.webp" },
  { name: "Emerson", image: "/partner/emerson.png", className: "p-3 scale-[1.1]" },
  { name: "Endress+Hauser", image: "/partner/endress-hauser.webp" },
  { name: "KINGSAT", image: "/partner/kingsat.webp" },
  { name: "IHI", image: "/partner/ihi.webp" },
  { name: "Niigata", image: "/partner/niigata.webp" },
  { name: "Ramus", image: "/partner/ramus.webp" },
  { name: "Powerbrain", image: "/partner/powerbrain.webp" },
  { name: "+ more" },
];
