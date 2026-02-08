'use client'

import { useState, useEffect } from 'react'

const banners = [
  {
    id: 1,
    title: '겨울 특가! 홋카이도 3박 4일',
    subtitle: '항공권 + 호텔 특별 할인',
    bgColor: 'from-blue-400 to-blue-700',
    image: '🏔️',
  },
  {
    id: 2,
    title: '동남아 휴양지 추천',
    subtitle: '발리, 푸켓, 다낭 인기 패키지',
    bgColor: 'from-green-400 to-teal-600',
    image: '🏝️',
  },
  {
    id: 3,
    title: '서울에서 출발하는 속초 여행',
    subtitle: '가을의 기억을 그대로 남기다',
    bgColor: 'from-orange-400 to-red-500',
    image: '🌅',
  },
  {
    id: 4,
    title: '유럽 배낭여행 가이드',
    subtitle: '파리, 런던, 로마 완벽 코스',
    bgColor: 'from-purple-500 to-pink-600',
    image: '🗼',
  },
  {
    id: 5,
    title: '국내 숨은 맛집 투어',
    subtitle: '전국 미슐랭 가이드 맛집',
    bgColor: 'from-yellow-400 to-orange-500',
    image: '🍜',
  },
]

export default function BannerSliderDots() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const totalDuration = 4000 // 4초

  useEffect(() => {
    const tick = 50
    const step = (tick / totalDuration) * 100

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setCurrentIndex((i) => (i + 1) % banners.length)
          return 0
        }
        return prev + step
      })
    }, tick)

    return () => clearInterval(progressInterval)
  }, [])

  const goTo = (index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden shadow-xl">
      {/* 배너 페이드 전환 */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 bg-gradient-to-br ${banner.bgColor} transition-opacity duration-700 ease-in-out`}
          style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
        >
          {/* 배경 이모지 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[220px] opacity-10">{banner.image}</span>
          </div>
        </div>
      ))}

      {/* 중앙 텍스트 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8">
        <h2 className="text-white text-4xl font-bold drop-shadow mb-3">
          {banners[currentIndex].title}
        </h2>
        <p className="text-white/80 text-lg drop-shadow">
          {banners[currentIndex].subtitle}
        </p>
        <button className="mt-6 px-6 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full text-sm font-semibold transition">
          자세히 보기 →
        </button>
      </div>

      {/* 하단 원형 도트 인디케이터 + 진행 원형 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className="relative flex items-center justify-center"
          >
            {/* 진행 원형 (svg) */}
            <svg width="28" height="28" className="absolute -rotate-90">
              <circle
                cx="14"
                cy="14"
                r="11"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              {index === currentIndex && (
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 11}`}
                  strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all"
                  style={{ transitionDuration: '50ms' }}
                />
              )}
            </svg>

            {/* 내부 원 도트 */}
            <div
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-2.5 h-2.5 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}