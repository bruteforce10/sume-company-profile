import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

/** Company timeline rows (year labels are confirmed before launch). */
export const milestones: Record<Locale, { year: string; event: ReactNode }[]> = {
  en: [
    {
      year: "2014",
      event: <>PT. SUME founded as a mechanical &amp; electrical contractor.</>,
    },
    {
      year: "2015",
      event: <>Megabekasi Hypermall Project Maintenance dan BroadChiller.</>,
    },
    {
      year: "2017",
      event: <>Expanded into power generation and standby systems.</>,
    },
    {
      year: "2025",
      event: <>Established regional presence (Singapore, Myanmar).</>,
    },
    {
      year: "2025",
      event: <>Added solar PV and Cooling-as-a-Service capabilities.</>,
    },
    {
      year: "2026",
      event: <>Entered data center / mission-critical segment.</>,
    },
  ],
  id: [
    {
      year: "2014",
      event: <>PT. SUME didirikan sebagai kontraktor mekanikal &amp; elektrikal.</>,
    },
    {
      year: "2015",
      event: <>Pemeliharaan Proyek Megabekasi Hypermall dan Broad Chiller.</>,
    },
    {
      year: "2017",
      event: <>Berkembang ke pembangkitan daya dan sistem standby.</>,
    },
    {
      year: "2025",
      event: <>Membuka kehadiran regional (Singapura, Myanmar).</>,
    },
    {
      year: "2025",
      event: <>Menambah kapabilitas solar PV dan Cooling-as-a-Service.</>,
    },
    {
      year: "2026",
      event: <>Memasuki segmen data center / mission-critical.</>,
    },
  ],
};

/** "What sets us apart" feature cards. */
export const whatSetsApart: Record<
  Locale,
  { num: string; title: string; body: string }[]
> = {
  en: [
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
  ],
  id: [
    {
      num: "01",
      title: "Tanggung Jawab End-to-End",
      body: "Satu mitra untuk desain, pengadaan, instalasi, commissioning, dan pemeliharaan seumur pakai — tanpa celah koordinasi.",
    },
    {
      num: "02",
      title: "Tersertifikasi & Terakreditasi",
      body: "Standar mutu, lingkungan, dan keselamatan ISO 9001 / 14001 / 45001, dengan akreditasi EDGE dan BNSP.",
    },
    {
      num: "03",
      title: "Klien Ternama",
      body: "Dipercaya oleh Samsung, Yonex, Santika, RE/MAX, dan Mega Bekasi Hypermall, serta banyak lainnya di kawasan ini.",
    },
    {
      num: "04",
      title: "Jangkauan Regional",
      body: "Berkantor pusat di Jakarta dengan kantor di Singapura dan Myanmar — dihadirkan dan didukung secara lokal.",
    },
  ],
};

// Certification icons — shared <svg> inner paths, referenced from both locales.
const iconQuality: ReactNode = (
  <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6L5.7 21l2.3-7.2-6-4.4h7.6z" />
);
const iconEnvironment: ReactNode = (
  <>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8a7 7 0 0 1-7 7c-1 0-2 0-3-.5" />
    <path d="M2 22c0-3 1-5 3-7" />
  </>
);
const iconSafety: ReactNode = (
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);
const iconCompliance: ReactNode = <path d="M20 6L9 17l-5-5" />;

/** Certification cards — `icon` holds the inner <svg> paths. */
export const certifications: Record<
  Locale,
  { name: string; detail: string; icon: ReactNode }[]
> = {
  en: [
    { name: "Quality Management", detail: "ISO 9001", icon: iconQuality },
    {
      name: "Environmental Management",
      detail: "ISO 14001",
      icon: iconEnvironment,
    },
    {
      name: "Occupational Health & Safety",
      detail: "ISO 45001",
      icon: iconSafety,
    },
    {
      name: "International Product Compliance",
      detail: "CE / EAC / Industry Certifications",
      icon: iconCompliance,
    },
  ],
  id: [
    { name: "Manajemen Mutu", detail: "ISO 9001", icon: iconQuality },
    {
      name: "Manajemen Lingkungan",
      detail: "ISO 14001",
      icon: iconEnvironment,
    },
    {
      name: "Keselamatan & Kesehatan Kerja",
      detail: "ISO 45001",
      icon: iconSafety,
    },
    {
      name: "Kepatuhan Produk Internasional",
      detail: "CE / EAC / Sertifikasi Industri",
      icon: iconCompliance,
    },
  ],
};
