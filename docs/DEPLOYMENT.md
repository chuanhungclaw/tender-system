# 🚀 部署指南

## 快速部署流程

### 1. 設定 Supabase 數據庫

#### 步驟 1: 創建項目
1. 訪問 https://supabase.com
2. 點擊 "New Project"
3. 填寫項目資訊：
   - Name: `tender-system`
   - Database Password: （設定強密碼）
   - Region: 選擇最近的（建議 Asia East）

#### 步驟 2: 執行數據庫 SQL
1. 進入項目後，點擊 "SQL Editor"
2. 點擊 "New query"
3. 複製並執行 `docs/DATABASE.md` 中的所有 SQL 語法
4. 確認所有數據表創建成功

#### 步驟 3: 取得 API Keys
1. 點擊 "Settings" → "API"
2. 複製以下兩個金鑰：
   - Project URL: `https://xxxxx.supabase.co`
   - anon public: `eyJhbG...`
   - service_role: `eyJhbG...`（重要！用於後端）

---

### 2. 設定 Telegram Bot

#### 步驟 1: 創建 Bot
1. 在 Telegram 搜索 `@BotFather`
2. 發送 `/newbot`
3. 按照提示設定：
   - Bot name: `銓宏標案即時報 Bot`
   - Bot username: `tender_system_bot`（需唯一）
4. 保存 Bot Token: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

#### 步驟 2: 取得 Chat ID
1. 在 Telegram 搜索你的 Bot 並啟動
2. 發送任意訊息
3. 訪問：`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. 找到 `"chat":{"id":123456789,...}` 中的數字
5. 保存 Chat ID: `123456789`

---

### 3. 設定 Vercel 部署

#### 步驟 1: 安裝 Vercel CLI（可選）
```bash
npm i -g vercel
```

#### 步驟 2: 部署到 Vercel
1. 訪問 https://vercel.com
2. 點擊 "Add New Project"
3. 選擇 "Import Git Repository"
4. 選擇你的 GitHub 倉庫
5. 設定構建配置：
   - Framework Preset: Next.js
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 步驟 3: 設定環境變數
在 Vercel 項目設定中添加：
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
TELEGRAM_CHAT_ID=123456789
OPENAI_API_KEY=sk-...
```

#### 步驟 4: 部署
```bash
cd web
vercel --prod
```

---

### 4. 設定 GitHub Actions（定時任務）

#### 步驟 1: 設定 GitHub Secrets
1. 進入 GitHub 倉庫
2. 點擊 "Settings" → "Secrets and variables" → "Actions"
3. 點擊 "New repository secret"
4. 添加以下 Secrets：

```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY = eyJhbG...
TELEGRAM_BOT_TOKEN = 1234567890:ABCdef...
TELEGRAM_CHAT_ID = 123456789
OPENAI_API_KEY = sk-...
```

#### 步驟 2: 啟用 Workflow
1. 點擊 "Actions"
2. 找到 "Daily Tender Crawler & Notify"
3. 點擊 "Enable workflow"
4. 可以點擊 "Run workflow" 測試

---

### 5. 本地開發環境設定

#### 步驟 1: 複製環境變數文件
```bash
cd web
cp .env.local.example .env.local
```

#### 步驟 2: 填寫環境變數
編輯 `.env.local`：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
TELEGRAM_CHAT_ID=123456789

OPENAI_API_KEY=sk-...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 步驟 3: 啟動開發伺服器
```bash
npm run dev
```

訪問 http://localhost:3000

---

## 🔧 測試清單

### 上線前測試

- [ ] Supabase 數據庫連接正常
- [ ] 所有數據表已創建
- [ ] API 接口可以正常訪問
- [ ] Telegram Bot 可以發送訊息
- [ ] 爬蟲腳本可以執行
- [ ] 定時任務設定正確
- [ ] 前端頁面顯示正常
- [ ] 手機版響應式設計正常

### 測試命令

```bash
# 測試爬蟲
npm run crawl

# 測試推送
npm run notify

# 測試完整流程
npm run cron:daily
```

---

## 📊 監控與維護

### 日誌查看

#### Vercel 日誌
1. 訪問 Vercel Dashboard
2. 選擇項目
3. 點擊 "Activity" 查看部署日誌
4. 點擊 "Functions" 查看 API 日誌

#### Supabase 日誌
1. 進入 Supabase Dashboard
2. 點擊 "Logs"
3. 查看數據庫查詢日誌

#### GitHub Actions 日誌
1. 進入 GitHub 倉庫
2. 點擊 "Actions"
3. 選擇 workflow 查看執行日誌

### 備份策略

#### 數據庫備份
- Supabase 自動備份（每日）
- 手動導出：pg_dump 工具

#### 代碼備份
- GitHub 自動版本控制
- 定期本地備份

---

## ⚠️ 常見問題

### Q1: Telegram 推送失敗
**檢查：**
- Bot Token 是否正確
- Chat ID 是否正確
- Bot 是否被封鎖

**解決：**
```bash
# 測試 Bot
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

### Q2: Supabase 連接失敗
**檢查：**
- URL 是否正確（包含 https://）
- API Key 是否正確
- 網絡連接是否正常

### Q3: 爬蟲無法執行
**檢查：**
- Node.js 版本 >= 18
- 依賴是否安裝完整
- 文件路徑是否正確

---

## 📞 技術支援

### 文檔
- [項目概述](./docs/README.md)
- [數據庫設計](./docs/DATABASE.md)
- [API 接口](./docs/API.md)
- [系統架構](./docs/ARCHITECTURE.md)
- [快速啟動](./QUICKSTART.md)

### 外部資源
- [Next.js 文檔](https://nextjs.org/docs)
- [Supabase 文檔](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Vercel 文檔](https://vercel.com/docs)

---

**最後更新：** 2026-03-27  
**版本：** 1.0.0
