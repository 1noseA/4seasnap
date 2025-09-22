import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// テストユーザーの作成
async function createTestUser() {
  const testDeviceId = 'test-device-12345'

  // 既存のテストユーザーをチェック
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('device_id', testDeviceId)
    .single()

  if (existingUser) {
    console.log('テストユーザーが既に存在します:', existingUser.id)
    return existingUser
  }

  // 新しいテストユーザーを作成
  const { data: user, error } = await supabase
    .from('users')
    .insert([{
      device_id: testDeviceId,
      user_name: 'テストユーザー',
      profile_image: '👤'
    }])
    .select()
    .single()

  if (error) {
    console.error('ユーザー作成エラー:', error)
    return null
  }

  console.log('テストユーザーを作成しました:', user.id)
  return user
}

// テスト記録データの作成（重複チェック付き）
async function createTestRecords(userId: string) {
  // 2024-2025年の具体的なテストデータ
  const testRecords = [
    // 2024年10月
    { user_id: userId, date: '2024-10-06', comment: 'コスモス畑を見に行く', steps: 8500, travel_time_minutes: 90, transport_method: '3', season_keyword: 'コスモス', spot_name: '昭和記念公園', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2024-10-13', comment: 'コキアを見に行く', steps: 9200, travel_time_minutes: 180, transport_method: '4', season_keyword: 'コキア', spot_name: '国営ひたち海浜公園', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2024-10-26', comment: 'ハロウィンのお菓子を食べる', steps: 5800, travel_time_minutes: 75, transport_method: '3', season_keyword: 'ハロウィン', spot_name: '吉祥寺', photo_url: null, created_by: userId, updated_by: userId },

    // 2024年11月
    { user_id: userId, date: '2024-11-10', comment: 'モンブランを食べる', steps: 4500, travel_time_minutes: 60, transport_method: '3', season_keyword: 'モンブラン', spot_name: '吉祥寺', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2024-11-30', comment: '紅葉を見に行く', steps: 12000, travel_time_minutes: 180, transport_method: '3', season_keyword: '紅葉', spot_name: '高尾山', photo_url: null, created_by: userId, updated_by: userId },

    // 2024年12月
    { user_id: userId, date: '2024-12-07', comment: 'イルミネーションを見に行く', steps: 5500, travel_time_minutes: 90, transport_method: '3', season_keyword: 'イルミネーション', spot_name: '六本木ヒルズ', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2024-12-15', comment: 'クリスマスマーケットに行く', steps: 6800, travel_time_minutes: 120, transport_method: '3', season_keyword: 'クリスマスマーケット', spot_name: '日比谷公園', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2024-12-31', comment: '年越しそばを食べる', steps: 4200, travel_time_minutes: 60, transport_method: '3', season_keyword: '年越しそば', spot_name: '吉祥寺', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年1月
    { user_id: userId, date: '2025-01-02', comment: '初詣に行く', steps: 8900, travel_time_minutes: 120, transport_method: '3', season_keyword: '初詣', spot_name: '明治神宮', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年2月
    { user_id: userId, date: '2025-02-08', comment: 'バレンタインのチョコを買う', steps: 6200, travel_time_minutes: 90, transport_method: '3', season_keyword: 'バレンタイン', spot_name: '日本橋三越', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-02-22', comment: '梅を見に行く', steps: 4800, travel_time_minutes: 75, transport_method: '3', season_keyword: '梅', spot_name: '湯島天神', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年3月
    { user_id: userId, date: '2025-03-08', comment: '河津桜を見に行く', steps: 7500, travel_time_minutes: 120, transport_method: '3', season_keyword: '河津桜', spot_name: '旧中川', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-03-23', comment: '桜スイーツを食べる', steps: 5200, travel_time_minutes: 90, transport_method: '3', season_keyword: '桜スイーツ', spot_name: '新宿', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年4月
    { user_id: userId, date: '2025-04-05', comment: '桜を見に行く', steps: 8500, travel_time_minutes: 120, transport_method: '3', season_keyword: '桜', spot_name: '千鳥ヶ淵', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-04-13', comment: 'チューリップを見に行く', steps: 7500, travel_time_minutes: 90, transport_method: '3', season_keyword: 'チューリップ', spot_name: '昭和記念公園', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年5月
    { user_id: userId, date: '2025-05-03', comment: '鯉のぼりを見に行く', steps: 6800, travel_time_minutes: 90, transport_method: '3', season_keyword: '鯉のぼり', spot_name: '東京タワー', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-05-18', comment: '新緑散歩', steps: 5500, travel_time_minutes: 60, transport_method: '1', season_keyword: '新緑', spot_name: '代々木公園', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年6月
    { user_id: userId, date: '2025-06-08', comment: '紫陽花を見に行く', steps: 9800, travel_time_minutes: 180, transport_method: '3', season_keyword: '紫陽花', spot_name: '鎌倉 長谷寺', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-06-15', comment: 'さくらんぼスイーツを食べる', steps: 4200, travel_time_minutes: 75, transport_method: '3', season_keyword: 'さくらんぼスイーツ', spot_name: '吉祥寺', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年7月
    { user_id: userId, date: '2025-07-06', comment: 'チョコミントスイーツを食べる', steps: 5800, travel_time_minutes: 90, transport_method: '3', season_keyword: 'チョコミントスイーツ', spot_name: '原宿', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-07-26', comment: '隅田川花火大会を見る', steps: 7200, travel_time_minutes: 180, transport_method: '3', season_keyword: '花火', spot_name: '浅草', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年8月
    { user_id: userId, date: '2025-08-04', comment: 'ひまわり畑を見に行く', steps: 8500, travel_time_minutes: 120, transport_method: '3', season_keyword: 'ひまわり', spot_name: '昭和記念公園', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-08-10', comment: '阿佐ヶ谷七夕祭り', steps: 6500, travel_time_minutes: 150, transport_method: '3', season_keyword: '七夕祭り', spot_name: '杉並区阿佐ヶ谷', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-08-24', comment: '高円寺阿波踊り', steps: 7800, travel_time_minutes: 180, transport_method: '3', season_keyword: '阿波踊り', spot_name: '杉並区高円寺', photo_url: null, created_by: userId, updated_by: userId },

    // 2025年9月
    { user_id: userId, date: '2025-09-10', comment: '月見バーガーを食べる', steps: 1200, travel_time_minutes: 30, transport_method: '1', season_keyword: '月見バーガー', spot_name: 'マクドナルド', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-09-14', comment: 'いちじくスイーツを食べる', steps: 4200, travel_time_minutes: 75, transport_method: '3', season_keyword: 'いちじくスイーツ', spot_name: '吉祥寺', photo_url: null, created_by: userId, updated_by: userId },
    { user_id: userId, date: '2025-09-20', comment: 'シャインマスカットを食べる', steps: 5500, travel_time_minutes: 90, transport_method: '3', season_keyword: 'シャインマスカット', spot_name: '銀座', photo_url: null, created_by: userId, updated_by: userId }
  ]

  // 既存データをチェックして重複を避ける
  console.log('既存のテスト記録をチェック中...')
  const { data: existingRecords } = await supabase
    .from('records')
    .select('date')
    .eq('user_id', userId)

  const existingDates = existingRecords?.map(r => r.date) || []
  const newRecords = testRecords.filter(record => !existingDates.includes(record.date))

  if (newRecords.length === 0) {
    console.log('すべてのテスト記録が既に存在します')
    return existingRecords
  }

  console.log(`${newRecords.length}件の新しい記録を作成中...`)

  // 新しいデータのみを挿入
  const { data, error } = await supabase
    .from('records')
    .insert(newRecords)
    .select()

  if (error) {
    console.error('記録作成エラー:', error)
    return
  }

  console.log(`${newRecords.length}件の新しいテスト記録を作成しました`)

  // 日付とIDのマッピングを作成
  const dateIdMapping = data?.reduce((map, record) => {
    map[record.date] = record.id
    return map
  }, {} as { [date: string]: string })

  console.log('日付とIDのマッピング:')
  console.log(JSON.stringify(dateIdMapping, null, 2))

  return data
}

// 季節キーワードテストデータの作成
async function createSeasonKeywords() {
  const keywords = [
    // 春（3-5月）
    { keyword_name: '桜', season_type: '1', month: 3, display_order: 1 },
    { keyword_name: '花見', season_type: '1', month: 4, display_order: 2 },
    { keyword_name: 'いちご狩り', season_type: '1', month: 4, display_order: 3 },
    { keyword_name: '菜の花', season_type: '1', month: 3, display_order: 4 },
    { keyword_name: 'ピクニック', season_type: '1', month: 5, display_order: 5 },

    // 夏（6-8月）
    { keyword_name: '花火', season_type: '2', month: 8, display_order: 1 },
    { keyword_name: '海', season_type: '2', month: 7, display_order: 2 },
    { keyword_name: 'プール', season_type: '2', month: 7, display_order: 3 },
    { keyword_name: 'かき氷', season_type: '2', month: 8, display_order: 4 },
    { keyword_name: '夏祭り', season_type: '2', month: 8, display_order: 5 },

    // 秋（9-11月）
    { keyword_name: '紅葉', season_type: '3', month: 11, display_order: 1 },
    { keyword_name: '月見', season_type: '3', month: 9, display_order: 2 },
    { keyword_name: 'ハロウィン', season_type: '3', month: 10, display_order: 3 },
    { keyword_name: '栗拾い', season_type: '3', month: 10, display_order: 4 },
    { keyword_name: 'コスモス', season_type: '3', month: 10, display_order: 5 },

    // 冬（12-2月）
    { keyword_name: 'クリスマス', season_type: '4', month: 12, display_order: 1 },
    { keyword_name: '雪', season_type: '4', month: 1, display_order: 2 },
    { keyword_name: 'イルミネーション', season_type: '4', month: 12, display_order: 3 },
    { keyword_name: '温泉', season_type: '4', month: 1, display_order: 4 },
    { keyword_name: '梅', season_type: '4', month: 2, display_order: 5 }
  ]

  // 既存のキーワードをチェック
  const { data: existingKeywords } = await supabase
    .from('season_keywords')
    .select('keyword_name')

  const existingNames = existingKeywords?.map(k => k.keyword_name) || []
  const newKeywords = keywords.filter(k => !existingNames.includes(k.keyword_name))

  if (newKeywords.length === 0) {
    console.log('季節キーワードは既に存在します')
    return
  }

  const { data, error } = await supabase
    .from('season_keywords')
    .insert(newKeywords)
    .select()

  if (error) {
    console.error('季節キーワード作成エラー:', error)
    return
  }

  console.log(`${newKeywords.length}件の季節キーワードを作成しました`)
  return data
}

// メイン処理
async function main() {
  try {
    console.log('テストデータの作成を開始します...')

    // 1. テストユーザーの作成
    const user = await createTestUser()
    if (!user) {
      console.error('ユーザー作成に失敗しました')
      return
    }

    // 2. 季節キーワードの作成
    await createSeasonKeywords()

    // 3. テスト記録の作成
    await createTestRecords(user.id)

    console.log('テストデータの作成が完了しました！')
    console.log('アプリでカレンダーを確認してください。')

  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

// スクリプト実行
if (require.main === module) {
  main()
}

export { createTestUser, createTestRecords, createSeasonKeywords }