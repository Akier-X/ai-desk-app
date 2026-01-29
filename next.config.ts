import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["m.media-amazon.com", "thumbnail.image.rakuten.co.jp"],
  },
};

export default nextConfig;
