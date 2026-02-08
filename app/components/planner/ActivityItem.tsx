'use client'

import { Activity, CATEGORY_INFO } from '../../types/planner'
import { useState } from 'react'

interface ActivityItemProps {
  activity: Activity
  onUpdate: (activity: Activity) => void
  onDelete: () => void
}

export default function ActivityItem({
  activity,
  onUpdate,
  onDelete,
}: ActivityItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(activity)

  const categoryInfo = CATEGORY_INFO[activity.category]
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  }

  const handleSave = () => {
    onUpdate(editData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-400 rounded-2xl p-5 shadow-lg">
        <div className="space-y-4">
          {/* 시간 & 카테고리 */}
          <div className="flex gap-3">
            <input
              type="time"
              value={editData.time}
              onChange={(e) =>
                setEditData({ ...editData, time: e.target.value })
              }
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  category: e.target.value as Activity['category'],
                })
              }
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            placeholder="일정 제목"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />

          {/* 장소 */}
          <input
            type="text"
            value={editData.location || ''}
            onChange={(e) =>
              setEditData({ ...editData, location: e.target.value })
            }
            placeholder="장소 (선택)"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />

          {/* 비용 */}
          <input
            type="number"
            value={editData.cost || ''}
            onChange={(e) =>
              setEditData({ ...editData, cost: Number(e.target.value) })
            }
            placeholder="비용 (선택)"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />

          {/* 메모 */}
          <textarea
            value={editData.memo || ''}
            onChange={(e) => setEditData({ ...editData, memo: e.target.value })}
            placeholder="메모 (선택)"
            rows={2}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* 시간 */}
        <div className="flex-shrink-0 text-center">
          <div className="text-sm font-bold text-gray-900">{activity.time}</div>
          {activity.duration && (
            <div className="text-xs text-gray-400 mt-1">
              {activity.duration}분
            </div>
          )}
        </div>

        {/* 세로 라인 */}
        <div className="w-px bg-gray-200 self-stretch" />

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 카테고리 뱃지 */}
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border mb-2 ${colorClasses[categoryInfo.color]}`}
          >
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </div>

          {/* 제목 */}
          <h4 className="font-bold text-gray-900 mb-1">{activity.title}</h4>

          {/* 장소 */}
          {activity.location && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <span>📍</span>
              <span>{activity.location}</span>
            </div>
          )}

          {/* 비용 */}
          {activity.cost && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <span>💰</span>
              <span>{activity.cost.toLocaleString()}원</span>
            </div>
          )}

          {/* 메모 */}
          {activity.memo && (
            <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">
              {activity.memo}
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
            title="수정"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
            title="삭제"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
