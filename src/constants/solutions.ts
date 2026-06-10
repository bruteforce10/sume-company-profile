import type { Locale } from "@/i18n/routing";

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

export const solutionPillars: Record<Locale, SolutionPillar[]> = {
  en: [
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
  ],
  id: [
    {
      id: "power",
      tagnum: "01 — Kelistrikan",
      eyebrow: "Kelistrikan & Energi",
      title: "Tulang punggung setiap fasilitas kritis.",
      lead: "Daya utama dan standby yang direkayasa untuk operasi berkelanjutan, dengan monitoring dan pemeliharaan yang menjaga keandalannya sepanjang masa pakai.",
      image: "/images/home/solution-1.png",
      caps: [
        {
          title: "Genset Standby & Prime",
          body: "Genset diesel & gas Yuchai; konfigurasi containerized dan site-built, disesuaikan dengan beban fasilitas.",
        },
        {
          title: "Sistem Solar PV",
          body: "Desain dan instalasi rooftop dan ground-mount, dihadirkan bersama Powerbrain; 50+ MWp terpasang.",
        },
        {
          title: "Sistem Fuel Monitoring",
          body: "Deteksi level, konsumsi, dan pencurian bahan bakar secara real-time, didukung instrumentasi Ramus.",
        },
        {
          title: "Pemeliharaan & Overhaul Mesin",
          body: "Suku cadang resmi dan overhaul untuk mesin darat dan marine IHI / Niigata melalui Ramoco.",
        },
      ],
    },
    {
      id: "cooling",
      tagnum: "02 — Pendinginan",
      eyebrow: "Precision Cooling & HVAC",
      title: "Pendinginan yang andal di bawah beban.",
      lead: "Pendinginan umumnya menyerap 40–60% listrik fasilitas. Kami merancang dan mengoptimalkannya untuk performa sekaligus efisiensi energi.",
      image: "/images/home/solution-2.png",
      flip: true,
      caps: [
        {
          title: "Chiller Plant & Sistem VRF",
          body: "Sistem Midea, Broad, dan Hisense untuk beban berdensitas tinggi dan komersial.",
        },
        {
          title: "Optimisasi & Retrofit Chiller",
          body: "Otomasi plant, retrofit VSD, rewinding pompa; peningkatan terukur (mis. 1,10 → 0,77 kW/TR pada plant 3×550 TR).",
        },
        {
          title: "Cooling-as-a-Service",
          body: "Pendinginan tanpa CAPEX di bawah perjanjian layanan energi bergaransi performa, dihadirkan bersama Powerbrain; didukung performance bond setara asuransi serta measurement & verification IPMVP.",
        },
      ],
    },
    {
      id: "monitoring",
      tagnum: "03 — Monitoring",
      eyebrow: "Monitoring & Keamanan",
      title: "Visibilitas total atas infrastruktur kritis.",
      lead: "Infrastruktur kritis membutuhkan visibilitas konstan. Kami mengintegrasikan instrumentasi dan surveillance ke dalam satu tampilan operasional terpadu.",
      image: "/images/home/solution-3.png",
      caps: [
        {
          title: "Flow Metering",
          body: "Meter Emerson dan Endress+Hauser untuk monitoring chilled-water dan proses, diintegrasikan oleh Ramus.",
        },
        {
          title: "Sistem Surveillance",
          body: "Solusi surveillance KINGSAT melalui Ramus.",
        },
        {
          title: "Smart Control & Monitoring",
          body: "Monitoring terpusat untuk sistem kelistrikan, pendinginan, dan bahan bakar.",
        },
      ],
    },
  ],
};

export const aftersalesPoints: Record<Locale, { bold: string; rest: string }[]> = {
  en: [
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
  ],
  id: [
    {
      bold: "8 insinyur Indonesia bersertifikat",
      rest: " yang dilatih di Niigata Power Systems, Jepang.",
    },
    {
      bold: "20+ tahun",
      rest: " pengalaman gabungan dalam pemeliharaan, overhaul, dan troubleshooting — mesin marine dan darat.",
    },
    {
      bold: "Insinyur Niigata khusus",
      rest: " dari Customer Support Center untuk wilayah Indonesia — troubleshooting, supervisi, dan overhaul.",
    },
    {
      bold: "Kunjungan rutin tahunan",
      rest: " ke setiap pelanggan di Indonesia oleh principal.",
    },
    {
      bold: "Saluran komunikasi terbuka",
      rest: " antara pabrikan dan pelanggan untuk klarifikasi atau troubleshooting apa pun.",
    },
    {
      bold: "Laporan lapangan per kasus",
      rest: " — detail foto, temuan, dan rekomendasi pabrikan.",
    },
  ],
};

// Partner brand logos — proper names, not translated.
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
