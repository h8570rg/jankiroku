# 雀鬼録

雀鬼録は麻雀成績管理アプリケーションです。

# クイックスタート

## 前提条件

- Node.js（バージョンは[package.json](package.json)を参照）
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（DB 変更作業・E2E で使用）

## リポジトリのクローン

```shell
git clone https://github.com/h8570rg/jankiroku.git
cd jankiroku
pnpm install
```

## 環境変数（remote / local の切り替え）

接続先は `.env.local` の `NEXT_PUBLIC_SUPABASE_*` で切り替えます。起動コマンドはどちらも `pnpm run dev` です。

### 開発用 remote に繋ぐ（基本）

```shell
pnpm dlx vercel login
pnpm dlx vercel env pull .env.local
```

### ローカル Supabase に繋ぐ（DB 変更時）

```shell
pnpm run supabase:start
```

起動ログ（または `pnpm exec supabase status`）に出る **API URL** と **Publishable key**（表記が `anon key` の場合もある）を `.env.local` に設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Publishable key>
```

remote に戻すときは、再度 `pnpm dlx vercel env pull .env.local` を実行します。

## 基本方針

| 作業 | 使うもの |
| --- | --- |
| 普段のアプリ開発 | remote（開発用 Supabase）← **こちらが基本** |
| DB（スキーマ）変更 | **ローカル Supabase のみ** |
| E2E | ローカル Supabase（実行のたび DB reset） |

**remote の Studio / SQL Editor ではスキーマを変更しないでください。**  
変更は必ず local → migration → コミット → CI で remote へ適用します。

## アプリケーションの起動

```shell
pnpm run dev
```

アプリ: http://localhost:3001  
（接続先は上記の `.env.local` の内容に従います）

# データベーススキーマの変更

## 流れ

```text
1. ローカル Supabase を起動し、.env.local を local 向けに編集
2. ローカルでスキーマを変更（ローカル Studio または SQL）
3. migration を作成（diff または手書き）
4. reset で再現確認 + 型更新
5. コミット
6. main への merge / push で CI が remote に db push
7. （任意）vercel env pull で .env.local を remote 向けに戻す
```

## 手順

### 1. ローカルを起動し、アプリを local に繋ぐ

```shell
pnpm run supabase:start
```

`.env.local` をローカル向けに編集してから:

```shell
pnpm run dev
```

ローカル Studio の URL は次で確認します。

```shell
pnpm exec supabase status
```

### 2. スキーマを変更する

- **ローカル Studio** の Table Editor / SQL Editor で変更する  
  または
- SQL を手書きする:

```shell
pnpm run supabase:migration -- <descriptive_name>
# → supabase/migrations/<timestamp>_<descriptive_name>.sql を編集
```

### 3. マイグレーションファイルを作る（Studio で変えた場合）

```shell
pnpm run supabase:diff -- -f <descriptive_name>
```

ローカル DB と既存 migrations の差が `supabase/migrations/` に保存されます。

### 4. 再現確認と型更新

```shell
pnpm run supabase:reset
pnpm run supabase:type
```

### 5. コミット

少なくとも次をコミットします。

- `supabase/migrations/`
- 更新していれば `lib/database.types.ts`

### 6. remote への適用

**GitHub Actions が行います。** `main` への push で本番へ `db push` されます。

手元から linked プロジェクトへ当てる必要があるときだけ:

```shell
pnpm run supabase:login
pnpm run supabase:link
pnpm run supabase:push
```

## よく使うコマンド

| コマンド | 用途 |
| --- | --- |
| `pnpm run supabase:start` | ローカル Supabase 起動 |
| `pnpm run supabase:stop` | 停止 |
| `pnpm run supabase:reset` | migrations + seed で作り直し |
| `pnpm run supabase:migration -- <name>` | 空の migration を作成 |
| `pnpm run supabase:diff -- -f <name>` | ローカル DB の差分から migration 作成 |
| `pnpm run supabase:type` | ローカル DB から型生成 |
| `pnpm run supabase:push` | linked remote へ migration 適用 |
| `pnpm run dev` | アプリ起動（接続先は `.env.local`） |

# E2Eテスト

ローカル Supabase に対して実行します。  
**実行のたびに DB が reset され、ローカルのデータは seed 初期状態に戻ります。**

## 前提条件

- Docker Desktop が起動していること

## セットアップ

```shell
pnpm exec playwright install chromium   # 初回のみ
pnpm run supabase:start
```

## テストの実行

```shell
pnpm run test:e2e
# または
pnpm run test:e2e:ui
```

停止（任意）:

```shell
pnpm run supabase:stop
```

手動で seed に戻す:

```shell
pnpm run supabase:reset
```

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

- Playwright の `webServer` が Next.js を 3003 で起動し、ローカル Supabase 向け env を渡します（`.env.local` は上書き）
- `global-setup` で毎回 DB を reset します
- `auth.setup.ts` がテスト用ユーザーでログインし、セッションを保存します

# リンク

- [Local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows)
- [Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
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
