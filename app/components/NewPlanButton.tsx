import { useEffect, useState } from "react"

export default function NewPlanButton() {
  // 모달 열림/닫힘 상태
  const [open, setOpen] = useState(false)

  // 모달이 열려있을 때 ESC로 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return

    // 모달 열릴 때 배경 스크롤 방지
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  return (
    <>
      {/* ✅ Link 대신 button: 클릭하면 라우팅이 아니라 open=true */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>새 플랜 만들기</span>
      </button>

      {/* ✅ 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-hidden={false}
        >
          {/* 배경(오버레이) */}
          <div
            className="absolute inset-0 bg-black/40"
          />

          {/* 모달 박스 */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-plan-title"
            className="relative z-10 w-[min(92vw,520px)] rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="relative">
            <h2 id="new-plan-title" className="text-xl font-bold text-center">
                새 플랜 만들기
            </h2>

            <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-0 top-0 rounded-lg p-2 leading-none hover:bg-gray-100"
                aria-label="닫기"
            >
                ✕
            </button>

            <p className="mt-1 text-sm text-gray-500 text-center">
                여기에서 필요한 입력을 받고 생성하면 돼.
            </p>
            </div>

            {/* ====== 모달 내용 (원하는 폼/컴포넌트로 교체) ====== */}
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-sm font-medium">플랜 이름</span>
                <input
                  className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring"
                  placeholder="예: 부산 2박 3일"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // TODO: 여기서 생성 로직(API 호출 등) 넣고 닫기
                    setOpen(false)
                  }}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg"
                >
                  만들기
                </button>
              </div>
            </div>
            {/* ==================================================== */}
          </div>
        </div>
      )}
    </>
  )
}