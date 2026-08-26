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
- プロジェクトカードはウィンドウの縦横比に応じて、高さ・余白・アイコンなどを連続的に縮小します。横長画面では従来の密度を保ち、文字には最小サイズを設けています。
- 検索欄右側のボタンでカード／リストを切り替えられます。検索条件とカードの展開状態は維持され、リストは全検索結果を表示します。JavaScript無効時もカードの通常リンクを利用できます。
- 上部の案内カード3枚は560px以上で横並び、559px以下ではコンパクトな縦積みになります。縦長画面では高さや文字サイズも調整します。
- `npm test` は公開ファイルの検査に加え、縦横比・表示切替・検索・折り畳み復帰・翻訳・詳細表示の6件のUI状態テストを実行します。

Author: Yuki_Orita
