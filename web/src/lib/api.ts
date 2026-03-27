import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 標案相關 API
export const tenderApi = {
  // 獲取標案列表
  getList: async (params?: {
    type?: string
    status?: string
    category?: string
    region?: string
    min_budget?: number
    max_budget?: number
    min_score?: number
    keyword?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/tenders', { params })
    return response.data
  },

  // 獲取標案詳情
  getById: async (id: string) => {
    const response = await api.get(`/tenders/${id}`)
    return response.data
  },

  // 創建投標
  createBid: async (tenderId: string, data: {
    bid_amount: number
    bid_strategy: string
    proposal_text?: string
    quotation?: any
    design_proposal?: any
  }) => {
    const response = await api.post(`/tenders/${tenderId}/bid`, data)
    return response.data
  },

  // 切換追蹤狀態
  toggleWatch: async (id: string, watching: boolean) => {
    const response = await api.put(`/tenders/${id}/watch`, { watching })
    return response.data
  },
}

// 儀表板 API
export const dashboardApi = {
  getDashboard: async (date?: string) => {
    const response = await api.get('/dashboard', { params: { date } })
    return response.data
  },
}

// 客戶管理 API
export const clientApi = {
  getList: async (params?: {
    industry?: string
    min_rating?: number
    keyword?: string
  }) => {
    const response = await api.get('/clients', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },

  create: async (data: {
    company_name: string
    industry?: string
    website?: string
    tags?: string[]
  }) => {
    const response = await api.post('/clients', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/clients/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  },
}

// 報表 API
export const reportApi = {
  getBidStatistics: async (params: {
    start_date: string
    end_date: string
    group_by?: string
  }) => {
    const response = await api.get('/reports/bid-statistics', { params })
    return response.data
  },

  getProfitAnalysis: async (params?: any) => {
    const response = await api.get('/reports/profit-analysis', { params })
    return response.data
  },
}

// 設定 API
export const settingsApi = {
  get: async () => {
    const response = await api.get('/settings')
    return response.data
  },

  update: async (data: any) => {
    const response = await api.put('/settings', data)
    return response.data
  },
}
