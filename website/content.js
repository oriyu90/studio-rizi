// ===== 編集欄 1 / 2: PROJECTカード =====
// 新サービスをReleaseしたら、PROJECT-CARD-RULES.mdの「PROJECT入力テンプレート」を使って1件追加します。
// RELEASEお知らせはこのデータから自動生成されるため、manualNewsには重複して追加しません。
const projects = [
  {name:'Awasero Music',url:'https://awasero-music.pages.dev/',repository:'https://github.com/oriyu90/awasero-music',releaseDate:'2026.08.19',releaseVersion:'v1.0.0',releaseSource:'github-release',code:'AM',description:{ja:'鼻歌を編集できる楽譜とMIDIへ変換。',en:'Turn humming into editable scores and MIDI.',zh:'将哼唱转换为可编辑乐谱与 MIDI。',pt:'Transforme melodias cantadas em partituras e MIDI.'},platforms:['macOS'],color:'lime'},
  {name:'EasyRoo',url:'https://easyroo.pages.dev/',repository:'https://github.com/oriyu90/EasyRoo',releaseDate:'2026.07.22',releaseVersion:'v1.0',releaseSource:'github-release',code:'ER',description:{ja:'ローカルLLMで日々の作業を自動実行。',en:'Automate daily work with a local LLM.',zh:'使用本地 LLM 自动执行日常任务。',pt:'Automatize tarefas diárias com um LLM local.'},platforms:['macOS'],color:'blue'},
  {name:'Kizi',url:'https://kizi.pages.dev/',repository:'https://github.com/oriyu90/kizi',releaseDate:'2026.08.19',releaseVersion:'',releaseSource:'repository-created',code:'KZ',description:{ja:'開発やAIについて発信する記事メディア。',en:'Articles about software development and AI.',zh:'分享软件开发与 AI 的文章媒体。',pt:'Artigos sobre desenvolvimento e inteligência artificial.'},platforms:['Web'],color:'paper'},
  {name:'MCS Manager',url:'https://mcs-manager.pages.dev/',repository:'https://github.com/oriyu90/MCS-Manager',releaseDate:'2026.08.18',releaseVersion:'v1.0.0',releaseSource:'github-release',code:'MC',description:{ja:'Minecraftサーバーを一か所で管理。',en:'Manage Minecraft servers from one place.',zh:'在一个界面管理 Minecraft 服务器。',pt:'Gerencie servidores Minecraft em um só lugar.'},platforms:['macOS'],color:'green'},
  {name:'Media Master',url:'https://media-master-9o5.pages.dev/',repository:'https://github.com/oriyu90/media-master',releaseDate:'2026.08.18',releaseVersion:'v0.1.0',releaseSource:'github-release',code:'MM',description:{ja:'写真・音楽・書類を一つにまとめて管理。',en:'Manage photos, music, and documents together.',zh:'统一管理照片、音乐与文档。',pt:'Gerencie fotos, músicas e documentos juntos.'},platforms:['Android'],color:'blue'},
  {name:'MLXBar',url:'https://mlx-bar.pages.dev/',repository:'https://github.com/oriyu90/mlx-bar',releaseDate:'2026.08.11',releaseVersion:'v1.0.0',releaseSource:'github-release',code:'MX',description:{ja:'MacのローカルAIをメニューバーから。',en:'Local AI for Mac, right from the menu bar.',zh:'从菜单栏使用 Mac 本地 AI。',pt:'IA local no Mac, direto pela barra de menus.'},platforms:['macOS'],color:'paper'},
  {name:'Pine Chat',url:'https://pinechat.pages.dev/',repository:'https://github.com/oriyu90/PineChat',releaseDate:'2026.08.18',releaseVersion:'v1.0.0',releaseSource:'github-release',code:'PC',description:{ja:'自立思考型のローカルAIエージェント。',en:'An autonomous local AI agent for macOS.',zh:'自主思考型本地 AI 智能体。',pt:'Um agente de IA local e autônomo.'},platforms:['macOS'],color:'green'},
  {name:'Tango pro',url:'https://tango-pro.pages.dev/',repository:'https://github.com/oriyu90/Tango-pro',releaseDate:'2026.06.02',releaseVersion:'v1.0.1',releaseSource:'github-release',code:'TP',description:{ja:'自分のCSVで続けられる単語帳アプリ。',en:'A vocabulary app built around your own CSV.',zh:'使用自己的 CSV 持续学习单词。',pt:'Um app de vocabulário feito para o seu CSV.'},platforms:['Android','macOS'],color:'lime'},
  {name:'Vocello JP',url:'https://vocello-jp.pages.dev/',repository:'https://github.com/oriyu90/vocello-jp',releaseDate:'2026.08.18',releaseVersion:'v2.4.0-jp.1',releaseSource:'github-release',code:'VO',description:{ja:'Macで完結する日本語AI音声スタジオ。',en:'A Japanese AI voice studio that stays on Mac.',zh:'完全在 Mac 本地运行的日语 AI 语音工作室。',pt:'Estúdio de voz japonesa com IA, local no Mac.'},platforms:['macOS'],color:'blue'},
  {name:'Volume Routine',url:'https://volume-routine.pages.dev/',repository:'https://github.com/oriyu90/volume-routine',releaseDate:'2026.06.20',releaseVersion:'v1.0.1',releaseSource:'github-release',code:'VR',description:{ja:'時間とWi-FiでAndroid音量を自動化。',en:'Automate Android volume by time and Wi-Fi.',zh:'按时间和 Wi-Fi 自动调整 Android 音量。',pt:'Automatize o volume do Android por hora e Wi-Fi.'},platforms:['Android'],color:'lime'},
  {name:'WAKARU',url:'https://wakaru.pages.dev/',repository:'https://github.com/oriyu90/WAKARU',releaseDate:'2026.08.19',releaseVersion:'v0.1.0',releaseSource:'github-release',code:'WK',description:{ja:'資料を根拠つきで「わかる」に変える。',en:'Turn documents into cited understanding.',zh:'将资料转化为带有依据的理解。',pt:'Transforme documentos em entendimento com fontes.'},platforms:['macOS'],color:'paper'}
].map(project => ({
  announceRelease: true,
  ...project
}));

// ===== 編集欄 2 / 2: UPDATE・OTHERお知らせ =====
// 既存アプリの更新はUPDATE、サービス公開以外の告知はOTHERとして、
// PROJECT-CARD-RULES.mdの「お知らせ入力テンプレート」を使って1件追加します。
// RELEASEはここへ手入力しません。
const manualNews = [
  {date:'2026.08.19',tag:'OTHER',title:{ja:'公式ポートフォリオを公開しました。',en:'The official portfolio is now live.',zh:'官方作品集网站已上线。',pt:'O portfólio oficial já está no ar.'},summary:{ja:'制作したアプリ、記事、プロフィールを一つの場所から見られる公式サイトを公開しました。',en:'A new home for my apps, articles, updates, and profile.',zh:'在一个网站中浏览我开发的应用、文章、动态与个人资料。',pt:'Um novo espaço para meus apps, artigos, novidades e perfil.'}},
  {date:'2026.08.18',tag:'UPDATE',title:{ja:'Volume Routine v1.1.0 を公開しました。',en:'Volume Routine v1.1.0 is available.',zh:'Volume Routine v1.1.0 已发布。',pt:'Volume Routine v1.1.0 está disponível.'},summary:{ja:'時間とWi-FiをきっかけにAndroidの音量を自動調整する最新版です。',en:'The latest release automates Android volume using time and Wi-Fi triggers.',zh:'通过时间与 Wi-Fi 条件自动调整 Android 音量。',pt:'Automatiza o volume do Android usando horário e Wi-Fi.'},url:'https://volume-routine.pages.dev/'},
  {date:'2026.08.15',tag:'OTHER',title:{ja:'WAKARUの公式ページを公開しました。',en:'The WAKARU website is now live.',zh:'WAKARU 官方网站已上线。',pt:'O site oficial do WAKARU já está no ar.'},summary:{ja:'PDFや音声、動画などの資料を、根拠つきで理解するためのローカルAIアシスタントです。',en:'A local AI assistant for understanding PDFs, audio, video, and more with citations.',zh:'借助本地 AI 和引用依据理解 PDF、音频、视频等资料。',pt:'Assistente local de IA para entender PDFs, áudio e vídeo com citações.'},url:'https://wakaru.pages.dev/'},
  {date:'2026.08.12',tag:'UPDATE',title:{ja:'Tango pro v2.0.0 を公開しました。',en:'Tango pro v2.0.0 is available.',zh:'Tango pro v2.0.0 已发布。',pt:'Tango pro v2.0.0 está disponível.'},summary:{ja:'CSVから単語帳を作り、4択とタイピングで学べるAndroid・macOSアプリです。',en:'Build vocabulary books from CSV and study with multiple choice or typing.',zh:'从 CSV 创建单词本，并通过选择题或输入练习学习。',pt:'Crie vocabulários via CSV e estude com alternativas ou digitação.'},url:'https://tango-pro.pages.dev/'}
];

// ===== 以下は自動処理: 通常は編集しません =====
const projectReleaseNews = projects.filter(project => project.announceRelease === true && project.releaseDate).map(project => {
  const releasedName = `${project.name}${project.releaseVersion ? ` ${project.releaseVersion}` : ''}`;
  return {
    date: project.releaseDate,
    tag: 'RELEASE',
    projectCode: project.code,
    title: {
      ja: `${releasedName} を公開しました。`,
      en: `${releasedName} is now available.`,
      zh: `${releasedName} 已发布。`,
      pt: `${releasedName} está disponível.`
    },
    summary: project.description,
    url: project.url
  };
});

window.SITE_CONTENT = {
  projects,
  news: [...manualNews, ...projectReleaseNews].sort((a,b) => b.date.localeCompare(a.date))
};
