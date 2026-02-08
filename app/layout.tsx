import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TourDay',
  description: '여행 올인원 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* MODERN HEADER */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex items-center justify-between">
              {/* Left: Logo */}
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="relative">
                  {/* 로고 배경 그래디언트 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                  TourDay
                </span>
              </Link>

              {/* Center: Navigation */}
              <nav className="hidden md:flex items-center gap-1 bg-gray-100/60 rounded-full p-1.5 backdrop-blur-sm">
                {[
                  { href: '/travel', label: '여행' },
                  { href: '/flight', label: '항공' },
                  { href: '/hotel', label: '숙소' },
                  { href: '/food', label: '맛집' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all hover:bg-white hover:shadow-md"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* 검색 버튼 */}
                <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all hover:scale-105">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* 알림 버튼 */}
                <button className="hidden sm:flex relative items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all hover:scale-105">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {/* 알림 뱃지 */}
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* 로그인 버튼 */}
                <Link
                  href="/login"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>로그인</span>
                </Link>

                {/* 모바일 메뉴 버튼 */}
                <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="p-8">{children}</div>
        </main>

        {/* MODERN FOOTER */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* 로고 & 소개 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                  <span className="text-xl font-bold">TourDay</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  완벽한 여행을 위한
                  <br />
                  올인원 플랫폼
                </p>
              </div>

              {/* 서비스 */}
              <div>
                <h3 className="font-semibold mb-4 text-sm">서비스</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link
                      href="/travel"
                      className="hover:text-white transition"
                    >
                      여행지
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/flight"
                      className="hover:text-white transition"
                    >
                      항공권
                    </Link>
                  </li>
                  <li>
                    <Link href="/hotel" className="hover:text-white transition">
                      숙소
                    </Link>
                  </li>
                  <li>
                    <Link href="/food" className="hover:text-white transition">
                      맛집
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 고객지원 */}
              <div>
                <h3 className="font-semibold mb-4 text-sm">고객지원</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition">
                      공지사항
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition">
                      자주 묻는 질문
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition">
                      문의하기
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition">
                      이용약관
                    </Link>
                  </li>
                </ul>
              </div>

              {/* SNS */}
              <div>
                <h3 className="font-semibold mb-4 text-sm">SNS</h3>
                <div className="flex gap-3">
                  {['instagram', 'facebook', 'twitter', 'youtube'].map(
                    (social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110"
                      >
                        <span className="text-xs">📱</span>
                      </a>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
              © 2026 TourDay. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
