/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用 ESLint 構建檢查
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 禁用 TypeScript 構建檢查
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 實驗性功能
  experimental: {
    // 優化構建
    optimizePackageImports: ['@supabase/supabase-js', 'axios'],
  },
  
  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 優化構建
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  
  // 圖片優化
  images: {
    unoptimized: true,
  },
  
  // 環境變數
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://tender-system.vercel.app',
  },
}

module.exports = nextConfig
