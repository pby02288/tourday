'use client'

import { useState, useEffect } from 'react'

const banners = [
  {
    id: 1,
    title: '겨울 특가',
    subtitle: '홋카이도 3박 4일',
    tag: '최대 40% 할인',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    emoji: '🏔️',
    accentColor: 'rgb(147, 51, 234)',
  },
  {
    id: 2,
    title: '동남아 휴양',
    subtitle: '발리 · 푸켓 · 다낭',
    tag: '인기 패키지',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    emoji: '🏝️',
    accentColor: 'rgb(20, 184, 166)',
  },
  {
    id: 3,
    title: '속초 감성 여행',
    subtitle: '서울 출발 당일치기',
    tag: '가을 시즌',
    gradient: 'from-orange-400 via-red-500 to-pink-500',
    emoji: '🌅',
    accentColor: 'rgb(239, 68, 68)',
  },
  {
    id: 4,
    title: '유럽 배낭여행',
    subtitle: '파리 · 런던 · 로마',
    tag: '완벽 코스',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    emoji: '🗼',
    accentColor: 'rgb(217, 70, 239)',
  },
  {
    id: 5,
    title: '미슐랭 맛집',
    subtitle: '전국 숨은 맛집 투어',
    tag: 'NEW',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    emoji: '🍜',
    accentColor: 'rgb(249, 115, 22)',
  },
]

export default function BannerSliderModern() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const current = banners[currentIndex]

  return (
    <div className="relative w-full overflow-hidden">
      {/* 메인 슬라이더 */}
      <div className="relative h-[420px] rounded-3xl overflow-hidden">
        {/* 배경 그래디언트 + 애니메이션 노이즈 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} transition-opacity duration-1000 ease-out`}
              style={{ opacity: index === currentIndex ? 0.95 : 0 }}
            />
          ))}
        </div>

        {/* 동적 그리드 패턴 */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* 플로팅 도형 요소들 */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-10 right-20 w-32 h-32 rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: current.accentColor,
              opacity: 0.15,
              transform: `scale(${currentIndex % 2 === 0 ? 1.2 : 0.8})`,
            }}
          />
          <div
            className="absolute bottom-20 left-16 w-40 h-40 rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: current.accentColor,
              opacity: 0.1,
              transform: `scale(${currentIndex % 2 === 0 ? 0.8 : 1.2})`,
            }}
          />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="relative h-full flex items-center px-12 md:px-16">
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
            {/* 왼쪽: 텍스트 */}
            <div className="flex-1 z-10">
              {/* 태그 */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border transition-all duration-700 mb-5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  transform:
                    direction === 1 ? 'translateX(0)' : 'translateX(0)',
                  opacity: 1,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-wide">
                  {current.tag}
                </span>
              </div>

              {/* 제목 */}
              <h2
                className="text-white text-6xl font-bold mb-3 leading-tight transition-all duration-700"
                style={{
                  transform: `translateY(${direction === 0 ? 0 : direction === 1 ? '0px' : '0px'})`,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {current.title}
              </h2>

              {/* 부제목 */}
              <p
                className="text-white/90 text-xl font-medium mb-8 transition-all duration-700"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                {current.subtitle}
              </p>

              {/* CTA 버튼 */}
              <button className="group px-7 py-3.5 bg-white text-gray-900 rounded-full font-semibold flex items-center gap-2 hover:gap-3 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                <span>자세히 보기</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            {/* 오른쪽: 이모지 애니메이션 */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div
                className="relative transition-all duration-700 ease-out"
                style={{
                  transform: `scale(${1}) rotate(${currentIndex * 5}deg)`,
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                }}
              >
                <div className="text-[200px] animate-bounce-slow">
                  {current.emoji}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 진행 바 인디케이터 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-white transition-all ease-linear"
            style={{
              width: '20%',
              marginLeft: `${currentIndex * 20}%`,
            }}
          />
        </div>
      </div>

      {/* 하단 도트 네비게이션 */}
      <div className="flex justify-center gap-3 mt-6">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            onClick={() => goTo(index)}
            className="group relative"
          >
            {/* 배경 원 */}
            <div
              className={`w-12 h-12 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-br shadow-lg scale-100'
                  : 'bg-gray-200 hover:bg-gray-300 scale-90 opacity-60 hover:opacity-100'
              }`}
              style={
                index === currentIndex
                  ? {
                      backgroundImage: `linear-gradient(to bottom right, ${banner.gradient
                        .replace('from-', '')
                        .replace('via-', '')
                        .replace('to-', '')
                        .split(' ')
                        .map((c) => {
                          const colors: Record<string, string> = {
                            'indigo-500': '#6366f1',
                            'purple-500': '#a855f7',
                            'pink-500': '#ec4899',
                            'emerald-400': '#34d399',
                            'teal-500': '#14b8a6',
                            'cyan-500': '#06b6d4',
                            'orange-400': '#fb923c',
                            'red-500': '#ef4444',
                            'violet-500': '#8b5cf6',
                            'fuchsia-500': '#d946ef',
                            'amber-400': '#fbbf24',
                          }
                          return colors[c] || '#000'
                        })
                        .join(', ')})`,
                    }
                  : {}
              }
            />

            {/* 이모지 */}
            <div className="absolute inset-0 flex items-center justify-center text-xl">
              {banner.emoji}
            </div>

            {/* 호버 시 제목 툴팁 */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {banner.title}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </button>
        ))}
      </div>

      {/* 좌우 화살표 버튼 (선택사항) */}
      <button
        onClick={() =>
          goTo((currentIndex - 1 + banners.length) % banners.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
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
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => goTo((currentIndex + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
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
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
