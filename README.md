# janreco

janreco は麻雀成績管理 web アプリです。

## Quick Start

### clone repository

```shell
git clone https://github.com/h8570rg/janreco.git
cd janreco
npm install
```

env

```shell
cp .env.example .env.local
```

### supabase と接続

docker desctop を準備。

https://www.docker.com/products/docker-desktop/

production の DB と link

```shell
npm run supabase:login
npm run supabase:link
npm run supabase:commit
```

password は author に確認

supabase を起動

```shell
npm run supabase
```

出力された API URL、anon key を記録し、.env.local を編集

```
NEXT_PUBLIC_SUPABASE_URL=<API URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

### 起動

```shell
npm run dev
```

url: http://localhost:3001
supabase studio url: http://localhost:54323

## Links

- [supabase](https://supabase.com/docs)
