import type { ReactNode } from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 flex-none stroke-sume-blue",
};

export type CapabilityTag = { label: string; green?: boolean };
export type PartnerLogo = { name: string; image: string };

/** Data-center need → SUME capability mapping rows. */
export const dataCenterCapabilities: {
  icon: ReactNode;
  need: string;
  capability: string;
  tags: CapabilityTag[];
  logos?: PartnerLogo[];
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
    logos: [
      { name: "Yuchai", image: "/partner/yuchai.jpg" },
      { name: "IHI", image: "/partner/ihi.webp" },
    ],
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
    logos: [
      { name: "Midea", image: "/partner/midea.png" },
      { name: "Broad", image: "/partner/broad.webp" },
      { name: "Hisense", image: "/partner/hisense.webp" },
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
    logos: [{ name: "Powerbrain", image: "/partner/powerbrain.webp" }],
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
    logos: [
      { name: "Emerson", image: "/partner/emerson.png" },
      { name: "Endress+Hauser", image: "/partner/endress-hauser.webp" },
      { name: "Ramus", image: "/partner/ramus.webp" },
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
    logos: [
      { name: "KINGSAT", image: "/partner/kingsat.webp" },
      { name: "Ramus", image: "/partner/ramus.webp" },
    ],
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

export const whyItMatters = [
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

export const dataCenterScope = [
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
