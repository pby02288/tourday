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

export default function BannerSliderStack() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % banners.length)

  // 스택에서 보여할 카드: 현재, 다음, 그 다음
  const getStackIndex = (i: number) => {
    if (i === currentIndex) return 0          // 앞
    if (i === (currentIndex + 1) % banners.length) return 1 // 중간
    if (i === (currentIndex + 2) % banners.length) return 2 // 뒤
    return -1 // 숨김
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* 스택 카드 영역 */}
      <div className="relative w-full h-[340px]">
        {banners.map((banner, index) => {
          const stackPos = getStackIndex(index)
          if (stackPos === -1) return null

          return (
            <div
              key={banner.id}
              className="absolute left-1/2 w-[85%] h-[300px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              style={{
                transform: `
                  translateX(-50%)
                  translateY(${stackPos * 16}px)
                  scale(${1 - stackPos * 0.06})
                `,
                zIndex: 3 - stackPos,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                top: 0,
              }}
              onClick={() => stackPos !== 0 && setCurrentIndex(index)}
            >
              {/* 배경 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.bgColor}`} />

              {/* 배경 이모지 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[180px] opacity-10">{banner.image}</span>
              </div>

              {/* 텍스트 (앞장카드만 보임) */}
              {stackPos === 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-7 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <h2 className="text-white text-2xl font-bold drop-shadow mb-1">{banner.title}</h2>
                  <p className="text-white/80 text-sm drop-shadow">{banner.subtitle}</p>
                </div>
              )}

              {/* 뒤장카드 블러 오버레이 */}
              {stackPos !== 0 && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
              )}
            </div>
          )
        })}
      </div>

      {/* 좌우 화살표 + 페이지 번호 */}
      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={goToPrev}
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-black flex items-center justify-center text-gray-600 hover:text-black transition"
        >
          <span className="text-lg">‹</span>
        </button>

        <span className="text-gray-500 text-sm font-semibold">
          {currentIndex + 1} / {banners.length}
        </span>

        <button
          onClick={goToNext}
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-black flex items-center justify-center text-gray-600 hover:text-black transition"
        >
          <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  )
}