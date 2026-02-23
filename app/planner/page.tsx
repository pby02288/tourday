'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TravelPlan } from '../types/planner'
import { plannerStorage } from '../lib/plannerStorage'
import PlanCard from '../components/planner/PlanCard'
import NewPlanButton from '../components/NewPlanButton'


type FilterType = 'all' | 'upcoming' | 'past'

export default function PlannerListPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<TravelPlan[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = () => {
    const allPlans = plannerStorage.getAllPlans()
    // 최신순 정렬
    const sorted = allPlans.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setPlans(sorted)
  }

  const handleDelete = (planId: string) => {
    plannerStorage.deletePlan(planId)
    loadPlans()
  }

  // 필터링
  const filteredPlans = plans.filter((plan) => {
    // 검색어 필터
    const matchesSearch =
      !searchQuery ||
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.destination.toLowerCase().includes(searchQuery.toLowerCase())

    // 날짜 필터
    const today = new Date()
    const startDate = new Date(plan.startDate)
    const isPast = startDate < today

    if (filter === 'upcoming' && isPast) return false
    if (filter === 'past' && !isPast) return false

    return matchesSearch
  })

  const upcomingCount = plans.filter(
    (p) => new Date(p.startDate) >= new Date(),
  ).length
  const pastCount = plans.filter(
    (p) => new Date(p.startDate) < new Date(),
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                내 여행 플랜
              </h1>
              <p className="text-gray-600">
                {plans.length === 0
                  ? '첫 여행을 계획해보세요!'
                  : `총 ${plans.length}개의 플랜`}
              </p>
            </div>

            <Link
              href="/planner/new"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>새 플랜 만들기</span>
            </Link>
          </div>

          {/* 검색 & 필터 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="플랜 제목이나 목적지로 검색..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* 필터 */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                전체 ({plans.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === 'upcoming'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                예정 ({upcomingCount})
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filter === 'past'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                완료 ({pastCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 플랜 목록 */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {filteredPlans.length === 0 ? (
          // 빈 상태
          <div className="text-center py-20">
            <div className="text-8xl mb-6">✈️</div>
            {searchQuery ? (
              <>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                  검색 결과가 없습니다
                </h2>
                <p className="text-gray-500 mb-6">다른 검색어로 시도해보세요</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                  {filter === 'all' && '아직 플랜이 없습니다'}
                  {filter === 'upcoming' && '예정된 여행이 없습니다'}
                  {filter === 'past' && '지난 여행이 없습니다'}
                </h2>
                <p className="text-gray-500 mb-6">
                  {filter === 'all' && '첫 여행 계획을 만들어보세요!'}
                  {filter === 'upcoming' && '새로운 여행을 계획해보세요!'}
                  {filter === 'past' && '아직 완료된 여행이 없습니다'}
                </p>


                {filter === 'all' && (   //새 플랜 만들기 버튼
                  <NewPlanButton />
                )}


                {/*filter === 'all' && (   //새 플랜 만들기 버튼
                  <Link
                    href="/planner/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>새 플랜 만들기</span>
                  </Link>
                )*/}
              </>
            )}
          </div>
        ) : (
          // 플랜 카드 그리드
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onDelete={() => handleDelete(plan.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 플로팅 버튼 (모바일) */}
      <Link
        href="/planner/new"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all lg:hidden"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
    </div>
  )
}
