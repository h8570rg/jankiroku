# mj-app-pwa からのデータ移管手順

## 概要

このドキュメントでは、旧サービス（mj-app-pwa）から新サービスへのデータ移管方法を説明します。

- 旧サービスURL: https://mj-app-pwa.web.app
- 旧サービスリポジトリ: https://github.com/h8570rg/mjapp

## 手順

### 1. Firebase Console にアクセス

Firebase Consoleに以下のURLからアクセスします：
https://console.firebase.google.com/u/0/project/mj-app-pwa/settings/serviceaccounts/adminsdk?hl=ja

### 2. 秘密鍵の生成

1. 「新しい秘密鍵の生成」をクリックし、JSONファイルをダウンロードします。
2. ダウンロードしたファイルを作業ディレクトリに`credentials.json`という名前で保存します。

### 3. Firestore データのエクスポート

コマンドラインで以下のコマンドを実行し、データをエクスポートします：

```bash
npx -p node-firestore-import-export firestore-export -a credentials.json -b old-data.json
```

生成された`old-data.json`ファイルを`lib/migration`ディレクトリ直下に配置してください：

```
lib/migration
├── README.md
├── index.ts
├── old-data.json
```

### 4. データ移管

#### 4.1 変数の準備

以下の情報を準備します：
- Supabase URL
- Service Role Key
- 移管前ユーザーID
- 移管後ユーザーID

##### Supabase URL と Service Role Key の取得

- 開発環境: https://supabase.com/dashboard/project/ggkmppnjhrwzdsamzqbp/settings/api
- 本番環境: https://supabase.com/dashboard/project/owagpoywxhbsckytdtoj/settings/api

ローカル環境の場合、以下のコマンドで情報を取得します：

```bash
npm run supabase:start
```

##### ユーザーID の取得

- 移管前ユーザーID: 
  https://console.firebase.google.com/u/0/project/mj-app-pwa/firestore/databases/-default-/data/~2Fusers~2F1JfzwtMcu5SImqkNE8dKcq8sWxD2?hl=ja

- 移管後ユーザーID:
  - ローカル環境: http://localhost:54323/project/default/editor
  - 開発環境: https://supabase.com/dashboard/project/ggkmppnjhrwzdsamzqbp/editor
  - 本番環境: https://supabase.com/dashboard/project/owagpoywxhbsckytdtoj/editor

#### 4.2 データ移行の実行

以下のコマンドを実行し、データを新サービスに移行します：

```bash
SUPABASE_URL=<API URL> SERVICE_ROLE_KEY=<service_role key> npm run migration
```

コマンド実行後、移管前ユーザーIDと移管後ユーザーIDを入力するプロンプトが表示されるので、準備した情報を入力してください。


## 注意事項

- service_role key は他者に漏洩しないよう注意してください。
- 複数回実行するとデータが重複して登録されるため、移行処理は1回のみ実行してください。
