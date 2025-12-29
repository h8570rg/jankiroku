# コミットとプッシュ

## 概要

現在の変更を自動的にステージング、コミット、プッシュするシンプルなワークフロー。PRは作成しません。

**言語仕様**:

- コミットメッセージ: 英語(Conventional Commits準拠)

## 手順

1. **変更の確認と準備**
   - 現在の git status を確認
   - 変更されたファイルの差分を解析
   - 変更内容から適切なコミットメッセージを自動生成

2. **ステージングとコミット**
   - すべての変更をステージング (`git add .`)
   - 差分から自動生成されたコミットメッセージでコミット
   - 必要に応じてコミットメッセージを調整

3. **プッシュ**
   - 現在のブランチをリモートにプッシュ

## 自動化されるタスク

- [ ] git status の確認と変更ファイルの特定
- [ ] git diff の解析と英語のコミットメッセージを自動生成(Conventional Commits準拠)
- [ ] すべての変更をステージング
- [ ] 英語のコミットメッセージでコミット(feat:, fix:, docs: など)
- [ ] 現在のブランチをリモートにプッシュ

## コミットメッセージのフォーマット(英語・Conventional Commits準拠)

**機能追加**: `feat: add user authentication system`
**バグ修正**: `fix: resolve login validation issue`
**リファクタリング**: `refactor: improve database query performance`
**ドキュメント**: `docs: update API documentation`
**スタイル**: `style: fix code formatting and linting issues`
**テスト**: `test: add unit tests for user service`
**雑務**: `chore: update dependencies and build tools`
**パフォーマンス**: `perf: optimize image loading performance`
**ビルド**: `build: update webpack configuration`
**CI/CD**: `ci: add automated deployment pipeline`

### 破壊的変更がある場合

`feat!: change authentication API structure` (感嘆符で破壊的変更を示す)

## 注意事項

- リモートリポジトリが正しく設定されていることを確認
- コミットメッセージはConventional Commits仕様(英語)に準拠
- 機密情報が含まれていないか変更内容を最終確認
- プッシュ前にコミットメッセージの内容を確認

## エラーハンドリング

- コミットする変更がない場合の警告
- リモートブランチが存在しない場合は自動で作成
- プッシュ時のコンフリクトがある場合は解決方法を提案
- 認証エラーが発生した場合の対処法
