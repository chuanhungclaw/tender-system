/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 需要靜態導出
  output: 'export',
  
  // 禁用圖片優化（GitHub Pages 不支援）
  images: {
    unoptimized: true,
  },
  
  // 禁用 ESLint 構建檢查
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 禁用 TypeScript 構建檢查
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 基礎路徑（倉庫名稱）
  basePath: '/tender-system',
  
  // 資源路徑
  assetPrefix: '/tender-system/',
}

module.exports = nextConfig
