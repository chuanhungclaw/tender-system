/**
 * Telegram Bot 互動服務
 * 
 * 功能：
 * - /start - 歡迎訊息
 * - /today - 今日標案
 * - /search <關鍵字> - 搜索標案
 * - /status - 系統狀態
 * - /help - 幫助資訊
 */

const axios = require('axios')

// Telegram Bot 配置
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

// 存儲 lastUpdateId 避免重複處理
let lastUpdateId = 0

// 命令處理器
const commands = {
  start: async (chatId) => {
    const message = `🎉 歡迎使用銓宏國際 AI 標案即時報！

📋 可用命令：
/today - 查看今日推薦標案
/search <關鍵字> - 搜索標案
/status - 查看系統狀態
/help - 顯示幫助資訊

🤖 系統會每天早上 7:30 自動推送最新標案！`

    await sendMessage(chatId, message)
  },

  today: async (chatId) => {
    await sendMessage(chatId, '🔍 正在查詢今日標案...')
    
    try {
      // 這裡可以整合真實的 API
      const message = `📊 今日標案概覽

目前系統正在開發中，完整功能即將上線！

預計功能：
✅ 每日自動推送
✅ 標案搜索
✅ AI 智能分析
✅ 投標建議

敬請期待！🚀`

      await sendMessage(chatId, message)
    } catch (error) {
      await sendMessage(chatId, `❌ 查詢失敗：${error.message}`)
    }
  },

  search: async (chatId, keyword) => {
    if (!keyword) {
      await sendMessage(chatId, '❌ 請提供搜索關鍵字\n\n用法：/search 紀念品')
      return
    }

    await sendMessage(chatId, `🔍 正在搜索 "${keyword}"...`)
    
    // 這裡可以整合真實的搜索 API
    setTimeout(async () => {
      await sendMessage(chatId, `📋 搜索結果：${keyword}\n\n功能開發中，敬請期待！🚀`)
    }, 1000)
  },

  status: async (chatId) => {
    const message = `📊 系統狀態

✅ Telegram Bot: 運行中
✅ GitHub Actions: 已設定
✅ 定時推送: 每天 7:30
⏳ Web 系統: 開發中
⏳ 數據庫：待設定

版本：v1.0.0`

    await sendMessage(chatId, message)
  },

  help: async (chatId) => {
    const message = `📖 使用說明

🤖 自動推送：
系統會每天早上 7:30 自動推送最新標案到你的 Telegram

📋 手動查詢：
/today - 查看今日推薦標案
/search <關鍵字> - 搜索標案（例如：/search 紀念品）

⚙️ 系統資訊：
/status - 查看系統狀態
/help - 顯示此幫助訊息

💡 提示：
- 標案推送包含 AI 分析與報價建議
- 可以點擊標案連結查看詳情
- 有任何問題請聯繫開發者`

    await sendMessage(chatId, message)
  },

  unknown: async (chatId) => {
    await sendMessage(chatId, `❌ 未知命令

輸入 /help 查看可用命令`)
  }
}

// 發送訊息
async function sendMessage(chatId, text, parseMode = 'Markdown') {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: parseMode
    })
    console.log(`✅ 訊息已發送給 ${chatId}`)
  } catch (error) {
    console.error(`❌ 發送訊息失敗：${error.message}`)
    throw error
  }
}

// 處理更新
async function handleUpdate(update) {
  const updateId = update.update_id
  
  // 避免重複處理
  if (updateId <= lastUpdateId) return
  lastUpdateId = updateId

  const message = update.message
  if (!message) return

  const chatId = message.chat.id
  const text = message.text

  if (!text) return

  // 解析命令
  const parts = text.split(' ')
  const command = parts[0].toLowerCase().replace('/', '')
  const args = parts.slice(1).join(' ')

  console.log(`📩 收到命令：${command} from ${chatId}`)

  // 執行命令
  if (commands[command]) {
    await commands[command](chatId, args)
  } else {
    await commands.unknown(chatId)
  }
}

// 長輪詢接收訊息
async function startPolling() {
  console.log('🤖 Bot 開始輪詢...')

  while (true) {
    try {
      const response = await axios.get(`${API_URL}/getUpdates`, {
        params: {
          offset: lastUpdateId + 1,
          timeout: 30
        }
      })

      const updates = response.data.result || []
      
      for (const update of updates) {
        await handleUpdate(update)
      }
    } catch (error) {
      console.error('❌ 輪詢錯誤:', error.message)
      // 等待 5 秒後重試
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
}

// 啟動 Bot
async function main() {
  console.log('🚀 銓宏標案 Bot 啟動中...')
  console.log(`🤖 Bot Token: ${BOT_TOKEN ? '已設定' : '❌ 未設定'}`)

  if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN 未設定')
    process.exit(1)
  }

  // 測試 Bot 連接
  try {
    const response = await axios.get(`${API_URL}/getMe`)
    console.log(`✅ Bot 已連接：@${response.data.result.username}`)
  } catch (error) {
    console.error(`❌ Bot 連接失敗：${error.message}`)
    process.exit(1)
  }

  // 開始輪詢
  startPolling()
}

// 啟動
main().catch(console.error)
