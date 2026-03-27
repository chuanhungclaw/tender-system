'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { tenderApi } from '@/lib/api'
import { mockTenders } from '@/lib/mockData'

export default function TendersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tenders, setTenders] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({ page: 1, total_pages: 1 })
  
  // 篩選狀態
  const [filters, setFilters] = useState({
    type: '',
    status: 'active',
    category: '',
    region: '',
    min_budget: '',
    max_budget: '',
    min_score: '',
    keyword: ''
  })

  useEffect(() => {
    loadTenders()
  }, [filters])

  const loadTenders = async () => {
    try {
      setLoading(true)
      
      // 檢查 Supabase 是否已設定
      const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
      
      if (!supabaseConfigured) {
        // 使用模擬數據
        let filtered = [...mockTenders]
        
        if (filters.keyword) {
          filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            t.organization_name.toLowerCase().includes(filters.keyword.toLowerCase())
          )
        }
        
        if (filters.type) {
          filtered = filtered.filter(t => t.type === filters.type)
        }
        
        if (filters.min_score) {
          filtered = filtered.filter(t => t.ai_score >= parseFloat(filters.min_score))
        }
        
        setTenders(filtered)
        setPagination({ page: 1, total_pages: 1, total: filtered.length })
        setLoading(false)
        return
      }
      
      // 使用真實 API
      const params: any = { ...filters, limit: 20 }
      const response = await tenderApi.getList(params)
      
      setTenders(response.data.tenders)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to load tenders:', error)
      setTenders(mockTenders)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      status: 'active',
      category: '',
      region: '',
      min_budget: '',
      max_budget: '',
      min_score: '',
      keyword: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航欄 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.push('/')} className="mr-4 text-gray-500 hover:text-gray-700">
                ← 返回
              </button>
              <h1 className="text-xl font-bold text-primary">標案列表</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">👤 Kevin</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 篩選欄 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">🔍 篩選條件</h2>
            <button onClick={clearFilters} className="text-sm text-primary hover:underline">
              清除篩選
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 關鍵字 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">關鍵字</label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="搜索標案..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 標案類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">標案類型</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">全部</option>
                <option value="government">政府標案</option>
                <option value="corporate">民間標案</option>
              </select>
            </div>

            {/* 產品類別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">產品類別</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">全部</option>
                <option value="紀念品">紀念品</option>
                <option value="獎盃">獎盃/獎牌</option>
                <option value="宣導品">宣導品</option>
                <option value="隨身碟">隨身碟</option>
                <option value="環保袋">環保袋</option>
                <option value="保溫杯">保溫杯</option>
                <option value="行動電源">行動電源</option>
              </select>
            </div>

            {/* 地區 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地區</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">全部</option>
                <option value="台北">台北</option>
                <option value="新北">新北</option>
                <option value="桃園">桃園</option>
                <option value="台中">台中</option>
                <option value="台南">台南</option>
                <option value="高雄">高雄</option>
                <option value="全台">全台</option>
              </select>
            </div>

            {/* 最小預算 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最小預算（萬）</label>
              <input
                type="number"
                value={filters.min_budget}
                onChange={(e) => handleFilterChange('min_budget', e.target.value)}
                placeholder="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 最大預算 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最大預算（萬）</label>
              <input
                type="number"
                value={filters.max_budget}
                onChange={(e) => handleFilterChange('max_budget', e.target.value)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 最小 AI 評分 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最小 AI 評分</label>
              <input
                type="number"
                value={filters.min_score}
                onChange={(e) => handleFilterChange('min_score', e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* 標案列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                📋 標案列表
                {pagination.total > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    （共 {pagination.total} 筆）
                  </span>
                )}
              </h2>
              <div className="text-sm text-gray-600">
                第 {pagination.page} / {pagination.total_pages} 頁
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">載入中...</p>
            </div>
          ) : tenders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>查無標案</p>
              <p className="text-sm mt-2">請調整篩選條件</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tenders.map((tender) => (
                <div
                  key={tender.id}
                  onClick={() => router.push(`/tenders/${tender.id}`)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                          tender.type === 'government' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tender.type === 'government' ? '政府標案' : '民間標案'}
                        </span>
                        {tender.organization_type && (
                          <span className="text-gray-500 text-sm ml-2">{tender.organization_type}</span>
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(tender.deadline_date).toLocaleDateString('zh-TW')} 截止
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{tender.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tender.organization_name}</p>
                      
                      <div className="flex items-center space-x-6">
                        <div>
                          <span className="text-xs text-gray-500">預算</span>
                          <p className="font-semibold text-primary">
                            NT$ {(tender.budget_max / 10000).toFixed(0)}萬
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">AI 評分</span>
                          <p className={`font-semibold ${
                            tender.ai_score >= 80 ? 'text-green-600' :
                            tender.ai_score >= 60 ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {Math.round(tender.ai_score)}分
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">地區</span>
                          <p className="font-semibold text-gray-900">{tender.region || '全台'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button className="text-primary hover:text-blue-700 font-medium">
                        查看詳情 →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分頁 */}
          {pagination.total_pages > 1 && (
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {/* 上一頁 */}}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← 上一頁
              </button>
              <div className="text-sm text-gray-600">
                第 {pagination.page} / {pagination.total_pages} 頁
              </div>
              <button
                onClick={() => {/* 下一頁 */}}
                disabled={pagination.page === pagination.total_pages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一頁 →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
