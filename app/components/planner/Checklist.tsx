'use client'

import { useState } from 'react'

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  category: string
}

interface ChecklistProps {
  planId: string
  // ✅ (선택) 부모에게 변경 알림 (NewPlanButton Step5에서 사용)
  onChange?: (items: ChecklistItem[]) => void

  // ✅ UI 옵션: 기본값은 기존 화면 그대로
  showProgress?: boolean     // 상단 카운트/진행바/%/완료축하
  showCheckboxes?: boolean   // 왼쪽 체크박스 컬럼

  // ✅ 추가: 헤더 우측 카운트 표기 방식
  // - 'checkedTotal' : 3/12 (기존과 동일)
  // - 'total'        : 총 12개
  // - 'none'         : 표시 안 함
  headerCountMode?: 'checkedTotal' | 'total' | 'none'

    // ✅ 추가: 카테고리 오른쪽 카운트 표시 방식
  categoryCountMode?: 'checkedTotal' | 'total' | 'none'

  listMaxHeightClass?: string
}

// 기본 체크리스트 템플릿
const DEFAULT_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { text: '여권 확인', checked: false, category: '출발 전' },
  { text: '항공권 출력/저장', checked: false, category: '출발 전' },
  { text: '현금 환전', checked: false, category: '출발 전' },
  { text: '여행자 보험 가입', checked: false, category: '출발 전' },
  { text: '해외 유심/로밍', checked: false, category: '출발 전' },
  { text: '호텔 예약 확인', checked: false, category: '현지 준비' },
  { text: '레스토랑 예약', checked: false, category: '현지 준비' },
  { text: '교통패스 구매', checked: false, category: '현지 준비' },
  { text: '옷가방 준비', checked: false, category: '짐 싸기' },
  { text: '세면도구', checked: false, category: '짐 싸기' },
  { text: '충전기/어댑터', checked: false, category: '짐 싸기' },
  { text: '상비약', checked: false, category: '짐 싸기' },
]

export default function Checklist({ planId, onChange, showProgress = true, showCheckboxes = true, headerCountMode = 'checkedTotal', categoryCountMode = 'checkedTotal', listMaxHeightClass = 'max-h-[500px]', }: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    // 로컬스토리지에서 불러오기
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`checklist_${planId}`)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    // 없으면 기본 템플릿 사용
    return DEFAULT_ITEMS.map((item, index) => ({
      ...item,
      id: `${Date.now()}_${index}`,
    }))
  })

  const [newItemText, setNewItemText] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('기타')
  const [isAdding, setIsAdding] = useState(false)

  // 저장
  const saveItems = (newItems: ChecklistItem[]) => {
    setItems(newItems)
    // ✅ 안전하게 window 체크(클라이언트 컴포넌트지만 방어적으로)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`checklist_${planId}`, JSON.stringify(newItems))
    }

    // ✅ 부모에게 “체크리스트 상태 변경됨” 알림
    onChange?.(newItems)
  }


  // 체크 토글
  const toggleItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    )
    saveItems(updated)
  }

  // 항목 추가
  const addItem = () => {
    if (!newItemText.trim()) return

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      checked: false,
      category: newItemCategory,
    }

    saveItems([...items, newItem])
    setNewItemText('')
    setIsAdding(false)
  }

  // 항목 삭제
  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id))
  }

  // 카테고리별 그룹화
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, ChecklistItem[]>,
  )

  const categories = Object.keys(groupedItems)
  const totalItems = items.length
  const checkedItems = items.filter((item) => item.checked).length
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span>✅</span>
          <span>체크리스트</span>
        </h3>
        {headerCountMode !== 'none' && (
          <span className="text-sm font-semibold text-blue-600">
            {headerCountMode === 'total'
              ? `총 ${totalItems}개`
              : `${checkedItems}/${totalItems}`}
          </span>
        )}
      </div>

      {/* 진행 바 */}
      {showProgress && (
        <div className="mb-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {Math.round(progress)}% 완료
          </div>
        </div>
      )}


      {/* 카테고리별 리스트 */}
      <div className={`space-y-4 ${listMaxHeightClass} overflow-y-auto`}>
        {categories.map((category) => {
          const categoryItems = groupedItems[category]
          const categoryChecked = categoryItems.filter(
            (item) => item.checked,
          ).length
          const categoryTotal = categoryItems.length

          return (
            <div key={category}>
              {/* 카테고리 헤더 */}
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-700">{category}</h4>
                {categoryCountMode !== 'none' && (
                  <span className="text-xs text-gray-400">
                    {categoryCountMode === 'total'
                      ? `${categoryTotal} 개`
                      : `${categoryChecked}/${categoryTotal}`}
                  </span>
                )}
              </div>

              {/* 항목들 */}
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={[
                      'group flex items-center p-2 rounded-lg hover:bg-gray-50 transition',
                      showCheckboxes ? 'gap-3' : 'justify-center', // ✅ 체크박스 없으면 가운데 정렬
                    ].join(' ')}
                  >
                    {/* 체크박스 */}
                      {showCheckboxes && (
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            item.checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {item.checked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )}

                    {/* 텍스트 */}
                      <span
                        className={[
                          'flex-1 text-sm transition-all',
                          showCheckboxes
                            ? (item.checked ? 'text-gray-400 line-through' : 'text-gray-700')
                            : 'text-gray-700 text-center',
                        ].join(' ')}
                      >
                        {item.text}
                      </span>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500 transition"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 새 항목 추가 */}
      {isAdding ? (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="할 일 입력..."
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="기타">기타</option>
            </select>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition"
            >
              추가
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setNewItemText('')
              }}
              className="px-3 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mt-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-semibold text-sm flex items-center justify-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>항목 추가</span>
        </button>
      )}

      {/* 완료 축하 메시지 */}
        {showProgress && progress === 100 && totalItems > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl text-center">
            <div className="text-2xl mb-1">🎉</div>
            <p className="text-sm font-semibold text-green-700">모든 준비 완료!</p>
          </div>
        )}
    </div>
  )
}
