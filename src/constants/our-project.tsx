import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

// Shared (non-translated) stat figures referenced from both locales.
const projectsDeliveredValue: ReactNode = (
  <>
    <span className="text-white/40">185</span>+
  </>
);
const coolingOptimizedValue: ReactNode = (
  <>
    <span className="text-white/40">500</span> TR
  </>
);
const gensetsMaintainedValue: ReactNode = (
  <>
    <span className="font-medium">42</span>+
  </>
);

/** Header stat figures for the Projects page. */
export const projectStats: Record<
  Locale,
  { value: ReactNode; label: string }[]
> = {
  en: [
    { value: projectsDeliveredValue, label: "Projects Delivered" },
    { value: "50+ MWp", label: "Solar PV Installed" },
    { value: coolingOptimizedValue, label: "Cooling Optimized" },
  ],
  id: [
    { value: projectsDeliveredValue, label: "Proyek Diselesaikan" },
    { value: "50+ MWp", label: "Solar PV Terpasang" },
    { value: coolingOptimizedValue, label: "Pendinginan Dioptimalkan" },
  ],
};

export type ProjectMetric = { k: string; v: string; pos?: boolean };

/** Featured cooling case studies with measured outcomes. */
export const featuredResults: Record<
  Locale,
  { tag: string; name: string; cap: string; metrics: ProjectMetric[] }[]
> = {
  en: [
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
  ],
  id: [
    {
      tag: "Industri · Precision Cooling",
      name: "PT Autoplastik Indonesia",
      cap: "Retrofit Chiller · 2 × 500 TR",
      metrics: [
        { k: "COP Sebelum Optimisasi", v: "3.34" },
        { k: "COP Setelah Optimisasi", v: "3.61", pos: true },
        { k: "Penghematan Energi Tahunan", v: "IDR 651.6M", pos: true },
      ],
    },
    {
      tag: "Industri · Precision Cooling",
      name: "SKF Factory",
      cap: "Cakung, Jakarta · 3 × 550 TR",
      metrics: [
        { k: "Efisiensi Plant Sebelum", v: "1.10 kW/TR" },
        { k: "Efisiensi Plant Setelah", v: "0.77 kW/TR", pos: true },
        { k: "Penghematan Energi Tahunan", v: "IDR 1.117B", pos: true },
      ],
    },
  ],
};

/** Cooling portfolio table rows: [project, location, capacity, scope]. */
export const coolingPortfolio: Record<Locale, string[][]> = {
  en: [
    ["Festival Citilink", "Bandung", "3 × 1,000 TR", "Chiller Optimization"],
    ["Lenmarc Mall", "Surabaya", "3 × 1,050 TR", "Chiller Optimization"],
    ["Sheraton Gandaria", "Jakarta", "3 × 500 TR", "Chiller Optimization"],
    ["Aston Simatupang", "Jakarta", "3 × 400 TR", "Chiller Systems"],
    ["Papandayan Hotel", "Bandung", "300 + 200 TR", "Cooling Systems"],
    ["Santos Jaya Abadi", "Semarang", "8 × 150 TR", "Air-cooled Plant"],
    ["Isuzu", "Karawang", "6 × 150 TR", "Air-cooled Plant"],
  ],
  id: [
    ["Festival Citilink", "Bandung", "3 × 1.000 TR", "Optimisasi Chiller"],
    ["Lenmarc Mall", "Surabaya", "3 × 1.050 TR", "Optimisasi Chiller"],
    ["Sheraton Gandaria", "Jakarta", "3 × 500 TR", "Optimisasi Chiller"],
    ["Aston Simatupang", "Jakarta", "3 × 400 TR", "Sistem Chiller"],
    ["Papandayan Hotel", "Bandung", "300 + 200 TR", "Sistem Pendinginan"],
    ["Santos Jaya Abadi", "Semarang", "8 × 150 TR", "Plant Air-cooled"],
    ["Isuzu", "Karawang", "6 × 150 TR", "Plant Air-cooled"],
  ],
};

export const powerCapabilities: Record<
  Locale,
  { num: string; title: string; body: string }[]
> = {
  en: [
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
  ],
  id: [
    {
      num: "01",
      title: "Mitra Layanan Resmi IHI / Niigata",
      body: "Distributor dan layanan resmi untuk mesin darat dan marine IHI / Niigata — salah satu dari sedikit operasi bersertifikat di kawasan ini.",
    },
    {
      num: "02",
      title: "Insinyur Terlatih di Jepang",
      body: "8 insinyur bersertifikat yang dilatih di Niigata Power Systems, Jepang — dengan pengalaman gabungan 20+ tahun dalam pemeliharaan, overhaul, dan troubleshooting.",
    },
    {
      num: "03",
      title: "Melayani Operasi Skala Nasional",
      body: "Mesin yang dilayani SUME menggerakkan operasi kritis di PLN dan Pertamina — operator dengan kebutuhan uptime yang tidak bisa ditawar.",
    },
    {
      num: "04",
      title: "Pasokan & Commissioning Genset Yuchai",
      body: "Genset diesel dan gas dalam konfigurasi containerized dan site-built, disesuaikan dan di-commissioning sesuai kebutuhan beban fasilitas.",
    },
  ],
};

export const powerStats: Record<Locale, { value: ReactNode; label: string }[]> =
  {
    en: [
      {
        value: "12",
        label: "Engineers. 8 Certified by IHI / Niigata Trained, Japan",
      },
      { value: "20+", label: "Years Combined Engine Service Experience" },
      {
        value: "50+ MWp",
        label: "Solar PV Installed Across Commercial & Industrial Sites",
      },
      {
        value: gensetsMaintainedValue,
        label: "Gensets Maintained, Serviced & Commissioned",
      },
    ],
    id: [
      {
        value: "12",
        label: "Insinyur. 8 Bersertifikat Terlatih IHI / Niigata, Jepang",
      },
      { value: "20+", label: "Tahun Pengalaman Gabungan Layanan Mesin" },
      {
        value: "50+ MWp",
        label: "Solar PV Terpasang di Site Komersial & Industri",
      },
      {
        value: gensetsMaintainedValue,
        label: "Genset Dipelihara, Dilayani & Di-commissioning",
      },
    ],
  };
