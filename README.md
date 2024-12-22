# 雀鬼録

雀鬼録は麻雀成績管理アプリケーションです。

# クイックスタート

## リポジトリのクローン

```shell
git clone https://github.com/h8570rg/jankiroku.git
cd jankiroku
npm install
```

## Supabaseの起動

Docker Desktopをインストールしてください。

https://www.docker.com/products/docker-desktop/

Supabaseを起動します。

```shell
npm run supabase:start
```

すべてのSupabaseサービスが起動すると、ローカルSupabaseの認証情報が表示されます。以下のように、ローカルプロジェクトで使用するURLとキーが表示されます：

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

## 環境変数の作成

```shell
cp .env.example .env.local
```

環境変数を設定します。

```
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## データベーススキーマの適用

```shell
npm run supabase:reset
```

## アプリケーションの起動

```shell
npm run dev
```

アプリケーションURL: http://localhost:3001

Supabase Studio URL: http://localhost:54323

# リンク

- [supabase](https://supabase.com/docs)

# 用語

## 用語一覧

| コード | 意味 |
| ---- | ---- |
| user | ログインしているユーザー |
| match | 成績表 |
| game | 半荘 |
| score | ポイント |
| points | 点数 |
| result | 収支 |
