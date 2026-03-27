/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 需要靜態導出
  output: 'export',
  
  // 禁用圖片優化（GitHub Pages 不支援）
  images: {
    unoptimized: true,
  },
  
  // 禁用 TypeScript 構建檢查
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 基礎路徑（倉庫名稱）
  basePath: '/tender-system',
  
  // 資源路徑
  assetPrefix: '/tender-system/',
  
  // 環境變數（用於構建時）
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  },
}

module.exports = nextConfig
