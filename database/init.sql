-- 銓宏國際 AI 標案系統 - 數據庫初始化腳本
-- 執行於 Supabase SQL Editor
-- 文檔：docs/DATABASE.md

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 標案表 (tenders)
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    
    organization_name VARCHAR(200) NOT NULL,
    organization_type VARCHAR(50),
    contact_name VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(200),
    
    description TEXT,
    category VARCHAR(100),
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'TWD',
    
    publish_date TIMESTAMP NOT NULL,
    deadline_date TIMESTAMP NOT NULL,
    delivery_date TIMESTAMP,
    
    region VARCHAR(50),
    location TEXT,
    
    ai_score DECIMAL(5,2),
    profit_score DECIMAL(5,2),
    success_rate_score DECIMAL(5,2),
    risk_score DECIMAL(5,2),
    strategic_score DECIMAL(5,2),
    resource_score DECIMAL(5,2),
    
    suggested_price_low DECIMAL(12,2),
    suggested_price_mid DECIMAL(12,2),
    suggested_price_high DECIMAL(12,2),
    estimated_profit_rate DECIMAL(5,2),
    
    risk_warnings TEXT[],
    bid_strategy TEXT,
    
    source_url TEXT,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    analyzed_at TIMESTAMP
);

CREATE INDEX idx_tenders_type ON tenders(type);
CREATE INDEX idx_tenders_status ON tenders(status);
CREATE INDEX idx_tenders_deadline ON tenders(deadline_date);
CREATE INDEX idx_tenders_ai_score ON tenders(ai_score DESC);
CREATE INDEX idx_tenders_publish_date ON tenders(publish_date DESC);

-- 2. 客戶表 (clients)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(50),
    company_size VARCHAR(20),
    website TEXT,
    
    rating DECIMAL(3,2) DEFAULT 5.00,
    payment_record TEXT,
    credit_level VARCHAR(20),
    
    total_projects INT DEFAULT 0,
    won_projects INT DEFAULT 0,
    lost_projects INT DEFAULT 0,
    total_revenue DECIMAL(14,2) DEFAULT 0,
    
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_industry ON clients(industry);
CREATE INDEX idx_clients_rating ON clients(rating DESC);

-- 3. 聯絡人表 (contacts)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    department VARCHAR(100),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    email VARCHAR(200),
    line_id VARCHAR(100),
    wechat_id VARCHAR(100),
    
    is_primary BOOLEAN DEFAULT FALSE,
    is_decision_maker BOOLEAN DEFAULT FALSE,
    
    last_contact_date TIMESTAMP,
    next_followup_date TIMESTAMP,
    followup_notes TEXT,
    
    preferred_contact_method VARCHAR(20),
    preferred_contact_time VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_client_id ON contacts(client_id);
CREATE INDEX idx_contacts_name ON contacts(name);

-- 4. 互動記錄表 (interactions)
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    tender_id UUID REFERENCES tenders(id) ON DELETE SET NULL,
    
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    interaction_date TIMESTAMP NOT NULL,
    duration_minutes INT,
    
    outcome TEXT,
    followup_required BOOLEAN DEFAULT FALSE,
    followup_date TIMESTAMP,
    
    attachments JSONB,
    
    created_by VARCHAR(100) DEFAULT 'Kevin',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_tender_id ON interactions(tender_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC);

-- 5. 投標記錄表 (bids)
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    bid_date TIMESTAMP NOT NULL,
    bid_amount DECIMAL(12,2) NOT NULL,
    bid_strategy VARCHAR(50),
    
    proposal_text TEXT,
    quotation JSONB,
    design_proposal JSONB,
    
    status VARCHAR(20) DEFAULT 'pending',
    result_date TIMESTAMP,
    result_notes TEXT,
    
    contract_amount DECIMAL(12,2),
    profit_amount DECIMAL(12,2),
    profit_rate DECIMAL(5,2),
    payment_terms TEXT,
    delivery_status VARCHAR(20),
    
    lost_reason TEXT,
    competitor_analysis TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bids_tender_id ON bids(tender_id);
CREATE INDEX idx_bids_client_id ON bids(client_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_date ON bids(bid_date DESC);

-- 6. 系統設定表 (settings)
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
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
('notification_frequency', '"daily"', '通知頻率')
ON CONFLICT (key) DO NOTHING;

-- 7. 通知記錄表 (notifications)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    
    channel VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    
    tender_ids UUID[],
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at DESC);

-- 8. 儀表板視圖 (dashboard_view)
CREATE OR REPLACE VIEW dashboard_view AS
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

-- 9. 投標統計視圖 (bid_statistics_view)
CREATE OR REPLACE VIEW bid_statistics_view AS
SELECT
    DATE_TRUNC('month', b.bid_date) AS month,
    COUNT(*) AS total_bids,
    COUNT(CASE WHEN b.status = 'won' THEN 1 END) AS won_bids,
    COUNT(CASE WHEN b.status = 'lost' THEN 1 END) AS lost_bids,
    ROUND(COUNT(CASE WHEN b.status = 'won' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS win_rate,
    SUM(CASE WHEN b.status = 'won' THEN b.contract_amount ELSE 0 END) AS total_revenue,
    AVG(CASE WHEN b.status = 'won' THEN b.profit_rate END) AS avg_profit_rate
FROM bids b
GROUP BY DATE_TRUNC('month', b.bid_date)
ORDER BY month DESC;

-- 插入測試數據（可選）
INSERT INTO tenders (tender_id, title, type, organization_name, organization_type, category, budget_min, budget_max, publish_date, deadline_date, region, ai_score, profit_score, success_rate_score, risk_score, strategic_score, resource_score, suggested_price_low, suggested_price_mid, suggested_price_high, estimated_profit_rate, status) VALUES
('TEST-001', '台積電 2026 員工福利品採購', 'corporate', '台灣積體電路製造股份有限公司', '科技業', '員工福利', 400000, 500000, NOW(), NOW() + INTERVAL '30 days', '新竹', 88.00, 28.00, 23.00, 17.00, 12.00, 8.00, 425000, 450000, 475000, 35.00, 'active'),
('TEST-002', '國泰人壽 VIP 客戶端午禮盒', 'corporate', '國泰人壽保險股份有限公司', '金融業', '節慶禮品', 250000, 350000, NOW(), NOW() + INTERVAL '25 days', '台北', 75.00, 25.00, 18.00, 16.00, 10.00, 6.00, 297500, 315000, 332500, 30.00, 'active'),
('TEST-003', '台北市環保局宣導品', 'government', '台北市政府環保局', '政府機關', '宣導品', 100000, 150000, NOW(), NOW() + INTERVAL '14 days', '台北', 68.00, 20.00, 15.00, 18.00, 8.00, 7.00, 127500, 135000, 142500, 25.00, 'active')
ON CONFLICT (tender_id) DO NOTHING;

-- 完成
SELECT '數據庫初始化完成！' AS status;
