# 快速啟動指南

## 🚀 開發環境設定

### 1. 安裝必要工具

```bash
# 安裝 Node.js (v18+)
# 訪問 https://nodejs.org 下載安裝

# 驗證安裝
node --version
npm --version

# 安裝 Git
git --version
```

---

### 2. 初始化 Next.js 項目

```bash
# 進入項目目錄
cd /root/.openclaw/workspace/projects/tender-system

# 創建 Next.js 項目
npx create-next-app@latest web --typescript --tailwind --app

# 進入 web 目錄
cd web
```

---

### 3. 安裝依賴

```bash
# 安裝必要依賴
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install chart.js react-chartjs-2
npm install date-fns
npm install lucide-react
npm install axios

# 安裝開發依賴
npm install -D @types/node @types/react
```

---

### 4. 設定 Supabase

1. 訪問 https://supabase.com 註冊帳號
2. 創建新項目 `tender-system`
3. 取得專案資訊：
   - Project URL
   - Anon Key (public)
   - Service Role Key (private)

4. 建立 `.env.local` 文件：

```bash
# web/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# AI API
OPENAI_API_KEY=your_openai_api_key
```

---

### 5. 建立數據庫

在 Supabase SQL Editor 執行：

```sql
-- 執行 DATABASE.md 中的 SQL 語法
-- 建立所有數據表和索引
```

---

### 6. 啟動開發伺服器

```bash
# 在 web 目錄
npm run dev

# 訪問 http://localhost:3000
```

---

## 📁 項目結構

```
tender-system/
├── docs/                      # 文檔
│   ├── README.md             # 項目概述
│   ├── DATABASE.md           # 數據庫設計
│   └── API.md                # API 接口設計
├── web/                       # Next.js 前端
│   ├── app/                  # App Router 頁面
│   │   ├── page.tsx          # 儀表板
│   │   ├── tenders/          # 標案頁面
│   │   ├── clients/          # 客戶管理
│   │   └── settings/         # 系統設定
│   ├── components/           # React 組件
│   │   ├── ui/              # 基礎 UI 組件
│   │   ├── tender/          # 標案相關組件
│   │   └── chart/           # 圖表組件
│   ├── lib/                 # 工具函數
│   │   ├── supabase.ts      # Supabase 客戶端
│   │   ├── api.ts           # API 調用
│   │   └── utils.ts         # 通用工具
│   └── .env.local           # 環境變數
├── scripts/                   # 腳本
│   ├── crawler/             # 爬蟲腳本
│   └── notification/        # 通知腳本
└── PROGRESS.md              # 項目進度
```

---

## 🤖 AI 助理協助事項

### 我可以幫你：

1. **代碼生成**
   - React 組件
   - API 接口
   - 數據庫查詢
   - 工具函數

2. **代碼審查**
   - Bug 檢測
   - 效能優化
   - 最佳實踐建議

3. **問題解答**
   - 技術問題
   - 架構決策
   - 除錯協助

4. **自動化任務**
   - 標案搜索
   - 數據分析
   - 報告生成

---

## 📋 開發清單

### 第 1 週 (2026-03-27 - 2026-04-02)

- [ ] 環境設定完成
- [ ] Supabase 數據庫建立
- [ ] 基礎組件庫建立
- [ ] 儀表板頁面完成
- [ ] 標案列表頁面完成

### 第 2 週 (2026-04-03 - 2026-04-09)

- [ ] 標案詳情頁面完成
- [ ] CRM 客戶管理完成
- [ ] API 接口完成
- [ ] 數據採集爬蟲完成

### 第 3 週 (2026-04-10 - 2026-04-16)

- [ ] AI 分析引擎整合
- [ ] Telegram 推送整合
- [ ] 投標功能完成
- [ ] 報表分析完成

### 第 4 週 (2026-04-17 - 2026-04-23)

- [ ] 測試與優化
- [ ] 部署上線
- [ ] 用戶培訓

---

## 🆘 常見問題

### Q: 如何請求 AI 協助？

A: 直接在對話中告訴我你需要什麼，例如：
- 「幫我建立儀表板組件」
- 「寫一個標案搜索 API」
- 「幫我除錯這段代碼」

### Q: 如何查看項目進度？

A: 查看 `PROGRESS.md` 文件

### Q: 如何修改需求？

A: 直接告訴我，我會更新相關文檔

---

## 📞 聯絡資訊

**開發團隊：** Kevin + Amy  
**項目倉庫：** `/root/.openclaw/workspace/projects/tender-system`  
**開始日期：** 2026-03-27  
**預計上線：** 2026-04-24

---

**準備好了嗎？告訴我你想從哪裡開始，我馬上幫你！🚀**
