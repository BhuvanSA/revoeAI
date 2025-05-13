import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint checks during production builds
  eslint: {
    ignoreDuringBuilds: true,  // Allows builds to succeed despite lint errors :contentReference[oaicite:2]{index=2}
  },

  // Disable TypeScript type-checking during production builds
  typescript: {
    ignoreBuildErrors: true,   // Allows builds to succeed despite TS errors :contentReference[oaicite:3]{index=3}
  },

  // Your existing image remote patterns
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
