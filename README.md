# Studio RIZI

Studio RIZIの公式ポートフォリオサイトです。

- 公開URL: https://studio-rizi.pages.dev/
- 公開対象: `website/`
- ホスティング: Cloudflare Pages
- デプロイ: `main` ブランチへのpushで自動実行
- プロジェクトURL: Kiziを除き `https://studio-rizi.pages.dev/projects/<slug>/`
- プロジェクト一覧: `projects/manifest.json`

## 多言語SEO

- 日本語: `/`、`/news`、`/profile`
- English: `/en/`、`/en/news`、`/en/profile`
- 中文: `/zh/`、`/zh/news`、`/zh/profile`
- Português: `/pt/`、`/pt/news`、`/pt/profile`

検索エンジンが言語ごとに別の題名・紹介文・本文を取得できるよう、各言語を独立URLの静的HTMLとして公開する。`scripts/generate-seo-pages.mjs` が言語ページ、初期PROJECTリンク、初期NEWS本文、`hreflang`、構造化データ、サイトマップを生成するため、`website/en/`、`website/zh/`、`website/pt/` は直接編集しない。

`main` へのpush後はCloudflare Pagesが自動公開し、GitHub Actionsが変更URLをIndexNowへ通知する。Google Search ConsoleとBing Webmaster Toolsには `https://studio-rizi.pages.dev/sitemap.xml` を登録する。

## 検証

```bash
npm test
```

言語ページを再生成したうえで、canonical、相互`hreflang`、静的PROJECTリンク、サイトマップ、公開ファイルの参照切れ、旧URLの残存、完全重複ファイル、16,000ファイルの安全上限をまとめて検査します。

PROJECTカードとお知らせの追加方法は `PROJECT-CARD-RULES.md` を参照してください。

## レスポンシブUI

- ホームのヒーローは各カラム内で中央寄せし、見出しをカラムの内幅に合わせて拡縮します。コンテナ単位に未対応のブラウザでは画面幅ベースの指定へフォールバックします。
- お知らせカテゴリは文字幅に合わせて枠を広げ、600px以下では日付・カテゴリと本文を2段に配置します。
- ホームのフッターは `X / KIZI / GitHub / News / Profile` の順で、狭い画面では折り返します。4言語のKIZIリンクと並び順を `npm test` で検査します。
- プロジェクトカードは常に正方形です。縦横比に応じた最小辺長で多列配置し、599px以下は2列。初期表示は縦長で3行、正方形に近い画面で2行、横長で1行です。小型カードでも説明文（最大3行）・番号・丸いアイコン・OPENを表示します。名称と説明は一つの`.project-copy`とし、200px未満では衝突を避ける中央配置、200px以上ではカード幅に応じた上寄りの中間位置へ置きます。名称14px、説明12px、対応OS11pxを下限とし、リスト／詳細では説明全文を読めます。
- カードのホバーは外形・位置・寸法を変えず、内側2pxの線だけで強調します。外側へ伸びる影や上方向への移動を戻さないでください。
- 折りたたみは`.project-grid-shell`の高さと`overflow:hidden`で行います。`.project-grid`本体へ`max-height`を設定するとGrid行がカード幅より低く圧縮され、正方形同士が重なるため禁止です。
- 検索欄右側のアイコンボタンは「次の表示方式」を示します。カード表示中はリストアイコン、リスト表示中はカードアイコンです。検索条件とカードの展開状態は維持され、リストは全検索結果を表示します。JavaScript無効時もカードの通常リンクを利用できます。
- 上部の案内カード3枚は560px以上で横並び、559px以下ではコンパクトな縦積みになります。縦長画面では高さや文字サイズも調整します。
- 配置は `styles.css` と `responsive.css`、テーマ色は最後に読む `theme.css` に分離しています。`theme.js` は初回描画前にOS設定または `?theme=light|dark` を解決し、画像とブラウザのテーマ色も同期します。テーマ判定を `i18n.js` へ戻さないでください。
- SNS画像は共通の `assets/og-v2.png`（1730×909）を利用し、題名・紹介文・画像説明は4言語の静的HTMLへ生成します。お知らせのLATEST日付はニュースデータから生成します。
- `npm test` は公開ファイルの検査と31件のUI・テーマ・SNSテストを実行します。今回の監査結果・検証範囲と制限は `UI-AUDIT-2026-08-27.md` に記録しています。

Author: Yuki_Orita
