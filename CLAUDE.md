# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「4Seasnap」は季節を感じる外出を記録するWebアプリケーションです。季節のキーワードからAIレコメンドでスポットを探し、訪問記録をカレンダーにスタンプとして残すことで外出のモチベーション向上を図ります。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Storage)
- **認証**: Supabase匿名認証 + 端末識別ID
- **外部API**: Google Gemini 2.0 Flash（AIレコメンド）、Google Maps API（Phase 2）
- **デプロイ**: Vercel

## データベース構造

### 主要テーブル

1. **users** - 匿名ユーザー管理
2. **season_keywords** - 季節キーワード
3. **records** - お出かけ記録
4. **wishlist** - 行きたいスポット（Phase 2）

### データ設計のポイント

- 全テーブルに監査項目（created_by, created_at, updated_by, updated_at）
- コード値管理: 季節区分・移動手段は数値コード + TypeScript Union型
- セキュリティ: 端末識別IDはリクエストボディで送信（URLパラメータ使用禁止）

## アーキテクチャ特徴

### 認証フロー
1. 初回アクセス時: ログイン画面表示
2. ゲストログイン: 匿名ユーザー自動作成
3. プロフィール設定画面表示（スキップ可能）
4. 端末識別IDをlocalStorageで管理

### 画面構成
- **ボトムナビゲーション**: カレンダー（トップ）、季節キーワード、Wishリスト
- **メインフロー**: キーワード選択 → AIレコメンド → スポット選択 → 記録登録
- **モバイルファースト設計**: スマートフォンブラウザ最適化

### AI連携
- Google Gemini 2.0 Flash（無料版）
- 季節キーワード + 現在地 → おすすめスポット3-5件を生成
- 親しみやすく丁寧なトーンでの応答設定

## 開発フェーズ

### Phase 1 (MVP)
- 基本UI + Supabase認証・データ保存
- 季節キーワード + Gemini連携
- 記録登録機能（手動入力）

### Phase 2
- GPS自動取得 + Google Maps API
- Wishリスト機能
- UI/UX改善（季節テーマ）

## 重要な設計制約

- **完全無料運用**: Supabase無料プラン、Gemini無料版、Vercel無料枠
- **パフォーマンス目標**: 初期ロード3秒以内、AI応答5秒以内
- **操作性**: 記録登録は3ステップ以内
- **データ整合性**: CHECK制約による入力値制限
- **セキュリティ**: APIキーはサーバーサイド管理、HTTPS必須

## 設計ドキュメント参照

開発時は以下のドキュメントを必ず参照すること：

- **`docs/requirements.md`** - 要件定義書：機能要件、非機能要件、画面フロー
- **`docs/design.md`** - 設計書：データベース設計、API設計、画面設計、プロンプト設計
- **`docs/issue.md`** - 実装タスク：ユーザーストーリー、受け入れ基準、タスク詳細

これらのドキュメントに記載された仕様に従って実装を行い、不明点があれば必ずドキュメントを確認してから質問すること。

## 重要な注意事項

### ハイドレーションエラー対策
Next.jsのSSRでサーバーとクライアントのHTML差分によるエラーを防ぐため、以下を必須とする：

1. **Date.now()、Math.random()等の動的値は禁止**: サーバーとクライアントで異なる値になるため
2. **季節判定は必ずuseEffect内で実行**: クライアント側でのみ実行されるようにする
3. **mounted状態でクライアント専用処理を制御**: サーバーとクライアントで同一のHTMLを保証
4. **初期表示は静的な内容**: ローディング画面等でサーバー・クライアント差分を回避

### 必須パターン
```tsx
const [mounted, setMounted] = useState(false)
const [season, setSeason] = useState<SeasonType>('spring')

useEffect(() => {
  setMounted(true)
  setSeason(getCurrentSeason()) // Date依存処理はここで実行
}, [])

if (!mounted) {
  return <div>読み込み中...</div> // サーバー・クライアント共通の表示
}
// mounted後のみ動的コンテンツを表示
```

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.


      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.