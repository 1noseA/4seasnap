'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSeason } from '@/hooks/useSeason'

export default function Login() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { season, mounted, seasonColors, seasonButtonColors, seasonIcons } = useSeason()

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true)
      await login()
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
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
    <div className={`min-h-screen ${seasonColors[season]} flex items-center justify-center`}>
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">{seasonIcons[season]}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">4Seasnap</h1>
          <p className="text-gray-600 mb-8">
            季節を感じるお出かけを記録しよう
          </p>

          <div className="space-y-4">
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                seasonButtonColors[season]
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {isLoading ? 'ログイン中...' : 'ゲストとしてはじめる'}
            </button>

            <p className="text-xs text-gray-500">
              アカウント登録不要でご利用いただけます
            </p>
          </div>

          <div className="mt-8 text-xs text-gray-400">
            <p>季節に応じて背景色が変わります</p>
            <p className="mt-1">
              春🌸 夏🌻 秋🍁 冬⛄
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}