'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSeason } from '@/hooks/useSeason'
import DebugPanel from './DebugPanel'

export default function Calendar() {
  const { user, logout } = useAuth()
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const { season, mounted, seasonColors, seasonIcons } = useSeason()

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

  if (!mounted || !currentDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={`min-h-screen ${seasonColors[season]}`}>
      <DebugPanel />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-800">
              {formatMonth(currentDate)}
            </h1>
            <span className="text-2xl">{seasonIcons[season]}</span>
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
                  <button className="w-full h-full flex items-center justify-center text-sm hover:bg-gray-50 rounded">
                    {day}
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

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex flex-col items-center py-2 text-blue-500">
            <span className="text-xl">📅</span>
            <span className="text-xs">カレンダー</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl">🌸</span>
            <span className="text-xs">季節キーワード</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl">❤️</span>
            <span className="text-xs">Wishリスト</span>
          </button>
        </div>
      </nav>
    </div>
  )
}