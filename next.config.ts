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
    ],
  },
};

// Wires up next-intl. Picks up `./src/i18n/request.ts` automatically.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
