'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TravelPlan, DayPlan } from '../../types/planner'
import { plannerStorage, calculateDays } from '../../lib/plannerStorage'

export default function NewPlannerPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    budget: '',
    groupMembers: [] as string[],
  })

  const [memberQuery, setMemberQuery] = useState('') 

  const addGroupMember = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    setFormData((prev) => {
      if (prev.groupMembers.includes(trimmed)) return prev // ✅ 중복 방지
      return { ...prev, groupMembers: [...prev.groupMembers, trimmed] }
    })
  }

    const removeGroupMember = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((m) => m !== name),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numDays = calculateDays(formData.startDate, formData.endDate)
    const days: DayPlan[] = []

    // 각 날짜별 빈 일정 생성
    for (let i = 0; i < numDays; i++) {
      const date = new Date(formData.startDate)
      date.setDate(date.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayNumber: i + 1,
        activities: [],
      })
    }

    const newPlan: TravelPlan = {
      id: Date.now().toString(),
      title: formData.title,
      destination: formData.destination,
      country: formData.country,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: Number(formData.budget),
      totalSpent: 0,
      days,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    plannerStorage.savePlan(newPlan)
    router.push(`/planner/${newPlan.id}`)
  }
  const MEMBER_PALETTES = [
  { from: '#7C3AED', to: '#A855F7' }, // 보라(첨부 이미지 느낌)
  { from: '#2563EB', to: '#22D3EE' }, // 블루-시안
  { from: '#10B981', to: '#34D399' }, // 그린
  { from: '#F97316', to: '#FB7185' }, // 오렌지-핑크
  { from: '#F59E0B', to: '#FDE047' }, // 옐로
  { from: '#0EA5E9', to: '#6366F1' }, // 스카이-인디고
  { from: '#EC4899', to: '#A855F7' }, // 핑크-보라
  ]

  const hashString = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
  
// 원형 스타일(그라데이션 + 하이라이트 + 쉐도우)
const memberBubbleStyle = (name: string) => {
  const clean = name.trim()
  const p = MEMBER_PALETTES[hashString(clean) % MEMBER_PALETTES.length]

  return {
    background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
    boxShadow: '0 10px 22px rgba(17, 24, 39, 0.14)', // 깔끔한 그림자(톤다운)
  } as React.CSSProperties
}

// 원 안에 표시할 텍스트(너무 길면 3글자 정도로)
const memberLabel = (name: string) => {
  const clean = name.trim()
  if (!clean) return ''
  // 이메일/아이디면 @ 앞만
  const base = clean.includes('@') ? clean.split('@')[0] : clean
  // 공백 제거 후 3글자(한국 이름이면 보통 2~3글자 적당)
  return base.replace(/\s+/g, '').slice(0, 3)
}
  const isStep1Valid = formData.destination && formData.country
  const isStep2Valid = formData.startDate && formData.endDate
  const isStep3Valid = formData.title && formData.budget

// 공백 제거 + 앞뒤 트림(원하면 공백 유지로 바꿔도 됨)
const cleanMemberText = (name: string) => name.trim().replace(/\s+/g, '')

// 모바일(작을 때): 최대 3글자(+…)
const memberLabelSmall = (name: string) => {
  const t = cleanMemberText(name)
  return t.length > 3 ? `${t.slice(0, 3)}…` : t
}

// 큰 화면(클 때): 5글자씩 2줄
const memberLabelTwoLines = (name: string) => {
  const t = cleanMemberText(name)
  const line1 = t.slice(0, 5)
  const line2 = t.slice(5, 10)
  return [line1, line2].filter(Boolean) // 빈 줄 제거
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            새로운 여행 계획하기
          </h1>
          <p className="text-gray-600">
            당신만의 완벽한 여행을 만들어보세요 ✈️
          </p>
        </div>

        {/* 진행 표시 */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 h-1 mx-2 rounded-full transition-all ${
                    step > s
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 폼 카드 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          {/* Step 1: 목적지 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 어디로 가시나요?
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  placeholder="예) 도쿄, 파리, 제주도"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌏 국가
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="예) 일본, 프랑스, 대한민국"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 2: 날짜 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 출발 날짜
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 도착 날짜
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                />
              </div>

              {formData.startDate && formData.endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-700 font-semibold">
                    총 {calculateDays(formData.startDate, formData.endDate)}일
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: 동료추가 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 함께 떠날 친구
                </label>

                  {formData.groupMembers.length > 0 && (   //동그라미 추가
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 justify-items-center w-fit mx-auto mb-3">
                {formData.groupMembers.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => removeGroupMember(name)} // 클릭 제거(원치 않으면 이 줄 삭제)
                    className="
                      relative
                      w-14 h-14 sm:w-20 sm:h-20
                      rounded-full
                      text-white font-semibold
                      flex items-center justify-center
                      ring-1 ring-white/35
                      transition-transform duration-150
                      hover:scale-[1.03] active:scale-[0.98]
                    "
                    style={memberBubbleStyle(name)}
                    title={name}

                  >
                {/* ✅ 작은 화면: 3글자 1줄 */}
                <span className="sm:hidden drop-shadow-sm text-sm">
                  {memberLabelSmall(name)}
                </span>

                {/* ✅ 큰 화면: 5글자씩 2줄 */}
                <span className="hidden sm:flex flex-col items-center justify-center drop-shadow-sm text-xs sm:text-sm leading-tight text-center px-2">
                  {memberLabelTwoLines(name).map((line, idx) => (
                    <span key={idx} className="block whitespace-nowrap break-keep">
                      {line}
                    </span>
                  ))}
                </span>
                  </button>
                ))}


              </div>
            )}

                  <input
                  type="text"
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  onKeyDown={(e) => {
                    // 한글 입력 조합 중 Enter 방지
                    if ((e.nativeEvent as any).isComposing) return

                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      addGroupMember(memberQuery)
                      setMemberQuery('')
                    }

                    // 입력 비었을 때 Backspace로 마지막 멤버 삭제(원치 않으면 이 블록 삭제)
                    if (e.key === 'Backspace' && memberQuery === '') {
                      setFormData((prev) => ({
                        ...prev,
                        groupMembers: prev.groupMembers.slice(0, -1),
                      }))
                    }
                  }}
                  placeholder="이름 혹은 아이디로 추가"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                  autoFocus
                />
              </div>

              
            </div>
          )}

          {/* Step 3: 제목 & 예산 */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ✏️ 여행 제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="예) 도쿄 벚꽃 여행, 파리 로맨틱 투어"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 예산 (원)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  placeholder="1000000"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                />
              </div>

              {formData.budget && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-semibold">
                    예산: {Number(formData.budget).toLocaleString()}원
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                이전
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
                }
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                다음
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStep3Valid}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                플랜 만들기 🎉
              </button>
            )}
          </div>
        </form>

        {/* 취소 버튼 */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
