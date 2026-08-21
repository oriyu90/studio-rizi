# 紹介サイト移行台帳

> 調査日: 2026-08-21

GitHubの各`main`ブランチと、必要な場合は実際のWebビルドを調査した結果。ファイル数は紹介サイトとして公開される、または公開候補となるファイルの概数であり、アプリ本体や`node_modules`は含まない。

| 順序 | slug | 現在の公開元 | 配置 | 公開ファイル | 難易度 | 状態 |
|---:|---|---|---|---:|---|---|
| 1 | `awasero-music` | `awasero-music.pages.dev` | `website/` | 1 | 低 | 301稼働済み |
| 2 | `mcs-manager` | `mcs-manager.pages.dev` | リポジトリ直下 | 4 | 低 | 301稼働済み |
| 3 | `mlx-bar` | `mlx-bar.pages.dev` | `website/` | 3 | 低 | 301稼働済み |
| 4 | `easyroo` | `easyroo.pages.dev` | `website/` | 7 | 低 | 301稼働済み |
| 5 | `md-viewer-pro` | `md-viewer-pro.pages.dev` | `website/` | 7 | 低 | 301稼働済み |
| 6 | `media-master` | `media-master-9o5.pages.dev` | `website/` | 7 | 低 | 301稼働済み |
| 7 | `tango-pro` | `tango-pro.pages.dev` | `website/` | 8 | 低 | 301稼働済み |
| 8 | `volume-routine` | `volume-routine.pages.dev` | `website/` | 7 | 低 | 301稼働済み |
| 9 | `wakaru` | `wakaru.pages.dev` | `website/` | 6 | 低 | 301稼働済み |
| 10 | `pine-chat` | `pinechat.pages.dev` | `website/` | 11 | 中・4言語別HTML | 301稼働済み |
| 11 | `vocello-jp` | `vocello-jp.pages.dev` | ローカライズ専用静的ビルド | 11 | 中・4言語HTML | 301稼働済み |
| 除外 | `kizi` | `kizi.pages.dev` | 独立サイト | — | 対象外 | 維持 |

## 現在の規模

- 統合後の公開対象: 98ファイル
- 安全上限16,000ファイルに対する使用率: 約0.6%
- 内容ハッシュが完全一致する重複公開ファイル: 0

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
- `新URL準備済み`: Studio Rizi側の配置とローカル検証が完了し、push待ち。
- `移植中`: Studio Rizi側へソースを移し、ローカル検証中。
- `新URL公開済み`: 新URLは公開済みだが旧URLの移行監視中。
- `301稼働済み`: 新URLを公開し、旧Pagesの全パス301とGitHub homepage更新を確認済み。Search Consoleの監視は継続する。
- `301承認待ち`: 新URLとローカル検証は完了したが、リポジトリ固有ルールによりpush承認待ち。
- `移行完了`: 旧URLが301となり、Search Console確認まで完了。
