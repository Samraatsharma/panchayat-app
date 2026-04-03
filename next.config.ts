import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedRevalidateHeaderKeys: undefined,
  },
};

// Also inject the specific IP to avoid cross-origin block
// @ts-ignore
nextConfig.allowedDevOrigins = ["192.168.29.177", "localhost"];

export default nextConfig;
