'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Record } from '@/types/record'
import { useSeason } from '@/hooks/useSeason'

export default function RecordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [record, setRecord] = useState<Record | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { season, mounted, seasonColors, seasonPrimaryColors, seasonIcons } = useSeason()

  useEffect(() => {
    if (params.id) {
      fetchRecordFromAPI(params.id as string)
    }
  }, [params.id])

  const fetchRecordFromAPI = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/records/${id}`)
      if (!response.ok) {
        throw new Error('記録が見つかりません')
      }
      const data = await response.json()
      setRecord(data.record)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const getTransportMethodText = (method: string) => {
    const methods = {
      '1': '徒歩',
      '2': '自転車',
      '3': '公共交通機関',
      '4': '車'
    }
    return methods[method as keyof typeof methods] || '不明'
  }

  const getSeasonText = (season: 'spring' | 'summer' | 'autumn' | 'winter') => {
    const seasons = {
      'spring': '春',
      'summer': '夏',
      'autumn': '秋',
      'winter': '冬'
    }
    return seasons[season]
  }

  if (!mounted) {
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

  if (error || !record) {
    return (
      <div className={`min-h-screen ${seasonColors[season]} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">{seasonIcons[season]}</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {error ? 'エラーが発生しました' : 'お出かけ記録が見つかりません'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'この記録は削除されたか、存在しない可能性があります'}
          </p>
          <button
            onClick={() => router.back()}
            className={`px-4 py-2 rounded-lg text-white bg-[var(--${season}-primary)] hover:bg-[var(--${season}-primary)]/80`}
          >
            カレンダーに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${seasonColors[season]}`}>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="mr-2">←</span>
            戻る
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{seasonIcons[season]}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {record.photo_url && (
            <div className="aspect-video bg-gray-100">
              {record.photo_url.startsWith('data:') ? (
                <img
                  src={record.photo_url}
                  alt="記録写真"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {record.photo_url}
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-800 mb-2">{record.spot_name}</h1>
              <p className="text-gray-600">{formatDate(record.date)}</p>
            </div>

            <div className="mb-6">
              <div className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-[var(--${season}-primary)]`}>
                {record.season_keyword}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">感想・メモ</h3>
              <p className="text-gray-800 leading-relaxed">{record.comment}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {record.steps > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">歩数</p>
                  <p className="text-lg font-semibold text-gray-800">{record.steps.toLocaleString()}歩</p>
                </div>
              )}

              {record.travel_time_minutes > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">移動時間</p>
                  <p className="text-lg font-semibold text-gray-800">{record.travel_time_minutes}分</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">移動手段</p>
                <p className="text-lg font-semibold text-gray-800">{getTransportMethodText(record.transport_method)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">季節</p>
                <p className="text-lg font-semibold text-gray-800">{seasonIcons[season]} {getSeasonText(season)}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                記録ID: {record.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}