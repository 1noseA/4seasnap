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

  const compressAndConvertImage = (file: File) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // プロフィール画像サイズ: 最大200x200px
      const maxSize = 200
      let { width, height } = img

      // アスペクト比を保持してリサイズ
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height

      // 画像を描画
      ctx?.drawImage(img, 0, 0, width, height)

      // 圧縮品質を調整してBase64変換
      let quality = 0.8
      let base64 = ''

      const tryCompress = () => {
        base64 = canvas.toDataURL('image/jpeg', quality)

        // サイズチェック（仮に50KB制限）
        if (base64.length > 66000 && quality > 0.1) {
          quality -= 0.1
          tryCompress()
        } else {
          setSelectedImage(base64)
          setError('')
        }
      }

      tryCompress()
    }

    img.onerror = () => {
      setError('画像の読み込みに失敗しました')
    }

    // FileをImageに読み込み
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // ファイルサイズチェック（5MB制限 - 圧縮処理前の元ファイル）
      if (file.size > 5 * 1024 * 1024) {
        setError('画像サイズは5MB以下にしてください')
        return
      }

      // 画像ファイルかチェック
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルを選択してください')
        return
      }

      // 画像を圧縮してBase64に変換
      compressAndConvertImage(file)
    }

    // input値をリセット（同じファイルを再選択可能にする）
    event.target.value = ''
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
        user_name: userName.trim() || undefined,
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
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {selectedImage.startsWith('data:') ? (
                  <img
                    src={selectedImage}
                    alt="プロフィール画像"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">{selectedImage}</span>
                )}
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