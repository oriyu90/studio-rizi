# 折田悠希の料理サイト 保守メモ

最終更新: 2026-10-12
公開先: https://studio-rizi.pages.dev/projects/orita-kitchen/
登録slug: `orita-kitchen`
初回リリースタグ: `orita-kitchen-v1.0.0`

## 一次情報

- `projects/orita-kitchen/content.json`と`README.md`、`LICENSE`。
- 生成器: `scripts/generate-orita-kitchen.mjs`。配信元: `website/projects/orita-kitchen/`。
- 日本語はルートと`recipes/cold-udon/`。他言語は`en/`、`zh/`、`pt/`の同じ構成。
- 次の記事を増やす場合はデータ構造と生成器、検索用JSON、ホームの記事一覧、Recipe JSON-LDを同時に更新。
- 全体サイトマップは`generate-seo-pages.mjs`が作成。言語を除いた記事パス単位でhreflangをグループ化する。記事とホームを同じグループにしない。

## 検証記録

- 375、768、1024、1440px × 4言語 × 2ページで横はみ出しなし。
- 日本語で材料チェック・リロード後の保存・リセット、味別フィルター、検索・候補なし・Escで閉じるをブラウザで確認。
- 34件のテスト、build / validate / count-files成功。252公開ファイル、完全重複0件。
- 写真は生成画像4枚。合計約1.1MBのWebP。調理・盛りつけのイメージであることを公開ページに明記。
- 元の「1–0.3」を昇順の「0.3–1」へ表示整理。加熱時間は商品表示も確認する補足と、わかめの戻り具合を確認する補足を追加。

## 公開方法

既存`studio-rizi`のmainのGit連携。個別Pages・個別robots・個別サイトマップを作らない。共通依存関係を複製しない。ユーザーによる次回のレシピ追加は内容JSONを変更してからルートの`npm test`を実行する。
