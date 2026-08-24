# Studio Rizi 統合サイト設計

## 現在と目標

Cloudflare Pagesはリポジトリ直下の `website/` を直接公開する。既存のGit連携設定を維持し、Studio Rizi本体と各案件の公開ファイルを同じ公開ルートで管理する。

```text
studio-rizi/
├── AGENTS.md
├── ARCHITECTURE.md
├── MIGRATION-INVENTORY.md
├── package.json
├── package-lock.json
├── projects/
│   └── manifest.json
├── scripts/
│   ├── validate-site.mjs
│   └── count-files.mjs
└── website/
    ├── index.html
    ├── 404.html
    ├── en/
    ├── zh/
    ├── pt/
    ├── robots.txt
    ├── sitemap.xml
    ├── assets/
    └── projects/
        └── <slug>/
```

## URL

- Studio Rizi本体: `https://studio-rizi.pages.dev/`
- 案件: `https://studio-rizi.pages.dev/projects/<slug>/`
- Kizi: `https://kizi.pages.dev/` のまま

Studio Rizi本体の言語URLは、日本語をルート、英語を`/en/`、簡体中文を`/zh/`、ポルトガル語を`/pt/`とする。各言語のNEWSとPROFILEも同じ接頭辞を使用する。同一URLをJavaScriptだけで別言語に差し替える方式は、検索エンジンが言語別ページとして保持できないため使用しない。

`scripts/generate-seo-pages.mjs` は日本語HTML、`content.js`、ローカライズ文言から言語別の静的HTMLとサイトマップを生成する。生成先の`website/en/`、`website/zh/`、`website/pt/`を直接編集せず、`npm run build`で同期する。

トップのPROJECTカードはJavaScript実行前から実リンクとしてHTMLへ出力し、通常クリックでは従来どおり詳細ダイアログ、修飾キーやJavaScript無効時は公式URLへ遷移する。これにより検索エンジンが全案件を初回HTMLから発見できる。

slugは小文字英数字とハイフンのみを使用し、公開後は変更しない。

## 一次情報

- `projects/manifest.json`: 全案件のslug、名称、公開状態、URL、リポジトリ。
- `website/content.js`: PROJECTカード、リリース情報、説明文の一次情報。
- `website/projects/<slug>/`: 案件固有の公開ページと素材。
- `website/robots.txt` と `website/sitemap.xml`: ホスト全体のクロール設定。

manifestと`content.js`のURLは `npm run validate` で一致を検証する。

## 案件内の静的Webアプリ

`website/projects/<slug>/`には紹介ページだけでなく、案件固有のversioned静的app bundleをサブdirectoryへ置ける。Tango pro Webは`website/projects/tango-pro/web/`を公開rootとし、生成元repositoryのstage scriptでのみ同期する。

- source map、build cache、`node_modules`は公開しない
- app bundleは`build-info.json`にsource commit、content build ID、base path、precache asset一覧を持つ
- Service Workerはcontent build IDごとにcacheを更新し、案件の永続data storageを削除しない
- COOP / COEP等の特殊headerは`website/_headers`でappのsubpathだけへ限定する
- `index.html`、`sw.js`、`build-info.json`は`no-cache`、content-hash付きWasmはimmutableとする
- bundle更新後も紹介ページ、Studio Rizi本体、他案件のURLとheaderを回帰確認する

## 重複を増やさないルール

- 依存関係とロックファイルはルートに一組だけ置く。
- 共通フォント、ロゴ、アイコン、CSS、JavaScriptは、実際に複数案件で同一内容になった時点で共通化する。
- 案件の `assets/` には案件固有素材だけを置く。
- 同一ハッシュのファイルをビルド検証で検出する。
- 未参照ファイルを `dist/` へコピーしない。
- 画像の派生形式・サイズは実際に参照されるものだけ生成する。
- `npm run count-files` で同一ハッシュの公開ファイルを検出し、重複があれば解消する。

## クロールとインデックス通知

- ルート、NEWS、PROFILEの4言語版は、自己canonicalと完全な相互`hreflang`、`x-default`を持つ。
- `website/sitemap.xml`にも同じ言語対応を記載し、正確な`lastmod`を出力する。
- ルートの`404.html`を維持し、存在しないパスをトップページのHTTP 200として返すソフト404を防ぐ。
- `main`更新時は`.github/workflows/indexnow.yml`が変更URLだけをIndexNowへ送信する。
- Googleへのサイトマップ登録・再クロール依頼はSearch Consoleで行う。サイトマップやIndexNowはインデックス登録や順位を保証するものではない。

## 移行工程

1. `projects/manifest.json` と検証スクリプトを更新する。
2. 案件の公開に必要なファイルだけを `website/projects/<slug>/` へ移す。
3. ルート相対URL、canonical、OGP、JSON-LDを新URLへ変更する。
4. `website/content.js` と `website/sitemap.xml` を更新する。
5. `npm test` でリンク、旧URL、重複、ファイル数を検証する。
6. `main` へpushして新URLを実地確認する。
7. 新URL確認後、旧Pages側をページ単位の301へ切り替える。
8. Search Consoleで旧・新URLを監視する。
