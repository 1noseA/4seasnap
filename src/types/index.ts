export type SeasonType = '1' | '2' | '3' | '4'
export type TransportMethod = '1' | '2' | '3' | '4'

export interface User {
  id: string
  device_id: string
  user_name: string | null
  profile_image: string | null
  created_by: string | null
  created_at: string
  updated_by: string | null
  updated_at: string
}

export interface SeasonKeyword {
  id: string
  keyword_name: string
  season_type: SeasonType
  month: number
  display_order: number
  created_by: string | null
  created_at: string
  updated_by: string | null
  updated_at: string
}

export const SEASON_NAMES: Record<SeasonType, string> = {
  '1': '春',
  '2': '夏',
  '3': '秋',
  '4': '冬'
}

export const TRANSPORT_METHODS: Record<TransportMethod, string> = {
  '1': '徒歩',
  '2': '自転車',
  '3': '公共交通機関',
  '4': '車'
}