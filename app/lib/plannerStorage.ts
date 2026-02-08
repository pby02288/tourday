// app/lib/plannerStorage.ts
'use client'

import { TravelPlan } from '@/app/types/planner'

const STORAGE_KEY = 'tourday_plans'

export const plannerStorage = {
  // 모든 플랜 가져오기
  getAllPlans: (): TravelPlan[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  // 특정 플랜 가져오기
  getPlan: (id: string): TravelPlan | null => {
    const plans = plannerStorage.getAllPlans()
    return plans.find((p) => p.id === id) || null
  },

  // 플랜 저장
  savePlan: (plan: TravelPlan): void => {
    const plans = plannerStorage.getAllPlans()
    const existingIndex = plans.findIndex((p) => p.id === plan.id)

    if (existingIndex >= 0) {
      plans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() }
    } else {
      plans.push(plan)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  },

  // 플랜 삭제
  deletePlan: (id: string): void => {
    const plans = plannerStorage.getAllPlans()
    const filtered = plans.filter((p) => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },
}

// 날짜 계산 유틸
export const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // 당일 포함
}

// 날짜 포맷팅
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${month}/${day} (${weekday})`
}

// 예산 포맷팅
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}
