import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupDuplicates() {
  const testUserId = '7910c0b6-9f5d-4dee-bcaa-2fd69234e292'

  console.log('重複データのクリーンアップを開始...')

  // すべてのテストデータを取得
  const { data: allRecords, error: fetchError } = await supabase
    .from('records')
    .select('id, date, created_at')
    .eq('user_id', testUserId)
    .order('date')
    .order('created_at')

  if (fetchError) {
    console.error('データ取得エラー:', fetchError)
    return
  }

  console.log('総レコード数:', allRecords.length)

  // 日付ごとに分類し、重複を特定
  const dateGroups: { [date: string]: any[] } = {}
  allRecords.forEach(record => {
    if (!dateGroups[record.date]) {
      dateGroups[record.date] = []
    }
    dateGroups[record.date].push(record)
  })

  // 重複しているレコードを削除（最新のものを1つ残す）
  const toDelete: string[] = []

  Object.entries(dateGroups).forEach(([date, records]) => {
    if (records.length > 1) {
      console.log(`日付 ${date}: ${records.length}件の重複を発見`)
      // 最新のもの以外を削除対象に追加
      const sortedRecords = records.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      const duplicates = sortedRecords.slice(1) // 最新のもの以外
      toDelete.push(...duplicates.map(r => r.id))
    }
  })

  console.log('削除対象レコード数:', toDelete.length)

  if (toDelete.length === 0) {
    console.log('重複データはありません')
    return
  }

  // バッチで削除
  const batchSize = 10
  let deletedCount = 0

  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize)

    for (const id of batch) {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', id)

      if (error) {
        console.error(`削除エラー (${id}):`, error)
      } else {
        deletedCount++
        console.log(`削除完了: ${deletedCount}/${toDelete.length}`)
      }
    }
  }

  console.log('重複クリーンアップ完了!')
  console.log(`削除されたレコード数: ${deletedCount}`)

  // 最終確認
  const { data: finalRecords } = await supabase
    .from('records')
    .select('date')
    .eq('user_id', testUserId)

  console.log(`残存レコード数: ${finalRecords?.length || 0}`)
}

// メイン処理
if (require.main === module) {
  cleanupDuplicates()
}

export { cleanupDuplicates }