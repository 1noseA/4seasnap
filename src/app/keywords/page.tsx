'use client'

import { useSeason } from '@/hooks/useSeason'
import BottomNavigation from '@/components/BottomNavigation'

export default function KeywordsPage() {
  const { season, mounted, seasonColors, seasonIcons } = useSeason()

  const handleNavigation = (tab: 'calendar' | 'keywords' | 'wishlist') => {
    switch (tab) {
      case 'calendar':
        window.location.href = '/'
        break
      case 'keywords':
        // 既に季節キーワード画面なので何もしない
        break
      case 'wishlist':
        window.location.href = '/wishlist'
        break
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${seasonColors[season]} pb-20`}>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{seasonIcons[season]}</span>
            <h1 className="text-2xl font-bold text-gray-800">季節のお出かけ</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-6xl mb-4">{seasonIcons[season]}</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">準備中</h2>
          <p className="text-gray-600 text-sm">
            季節キーワード機能は現在開発中です。<br />
            しばらくお待ちください。
          </p>
        </div>
      </div>

      <BottomNavigation activeTab="keywords" onTabChange={handleNavigation} />
    </div>
  )
}