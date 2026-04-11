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

# E2Eテスト

E2Eテストには [Playwright](https://playwright.dev/) を使用し、ローカルの Supabase 環境に対して実行します。

## 前提条件

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) が起動していること

## セットアップ

Playwright のブラウザをインストールします（初回のみ）。

```shell
npx playwright install chromium
```

## テストの実行

### 1. ローカル Supabase を起動する

```shell
npx supabase start
```

初回はイメージのダウンロードに数分かかります。`supabase start` はマイグレーションの適用とシードデータ（テストユーザー）の投入を自動で行います。

### 2. テストを実行する

```shell
npm run test:e2e
```

UI モードで実行する場合：

```shell
npm run test:e2e:ui
```

### 3. ローカル Supabase を停止する（任意）

テストが終わったら停止できます。次回のテストまで起動したままでも問題ありません。

```shell
npx supabase stop
```

## データのリセット

テストデータを初期状態に戻したい場合：

```shell
npx supabase db reset
```

マイグレーションの再適用とシードデータの再投入が行われます。

## テストユーザー

| 項目 | 値 |
| --- | --- |
| メールアドレス | `test@example.com` |
| パスワード | `password123` |
| 表示名 | テストユーザー |
| 表示ID | testuser |

テストユーザーは `supabase/seed.sql` で定義されています。

## 構成

```
e2e/
├── auth.setup.ts   # 認証セットアップ（ログインしてセッションを保存）
├── auth.spec.ts    # ログイン・ログアウトのテスト
└── .auth/          # セッション情報の保存先（.gitignore済み）
playwright.config.ts  # Playwright設定
```

## 仕組み

- Playwright の `webServer` 設定により、テスト実行時に Next.js 開発サーバーが自動起動します
- 開発サーバーはローカル Supabase に接続するよう環境変数が設定されます（`.env.local` の値は上書きされます）
- `auth.setup.ts` がテスト用ユーザーでログインし、セッション情報を保存します
- 各テストは保存されたセッションを再利用するため、毎回ログインする必要がありません

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
