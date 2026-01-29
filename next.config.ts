import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
    domains: ["m.media-amazon.com", "thumbnail.image.rakuten.co.jp"],
  },
  // Disable dynamic rendering for Capacitor compatibility
  dynamicParams: true,
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
