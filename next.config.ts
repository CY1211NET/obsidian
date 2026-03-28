import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. 将 "export" 修改为 "standalone"
  output: "export",
  // basePath已被移除以适配 Cloudflare 根目录
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
