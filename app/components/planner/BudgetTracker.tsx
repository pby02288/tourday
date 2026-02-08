'use client'

interface BudgetTrackerProps {
  budget: number
  totalSpent: number
}

export default function BudgetTracker({
  budget,
  totalSpent,
}: BudgetTrackerProps) {
  const remaining = budget - totalSpent
  const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0
  const isOverBudget = totalSpent > budget

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span>💰</span>
          <span>예산 현황</span>
        </h3>
        <span className="text-sm text-gray-500">실시간 업데이트</span>
      </div>

      {/* 진행 바 */}
      <div className="mb-6">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-400 to-red-600'
                : percentage > 80
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  : 'bg-gradient-to-r from-blue-400 to-purple-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0원</span>
          <span>{budget.toLocaleString()}원</span>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-3">
        {/* 총 예산 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">총 예산</span>
          <span className="font-bold text-gray-900">
            {budget.toLocaleString()}원
          </span>
        </div>

        {/* 사용 금액 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">사용 금액</span>
          <span
            className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}
          >
            {totalSpent.toLocaleString()}원
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          {/* 남은 예산 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">남은 예산</span>
            <span
              className={`text-xl font-bold ${
                isOverBudget
                  ? 'text-red-600'
                  : remaining < budget * 0.2
                    ? 'text-orange-600'
                    : 'text-green-600'
              }`}
            >
              {isOverBudget && '-'}
              {Math.abs(remaining).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 경고 메시지 */}
      {isOverBudget && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ⚠️ 예산을 초과했습니다!
        </div>
      )}

      {!isOverBudget && percentage > 80 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
          💡 예산의 {Math.round(percentage)}%를 사용했습니다
        </div>
      )}
    </div>
  )
}
