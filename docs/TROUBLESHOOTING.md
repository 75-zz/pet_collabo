# トラブルシューティングガイド

Pet Collaboのコンタクトフォームで発生する可能性のある問題と解決方法をまとめました。

---

## 目次

- [ローカル環境の問題](#ローカル環境の問題)
- [Vercel本番環境の問題](#vercel本番環境の問題)
- [メール送信の問題](#メール送信の問題)
- [パフォーマンスの問題](#パフォーマンスの問題)
- [ビルドエラー](#ビルドエラー)

---

## ローカル環境の問題

### エラー: "RESEND_API_KEY is not set"

**症状:**
```
Web3Formsのアクセスキーが設定されていません。SETUP_CONTACT_FORM.mdを参照してセットアップしてください。
```

**原因:**
- `.env`ファイルが存在しない
- `.env`ファイルにAPIキーが記載されていない
- 開発サーバーが環境変数を読み込んでいない

**解決方法:**

1. `.env`ファイルが存在するか確認:
```bash
# Windows
dir .env

# Mac/Linux
ls -la .env
```

2. `.env`ファイルがない場合は作成:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

3. `.env`ファイルを開いてAPIキーを設定:
```env
RESEND_API_KEY=re_あなたのAPIキー
```

4. 開発サーバーを再起動:
```bash
# Ctrl+C で停止
npm run dev
```

---

### エラー: "Module not found: Can't resolve 'resend'"

**症状:**
```
Error: Module not found: Can't resolve 'resend'
```

**原因:**
- resendパッケージがインストールされていない

**解決方法:**
```bash
npm install resend
```

---

### フォームが表示されない

**チェックリスト:**

1. ブラウザのコンソールでエラーを確認（F12キー）
2. 開発サーバーが起動しているか確認
3. ポート5173が既に使用されていないか確認

**解決方法:**
```bash
# サーバーを停止
Ctrl+C

# ポートを変更して起動
npm run dev -- --port 3000
```

---

## Vercel本番環境の問題

### デプロイエラー: "Build failed"

**症状:**
Vercelのデプロイが失敗する

**確認方法:**
1. Vercelダッシュボード → Deployments
2. 失敗したデプロイをクリック
3. ビルドログを確認

**よくある原因と解決方法:**

#### 原因1: 依存関係の問題

**ログの例:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解決方法:**
```bash
# package-lock.jsonを削除
rm package-lock.json

# node_modulesを削除
rm -rf node_modules

# クリーンインストール
npm install

# コミット＆プッシュ
git add package-lock.json
git commit -m "Fix dependencies"
git push
```

#### 原因2: TypeScriptエラー

**解決方法:**
```bash
# ローカルでビルドテスト
npm run build

# エラーを修正後
git add .
git commit -m "Fix TypeScript errors"
git push
```

---

### 環境変数が反映されない

**症状:**
- Vercelでデプロイは成功するが、メール送信時にエラー
- "RESEND_API_KEY is not set" エラー

**解決方法:**

1. **環境変数を確認:**
   - Vercelダッシュボード → Settings → Environment Variables
   - `RESEND_API_KEY` が設定されているか確認

2. **環境を確認:**
   - Production、Preview、Developmentすべてにチェックが入っているか確認

3. **再デプロイ:**
   ```bash
   # 方法1: Vercelダッシュボードから「Redeploy」

   # 方法2: 空コミットでトリガー
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

4. **APIキーの形式を確認:**
   - `re_` で始まっているか
   - 余分なスペースや改行がないか

---

### Function timeout エラー

**症状:**
```
Task timed out after 10.00 seconds
```

**原因:**
- Resend APIのレスポンスが遅い
- ネットワークの問題

**解決方法:**

通常は一時的な問題です。数分後に再試行してください。

繰り返し発生する場合:
1. Resendのステータスページを確認: https://resend.com/status
2. Vercelのログを確認: Functions → Logs

---

## メール送信の問題

### メールが届かない

**チェックリスト:**

#### 1. スパムフォルダを確認

- Gmail: 「迷惑メール」「プロモーション」タブ
- Outlook: 「迷惑メール」フォルダ
- Yahoo: 「迷惑メール」フォルダ

#### 2. Resendダッシュボードで確認

1. https://resend.com/emails にアクセス
2. 送信履歴を確認
3. ステータスを確認:
   - ✅ **Delivered**: 正常に送信完了
   - ⏳ **Queued**: 送信待ち
   - ❌ **Failed**: 送信失敗

#### 3. 受信先メールアドレスを確認

`api/send-email.ts` の57行目:
```typescript
to: ['your-email@example.com'], // 正しいメールアドレスか確認
```

#### 4. 送信元アドレスを確認

無料プランでは `onboarding@resend.dev` から送信されます。
このアドレスをスパムフィルターで除外してください。

---

### エラー: "Invalid API Key"

**症状:**
```json
{
  "error": "Invalid API Key",
  "success": false
}
```

**原因:**
- APIキーが間違っている
- APIキーが削除された
- APIキーの権限が不足

**解決方法:**

1. **新しいAPIキーを発行:**
   - https://resend.com/api-keys
   - 古いキーを削除
   - 新しいキーを作成

2. **環境変数を更新:**
   - ローカル: `.env`ファイル
   - Vercel: Environment Variables

3. **再起動/再デプロイ:**
   - ローカル: サーバー再起動
   - Vercel: Redeploy

---

### メールの内容が文字化けする

**原因:**
- 文字エンコーディングの問題

**解決方法:**

`api/send-email.ts`のHTMLメールに文字セットが指定されています:
```html
<meta charset="utf-8">
```

それでも文字化けする場合:
1. メールクライアントの設定を確認
2. UTF-8エンコーディングを強制

---

## パフォーマンスの問題

### 3D流体エフェクトが重い

**症状:**
- ページの読み込みが遅い
- スクロールがカクつく
- ファーストビューの表示が遅い

**解決方法（既に実装済み）:**

自動的にデバイスに応じて品質が調整されます:

- **デスクトップ（高）**: 12 Metaballs, 48 ray steps, 0.8x解像度
- **デスクトップ（中）**: 6 Metaballs, 32 ray steps, 0.75x解像度
- **モバイル**: 5 Metaballs, 32 ray steps, 0.5x解像度

**手動で調整する場合:**

`src/app/components/three/utils/deviceDetection.ts`を編集:
```typescript
case 'medium':
  return {
    metaballCount: 4,  // さらに減らす
    raySteps: 24,      // さらに減らす
    renderScale: 0.6,  // 解像度を下げる
  };
```

---

### ページ全体の読み込みが遅い

**最適化チェックリスト:**

1. **画像の最適化:**
   - WebP形式を使用
   - 適切なサイズにリサイズ
   - 遅延読み込み（lazy loading）

2. **フォントの最適化:**
   - 使用する文字セットのみ読み込み
   - `font-display: swap`を使用

3. **JavaScriptの最適化:**
   - コード分割
   - Tree shaking（Viteが自動対応）

---

## ビルドエラー

### TypeScriptエラー

**症状:**
```
Type 'X' is not assignable to type 'Y'
```

**解決方法:**

1. **型エラーを確認:**
```bash
npm run build
```

2. **型定義を修正**

3. **型チェックをスキップ（非推奨）:**
```typescript
// @ts-ignore
```

---

### Import エラー

**症状:**
```
Cannot find module '@/...'
```

**原因:**
- パスエイリアスの設定問題

**解決方法:**

`vite.config.ts`を確認:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

---

## その他の問題

### GitHubにプッシュできない

**エラー:**
```
fatal: remote origin already exists
```

**解決方法:**
```bash
git remote remove origin
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

---

### Vercelと連携できない

**チェックリスト:**

1. GitHubリポジトリが存在するか
2. Vercelアカウントがリンクされているか
3. リポジトリのアクセス権限があるか

**解決方法:**
1. Vercel → Settings → Git Integration
2. GitHubを再連携

---

## サポート

### さらにヘルプが必要な場合

1. **ドキュメントを確認:**
   - `docs/RESEND_API_SETUP.md`
   - `DEPLOY_TO_VERCEL.md`

2. **公式ドキュメント:**
   - Resend: https://resend.com/docs
   - Vercel: https://vercel.com/docs
   - Vite: https://vitejs.dev/guide/

3. **コミュニティ:**
   - Resend Discord: https://resend.com/discord
   - Vercel Discord: https://vercel.com/discord

4. **ログを確認:**
   - ブラウザコンソール（F12）
   - Vercel Functions Logs
   - Resend Email Logs

---

最終更新: 2026年1月1日
