# Studio Rizi 統合サイト設計

## 現在と目標

2026-08-21時点では、Cloudflare Pagesがリポジトリ直下の `website/` を直接公開している。これは稼働中の旧構成であり、移行作業中も維持する。

目標は、Studio Rizi本体と各案件を一度のビルドで `dist/` へ生成する構成である。

```text
studio-rizi/
├── AGENTS.md
├── ARCHITECTURE.md
├── MIGRATION-INVENTORY.md
├── package.json
├── package-lock.json
├── src/
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   ├── styles/
│   └── assets/
├── projects/
│   ├── manifest.json
│   └── <slug>/
│       ├── project.json
│       ├── pages/
│       ├── components/
│       ├── styles.css
│       └── assets/
├── scripts/
│   ├── build.mjs
│   ├── validate.mjs
│   ├── sitemap.mjs
│   └── count-files.mjs
├── public/
│   ├── robots.txt
│   ├── _headers
│   └── _redirects
└── dist/
    ├── index.html
    ├── sitemap.xml
    ├── assets/
    │   ├── shared/
    │   └── projects/
    └── projects/
        └── <slug>/
```

## URL

- Studio Rizi本体: `https://studio-rizi.pages.dev/`
- 案件: `https://studio-rizi.pages.dev/projects/<slug>/`
- Kizi: `https://kizi.pages.dev/` のまま

slugは小文字英数字とハイフンのみを使用し、公開後は変更しない。

## 一次情報

- `projects/manifest.json`: 全案件のslug、名称、公開状態、順序、URL、SEO情報。
- `projects/<slug>/project.json`: 案件固有の説明、対応言語、リポジトリ、リリース情報。
- `src/`: 複数ページ・複数案件で共有する実装と素材。
- `projects/<slug>/`: 案件固有の実装と素材。
- `dist/`: 自動生成する公開物。一次情報ではない。

現在の `website/content.js` は、manifestへ一本化するまでは現行サイトの一次情報として扱う。移行後に両方を手動更新する運用を残さない。

## 重複を増やさないルール

- 依存関係とロックファイルはルートに一組だけ置く。
- 共通フォント、ロゴ、アイコン、CSS、JavaScriptは `src/` から一度だけ出力する。
- 案件の `assets/` には案件固有素材だけを置く。
- 同一ハッシュのファイルをビルド検証で検出する。
- 未参照ファイルを `dist/` へコピーしない。
- 画像の派生形式・サイズは実際に参照されるものだけ生成する。
- 既存サイト一式を `public/projects/` へ手作業でコピーしない。

## 移行工程

1. AI用文書と移行台帳を整備する。
2. `projects/manifest.json`、共通ビルド、検証スクリプトを導入する。
3. 現行 `website/` と同じ内容を `dist/` に生成し、差分とローカル表示を確認する。
4. Cloudflare PagesのBuild commandとBuild output directoryを `dist/` 用に切り替える。
5. 小規模な静的サイトから1件ずつ `/projects/<slug>/` へ追加する。
6. 案件ごとに表示、リンク、4言語、SEO、サイトマップを確認する。
7. 新URL確認後、旧Pages側をページ単位の301へ切り替える。
8. Search Consoleで移行を監視してから次の案件へ進む。

Cloudflare設定の切替と旧サイトの301化は外部状態を変更するため、新しいビルドの検証が終わるまでは実行しない。
