# 🔐 GitHub Secrets 設定指南

## 快速設定

### 1. 訪問 Secrets 設定頁面
https://github.com/chuanhungclaw/tender-system/settings/secrets/actions

### 2. 添加以下 Secrets

點擊 **New repository secret**，逐一添加：

#### SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://xxxxx.supabase.co
```

#### SUPABASE_SERVICE_KEY
```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（完整金鑰）
```

#### TELEGRAM_BOT_TOKEN
```
Name: TELEGRAM_BOT_TOKEN
Value: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

#### TELEGRAM_CHAT_ID
```
Name: TELEGRAM_CHAT_ID
Value: 123456789
```

#### OPENAI_API_KEY（可選）
```
Name: OPENAI_API_KEY
Value: sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📝 取得各平台 API Keys

### Supabase
1. 訪問 https://supabase.com/dashboard
2. 選擇你的項目
3. 點擊 **Settings** → **API**
4. 複製：
   - Project URL
   - service_role key（不是 anon key！）

### Telegram Bot
1. 在 Telegram 搜索 `@BotFather`
2. 發送 `/newbot`
3. 按照提示創建 Bot
4. 複製 Bot Token
5. 發送任意訊息給你的 Bot
6. 訪問：`https://api.telegram.org/bot<TOKEN>/getUpdates`
7. 找到 `"chat":{"id":123456789}` 中的數字

### OpenAI（可選）
1. 訪問 https://platform.openai.com/api-keys
2. 點擊 **Create new secret key**
3. 複製 API Key

---

## ✅ 測試 GitHub Actions

### 手動觸發測試

1. 訪問 https://github.com/chuanhungclaw/tender-system/actions
2. 點擊 **Daily Tender Crawler & Notify**
3. 點擊 **Run workflow**
4. 選擇 **main** 分支
5. 點擊 **Run workflow**
6. 等待執行完成（約 2-3 分鐘）
7. 查看日誌確認成功

### 查看執行結果

- ✅ 成功：會顯示綠色勾號
- ❌ 失敗：點擊查看錯誤訊息
- 📱 Telegram 會收到推送訊息

---

## ⚙️ 定時任務設定

目前設定為 **每天早上 7:30（台灣時間）** 執行

如需修改時間，編輯 `.github/workflows/daily-crawler.yml`：

```yaml
on:
  schedule:
    - cron: '30 23 * * *'  # UTC 23:30 = 台灣時間 7:30
```

### Cron 表達式轉換器
https://crontab.guru/

---

## 🔧 故障排除

### Q1: Workflow 無法執行
**檢查：**
- Secrets 是否正確設定
- Branch 是否為 main
- 權限是否足夠

### Q2: Telegram 推送失敗
**檢查：**
- Bot Token 是否正確
- Chat ID 是否正確
- Bot 是否被封鎖

### Q3: Supabase 連接失敗
**檢查：**
- URL 是否包含 `https://`
- 是否使用 service_role key（不是 anon key）
- 數據庫表是否已創建

---

## 📞 需要協助？

查看完整文檔：
- [部署指南](./docs/DEPLOYMENT.md)
- [快速啟動](./QUICKSTART.md)
- [項目概述](./README.md)

---

**最後更新：** 2026-03-27  
**版本：** 1.0.0
