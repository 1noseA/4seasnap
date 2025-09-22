'use client'

import { useSeason } from '@/hooks/useSeason'
import BottomNavigation from '@/components/BottomNavigation'

export default function WishlistPage() {
  const { season, mounted, seasonColors, seasonIcons } = useSeason()

  const handleNavigation = (tab: 'calendar' | 'keywords' | 'wishlist') => {
    switch (tab) {
      case 'calendar':
        window.location.href = '/'
        break
      case 'keywords':
        window.location.href = '/keywords'
        break
      case 'wishlist':
        // 既にWishリスト画面なので何もしない
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
            <span className="text-3xl">❤️</span>
            <h1 className="text-2xl font-bold text-gray-800">行きたいスポット</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">準備中</h2>
          <p className="text-gray-600 text-sm">
            Wishリスト機能は現在開発中です。<br />
            しばらくお待ちください。
          </p>
        </div>
      </div>

      <BottomNavigation activeTab="wishlist" onTabChange={handleNavigation} />
    </div>
  )
}