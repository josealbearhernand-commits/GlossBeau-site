import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
    // 60 for the blurred hero side-fill, 75 default, 90 for the hero photo and product gallery
    qualities: [60, 75, 90],
  },
};

export default nextConfig;
