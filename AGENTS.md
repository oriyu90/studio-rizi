# Studio Rizi repository guide

このリポジトリは、Studio Rizi公式サイトと、Kiziを除く全プロジェクトの紹介サイトを一元管理する。

## 最初に読むもの

1. `ARCHITECTURE.md`
2. `MIGRATION-INVENTORY.md`
3. `PROJECT-CARD-RULES.md`
4. `oriyu90/common-rules-document` の `common rules.md`
5. 同リポジトリの `STUDIO-RIZI-PROJECT-HOSTING.md`

## 重要ルール

- `https://kizi.pages.dev/` は独立運用を維持し、移管しない。
- その他の紹介サイトの正規URLは `https://studio-rizi.pages.dev/projects/<slug>/` とする。
- 共通部品・フォント・画像・依存関係を案件ごとにコピーしない。
- `projects/manifest.json` を案件URLと配置の一次情報とする。
- Cloudflare Pagesが公開する `website/` だけに公開ファイルを置く。
- 各案件の公開ファイルは `website/projects/<slug>/` に置く。
- 案件固有の `robots.txt` とサイトマップを複製せず、`website/robots.txt` と `website/sitemap.xml` へ集約する。
- 旧サイトは新URLの公開確認後に301リダイレクトへ切り替える。
- 一度に全案件を移さず、`MIGRATION-INVENTORY.md` の順序で段階移行する。

## 作業完了前

- 既存サイトの表示を壊していないことを確認する。
- ルート相対URLが `/projects/<slug>/` 配下で正しく解決されることを確認する。
- canonical、OGP、JSON-LD、サイトマップを新しい正規URLへ揃える。
- 公開ファイル数と内容が同一の重複ファイルを検査する。
- 旧URLを消す前にページ単位の301対応表を用意する。
- `npm test` を実行する。
