import { useState, useEffect } from 'react'
import { Record } from '@/types/record'

export const useRecords = (userId: string | undefined, year: number, month: number) => {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchRecords = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/records?year=${year}&month=${month}&userId=${userId}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch records')
        }

        const data = await response.json()
        setRecords(data.records || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
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

  const refreshRecords = async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/records?year=${year}&month=${month}&userId=${userId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch records')
      }

      const data = await response.json()
      setRecords(data.records || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
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
    refreshRecords
  }
}