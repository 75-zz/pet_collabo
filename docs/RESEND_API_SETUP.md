# Resend API 設定ガイド

このガイドでは、Pet Collaboのコンタクトフォームで使用するResend APIの設定方法を詳しく説明します。

---

## 📋 目次

1. [Resend APIとは](#resend-apiとは)
2. [アカウント作成](#アカウント作成)
3. [APIキーの取得](#apiキーの取得)
4. [ローカル環境での設定](#ローカル環境での設定)
5. [Vercel本番環境での設定](#vercel本番環境での設定)
6. [メール受信先の設定](#メール受信先の設定)
7. [テスト方法](#テスト方法)
8. [トラブルシューティング](#トラブルシューティング)

---

## Resend APIとは

**Resend**は、開発者向けのシンプルなメール送信APIサービスです。

### 無料プランの特徴

- **月3,000件まで完全無料**
- クレジットカード登録不要
- HTMLメール対応
- 高い到達率
- シンプルなAPI

### 有料プランとの比較

| プラン | 月間送信数 | 料金 |
|--------|-----------|------|
| Free | 3,000件 | $0 |
| Pro | 50,000件 | $20 |
| Business | 100,000件 | $80 |

※ 個人サイトやスタートアップには無料プランで十分です

---

## アカウント作成

### ステップ1: Resendにアクセス

1. ブラウザで https://resend.com を開く
2. 右上の「Sign Up」ボタンをクリック

### ステップ2: アカウント情報を入力

**必要な情報:**
- メールアドレス（Gmail、会社メールなど何でもOK）
- パスワード（8文字以上推奨）

**入力例:**
```
Email: your-email@gmail.com
Password: ********
```

### ステップ3: メール認証

1. 登録したメールアドレスに確認メールが届きます
2. 「Verify Email」ボタンをクリック
3. 自動的にダッシュボードにリダイレクトされます

**所要時間:** 約2-3分

---

## APIキーの取得

### ステップ1: ダッシュボードにログイン

https://resend.com/dashboard にアクセス

### ステップ2: API Keysページへ移動

1. 左サイドバーの「API Keys」をクリック
2. または直接 https://resend.com/api-keys にアクセス

### ステップ3: APIキーを作成

1. 「Create API Key」ボタンをクリック
2. APIキーに名前を付ける（例: "Pet Collabo Production"）
3. 権限を選択:
   - **Sending access**: チェック（必須）
   - **Full access**: チェック不要
4. 「Create」ボタンをクリック

### ステップ4: APIキーをコピー

⚠️ **重要:**
APIキーは**一度しか表示されません**。必ずコピーして安全な場所に保存してください。

**APIキーの形式:**
```
re_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**保存場所の例:**
- パスワード管理ツール（1Password、Bitwardenなど）
- セキュアなメモアプリ
- `.env`ファイル（gitignoreに追加済み）

---

## ローカル環境での設定

### ステップ1: .envファイルを作成

プロジェクトのルートディレクトリで:

```bash
# Windowsの場合
copy .env.example .env

# Mac/Linuxの場合
cp .env.example .env
```

### ステップ2: APIキーを設定

`.env`ファイルを開いて編集:

```env
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**例:**
```env
RESEND_API_KEY=re_abc123def456ghi789jkl012mno345pqr678
```

### ステップ3: 開発サーバーを再起動

環境変数を読み込むため、サーバーを再起動:

```bash
# Ctrl+C でサーバーを停止

# 再起動
npm run dev
```

### ステップ4: 動作確認

1. http://localhost:5173 にアクセス
2. コンタクトフォームに移動
3. テストメッセージを送信
4. ブラウザのコンソールでエラーがないか確認

---

## Vercel本番環境での設定

### ステップ1: Vercelダッシュボードにアクセス

1. https://vercel.com にログイン
2. デプロイしたプロジェクトを選択

### ステップ2: 環境変数の設定

1. 「Settings」タブをクリック
2. 左サイドバーの「Environment Variables」をクリック
3. 新しい環境変数を追加:

**入力項目:**
```
Name:  RESEND_API_KEY
Value: re_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
Environment: Production, Preview, Development (すべて選択推奨)
```

### ステップ3: 保存

1. 「Save」ボタンをクリック
2. 環境変数が追加されたことを確認

### ステップ4: 再デプロイ

環境変数を反映させるため、再デプロイが必要です:

**方法1: Vercelダッシュボードから**
1. 「Deployments」タブをクリック
2. 最新のデプロイメントの「...」メニューをクリック
3. 「Redeploy」を選択

**方法2: GitHubから（推奨）**
```bash
# 空コミットをプッシュ
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push
```

### ステップ5: デプロイ完了を確認

1. 「Deployments」タブでビルドが成功したことを確認
2. デプロイされたサイトにアクセス
3. コンタクトフォームをテスト

---

## メール受信先の設定

### デフォルトの送信元

Resendの無料プランでは、デフォルトの送信元アドレスを使用します:

```
onboarding@resend.dev
```

### 受信先メールアドレスの変更

`api/send-email.ts` の57行目を編集:

**変更前:**
```typescript
to: ['contact@petcollabo.com'], // デフォルト
```

**変更後（あなたのメールアドレスに変更）:**
```typescript
to: ['your-email@gmail.com'], // 実際のメールアドレス
```

**複数の受信先を設定する場合:**
```typescript
to: ['admin@example.com', 'sales@example.com'],
```

### 変更を反映

```bash
git add api/send-email.ts
git commit -m "Update email recipient"
git push
```

Vercelが自動的に再デプロイします。

### カスタムドメインから送信（オプション）

独自ドメインから送信したい場合:

1. Resendダッシュボードで「Domains」をクリック
2. 「Add Domain」でドメインを追加
3. DNS設定（SPF, DKIM）を追加
4. `api/send-email.ts`の56行目を変更:

```typescript
from: 'Contact Form <contact@yourdomain.com>',
```

---

## テスト方法

### ローカル環境でのテスト

1. 開発サーバーを起動: `npm run dev`
2. http://localhost:5173 にアクセス
3. コンタクトフォームまでスクロール
4. テスト情報を入力:

```
名前: テスト太郎
メールアドレス: test@example.com
会社名: テスト株式会社
メッセージ: これはテストメッセージです。
```

5. 「Send Message」をクリック
6. 成功メッセージが表示されることを確認

### 本番環境でのテスト

1. Vercelにデプロイされたサイトにアクセス
2. 同様にフォームをテスト
3. 設定したメールアドレスにメールが届くか確認

### Resendダッシュボードで確認

1. https://resend.com/emails にアクセス
2. 送信履歴が表示されます
3. 各メールの詳細を確認可能:
   - 送信時刻
   - 受信先
   - 件名
   - ステータス（送信成功/失敗）

---

## トラブルシューティング

### エラー: "RESEND_API_KEY is not set"

**原因:**
- 環境変数が設定されていない
- 開発サーバーが再起動されていない

**解決方法:**
1. `.env`ファイルが存在するか確認
2. APIキーが正しく記載されているか確認
3. 開発サーバーを再起動: `Ctrl+C` → `npm run dev`

### エラー: "Invalid API Key"

**原因:**
- APIキーが間違っている
- APIキーの形式が正しくない

**解決方法:**
1. Resendダッシュボードで新しいAPIキーを発行
2. `.env`ファイルを更新
3. APIキーが `re_` で始まっているか確認
4. 余分なスペースや改行がないか確認

### メールが届かない

**チェックリスト:**

1. **スパムフォルダを確認**
   - 迷惑メールフォルダをチェック
   - Gmailの場合は「プロモーション」タブも確認

2. **Resendダッシュボードで確認**
   - https://resend.com/emails
   - 送信履歴にメールが記録されているか
   - ステータスが「Delivered」になっているか

3. **受信先メールアドレスを確認**
   - `api/send-email.ts` の受信先が正しいか
   - タイポがないか

4. **Vercelのログを確認**
   - Vercelダッシュボード → Functions → Logs
   - エラーメッセージがないか確認

### フォーム送信時にエラーが表示される

**ブラウザのコンソールを確認:**

1. ブラウザで F12 キーを押す
2. 「Console」タブを開く
3. エラーメッセージを確認

**よくあるエラー:**

```
Failed to fetch
```
→ ネットワーク接続を確認

```
500 Internal Server Error
```
→ Vercelのログを確認

```
Access-Control-Allow-Origin
```
→ CORSエラー（`api/send-email.ts`で既に対応済み）

### Vercelでビルドエラー

**エラーメッセージ:**
```
Module not found: Can't resolve 'resend'
```

**解決方法:**
```bash
npm install resend
git add package.json package-lock.json
git commit -m "Add resend dependency"
git push
```

---

## セキュリティのベストプラクティス

### ✅ すべきこと

1. **APIキーを環境変数に保存**
   - `.env`ファイルを使用
   - Vercelの環境変数機能を使用

2. **`.gitignore`に`.env`を追加**
   - 既に設定済み
   - 念のため確認: `.gitignore`に`.env`が含まれているか

3. **定期的にAPIキーをローテーション**
   - 3-6ヶ月ごとに新しいキーを発行
   - 古いキーを削除

### ❌ してはいけないこと

1. **APIキーをコードに直接書く**
   ```typescript
   // ❌ 絶対にしないこと
   const apiKey = 're_abc123...';
   ```

2. **APIキーをGitHubにコミット**
   - `.env`ファイルはgitignore済み
   - 万が一コミットしてしまった場合は、すぐにキーを削除して再発行

3. **公開リポジトリに環境変数を含める**
   - パブリックリポジトリでは環境変数は絶対に含めない

---

## サポート・リソース

### 公式ドキュメント

- Resend公式ドキュメント: https://resend.com/docs
- Node.js SDK: https://resend.com/docs/send-with-nodejs
- APIリファレンス: https://resend.com/docs/api-reference

### コミュニティ

- Resend Discord: https://resend.com/discord
- GitHub Discussions: https://github.com/resendlabs/resend-node/discussions

### お問い合わせ

- Resendサポート: support@resend.com
- 緊急時: https://resend.com/status（サービスステータス）

---

## まとめ

### セットアップ手順チェックリスト

- [ ] Resendアカウント作成
- [ ] APIキー取得
- [ ] `.env`ファイル作成
- [ ] APIキーを`.env`に設定
- [ ] ローカルでテスト
- [ ] Vercelに環境変数設定
- [ ] 本番環境でテスト
- [ ] メール受信先を設定

### 重要ポイント

1. **APIキーは一度しか表示されない** → 必ずコピーして保存
2. **環境変数設定後は再起動/再デプロイが必要**
3. **無料プランは月3,000件まで** → 十分な容量
4. **セキュリティ第一** → APIキーは絶対にコードに含めない

---

最終更新: 2026年1月1日
作成者: Pet Collabo Team
