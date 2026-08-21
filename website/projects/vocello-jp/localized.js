const copy = {
  ja: {
    eyebrow: "Vocello 日本語版 · macOS 26+ · Apple Silicon",
    title: "Macで完結する、日本語のAI音声スタジオ。",
    lead: "原稿を書き、声を選ぶか説明するだけ。Qwen3-TTSとMLXによる音声生成はMac上で動作し、原稿や録音が外部に送信されることはありません。",
    download: "日本語版DMGをダウンロード",
    source: "GitHubでソースを見る",
    cards: ["内蔵音声", "音声デザイン", "音声クローン"],
    cardText: ["話者・言語・話し方を選んで生成。", "年齢、質感、アクセントを言葉で指定。", "使用許可のある参照音声から声を作成。"],
    note: "このコミュニティ配布DMGはアドホック署名です。macOSの確認が表示される場合があります。",
  },
  en: {
    eyebrow: "Vocello Japanese Edition · macOS 26+ · Apple Silicon",
    title: "A private AI voice studio, localized for Japanese macOS.",
    lead: "Write a script, choose or describe a voice, and generate locally with Qwen3-TTS and MLX. Scripts and recordings stay on your Mac.",
    download: "Download the Japanese DMG",
    source: "View source on GitHub",
    cards: ["Built-in Voice", "Voice Design", "Voice Cloning"],
    cardText: ["Choose a speaker, language, and delivery.", "Describe age, texture, accent, and style.", "Create from a reference you own or may use."],
    note: "This community DMG is ad-hoc signed and not Apple-notarized, so macOS may show a security confirmation.",
  },
  zh: {
    eyebrow: "Vocello 日文版 · macOS 26+ · Apple Silicon",
    title: "在 Mac 上私密运行的 AI 语音工作室。",
    lead: "编写文本、选择或描述声音，即可使用 Qwen3-TTS 和 MLX 在本地生成语音。文本和录音不会离开你的 Mac。",
    download: "下载日文版 DMG",
    source: "在 GitHub 查看源代码",
    cards: ["内置语音", "语音设计", "语音克隆"],
    cardText: ["选择说话人、语言和表达方式。", "用文字描述年龄、音色、口音和风格。", "仅使用你拥有或获得授权的参考音频。"],
    note: "此社区 DMG 使用临时签名，未经 Apple 公证，macOS 可能显示安全确认。",
  },
  pt: {
    eyebrow: "Vocello em japonês · macOS 26+ · Apple Silicon",
    title: "Um estúdio de voz com IA privado, direto no Mac.",
    lead: "Escreva um texto, escolha ou descreva uma voz e gere localmente com Qwen3-TTS e MLX. Seus textos e gravações permanecem no Mac.",
    download: "Baixar o DMG em japonês",
    source: "Ver o código no GitHub",
    cards: ["Voz integrada", "Design de voz", "Clonagem de voz"],
    cardText: ["Escolha locutor, idioma e interpretação.", "Descreva idade, textura, sotaque e estilo.", "Use somente uma referência que você possui ou pode usar."],
    note: "Este DMG da comunidade usa assinatura ad hoc e não foi notarizado pela Apple; o macOS pode exibir uma confirmação de segurança.",
  },
};

const lang = document.body.dataset.lang || "ja";
const t = copy[lang] || copy.ja;
document.documentElement.lang = lang;
document.querySelector("[data-eyebrow]").textContent = t.eyebrow;
document.querySelector("[data-title]").textContent = t.title;
document.querySelector("[data-lead]").textContent = t.lead;
document.querySelector("[data-download]").textContent = t.download;
document.querySelector("[data-source]").textContent = t.source;
document.querySelector("[data-note]").textContent = t.note;
document.querySelectorAll("[data-card]").forEach((card, index) => {
  card.querySelector("h2").textContent = t.cards[index];
  card.querySelector("p").textContent = t.cardText[index];
});
