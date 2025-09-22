import { useState, useEffect } from 'react'
import { Record } from '@/types/record'

// 具体的な日付とイベントを持つモックデータを生成
const generateMockRecords = (year: number, month: number): Record[] => {
  // 2024-2025年の具体的なテストデータ
  const testData: { [key: string]: any[] } = {
    '2024-10': [
      {
        date: '2024-10-06', keyword: 'コスモス', spot: '昭和記念公園', transport: '3',
        comment: 'コスモス畑を見に行く',
        steps: 8500, time: 90
      },
      {
        date: '2024-10-13', keyword: 'コキア', spot: '国営ひたち海浜公園', transport: '4',
        comment: 'コキアを見に行く',
        steps: 9200, time: 180
      },
      {
        date: '2024-10-26', keyword: 'ハロウィン', spot: '吉祥寺', transport: '3',
        comment: 'ハロウィンのお菓子を食べる',
        steps: 5800, time: 75
      }
    ],
    '2024-11': [
      {
        date: '2024-11-10', keyword: 'モンブラン', spot: '吉祥寺', transport: '3',
        comment: 'モンブランを食べる',
        steps: 4500, time: 60
      },
      {
        date: '2024-11-30', keyword: '紅葉', spot: '高尾山', transport: '3',
        comment: '紅葉を見に行く',
        steps: 12000, time: 180
      }
    ],
    '2024-12': [
      {
        date: '2024-12-07', keyword: 'イルミネーション', spot: '六本木ヒルズ', transport: '3',
        comment: 'イルミネーションを見に行く',
        steps: 5500, time: 90
      },
      {
        date: '2024-12-15', keyword: 'クリスマスマーケット', spot: '日比谷公園', transport: '3',
        comment: 'クリスマスマーケットに行く',
        steps: 6800, time: 120
      },
      {
        date: '2024-12-31', keyword: '年越しそば', spot: '吉祥寺', transport: '3',
        comment: '年越しそばを食べる',
        steps: 4200, time: 60
      }
    ],
    '2025-01': [
      {
        date: '2025-01-02', keyword: '初詣', spot: '明治神宮', transport: '3',
        comment: '初詣に行く',
        steps: 8900, time: 120
      }
    ],
    '2025-02': [
      {
        date: '2025-02-08', keyword: 'バレンタイン', spot: '日本橋三越', transport: '3',
        comment: 'バレンタインのチョコを買う',
        steps: 6200, time: 90
      },
      {
        date: '2025-02-22', keyword: '梅', spot: '湯島天神', transport: '3',
        comment: '梅を見に行く',
        steps: 4800, time: 75
      }
    ],
    '2025-03': [
      {
        date: '2025-03-08', keyword: '河津桜', spot: '旧中川', transport: '3',
        comment: '河津桜を見に行く',
        steps: 7500, time: 120
      },
      {
        date: '2025-03-23', keyword: '桜スイーツ', spot: '新宿', transport: '3',
        comment: '桜スイーツを食べる',
        steps: 5200, time: 90
      }
    ],
    '2025-04': [
      {
        date: '2025-04-05', keyword: '桜', spot: '千鳥ヶ淵', transport: '3',
        comment: '桜を見に行く',
        steps: 8500, time: 120
      },
      {
        date: '2025-04-13', keyword: 'チューリップ', spot: '昭和記念公園', transport: '3',
        comment: 'チューリップを見に行く',
        steps: 7500, time: 90
      }
    ],
    '2025-05': [
      {
        date: '2025-05-03', keyword: '鯉のぼり', spot: '東京タワー', transport: '3',
        comment: '鯉のぼりを見に行く',
        steps: 6800, time: 90
      },
      {
        date: '2025-05-18', keyword: '新緑', spot: '代々木公園', transport: '1',
        comment: '新緑散歩',
        steps: 5500, time: 60
      }
    ],
    '2025-06': [
      {
        date: '2025-06-08', keyword: '紫陽花', spot: '鎌倉 長谷寺', transport: '3',
        comment: '紫陽花を見に行く',
        steps: 9800, time: 180
      },
      {
        date: '2025-06-15', keyword: 'さくらんぼスイーツ', spot: '吉祥寺', transport: '3',
        comment: 'さくらんぼスイーツを食べる',
        steps: 4200, time: 75
      }
    ],
    '2025-07': [
      {
        date: '2025-07-06', keyword: 'チョコミントスイーツ', spot: '原宿', transport: '3',
        comment: 'チョコミントスイーツを食べる',
        steps: 5800, time: 90
      },
      {
        date: '2025-07-26', keyword: '花火', spot: '浅草', transport: '3',
        comment: '隅田川花火大会を見る',
        steps: 7200, time: 180
      }
    ],
    '2025-08': [
      {
        date: '2025-08-04', keyword: 'ひまわり', spot: '昭和記念公園', transport: '3',
        comment: 'ひまわり畑を見に行く',
        steps: 8500, time: 120
      },
      {
        date: '2025-08-10', keyword: '七夕祭り', spot: '杉並区阿佐ヶ谷', transport: '3',
        comment: '阿佐ヶ谷七夕祭り',
        steps: 6500, time: 150
      },
      {
        date: '2025-08-24', keyword: '阿波踊り', spot: '杉並区高円寺', transport: '3',
        comment: '高円寺阿波踊り',
        steps: 7800, time: 180
      }
    ],
    '2025-09': [
      {
        date: '2025-09-10', keyword: '月見バーガー', spot: 'マクドナルド', transport: '1',
        comment: '月見バーガーを食べる',
        steps: 1200, time: 30
      },
      {
        date: '2025-09-14', keyword: 'いちじくスイーツ', spot: '吉祥寺', transport: '3',
        comment: 'いちじくスイーツを食べる',
        steps: 4200, time: 75
      },
      {
        date: '2025-09-20', keyword: 'シャインマスカット', spot: '銀座', transport: '3',
        comment: 'シャインマスカットを食べる',
        steps: 5500, time: 90
      }
    ]
  }

  const yearMonthKey = `${year}-${month.toString().padStart(2, '0')}`
  const data = testData[yearMonthKey] || []
  console.log(`generateMockRecords: Looking for key "${yearMonthKey}", found:`, data.length, 'records')

  const mockRecords: Record[] = data.map((item, index) => {
    // 日付から日部分を取得してIDに使用
    const day = item.date.split('-')[2]
    return {
    id: `test-${yearMonthKey}-${day}`,
    user_id: 'demo-user',
    date: item.date,
    comment: item.comment,
    steps: item.steps,
    travel_time_minutes: item.time,
    transport_method: item.transport as '1' | '2' | '3' | '4',
    season_keyword: item.keyword,
    spot_name: item.spot,
    photo_url: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  })

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
      console.log(`Loading data for ${year}-${month.toString().padStart(2, '0')}:`, mockData)
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