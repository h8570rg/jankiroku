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
pnpm install
```

## Supabaseプロジェクトへの接続

Supabase CLIにログインします。

```shell
pnpm run supabase:login
```

開発用のSupabaseプロジェクトにリンクします。

```shell
pnpm run supabase:link
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
pnpm run supabase:diff

# 型定義を更新
pnpm run supabase:type
```

### 方法2: ローカルでマイグレーションファイルを作成

```shell
# 空のマイグレーションファイルを作成
pnpm run supabase:diff -- new_feature

# 生成されたファイルを編集
# supabase/migrations/YYYYMMDDHHMMSS_new_feature.sql

# 型定義を更新
pnpm run supabase:type
```

### マイグレーションの適用

**開発環境・本番環境へのマイグレーション適用は、すべてGitHub Actions経由で自動実行されます。**

- `main`ブランチへのpush → 本番環境に自動適用
- PRマージ → 開発環境に自動適用（設定済みの場合）

## アプリケーションの起動

```shell
pnpm run dev
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
pnpm run test:e2e
```

UI モードで実行する場合：

```shell
pnpm run test:e2e:ui
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

# AI エージェント設定（Claude Code）

## Skills

Skills は Claude Code に専門的な知識や手順を教える仕組みです。`SKILL.md` ファイルとして管理されます。

### 確認

```shell
# インストール済みスキルの一覧
npx skills list

# Claude Code セッション内で確認
/skills
```

### 追加

```shell
npx skills add <owner/repo>

# 例
npx skills add supabase/agent-skills
```

実行すると `.claude/skills/` にファイルが配置され、`skills-lock.json` が更新されます。`skills-lock.json` は git にコミットしてください。

### 適用

Claude Code は `.claude/skills/` 配下の SKILL.md を自動検出します。追加の設定は不要です。

## MCP サーバー

MCP（Model Context Protocol）サーバーは Claude Code に外部ツール連携（DB操作、API呼び出し等）を提供します。

### 確認

```shell
# ターミナルから
claude mcp list

# Claude Code セッション内で確認
/mcp
```

### 追加

```shell
# HTTP/SSE サーバー
claude mcp add <name> --transport http --url <url>

# ローカルプロセス（stdio）
claude mcp add <name> --transport stdio -- <command> [args...]
```

プロジェクト固有の MCP 設定は `.mcp.json` に保存されます。このファイルは git にコミットしてください。秘密情報はファイルに直書きせず、環境変数を使用してください。

### 適用

Claude Code 起動時に `.mcp.json` が自動で読み込まれます。追加の設定は不要です。

# リンク

- [supabase](https://supabase.com/docs)

# 用語

## 人の表現

「プレイヤー」「自分」「認証ユーザー」を、コード上で明確に使い分ける。

| コード         | 意味                                                                                                                                          | 主な型                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `User`         | Supabase の認証ユーザー（`auth.users` の 1 行）。メアド・パスワード・OAuth など認証情報を持つ主体                                             | `User` (`SupabaseUser` の再エクスポート) |
| `UserProfile`  | アプリにログインしている「自分」のアカウント情報。`(main)` 配下の layout で未登録時は `/register` へ redirect されるため必ず登録済み          | `UserProfile`                            |
| `Player`       | マッチ参加者・フレンド・検索結果として登場するプレイヤー。登録済みユーザーとゲストの両方を含み、ゲストは `displayId` / `avatarUrl` を持たない | `Player`                                 |
| `MatchPlayer`  | マッチの参加者個別の試合成績を伴うプレイヤー                                                                                                  | `Player & MatchStats`                    |
| `Guest`        | `profiles.user_id IS NULL` のプレイヤー。`auth.users` とは紐付かない非ログインユーザー                                                        | （`Player` のうちゲスト相当）            |
| `Profile` (DB) | `public.profiles` テーブルの行。`Player` も `UserProfile` もこのテーブルから派生する                                                          | DB レイヤーの語彙                        |

### 使い分けの原則

- 「自分」を扱う画面・処理では `UserProfile` を使う（必ず登録済み、全フィールド non-nullable）
- 「他のプレイヤー」「マッチ参加者」「フレンド」「検索結果」を扱うところでは `Player` を使う（ゲストを含むので `displayId` / `avatarUrl` は optional）
- `UserProfile` は `Player` の structural subtype なので、自分を「プレイヤー」として渡すときは変換不要
- `User` は認証関係 (`getUser`, `auth.uid()`, OAuth フローなど) でのみ使用する
- 「ゲストプレイヤーを作る」など内部実装で guest を意識する箇所では `createGuestPlayer` のように `guest` を明示する。UI 層では「プレイヤー作成」と表現する

## その他

| コード | 意味     |
| ------ | -------- |
| match  | 成績表   |
| game   | 半荘     |
| score  | ポイント |
| points | 点数     |
| result | 収支     |
