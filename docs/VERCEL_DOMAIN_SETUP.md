# Vercel カスタムドメイン設定ガイド

このガイドでは、Vercelにデプロイした Pet Collabo サイトに独自ドメインを設定する方法を説明します。

## 目次

1. [前提条件](#前提条件)
2. [ドメインの購入](#ドメインの購入)
3. [Vercelでのドメイン設定（2つの方法）](#vercelでのドメイン設定2つの方法)
   - [方法A: Vercel DNS（推奨・簡単）](#方法a-vercel-dns推奨簡単)
   - [方法B: 外部DNS（既存ドメイン向け）](#方法b-外部dns既存ドメイン向け)
4. [SSL証明書について](#ssl証明書について)
5. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

- Vercelアカウント（無料プラン可）
- Pet Collabo プロジェクトがVercelにデプロイ済み
- （オプション）購入したいドメイン名を決めている

**重要**: Vercelの無料プラン（Hobby）でも以下が含まれます：
- ✅ 無制限のカスタムドメイン
- ✅ 自動SSL証明書（Let's Encrypt）
- ✅ 自動HTTPS リダイレクト
- ✅ グローバルCDN

---

## ドメインの購入

### おすすめのドメインレジストラ

#### 1. **Cloudflare Registrar** ⭐ 最安値・推奨
- **価格**: 年間 $9〜$15（約1,300〜2,200円）
- **特徴**:
  - 最も安い（原価販売、手数料なし）
  - 無料のDNS、DDoS保護、SSL
  - 日本語未対応だが管理画面シンプル
- **URL**: https://www.cloudflare.com/products/registrar/

#### 2. **Google Domains → Squarespace Domains**
- **価格**: 年間 $12〜$20（約1,800〜3,000円）
- **特徴**:
  - 日本語対応
  - シンプルな管理画面
  - 無料のプライバシー保護
- **URL**: https://domains.squarespace.com/

#### 3. **お名前.com** 🇯🇵 日本最大手
- **価格**: 年間 1円〜3,000円（初年度キャンペーン多数）
- **特徴**:
  - 完全日本語対応
  - .jp ドメインも購入可能
  - サポート充実（メール・電話）
- **URL**: https://www.onamae.com/

#### 4. **ムームードメイン** 🇯🇵 初心者向け
- **価格**: 年間 99円〜3,000円
- **特徴**:
  - 日本語で分かりやすい
  - ロリポップ・ヘテムルと連携
  - チャットサポートあり
- **URL**: https://muumuu-domain.com/

### ドメイン購入時の注意点

1. **Whois情報公開代行**: 必ず有効にする（個人情報保護）
2. **自動更新**: オンにしておく（ドメイン失効防止）
3. **初年度割引**: 2年目以降の価格も確認する
4. **不要なオプション**: レンタルサーバー等は不要（Vercel使用）

---

## Vercelでのドメイン設定（2つの方法）

### 方法A: Vercel DNS（推奨・簡単）

この方法は、ドメインのDNS管理をVercelに完全に移譲する方法です。**初心者に最もおすすめ**。

#### ステップ1: Vercelでドメインを追加

1. Vercelダッシュボードにログイン: https://vercel.com/dashboard
2. Pet Collabo プロジェクトを選択
3. 「Settings」→「Domains」タブをクリック
4. 入力欄に購入したドメイン（例: `petcollabo.com`）を入力
5. 「Add」ボタンをクリック

#### ステップ2: ネームサーバーを確認

Vercelが以下のようなネームサーバーを表示します：

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

この情報をメモしてください。

#### ステップ3: ドメインレジストラでネームサーバーを変更

**Cloudflareの場合:**
1. Cloudflareダッシュボード → ドメインを選択
2. 「DNS」→「Records」
3. ネームサーバーを以下に変更：
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

**お名前.comの場合:**
1. お名前.com Naviにログイン
2. 「ドメイン設定」→「ネームサーバーの変更」
3. 「他のネームサーバーを利用」を選択
4. ネームサーバー1: `ns1.vercel-dns.com`
5. ネームサーバー2: `ns2.vercel-dns.com`
6. 「確認画面へ進む」→「設定する」

**ムームードメインの場合:**
1. ムームードメイン コントロールパネルにログイン
2. 「ドメイン管理」→「ドメイン操作」→「ネームサーバ設定変更」
3. 「GMOペパボ以外のネームサーバを使用する」を選択
4. ネームサーバー1: `ns1.vercel-dns.com`
5. ネームサーバー2: `ns2.vercel-dns.com`
6. 「ネームサーバ設定変更」ボタンをクリック

#### ステップ4: 反映を待つ（最大48時間）

- 通常は数分〜数時間で反映
- 最大48時間かかる場合もあり
- Vercelダッシュボードで「Valid Configuration」と表示されたら完了

#### ステップ5: wwwサブドメインも追加（推奨）

1. Vercelの「Settings」→「Domains」で「Add」をクリック
2. `www.petcollabo.com` を入力
3. 「Redirect to petcollabo.com」を選択（推奨）
4. 「Add」ボタンをクリック

これで `www.petcollabo.com` にアクセスしても自動的に `petcollabo.com` にリダイレクトされます。

---

### 方法B: 外部DNS（既存ドメイン向け）

既にドメインを使用していて、DNS管理を現在のレジストラに残したい場合はこの方法を使用します。

#### ステップ1: Vercelでドメインを追加

1. Vercelダッシュボード → プロジェクト選択
2. 「Settings」→「Domains」
3. ドメイン名（例: `petcollabo.com`）を入力して「Add」

#### ステップ2: DNSレコードを確認

Vercelが以下のようなDNSレコードを表示します：

**Aレコード（IPv4）:**
```
76.76.21.21
```

**AAAAレコード（IPv6）:**
```
2606:4700:10::6816:1515
2606:4700:10::6816:1615
```

**CNAMEレコード（wwwサブドメイン用）:**
```
cname.vercel-dns.com
```

#### ステップ3: ドメインレジストラでDNSレコードを設定

**Cloudflareの場合:**

1. Cloudflareダッシュボード → ドメイン選択 → 「DNS」→「Records」
2. 以下のレコードを追加：

| Type  | Name | Content                | TTL  | Proxy |
|-------|------|------------------------|------|-------|
| A     | @    | 76.76.21.21            | Auto | ❌    |
| CNAME | www  | cname.vercel-dns.com   | Auto | ❌    |

3. 「Save」をクリック

**お名前.comの場合:**

1. お名前.com Navi → 「DNS設定/転送設定」
2. 対象ドメインを選択 → 「次へ」
3. 「DNSレコード設定を利用する」→「設定する」
4. 以下のレコードを追加：

| ホスト名 | TYPE  | VALUE                | TTL  |
|---------|-------|----------------------|------|
| （空欄） | A     | 76.76.21.21          | 3600 |
| www     | CNAME | cname.vercel-dns.com | 3600 |

5. 「追加」→「確認画面へ進む」→「設定する」

**ムームードメインの場合:**

1. コントロールパネル → 「ムームーDNS」
2. 対象ドメインの「変更」をクリック
3. 「カスタム設定」を選択
4. 以下のレコードを追加：

| サブドメイン | 種別   | 内容                  | 優先度 |
|-------------|-------|-----------------------|-------|
| （空欄）     | A     | 76.76.21.21           | -     |
| www         | CNAME | cname.vercel-dns.com  | -     |

5. 「セットアップ情報変更」をクリック

#### ステップ4: 反映を確認

- 数分〜数時間で反映（最大48時間）
- 以下のコマンドで確認可能：

```bash
# Windowsの場合（コマンドプロンプト）
nslookup petcollabo.com

# Mac/Linuxの場合（ターミナル）
dig petcollabo.com
```

- Vercelダッシュボードで「Valid Configuration」と表示されたら完了

---

## SSL証明書について

### 自動発行（無料）

Vercelは**Let's Encrypt**を使用してSSL証明書を自動発行します：

- ✅ ドメイン設定完了後、自動的に発行（通常1〜5分）
- ✅ 90日ごとに自動更新
- ✅ 追加設定不要
- ✅ HTTPは自動的にHTTPSにリダイレクト

### SSL証明書の確認方法

1. Vercelダッシュボード → プロジェクト → 「Settings」→「Domains」
2. ドメイン名の横に緑色のチェックマーク「🔒 Valid Configuration」が表示されていればOK
3. ブラウザで `https://petcollabo.com` にアクセス
4. アドレスバーに鍵マークが表示されていれば成功

### SSL証明書が発行されない場合

1. DNSレコードが正しく設定されているか確認
2. DNS反映を待つ（最大48時間）
3. Vercelダッシュボードで「Refresh」ボタンをクリック
4. それでも解決しない場合は[トラブルシューティング](#トラブルシューティング)を参照

---

## トラブルシューティング

### 1. 「Domain is not configured correctly」エラー

**原因**: DNSレコードが正しく設定されていない

**解決方法**:
1. DNSレコードを再確認（Aレコード: `76.76.21.21`）
2. レジストラのダッシュボードで保存したか確認
3. 以下のコマンドでDNS反映を確認：
   ```bash
   nslookup petcollabo.com
   ```
4. 最大48時間待つ

### 2. 「SSL Certificate Pending」が消えない

**原因**: DNS反映待ち、またはDNS設定ミス

**解決方法**:
1. DNS反映を待つ（通常1〜24時間）
2. CloudflareのProxyが有効になっている場合は無効にする（オレンジ雲→グレー雲）
3. Vercelダッシュボードで「Refresh」ボタンをクリック
4. CAA レコードがある場合は削除または `letsencrypt.org` を許可

### 3. ドメインにアクセスできない（404エラー）

**原因**: DNSレコードが反映されていない、または間違っている

**解決方法**:
1. DNS反映を待つ（最大48時間）
2. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
3. 別のブラウザやシークレットモードで確認
4. 以下のコマンドでIPアドレスを確認：
   ```bash
   ping petcollabo.com
   ```
   `76.76.21.21` が返ってくればOK

### 4. wwwサブドメインが動作しない

**原因**: CNAMEレコードが設定されていない

**解決方法**:
1. ドメインレジストラでCNAMEレコードを追加：
   - ホスト名: `www`
   - 値: `cname.vercel-dns.com`
2. Vercelダッシュボードで `www.petcollabo.com` も追加
3. リダイレクト設定を確認

### 5. 「Too Many Requests」エラー

**原因**: Let's Encrypt のレート制限（1週間に5回まで）

**解決方法**:
1. 1週間待つ
2. DNS設定を一度で正しく設定する
3. テスト環境では別のドメインを使用する

### 6. メール送信時に「Domain not verified」エラー

**原因**: Resend APIでドメイン認証が必要

**解決方法**:
1. Resend ダッシュボード → 「Domains」
2. 「Add Domain」でメール送信用ドメインを追加
3. 表示されるDNSレコード（SPF, DKIM, DMARC）をドメインレジストラに追加
4. 詳細は `docs/RESEND_API_SETUP.md` を参照

---

## DNS反映確認ツール

### オンラインツール

- **WhatsMyDNS**: https://www.whatsmydns.net/
  - 世界中のDNSサーバーから反映状況を確認
  - ドメイン名と「A」レコードを選択して検索

- **DNS Checker**: https://dnschecker.org/
  - DNSレコードの反映状況を一覧表示

### コマンドラインツール

**Windows（コマンドプロンプト）:**
```bash
nslookup petcollabo.com
# 76.76.21.21 が返ってくればOK
```

**Mac/Linux（ターミナル）:**
```bash
dig petcollabo.com
# ANSWER SECTION に 76.76.21.21 があればOK
```

---

## 完了チェックリスト

設定が完了したら、以下を確認してください：

- [ ] ドメインを購入済み
- [ ] Vercelダッシュボードでドメインを追加済み
- [ ] DNSレコード（AまたはNS）を設定済み
- [ ] DNS反映を確認（nslookup/dig コマンド）
- [ ] Vercelで「Valid Configuration」と表示
- [ ] HTTPSアクセスで緑の鍵マークが表示
- [ ] wwwサブドメインも動作確認
- [ ] メールフォームが動作（オプション）

---

## 料金まとめ

| 項目 | Vercel無料プラン | 有料プラン必要？ |
|------|-----------------|-----------------|
| カスタムドメイン | ✅ 無制限 | ❌ 不要 |
| SSL証明書 | ✅ 自動・無料 | ❌ 不要 |
| DNS管理 | ✅ 無料 | ❌ 不要 |
| wwwリダイレクト | ✅ 無料 | ❌ 不要 |
| 帯域幅 | ✅ 100GB/月 | 超える場合のみ |

**結論**: Pet Collabo サイトなら**完全無料**でカスタムドメインを使用できます。

---

## 参考リンク

- Vercel公式ドキュメント（ドメイン設定）: https://vercel.com/docs/concepts/projects/domains
- Vercel公式ドキュメント（DNS設定）: https://vercel.com/docs/concepts/projects/domains/working-with-nameservers
- Let's Encrypt公式サイト: https://letsencrypt.org/ja/
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/
- お名前.com: https://www.onamae.com/
- ムームードメイン: https://muumuu-domain.com/

---

## サポート

問題が解決しない場合：

1. **Vercel コミュニティ**: https://github.com/vercel/vercel/discussions
2. **Vercel サポート**: https://vercel.com/support（有料プランのみ優先対応）
3. **Twitter/X**: @vercel でメンション
4. **このプロジェクトのIssue**: Pet Collabo GitHubリポジトリのIssuesセクション

---

最終更新: 2026-01-01
