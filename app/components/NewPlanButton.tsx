'use client'

/**
 * ✅ NewPlannerPage(네가 준 코드) 로직을 그대로 “모달 버전”으로 옮긴 컴포넌트
 * - 왼쪽: Step 안내(세로)
 * - 오른쪽: 입력 폼(네 코드 Step 1~4 그대로)
 * - 배경 클릭/ESC로 닫기 + 모달 열릴 때 body 스크롤 잠금
 * - 마지막 Step에서 “플랜 만들기” 누르면 localStorage 저장 후 상세 페이지로 이동
 */

import { useEffect, useMemo, useState, type FormEvent, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { TravelPlan, DayPlan } from '../types/planner'
import { plannerStorage, calculateDays } from '../lib/plannerStorage'

// 달력용
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ko } from "date-fns/locale"
import { format } from "date-fns"

type Step = 1 | 2 | 3 | 4 | 5 | 6

export default function NewPlanButton() {
  const router = useRouter()

  // ✅ 모달 열림/닫힘
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)

  // ✅ 네가 준 코드 그대로 formData 구조 유지
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    currency: "KRW",
    budget: '',
    groupMembers: [] as string[],
    step4 : '',
    step5 : '',
    step6 : '',
  })

  // ✅ 달력에서 선택한 기간(출발~도착)
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const toYmd = (d: Date) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
  }
  const pretty = (ymd: string) => (ymd ? ymd.replaceAll('-', '.') : '')
  const [month, setMonth] = useState<Date>(new Date())

  // ✅ 멤버 입력 검색어(네 코드 그대로)
  const [memberQuery, setMemberQuery] = useState('')

  // ✅ 왼쪽 Step 설명(원하면 문구만 바꿔)
  const steps = useMemo(
    () => [
      { id: 1 as const, title: 'Step 1', label: '기본정보', desc: '여행 준비를 시작해요' }, // 여행지 이름, 국가, 위치, 예산까지 입력
      { id: 2 as const, title: 'Step 2', label: '날짜', desc: '출발/도착일을 정해요' }, // 친구리스트 ㅇㅋ + 건너뛰기
      { id: 3 as const, title: 'Step 3', label: '친구 추가', desc: '함께 떠날 친구를 추가해요' }, // 이건 입력한 정보들 정리해서 보여주기
      { id: 4 as const, title: 'Step 4', label: '추천 여행지', desc: '자주가는 여행지를 추천해줄게요' }, // 여행지 설정하기 + 건너뛰기 + 추천 여행코스 + 추천 여행지
      { id: 5 as const, title: 'Step 5', label: '추천 체크리스트', desc: '여행 전 준비사항을 추천해줄게요' }, // 체크리스트 추가하기 + 건너뛰기 + 이건 나중에 추천 상품 ㅎㅎ
      { id: 6 as const, title: 'Step 6', label: '여행준비 완료!', desc: '여행 준비를 마무리 하세요' }, // 이건 입력한 정보들 정리해서 보여주기
    ],
    [],
  )

  // ✅ 유효성(네 코드 흐름 동일)
  const isStep1Valid = !!formData.title && !!formData.destination && !!formData.country
  const isStep2Valid = !!formData.startDate && !!formData.endDate
  const isSkip = (step === 3 && formData.groupMembers.length === 0) || (step === 4 && !formData.step4) || (step === 5 && !formData.step5)
  const isStep6Valid = !!formData.step6

  // ✅ 모달 열렸을 때: 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // ✅ 모달 닫을 때 상태 초기화(원하면 reset 안 하도록 바꿀 수 있음)
  const closeModal = () => {
    setOpen(false)
    setStep(1)
    setRange(undefined)
    setFormData({
      title: '',
      destination: '',
      country: '',
      startDate: '',
      endDate: '',
      currency: "KRW",
      budget: '',
      groupMembers: [],
      step4 : '',
      step5 : '',
      step6 : '',
    })
    setMemberQuery('')
  }

  // =========================
  // ✅ (네 코드 그대로) 멤버 추가/삭제 + 원형 스타일
  // =========================

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

  const MEMBER_PALETTES = [
    { from: '#7C3AED', to: '#A855F7' }, // 보라
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

  const memberBubbleStyle = (name: string): CSSProperties => {
    const clean = name.trim()
    const p = MEMBER_PALETTES[hashString(clean) % MEMBER_PALETTES.length]
    return {
      background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
      boxShadow: '0 10px 22px rgba(17, 24, 39, 0.14)',
    }
  }

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
    return [line1, line2].filter(Boolean)
  }

  // =========================
  // ✅ 통화리스트
  // =========================

  const CURRENCY_OPTIONS = [
    { code: "KRW", label: "KRW" },
    { code: "JPY", label: "JPY" },
    { code: "CNY", label: "CNY" },
    { code: "USD", label: "USD" },
    { code: "EUR", label: "EUR" },
  ] as const

  const CURRENCY_DISPLAY: Record<string, { suffix: string; fractionDigits: number }> = {
  KRW: { suffix: " 원", fractionDigits: 0 },
  JPY: { suffix: " 엔", fractionDigits: 0 },
  CNY: { suffix: " 위안", fractionDigits: 0 },
  USD: { suffix: " 달러", fractionDigits: 2 },
  EUR: { suffix: " 유로", fractionDigits: 2 },
  }


  // =========================
  // ✅ Step 이동(네 코드 버튼 로직과 동일한 기준)
  // =========================

  const goNext = () => {
    if (step === 1 && !isStep1Valid) return
    if (step === 2 && !isStep2Valid) return
    if (step < 6) setStep((prev) => (prev + 1) as Step)
  }

  const goPrev = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step)
  }

  // =========================
  // ✅ (네 코드 그대로) 제출: TravelPlan 생성 → storage 저장 → 상세로 이동
  // =========================

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isStep1Valid || !isStep2Valid || !isStep6Valid) return

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

    // ✅ 모달 닫고 이동
    closeModal()
    router.push(`/planner/${newPlan.id}`)
  }

  // =========================
  // ✅ UI
  // =========================

  return (
    <>
      {/* ✅ 트리거 버튼(기존 페이지 버튼 톤 유지) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>새 플랜 만들기</span>
      </button>

      {/* ✅ 모달 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 딤 */}
          <div className="absolute inset-0 bg-black/40" />

          {/* 모달 박스 */}
          <div
            className="relative z-10 w-[92%] max-w-4xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 헤더 */}
            <div className="relative flex items-start justify-between px-8 pt-7">
              <div>
                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl font-bold text-gray-900">새 플랜 만들기</div>
                <div className="mt-1 text-sm text-gray-500">필요한 정보를 입력하고 플랜을 생성해요.</div>
              </div>
            </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 본문: 좌 Step / 우 폼 */}
            <div className="mt-6 grid grid-cols-12">
              {/* 왼쪽 Step */}
              <div className="col-span-12 md:col-span-4 bg-gray-50 border-t md:border-t-0 md:border-r border-gray-100 px-6 py-6 text-left">
                <div className="relative">
                  {/* 세로 라인 */}
                  <div className="absolute left-[14px] top-3 bottom-3 w-px bg-gray-200" />

                  <div className="space-y-6">
                    {steps.map((s) => {
                      const active = s.id === step
                      const done = s.id < step

                      return (
                        <div key={s.id} className="flex gap-3">
                          <div className="relative">
                            <div
                              className={[
                                'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs',
                                active
                                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow'
                                  : done
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow'
                                    : 'bg-white border border-gray-300 text-gray-400',
                              ].join(' ')}
                            >
                              {s.id}
                            </div>
                          </div>

                          <div className="pt-0.5">
                            <div className={['text-sm font-semibold', active ? 'text-gray-900' : 'text-gray-500'].join(' ')}>
                              {s.title} · {s.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 오른쪽: 네 코드 폼 그대로 */}
              <div className="col-span-12 md:col-span-8 border-t border-gray-100 px-8 py-6 flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                  <div className="flex-1">
                  {/* Step 1: 목적지 */}
                  {step === 1 && (
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
                          autoFocus
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📍 어디로 가시나요?
                        </label>

                        {/* ✅ 반응형: 모바일은 1열로 쌓이고(md 미만), md 이상부터 2열 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* ✅ 왼쪽: 국가 */}
                          <div>
                            <input
                              type="text"
                              value={formData.country}
                              onChange={(e) =>
                                setFormData({ ...formData, country: e.target.value })
                              }
                              placeholder="국가 (예: 일본, 프랑스, 대한민국)"
                              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                            />
                          </div>

                          {/* ✅ 오른쪽: 지역(도시/지역명) */}
                          <div>
                            <input
                              type="text"
                              value={formData.destination}
                              onChange={(e) =>
                                setFormData({ ...formData, destination: e.target.value })
                              }
                              placeholder="지역 (예: 도쿄, 파리, 제주도)"
                              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg"
                              autoFocus
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          💰 예산
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        {/* ✅ 통화 선택 (왼쪽 1/5) */}
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="sm:col-span-1 w-full px-3 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg bg-white"
                        >
                          {CURRENCY_OPTIONS.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                          <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            placeholder="예) 1,000,000"
                            className="sm:col-span-4 w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition text-lg no-spinner"
                            min={0}
                          />
                        </div>
                      </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                          <p className="text-green-700 font-semibold">
                            {/*
                              ✅ currency에 따라 접미사/소수점 자리수 변경
                              - 없으면(맵에 없는 통화) 접미사는 통화 코드 그대로 보여줌(예: "THB")
                            */}
                            {(() => {
                              const meta = CURRENCY_DISPLAY[formData.currency]
                              const suffix = meta?.suffix ?? formData.currency
                              const digits = meta?.fractionDigits ?? 0

                              const amount = Number(formData.budget)
                              const formatted = amount.toLocaleString(undefined, {
                                minimumFractionDigits: digits,
                                maximumFractionDigits: digits,
                              })

                              return `예산 : ${formatted}${suffix}`
                            })()}
                          </p>
                        </div>
                    </div>
                  )}

                  {/* Step 2: 날짜 (달력에서 범위 선택) */}
                  {step === 2 && (
                    <div className="space-y-6">
                      {/* ✅ 선택 결과 표시(왼쪽: 출발 / 오른쪽: 도착) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="block text-sm font-semibold text-gray-700 mb-2">
                            📅 출발 날짜
                          </div>

                          {/* input처럼 보이지만 실제 선택은 아래 달력에서 */}
                          <div className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-lg flex items-center justify-between">
                            <span className={formData.startDate ? 'text-gray-900' : 'text-gray-400'}>
                              {formData.startDate ? pretty(formData.startDate) : '년-월-일'}
                            </span>
                            <span className="text-gray-400">📆</span>
                          </div>
                        </div>

                        <div>
                          <div className="block text-sm font-semibold text-gray-700 mb-2">
                            📅 도착 날짜
                          </div>

                          <div className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-lg flex items-center justify-between">
                            <span className={formData.endDate ? 'text-gray-900' : 'text-gray-400'}>
                              {formData.endDate ? pretty(formData.endDate) : '년-월-일'}
                            </span>
                            <span className="text-gray-400">📆</span>
                          </div>
                        </div>
                      </div>

                      {/* ✅ 실제 선택 달력(출발~도착 범위 선택) */}
                      <div className="border-2 border-gray-200 rounded-2xl p-4">
                        <div className="flex justify-center">
                        <DayPicker
                          mode="range"                 // ✅ 범위 선택 모드
                          selected={range}             // ✅ 현재 선택된 범위 표시
                          month={month}
                          onMonthChange={setMonth}
                          onDayClick={(day, modifiers) => {
                            if (modifiers.outside) {
                              setMonth(new Date(day.getFullYear(), day.getMonth(), 1))}}}
                          fixedWeeks
                          showOutsideDays
                          locale={ko}                     // ✅ 한국어 로케일
                          modifiersClassNames={{outside: "text-gray-300 opacity-60"}}
                          onSelect={(nextRange) => {   // ✅ 날짜 클릭할 때마다 실행
                            setRange(nextRange)
                            
                            

                            // 선택 결과를 formData(startDate/endDate)로 반영
                            setFormData((prev) => ({
                              ...prev,
                              startDate: nextRange?.from ? toYmd(nextRange.from) : '',
                              endDate: nextRange?.to ? toYmd(nextRange.to) : '',
                            }))
                          }}
                          // ✅ 도착일은 출발일 이후로만 찍히게 UX 강화(선택은 range 모드가 알아서 해주지만, 시각적으로도 막아줌)
                          disabled={(date) => {
                            if (!range?.from) return false
                            // 출발일을 찍은 상태에서, 출발일 이전 날짜는 비활성화
                            const start = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate())
                            const cur = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                            return cur < start
                          }}
                        />
                        </div>
                      </div>

                      {/* 기존 총 일수 표시 그대로 */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                        <p className="text-blue-700 font-semibold">
                          {(() => {
                            const days =
                              formData.startDate && formData.endDate
                                ? Number(calculateDays(formData.startDate, formData.endDate)) || 0
                                : 0

                            if (days <= 0) return "0일"
                            if (days === 1) return "1일"
                            return `${days - 1}박 ${days}일`
                          })()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: 동료추가 */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                          👥 함께 떠날 친구
                        </label>
                          {formData.groupMembers.length > 0 && (
                        <div className="block text-center font-semibold text-gray-700 mb-2">
                          총 {formData.groupMembers.length}명
                        </div>
                        )}

                        {formData.groupMembers.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 justify-items-center w-fit mx-auto mb-3">
                            {formData.groupMembers.slice(0,14).map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => removeGroupMember(name)}
                                className="
                                  group relative
                                  w-14 h-14 sm:w-20 sm:h-20
                                  rounded-full
                                  text-white font-semibold
                                  flex items-center justify-center
                                  ring-1 ring-white/35
                                  transition-transform duration-150
                                  hover:scale-[1.03] active:scale-[0.98]"
                                style={memberBubbleStyle(name)}
                                title={name}
                              >
                                {/* ✅ hover 시 빨간 오버레이 */}
                                <span
                                  className="pointer-events-none absolute inset-0 rounded-full bg-gray-900/65 opacity-0 group-hover:opacity-100 transition-opacity"
                                />

                                {/* ✅ hover 시 가운데 '-' 표시 */}
                                <span
                                  className="pointer-events-none absolute inset-0 flex items-center justify-center
                                            text-white font-black text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                                >
                                 &minus; 
                                </span>

                                {/* ✅ 작은 화면: 3글자 1줄 */}
                                <span className="sm:hidden drop-shadow-sm text-sm transition-opacity group-hover:opacity-0">
                                  {memberLabelSmall(name)}
                                </span>

                                {/* ✅ 큰 화면: 5글자씩 2줄 */}
                                <span className="hidden sm:flex flex-col items-center justify-center drop-shadow-sm text-xs sm:text-sm leading-tight text-center px-2 transition-opacity group-hover:opacity-0">
                                  {memberLabelTwoLines(name).map((line, idx) => (
                                    <span key={idx} className="block whitespace-nowrap break-keep">
                                      {line}
                                    </span>
                                  ))}
                                </span>
                              </button>
                            ))}
                                {/* ✅ 15번째부터는 +n 으로 1개만 표시 */}
                            {formData.groupMembers.length > 14 && (
                              <div
                                className="
                                  w-14 h-14 sm:w-20 sm:h-20
                                  rounded-full
                                  flex items-center justify-center
                                  font-bold
                                  text-gray-600
                                  bg-gray-100
                                  ring-1 ring-gray-200
                                  select-none
                                "
                                title={`추가 ${formData.groupMembers.length - 14}명`}
                              >
                                +{formData.groupMembers.length - 14}
                              </div>
                            )}
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

                  {/* Step 4: 제목 & 예산 */}
                  {step === 4 && (
                    <div className="space-y-6">


                    </div>
                  )}
                  </div>

                  {/* 하단 버튼(네 코드 흐름 유지) */}
                    <div className="mt-auto flex items-center justify-end pt-4">
                      <div className="flex gap-2">
                        {step > 1 && (
                          <button
                            type="button"
                            onClick={goPrev}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition"
                          >
                            이전
                          </button>
                        )}

                        {step < 6 ? (
                          <button
                            type="button"
                            onClick={goNext}
                            disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 6 && !isStep6Valid)}
                            className={
                              isSkip
                                ? "px-5 py-2.5 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                : "px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                            }
                          >
                            {isSkip ? "건너뛰기" : "다음"}
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={!isStep6Valid}
                            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            플랜 만들기 🎉
                          </button>
                        )}
                      </div>
                    </div>
                </form>
              </div>
            </div>

            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  )
}