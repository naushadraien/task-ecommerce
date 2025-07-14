import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("http://api.freeapi.app/**")],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
