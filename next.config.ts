import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. 将 "export" 修改为 "standalone"
  output: "standalone",
  basePath: isProd ? "/obsidian" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
