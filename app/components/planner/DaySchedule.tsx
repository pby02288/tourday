'use client'

import { DayPlan, Activity, CATEGORY_INFO } from '../../types/planner'
import { formatDate } from '../../lib/plannerStorage'
import ActivityItem from './ActivityItem'
import { useState } from 'react'

interface DayScheduleProps {
  day: DayPlan
  onUpdateActivities: (activities: Activity[]) => void
}

export default function DaySchedule({
  day,
  onUpdateActivities,
}: DayScheduleProps) {
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: '09:00',
    title: '',
    category: 'etc',
  })

  const handleAddActivity = () => {
    if (!newActivity.title) return

    const activity: Activity = {
      id: Date.now().toString(),
      time: newActivity.time || '09:00',
      title: newActivity.title,
      category: (newActivity.category || 'etc') as Activity['category'],
      location: newActivity.location,
      cost: newActivity.cost,
      memo: newActivity.memo,
    }

    const updatedActivities = [...day.activities, activity].sort((a, b) =>
      a.time.localeCompare(b.time),
    )
    onUpdateActivities(updatedActivities)

    // 초기화
    setNewActivity({ time: '09:00', title: '', category: 'etc' })
    setIsAddingActivity(false)
  }

  const handleUpdateActivity = (activityId: string, updated: Activity) => {
    const updatedActivities = day.activities
      .map((a) => (a.id === activityId ? updated : a))
      .sort((a, b) => a.time.localeCompare(b.time))
    onUpdateActivities(updatedActivities)
  }

  const handleDeleteActivity = (activityId: string) => {
    const updatedActivities = day.activities.filter((a) => a.id !== activityId)
    onUpdateActivities(updatedActivities)
  }

  const totalCost = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 날짜 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm opacity-90">DAY {day.dayNumber}</div>
            <div className="text-xl font-bold">{formatDate(day.date)}</div>
          </div>
          {totalCost > 0 && (
            <div className="text-right">
              <div className="text-sm opacity-90">오늘 지출</div>
              <div className="text-xl font-bold">
                {totalCost.toLocaleString()}원
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 일정 리스트 */}
      <div className="p-6 space-y-3">
        {day.activities.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📝</div>
            <p>아직 일정이 없습니다</p>
            <p className="text-sm mt-1">
              아래 버튼을 눌러 일정을 추가해보세요!
            </p>
          </div>
        ) : (
          day.activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onUpdate={(updated) => handleUpdateActivity(activity.id, updated)}
              onDelete={() => handleDeleteActivity(activity.id)}
            />
          ))
        )}

        {/* 일정 추가 폼 */}
        {isAddingActivity && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5">
            <div className="space-y-3">
              {/* 시간 & 카테고리 */}
              <div className="flex gap-3">
                <input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, time: e.target.value })
                  }
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={newActivity.category}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      category: e.target.value as Activity['category'],
                    })
                  }
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
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
                value={newActivity.title}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, title: e.target.value })
                }
                placeholder="일정 제목 (필수)"
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                autoFocus
              />

              {/* 장소 */}
              <input
                type="text"
                value={newActivity.location || ''}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, location: e.target.value })
                }
                placeholder="장소 (선택)"
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />

              {/* 비용 */}
              <input
                type="number"
                value={newActivity.cost || ''}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    cost: Number(e.target.value),
                  })
                }
                placeholder="비용 (선택)"
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />

              {/* 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddActivity}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setIsAddingActivity(false)
                    setNewActivity({
                      time: '09:00',
                      title: '',
                      category: 'etc',
                    })
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 일정 추가 버튼 */}
        {!isAddingActivity && (
          <button
            onClick={() => setIsAddingActivity(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>일정 추가</span>
          </button>
        )}
      </div>
    </div>
  )
}
