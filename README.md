# 雀鬼録

雀鬼録は麻雀成績管理アプリケーションです。

# クイックスタート

## 前提条件

- Node.js（バージョンは[package.json](package.json)を参照）
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（Supabase CLIが内部的に使用）

## リポジトリのクローン

```shell
git clone https://github.com/h8570rg/jankiroku.git
cd jankiroku
npm install
```

## Supabaseプロジェクトへの接続

Supabase CLIにログインします。

```shell
npm run supabase:login
```

開発用のSupabaseプロジェクトにリンクします。

```shell
npm run supabase:link
```

## 環境変数の作成

Vercel CLIを使用して環境変数を取得します。

```shell
npx vercel login
npx vercel env pull .env.local
```

これにより、Supabaseの接続情報を含むすべての環境変数が自動的に`.env.local`に設定されます。

## データベーススキーマの変更

### 方法1: Supabase Studioで直接変更（推奨）

開発環境のSupabase Studioで直接スキーマを変更します。

1. [Supabase Studio](https://supabase.com/dashboard/project/ggkmppnjhrwzdsamzqbp)にアクセス
2. Table EditorやSQL Editorでスキーマを変更
3. 変更後、以下のコマンドを手動で実行：

```shell
# マイグレーションファイルを生成
npm run supabase:diff

# 型定義を更新
npm run supabase:type
```

### 方法2: ローカルでマイグレーションファイルを作成

```shell
# 空のマイグレーションファイルを作成
npm run supabase:diff -- new_feature

# 生成されたファイルを編集
# supabase/migrations/YYYYMMDDHHMMSS_new_feature.sql

# 型定義を更新
npm run supabase:type
```

### マイグレーションの適用

**開発環境・本番環境へのマイグレーション適用は、すべてGitHub Actions経由で自動実行されます。**

- `main`ブランチへのpush → 本番環境に自動適用
- PRマージ → 開発環境に自動適用（設定済みの場合）

## アプリケーションの起動

```shell
npm run dev
```

アプリケーションURL: http://localhost:3001

Supabase Studio（リモート）: https://supabase.com/dashboard/project/ggkmppnjhrwzdsamzqbp

# リンク

- [supabase](https://supabase.com/docs)

# 用語

## 用語一覧

| コード | 意味                     |
| ------ | ------------------------ |
| user   | ログインしているユーザー |
| match  | 成績表                   |
| game   | 半荘                     |
| score  | ポイント                 |
| points | 点数                     |
| result | 収支                     |
