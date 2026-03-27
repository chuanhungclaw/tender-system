# 數據庫設計文檔

## 數據庫：tender_system

---

## 📊 數據表結構

### 1. 標案表 (tenders)

```sql
CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id VARCHAR(50) UNIQUE NOT NULL,        -- 標案編號
    title VARCHAR(500) NOT NULL,                   -- 標案標題
    type VARCHAR(20) NOT NULL,                     -- 類型：government/corporate
    status VARCHAR(20) DEFAULT 'active',           -- 狀態：active/closed/awarded
    
    -- 招標單位資訊
    organization_name VARCHAR(200) NOT NULL,       -- 招標單位名稱
    organization_type VARCHAR(50),                 -- 單位類型：政府機關/科技業/金融業等
    contact_name VARCHAR(100),                     -- 聯絡人姓名
    contact_phone VARCHAR(50),                     -- 聯絡人電話
    contact_email VARCHAR(200),                    -- 聯絡人 Email
    
    -- 標案內容
    description TEXT,                              -- 標案描述
    category VARCHAR(100),                         -- 產品類別：紀念品/獎盃/宣導品等
    budget_min DECIMAL(12,2),                      -- 預算下限
    budget_max DECIMAL(12,2),                      -- 預算上限
    currency VARCHAR(10) DEFAULT 'TWD',            -- 幣別
    
    -- 時間資訊
    publish_date TIMESTAMP NOT NULL,               -- 公告日期
    deadline_date TIMESTAMP NOT NULL,              -- 截止投標日期
    delivery_date TIMESTAMP,                       -- 預計交貨日期
    
    -- 地區資訊
    region VARCHAR(50),                            -- 地區：台北/台中/高雄/全台
    location TEXT,                                 -- 詳細地址
    
    -- AI 分析結果
    ai_score DECIMAL(5,2),                         -- 綜合評分 (0-100)
    profit_score DECIMAL(5,2),                     -- 利潤潛力評分 (0-30)
    success_rate_score DECIMAL(5,2),               -- 得標機率評分 (0-25)
    risk_score DECIMAL(5,2),                       -- 履約風險評分 (0-20)
    strategic_score DECIMAL(5,2),                  -- 戰略價值評分 (0-15)
    resource_score DECIMAL(5,2),                   -- 資源匹配評分 (0-10)
    
    -- 報價建議
    suggested_price_low DECIMAL(12,2),             -- 低標策略報價
    suggested_price_mid DECIMAL(12,2),             -- 平衡策略報價
    suggested_price_high DECIMAL(12,2),            -- 利潤策略報價
    estimated_profit_rate DECIMAL(5,2),            -- 預估利潤率 (%)
    
    -- 風險提示
    risk_warnings TEXT[],                          -- 風險提示列表
    
    -- 投標建議
    bid_strategy TEXT,                             -- 投標策略建議
    
    -- 系統資訊
    source_url TEXT,                               -- 原始連結
    attachments JSONB,                             -- 附件列表
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    analyzed_at TIMESTAMP                          -- AI 分析時間
);

-- 索引
CREATE INDEX idx_tenders_type ON tenders(type);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tenders_deadline ON tenders(deadline_date);
CREATE INDEX idx_tenders_ai_score ON tenders(ai_score DESC);
CREATE INDEX idx_tenders_publish_date ON tenders(publish_date DESC);
```

---

### 2. 客戶表 (clients)

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,            -- 公司名稱
    industry VARCHAR(50),                          -- 產業類別
    company_size VARCHAR(20),                      -- 公司規模
    website TEXT,                                  -- 公司網站
    
    -- 評分
    rating DECIMAL(3,2) DEFAULT 5.00,              -- 客戶評分 (0-5)
    payment_record TEXT,                           -- 付款記錄說明
    credit_level VARCHAR(20),                      -- 信用等級：A/B/C/D
    
    -- 統計資訊
    total_projects INT DEFAULT 0,                  -- 總合作案數
    won_projects INT DEFAULT 0,                    -- 得標案數
    lost_projects INT DEFAULT 0,                   -- 失標案數
    total_revenue DECIMAL(14,2) DEFAULT 0,         -- 總營收
    
    -- 系統資訊
    tags TEXT[],                                   -- 標籤
    notes TEXT,                                    -- 備註
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_clients_industry ON clients(industry);
CREATE INDEX idx_clients_rating ON clients(rating DESC);
```

---

### 3. 聯絡人表 (contacts)

```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,                    -- 姓名
    title VARCHAR(100),                            -- 職稱
    department VARCHAR(100),                       -- 部門
    phone VARCHAR(50),                             -- 電話
    mobile VARCHAR(50),                            -- 手機
    email VARCHAR(200),                            -- Email
    line_id VARCHAR(100),                          -- Line ID
    wechat_id VARCHAR(100),                        -- 微信 ID
    
    is_primary BOOLEAN DEFAULT FALSE,              -- 是否為主要聯絡人
    is_decision_maker BOOLEAN DEFAULT FALSE,       -- 是否為決策者
    
    -- 跟進資訊
    last_contact_date TIMESTAMP,                   -- 最後聯繫日期
    next_followup_date TIMESTAMP,                  -- 下次跟進日期
    followup_notes TEXT,                           -- 跟進備註
    
    -- 偏好
    preferred_contact_method VARCHAR(20),          -- 偏好聯繫方式
    preferred_contact_time VARCHAR(50),            -- 偏好聯繫時間
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_contacts_client_id ON contacts(client_id);
CREATE INDEX idx_contacts_name ON contacts(name);
```

---

### 4. 互動記錄表 (interactions)

```sql
CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
    
    type VARCHAR(50) NOT NULL,                     -- 類型：meeting/call/email/message/sample
    title VARCHAR(200) NOT NULL,                   -- 互動標題
    description TEXT,                              -- 互動內容
    
    -- 時間資訊
    interaction_date TIMESTAMP NOT NULL,           -- 互動日期
    duration_minutes INT,                          -- 持續時間（分鐘）
    
    -- 結果
    outcome TEXT,                                  -- 互動結果
    followup_required BOOLEAN DEFAULT FALSE,       -- 是否需要跟進
    followup_date TIMESTAMP,                       -- 跟進日期
    
    -- 附件
    attachments JSONB,                             -- 附件列表
    
    created_by VARCHAR(100) DEFAULT 'Kevin',       -- 記錄人
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_tender_id ON interactions(tender_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC);
```

---

### 5. 投標記錄表 (bids)

```sql
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- 投標資訊
    bid_date TIMESTAMP NOT NULL,                   -- 投標日期
    bid_amount DECIMAL(12,2) NOT NULL,             -- 投標金額
    bid_strategy VARCHAR(50),                      -- 投標策略：low/balanced/high
    
    -- 投標內容
    proposal_text TEXT,                            -- 投標計畫書內容
    quotation JSONB,                               -- 報價單內容
    design_proposal JSONB,                         -- 設計提案
    
    -- 結果
    status VARCHAR(20) DEFAULT 'pending',          -- 狀態：pending/won/lost/withdrawn
    result_date TIMESTAMP,                         -- 結果公告日期
    result_notes TEXT,                             -- 結果說明
    
    -- 得標後資訊
    contract_amount DECIMAL(12,2),                 -- 合約金額
    profit_amount DECIMAL(12,2),                   -- 實際利潤
    profit_rate DECIMAL(5,2),                      -- 實際利潤率
    payment_terms TEXT,                            -- 付款條件
    delivery_status VARCHAR(20),                   -- 交貨狀態
    
    -- 失標分析
    lost_reason TEXT,                              -- 失標原因
    competitor_analysis TEXT,                      -- 競爭對手分析
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_bids_tender_id ON bids(tender_id);
CREATE INDEX idx_bids_client_id ON bids(client_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_date ON bids(bid_date DESC);
```

---

### 6. 系統設定表 (settings)

```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,              -- 設定鍵
    value JSONB NOT NULL,                          -- 設定值
    description TEXT,                              -- 設定說明
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 初始設定
INSERT INTO settings (key, value, description) VALUES
('search_keywords', '["紀念品", "獎盃", "宣導品", "隨身碟", "環保袋", "保溫杯", "行動電源", "禮品", "贈品"]', '搜索關鍵字'),
('budget_range', '{"min": 30000, "max": 10000000}', '預算範圍'),
('regions', '["全台"]', '地區限制'),
('industries', '["科技業", "金融業", "傳產", "零售", "醫療", "房地產", "汽車"]', '目標產業'),
('notification_time', '"08:00"', '通知時間'),
('notification_channel', '"telegram"', '通知頻道'),
('notification_frequency', '"daily"', '通知頻率');
```

---

### 7. 通知記錄表 (notifications)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,                 -- 用戶 ID
    type VARCHAR(50) NOT NULL,                     -- 類型：daily_report/urgent/deadline_reminder
    title VARCHAR(200) NOT NULL,                   -- 通知標題
    content TEXT NOT NULL,                         -- 通知內容
    
    -- 發送資訊
    channel VARCHAR(50) NOT NULL,                  -- 頻道：telegram/email/line
    sent_at TIMESTAMP,                             -- 發送時間
    status VARCHAR(20) DEFAULT 'pending',          -- 狀態：pending/sent/failed
    error_message TEXT,                            -- 錯誤訊息
    
    -- 相關標案
    tender_ids UUID[],                             -- 相關標案 ID 列表
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at DESC);
```

---

## 🔗 數據表關係

```
clients (1) ──< contacts (1) ──< interactions
   │                              │
   │                              │
   └────────< bids >─────────────┘
                │
                │
             tenders
```

---

## 📈 視圖設計

### 1. 儀表板視圖 (dashboard_view)

```sql
CREATE VIEW dashboard_view AS
SELECT
    COUNT(DISTINCT t.id) AS total_tenders,
    COUNT(DISTINCT CASE WHEN t.ai_score >= 80 THEN t.id END) AS recommended_tenders,
    COUNT(DISTINCT b.id) AS total_bids,
    COUNT(DISTINCT CASE WHEN b.status = 'won' THEN b.id END) AS won_bids,
    COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END) AS pending_bids,
    SUM(CASE WHEN b.status = 'won' THEN b.contract_amount ELSE 0 END) AS total_revenue,
    AVG(CASE WHEN b.status = 'won' THEN b.profit_rate END) AS avg_profit_rate
FROM tenders t
LEFT JOIN bids b ON t.id = b.tender_id
WHERE t.status = 'active' OR b.status IN ('pending', 'won');
```

### 2. 投標統計視圖 (bid_statistics_view)

```sql
CREATE VIEW bid_statistics_view AS
SELECT
    DATE_TRUNC('month', b.bid_date) AS month,
    COUNT(*) AS total_bids,
    COUNT(CASE WHEN b.status = 'won' THEN 1 END) AS won_bids,
    COUNT(CASE WHEN b.status = 'lost' THEN 1 END) AS lost_bids,
    ROUND(COUNT(CASE WHEN b.status = 'won' THEN 1 END) * 100.0 / COUNT(*), 2) AS win_rate,
    SUM(CASE WHEN b.status = 'won' THEN b.contract_amount ELSE 0 END) AS total_revenue,
    AVG(CASE WHEN b.status = 'won' THEN b.profit_rate END) AS avg_profit_rate
FROM bids b
GROUP BY DATE_TRUNC('month', b.bid_date)
ORDER BY month DESC;
```

---

## 🔐 權限設定

```sql
-- 創建角色
CREATE ROLE tender_user;
CREATE ROLE tender_admin;

-- 授予權限
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO tender_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tender_admin;

-- 預設用戶為 admin
-- 實際部署時需設定 Supabase 認證
```

---

## 📝 版本記錄

| 版本 | 日期 | 說明 |
|------|------|------|
| 1.0.0 | 2026-03-27 | 初始版本，數據庫設計完成 |
