# chillarin-hub デプロイチェックリスト

このページは「Cloudflare Pages 連携 → 親ドメイン Hub 公開」までを漏れなく終わらせるための作業表。
順番通りに上から実行する。各ステップが完了したらチェックを入れる。

## 0. 事前準備 (15 分)

- [ ] OGP / favicon 画像 4 枚を `static/images/` + リポジトリ直下に配置
  - [ ] `static/images/hero-avatar.png` (512×512)
  - [ ] `static/images/og-image.png` (1200×630)
  - [ ] `static/images/apple-touch-icon.png` (180×180)
  - [ ] `favicon.ico` (リポジトリ直下、32×32)
- [ ] `python3 -m http.server 8000` で最終確認

## 1. GitHub repo 作成 (5 分)

- [ ] `gh repo create chillarin39/chillarin-hub --public --source=. --remote=origin --description "chillarin39.com apex Hub Page"`
- [ ] `git add -A && git commit -m "init: chillarin39.com apex Hub Page"`
- [ ] `git push -u origin main`

## 2. Cloudflare Pages 連携 (10 分)

- [ ] Cloudflare dashboard > Workers & Pages > Create application > Pages > Connect to Git
- [ ] repo: `chillarin39/chillarin-hub`、production branch: `main`
- [ ] Build settings:
  - Framework preset: **None**
  - Build command: (空欄)
  - Build output directory: `/`
- [ ] Save and Deploy
- [ ] 自動生成 URL (`<project>.pages.dev`) で動作確認

## 3. apex DNS と Custom domain (5 分)

- [ ] Pages プロジェクト > Custom domains > Set up a custom domain
- [ ] `chillarin39.com` を入力 (apex)
- [ ] Cloudflare DNS が自動で CNAME flattening を適用するのを確認
- [ ] `getent hosts chillarin39.com` で AAAA レコードが返ること
- [ ] `curl -sIL https://chillarin39.com/` で 200 OK

## 4. SEO 観測経路の登録 (10 分)

- [ ] Bing Webmaster Tools に `https://chillarin39.com/` を追加 (既存 chillablog とは別 site として)
- [ ] Google Search Console に `chillarin39.com` を Domain property として追加 (URL prefix で chillablog と分離管理してもよい)
- [ ] GSC で URL Inspection を `https://chillarin39.com/` に実行、coverageState を記録

## 5. systems.yaml 登録 (5 分)

`~/projects/system-dashboard/systems.yaml` の `deployed_services` 配下に以下を追加:

```yaml
  - id: chillarin-hub
    name: chillarin39.com Hub Page
    description: "chillarin39.com (apex) のポートフォリオハブ。ちらりんブログ・ポッドキャスト・SZTA・Members への導線と JSON-LD Person sameAs で著者統一情報を提供。SEO topical authority 強化目的。"
    category: web
    deployment: cloudflare-pages
    status: running
    web_ui: https://chillarin39.com/
    tech_stack: [HTML, CSS, Cloudflare Pages]
    tags: [public, seo, apex, hub]
    notes: "2026-05-XX 公開。S-4 親ドメインハブ化 (memory project_chillablog_seo_strategy 参照) の実装。デプロイは GitHub push → Cloudflare Pages 自動ビルド。観測指標: GSC URL Inspection で apex の coverageState、Bing Webmaster Tools の Recommendations、chillablog 側 referringUrls の推移を 4 週後に再評価。"
```

その後 systems.yaml を chillarin-ops に反映:

```bash
ssh chillarin-ops "cat > /opt/ops/ops/system-dashboard/systems.yaml" < ~/projects/system-dashboard/systems.yaml
curl -s -X POST http://172.16.1.151:8880/api/reload
```

## 6. SNS / プロフィール被リンク (5 分)

- [ ] X (Twitter) bio の URL を chillablog → chillarin39.com に差し替え (任意。chillablog 直リンクを保つ判断もあり)
- [ ] GitHub プロフィール README に chillarin39.com も明記

## 7. 観測 (公開後)

| タイミング | 確認項目 |
|---|---|
| 公開直後 | curl で HTTP 200、Content-Type が text/html、CSP / X-Frame-Options ヘッダーが返ること |
| 1 日後 | GSC URL Inspection で「クロール済み」に進んだか |
| 1 週間後 | Bing Webmaster Tools の Recommendations 数推移、apex のクリック数 |
| 4 週間後 | GSC で chillarin39.com property 全体のインプレッション / クリック増減、chillablog 側 referringUrls の変化 |

## 8. 失敗時のロールバック

- Cloudflare Pages > Deployments > Rollback to previous deployment
- Custom domain は Pages プロジェクトから外せば即座に apex の DNS から chillarin-hub が外れる
- GSC / Bing 側は site 削除すれば即座に観測停止 (登録解除によるペナルティはない)
