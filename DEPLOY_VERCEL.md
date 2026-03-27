# 🚀 Vercel 部署指南

## 快速部署

### 方法 1: Vercel CLI（推薦）

#### 步驟 1: 安裝 Vercel CLI

```bash
npm i -g vercel
```

#### 步驟 2: 登入 Vercel

```bash
vercel login
```

選擇 **GitHub** 登入

#### 步驟 3: 部署

```bash
cd web
vercel --prod
```

第一次會問你：
- **Set up and deploy?** → Yes
- **Which scope?** → 選擇你的帳號
- **Link to existing project?** → No
- **What's your project's name?** → tender-system
- **In which directory is your code located?** → ./
- **Want to override the settings?** → No

#### 步驟 4: 設定環境變數

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production
```

#### 步驟 5: 重新部署

```bash
vercel --prod
```

完成！會給你一個網址：
```
https://tender-system-xxx.vercel.app
```

---

### 方法 2: Vercel 網頁（最簡單）

1. 訪問 https://vercel.com/new
2. 登入 GitHub
3. 點擊 **Import Git Repository**
4. 選擇 **tender-system**
5. **Root Directory**: 輸入 `web`
6. 點擊 **Environment Variables**
7. 添加環境變數（見上方）
8. 點擊 **Deploy**

等待 2-3 分鐘，完成！

---

## 📊 部署後

### 訪問網址

- **生產環境**: `https://tender-system-xxx.vercel.app`
- **預覽環境**: 每次 push 都會生成預覽網址

### 自定義域名（可選）

1. 進入 Vercel Dashboard
2. 選擇項目
3. 點擊 **Settings** → **Domains**
4. 添加你的域名
5. 設定 DNS 記錄

---

## ⚙️ GitHub Actions 自動部署

### 設定自動部署

每次 push 到 main 分支自動部署：

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 設定 Vercel Token

1. 訪問 https://vercel.com/account/tokens
2. 創建新的 Token
3. 在 GitHub Secrets 添加 `VERCEL_TOKEN`

---

## 🎯 部署檢查清單

- [ ] 安裝 Vercel CLI
- [ ] 登入 Vercel
- [ ] 部署項目
- [ ] 設定環境變數
- [ ] 測試網站
- [ ] 設定自定義域名（可選）
- [ ] 設定自動部署（可選）

---

## 💡 提示

### 環境變數

**必須設定：**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

**可選：**
```env
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 構建設定

Vercel 會自動檢測 Next.js，無需額外設定。

如需自定義，創建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 🔍 故障排除

### Q: 部署失敗

**檢查：**
- 環境變數是否正確
- 依賴是否完整
- 構建錯誤訊息

**解決：**
```bash
# 本地測試構建
cd web
npm run build

# 查看詳細日誌
vercel logs
```

### Q: 網站無法訪問

**檢查：**
- 部署是否成功
- 域名是否正確
- 環境變數是否設定

### Q: API 無法使用

**檢查：**
- Serverless Function 限制
- 環境變數是否為 production
- API 路徑是否正確

---

## 📞 需要協助嗎？

告訴我：
- ✅ 部署成功
- ❌ 遇到問題（告訴我錯誤訊息）
- 🤔 需要更多指導

---

**最後更新：** 2026-03-27  
**版本：** 1.0.0
