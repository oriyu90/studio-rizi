# 折田悠希の料理サイト — UI・プロジェクト保守方針

最終更新: 2026-10-12
プロジェクト名: 折田悠希の料理サイト / Yuki Orita’s Kitchen
slug: `orita-kitchen`
編集元: https://github.com/oriyu90/orita-kitchen （プライベート）
公開URL: https://studio-rizi.pages.dev/projects/orita-kitchen/
公開ファイル管理: https://github.com/oriyu90/studio-rizi
専用スキル: [skills/orita-kitchen-site/SKILL.md](https://github.com/oriyu90/common-rules-document/blob/main/skills/orita-kitchen-site/SKILL.md)
Author: Yuki_Orita

## 1. ユーザーが確定したUI方針

「ただ記事見せるだけ」。記事を読むことを主目的とする。トップは料理記事の一覧、記事ページは写真と本文を順に読み進める構成。

「冷やうどんの部屋」は一つの記事。具材、作り方、具材の用意方法、5種類のたれ、ひと工夫を同じ記事に載せる。たれの見出しは残すが、独立記事・別カテゴリ・トップのたれ一覧へ分割しない。

検索、材料チェック、味別フィルター、印刷ボタン、目次サイドバー、販促用ヒーロー、口コミ、会員登録などを、通常の記事追加やUI修正のついでに再追加しない。これらは過去の初回案からユーザーの意図に合わせて外した機能である。後のユーザーの明示依頼はこの既定方針より優先する。

## 2. 見た目と読みやすさ

- 和の料理誌のような落ち着いた雰囲気。写真を多めに、見出しと本文を太字で読みやすくする。
- 生成り `#f7f6f0`、墨色 `#232c27`、深緑 `#193a2e`、補助文字 `#59635a`、控えめな金茶 `#866739`。
- 見出しはシステム明朝系、本文はシステムゴシック系。通常本文16px程度、行間1.9〜2.0。補助ラベルを本文より強調しない。
- 本文の最大幅は約880px。余白と細い罫線で整理し、装飾や操作パネルを増やさない。
- たれは同じ記事内の縦並び見出し。材料名と容積比を並べて読み取れる形にする。配合の意味を勝手に変更しない。
- スマホは一列、写真と本文を自然な順序で表示。長い翻訳見出しも折り返す。横スクロールを生じさせない。
- 通常のリンク、言語切替、サイト名から記事一覧への戻りを使う。記事を読むだけの経路にダイアログや設定操作を挟まない。
- キーボードフォーカスと動きを減らす設定に対応。JavaScriptなしで主要本文とリンクを使えること。

参考の役割:
- https://watahan-oncri.com/facility/ ：和の雰囲気、余白、写真の見せ方。
- https://www.thermos.jp/recipe/mizuki/ ：材料と手順の整理。

参考サイトの文章・写真・ブランド資産は転載しない。

## 3. 記事と画像

ユーザーの文章、材料、手順、配合を一次情報にする。誤記の整理や補足は元の意味を維持する。現記事では柚子胡椒・ラー油の幅を「0.3〜1」と昇順表示し、商品表示の加熱時間とわかめの戻り具合を確認する補足を加えている。

写真が不足し、料理の理解に役立つ場合は画像生成を使う。和の器・自然光・家庭料理らしい写真を基本にし、完成料理、具材、工程など内容に対応させる。装飾目的で増やさず、既存の適切な写真は再利用する。

現在は完成うどん・具材・冷水で締める工程・たれの4枚。生成画像である旨を記事に明記する。生成結果とプロンプトを記録し、採用画像は専用ソースへ保存する。公開用はWebP等へ最適化し、寸法を確保、先頭以外は必要に応じて遅延読み込み。

## 4. 編集元と公開元の責務

- プライベート `oriyu90/orita-kitchen` が編集ソースの一次情報。
- `content.json`: 4言語の本文。
- `scripts/build.mjs`: 静的HTML生成。
- `src/style.css` と `src/assets/`: 表示と専用画像。
- `dist/`: 生成物。直接編集しない。Git管理しない。
- `README.md` / `LICENSE` / `AGENTS.md` / `orita-kitchen.md`: プロジェクト説明と保守方針。
- `oriyu90/studio-rizi/website/projects/orita-kitchen/`: 公開用ファイルの一次情報。専用ソースから同期する。
- `studio-rizi/projects/orita-kitchen/source.json`: 同期した編集元commit。

Studio Riziに編集用本文JSONと生成器を重複させない。専用リポジトリには外部依存がなく、中央の依存関係・共通フォントをコピーしない。

## 5. 更新と公開

1. 専用ソースで変更し、`npm test`。必要なページをPCとスマホ幅で確認。
2. ソースの変更をcommitする。
3. `npm run sync:studio -- /absolute/path/to/studio-rizi` でこの案件の生成物のみ同期する。
4. Studio Rizi側で `npm test`。本文・配合・相互hreflang・canonical・サイトマップ・画像参照・他案件への影響を確認。
5. 必要な変更をcommitし、依頼範囲で公開が承認されている場合にpushする。スキル自体は公開や追加機能の権限を付与しない。
6. 公開されたURLを確認する。

公開は既存Cloudflare Pages `studio-rizi` のmainのGit連携を使う。新しいPagesプロジェクト・独立ドメインを通常更新時に作らない。GitHub Pagesへ公開しない。ホスティング方針の詳細は `STUDIO-RIZI-PROJECT-HOSTING.md` を優先。

## 6. 多言語と検索向け設定

日本語・English・中文・Portuguêsは独立した静的URL。日本語トップと `recipes/cold-udon/`、他言語は `en/`、`zh/`、`pt/` 配下の同じ記事パスを使う。初期HTMLに翻訳本文、題名、description、自己canonical、全言語の相互hreflangとx-defaultを出力する。

記事はRecipe JSON-LDを含む。サイトマップとrobotsはStudio Riziの全体ファイルに集約する。記事とトップを同じhreflangグループへ混ぜない。

## 7. スキルの保守

専用スキルの正本は `common-rules-document/skills/orita-kitchen-site/`。ローカルCodexでは `~/.codex/skills/orita-kitchen-site/` に同じファイルを導入する。UI方針やソース配置が変わった場合は、この文書・専用ソースの保守文書・スキルの対応箇所を揃える。
