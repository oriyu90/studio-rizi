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

slugは小文字英数字とハイフンのみを使用し、公開後は変更しない。

## 一次情報

- `projects/manifest.json`: 全案件のslug、名称、公開状態、URL、リポジトリ。
- `website/content.js`: PROJECTカード、リリース情報、説明文の一次情報。
- `website/projects/<slug>/`: 案件固有の公開ページと素材。
- `website/robots.txt` と `website/sitemap.xml`: ホスト全体のクロール設定。

manifestと`content.js`のURLは `npm run validate` で一致を検証する。

## 重複を増やさないルール

- 依存関係とロックファイルはルートに一組だけ置く。
- 共通フォント、ロゴ、アイコン、CSS、JavaScriptは、実際に複数案件で同一内容になった時点で共通化する。
- 案件の `assets/` には案件固有素材だけを置く。
- 同一ハッシュのファイルをビルド検証で検出する。
- 未参照ファイルを `dist/` へコピーしない。
- 画像の派生形式・サイズは実際に参照されるものだけ生成する。
- `npm run count-files` で同一ハッシュの公開ファイルを検出し、重複があれば解消する。

## 移行工程

1. `projects/manifest.json` と検証スクリプトを更新する。
2. 案件の公開に必要なファイルだけを `website/projects/<slug>/` へ移す。
3. ルート相対URL、canonical、OGP、JSON-LDを新URLへ変更する。
4. `website/content.js` と `website/sitemap.xml` を更新する。
5. `npm test` でリンク、旧URL、重複、ファイル数を検証する。
6. `main` へpushして新URLを実地確認する。
7. 新URL確認後、旧Pages側をページ単位の301へ切り替える。
8. Search Consoleで旧・新URLを監視する。
