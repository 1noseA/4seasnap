'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSeason } from '@/hooks/useSeason'

const DEFAULT_PROFILE_IMAGES = [
  '🌸', '🌻', '🍁', '⛄', '🐱', '🐶', '🐸', '🦋'
]

export default function ProfileSetup() {
  const router = useRouter()
  const { user, updateUser, isLoading } = useAuth()
  const [userName, setUserName] = useState('')
  const [selectedImage, setSelectedImage] = useState('🌸')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { season, mounted, seasonColors, seasonBorderColors, seasonButtonColors } = useSeason()

  const seasonBgColors = {
    spring: `${seasonColors.spring} ${seasonBorderColors.spring}`,
    summer: `${seasonColors.summer} ${seasonBorderColors.summer}`,
    autumn: `${seasonColors.autumn} ${seasonBorderColors.autumn}`,
    winter: `${seasonColors.winter} ${seasonBorderColors.winter}`
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file)
    }
  }

  const handleSave = async () => {
    if (userName.length > 10) {
      setError('ユーザー名は10文字以内で入力してください')
      return
    }

    try {
      setIsUploading(true)
      setError('')

      await updateUser({
        user_name: userName || null,
        profile_image: selectedImage
      })

      router.push('/calendar')
    } catch (err) {
      setError('設定の保存に失敗しました')
      console.error('Save error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSkip = () => {
    router.push('/calendar')
  }

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${seasonBgColors[season]}`}>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800">プロフィール設定</h1>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm"
            disabled={isUploading}
          >
            スキップ
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">
                {selectedImage}
              </div>
              <button
                onClick={handleImageUpload}
                className="text-blue-500 hover:text-blue-600 text-sm"
                disabled={isUploading}
              >
                カメラロールから選択
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {DEFAULT_PROFILE_IMAGES.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedImage(emoji)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${
                    selectedImage === emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isUploading}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム（任意）
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="ニックネーム（任意）"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {userName.length}/10
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            onClick={handleSave}
            disabled={isUploading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              seasonButtonColors[season]
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUploading ? '保存中...' : '設定完了'}
          </button>
        </div>
      </div>
    </div>
  )
}