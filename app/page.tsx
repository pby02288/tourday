//import BannerSlider from './components/BannerSlider'
import BannerSliderModern from './components/BannerSliderModern'
import SearchSection from './components/SearchSection'
import ServiceCards from './components/ServiceCards'
import TravelCard from './components/TravelCard'

export default function Home() {
  const popularDestinations = [
    { city: '파리', country: '프랑스', rating: 4.8, reviewCount: 5420 },
    { city: '도쿄', country: '일본', rating: 4.7, reviewCount: 4230 },
    { city: '뉴욕', country: '미국', rating: 4.6, reviewCount: 3890 },
    { city: '제주', country: '대한민국', rating: 4.9, reviewCount: 6540 },
    { city: '발리', country: '인도네시아', rating: 4.7, reviewCount: 3210 },
    { city: '런던', country: '영국', rating: 4.5, reviewCount: 4120 },
    { city: '로마', country: '이탈리아', rating: 4.8, reviewCount: 5010 },
    { city: '방콕', country: '태국', rating: 4.6, reviewCount: 3650 },
  ]

  const popularRestaurants = [
    { name: '스시 사이토', location: '도쿄, 일본', rating: 4.9 },
    { name: '라 메종 드 라 트뤼프', location: '파리, 프랑스', rating: 4.8 },
    { name: '제주 흑돼지 명가', location: '제주, 한국', rating: 4.7 },
    { name: '피자 나폴리', location: '나폴리, 이탈리아', rating: 4.9 },
  ]

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4">
      {/* 배너 슬라이더 */}
      <section>
        <BannerSliderModern />
      </section>

      {/* 검색 섹션 */}
      <section>
        <SearchSection />
      </section>

      {/* 서비스 카드 */}
      <section>
        <ServiceCards />
      </section>

      {/* 인기 여행지 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">🔥 인기 여행지</h2>
          <button className="text-gray-600 hover:text-black font-semibold transition">
            전체보기 →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination) => (
            <TravelCard key={destination.city} {...destination} />
          ))}
        </div>
      </section>

      {/* 인기 맛집 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">🍽️ 인기 맛집</h2>
          <button className="text-gray-600 hover:text-black font-semibold transition">
            전체보기 →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRestaurants.map((restaurant, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer p-6"
            >
              <div className="w-full h-40 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mb-4 flex items-center justify-center text-6xl">
                🍜
              </div>
              <h3 className="text-lg font-bold mb-2">{restaurant.name}</h3>
              <p className="text-gray-500 text-sm mb-3">
                {restaurant.location}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{restaurant.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
