import {
  Award,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Projects", href: "/our-project" },
  { label: "Contact", href: "/#contact" },
];

export const company = {
  name: "PT. Solusi Utama Mekanikal Elektrikal",
  shortName: "PT. SUME",
  tagline: "Modern Buildings Solution is Our Focus",
  description:
    "PT. Solusi Utama Mekanikal Elektrikal (SUME) provides integrated mechanical and electrical solutions with innovation, quality, and reliability.",
  address: "Jl. Cideng Timur No. 59, Central Jakarta",
  phone: "(021) 3864 160",
  email: "info@ptsume.co.id",
  whatsapp: "https://wa.me/6281290002014",
};

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
    "A structured and reliable approach to delivering Mechanical and Electrical solutions — from planning to long-term performance.",
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
      "Strict safety protocols embedded in every phase — from planning to execution on-site.",
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

export const projects = [
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
