# chillarin-hub

`chillarin39.com` (apex / root) の Hub Page。Cloudflare Pages 配信。

## 目的

ちらりんブログ含む 4 つのサブドメインを束ねる「親ドメインのハブ」を作り、
SEO 上のドメイン認知と topical authority の積み上げ起点にする。

- 課題: `chillarin39.com` は apex DNS レコード自体が NXDOMAIN だった (2026-05-20 検出)
- 影響: Google から見ると親が空のためサブドメインの被リンクが集約されない
- 戦略: 動かしているサブドメインへの導線 + Person schema (sameAs) で著者統一情報を提供

詳細は memory `project_chillablog_seo_strategy.md` の S-4 / S-9 参照。

## 構成

```
chillarin-hub/
├── index.html          # シングルページ Hub
├── static/
│   ├── ui-kit/         # chillarin-ui-kit vendor
│   ├── app.css         # Hub 専用スタイル
│   └── images/         # OGP / favicon / hero
├── _headers            # Cloudflare Pages: cache / CSP
├── _redirects          # /blog /podcast /members /x の短縮リダイレクト
└── README.md
```

## ローカル確認

```bash
cd ~/projects/chillarin-hub
python3 -m http.server 8000
# http://localhost:8000/ で確認
```

`/static/` で始まる絶対パスを使っているので、サブパス配信時には注意 (Cloudflare Pages は ルート配信)。

## Cloudflare Pages デプロイ手順 (ユーザー手動)

1. **GitHub repo を作成**: `chillarin39/chillarin-hub` (public)
2. **Cloudflare Pages 連携**:
   - Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git
   - repo: `chillarin39/chillarin-hub`、branch: `main`
   - Build settings: **No build command** (静的 HTML のため)、Output directory: `/`
3. **Custom domain 設定**:
   - Pages プロジェクト > Custom domains > Add: `chillarin39.com`
   - Cloudflare DNS が自動で apex CNAME (flattening 適用) を追加
4. **DNS 確認**: `dig chillarin39.com` で A レコードが返ること
5. **Bing Webmaster Tools** に `chillarin39.com` を **追加**:
   - 既存 chillablog の Domain property と別に apex 用 site を登録
   - sitemap 提出 (sitemap.xml は将来必要なら追加)
6. **Google Search Console** にも同様に追加 (Domain property に統一)

## OGP / favicon 画像の用意

以下の 3 ファイルを `static/images/` に置く:

| ファイル | 用途 | 推奨サイズ |
|---|---|---|
| `hero-avatar.png` | JSON-LD Person.image | 512×512 PNG |
| `og-image.png` | OGP / Twitter Card | 1200×630 PNG |
| `apple-touch-icon.png` | iOS ホーム画面アイコン | 180×180 PNG |

加えてリポジトリ直下に `favicon.ico` (32×32 or 48×48 ICO) を置く。

未配置のままでも HTML は壊れないが、SNS シェア時の見栄えと検索結果のサムネが弱くなる。
ちらりんブログのカバー画像生成 ([feedback_image_gen_nanobanana](.../memory/feedback_image_gen_nanobanana.md))
の知見を活かして GPTImage2 で作成すると統一感が出る。

## SEO 観測

デプロイ後 2 週間〜1 ヶ月で以下を観測:

- GSC URL Inspection: `https://chillarin39.com/` の coverageState が「URL が Google に認識されていません」→ 「クロール済み」→ 「インデックス登録済み」に進むか
- GSC referringUrls: apex の被リンク認識数
- Bing Webmaster Tools の Recommendations 変化
- chillablog サブドメインのクロール頻度に変化があるか

詳細な観測スクリプトは `chillablog-seo-audit` skill 参照。
