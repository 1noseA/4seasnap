import { useState, useEffect } from 'react'

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter'

export const getSeason = (): SeasonType => {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export const useSeason = () => {
  const [season, setSeason] = useState<SeasonType>('spring')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSeason(getSeason())
  }, [])

  const seasonColors = {
    spring: 'bg-pink-50',
    summer: 'bg-sky-50',
    autumn: 'bg-orange-50',
    winter: 'bg-blue-50'
  }

  const seasonBorderColors = {
    spring: 'border-pink-200',
    summer: 'border-sky-200',
    autumn: 'border-orange-200',
    winter: 'border-blue-200'
  }

  const seasonButtonColors = {
    spring: 'bg-pink-500 hover:bg-pink-600',
    summer: 'bg-sky-500 hover:bg-sky-600',
    autumn: 'bg-orange-500 hover:bg-orange-600',
    winter: 'bg-blue-500 hover:bg-blue-600'
  }

  const seasonIcons = {
    spring: '🌸',
    summer: '🌻',
    autumn: '🍁',
    winter: '⛄'
  }

  return {
    season,
    mounted,
    seasonColors,
    seasonBorderColors,
    seasonButtonColors,
    seasonIcons
  }
}