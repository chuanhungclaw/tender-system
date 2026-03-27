// 模擬數據 - 用於開發和測試

export const mockDashboardData = {
  summary: {
    total_tenders: 13,
    recommended_tenders: 3,
    pending_bids: 8,
    won_bids_this_month: 2,
    total_revenue_this_month: 850000
  },
  recommended_tenders: [
    {
      id: '1',
      title: '台積電 2026 員工福利品採購',
      organization_name: '台灣積體電路製造股份有限公司',
      budget_max: 500000,
      deadline_date: '2026-04-20T17:00:00Z',
      ai_score: 88,
      type: 'corporate',
      organization_type: '科技業'
    },
    {
      id: '2',
      title: '國泰人壽 VIP 客戶端午禮盒',
      organization_name: '國泰人壽保險股份有限公司',
      budget_max: 280000,
      deadline_date: '2026-04-15T17:00:00Z',
      ai_score: 75,
      type: 'corporate',
      organization_type: '金融業'
    },
    {
      id: '3',
      title: '聯發科年會禮品採購',
      organization_name: '聯發科技股份有限公司',
      budget_max: 350000,
      deadline_date: '2026-04-01T17:00:00Z',
      ai_score: 82,
      type: 'corporate',
      organization_type: '科技業'
    }
  ]
}

export const mockTenders = [
  {
    id: '1',
    title: '台積電 2026 員工福利品採購',
    organization_name: '台灣積體電路製造股份有限公司',
    budget_max: 500000,
    deadline_date: '2026-04-20T17:00:00Z',
    ai_score: 88,
    type: 'corporate',
    organization_type: '科技業',
    status: 'active'
  },
  {
    id: '2',
    title: '國泰人壽 VIP 客戶端午禮盒',
    organization_name: '國泰人壽保險股份有限公司',
    budget_max: 280000,
    deadline_date: '2026-04-15T17:00:00Z',
    ai_score: 75,
    type: 'corporate',
    organization_type: '金融業',
    status: 'active'
  },
  {
    id: '3',
    title: '台北市環保局宣導品',
    organization_name: '台北市政府環保局',
    budget_max: 150000,
    deadline_date: '2026-03-30T17:00:00Z',
    ai_score: 68,
    type: 'government',
    organization_type: '政府機關',
    status: 'active'
  }
]
