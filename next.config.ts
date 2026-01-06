import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,
  // Enable if you need image optimization with external images
  // images: {
  //   remotePatterns: [
  //     { protocol: 'https', hostname: '**.cloudinary.com' },
  //   ],
  // },
};

export default nextConfig;
