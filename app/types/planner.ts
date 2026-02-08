// app/types/planner.ts

export interface Activity {
  id: string
  time: string // "09:00"
  title: string
  category:
    | 'flight'
    | 'hotel'
    | 'restaurant'
    | 'attraction'
    | 'shopping'
    | 'etc'
  location?: string
  cost?: number
  memo?: string
  duration?: number // 분 단위
}

export interface DayPlan {
  date: string // "2024-03-15"
  dayNumber: number // 1, 2, 3...
  activities: Activity[]
}

export interface TravelPlan {
  id: string
  title: string
  destination: string
  country: string
  startDate: string // "2024-03-15"
  endDate: string // "2024-03-20"
  budget: number
  totalSpent: number
  days: DayPlan[]
  createdAt: string
  updatedAt: string
}

export interface Checklist {
  id: string
  planId: string
  items: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

// 카테고리별 아이콘 & 색상
export const CATEGORY_INFO = {
  flight: { icon: '✈️', label: '항공', color: 'blue' },
  hotel: { icon: '🏨', label: '숙박', color: 'purple' },
  restaurant: { icon: '🍽️', label: '식사', color: 'orange' },
  attraction: { icon: '🎭', label: '관광', color: 'green' },
  shopping: { icon: '🛍️', label: '쇼핑', color: 'pink' },
  etc: { icon: '📝', label: '기타', color: 'gray' },
} as const

export type ActivityCategory = keyof typeof CATEGORY_INFO
