# 4Seasnap - 季節を感じるお出かけ記録アプリ

## 🎯 概要

「4Seasnap」は季節を感じる外出を記録するWebアプリケーションです。季節のキーワードからAIレコメンドでスポットを探し、訪問記録をカレンダーにスタンプとして残すことで外出のモチベーション向上を図ります。

## 🚀 クイックスタート

### 開発環境の起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーが起動します（通常 `http://localhost:3001`）。

### 📱 デモンストレーション

**現在、アプリはモックデータを使用してデモンストレーションできます：**

1. ブラウザで開発サーバーのURLにアクセス
2. 「ゲストログイン」をクリック
3. プロフィール設定（スキップ可能）
4. **カレンダー画面で記録のある日付（3日、7日、12日、18日、25日）をクリック**
5. 記録詳細画面で内容を確認
6. ボトムナビゲーションで各画面への遷移を確認

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- **バックエンド**: Supabase (PostgreSQL, Auth, Storage)
- **認証**: Supabase匿名認証 + 端末識別ID
- **外部API**: Google Gemini 2.0 Flash（Phase 2予定）
- **デプロイ**: Vercel

## 📋 実装済み機能

### ✅ カレンダー機能
- 7×6グリッドの月カレンダー表示
- 記録のある日付にスタンプ（季節カラーの丸マーク）表示
- 季節に応じた背景色の自動変更
- 現在月・季節アイコン・プロフィール画像を含むヘッダー

### ✅ 季節テーマシステム
- 春（桜色系）、夏（スカイブルー系）、秋（ベージュ系）、冬（ライトスチールブルー系）
- CSS変数による統一的なカラー管理
- 季節アイコンの自動切り替え

### ✅ 記録システム
- 記録詳細画面（写真、コメント、歩数、移動時間、移動手段）
- 記録のある日付からの詳細画面遷移
- モックデータによるデモンストレーション

### ✅ ナビゲーション
- ボトムナビゲーション（カレンダー、季節キーワード、Wishリスト）
- アクティブ状態の視覚的フィードバック
- 各画面への遷移機能

### ✅ レスポンシブ対応
- スマートフォン最適化（375px〜414px）
- タッチ操作対応（最小44px）
- セーフエリア対応

## 🎨 デザインシステム

### 季節別カラーテーマ

| 季節 | 期間 | 主要色 | 背景色 | アイコン |
|------|------|--------|--------|----------|
| 春 | 3-5月 | #FFB7C5 | #FFF8F0 | 🌸 |
| 夏 | 6-8月 | #87CEEB | #F0F8FF | 🌻 |
| 秋 | 9-11月 | #DEB887 | #FFF8DC | 🍁 |
| 冬 | 12-2月 | #B0C4DE | #F8F8FF | ⛄ |

## 🔧 セットアップ

### 環境変数

`.env.local` ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### データベースセットアップ

1. Supabase管理画面でプロジェクトを作成
2. `scripts/setup-database.sql` のSQLを実行してテーブルを作成
3. テーブル確認: `npm run check-tables`
4. テストデータ作成: `npm run create-test-data`

## 🎯 コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# リンティング
npm run lint

# データベーステーブル確認
npm run check-tables

# テストデータ作成
npm run create-test-data
```

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
