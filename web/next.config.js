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
  
  // 靜態導出（可選，如果需要 GitHub Pages）
  // output: 'export',
  
  // 圖片優化
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
