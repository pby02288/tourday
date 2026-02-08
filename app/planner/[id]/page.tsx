'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TravelPlan, Activity } from '../../types/planner'
import { plannerStorage, formatDate } from '../../lib/plannerStorage'
import DaySchedule from '../../components/planner/DaySchedule'
import BudgetTracker from '../../components/planner/BudgetTracker'
import Checklist from '../../components/planner/Checklist'

export default function PlannerEditPage() {
  const params = useParams()
  const router = useRouter()
  const planId = params.id as string

  const [plan, setPlan] = useState<TravelPlan | null>(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  useEffect(() => {
    const loadedPlan = plannerStorage.getPlan(planId)
    if (!loadedPlan) {
      router.push('/planner')
      return
    }
    setPlan(loadedPlan)
  }, [planId, router])

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-500">플랜을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const handleUpdateDay = (dayIndex: number, activities: Activity[]) => {
    const updatedDays = [...plan.days]
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], activities }

    // 전체 지출 계산
    const totalSpent = updatedDays.reduce(
      (sum, day) =>
        sum + day.activities.reduce((daySum, a) => daySum + (a.cost || 0), 0),
      0,
    )

    const updatedPlan = { ...plan, days: updatedDays, totalSpent }
    setPlan(updatedPlan)
    plannerStorage.savePlan(updatedPlan)
  }

  const selectedDay = plan.days[selectedDayIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 뒤로가기 & 제목 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/planner')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {plan.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {plan.destination}, {plan.country} ·{' '}
                  {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                </p>
              </div>
            </div>

            {/* 공유 버튼 (향후 기능) */}
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>공유</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 일정 편집 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 날짜 탭 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-2 overflow-x-auto">
              <div className="flex gap-2">
                {plan.days.map((day, index) => {
                  const dayActivities = day.activities.length
                  const dayCost = day.activities.reduce(
                    (sum, a) => sum + (a.cost || 0),
                    0,
                  )

                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDayIndex(index)}
                      className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold transition-all ${
                        selectedDayIndex === index
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-left">
                        <div className="text-xs opacity-80 mb-0.5">
                          DAY {day.dayNumber}
                        </div>
                        <div className="font-bold">{formatDate(day.date)}</div>
                        {dayActivities > 0 && (
                          <div className="text-xs opacity-90 mt-1">
                            {dayActivities}개 · {dayCost.toLocaleString()}원
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 선택된 날짜의 일정 */}
            <DaySchedule
              day={selectedDay}
              onUpdateActivities={(activities) =>
                handleUpdateDay(selectedDayIndex, activities)
              }
            />
          </div>

          {/* 오른쪽: 사이드바 */}
          <div className="space-y-6">
            {/* 예산 트래커 */}
            <BudgetTracker budget={plan.budget} totalSpent={plan.totalSpent} />

            {/* 체크리스트 */}
            <Checklist planId={plan.id} />

            {/* 전체 통계 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>여행 통계</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">총 기간</span>
                  <span className="font-semibold">{plan.days.length}일</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">총 일정</span>
                  <span className="font-semibold">
                    {plan.days.reduce((sum, d) => sum + d.activities.length, 0)}
                    개
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 일비</span>
                  <span className="font-semibold">
                    {Math.round(
                      plan.totalSpent / plan.days.length,
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>

            {/* 빠른 팁 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>팁</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>일정을 시간 순으로 추가하면 동선이 보기 쉬워요</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>비용을 입력하면 실시간으로 예산이 업데이트돼요</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>메모에 예약 번호나 주의사항을 적어두세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
