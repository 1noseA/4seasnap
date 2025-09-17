# 4Seasnap

季節を感じるお出かけ記録アプリケーション

## プロジェクト概要

「4Seasnap」は季節のキーワードからAIレコメンドでスポットを探し、訪問記録をカレンダーにスタンプとして残すWebアプリケーションです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Storage)
- **認証**: Supabase匿名認証 + 端末識別ID
- **デプロイ**: Vercel

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、Supabaseの設定を追加：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabaseテーブルの作成

Supabaseダッシュボードで以下のSQLを実行してテーブルを作成：

#### usersテーブル
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) NOT NULL UNIQUE,
  user_name VARCHAR(10),
  profile_image VARCHAR(500),
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLSポリシーを設定（匿名ユーザーがアクセス可能）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to users" ON users
  FOR ALL USING (true);
```

#### season_keywordsテーブル
```sql
CREATE TABLE season_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_name VARCHAR(20) NOT NULL,
  season_type VARCHAR(1) NOT NULL CHECK(season_type IN ('1','2','3','4')),
  month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE season_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to season_keywords" ON season_keywords
  FOR SELECT USING (true);

-- 初期データの投入
INSERT INTO season_keywords (keyword_name, season_type, month, display_order) VALUES
  ('桜', '1', 4, 1),
  ('花見', '1', 4, 2),
  ('いちご狩り', '1', 3, 3),
  ('菜の花', '1', 3, 4),
  ('ピクニック', '1', 5, 5),
  ('花火', '2', 7, 1),
  ('海', '2', 7, 2),
  ('プール', '2', 8, 3),
  ('かき氷', '2', 8, 4),
  ('夏祭り', '2', 8, 5),
  ('紅葉', '3', 11, 1),
  ('月見', '3', 9, 2),
  ('ハロウィン', '3', 10, 3),
  ('栗拾い', '3', 10, 4),
  ('コスモス', '3', 10, 5),
  ('クリスマス', '4', 12, 1),
  ('雪', '4', 1, 2),
  ('イルミネーション', '4', 12, 3),
  ('温泉', '4', 2, 4),
  ('梅', '4', 2, 5);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 機能

### Phase 1 (MVP) - 実装済み
- [x] Supabase匿名認証
- [x] 端末識別ID管理
- [x] プロフィール設定画面（ユーザー名・プロフィール画像）
- [x] カレンダー画面の基本UI
- [x] 季節に応じた背景色の変更

### Phase 1 (MVP) - 実装予定
- [ ] 季節キーワード選択画面
- [ ] AIレコメンド機能（Google Gemini連携）
- [ ] お出かけ記録登録機能
- [ ] 記録データの表示

### Phase 2 - 予定
- [ ] GPS自動取得 + Google Maps API
- [ ] Wishリスト機能
- [ ] UI/UX改善（季節テーマの強化）

## ディレクトリ構造

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   ├── calendar/       # カレンダー画面
│   └── globals.css     # グローバルスタイル
├── components/         # Reactコンポーネント
├── contexts/           # React Context
├── lib/                # ユーティリティ
└── types/              # TypeScript型定義
```

## 設計ドキュメント

詳細な設計については以下のドキュメントを参照してください：

- [`docs/requirements.md`](docs/requirements.md) - 要件定義
- [`docs/design.md`](docs/design.md) - 設計書（データベース、API、画面設計）
- [`docs/issue.md`](docs/issue.md) - ユーザーストーリーとタスク詳細
