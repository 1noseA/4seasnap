import { useState, useEffect } from 'react'
import { Record } from '@/types/record'

export const useRecords = (userId: string | undefined, year: number, month: number) => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true)
      setError(null)

      try {
        // セキュリティ改善：POSTでユーザーIDを送信
        const response = await fetch('/api/records/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId || 'demo-user-id',
            year: year,
            month: month,
            include_demo: true
          }),
        })

        if (!response.ok) {
          throw new Error('記録の取得に失敗しました')
        }

        const data = await response.json()
        setRecords(data.records || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
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

    try {
      // セキュリティ改善：POSTでユーザーIDを送信
      const response = await fetch('/api/records/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId || 'demo-user-id',
          year: year,
          month: month,
          include_demo: true
        }),
      })

      if (!response.ok) {
        throw new Error('記録の取得に失敗しました')
      }

      const data = await response.json()
      setRecords(data.records || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setRecords([])
    } finally {
      setLoading(false)
    }
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