# 紹介サイト移行台帳

> 調査日: 2026-08-21

GitHubの各`main`ブランチと、必要な場合は実際のWebビルドを調査した結果。ファイル数は紹介サイトとして公開される、または公開候補となるファイルの概数であり、アプリ本体や`node_modules`は含まない。

| 順序 | slug | 現在の公開元 | 配置 | 公開ファイル | 難易度 | 状態 |
|---:|---|---|---|---:|---|---|
| 1 | `awasero-music` | `awasero-music.pages.dev` | `website/` | 1 | 低 | 未着手 |
| 2 | `mcs-manager` | `mcs-manager.pages.dev` | リポジトリ直下 | 4 | 低 | 未着手 |
| 3 | `mlx-bar` | `mlx-bar.pages.dev` | `website/` | 3 | 低 | 未着手 |
| 4 | `easyroo` | `easyroo.pages.dev` | `website/` | 7 | 低 | 未着手 |
| 5 | `md-viewer-pro` | `md-viewer-pro.pages.dev` | `website/` | 7 | 低 | 未着手 |
| 6 | `media-master` | `media-master-9o5.pages.dev` | `website/` | 7 | 低 | 未着手 |
| 7 | `tango-pro` | `tango-pro.pages.dev` | `website/` | 8 | 低 | 未着手 |
| 8 | `volume-routine` | `volume-routine.pages.dev` | `website/` | 7 | 低 | 未着手 |
| 9 | `wakaru` | `wakaru.pages.dev` | `website/` | 6 | 低 | 未着手 |
| 10 | `pine-chat` | `pinechat.pages.dev` | `website/` | 11 | 中・4言語別HTML | 未着手 |
| 11 | `vocello-jp` | `vocello-jp.pages.dev` | `website/`をViteビルド | 28 | 高・React/SSR/音声 | 未着手 |
| 除外 | `kizi` | `kizi.pages.dev` | 独立サイト | — | 対象外 | 維持 |

## 現在の規模

- Studio Rizi本体: 44ファイル、約37MB
- 移行対象11サイト: 約89ファイル
- 統合後の初期見込み: 約133ファイル
- Cloudflare Pages無料枠20,000ファイルに対する使用率: 約0.7%

同一内容のファイルをSHA-256で比較したところ、調査対象の紹介サイト間に完全一致する重複ファイルはなかった。今後の追加で重複を発生させないため、ビルド時のハッシュ検査を導入する。

## 移行時に特に直すもの

- 旧 `*.pages.dev` を指すcanonical、OGP、JSON-LD、サイトマップ。
- `/style.css`、`/assets/...`などのルート相対URL。
- 言語切替の `/en/`、`/zh/`、`/pt/`。
- Google所有権確認ファイルの扱い。
- プロジェクト固有の`robots.txt`。統合後はホストルートの一つへ集約する。
- VocelloのVite `base` とSSR・prerenderの出力先。

## 状態の意味

- `未着手`: 棚卸しだけ完了。
- `移植中`: Studio Rizi側へソースを移し、ローカル検証中。
- `新URL公開済み`: 新URLは公開済みだが旧URLの移行監視中。
- `移行完了`: 旧URLが301となり、Search Console確認まで完了。
