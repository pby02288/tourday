interface TravelCardProps {
  city: string
  country: string
  imageUrl?: string
  rating?: number
  reviewCount?: number
}

export default function TravelCard({
  city,
  country,
  imageUrl,
  rating = 4.5,
  reviewCount = 1234,
}: TravelCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
      {/* 이미지 */}
      <div className="relative h-56 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={city}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🌍
          </div>
        )}
        {/* 찜하기 버튼 */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition">
          <span className="text-xl">♡</span>
        </button>
      </div>

      {/* 정보 */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1">{city}</h3>
        <p className="text-gray-500 text-sm mb-3">{country}</p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{rating}</span>
          </div>
          <span className="text-gray-400 text-sm">
            ({reviewCount.toLocaleString()}개 리뷰)
          </span>
        </div>
      </div>
    </div>
  )
}
