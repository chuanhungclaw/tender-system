import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { mockTenders } from '@/lib/mockData'

// GET /api/tenders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 檢查 Supabase 是否已設定
    const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    
    if (!supabaseConfigured) {
      // 返回模擬數據
      const params: any = { ...Object.fromEntries(searchParams.entries()) }
      let filtered = [...mockTenders]
      
      if (params.keyword) {
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(params.keyword.toLowerCase()) ||
          t.organization_name.toLowerCase().includes(params.keyword.toLowerCase())
        )
      }
      
      if (params.type) {
        filtered = filtered.filter(t => t.type === params.type)
      }
      
      if (params.min_score) {
        filtered = filtered.filter(t => t.ai_score >= parseFloat(params.min_score))
      }
      
      return NextResponse.json({
        success: true,
        data: {
          tenders: filtered,
          pagination: {
            page: 1,
            limit: 20,
            total: filtered.length,
            total_pages: 1
          }
        }
      })
    }
    
    // 解析查詢參數
    const type = searchParams.get('type')
    const status = searchParams.get('status') || 'active'
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const minBudget = searchParams.get('min_budget')
    const maxBudget = searchParams.get('max_budget')
    const minScore = searchParams.get('min_score')
    const keyword = searchParams.get('keyword')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 建立查詢
    let query = supabaseAdmin
      .from('tenders')
      .select('*', { count: 'exact' })
      .eq('status', status)

    // 應用篩選條件
    if (type) {
      query = query.eq('type', type)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (region) {
      query = query.eq('region', region)
    }
    if (minBudget) {
      query = query.gte('budget_max', parseFloat(minBudget))
    }
    if (maxBudget) {
      query = query.lte('budget_max', parseFloat(maxBudget))
    }
    if (minScore) {
      query = query.gte('ai_score', parseFloat(minScore))
    }
    if (keyword) {
      // 關鍵字搜索（標題或描述）
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    }

    // 分頁
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('ai_score', { ascending: false })

    const { data: tenders, count, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: {
        tenders: tenders || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Tenders API error:', error)
    // 出錯時返回模擬數據
    return NextResponse.json({
      success: true,
      data: {
        tenders: mockTenders,
        pagination: {
          page: 1,
          limit: 20,
          total: mockTenders.length,
          total_pages: 1
        }
      }
    })
  }
}
