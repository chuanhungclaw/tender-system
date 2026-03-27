'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { tenderApi } from '@/lib/api'
import { mockTenders } from '@/lib/mockData'

export default function TenderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [tender, setTender] = useState<any>(null)

  useEffect(() => {
    loadTender()
  }, [])

  const loadTender = async () => {
    try {
      setLoading(true)
      
      // 檢查 Supabase 是否已設定
      const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
      
      if (!supabaseConfigured) {
        // 使用模擬數據
        const mockTender = mockTenders[0]
        setTender({
          ...mockTender,
          description: '這是一個模擬的標案詳情。設定 Supabase 後會顯示真實數據。',
          ai_analysis: {
            score: mockTender.ai_score,
            breakdown: {
              profit: 28,
              success_rate: 23,
              risk: 17,
              strategic: 12,
              resource: 8
            },
            suggested_prices: {
              low: mockTender.budget_max * 0.85,
              mid: mockTender.budget_max * 0.90,
              high: mockTender.budget_max * 0.95
            },
            estimated_profit_rate: 35,
            risk_warnings: [
              '該機關付款週期 60 天（較長）',
              '驗收標準嚴格，需注重品質'
            ],
            bid_strategy: '1. 強調 ISO 認證供應鏈\n2. 提供過往科技業案例\n3. 主動提出免費打樣'
          }
        })
        setLoading(false)
        return
      }
      
      const response = await tenderApi.getById(params.id as string)
      setTender(response.data)
    } catch (error) {
      console.error('Failed to load tender:', error)
      // 使用模擬數據
      const mockTender = mockTenders[0]
      setTender(mockTender)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>標案不存在</p>
          <button onClick={() => router.push('/tenders')} className="mt-4 text-primary hover:underline">
            ← 返回標案列表
          </button>
        </div>
      </div>
    )
  }

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/tenders')} className="mr-4 text-gray-500 hover:text-gray-700">
                ← 返回
              </button>
              <h1 className="text-xl font-bold text-primary">標案詳情</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">📤</button>
              <button className="text-gray-500 hover:text-gray-700">⬇️</button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 標題區 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  tender.type === 'government' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {tender.type === 'government' ? '政府標案' : '民間標案'}
                </span>
                {tender.organization_type && (
                  <span className="text-gray-500 text-sm ml-2">{tender.organization_type}</span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{tender.title}</h1>
              <p className="text-gray-600">{tender.organization_name}</p>
            </div>
            
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(tender.ai_score)}`}>
                {Math.round(tender.ai_score)}
              </div>
              <p className="text-sm text-gray-500 mt-1">AI 評分</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">預算金額</p>
              <p className="text-xl font-bold text-primary">
                NT$ {(tender.budget_max / 10000).toFixed(0)}萬
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">截止日期</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(tender.deadline_date).toLocaleDateString('zh-TW')}
              </p>
              <p className={`text-sm ${getDaysRemaining(tender.deadline_date) < 7 ? 'text-red-600' : 'text-gray-500'}`}>
                剩餘 {getDaysRemaining(tender.deadline_date)} 天
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">得標機率</p>
              <p className="text-xl font-bold text-green-600">
                {Math.round(tender.success_rate_score * 4)}%
              </p>
            </div>
          </div>
        </div>

        {/* AI 分析 */}
        {tender.ai_analysis && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🤖 AI 智能分析</h2>
            
            {/* 評分細項 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">評分細項</h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(tender.ai_analysis.breakdown).map(([key, value]: any) => {
                  const labels: any = {
                    profit: '利潤潛力',
                    success_rate: '得標機率',
                    risk: '履約風險',
                    strategic: '戰略價值',
                    resource: '資源匹配'
                  }
                  const maxScores: any = {
                    profit: 30,
                    success_rate: 25,
                    risk: 20,
                    strategic: 15,
                    resource: 10
                  }
                  return (
                    <div key={key} className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor((value / maxScores[key]) * 100)}`}>
                        {value}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{labels[key]}</p>
                      <p className="text-xs text-gray-400">/{maxScores[key]}分</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 報價建議 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">💰 報價建議</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">低標策略</p>
                  <p className="text-2xl font-bold text-primary">
                    NT$ {(tender.ai_analysis.suggested_prices.low / 10000).toFixed(0)}萬
                  </p>
                  <p className="text-xs text-gray-500 mt-1">預算的 85%</p>
                  <p className="text-xs text-gray-600 mt-2">適用：確保得標</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">平衡策略 ⭐</p>
                  <p className="text-2xl font-bold text-green-600">
                    NT$ {(tender.ai_analysis.suggested_prices.mid / 10000).toFixed(0)}萬
                  </p>
                  <p className="text-xs text-gray-500 mt-1">預算的 90%</p>
                  <p className="text-xs text-gray-600 mt-2">適用：一般情況</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">利潤策略</p>
                  <p className="text-2xl font-bold text-purple-600">
                    NT$ {(tender.ai_analysis.suggested_prices.high / 10000).toFixed(0)}萬
                  </p>
                  <p className="text-xs text-gray-500 mt-1">預算的 95%</p>
                  <p className="text-xs text-gray-600 mt-2">適用：高利潤</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  預估利潤率：<span className="font-bold text-green-600">{tender.ai_analysis.estimated_profit_rate}%</span>
                  （約 NT$ {((tender.budget_max * tender.ai_analysis.estimated_profit_rate / 100) / 10000).toFixed(1)}萬）
                </p>
              </div>
            </div>

            {/* 投標策略 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">🎯 投標策略建議</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                  {tender.ai_analysis.bid_strategy}
                </pre>
              </div>
            </div>

            {/* 風險提示 */}
            {tender.ai_analysis.risk_warnings && tender.ai_analysis.risk_warnings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">⚠️ 風險提示</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {tender.ai_analysis.risk_warnings.map((warning: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-800 flex items-start">
                        <span className="mr-2">⚠️</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 採購內容 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📦 採購內容</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {tender.description || '暫無詳細描述'}
            </p>
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📞 聯絡資訊</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">聯絡人</p>
              <p className="font-medium text-gray-900">{tender.contact_name || '暫無'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">聯絡電話</p>
              <p className="font-medium text-gray-900">{tender.contact_phone || '暫無'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{tender.contact_email || '暫無'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">地區</p>
              <p className="font-medium text-gray-900">{tender.region || '全台'}</p>
            </div>
          </div>
        </div>

        {/* 行動按鈕 */}
        <div className="bg-white rounded-lg shadow p-6 sticky bottom-4">
          <div className="flex items-center space-x-4">
            <button className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              🚀 立即投標
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
              📧 聯絡採購
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
              🔔 追蹤
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
