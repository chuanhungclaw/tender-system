import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/tenders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
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
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '伺服器錯誤'
        }
      },
      { status: 500 }
    )
  }
}
