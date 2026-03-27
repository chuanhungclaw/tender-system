'use client'

import React, { useState, useEffect } from 'react'
import { StatCard } from '@/components/ui/StatCard'
import { TenderCard } from '@/components/tender/TenderCard'
import { dashboardApi, tenderApi } from '@/lib/api'
import { mockDashboardData, mockTenders } from '@/lib/mockData'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [recommendedTenders, setRecommendedTenders] = useState<any[]>([])
  const [useMock, setUseMock] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      
      // 檢查 Supabase 是否已設定
      const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
      
      if (!supabaseConfigured) {
        // 使用模擬數據
        console.log('Using mock data (Supabase not configured)')
        setDashboardData(mockDashboardData)
        setRecommendedTenders(mockTenders.filter(t => t.ai_score >= 70))
        setUseMock(true)
        setLoading(false)
        return
      }
      
      // 使用真實 API
      const [dashboard, tenders] = await Promise.all([
        dashboardApi.getDashboard(),
        tenderApi.getList({ min_score: 70, limit: 5 })
      ])
      
      setDashboardData(dashboard.data)
      setRecommendedTenders(tenders.data.tenders)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      // 出錯時使用模擬數據
      setDashboardData(mockDashboardData)
      setRecommendedTenders(mockTenders.filter(t => t.ai_score >= 70))
      setUseMock(true)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">銓宏國際 - AI 標案即時報</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">👤 Kevin</span>
              <button className="text-gray-500 hover:text-gray-700">⚙️</button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 日期標題 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">📊 今日概覽</h2>
          <p className="text-gray-600">{new Date().toLocaleDateString('zh-TW')}</p>
          {useMock && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ 目前使用模擬數據（Supabase 尚未設定）。請設定環境變數後重啟伺服器。
              </p>
            </div>
          )}
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="新標案"
            value={dashboardData?.summary.total_tenders || 13}
            icon="📋"
            trend="比昨天多 3 件"
            trendUp={true}
            color="text-primary"
          />
          <StatCard
            title="強烈推薦"
            value={dashboardData?.summary.recommended_tenders || 3}
            icon="⭐"
            trend="高得標機率"
            color="text-secondary"
          />
          <StatCard
            title="投標中"
            value={dashboardData?.summary.pending_bids || 8}
            icon="🎯"
            trend="等待結果"
            color="text-warning"
          />
          <StatCard
            title="本月得標"
            value={dashboardData?.summary.won_bids_this_month || 2}
            icon="🏆"
            trend="NT$ 85 萬"
            trendUp={true}
            color="text-green-600"
          />
        </div>

        {/* 今日推薦標案 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">⭐ 今日推薦標案</h3>
          
          {recommendedTenders.length > 0 ? (
            recommendedTenders.map((tender) => (
              <TenderCard
                key={tender.id}
                id={tender.id}
                title={tender.title}
                organization={tender.organization_name}
                budget={tender.budget_max}
                deadline={new Date(tender.deadline_date).toLocaleDateString('zh-TW')}
                daysRemaining={Math.ceil((new Date(tender.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                aiScore={Math.round(tender.ai_score)}
                successRate={Math.round(tender.success_rate_score * 4)}
                type={tender.type as 'government' | 'corporate'}
                industry={tender.organization_type}
                rating={Math.ceil(tender.ai_score / 20)}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              暫無推薦標案
            </div>
          )}
        </div>

        {/* 兩欄布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 即將截止 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⏰ 即將截止</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">台北市環保局宣導品</p>
                  <p className="text-sm text-gray-600">政府標案 • NT$ 15 萬</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">剩 3 天</p>
                  <p className="text-xs text-gray-500">3/30 截止</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">聯發科年會禮品</p>
                  <p className="text-sm text-gray-600">民間標案 • NT$ 35 萬</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-600">剩 5 天</p>
                  <p className="text-xs text-gray-500">4/01 截止</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">富邦金控客戶禮品</p>
                  <p className="text-sm text-gray-600">民間標案 • NT$ 42 萬</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">剩 7 天</p>
                  <p className="text-xs text-gray-500">4/03 截止</p>
                </div>
              </div>
            </div>
          </div>

          {/* 統計圖表 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 本週標案趨勢</h3>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">[圖表：本週每日新標案數量]</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">28</p>
                <p className="text-xs text-gray-500">本週總計</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-xs text-gray-500">推薦標案</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">12</p>
                <p className="text-xs text-gray-500">投標中</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部導航（手機版） */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-5 gap-1">
          <a href="#" className="flex flex-col items-center py-3 text-primary">
            <span className="text-xl">📊</span>
            <span className="text-xs mt-1">儀表板</span>
          </a>
          <a href="#" className="flex flex-col items-center py-3 text-gray-500">
            <span className="text-xl">📋</span>
            <span className="text-xs mt-1">標案</span>
          </a>
          <a href="#" className="flex flex-col items-center py-3 text-gray-500">
            <span className="text-xl">👥</span>
            <span className="text-xs mt-1">客戶</span>
          </a>
          <a href="#" className="flex flex-col items-center py-3 text-gray-500">
            <span className="text-xl">🎯</span>
            <span className="text-xs mt-1">投標</span>
          </a>
          <a href="#" className="flex flex-col items-center py-3 text-gray-500">
            <span className="text-xl">⚙️</span>
            <span className="text-xs mt-1">設定</span>
          </a>
        </div>
      </nav>
    </div>
  )
}
