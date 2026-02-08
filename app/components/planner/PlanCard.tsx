'use client'

import Link from 'next/link'
import { TravelPlan } from '../../types/planner'
import { formatDate, formatCurrency } from '../../lib/plannerStorage'

interface PlanCardProps {
  plan: TravelPlan
  onDelete: () => void
}

export default function PlanCard({ plan, onDelete }: PlanCardProps) {
  const totalActivities = plan.days.reduce(
    (sum, day) => sum + day.activities.length,
    0,
  )
  const budgetPercentage =
    plan.budget > 0 ? (plan.totalSpent / plan.budget) * 100 : 0
  const isOverBudget = plan.totalSpent > plan.budget

  const daysUntilTrip = Math.ceil(
    (new Date(plan.startDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  )
  const isPast = daysUntilTrip < 0
  const isUpcoming = daysUntilTrip >= 0 && daysUntilTrip <= 30

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all overflow-hidden">
      <Link href={`/planner/${plan.id}`}>
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 group-hover:scale-105 transition-transform">
                {plan.title}
              </h3>
              <p className="text-sm opacity-90">
                📍 {plan.destination}, {plan.country}
              </p>
            </div>

            {/* 상태 뱃지 */}
            {isUpcoming && !isPast && (
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                D-{daysUntilTrip}
              </div>
            )}
            {isPast && (
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                완료
              </div>
            )}
          </div>

          {/* 날짜 */}
          <div className="flex items-center gap-2 text-sm">
            <span>📅</span>
            <span>
              {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
            </span>
            <span className="opacity-75">({plan.days.length}일)</span>
          </div>
        </div>

        {/* 바디 */}
        <div className="p-5 space-y-4">
          {/* 통계 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {totalActivities}
              </div>
              <div className="text-xs text-gray-500 mt-1">일정</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div
                className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}
              >
                {Math.round(budgetPercentage)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">예산 사용</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {plan.days.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">여행일</div>
            </div>
          </div>

          {/* 예산 진행 바 */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">예산</span>
              <span className="font-semibold">
                {formatCurrency(plan.totalSpent)} /{' '}
                {formatCurrency(plan.budget)}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isOverBudget
                    ? 'bg-gradient-to-r from-red-400 to-red-600'
                    : budgetPercentage > 80
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-gradient-to-r from-blue-400 to-purple-600'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* 최근 업데이트 */}
          <div className="text-xs text-gray-400">
            마지막 수정: {new Date(plan.updatedAt).toLocaleDateString('ko-KR')}
          </div>
        </div>
      </Link>

      {/* 푸터 액션 */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          href={`/planner/${plan.id}`}
          className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all hover:scale-105"
        >
          편집하기
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault()
            if (confirm('정말 이 플랜을 삭제하시겠습니까?')) {
              onDelete()
            }
          }}
          className="px-4 py-2.5 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
