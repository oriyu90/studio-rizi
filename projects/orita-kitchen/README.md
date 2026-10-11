# 折田悠希の料理サイト / Yuki Orita’s Kitchen

写真を中心にした個人の料理wiki。最初の記事は「冷やうどんの部屋」。材料、5つの調理手順、3つの具材準備、5種類のたれ、卵と合わせるコツを収録しています。

公開URL: https://studio-rizi.pages.dev/projects/orita-kitchen/

Author: Yuki_Orita

## 編集と公開

- 本文の一次情報: `projects/orita-kitchen/content.json`。日本語・英語・中文・ポルトガル語を同じ構造で管理します。
- ページ生成: `scripts/generate-orita-kitchen.mjs`。トップと記事の計8ページを生成します。
- 配信元: `website/projects/orita-kitchen/`。生成HTMLを直接編集せず、本文と生成スクリプトを変更してください。
- UI: 同ディレクトリの `style.css` と `app.js`。
- 画像: `assets/hero.webp`、`ingredients.webp`、`rinse.webp`、`sauces.webp`。すべて内蔵画像生成ツールで作成したイメージで、実写の調理記録ではありません。
- ルートで `npm run build`、`npm run validate`、`npm run count-files`、`npm test` を実行。
- `oriyu90/studio-rizi` の `main` へpushすると既存Cloudflare Pagesが自動公開。新しいPagesプロジェクトは作成しません。

## 機能

記事・たれの名前の検索、検索結果なし表示、記事内の目次、具材チェック（同じブラウザ内に保存）、チェックのリセット、たれの味別絞り込み、印刷用表示。おかず風に辛いたれも含みます。チェック保存はブラウザに保存するだけで、サーバーへの送信はありません。

日・英・中・葡の独立URL、自己canonical、相互hreflang、Recipe構造化データ、全体サイトマップを提供します。アカウント登録やオンライン編集機能はありません。

## デザイン

生成り `#f7f6f0`、深緑 `#193a2e`、墨色 `#232c27`。和文はシステム明朝の太字見出しと太字ゴシック本文。写真の寸法を確保し、先頭画像以外は遅延読み込み。共通の余白・色トークン、キーボードフォーカス、44pxの操作面、動きを減らす設定を採用。

UI/UX Pro Maxを導入し、デザインシステム検索を実施。料理wikiには合わない販促用の口コミ構成は採用せず、提供された参考サイトの余白・写真・レシピ構成を優先。Hallmarkの視認性基準も適用しました。

参照: https://watahan-oncri.com/facility/ 、https://www.thermos.jp/recipe/mizuki/

## ライセンス

この料理サイト用に追加した本文・スクリプト・スタイル・画像にMITライセンスを適用します。既存Studio Riziや他プロジェクトのライセンスは変更しません。`LICENSE`参照。
