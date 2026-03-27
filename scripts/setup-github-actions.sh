#!/bin/bash

# GitHub Actions 自動設定腳本
# 使用方法：./setup-github-actions.sh

echo "🚀 開始設定 GitHub Actions..."

# 檢查是否在正確的目錄
if [ ! -f "web/package.json" ]; then
    echo "❌ 錯誤：請在項目根目錄執行此腳本"
    exit 1
fi

# 創建 workflow 目錄
mkdir -p .github/workflows

# 創建 workflow 文件
cat > .github/workflows/daily-crawler.yml << 'EOF'
name: Daily Tender Crawler & Notify

on:
  schedule:
    # 每天早上 7:30 執行（台灣時間）
    - cron: '30 23 * * *'
  workflow_dispatch:

jobs:
  crawler-and-notify:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        run: |
          cd web
          npm ci

      - name: Run crawler
        run: |
          cd web
          npm run crawl
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}

      - name: Send Telegram notification
        run: |
          cd web
          npm run notify
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
EOF

echo "✅ Workflow 文件已創建"

# 提交並推送
git add .github
git commit -m "feat: 添加 GitHub Actions 定時任務"
git push origin main

echo ""
echo "✅ GitHub Actions 設定完成！"
echo ""
echo "📝 下一步：在 GitHub 上設定 Secrets"
echo "1. 訪問：https://github.com/chuanhungclaw/tender-system/settings/secrets/actions"
echo "2. 添加以下 Secrets："
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_KEY"
echo "   - TELEGRAM_BOT_TOKEN"
echo "   - TELEGRAM_CHAT_ID"
echo "   - OPENAI_API_KEY (可選)"
echo ""
echo "🎉 完成！系統會每天早上 7:30 自動執行！"
