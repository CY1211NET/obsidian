import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 只在生产构建时启用静态导出，开发模式下不设置（避免 Turbopack 对中文 URL 的匹配 bug）
  ...(isProd ? { output: "export" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
