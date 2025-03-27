import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            { protocol: "http", hostname: "**" },
            { protocol: "https", hostname: "**" },
        ],
    },
    crossOrigin: "anonymous",
};

export default nextConfig;
