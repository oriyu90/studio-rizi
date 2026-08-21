# PROJECTカード・お知らせ入力ルール

`content.js` には編集欄が2つだけあります。

1. `projects`: 新しいサービスをReleaseしたときにカードを書く
2. `manualNews`: 既存アプリをUpdateしたとき、またはOTHERのお知らせがあるときに書く

`projectReleaseNews` 以降は自動処理なので、通常は編集しません。

## PROJECT入力テンプレート

新しいサービスをReleaseしたら、`projects` 配列へ次の1件をコピーして記入します。これにより、PROJECTカードとRELEASEお知らせが同時に追加されます。

```js
{
  name: 'サービス名',
  url: 'https://studio-rizi.pages.dev/projects/example/',
  repository: 'https://github.com/oriyu90/example',
  announceRelease: true,
  releaseDate: '2026.08.19',
  releaseVersion: 'v1.0.0',
  releaseSource: 'github-release',
  code: 'EX',
  description: {
    ja: '26文字ほどの短い説明。',
    en: 'A short English description.',
    zh: '简短的中文说明。',
    pt: 'Uma descrição curta.'
  },
  platforms: ['Web', 'macOS'],
  color: 'lime'
}
```

まだReleaseしていないサービスをカードだけ先に登録する場合は、次の3点だけ変更します。

```js
announceRelease: false,
releaseDate: '',
releaseVersion: '',
releaseSource: ''
```

## 各項目

- `name`: 画面に表示する正式名称
- `url`: 公式サイトの完全なURL。Kiziを除き `https://studio-rizi.pages.dev/projects/<slug>/` を使う
- `repository`: Release情報の根拠となるGitHubリポジトリURL
- `announceRelease`: PROJECT追加と同時にRELEASEのお知らせを自動追加する場合は `true`。未公開・開発中など、お知らせに出さない場合は `false`
- `releaseDate`: 初回GitHub Releaseの公開日。`YYYY.MM.DD`形式で記入する
- `releaseVersion`: 初回GitHub Releaseのタグ名。Releaseがない場合は空文字にする
- `releaseSource`: 通常は `github-release`。Releaseがなくリポジトリ作成日を代用した場合だけ `repository-created`
- `code`: 丸いアイコン内に表示する英数字2文字
- `description`: 何ができるかが伝わる短文を、日本語・英語・中文・ポルトガル語で記入する
- `platforms`: `Web` / `Windows` / `macOS` / `Linux` / `Android` から該当するもの
- `color`: `lime` / `blue` / `green` / `paper` のいずれか

`announceRelease`、`releaseDate`、`releaseVersion`、`releaseSource` はカード上には表示されません。`announceRelease: true` かつ `releaseDate` があるPROJECTだけが、`content.js`によって `RELEASE` 種別のお知らせへ自動反映されます。PROJECTを追加したあとに、同じ内容のRELEASEお知らせを手作業で重複登録しないでください。

公式公開後は `announceRelease` を `true` に変更し、初回Release情報を記入してください。

## お知らせ入力テンプレート

### UPDATE

既存アプリに新しいバージョンや機能更新を公開したら、`manualNews` 配列へ次の1件を追加します。

```js
{
  date: '2026.08.19',
  tag: 'UPDATE',
  title: {
    ja: 'サービス名 v1.1.0 を公開しました。',
    en: 'Service Name v1.1.0 is available.',
    zh: 'Service Name v1.1.0 已发布。',
    pt: 'Service Name v1.1.0 está disponível.'
  },
  summary: {
    ja: '今回の主な変更を短く記入。',
    en: 'A short summary of the main changes.',
    zh: '简要说明此次主要更新。',
    pt: 'Um breve resumo das principais mudanças.'
  },
  url: 'https://studio-rizi.pages.dev/projects/example/'
}
```

### OTHER

公式サイト、記事、活動など、ReleaseでもUpdateでもない告知は `tag: 'OTHER'` で追加します。入力項目はUPDATEと同じです。

## 厳密な運用ルール

- 新しいサービスを初めてReleaseした場合: `projects` にカードを1件追加する。RELEASEお知らせは自動生成される
- 既存アプリをUpdateした場合: `manualNews` に `tag: 'UPDATE'` で1件追加する
- Release・Update以外を告知する場合: `manualNews` に `tag: 'OTHER'` で1件追加する
- `manualNews` に `tag: 'RELEASE'` を手入力しない
- UpdateのたびにPROJECTカードを増やさない。既存カードの `releaseDate` と `releaseVersion` は初回Release情報のまま変更しない
- PROJECTカードと同じ内容をOTHERやUPDATEとして重複登録しない
- 日付はすべて `YYYY.MM.DD`、新しいものほど上に記入する
- Kizi以外のPROJECTを個別の `*.pages.dev` へ新設しない
- PROJECT固有の公開ファイルは `website/projects/<slug>/` に置き、共通ファイルを複製しない

## PROJECTの並び順

`name` のアルファベット順に並べてください。日本語名のサービスは公式英語表記を基準にします。

## 確認事項

1. URLを新しいタブで開けるか
2. 2文字コードが他のサービスと重複していないか
3. 説明がカード上で3行以内に収まるか
4. 対応環境が公式サイトの記載と一致しているか
5. `repository` が正しいGitHubリポジトリを指しているか
6. 公開済みなら `announceRelease: true`、未公開なら `announceRelease: false` になっているか
7. `releaseDate` と `releaseVersion` がGitHubの初回Releaseと一致しているか
8. `announceRelease: true` の場合、RELEASEフィルターに自動生成されたお知らせが1件だけ表示されるか
9. `announceRelease: false` の場合、お知らせに表示されないか
10. PC幅とスマートフォン幅の両方で、検索・1行折り畳み・展開・カードのポップアップを確認する

## お知らせの確認事項

1. 新サービスのReleaseがPROJECTカードとRELEASEお知らせに1件ずつ表示されるか
2. 既存アプリのUpdateがUPDATEに1件だけ表示されるか
3. OTHERがRELEASEやUPDATEに混ざっていないか
4. タイトルと要約を日本語、英語、中文、ポルトガル語のすべてで記入したか
5. 日付、バージョン、リンク先が実際の公開内容と一致しているか
