# janreco

janrecoは麻雀成績管理webアプリです。

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

### supabaseと接続

docker desctopを準備。

https://www.docker.com/products/docker-desktop/

productionのDBとlink

```shell
npm run supabase:login
npm run supabase:link
npm run supabase:commit
```
passwordはauthorに確認

supabaseを起動

```shell
npm run supabase
```

出力されたAPI URL、anon keyを記録し、.env.localを編集

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