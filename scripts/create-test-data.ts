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

// テスト記録データの作成
async function createTestRecords(userId: string) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const testRecords = [
    {
      user_id: userId,
      date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-03`,
      comment: '桜が満開でとても綺麗でした！お花見をして春の訪れを感じました。',
      steps: 8500,
      travel_time_minutes: 45,
      transport_method: '1', // 徒歩
      season_keyword: '桜',
      spot_name: '上野公園',
      photo_url: null,
      created_by: userId,
      updated_by: userId
    },
    {
      user_id: userId,
      date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-07`,
      comment: 'いちご狩りを楽しみました。甘くて美味しいいちごをたくさん食べることができて満足です。',
      steps: 3200,
      travel_time_minutes: 60,
      transport_method: '3', // 公共交通機関
      season_keyword: 'いちご狩り',
      spot_name: '○○いちご農園',
      photo_url: null,
      created_by: userId,
      updated_by: userId
    },
    {
      user_id: userId,
      date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-12`,
      comment: '菜の花畑が一面に広がっていて、黄色い絨毯のようでした。写真をたくさん撮りました。',
      steps: 6800,
      travel_time_minutes: 30,
      transport_method: '2', // 自転車
      season_keyword: '菜の花',
      spot_name: '河川敷菜の花畑',
      photo_url: null,
      created_by: userId,
      updated_by: userId
    },
    {
      user_id: userId,
      date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-18`,
      comment: '公園でピクニックをしました。お弁当を作って、青空の下で食べると格別でした。',
      steps: 4500,
      travel_time_minutes: 20,
      transport_method: '1', // 徒歩
      season_keyword: 'ピクニック',
      spot_name: '代々木公園',
      photo_url: null,
      created_by: userId,
      updated_by: userId
    },
    {
      user_id: userId,
      date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-25`,
      comment: '花見スポットを散策しました。桜のトンネルがとても美しく、春を満喫できました。',
      steps: 9200,
      travel_time_minutes: 90,
      transport_method: '3', // 公共交通機関
      season_keyword: '花見',
      spot_name: '千鳥ヶ淵',
      photo_url: null,
      created_by: userId,
      updated_by: userId
    }
  ]

  // 既存の記録をチェック
  const { data: existingRecords } = await supabase
    .from('records')
    .select('date')
    .eq('user_id', userId)
    .gte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
    .lte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`)

  const existingDates = existingRecords?.map(r => r.date) || []

  // 重複しない記録のみ挿入
  const newRecords = testRecords.filter(record => !existingDates.includes(record.date))

  if (newRecords.length === 0) {
    console.log('テスト記録は既に存在します')
    return
  }

  const { data, error } = await supabase
    .from('records')
    .insert(newRecords)
    .select()

  if (error) {
    console.error('記録作成エラー:', error)
    return
  }

  console.log(`${newRecords.length}件のテスト記録を作成しました`)
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