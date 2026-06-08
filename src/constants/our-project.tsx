import type { ReactNode } from "react";

/** Header stat figures for the Projects page. */
export const projectStats: { value: ReactNode; label: string }[] = [
  {
    value: (
      <>
        <span className="text-white/40">185</span>+
      </>
    ),
    label: "Projects Delivered",
  },
  { value: "50+ MWp", label: "Solar PV Installed" },
  {
    value: (
      <>
        <span className="text-white/40">500</span> TR
      </>
    ),
    label: "Cooling Optimized",
  },
  // { value: "3", label: "Countries" },
];

export type ProjectMetric = { k: string; v: string; pos?: boolean };

/** Featured cooling case studies with measured outcomes. */
export const featuredResults: {
  tag: string;
  name: string;
  cap: string;
  metrics: ProjectMetric[];
}[] = [
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

/** Cooling portfolio table rows: [project, location, capacity, scope]. */
export const coolingPortfolio = [
  ["Festival Citilink", "Bandung", "3 × 1,000 TR", "Chiller Optimization"],
  ["Lenmarc Mall", "Surabaya", "3 × 1,050 TR", "Chiller Optimization"],
  ["Sheraton Gandaria", "Jakarta", "3 × 500 TR", "Chiller Optimization"],
  ["Aston Simatupang", "Jakarta", "3 × 400 TR", "Chiller Systems"],
  ["Papandayan Hotel", "Bandung", "300 + 200 TR", "Cooling Systems"],
  ["Santos Jaya Abadi", "Semarang", "8 × 150 TR", "Air-cooled Plant"],
  ["Isuzu", "Karawang", "6 × 150 TR", "Air-cooled Plant"],
];

export const powerCapabilities = [
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

export const powerStats: { value: ReactNode; label: string }[] = [
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
