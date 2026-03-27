/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生產環境使用 SSR（Vercel 支援）
  // output: 'export', // 僅 GitHub Pages 需要，註解掉
  
  // 圖片優化
  images: {
    unoptimized: false, // Vercel 支援圖片優化
  },
  
  // 禁用 ESLint 構建檢查
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 禁用 TypeScript 構建檢查
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
