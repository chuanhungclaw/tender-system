# 🤖 Telegram Bot 部署指南

## 概述

已創建互動式 Telegram Bot，支援以下命令：

- `/start` - 歡迎訊息
- `/today` - 今日標案
- `/search <關鍵字>` - 搜索標案
- `/status` - 系統狀態
- `/help` - 幫助資訊

---

## 🚀 部署方式

### 方式 1: 本地開發測試（推薦先測試）

#### 步驟 1: 安裝依賴

```bash
cd web
npm install node-telegram-bot-api axios
```

#### 步驟 2: 設定環境變數

編輯 `web/.env.local`，確保有：

```env
TELEGRAM_BOT_TOKEN=8644915881:AAFqEzf_SeObMni4I_Zvq1J4r5-JtveKbdE
```

#### 步驟 3: 啟動 Bot

```bash
cd web
node ../scripts/telegram-bot.js
```

#### 步驟 4: 測試命令

在 Telegram 對你的 Bot 發送：
- `/start` - 應該收到歡迎訊息
- `/help` - 應該收到幫助資訊
- `/status` - 應該收到系統狀態

---

### 方式 2: 部署到 Vercel（生產環境）

#### 步驟 1: 創建 API Route

在 `web/src/app/api/telegram/route.ts` 創建 Webhook 處理器

#### 步驟 2: 設定 Webhook

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-domain.vercel.app/api/telegram"
```

#### 步驟 3: 部署到 Vercel

```bash
cd web
vercel --prod
```

---

### 方式 3: 部署到 Railway/Render（推薦）

#### 步驟 1: 創建 `bot-server.js`

```javascript
// 簡單的 Express 伺服器
const express = require('express')
const bot = require('./telegram-bot')

const app = express()
const PORT = process.env.PORT || 3001

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

bot.startPolling()

app.listen(PORT, () => {
  console.log(`🤖 Bot server running on port ${PORT}`)
})
```

#### 步驟 2: 部署到 Railway

1. 訪問 https://railway.app
2. 新建項目
3. 連接 GitHub 倉庫
4. 設定環境變數 `TELEGRAM_BOT_TOKEN`
5. 部署

---

## 📋 功能擴展

### 整合真實 API

修改 `commands.today` 和 `commands.search`：

```javascript
today: async (chatId) => {
  // 調用真實的 API
  const response = await axios.get('https://your-api.com/api/tenders/today')
  const tenders = response.data.tenders
  
  // 格式化並發送
  const message = formatTenders(tenders)
  await sendMessage(chatId, message)
}
```

### 添加更多命令

```javascript
commands.mybids = async (chatId) => {
  // 查看我的投標記錄
}

commands.remind = async (chatId, days) => {
  // 設定提醒
}
```

---

## 🎯 快速測試

### 立即測試 Bot

1. **啟動 Bot：**
   ```bash
   cd /root/.openclaw/workspace/projects/tender-system/web
   node ../scripts/telegram-bot.js
   ```

2. **在 Telegram 發送：**
   - `/start`
   - `/help`
   - `/status`

3. **應該收到回應**

---

## 💬 需要協助嗎？

告訴我：
- ✅ Bot 測試成功
- ❌ 遇到問題（告訴我錯誤訊息）
- 🚀 準備部署到生產環境

---

**最後更新：** 2026-03-27  
**版本：** 1.0.0
