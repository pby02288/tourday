'use client'

import { useState, useEffect } from 'react'

const banners = [
  {
    id: 1,
    title: '겨울 특가!',
    subtitle: '홋카이도 3박 4일',
    description: '항공권 + 호텔을 함께 예약하면 최대 40% 할인받아요',
    bgColor: 'from-blue-400 to-blue-700',
    image: '🏔️',
    tag: '특가',
  },
  {
    id: 2,
    title: '동남아 휴양지',
    subtitle: '인기 패키지 모음',
    description: '발리, 푸켓, 다낭 중 원하시는 곳을 선택하세요',
    bgColor: 'from-green-400 to-teal-600',
    image: '🏝️',
    tag: '추천',
  },
  {
    id: 3,
    title: '속초 여행',
    subtitle: '서울 출발 당일치환',
    description: '가을의 깊은 감성을 속초에서 느끼세요',
    bgColor: 'from-orange-400 to-red-500',
    image: '🌅',
    tag: '감성',
  },
  {
    id: 4,
    title: '유럽 배낭여행',
    subtitle: '완벽한 코스 가이드',
    description: '파리, 런던, 로마를 한번에 즐기는 여행 코스',
    bgColor: 'from-purple-500 to-pink-600',
    image: '🗼',
    tag: 'NEW',
  },
  {
    id: 5,
    title: '숨은 맛집 투어',
    subtitle: '전국 미슐랭 가이드',
    description: '숨겨진 맛집을 발견하는 즐거운 여행',
    bgColor: 'from-yellow-400 to-orange-500',
    image: '🍜',
    tag: 'HOT',
  },
]

export default function BannerSliderFullScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length)
        setAnimating(false)
      }, 300)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const goTo = (index: number) => {
    if (index === currentIndex) return
    setAnimating(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setAnimating(false)
    }, 300)
  }

  const banner = banners[currentIndex]

  return (
    <div className="relative w-full h-[380px] rounded-2xl overflow-hidden shadow-xl">
      {/* 배경 그래디언트 전환 */}
      {banners.map((b, index) => (
        <div
          key={b.id}
          className={`absolute inset-0 bg-gradient-to-br ${b.bgColor} transition-opacity duration-700`}
          style={{ opacity: index === currentIndex ? 1 : 0, zIndex: index === currentIndex ? 1 : 0 }}
        />
      ))}

      {/* 오른쪽 이미지 영역 */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-10 flex items-center justify-center">
        <span
          className={`text-[160px] transition-all duration-500 ${animating ? 'opacity-0 scale-75' : 'opacity-20 scale-100'}`}
        >
          {banner.image}
        </span>
      </div>

      {/* 왼쪽 텍스트 영역 */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 z-10 flex flex-col justify-center px-10">
        {/* 태그 */}
        <span
          className={`inline-block w-fit px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4 transition-all duration-500 ${animating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
        >
          {banner.tag}
        </span>

        {/* 제목 */}
        <h2
          className={`text-white text-4xl font-bold mb-2 leading-tight drop-shadow transition-all duration-500 ${animating ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'}`}
          style={{ transitionDelay: animating ? '0ms' : '100ms' }}
        >
          {banner.title}
        </h2>

        {/* 소제목 */}
        <p
          className={`text-white/90 text-xl font-semibold mb-3 drop-shadow transition-all duration-500 ${animating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
          style={{ transitionDelay: animating ? '0ms' : '200ms' }}
        >
          {banner.subtitle}
        </p>

        {/* 설명 */}
        <p
          className={`text-white/70 text-sm leading-relaxed mb-6 transition-all duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
          style={{ transitionDelay: animating ? '0ms' : '300ms' }}
        >
          {banner.description}
        </p>

        {/* 버튼 */}
        <div>
          <button className="px-6 py-2.5 bg-white text-gray-900 rounded-full font-semibold text-sm hover:bg-gray-100 transition shadow">
            자세히 보기 →
          </button>
        </div>
      </div>

      {/* 하단 도트 인디케이터 */}
      <div className="absolute bottom-5 left-10 z-10 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}