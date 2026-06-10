import type { Metadata } from "next";
import { IBM_Plex_Sans, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

// Match the marketing site's type system so the SUME design tokens
// (`font-head`, `font-display`, body) resolve inside the CMS too.
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

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SUME CMS",
  // The admin area must never be indexed.
  robots: { index: false, follow: false },
};

// Root layout for the CMS route group. It is a *second* root layout alongside
// `app/[locale]/layout.tsx`; navigating between the marketing site and the CMS
// triggers a full page load, which is the intended isolation.
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${manrope.variable} ${ibmPlexSans.variable} antialiased`}
    >
      <body className="bg-sume-bg-page text-sume-body">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
