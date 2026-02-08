import Link from 'next/link'

const services = [
  { icon: '🗺️', label: '내플랜', href: '/planner' },
  { icon: '📋', label: '플래너추가', href: '/planner/new' },
]

export default function ServiceCards() {
  return (
    <div className="text-center">
      <p className="text-gray-600 text-lg mb-6">
        완벽한 여행 준비를 위한{' '}
        <span className="font-bold text-black">구석구석 서비스</span>
      </p>
      <div className="flex justify-center gap-10">
        {services.map((service) => (
          <Link
            key={service.label}
            href={service.href}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-16 h-16 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-2xl group-hover:border-blue-400 group-hover:shadow-md transition-all bg-white">
              {service.icon}
            </div>
            <span className="text-sm text-gray-600 font-medium group-hover:text-blue-500 transition">
              {service.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
