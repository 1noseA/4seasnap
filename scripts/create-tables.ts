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

async function checkAndCreateTables() {
  console.log('データベーステーブルの確認を開始します...')

  // テーブル存在確認
  const tables = [
    { name: 'users', desc: 'ユーザー情報' },
    { name: 'season_keywords', desc: '季節キーワード' },
    { name: 'records', desc: 'お出かけ記録' },
    { name: 'wishlist', desc: 'Wishリスト' }
  ]

  const missingTables = []

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ ${table.name} (${table.desc}): テーブルが存在しません`)
        missingTables.push(table)
      } else {
        console.log(`✅ ${table.name} (${table.desc}): テーブルが存在します`)
      }
    } catch (err) {
      console.log(`❌ ${table.name} (${table.desc}): アクセスできません`)
      missingTables.push(table)
    }
  }

  if (missingTables.length > 0) {
    console.log('\n📋 以下のテーブルが不足しています:')
    missingTables.forEach(table => {
      console.log(`   - ${table.name} (${table.desc})`)
    })

    console.log('\n🔧 Supabase管理画面でテーブルを作成してください:')
    console.log('1. https://supabase.com/dashboard にアクセス')
    console.log('2. プロジェクトを選択')
    console.log('3. Database > Tables に移動')
    console.log('4. 以下のSQLを「SQL Editor」で実行:')
    console.log('\n' + getDDLSQL())

    return false
  } else {
    console.log('\n✅ 全てのテーブルが正常に存在します！')
    return true
  }
}

function getDDLSQL() {
  return `
-- usersテーブル
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL UNIQUE,
    user_name VARCHAR(10),
    profile_image TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- season_keywordsテーブル
CREATE TABLE IF NOT EXISTS season_keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword_name VARCHAR(20) NOT NULL,
    season_type VARCHAR(1) CHECK(season_type IN ('1','2','3','4')),
    month INTEGER CHECK(month BETWEEN 1 AND 12),
    display_order INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- recordsテーブル
CREATE TABLE IF NOT EXISTS records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    photo_url VARCHAR(500),
    comment TEXT NOT NULL,
    steps INTEGER DEFAULT 0,
    travel_time_minutes INTEGER DEFAULT 0,
    transport_method VARCHAR(1) DEFAULT '1',
    season_keyword VARCHAR(20) NOT NULL,
    spot_name VARCHAR(50) NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 基本的なRLSポリシー
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON season_keywords FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON season_keywords FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON records FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON records FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON records FOR UPDATE USING (true);
`
}

if (require.main === module) {
  checkAndCreateTables()
}

export { checkAndCreateTables }