#!/usr/bin/env node

/**
 * 標案數據採集爬蟲
 * 
 * 功能：
 * 1. 從政府電子採購網抓取標案
 * 2. 從企業採購平台抓取標案
 * 3. 數據清洗與標準化
 * 4. 存入數據庫
 * 
 * 執行：npm run crawl
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')

// 禮贈品相關關鍵字
const KEYWORDS = [
  '紀念品',
  '獎盃',
  '獎牌',
  '宣導品',
  '隨身碟',
  '環保袋',
  '保溫杯',
  '行動電源',
  '禮品',
  '贈品',
  '客製化',
  '員工福利',
  '客戶禮品'
]

// 政府電子採購網 API（模擬）
const PCC_API_BASE = 'https://web.pcc.gov.tw/tps/pss/tender.do'

// 模擬標案數據（實際應該從網站爬取）
function generateMockTenders() {
  const tenders = []
  
  // 政府標案
  tenders.push({
    tender_id: `PCC-${Date.now()}-1`,
    title: '台北市環保局 2026 年宣導品採購',
    type: 'government',
    organization_name: '台北市政府環保局',
    organization_type: '政府機關',
    category: '宣導品',
    budget_min: 100000,
    budget_max: 150000,
    currency: 'TWD',
    publish_date: new Date().toISOString(),
    deadline_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    region: '台北',
    description: '環保宣導品一批，包含環保袋、隨身碟、保溫杯等',
    status: 'active'
  })

  tenders.push({
    tender_id: `PCC-${Date.now()}-2`,
    title: '台中市政府 紀念品訂製採購',
    type: 'government',
    organization_name: '台中市政府',
    organization_type: '政府機關',
    category: '紀念品',
    budget_min: 200000,
    budget_max: 300000,
    currency: 'TWD',
    publish_date: new Date().toISOString(),
    deadline_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    region: '台中',
    description: '城市紀念品訂製，包含獎盃、獎牌、紀念章等',
    status: 'active'
  })

  // 民間標案
  tenders.push({
    tender_id: `CORP-${Date.now()}-1`,
    title: '台積電 2026 員工福利品採購',
    type: 'corporate',
    organization_name: '台灣積體電路製造股份有限公司',
    organization_type: '科技業',
    category: '員工福利',
    budget_min: 400000,
    budget_max: 500000,
    currency: 'TWD',
    publish_date: new Date().toISOString(),
    deadline_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    region: '新竹',
    description: '員工福利品，包含行動電源、保溫杯、隨身碟等',
    status: 'active'
  })

  tenders.push({
    tender_id: `CORP-${Date.now()}-2`,
    title: '國泰人壽 VIP 客戶端午禮盒',
    type: 'corporate',
    organization_name: '國泰人壽保險股份有限公司',
    organization_type: '金融業',
    category: '節慶禮品',
    budget_min: 250000,
    budget_max: 350000,
    currency: 'TWD',
    publish_date: new Date().toISOString(),
    deadline_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    region: '台北',
    description: '端午節客戶禮品，包含粽子禮盒、定制小物等',
    status: 'active'
  })

  tenders.push({
    tender_id: `CORP-${Date.now()}-3`,
    title: '聯發科年會紀念品採購',
    type: 'corporate',
    organization_name: '聯發科技股份有限公司',
    organization_type: '科技業',
    category: '紀念品',
    budget_min: 300000,
    budget_max: 400000,
    currency: 'TWD',
    publish_date: new Date().toISOString(),
    deadline_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    region: '新竹',
    description: '公司年會紀念品，包含獎盃、紀念品等',
    status: 'active'
  })

  return tenders
}

// AI 分析引擎（模擬）
function analyzeTender(tender) {
  // 利潤潛力評分（0-30）
  const profitScore = Math.min(30, Math.floor((tender.budget_max / 100000) * 6))
  
  // 得標機率評分（0-25）
  const successRateScore = Math.floor(Math.random() * 10 + 15)
  
  // 履約風險評分（0-20）
  const riskScore = Math.floor(Math.random() * 5 + 15)
  
  // 戰略價值評分（0-15）
  const strategicScore = tender.type === 'corporate' ? 12 : 10
  
  // 資源匹配評分（0-10）
  const resourceScore = Math.floor(Math.random() * 3 + 7)
  
  const aiScore = profitScore + successRateScore + riskScore + strategicScore + resourceScore
  
  // 報價建議
  const suggestedPrices = {
    low: Math.floor(tender.budget_max * 0.85),
    mid: Math.floor(tender.budget_max * 0.90),
    high: Math.floor(tender.budget_max * 0.95)
  }
  
  // 預估利潤率
  const estimatedProfitRate = Math.floor(Math.random() * 15 + 25)
  
  // 風險提示
  const riskWarnings = []
  if (tender.type === 'government') {
    riskWarnings.push('政府標案驗收標準嚴格，需注重品質')
    riskWarnings.push('付款週期約 30-60 天')
  }
  if (tender.budget_max > 500000) {
    riskWarnings.push('大金額標案競爭激烈')
  }
  
  // 投標策略
  const bidStrategy = `1. 強調設計能力與客製化經驗
2. 提供過往${tender.organization_type}案例
3. 主動提出免費打樣服務
4. 報價建議落在${(suggestedPrices.mid / 10000).toFixed(0)}萬最有競爭力`

  return {
    ai_score: aiScore,
    profit_score: profitScore,
    success_rate_score: successRateScore,
    risk_score: riskScore,
    strategic_score: strategicScore,
    resource_score: resourceScore,
    suggested_price_low: suggestedPrices.low,
    suggested_price_mid: suggestedPrices.mid,
    suggested_price_high: suggestedPrices.high,
    estimated_profit_rate: estimatedProfitRate,
    risk_warnings: riskWarnings,
    bid_strategy: bidStrategy
  }
}

// 主函數
async function main() {
  console.log('🚀 開始執行標案爬蟲...')
  console.log(`📅 執行時間：${new Date().toLocaleString('zh-TW')}`)
  console.log('')
  
  // 生成模擬標案
  console.log('📋 生成標案數據...')
  const mockTenders = generateMockTenders()
  console.log(`✓ 生成 ${mockTenders.length} 筆標案`)
  console.log('')
  
  // AI 分析
  console.log('🤖 執行 AI 分析...')
  const analyzedTenders = mockTenders.map(tender => ({
    ...tender,
    ...analyzeTender(tender),
    analyzed_at: new Date().toISOString()
  }))
  console.log(`✓ 完成 ${analyzedTenders.length} 筆標案分析`)
  console.log('')
  
  // 顯示結果
  console.log('📊 分析結果摘要：')
  console.log('─'.repeat(60))
  analyzedTenders.forEach((tender, index) => {
    console.log(`${index + 1}. ${tender.title}`)
    console.log(`   類型：${tender.type === 'government' ? '政府' : '民間'} | ` +
                `預算：NT$ ${(tender.budget_max / 10000).toFixed(0)}萬 | ` +
                `AI 評分：${tender.ai_score}分`)
    console.log(`   截止：${new Date(tender.deadline_date).toLocaleDateString('zh-TW')} | ` +
                `預估利潤：${tender.estimated_profit_rate}%`)
    console.log('')
  })
  
  // 儲存到文件（模擬數據庫存儲）
  const outputPath = path.join(__dirname, '../../data/tenders.json')
  const outputDir = path.dirname(outputPath)
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // 讀取現有數據
  let existingTenders = []
  if (fs.existsSync(outputPath)) {
    const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
    existingTenders = existing.tenders || []
  }
  
  // 合併新舊數據（避免重複）
  const newTenders = analyzedTenders.filter(newTender => 
    !existingTenders.some(old => old.tender_id === newTender.tender_id)
  )
  
  const allTenders = [...newTenders, ...existingTenders]
  
  // 寫入文件
  fs.writeFileSync(outputPath, JSON.stringify({
    tenders: allTenders,
    last_updated: new Date().toISOString(),
    total_count: allTenders.length
  }, null, 2))
  
  console.log('💾 數據已儲存至:', outputPath)
  console.log(`✓ 新增 ${newTenders.length} 筆，總計 ${allTenders.length} 筆`)
  console.log('')
  console.log('✅ 爬蟲執行完成！')
}

// 執行
main().catch(console.error)
