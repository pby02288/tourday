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

export default function BannerSliderFade() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 진행 바
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((i) => (i + 1) % banners.length)
          return 0
        }
        return prev + 0.5
      })
    }, 40) // 4초 동안 100%

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
          className={`absolute inset-0 bg-gradient-to-br ${banner.bgColor} transition-opacity duration-1000 ease-in-out`}
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          {/* 배경 이모지 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[220px] opacity-10">{banner.image}</span>
          </div>
        </div>
      ))}

      {/* 텍스트 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <h2 className="text-white text-3xl font-bold mb-2 drop-shadow">
          {banners[currentIndex].title}
        </h2>
        <p className="text-white/80 text-base drop-shadow">
          {banners[currentIndex].subtitle}
        </p>

        {/* 하단 인디케이터 + 진행 바 */}
        <div className="mt-6 flex items-center gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className="relative h-1 flex-1 rounded-full overflow-hidden bg-white/30 cursor-pointer"
            >
              {/* 진행 바 활성 상태 */}
              {index === currentIndex && (
                <div
                  className="absolute left-0 top-0 h-full bg-white rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              )}
              {/* 완료된 항목 */}
              {index < currentIndex && (
                <div className="absolute left-0 top-0 h-full w-full bg-white/50 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
