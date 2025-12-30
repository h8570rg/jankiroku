# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 言語設定

**このリポジトリでの作業時は、すべての応答、説明、コメントを日本語で行ってください。**

コードレビュー、エラーメッセージ、コミットメッセージ、すべてのコミュニケーションは日本語で記述してください。

## プロジェクト概要

雀鬼録 (Jankiroku) は、Supabaseをデータベースと認証に使用したNext.js麻雀成績管理アプリケーションです。

**技術スタック:**

- Next.js (App Router) + React
- Supabase (PostgreSQL + Auth)
- TypeScript (strict mode)
- HeroUI + Tailwind CSS
- Biome (linting/formatting)
- Vitest (testing)

詳細なバージョンは [package.json](package.json) を参照してください。Nodeバージョンは Volta で管理されています。

## 開発コマンド

### 基本コマンド
```bash
# セットアップ（初回のみ）
npm install
cp .env.example .env.local
# .env.local にSupabase認証情報を設定

# ローカルSupabaseの起動（Docker Desktopが必要）
npm run supabase:start

# データベースマイグレーションの適用
npm run supabase:reset

# 開発
npm run dev                 # 開発サーバーを起動（ポート3001）

# コード品質
npm run check              # Biome lint + format（コミット前に実行）
npm run type               # TypeScript型チェック
npm test                   # Vitestテスト実行
npm run spell              # CSpellチェック

# Supabase
npm run supabase:type      # DBスキーマからTypeScript型を生成
npm run supabase:diff      # スキーマ変更からマイグレーションSQLを生成
npm run supabase:stop      # ローカルSupabaseを停止
```

### Git Hooks (Lefthook)
- **pre-commit**: `npm run check -- --write {staged_files}` を実行し、修正を自動ステージング
- **pre-push**: typecheck、tests、spell checkを並列実行

## アーキテクチャ

### サービス層パターン

**サーバー/クライアント分離のための二層サービスファクトリー:**

```typescript
// Server Components
const { getMatches, getUser } = await serverServices();
const matches = await getMatches({});

// Client Components
const { updateUserProfile } = browserServices();
await updateUserProfile({ name: "..." });
```

**サービスファイル:**
- `lib/services/server.ts` - サーバーサイドファクトリー（SSR Supabaseクライアントを使用）
- `lib/services/browser.ts` - クライアントサイドファクトリー（ブラウザSupabaseクライアントを使用）
- `lib/services/features/*.ts` - 機能モジュール（match, profile, friend, game）

### データベースアーキテクチャ

**コアテーブル:**
- `profiles` - ユーザープロフィール（name, display_id）
- `matches` - 成績表/セッション
- `match_players` - 参加者とチップ記録
- `rules` - ゲームルール（人数、レート、ウマ、計算方法）
- `games` - 個別ゲームラウンド（半荘）
- `game_players` - ゲームごとのプレイヤースコアと順位
- `friends` - 友達関係

**すべてのテーブルでRLS (Row Level Security) が有効です。**

### 認証フロー

1. `middleware.ts` - すべてのリクエストでセッションを更新
2. OAuthコールバック: `/app/api/auth/callback`
   - コードをセッションに交換
   - ユーザーが登録済み（プロフィールあり）かチェック
   - `/register` または `/matches` にリダイレクト
3. Supabaseクライアントがトークン更新を自動処理

**クライアントタイプ:**
- Server: `lib/utils/supabase/server.ts` (Server Components/Actions用)
- Browser: `lib/utils/supabase/client.ts` (Client Components用)

### コンポーネントパターン

**Server Components (デフォルト):**
- `await serverServices()` を使って直接データ取得
- 並列取得には `Promise.all()` を使用
- ローディング状態にはSuspenseでラップ

**Client Components ("use client"):**
- モーダル、フォーム、インタラクティブ要素
- 共有状態にはContext APIを使用（例: match詳細ページのモーダル）
- フォームバリデーションにはReact Hook Form + Zodを使用

**Context パターンの例:**
```typescript
// context.ts - コンテキスト定義
export const MatchContext = createContext<ModalStates>(...)

// _components/ContextProvider.tsx - クライアントコンポーネントでプロバイド
"use client"
export function MatchContextProvider({ children }) {
  const modals = { playersModal: useModal(), ... }
  return <MatchContext.Provider value={modals}>{children}</MatchContext.Provider>
}

// page.tsx - サーバーコンポーネントで利用
<MatchContextProvider>
  <MatchDetail /> {/* useMatchContext()が使える */}
</MatchContextProvider>
```

## ビジネスロジック: 麻雀スコア計算

**主要モジュール:** `lib/utils/score.ts`

```typescript
calcPlayerScores(players, rule) // メインエントリーポイント
├── sortByPoints()              // 点数の降順でソート
├── calcScore()                 // 個別スコアを計算
│   └── calcRound()            // 丸め処理を適用（五捨六入/四捨五入/切り捨て/切り上げ）
└── balanceFirstPlace()         // 1位スコア = -(その他の合計)
```

**特殊メカニクス:**
- **Incline (ウマ)**: 順位に基づいて加算される固定ポイント
- **Rate (レート)**: ポイント倍率（例: テンピン = 1000点あたり10ポイント）
- **Chip (チップ)**: 円単位での別途チップ記録

**テストカバレッジ:** `lib/utils/score.test.ts` に487行以上の包括的テスト

## バリデーションスキーマ

**場所:** `lib/utils/schema.ts` (Zodスキーマ)

主要スキーマ:
- `email`, `password`, `name`, `displayId`
- `points` - 表示値を点数に変換（×100）
- `calcMethod` - 丸め方法の列挙型
- `chipRate` - チップの円単位価値
- カスタム `incline` バリデーション（合計が0である必要あり）

**React Hook Formでの使用:**
```typescript
const form = useForm({ resolver: zodResolver(schema) })
```

## 設定と定数

**場所:** `lib/config.ts`

定義内容:
- `rates`: [0, 1, 2, 3, 5, 10, 20, 50, 100] 日本語ラベル付き（テンイチ、テンニなど）
- `chipRates`: [0, 50, 100, 200, 500, 1000]
- `calcMethods`: ['round', 'roundOff', 'roundDown', 'roundUp']
- `inclines`: 4人打ちと3人打ち用の事前定義（ゴットー、ワンツー、ワンスリーなど）

## プロジェクト用語

コード全体で使用される日本語麻雀用語:

| コード | 意味 |
|--------|------|
| user | ログインしているユーザー |
| match | 成績表 |
| game | 半荘 |
| score | ポイント |
| points | 点数 |
| result | 収支 |
| rate | レート |
| chip | チップ |
| incline | ウマ |

## ファイル構造規約

```
/app
  /(auth)          # 認証ルートグループ (login, sign-up, register)
  /(main)          # メインアプリルートグループ (matches, friends)
  /(lp)            # ランディングページ
  _components/     # プライベートコンポーネント（アンダースコアプレフィックス）

/lib
  /services        # サービス層
    /features      # 機能モジュール
  /utils           # ユーティリティ
    /supabase      # Supabaseクライアント

/components        # 再利用可能なUIコンポーネント
```

## コード品質基準

**Biomeによる強制:**
- 未使用のimportを禁止（自動修正有効）
- 未使用の関数パラメータを禁止（自動修正有効）
- 保存時にimportを整理
- Git統合によるスマートリンティング

**TypeScript:**
- Strictモード有効
- パスエイリアス: `@/*` はルートディレクトリにマッピング
- 自動生成型: `lib/database.types.ts`（Supabaseスキーマから）

**テスト:**
- ユニットテストにはVitestを使用
- テストファイル命名: `*.test.ts`
- ビジネスロジック（スコア計算）に重点

## 環境変数

**`.env.local` で必須:**
```
NEXT_PUBLIC_SUPABASE_URL=<supabase:startから取得>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<supabase:startから取得>
GOOGLE_CLIENT_ID=<Google Cloud Consoleから取得>
GOOGLE_CLIENT_SECRET=<Google Cloud Consoleから取得>
MAINTENANCE_MODE=false
```

## 重要なアーキテクチャ上の決定事項

1. **Server Components優先**: デフォルトはServer Components、"use client"は必要な場合のみ（インタラクティブ性、hooks、context）

2. **サービス層**: 一貫性と型安全性のため、直接Supabaseクエリではなく常にサービス関数を使用

3. **型生成**: スキーマ変更後は `npm run supabase:type` を実行して `database.types.ts` を再生成

4. **モーダル状態管理**: 1ページ内の複数モーダル管理にはContext APIを使用（matches/[matchId]を参照）

5. **フォームバリデーション**: フォームには常にReact Hook Form + Zod resolverを使用

6. **丸めロジック**: すべてのスコア計算には `lib/utils/score.ts` の一元化された `calcRound()` 関数を使用

7. **認証**: `auth.users` に直接アクセスしない。常に `profiles` テーブルを使用

## よくある落とし穴

- **Display IDバリデーション**: 4-12文字の英数字のみ（特殊文字不可）
- **PointsとScore**: "points"は生の値（例: 25000）、"score"はレート/ウマ適用後の計算結果
- **Inclineバリデーション**: incline値の合計は0である必要あり（誰かが勝てば誰かが負ける）
- **1位スコア**: 常に-(他プレイヤーの合計)として計算され、ゼロサムを維持
- **Server/Client Supabase**: コンポーネントタイプに基づいて正しいクライアントタイプ（server vs browser）を使用
- **RLSポリシー**: すべてのデータベースアクセスはユーザーセッションでフィルタリングされる。複数ユーザーでテストすること
