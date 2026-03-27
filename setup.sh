#!/bin/bash

# 銓宏國際 AI 標案系統 - 快速設定腳本
# 使用方法：./setup.sh

set -e

echo "🚀 銓宏國際 AI 標案系統 - 快速設定"
echo "=================================="
echo ""

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：未安裝 Node.js"
    echo "請訪問 https://nodejs.org 安裝"
    exit 1
fi

echo "✅ Node.js 已安裝：$(node --version)"

# 進入 web 目錄
cd web

# 安裝依賴
echo ""
echo "📦 安裝依賴..."
npm install

# 檢查 .env.local
if [ ! -f .env.local ]; then
    echo ""
    echo "⚙️ 創建環境變數文件..."
    cp .env.local.example .env.local 2>/dev/null || cat > .env.local << EOF
# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Telegram 設定
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# OpenAI 設定（可選）
OPENAI_API_KEY=your_openai_key

# 應用設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ .env.local 已創建"
    echo "⚠️  請編輯 .env.local 填入你的 API Keys"
else
    echo "✅ .env.local 已存在"
fi

# 返回項目根目錄
cd ..

# 創建 data 目錄
mkdir -p data

echo ""
echo "✅ 基本設定完成！"
echo ""
echo "📝 下一步："
echo ""
echo "1️⃣  設定 Supabase"
echo "   - 訪問：https://supabase.com"
echo "   - 創建項目"
echo "   - 執行 docs/DATABASE.md 中的 SQL"
echo "   - 複製 API Keys 到 web/.env.local"
echo ""
echo "2️⃣  設定 Telegram Bot"
echo "   - 在 Telegram 搜索 @BotFather"
echo "   - 創建 Bot"
echo "   - 複製 Token 和 Chat ID 到 web/.env.local"
echo ""
echo "3️⃣  啟動開發伺服器"
echo "   cd web"
echo "   npm run dev"
echo ""
echo "4️⃣  訪問 http://localhost:3000"
echo ""
echo "📚 更多文檔："
echo "   - 部署指南：docs/DEPLOYMENT.md"
echo "   - GitHub 設定：GITHUB_SETUP.md"
echo "   - 快速啟動：QUICKSTART.md"
echo ""
echo "🎉 準備就緒！"
