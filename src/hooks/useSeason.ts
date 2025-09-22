import { useState, useEffect } from 'react'

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter'

export const getSeason = (date?: Date): SeasonType => {
  const month = (date || new Date()).getMonth() + 1
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
    setSeason(getSeason(new Date()))
  }, [])

  const seasonColors = {
    spring: 'season-spring',
    summer: 'season-summer',
    autumn: 'season-autumn',
    winter: 'season-winter'
  }

  const seasonPrimaryColors = {
    spring: 'bg-[var(--spring-primary)]',
    summer: 'bg-[var(--summer-primary)]',
    autumn: 'bg-[var(--autumn-primary)]',
    winter: 'bg-[var(--winter-primary)]'
  }

  const seasonBorderColors = {
    spring: 'border-[var(--spring-border)]',
    summer: 'border-[var(--summer-border)]',
    autumn: 'border-[var(--autumn-border)]',
    winter: 'border-[var(--winter-border)]'
  }

  const seasonButtonColors = {
    spring: 'bg-[var(--spring-primary)] hover:bg-[var(--spring-primary)]/80 text-[var(--spring-text)]',
    summer: 'bg-[var(--summer-primary)] hover:bg-[var(--summer-primary)]/80 text-[var(--summer-text)]',
    autumn: 'bg-[var(--autumn-primary)] hover:bg-[var(--autumn-primary)]/80 text-[var(--autumn-text)]',
    winter: 'bg-[var(--winter-primary)] hover:bg-[var(--winter-primary)]/80 text-[var(--winter-text)]'
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
    seasonPrimaryColors,
    seasonBorderColors,
    seasonButtonColors,
    seasonIcons
  }
}