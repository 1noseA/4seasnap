import { useState, useEffect } from 'react'
import { Record } from '@/types/record'

// モックデータ用のテスト記録
const generateMockRecords = (year: number, month: number): Record[] => {
  const mockRecords: Record[] = [
    {
      id: 'mock-1',
      user_id: 'mock-user',
      date: `${year}-${month.toString().padStart(2, '0')}-03`,
      comment: '桜が満開でとても綺麗でした！お花見をして春の訪れを感じました。家族みんなで楽しい時間を過ごしました。',
      steps: 8500,
      travel_time_minutes: 45,
      transport_method: '1',
      season_keyword: '桜',
      spot_name: '上野公園',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-2',
      user_id: 'mock-user',
      date: `${year}-${month.toString().padStart(2, '0')}-07`,
      comment: 'いちご狩りを楽しみました。甘くて美味しいいちごをたくさん食べることができて満足です。',
      steps: 3200,
      travel_time_minutes: 60,
      transport_method: '3',
      season_keyword: 'いちご狩り',
      spot_name: '○○いちご農園',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-3',
      user_id: 'mock-user',
      date: `${year}-${month.toString().padStart(2, '0')}-12`,
      comment: '菜の花畑が一面に広がっていて、黄色い絨毯のようでした。写真をたくさん撮りました。天気も良くて最高の1日でした。',
      steps: 6800,
      travel_time_minutes: 30,
      transport_method: '2',
      season_keyword: '菜の花',
      spot_name: '河川敷菜の花畑',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-4',
      user_id: 'mock-user',
      date: `${year}-${month.toString().padStart(2, '0')}-18`,
      comment: '公園でピクニックをしました。お弁当を作って、青空の下で食べると格別でした。子供たちも喜んでいました。',
      steps: 4500,
      travel_time_minutes: 20,
      transport_method: '1',
      season_keyword: 'ピクニック',
      spot_name: '代々木公園',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mock-5',
      user_id: 'mock-user',
      date: `${year}-${month.toString().padStart(2, '0')}-25`,
      comment: '花見スポットを散策しました。桜のトンネルがとても美しく、春を満喫できました。来年もまた来たいです。',
      steps: 9200,
      travel_time_minutes: 90,
      transport_method: '3',
      season_keyword: '花見',
      spot_name: '千鳥ヶ淵',
      photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  return mockRecords
}

export const useMockRecords = (userId: string | undefined, year: number, month: number) => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    setError(null)

    // モックデータの生成をシミュレート
    setTimeout(() => {
      const mockData = generateMockRecords(year, month)
      setRecords(mockData)
      setLoading(false)
    }, 300) // 300msの遅延でAPIアクセスをシミュレート

  }, [userId, year, month])

  const getRecordsForDate = (date: number): Record[] => {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
    return records.filter(record => record.date === dateStr)
  }

  const hasRecordForDate = (date: number): boolean => {
    return getRecordsForDate(date).length > 0
  }

  const getRecordById = (id: string): Record | undefined => {
    return records.find(record => record.id === id)
  }

  const refreshRecords = async () => {
    setLoading(true)
    setError(null)

    setTimeout(() => {
      const mockData = generateMockRecords(year, month)
      setRecords(mockData)
      setLoading(false)
    }, 300)
  }

  return {
    records,
    loading,
    error,
    getRecordsForDate,
    hasRecordForDate,
    getRecordById,
    refreshRecords
  }
}