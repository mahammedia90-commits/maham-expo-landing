import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/auth-api/:path*',
        destination: 'https://auth-service-api.mahamexpo.sa/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
