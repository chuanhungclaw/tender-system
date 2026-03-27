import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { mockDashboardData } from '@/lib/mockData'

// GET /api/dashboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // 檢查 Supabase 是否已設定
    const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
    
    if (!supabaseConfigured) {
      // 返回模擬數據
      return NextResponse.json({
        success: true,
        data: mockDashboardData
      })
    }

    // 獲取統計數據
    const [
      totalTendersResult,
      recommendedTendersResult,
      pendingBidsResult,
      wonBidsResult
    ] = await Promise.all([
      // 新標案總數
      supabaseAdmin
        .from('tenders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('publish_date', new Date(date).toISOString()),
      
      // 推薦標案（AI 評分 >= 80）
      supabaseAdmin
        .from('tenders')
        .select('id, title, organization_name, budget_max, deadline_date, ai_score')
        .eq('status', 'active')
        .gte('ai_score', 80)
        .order('ai_score', { ascending: false })
        .limit(5),
      
      // 投標中案件
      supabaseAdmin
        .from('bids')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // 本月得標
      supabaseAdmin
        .from('bids')
        .select('contract_amount')
        .eq('status', 'won')
        .gte('result_date', new Date(new Date().setDate(1)).toISOString())
    ])

    const dashboardData = {
      summary: {
        total_tenders: totalTendersResult.count || 0,
        recommended_tenders: recommendedTendersResult.data?.length || 0,
        pending_bids: pendingBidsResult.count || 0,
        won_bids_this_month: wonBidsResult.data?.length || 0,
        total_revenue_this_month: wonBidsResult.data?.reduce((sum: any, bid: any) => sum + (bid.contract_amount || 0), 0) || 0
      },
      recommended_tenders: recommendedTendersResult.data || [],
      upcoming_deadlines: [],
      statistics: {
        tender_trend: [],
        industry_distribution: {}
      }
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    // 出錯時返回模擬數據
    return NextResponse.json({
      success: true,
      data: mockDashboardData
    })
  }
}
