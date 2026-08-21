# Studio RIZI

Studio RIZIの公式ポートフォリオサイトです。

- 公開URL: https://studio-rizi.pages.dev/
- 公開対象: `website/`
- ホスティング: Cloudflare Pages
- デプロイ: `main` ブランチへのpushで自動実行
- プロジェクトURL: Kiziを除き `https://studio-rizi.pages.dev/projects/<slug>/`
- プロジェクト一覧: `projects/manifest.json`

## 検証

```bash
npm test
```

公開ファイルの参照切れ、旧URLの残存、完全重複ファイル、16,000ファイルの安全上限をまとめて検査します。

PROJECTカードとお知らせの追加方法は `PROJECT-CARD-RULES.md` を参照してください。
