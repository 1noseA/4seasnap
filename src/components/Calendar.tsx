'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSeason } from '@/hooks/useSeason'
import { useRecords } from '@/hooks/useRecords'
import BottomNavigation from './BottomNavigation'
import DebugPanel from './DebugPanel'

export default function Calendar() {
  const { user, logout } = useAuth()
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const { season, mounted, seasonColors, seasonPrimaryColors, seasonIcons } = useSeason()

  const year = currentDate?.getFullYear() || new Date().getFullYear()
  const month = (currentDate?.getMonth() || new Date().getMonth()) + 1

  const { hasRecordForDate, getRecordsForDate, loading, error } = useRecords(user?.id, year, month)

  const handleNavigation = (tab: 'calendar' | 'keywords' | 'wishlist') => {
    switch (tab) {
      case 'calendar':
        // 既にカレンダー画面なので何もしない
        break
      case 'keywords':
        window.location.href = '/keywords'
        break
      case 'wishlist':
        window.location.href = '/wishlist'
        break
    }
  }

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  const handleLogout = () => {
    logout()
  }

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const weekdays = ['日', '月', '火', '水', '木', '金', '土']

  const handleDateClick = (date: number) => {
    const records = getRecordsForDate(date)
    if (records.length > 0) {
      window.location.href = `/record/${records[0].id}`
    }
  }

  const goToPreviousMonth = () => {
    if (currentDate) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      setCurrentDate(newDate)
    }
  }

  const goToNextMonth = () => {
    if (currentDate) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      setCurrentDate(newDate)
    }
  }

  if (!mounted || !currentDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${seasonColors[season]} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-2xl mb-2">{seasonIcons[season]}</div>
          <div className="text-gray-600">記録を読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${seasonColors[season]} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">{seasonIcons[season]}</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-lg text-white bg-[var(--${season}-primary)] hover:bg-[var(--${season}-primary)]/80`}
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={`min-h-screen ${seasonColors[season]} pb-20`}>
      <DebugPanel />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="前の月"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-800">
                {formatMonth(currentDate)}
              </h1>
              <span className="text-2xl">{seasonIcons[season]}</span>
            </div>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="次の月"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            {user?.profile_image && (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg overflow-hidden">
                {user.profile_image.startsWith('data:') ? (
                  <img
                    src={user.profile_image}
                    alt="プロフィール画像"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.profile_image}</span>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-300 hover:border-red-500"
            >
              ログアウト
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <button
                    className="w-full h-full flex flex-col items-center justify-center text-sm hover:bg-gray-50 rounded relative"
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex flex-col items-center justify-start h-full py-1">
                      {/* 日付を常に上に配置（統一） */}
                      <span className="text-gray-800 text-sm font-medium mb-1">{day}</span>

                      {/* スタンプエリア（記録がある場合のみ表示） */}
                      <div className="flex-1 flex items-center justify-center">
                        {hasRecordForDate(day) && (
                          <div className={`w-8 h-8 rounded-full ${seasonPrimaryColors[season]} shadow-lg flex items-center justify-center border-2 border-white`}>
                            <div className="text-white text-sm font-bold">{seasonIcons[season]}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
          <div className="text-4xl mb-2">{seasonIcons[season]}</div>
          <p className="text-sm">季節のお出かけを記録しましょう</p>
        </div>
      </div>

      <BottomNavigation activeTab="calendar" onTabChange={handleNavigation} />
    </div>
  )
}