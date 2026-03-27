import React from 'react'

interface TenderCardProps {
  id: string
  title: string
  organization: string
  budget: number
  deadline: string
  daysRemaining: number
  aiScore: number
  successRate: number
  type: 'government' | 'corporate'
  industry?: string
  rating: number
}

export const TenderCard: React.FC<TenderCardProps> = ({
  id,
  title,
  organization,
  budget,
  deadline,
  daysRemaining,
  aiScore,
  successRate,
  type,
  industry,
  rating
}) => {
  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getBorderColor = () => {
    if (aiScore >= 80) return 'border-green-500'
    if (aiScore >= 60) return 'border-yellow-500'
    return 'border-gray-300'
  }

  const getScoreColor = () => {
    if (aiScore >= 80) return 'text-green-600'
    if (aiScore >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) {
      return `NT$ ${amount / 1000000}萬`
    }
    return `NT$ ${amount / 10000}萬`
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${getBorderColor()} p-6 mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {getRatingStars(rating)}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ml-2 ${
              type === 'government' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {type === 'government' ? '政府標案' : '民間標案'}
            </span>
            {industry && (
              <span className="text-gray-500 text-sm ml-2">{industry}</span>
            )}
          </div>
          
          <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
          <p className="text-gray-600 text-sm mb-3">{organization}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">預算</p>
              <p className="font-semibold text-primary">{formatBudget(budget)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">截止</p>
              <p className="font-semibold text-gray-900">{deadline}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">得標機率</p>
              <p className="font-semibold text-green-600">{successRate}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
              🚀 立即投標
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition">
              📊 查看分析
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition">
              🔔 加入追蹤
            </button>
          </div>
        </div>
        
        <div className="ml-6">
          <div className="text-center">
            <p className={`text-4xl font-bold ${getScoreColor()}`}>{aiScore}</p>
            <p className="text-xs text-gray-500">AI 評分</p>
          </div>
        </div>
      </div>
    </div>
  )
}
