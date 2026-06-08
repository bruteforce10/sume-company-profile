import type { Metadata } from "next";
import {
  IBM_Plex_Sans,
  Inter,
  Manrope,
  Plus_Jakarta_Sans,
  Source_Sans_3,
} from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteUrl } from "@/constants/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Enterprise design direction: IBM Plex Sans (headings) + Source Sans 3 (body)
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle =
  "SUME Group — Mechanical & Electrical Infrastructure for Mission-Critical Facilities";
const siteDescription =
  "SUME designs, installs, and maintains the power, cooling, and monitoring systems that keep data centers, commercial properties, and industrial facilities running — without interruption.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | SUME Group",
  },
  description: siteDescription,
  applicationName: "SUME Group",
  keywords: [
    "SUME Group",
    "PT SUME",
    "mechanical and electrical",
    "M&E contractor",
    "data center infrastructure",
    "precision cooling",
    "HVAC",
    "power and energy",
    "facility monitoring",
    "Jakarta",
    "Indonesia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SUME Group",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/images/home/city-building.png",
        width: 1200,
        height: 630,
        alt: "SUME Group — Mechanical & Electrical Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/home/city-building.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${manrope.variable} ${inter.variable} ${ibmPlexSans.variable} ${sourceSans.variable} antialiased`}
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
