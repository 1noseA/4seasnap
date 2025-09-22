'use client'

import { useSeason } from '@/hooks/useSeason'

interface BottomNavigationProps {
  activeTab: 'calendar' | 'keywords' | 'wishlist'
  onTabChange: (tab: 'calendar' | 'keywords' | 'wishlist') => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { seasonPrimaryColors, season, mounted } = useSeason()

  if (!mounted) {
    return null
  }

  const getTabClass = (tab: string) => {
    const baseClass = 'flex flex-col items-center py-2 px-4 rounded-lg transition-colors'
    return activeTab === tab
      ? `${baseClass} text-[var(--${season}-text)] bg-[var(--${season}-primary)]/20`
      : `${baseClass} text-gray-400 hover:text-gray-600`
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex justify-around">
        <button
          className={getTabClass('calendar')}
          onClick={() => onTabChange('calendar')}
        >
          <span className="text-xl mb-1">📅</span>
          <span className="text-xs font-medium">カレンダー</span>
        </button>

        <button
          className={getTabClass('keywords')}
          onClick={() => onTabChange('keywords')}
        >
          <span className="text-xl mb-1">🌸</span>
          <span className="text-xs font-medium">季節キーワード</span>
        </button>

        <button
          className={getTabClass('wishlist')}
          onClick={() => onTabChange('wishlist')}
        >
          <span className="text-xl mb-1">❤️</span>
          <span className="text-xs font-medium">Wishリスト</span>
        </button>
      </div>
    </nav>
  )
}