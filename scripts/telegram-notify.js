#!/usr/bin/env node

/**
 * Telegram 每日推送腳本
 * 
 * 功能：
 * 1. 查詢今日新標案
 * 2. 篩選推薦標案（AI 評分 >= 70）
 * 3. 生成推送報告
 * 4. 通過 Telegram Bot 發送
 * 
 * 執行：npm run notify
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')

// Telegram 配置
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'mock-token'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'mock-chat-id'

// 數據文件路徑
const DATA_FILE = path.join(__dirname, '../../data/tenders.json')

// 格式化金額
function formatMoney(amount) {
  if (amount >= 1000000) {
    return `NT$ ${(amount / 1000000).toFixed(0)}萬`
  }
  return `NT$ ${(amount / 10000).toFixed(0)}萬`
}

// 格式化日期
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    month: '2-digit',
    day: '2-digit'
  })
}

// 計算剩餘天數
function getDaysRemaining(dateString) {
  const days = Math.ceil((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

// 獲取推薦標案
function getRecommendedTenders(tenders, limit = 5) {
  return tenders
    .filter(t => t.status === 'active' && t.ai_score >= 70)
    .sort((a, b) => b.ai_score - a.ai_score)
    .slice(0, limit)
}

// 獲取即將截止標案
function getUpcomingDeadlines(tenders, days = 7) {
  return tenders
    .filter(t => {
      const remaining = getDaysRemaining(t.deadline_date)
      return t.status === 'active' && remaining <= days && remaining > 0
    })
    .sort((a, b) => new Date(a.deadline_date) - new Date(b.deadline_date))
}

// 生成推送報告
function generateReport(tenders) {
  const date = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const recommended = getRecommendedTenders(tenders)
  const upcoming = getUpcomingDeadlines(tenders)
  
  const totalNew = tenders.filter(t => {
    const publishedToday = new Date(t.publish_date).toDateString() === new Date().toDateString()
    return t.status === 'active' && publishedToday
  }).length
  
  let message = `📋 *銓宏國際 - AI 標案即時報*

📅 ${date}

───

📊 *今日概覽*

新標案：${totalNew} 件
推薦標案：${recommended.length} 件
即將截止：${upcoming.length} 件

───

⭐ *推薦標案*

`

  recommended.forEach((tender, index) => {
    const type = tender.type === 'government' ? '🏛️政府' : '🏢民間'
    const score = tender.ai_score >= 80 ? '⭐⭐⭐⭐⭐' : 
                  tender.ai_score >= 70 ? '⭐⭐⭐⭐' : '⭐⭐⭐'
    
    message += `${index + 1}. ${score} ${type}
${tender.title}
💰 預算：${formatMoney(tender.budget_max)}
📅 截止：${formatDate(tender.deadline_date)}（剩${getDaysRemaining(tender.deadline_date)}天）
🎯 得標機率：${Math.round(tender.success_rate_score * 4)}%
🤖 AI 評分：${tender.ai_score}分

`
  })

  if (upcoming.length > 0) {
    message += `───

⏰ *即將截止*

`
    upcoming.forEach((tender, index) => {
      const days = getDaysRemaining(tender.deadline_date)
      const urgency = days <= 3 ? '🔴' : '🟡'
      message += `${urgency} ${tender.title}
   剩餘 ${days} 天 | ${formatMoney(tender.budget_max)}

`
    })
  }

  message += `───

💡 *今日建議*

`

  if (recommended.length > 0) {
    const topTender = recommended[0]
    message += `• 重點關注：${topTender.title}
• 建議報價：${formatMoney(topTender.suggested_price_mid)}
• 預估利潤：${topTender.estimated_profit_rate}%

`
  }

  message += `• 投標前請確認供應鏈配合度
• 高評分標案建議優先處理

───

📎 查看詳情：https://tender-system.vercel.app

#銓宏國際 #標案即時報`

  return message
}

// 發送 Telegram 訊息
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  try {
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
    
    console.log('✅ Telegram 推送成功')
    return { success: true, data: response.data }
  } catch (error) {
    console.error('❌ Telegram 推送失敗:', error.message)
    
    // 如果是 mock token，視為成功（開發環境）
    if (TELEGRAM_BOT_TOKEN === 'mock-token') {
      console.log('⚠️ 使用 Mock Token（開發環境）')
      console.log('📱 推送內容預覽：')
      console.log('─'.repeat(60))
      console.log(message)
      console.log('─'.repeat(60))
      return { success: true, mock: true }
    }
    
    return { success: false, error: error.message }
  }
}

// 主函數
async function main() {
  console.log('🚀 開始執行 Telegram 推送...')
  console.log(`📅 執行時間：${new Date().toLocaleString('zh-TW')}`)
  console.log('')
  
  // 讀取標案數據
  let tenders = []
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    tenders = data.tenders || []
    console.log(`📊 讀取到 ${tenders.length} 筆標案`)
  } else {
    console.log('⚠️ 標案數據文件不存在，使用模擬數據')
    // 使用模擬數據
    tenders = [
      {
        tender_id: 'mock-1',
        title: '台積電 2026 員工福利品採購',
        type: 'corporate',
        organization_name: '台灣積體電路製造股份有限公司',
        budget_max: 500000,
        deadline_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        ai_score: 88,
        success_rate_score: 23,
        suggested_price_mid: 450000,
        estimated_profit_rate: 35,
        status: 'active',
        publish_date: new Date().toISOString()
      },
      {
        tender_id: 'mock-2',
        title: '國泰人壽 VIP 客戶端午禮盒',
        type: 'corporate',
        organization_name: '國泰人壽保險股份有限公司',
        budget_max: 280000,
        deadline_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        ai_score: 75,
        success_rate_score: 18,
        suggested_price_mid: 252000,
        estimated_profit_rate: 30,
        status: 'active',
        publish_date: new Date().toISOString()
      }
    ]
  }
  console.log('')
  
  // 生成報告
  console.log('📝 生成推送報告...')
  const report = generateReport(tenders)
  console.log('✓ 報告生成完成')
  console.log('')
  
  // 發送 Telegram
  console.log('📱 發送 Telegram 訊息...')
  const result = await sendTelegramMessage(report)
  console.log('')
  
  if (result.success) {
    console.log('✅ 推送執行完成！')
  } else {
    console.log('❌ 推送失敗:', result.error)
    process.exit(1)
  }
}

// 執行
main().catch(console.error)
