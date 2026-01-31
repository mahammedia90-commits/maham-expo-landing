import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Disables /_next/image API - required for static hosting
  },
  trailingSlash: false,  // Uses about.html instead of about/index.html
};

export default nextConfig;
