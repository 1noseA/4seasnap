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
1. 初回アクセス時: 匿名ユーザー自動作成
2. プロフィール設定画面表示（スキップ可能）
3. 端末識別IDをlocalStorageで管理

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
