# Vercelへのデプロイ手順

このガイドでは、Pet CollaboサイトをGitHubにプッシュし、Vercelでデプロイする方法を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料）
- Resendアカウント（無料）

## 手順

### 1. Resend APIキーの取得

1. [Resend](https://resend.com) にアクセス
2. 「Sign Up」で無料アカウントを作成
3. ダッシュボードで「API Keys」をクリック
4. 「Create API Key」をクリック
5. APIキーをコピー（後で使用）

**無料プラン:**
- 月3,000件まで無料
- クレジットカード不要

### 2. GitHubリポジトリの作成とプッシュ

```bash
# Gitリポジトリの初期化（既に完了している場合はスキップ）
git init
git add .
git commit -m "Initial commit: Pet Collabo website"

# GitHubで新しいリポジトリを作成後、リモートを追加
git remote add origin https://github.com/あなたのユーザー名/pet-collabo.git
git branch -M main
git push -u origin main
```

### 3. Vercelへのデプロイ

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」でGitHubアカウントで登録
3. 「Add New...」→「Project」をクリック
4. GitHubリポジトリ（pet-collabo）を選択
5. 「Import」をクリック

#### プロジェクト設定

- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

「Deploy」をクリック前に環境変数を設定します。

### 4. 環境変数の設定

「Environment Variables」セクションで以下を追加:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | （Resendで取得したAPIキー） |

**重要:**
- `RESEND_API_KEY` は本番環境用です
- Vercelが自動的にServerless Functionsで使用します

### 5. デプロイ

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待つ（2-3分）
3. デプロイ完了後、Vercelが提供するURLにアクセス

### 6. メール受信先の設定

`api/send-email.ts` の57行目を編集して、実際のメールアドレスに変更:

```typescript
to: ['your-email@example.com'], // 実際のメールアドレスに変更
```

変更後、GitHubにプッシュすると自動的に再デプロイされます:

```bash
git add .
git commit -m "Update email recipient"
git push
```

### 7. カスタムドメインの設定（オプション）

Vercelダッシュボード → Settings → Domains で独自ドメインを追加できます。

## テスト

1. デプロイされたサイトにアクセス
2. 「Get in Touch」セクションまでスクロール
3. フォームを入力して送信
4. 成功メッセージが表示されることを確認
5. 設定したメールアドレスに通知が届くことを確認

## トラブルシューティング

### メールが送信されない

1. Vercelダッシュボード → Functions → Logs を確認
2. エラーログを確認
3. `RESEND_API_KEY` が正しく設定されているか確認

### デプロイエラー

1. Vercelのビルドログを確認
2. `npm run build` がローカルで成功するか確認
3. Node.jsのバージョンを確認（推奨: 18.x以上）

### 環境変数が反映されない

1. Vercelダッシュボードで環境変数を再確認
2. 「Redeploy」ボタンで再デプロイ

## 継続的デプロイ

GitHubにプッシュするたびに、Vercelが自動的に再デプロイします:

```bash
git add .
git commit -m "Update content"
git push
```

## コスト

- **Vercel**: 無料（Hobbyプラン）
- **Resend**: 無料（月3,000件まで）
- **合計**: 完全無料 ✨

## セキュリティ

- `.env` ファイルは `.gitignore` に含まれているため、GitHubにプッシュされません
- 環境変数はVercelのダッシュボードで安全に管理されます
- APIキーは絶対にコードに直接書かないでください

## サポート

問題が発生した場合:
- [Vercel Documentation](https://vercel.com/docs)
- [Resend Documentation](https://resend.com/docs)
