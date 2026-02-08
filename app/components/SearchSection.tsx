'use client'

import { useState } from 'react'

type SearchTab = 'travel' | 'restaurant' | 'hotel' | 'flight'

const tabs = [
  { id: 'travel' as SearchTab, label: '여행지', icon: '🗺️' },
  { id: 'restaurant' as SearchTab, label: '맛집', icon: '🍽️' },
  { id: 'hotel' as SearchTab, label: '숙소', icon: '🏨' },
  { id: 'flight' as SearchTab, label: '항공', icon: '✈️' },
]

const placeholders: Record<SearchTab, string> = {
  travel: '도시, 국가, 여행지 검색...',
  restaurant: '음식점, 음식 종류 검색...',
  hotel: '숙소 이름, 지역 검색...',
  flight: '출발지, 목적지 검색...',
}

export default function SearchSection() {
  const [activeTab, setActiveTab] = useState<SearchTab>('travel')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    console.log(`Searching for "${searchQuery}" in ${activeTab}`)
    // 나중에 실제 검색 로직 추가
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* 탭 */}
      <div className="flex gap-2 mb-5 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-black text-black'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 검색 입력 */}
      <div className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholders[activeTab]}
          className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3.5 text-base focus:border-black focus:outline-none transition"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          검색
        </button>
      </div>

      {/* 인기 검색어 */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 font-semibold">인기 검색:</span>
        {['파리', '도쿄', '뉴욕', '제주도', '발리'].map((keyword) => (
          <button
            key={keyword}
            onClick={() => setSearchQuery(keyword)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition"
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  )
}
