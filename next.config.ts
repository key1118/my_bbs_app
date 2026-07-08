import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 👈 10MBに拡張
    },
  },
  // 👇 画像の設定をここに追加
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "8behweyple2zbt0b.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;