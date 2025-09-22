export interface Record {
  id: string
  user_id: string
  date: string
  photo_url?: string
  comment: string
  steps: number
  travel_time_minutes: number
  transport_method: '1' | '2' | '3' | '4' // 1:徒歩、2:自転車、3:公共交通機関、4:車
  season_keyword: string
  spot_name: string
  created_by?: string
  created_at?: string
  updated_by?: string
  updated_at?: string
}

export interface CreateRecordRequest {
  user_id: string
  date: string
  photo_url?: string
  comment: string
  steps?: number
  travel_time_minutes?: number
  transport_method?: '1' | '2' | '3' | '4'
  season_keyword: string
  spot_name: string
}

export interface RecordsResponse {
  records: Record[]
}

export interface RecordResponse {
  record: Record
}