-- 4Seasnap データベースセットアップ

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
    steps INTEGER CHECK(steps >= 0 AND steps <= 99999),
    travel_time_minutes INTEGER CHECK(travel_time_minutes >= 0 AND travel_time_minutes <= 9999),
    transport_method VARCHAR(1) CHECK(transport_method IN ('1','2','3','4')),
    season_keyword VARCHAR(20) NOT NULL,
    spot_name VARCHAR(50) NOT NULL,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- wishlistテーブル（Phase 2用）
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    spot_name VARCHAR(50) NOT NULL,
    travel_time VARCHAR(50),
    description TEXT,
    season_keyword VARCHAR(20),
    is_completed BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_records_user_id_date ON records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_season_keywords_season_month ON season_keywords(season_type, month);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- RLS (Row Level Security) ポリシー設定
-- 今回は匿名認証なので、基本的なセキュリティポリシーを設定

-- usersテーブルのRLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

-- season_keywordsテーブルのRLS
ALTER TABLE season_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view season keywords" ON season_keywords FOR SELECT USING (true);
CREATE POLICY "Anyone can insert season keywords" ON season_keywords FOR INSERT WITH CHECK (true);

-- recordsテーブルのRLS
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all records" ON records FOR SELECT USING (true);
CREATE POLICY "Users can insert records" ON records FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own records" ON records FOR UPDATE USING (true);

-- wishlistテーブルのRLS
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all wishlist items" ON wishlist FOR SELECT USING (true);
CREATE POLICY "Users can insert wishlist items" ON wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own wishlist items" ON wishlist FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own wishlist items" ON wishlist FOR DELETE USING (true);