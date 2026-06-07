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

export const metadata: Metadata = {
  title:
    "SUME Group — Mechanical & Electrical Infrastructure for Mission-Critical Facilities",
  description:
    "SUME designs, installs, and maintains the power, cooling, and monitoring systems that keep data centers, commercial properties, and industrial facilities running — without interruption.",
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
