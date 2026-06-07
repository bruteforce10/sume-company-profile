import type { ReactNode } from "react";

/** Company timeline rows (year labels are confirmed before launch). */
export const milestones: { event: ReactNode }[] = [
  { event: <>PT. SUME founded as a mechanical &amp; electrical contractor.</> },
  {
    event: (
      <>
        First major commercial project delivered (
        <span className="text-sume-line">[name]</span>).
      </>
    ),
  },
  { event: <>Expanded into power generation and standby systems.</> },
  { event: <>Established regional presence (Singapore, Myanmar).</> },
  { event: <>Entered data center / mission-critical segment.</> },
  { event: <>Added solar PV and Cooling-as-a-Service capabilities.</> },
];

/** "What sets us apart" feature cards. */
export const whatSetsApart = [
  {
    num: "01",
    title: "End-to-End Accountability",
    body: "One partner across design, procurement, installation, commissioning, and lifetime maintenance — no coordination gaps.",
  },
  {
    num: "02",
    title: "Certified & Accredited",
    body: "ISO 9001 / 14001 / 45001 quality, environmental, and safety standards, with EDGE and BNSP accreditation.",
  },
  {
    num: "03",
    title: "Recognized Clients",
    body: "Trusted by Samsung, Yonex, Santika, RE/MAX, and Mega Bekasi Hypermall, among others across the region.",
  },
  {
    num: "04",
    title: "Regional Reach",
    body: "Headquartered in Jakarta with offices in Singapore and Myanmar — delivered and supported locally.",
  },
];

/** Certification cards — `icon` holds the inner <svg> paths. */
export const certifications: {
  name: string;
  detail: string;
  icon: ReactNode;
}[] = [
  {
    name: "Quality Management",
    detail: "ISO 9001",
    icon: (
      <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6L5.7 21l2.3-7.2-6-4.4h7.6z" />
    ),
  },
  {
    name: "Environmental Management",
    detail: "ISO 14001",
    icon: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7c-1 0-2 0-3-.5" />
        <path d="M2 22c0-3 1-5 3-7" />
      </>
    ),
  },
  {
    name: "Occupational Health & Safety",
    detail: "ISO 45001",
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    name: "International Product Compliance",
    detail: "CE / EAC / Industry Certifications",
    icon: <path d="M20 6L9 17l-5-5" />,
  },
];
