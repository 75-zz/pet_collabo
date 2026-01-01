# Pet Collabo

AI技術を活用した多分野開発事業のコーポレートサイト

## 🚀 特徴

- **Three.js 3D流体エフェクト** - GPU最適化されたレイマーチング・メタボール
- **GSAP アニメーション** - スムーズなスクロールアニメーションとパララックス
- **レスポンシブデザイン** - モバイル、タブレット、デスクトップ対応
- **実用的なコンタクトフォーム** - Resend API使用、月3,000件まで無料

## 🛠 技術スタック

- **フレームワーク**: React 18.3 + TypeScript
- **ビルドツール**: Vite 6.3
- **スタイリング**: Tailwind CSS 4.1
- **3Dグラフィックス**: Three.js
- **アニメーション**: GSAP + ScrollTrigger
- **UI コンポーネント**: Radix UI
- **フォント**: Cormorant Garamond, Inter
- **デプロイ**: Vercel
- **メール送信**: Resend API

## 📦 インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run preview
```

## 🌐 Vercelへのデプロイ

詳細な手順は [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) を参照してください。

### クイックスタート

1. [Resend](https://resend.com) でAPIキーを取得
2. GitHubにリポジトリをプッシュ
3. [Vercel](https://vercel.com) でリポジトリをインポート
4. 環境変数 `RESEND_API_KEY` を設定
5. デプロイ

## 🔧 環境変数

`.env.example` をコピーして `.env` を作成:

```bash
cp .env.example .env
```

必要な環境変数:

- `RESEND_API_KEY` - Resend API キー（メール送信用）

## 📝 プロジェクト構成

```
pet_collabo_clean/
├── api/
│   └── send-email.ts          # Vercel Serverless Function
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── HeroSection.tsx
│   │       ├── PhilosophySection.tsx
│   │       ├── WorksSection.tsx
│   │       ├── MembersSection.tsx
│   │       ├── CultureSection.tsx
│   │       ├── ContactSection.tsx
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── three/
│   │       │   ├── FluidBackground.tsx
│   │       │   ├── FluidSimulation.ts
│   │       │   ├── shaders/
│   │       │   └── utils/
│   │       └── ui/
│   ├── styles/
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── vercel.json
```

## 🎨 カスタマイズ

### フォントの変更

`src/styles/theme.css` で変更:

```css
:root {
  --font-serif: 'Your Font', serif;
  --font-sans: 'Your Font', sans-serif;
}
```

### カラーテーマ

`src/styles/theme.css` で色を調整:

```css
:root {
  --accent: #d4af37; /* ゴールド */
  --primary: #0a0a0a; /* ブラック */
}
```

### 3D流体エフェクトの調整

パフォーマンス設定: `src/app/components/three/utils/deviceDetection.ts`

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストを歓迎します！

## 📧 お問い合わせ

- Email: contact@petcollabo.com
- Website: [Pet Collabo](https://petcollabo.com)

---

Made with ❤️ by Pet Collabo Team
