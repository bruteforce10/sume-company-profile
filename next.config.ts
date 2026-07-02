import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.graphassets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ap-south-1.graphassets.com",
        pathname: "/**",
      },
      {
        // Supabase Storage public objects (blog thumbnails, article images,
        // author photos, category icons in the `blog-assets` bucket).
        protocol: "https",
        hostname: "egrneczouptvozcytfia.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

// Wires up next-intl. Picks up `./src/i18n/request.ts` automatically.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
