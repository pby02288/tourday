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
    title: '서울에서 출발하는 속초 찜억 여행',
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

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const prevIndex = (currentIndex - 1 + banners.length) % banners.length
  const nextIndex = (currentIndex + 1) % banners.length

  return (
    <div className="relative flex items-center gap-3">
      {/* 왼쪽 미리보기 */}
      <div className="relative w-[18%] shrink-0">
        <div
          className={`h-[320px] rounded-xl bg-gradient-to-br ${banners[prevIndex].bgColor} flex items-end justify-start p-4 cursor-pointer opacity-70 hover:opacity-90 transition-opacity`}
          onClick={goToPrevious}
        >
          <p className="text-white font-bold text-sm drop-shadow">
            {banners[prevIndex].title}
          </p>
        </div>
      </div>

      {/* 왼쪽 화살표 */}
      <button
        onClick={goToPrevious}
        className="absolute left-[18%] z-10 -translate-x-1/2 w-10 h-10 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center transition shadow-md"
      >
        <span className="text-white text-xl font-bold">‹</span>
      </button>

      {/* 중앙 메인 배너 */}
      <div className="relative flex-1 h-[320px] rounded-xl overflow-hidden shadow-xl">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 bg-gradient-to-br ${banner.bgColor} flex items-center justify-center transition-all duration-700 ease-in-out`}
            style={{
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[200px] opacity-10">{banner.image}</span>
            </div>

            {/* 텍스트 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <h2 className="text-white text-2xl font-bold drop-shadow mb-1">
                {banner.title}
              </h2>
              <p className="text-white/80 text-sm drop-shadow">
                {banner.subtitle}
              </p>
            </div>

            {/* 페이지 번호 + 재생/정지 */}
            <div className="absolute bottom-4 right-5 flex items-center gap-2">
              <span className="text-white text-sm font-semibold drop-shadow">
                {currentIndex + 1} / {banners.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPlaying(!isPlaying)
                }}
                className="text-white/80 hover:text-white transition text-xs"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽 화살표 */}
      <button
        onClick={goToNext}
        className="absolute right-[18%] z-10 translate-x-1/2 w-10 h-10 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center transition shadow-md"
      >
        <span className="text-white text-xl font-bold">›</span>
      </button>

      {/* 오른쪽 미리보기 */}
      <div className="relative w-[18%] shrink-0">
        <div
          className={`h-[320px] rounded-xl bg-gradient-to-br ${banners[nextIndex].bgColor} flex items-end justify-start p-4 cursor-pointer opacity-70 hover:opacity-90 transition-opacity`}
          onClick={goToNext}
        >
          <p className="text-white font-bold text-sm drop-shadow">
            {banners[nextIndex].title}
          </p>
        </div>
      </div>
    </div>
  )
}
