import {
  Award,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export type NavChild = { label: string; href: string };

export type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
  /** Horizontal alignment of the dropdown panel relative to its trigger. */
  menuAlign?: "left" | "right";
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Power & Energy", href: "/solutions#power" },
      { label: "Precision Cooling & HVAC", href: "/solutions#cooling" },
      { label: "Monitoring & Security", href: "/solutions#monitoring" },
    ],
  },
  { label: "Data Center", href: "/data-center" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/our-project" },
  {
    label: "Contact",
    href: "/contact",
    menuAlign: "right",
    children: [
      { label: "Contact Us", href: "/contact" },
      { label: "Regional Presence", href: "/regional" },
    ],
  },
];

export const company = {
  name: "PT. Solusi Utama Mekanikal Elektrikal",
  brand: "SUME Group",
  legalName: "PT. SUME (Solusi Utama Mekanikal Elektrikal)",
  shortName: "PT. SUME",
  tagline: "Modern Buildings Solution is Our Focus",
  description:
    "PT. Solusi Utama Mekanikal Elektrikal (SUME) provides integrated mechanical and electrical solutions with innovation, quality, and reliability.",
  address: "Jl. Cideng Timur No. 59, Central Jakarta",
  phone: "+62813-8880-1886",
  email: "projects@sumeid.com",
  whatsapp: "https://wa.me/6281388801886",
};

/* ============ Home (SUME Group enterprise redesign) ============ */

// Hero slideshow — slides map to the four solution pillars (intruction.md §1.1)
export const heroSlides = [
  {
    num: "01",
    label: "Power",
    eyebrow: "01 — Power",
    title: "Critical Power, Engineered for Uptime",
    subtitle:
      "Standby generation, fuel monitoring, and solar — built for facilities that cannot afford to go dark.",
    image: "/images/home/hiro-1.png",
  },
  {
    num: "02",
    label: "Cooling",
    eyebrow: "02 — Cooling",
    title: "Cooling That Performs Under Load",
    subtitle:
      "HVAC and chiller solutions engineered for continuous, high-density thermal loads.",
    image: "/images/home/hiro-2.png",
  },
  {
    num: "03",
    label: "Monitoring",
    eyebrow: "03 — Monitoring",
    title: "Total Visibility Over Critical Infrastructure",
    subtitle:
      "Fuel monitoring, flow metering, and surveillance in one operational picture.",
    image: "/images/home/hiro-5.png",
  },
  {
    num: "04",
    label: "Integrated",
    eyebrow: "04 — Integrated",
    title: "One Partner, End-to-End Infrastructure",
    subtitle:
      "From design to commissioning to operation — delivered as a single accountable scope.",
    image: "/images/home/city-building.png",
  },
];

// Trust bar — figures kept as placeholders pending verification before launch (spec §1.2)
export const trustStats = [
  { value: "2014", suffix: "", placeholder: true, label: "Years of Operation" },
  { value: "185", suffix: "+", placeholder: true, label: "Projects Delivered" },
  { value: "3", label: "Countries" },
  { value: "ISO", placeholder: true, label: "Certified & Accredited" },
];

export const solutionsOverview = [
  {
    num: "01",
    title: "Power & Energy",
    anchor: "power",
    description:
      "Generators · solar PV · fuel monitoring · engine maintenance.",
    image: "/images/home/solution-1.png",
  },
  {
    num: "02",
    title: "Precision Cooling",
    anchor: "cooling",
    description: "Chillers · VRF · optimization · Cooling-as-a-Service.",
    image: "/images/home/solution-2.png",
  },
  {
    num: "03",
    title: "Monitoring & Security",
    anchor: "monitoring",
    description: "Flow metering · CCTV · smart control.",
    image: "/images/home/solution-3.png",
  },
  {
    num: "04",
    title: "Integrated M&E",
    anchor: "integrated",
    description: "Design · install · commission · maintain.",
    image: "/images/home/solution-4.png",
  },
];

export const whySume = [
  {
    num: "01",
    title: "Proven Track Record",
    placeholderPrefix: "[ ]",
    description:
      "+ projects across commercial, industrial & mission-critical facilities.",
  },
  {
    num: "02",
    title: "Certified & Accredited",
    description:
      "ISO 9001 / 14001 / 45001 quality, environmental & safety standards.",
  },
  {
    num: "03",
    title: "Recognized Clients",
    description: "Samsung · Yonex · Santika · RE/MAX · Mega Bekasi Hypermall.",
  },
  {
    num: "04",
    title: "End-to-End Accountability",
    description:
      "One partner across design, delivery, and lifetime maintenance.",
  },
];

// Trusted-by marquee — real logos from trusted-logo directory
export const trustedLogos = [
  { name: "ASDP", image: "/trusted-logo/asdp-logo.webp" },
  { name: "Asset 65", image: "/trusted-logo/asset-65.webp" },
  { name: "Astra", image: "/trusted-logo/astra.webp" },
  { name: "Badak LNG", image: "/trusted-logo/badak-lng.webp" },
  { name: "BBC", image: "/trusted-logo/bbc.webp" },
  { name: "Econnection Space", image: "/trusted-logo/econnection-space.webp" },
  { name: "Hisense", image: "/trusted-logo/hisense.webp" },
  { name: "Mega Utama", image: "/trusted-logo/mega-utama.webp" },
  { name: "Jowell", image: "/trusted-logo/jowell.webp" },
  { name: "Kompas Gramedia", image: "/trusted-logo/kompas-gramedia.webp" },
  { name: "Linvol", image: "/trusted-logo/linvol.webp" },
  { name: "PLN", image: "/trusted-logo/logo-pln.webp" },
  { name: "Mega Bekasi", image: "/trusted-logo/mega-bekasi.webp" },
  { name: "Midea", image: "/trusted-logo/midea.webp" },
  { name: "Pertamina", image: "/trusted-logo/pertamina.webp" },
  { name: "Remax", image: "/trusted-logo/remax.webp" },
  { name: "Santika", image: "/trusted-logo/santika.webp" },
  { name: "Vistra", image: "/trusted-logo/vistra.webp" },
  { name: "Megacity", image: "/trusted-logo/megacity.webp" },
  { name: "Wijaya Karya", image: "/trusted-logo/wijaya-karya.webp" },
  { name: "Yonex", image: "/trusted-logo/yonex.webp" },
];

export const footerOffices = [
  "Indonesia (HQ)",
  "Singapore",
  "Myanmar — Yangon",
  "Myanmar — Mandalay",
];

export const heroContent = {
  heading: {
    prefix: "Modern Buildings Solution is Our ",
    highlight: "Focus",
  },
  cards: [
    {
      icon: TrendingUp,
      title: "Reliable Execution",
      description:
        "We deliver projects with precision and long-term performance.",
      position: "left",
    },
    {
      icon: Award,
      title: "Certificate Global",
      description: "Aligned with trusted manufacturers and certified systems.",
      position: "right",
    },
  ],
};

export const aboutContent = {
  preheading: "SINCE 2014",
  heading: "About PT. SUME",
  body: "We specialize in providing comprehensive, integrated M&E systems that serve as the backbone for modern buildings. Our mission is to combine technical precision with innovative technology to ensure safety, efficiency, and long-term reliability.",
  buttonLabel: "Learn More",
  buttonHref: "#solutions",
  points: [
    {
      title: "Integrated M&E Systems",
      desc: "Complete synergy between mechanical and electrical components.",
      icon: CheckCircle2,
    },
    {
      title: "Quality & Safety Focus",
      desc: "Strict adherence to international standards and rigorous safety protocols.",
      icon: ShieldCheck,
    },
  ],
};

export const contactContent = {
  heading: "Get in Touch",
  body: "Ready to start your next engineering project? Our experts are here to provide a detailed consultation for your specific M&E needs.",
  items: [
    { icon: MapPin, label: "Office", value: company.address },
    { icon: Phone, label: "Phone", value: company.phone },
    { icon: Mail, label: "Email", value: company.email },
  ],
};

export const whyChooseContent = {
  heading: "Why Choose PT. SUME",
  description:
    "We go beyond installation, providing a partnership focused on the long-term success of your engineering investment.",
};

export const processContent = {
  heading: "How We Deliver Excellence",
  description:
    "A structured and reliable approach to delivering Mechanical and Electrical solutions - from planning to long-term performance.",
};

export const clients = [
  { name: "REMAX", image: "/images/clients/REMAX.png", width: 308, height: 83 },
  { name: "BCC", image: "/images/clients/bcc.png", width: 291, height: 83 },
  { name: "BROAD", image: "/images/clients/broad.png", width: 287, height: 83 },
  {
    name: "Kerinduanku",
    image: "/images/clients/kerinduanku.png",
    width: 308,
    height: 122,
  },
  {
    name: "Pengayoman",
    image: "/images/clients/pengayoman.png",
    width: 111,
    height: 122,
  },
  {
    name: "Samsung",
    image: "/images/clients/samsung.png",
    width: 296,
    height: 48,
  },
  { name: "Yonex", image: "/images/clients/yonex.png", width: 291, height: 83 },
  {
    name: "santika",
    image: "/images/clients/santika.png",
    width: 255,
    height: 83,
  },
  {
    name: "mega-utama",
    image: "/images/clients/mega-utama.png",
    width: 360,
    height: 83,
  },
];

export const solutions = [
  {
    title: "Air Conditioning Systems",
    eyebrow: "Cooling Infrastructure",
    description:
      "Advanced VRF and chiller solutions for optimal climate control in commercial spaces.",
    metric: "24/7 Monitoring",
  },
  {
    title: "Elevators & Escalators",
    eyebrow: "",
    description:
      "High-speed, energy-efficient vertical transportation systems for skyscrapers.",
    metric: "LINVOL",
  },
  {
    title: "Supporting Infrastructure",
    eyebrow: "END-TO-END DELIVERY",
    description:
      "Supporting systems and integrated building components to ensure efficient and reliable operations.",
    metric: "END-TO-END DELIVERY",
  },
  {
    title: "M&E Integration",
    eyebrow: "COMPREHENSIVE CONTROL",
    description:
      "Seamless coordination between all mechanical and electrical infrastructure components.",
    metric: "COMPREHENSIVE CONTROL",
  },
];

export const whyChooseUs = [
  {
    title: "Reliable Execution",
    description:
      "Precision-driven engineering with consistent delivery across complex, large-scale projects.",
  },
  {
    title: "Certified Quality",
    description:
      "Aligned with international standards (ISO) and supported by certified global manufacturing partners.",
  },
  {
    title: "Safety First",
    description:
      "Strict safety protocols embedded in every phase - from planning to execution on-site.",
  },
  {
    title: "Efficient Management",
    description:
      "Structured project workflows ensuring timely delivery without compromising performance.",
  },
  {
    title: "Sustainable Solutions",
    description:
      "Energy-efficient systems designed to reduce operational costs and long-term environmental impact.",
  },
];

export type Project = {
  title: string;
  category: string;
  location: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Central Business Plaza",
    category: "Commercial",
    location: "Jakarta",
    image: "/images/projects/project-1.png",
  },
  {
    title: "Techno Logistic Hub",
    category: "Industrial",
    location: "Bekasi",
    image: "/images/projects/project-2.png",
  },
  {
    title: "Santika Hospitality Upgrade",
    category: "Hospitality",
    location: "Bandung",
    image: "/images/projects/project-3.png",
  },
  {
    title: "Public Service Facility",
    category: "Government",
    location: "Central Jakarta",
  },
  {
    title: "Retail Experience Center",
    category: "Retail",
    location: "Tangerang",
  },
  {
    title: "Data Support Room",
    category: "Technology",
    location: "South Jakarta",
  },
];

export const processSteps = [
  {
    step: "1",
    title: "Engineering & Planning",
    description:
      "We map site conditions and prepare system recommendations, specifications, and timelines before execution begins.",
  },
  {
    step: "2",
    title: "Integrated System Execution",
    description:
      "Installation is delivered by coordinated teams with precise execution and progress reporting.",
  },
  {
    step: "3",
    title: "Quality & Safety Control",
    description:
      "Strict adherence to international standards and rigorous safety protocols at every installation stage to ensure a zero-accident project environment.",
  },
  {
    step: "4",
    title: "Long-Term Support & Maintenance",
    description:
      "Systems are tested, documented, and handed over with comprehensive maintenance-ready guidance for long-term reliability.",
  },
];
