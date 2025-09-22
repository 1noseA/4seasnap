import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
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

async function setupDatabase() {
  try {
    console.log('データベースのセットアップを開始します...')

    // SQLファイルを読み込み
    const sqlPath = path.join(__dirname, 'setup-database.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // SQLを実行（複数のステートメントに分割）
    const statements = sql
      .split(';')
      .filter(statement => statement.trim().length > 0)

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' })
        if (error) {
          console.log('SQL実行結果:', statement.trim().substring(0, 50) + '...')
          console.log('注意: ', error.message)
        }
      } catch (err) {
        console.log('SQL実行中:', statement.trim().substring(0, 50) + '...')
      }
    }

    // テーブル存在確認
    console.log('\nテーブル存在確認...')

    const tables = ['users', 'season_keywords', 'records', 'wishlist']
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: テーブルが正常に作成されています`)
      }
    }

    console.log('\nデータベースセットアップが完了しました！')
    console.log('次に以下のコマンドでテストデータを作成してください:')
    console.log('npm run create-test-data')

  } catch (error) {
    console.error('セットアップエラー:', error)
  }
}

if (require.main === module) {
  setupDatabase()
}

export { setupDatabase }