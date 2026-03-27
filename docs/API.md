# API 接口設計文檔

## 基礎資訊

**Base URL:** `/api`  
**認證方式:** JWT Token (Supabase Auth)  
**回應格式:** JSON

---

## 🔐 認證接口

### POST /api/auth/login
用戶登入

**請求：**
```json
{
  "email": "kevin@chuanhong.com",
  "password": "******"
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "kevin@chuanhong.com",
      "name": "Kevin"
    },
    "token": "jwt_token_here"
  }
}
```

---

## 📊 儀表板接口

### GET /api/dashboard
獲取儀表板數據

**參數：**
- `date` (optional): 日期，格式 YYYY-MM-DD，預設為今天

**回應：**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_tenders": 13,
      "recommended_tenders": 3,
      "pending_bids": 8,
      "won_bids_this_month": 2,
      "total_revenue_this_month": 850000
    },
    "recommended_tenders": [
      {
        "id": "uuid",
        "title": "台積電 2026 員工福利品採購",
        "organization": "台灣積體電路製造股份有限公司",
        "budget": 500000,
        "deadline": "2026-04-20T17:00:00Z",
        "ai_score": 88,
        "success_rate": 78
      }
    ],
    "upcoming_deadlines": [
      {
        "id": "uuid",
        "title": "台北市環保局宣導品",
        "deadline": "2026-03-30T17:00:00Z",
        "days_remaining": 3
      }
    ],
    "statistics": {
      "tender_trend": [...],
      "industry_distribution": {...}
    }
  }
}
```

---

## 📋 標案接口

### GET /api/tenders
獲取標案列表

**參數：**
- `type` (optional): 標案類型 `government|corporate`
- `status` (optional): 狀態 `active|closed|awarded`
- `category` (optional): 產品類別
- `region` (optional): 地區
- `min_budget` (optional): 最小預算
- `max_budget` (optional): 最大預算
- `min_score` (optional): 最小 AI 評分
- `keyword` (optional): 關鍵字搜索
- `page` (optional): 頁碼，預設 1
- `limit` (optional): 每頁數量，預設 20

**回應：**
```json
{
  "success": true,
  "data": {
    "tenders": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}
```

---

### GET /api/tenders/:id
獲取標案詳情

**回應：**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tender_id": "T2026-001",
    "title": "台積電 2026 員工福利品採購",
    "type": "corporate",
    "status": "active",
    "organization_name": "台灣積體電路製造股份有限公司",
    "contact": {
      "name": "王小姐",
      "phone": "03-xxxx-xxxx",
      "email": "wang@tsmc.com"
    },
    "description": "...",
    "category": "員工福利/禮贈品",
    "budget": {
      "min": 400000,
      "max": 500000,
      "currency": "TWD"
    },
    "dates": {
      "publish": "2026-03-25T09:00:00Z",
      "deadline": "2026-04-20T17:00:00Z",
      "delivery": "2026-05-15T00:00:00Z"
    },
    "location": {
      "region": "新竹",
      "address": "新竹科學園區..."
    },
    "ai_analysis": {
      "score": 88,
      "breakdown": {
        "profit": 28,
        "success_rate": 23,
        "risk": 17,
        "strategic": 12,
        "resource": 8
      },
      "suggested_prices": {
        "low": 425000,
        "mid": 450000,
        "high": 475000
      },
      "estimated_profit_rate": 35,
      "risk_warnings": [
        "該機關付款週期 60 天（較長）",
        "驗收標準嚴格，需注重品質"
      ],
      "bid_strategy": "1. 強調 ISO 認證供應鏈..."
    },
    "attachments": [...]
  }
}
```

---

### POST /api/tenders/:id/bid
創建投標記錄

**請求：**
```json
{
  "bid_amount": 450000,
  "bid_strategy": "balanced",
  "proposal_text": "...",
  "quotation": {...},
  "design_proposal": {...}
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tender_id": "uuid",
    "bid_amount": 450000,
    "status": "pending",
    "created_at": "2026-03-27T10:00:00Z"
  }
}
```

---

### PUT /api/tenders/:id/watch
切換標案追蹤狀態

**請求：**
```json
{
  "watching": true
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "watching": true
  }
}
```

---

## 👥 客戶管理接口

### GET /api/clients
獲取客戶列表

**參數：**
- `industry` (optional): 產業類別
- `min_rating` (optional): 最小評分
- `keyword` (optional): 關鍵字搜索

**回應：**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": "uuid",
        "company_name": "台灣積體電路製造股份有限公司",
        "industry": "科技業",
        "rating": 4.8,
        "total_projects": 5,
        "won_projects": 3,
        "total_revenue": 1500000
      }
    ]
  }
}
```

---

### GET /api/clients/:id
獲取客戶詳情

**回應：**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company_name": "...",
    "industry": "科技業",
    "rating": 4.8,
    "contacts": [...],
    "interactions": [...],
    "bids": [...]
  }
}
```

---

### POST /api/clients
創建新客戶

**請求：**
```json
{
  "company_name": "公司名稱",
  "industry": "科技業",
  "website": "https://...",
  "tags": ["重要客戶", "科技業"]
}
```

---

### PUT /api/clients/:id
更新客戶資訊

---

### DELETE /api/clients/:id
刪除客戶

---

## 📞 聯絡人接口

### GET /api/clients/:client_id/contacts
獲取客戶聯絡人列表

---

### POST /api/clients/:client_id/contacts
新增聯絡人

**請求：**
```json
{
  "name": "王小明",
  "title": "採購經理",
  "department": "採購部",
  "phone": "02-xxxx-xxxx",
  "email": "wang@example.com",
  "is_primary": true
}
```

---

## 💬 互動記錄接口

### GET /api/contacts/:contact_id/interactions
獲取互動記錄列表

---

### POST /api/contacts/:contact_id/interactions
新增互動記錄

**請求：**
```json
{
  "type": "meeting",
  "title": "初次拜訪",
  "description": "...",
  "interaction_date": "2026-03-27T14:00:00Z",
  "duration_minutes": 60,
  "outcome": "客戶對產品感興趣",
  "followup_required": true,
  "followup_date": "2026-04-03T10:00:00Z"
}
```

---

## 📈 報表接口

### GET /api/reports/bid-statistics
獲取投標統計

**參數：**
- `start_date`: 開始日期
- `end_date`: 結束日期
- `group_by`: 分組方式 `month|week|industry`

**回應：**
```json
{
  "success": true,
  "data": {
    "total_bids": 25,
    "won_bids": 8,
    "win_rate": 32,
    "total_revenue": 2500000,
    "avg_profit_rate": 28.5,
    "by_month": [...],
    "by_industry": [...]
  }
}
```

---

### GET /api/reports/profit-analysis
獲取利潤分析

---

### GET /api/reports/industry-analysis
獲取產業分析

---

## ⚙️ 系統設定接口

### GET /api/settings
獲取系統設定

**回應：**
```json
{
  "success": true,
  "data": {
    "search_keywords": ["紀念品", "獎盃", "..."],
    "budget_range": {"min": 30000, "max": 10000000},
    "regions": ["全台"],
    "industries": ["科技業", "金融業", "..."],
    "notification_time": "08:00",
    "notification_channel": "telegram",
    "notification_frequency": "daily"
  }
}
```

---

### PUT /api/settings
更新系統設定

**請求：**
```json
{
  "search_keywords": ["...", "..."],
  "notification_time": "08:00"
}
```

---

## 🔔 通知接口

### GET /api/notifications
獲取通知列表

**參數：**
- `status` (optional): `pending|sent|failed`
- `type` (optional): `daily_report|urgent|deadline_reminder`

---

### POST /api/notifications/test
發送測試通知

**請求：**
```json
{
  "channel": "telegram"
}
```

---

## 📎 文件上傳接口

### POST /api/upload
上傳文件

**請求：** multipart/form-data

**回應：**
```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "filename": "example.pdf",
    "size": 1024000
  }
}
```

---

## ❌ 錯誤回應格式

```json
{
  "success": false,
  "error": {
    "code": "TENDER_NOT_FOUND",
    "message": "標案不存在",
    "details": {...}
  }
}
```

### 錯誤代碼列表

| 代碼 | 說明 | HTTP 狀態 |
|------|------|---------|
| `UNAUTHORIZED` | 未授權 | 401 |
| `FORBIDDEN` | 禁止訪問 | 403 |
| `NOT_FOUND` | 資源不存在 | 404 |
| `VALIDATION_ERROR` | 驗證錯誤 | 400 |
| `DUPLICATE` | 重複數據 | 409 |
| `SERVER_ERROR` | 伺服器錯誤 | 500 |

---

## 📝 版本記錄

| 版本 | 日期 | 說明 |
|------|------|------|
| 1.0.0 | 2026-03-27 | 初始版本，API 設計完成 |
