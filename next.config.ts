import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Disables /_next/image API - required for static hosting
  },
  trailingSlash: true,  // Uses about/index.html - better for most hosting providers
};

export default nextConfig;
