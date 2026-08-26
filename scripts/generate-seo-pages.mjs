import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const publicRoot = path.join(root, 'website');
const origin = 'https://studio-rizi.pages.dev';
const today = new Date().toISOString().slice(0, 10);
const locales = ['ja', 'en', 'zh', 'pt'];
const languageTags = { ja: 'ja', en: 'en', zh: 'zh-Hans', pt: 'pt' };
const htmlLanguages = { ja: 'ja', en: 'en', zh: 'zh-CN', pt: 'pt' };
const ogLocales = { ja: 'ja_JP', en: 'en_US', zh: 'zh_CN', pt: 'pt_BR' };

const contentSource = await readFile(path.join(publicRoot, 'content.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(contentSource, context);
const siteContent = context.window.SITE_CONTENT;

const pageSeo = {
  home: {
    ja: {
      title: 'Studio RIZI — 折田悠希（おりたゆうき）の公式ポートフォリオ',
      description: 'Studio RIZIは、折田悠希（おりたゆうき / Yuki Orita）の公式ポートフォリオです。Awasero Music、EasyRoo、MLXBar、WAKARUなど、開発したアプリと活動を紹介します。',
      ogTitle: 'Studio RIZI — 折田悠希の公式ポートフォリオ',
      ogDescription: '世界をもっと、便利に、面白く。折田悠希（おりたゆうき）のアプリ、記事、活動を紹介します。'
    },
    en: {
      title: 'Studio RIZI — Official Portfolio of Yuki Orita',
      description: 'The official portfolio of Yuki Orita (Yuki_Orita / oriyu90), featuring Awasero Music, EasyRoo, MLXBar, WAKARU, and other open-source software projects.',
      ogTitle: 'Studio RIZI — Official Portfolio of Yuki Orita',
      ogDescription: 'Making the world more useful and interesting through apps, articles, and open-source projects.'
    },
    zh: {
      title: 'Studio RIZI — 折田悠希（Yuki Orita）的官方作品集',
      description: 'Studio RIZI 是折田悠希（Yuki Orita / Yuki_Orita / oriyu90）的官方作品集，介绍 Awasero Music、EasyRoo、MLXBar、WAKARU 等软件项目。',
      ogTitle: 'Studio RIZI — 折田悠希的官方作品集',
      ogDescription: '让世界更加便利、更加有趣。查看折田悠希开发的应用、文章与开源项目。'
    },
    pt: {
      title: 'Studio RIZI — Portfólio oficial de Yuki Orita',
      description: 'Portfólio oficial de Yuki Orita (Yuki_Orita / oriyu90), com Awasero Music, EasyRoo, MLXBar, WAKARU e outros projetos de software de código aberto.',
      ogTitle: 'Studio RIZI — Portfólio oficial de Yuki Orita',
      ogDescription: 'Um mundo mais prático e interessante por meio de aplicativos, artigos e projetos de código aberto.'
    }
  },
  profile: {
    ja: {
      title: '折田悠希（おりたゆうき）のプロフィール | Studio RIZI',
      description: 'Studio RIZIを運営する折田悠希（おりたゆうき / Yuki Orita）の公式プロフィール。広島を拠点に、日常を便利で面白くするソフトウェアを開発しています。',
      ogTitle: '折田悠希（おりたゆうき）のプロフィール | Studio RIZI',
      ogDescription: '好奇心を、動くものに。折田悠希のプロフィールと開発姿勢。'
    },
    en: {
      title: 'Yuki Orita — Developer Profile | Studio RIZI',
      description: 'Official profile of Yuki Orita (Yuki_Orita / oriyu90), an independent developer in Hiroshima who creates practical and interesting software.',
      ogTitle: 'Yuki Orita — Developer Profile | Studio RIZI',
      ogDescription: 'Turning curiosity into working software. Meet the developer behind Studio RIZI.'
    },
    zh: {
      title: '折田悠希（Yuki Orita）开发者简介 | Studio RIZI',
      description: '折田悠希（Yuki Orita / Yuki_Orita / oriyu90）的官方简介。他在日本广岛开发让日常生活更便利、更有趣的软件。',
      ogTitle: '折田悠希开发者简介 | Studio RIZI',
      ogDescription: '把好奇心变成真正可用的软件。了解 Studio RIZI 背后的开发者。'
    },
    pt: {
      title: 'Yuki Orita — Perfil do desenvolvedor | Studio RIZI',
      description: 'Perfil oficial de Yuki Orita (Yuki_Orita / oriyu90), desenvolvedor independente em Hiroshima que cria softwares práticos e interessantes.',
      ogTitle: 'Yuki Orita — Perfil do desenvolvedor | Studio RIZI',
      ogDescription: 'Transformando curiosidade em software real. Conheça o desenvolvedor do Studio RIZI.'
    }
  },
  news: {
    ja: {
      title: 'アプリの公開・更新情報 | Studio RIZI',
      description: 'Studio RIZIと折田悠希（おりたゆうき / Yuki Orita）が開発するアプリの公開・更新情報。MLXBar、Tango pro、WAKARUなどの最新情報を掲載します。',
      ogTitle: 'アプリの公開・更新情報 | Studio RIZI',
      ogDescription: '折田悠希が開発するアプリのリリース、アップデート、公式サイトからのお知らせ。'
    },
    en: {
      title: 'Software Releases and Updates | Studio RIZI',
      description: 'Releases and updates from Studio RIZI and Yuki Orita, including the latest news about MLXBar, Tango pro, WAKARU, and other software projects.',
      ogTitle: 'Software Releases and Updates | Studio RIZI',
      ogDescription: 'Product releases, updates, and announcements from Yuki Orita and Studio RIZI.'
    },
    zh: {
      title: '软件发布与更新 | Studio RIZI',
      description: 'Studio RIZI 与折田悠希的软件发布和更新信息，包括 MLXBar、Tango pro、WAKARU 等项目的最新动态。',
      ogTitle: '软件发布与更新 | Studio RIZI',
      ogDescription: '折田悠希与 Studio RIZI 的产品发布、更新和公告。'
    },
    pt: {
      title: 'Lançamentos e atualizações de software | Studio RIZI',
      description: 'Lançamentos e atualizações do Studio RIZI e de Yuki Orita, incluindo novidades sobre MLXBar, Tango pro, WAKARU e outros projetos.',
      ogTitle: 'Lançamentos e atualizações | Studio RIZI',
      ogDescription: 'Lançamentos, atualizações e anúncios de Yuki Orita e do Studio RIZI.'
    }
  }
};

const translations = {
  home: {
    en: [
      ['世界をもっと、', 'Make the world'], ['便利に', 'more useful'], ['面白く', 'more interesting'],
      ['誰もがその便利さ、面白さにふれる機会があるように。<br>そんな世界を目指して、開発をしています。', 'I build so that everyone has a chance to experience<br>what technology can make easier and more fun.'],
      ['プロジェクトを見る', 'View projects'], ['プロフィール', 'Profile'], ['知恵を得る', 'Gain insight'], ['作っている人を、<br>もっと知る。', 'Meet the person<br>behind the work.'], ['新しい動きは<br>ここから', 'What is new<br>starts here'],
      ['つくったもの、<br><em>育てているもの。</em>', 'Things I made.<br><em>Things I keep growing.</em>'],
      ['音楽、学習、AI、ファイル管理。日常の小さな不便を見つけ、使える形までつくります。プロジェクトを選ぶと詳細が開きます。', 'Music, learning, AI, and file management. I find small everyday frictions and turn them into products you can actually use.'],
      ['プロジェクトを検索', 'Search projects'], ['お知らせ', 'News'], ['すべてのお知らせを見る', 'View all news'],
      ['次の「便利」と「面白い」を、', 'Keep building the next'], ['つくり続ける。', 'useful and interesting thing.']
    ],
    zh: [
      ['世界をもっと、', '让世界更加'], ['便利に', '便利'], ['面白く', '更加有趣'],
      ['誰もがその便利さ、面白さにふれる機会があるように。<br>そんな世界を目指して、開発をしています。', '让每个人都有机会感受到科技带来的便利与乐趣。<br>我正朝着这样的世界持续开发。'],
      ['プロジェクトを見る', '查看项目'], ['プロフィール', '个人简介'], ['知恵を得る', '获取智慧'], ['作っている人を、<br>もっと知る。', '认识作品<br>背后的开发者。'], ['新しい動きは<br>ここから', '新的动向<br>从这里开始'],
      ['つくったもの、<br><em>育てているもの。</em>', '已经完成的，<br><em>持续成长的。</em>'],
      ['音楽、学習、AI、ファイル管理。日常の小さな不便を見つけ、使える形までつくります。プロジェクトを選ぶと詳細が開きます。', '音乐、学习、AI 与文件管理。我从日常的小麻烦出发，把想法做成真正可用的产品。'],
      ['プロジェクトを検索', '搜索项目'], ['お知らせ', '最新动态'], ['すべてのお知らせを見る', '查看全部动态'],
      ['次の「便利」と「面白い」を、', '继续创造下一个'], ['つくり続ける。', '便利与有趣。']
    ],
    pt: [
      ['世界をもっと、', 'Um mundo mais'], ['便利に', 'prático'], ['面白く', 'interessante'],
      ['誰もがその便利さ、面白さにふれる機会があるように。<br>そんな世界を目指して、開発をしています。', 'Desenvolvo para que todos possam experimentar<br>mais praticidade e diversão através da tecnologia.'],
      ['プロジェクトを見る', 'Ver projetos'], ['プロフィール', 'Perfil'], ['知恵を得る', 'Ganhar conhecimento'], ['作っている人を、<br>もっと知る。', 'Conheça quem está<br>por trás dos projetos.'], ['新しい動きは<br>ここから', 'As novidades<br>começam aqui'],
      ['つくったもの、<br><em>育てているもの。</em>', 'O que criei.<br><em>O que continuo melhorando.</em>'],
      ['音楽、学習、AI、ファイル管理。日常の小さな不便を見つけ、使える形までつくります。プロジェクトを選ぶと詳細が開きます。', 'Música, aprendizado, IA e arquivos. Encontro pequenos atritos do cotidiano e os transformo em produtos úteis.'],
      ['プロジェクトを検索', 'Buscar projetos'], ['お知らせ', 'Notícias'], ['すべてのお知らせを見る', 'Ver todas as notícias'],
      ['次の「便利」と「面白い」を、', 'Continuar criando o próximo'], ['つくり続ける。', 'prático e interessante.']
    ]
  },
  profile: {
    en: [['好奇心を、<br><em>動くものに。</em>', 'Turn curiosity<br><em>into something real.</em>'], ['日常で感じた不便や「こうだったら面白い」を、アプリとして形にしています。', 'I turn everyday friction and “what if this were more fun?” into working apps.'], ['広島県', 'Hiroshima, Japan'], ['焼きそば', 'Yakisoba'], ['ソフトウェアで<em>「できる」を増やす</em>', 'Expand what people can do<br><em>with software.</em>'], ['QOL爆上げプロダクトを、日々作って磨いています', 'I build and polish products every day that dramatically improve quality of life.'], ['小さく始めて、<br>使えるところまで。', 'Start small.<br>Build until it is useful.'], ['みつける', 'Notice'], ['毎日の中の面倒や、まだ形になっていない面白さを見つけます。', 'Find everyday friction and interesting ideas that have not yet taken shape.'], ['つくる', 'Build'], ['まず動くものを作り、実際に使いながら必要な形へ整えます。', 'Make the smallest working version, use it, and shape what truly matters.'], ['磨く', 'Polish'], ['実際に使い、フィードバックを取り入れながら磨き続けます。', 'Use it in real life, learn from feedback, and keep refining it.']],
    zh: [['好奇心を、<br><em>動くものに。</em>', '把好奇心，<br><em>变成可以使用的东西。</em>'], ['日常で感じた不便や「こうだったら面白い」を、アプリとして形にしています。', '我把日常中的不便与“这样会不会更有趣”做成真正可用的应用。'], ['広島県', '日本广岛县'], ['焼きそば', '日式炒面'], ['ソフトウェアで<em>「できる」を増やす</em>', '用软件拓展<br><em>“能做到的事”。</em>'], ['QOL爆上げプロダクトを、日々作って磨いています', '每天打造并打磨让生活质量大幅提升的产品。'], ['小さく始めて、<br>使えるところまで。', '从小处开始，<br>做到真正可用。'], ['みつける', '发现'], ['毎日の中の面倒や、まだ形になっていない面白さを見つけます。', '发现日常的不便，以及还没有成形的有趣想法。'], ['つくる', '制作'], ['まず動くものを作り、実際に使いながら必要な形へ整えます。', '先做出能运行的版本，在实际使用中找到真正重要的部分。'], ['磨く', '打磨'], ['実際に使い、フィードバックを取り入れながら磨き続けます。', '投入实际使用，并根据反馈持续打磨。']],
    pt: [['好奇心を、<br><em>動くものに。</em>', 'Transformar curiosidade<br><em>em algo que funciona.</em>'], ['日常で感じた不便や「こうだったら面白い」を、アプリとして形にしています。', 'Transformo incômodos do dia a dia e ideias interessantes em aplicativos reais.'], ['広島県', 'Hiroshima, Japão'], ['焼きそば', 'Yakisoba'], ['ソフトウェアで<em>「できる」を増やす</em>', 'Ampliar o que é possível<br><em>com software.</em>'], ['QOL爆上げプロダクトを、日々作って磨いています', 'Crio e aprimoro, todos os dias, produtos que elevam muito a qualidade de vida.'], ['小さく始めて、<br>使えるところまで。', 'Começar pequeno.<br>Construir até ser útil.'], ['みつける', 'Perceber'], ['毎日の中の面倒や、まだ形になっていない面白さを見つけます。', 'Encontrar atritos do cotidiano e ideias interessantes que ainda não ganharam forma.'], ['つくる', 'Criar'], ['まず動くものを作り、実際に使いながら必要な形へ整えます。', 'Fazer uma versão funcional, usar e lapidar o que realmente importa.'], ['磨く', 'Aprimorar'], ['実際に使い、フィードバックを取り入れながら磨き続けます。', 'Usar no dia a dia, ouvir o feedback e continuar refinando.']]
  },
  news: {
    en: [['新しい動きは<br><em>ここから</em>', 'What is new<br><em>starts here</em>'], ['アプリの公開、アップデート、サイトからのお知らせをまとめています。', 'Releases, product updates, and announcements from across my work.'], ['すべてのお知らせ', 'All updates'], ['該当するお知らせはありません。', 'No updates in this category.'], ['最新の活動は、<br>Xでも発信しています。', 'Follow the latest work<br>on X as well.']],
    zh: [['新しい動きは<br><em>ここから</em>', '新的动向<br><em>从这里开始</em>'], ['アプリの公開、アップデート、サイトからのお知らせをまとめています。', '集中查看应用发布、产品更新与网站公告。'], ['すべてのお知らせ', '全部动态'], ['該当するお知らせはありません。', '此分类暂无动态。'], ['最新の活動は、<br>Xでも発信しています。', '也可以在 X 上<br>关注最新进展。']],
    pt: [['新しい動きは<br><em>ここから</em>', 'As novidades<br><em>começam aqui</em>'], ['アプリの公開、アップデート、サイトからのお知らせをまとめています。', 'Lançamentos, atualizações de produtos e anúncios.'], ['すべてのお知らせ', 'Todas as notícias'], ['該当するお知らせはありません。', 'Nenhuma notícia nesta categoria.'], ['最新の活動は、<br>Xでも発信しています。', 'Acompanhe as novidades<br>também no X.']]
  }
};

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function pagePath(page, locale) {
  const prefix = locale === 'ja' ? '' : `/${locale}`;
  if (page === 'home') return `${prefix}/` || '/';
  return `${prefix}/${page}`;
}

function replaceGeneratedRegion(html, name, content) {
  const pattern = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!pattern.test(html)) throw new Error(`Generated region is missing: ${name}`);
  return html.replace(pattern, `$1${content}$2`);
}

function replaceMeta(html, selector, value) {
  const attribute = selector.startsWith('og:') ? 'property' : 'name';
  const pattern = new RegExp(`<meta ${attribute}="${selector}" content="[^"]*">`);
  if (!pattern.test(html)) throw new Error(`Meta tag is missing: ${selector}`);
  return html.replace(pattern, `<meta ${attribute}="${selector}" content="${escapeHtml(value)}">`);
}

function alternates(page) {
  const links = locales.map(locale => `\n  <link rel="alternate" hreflang="${languageTags[locale]}" href="${origin}${pagePath(page, locale)}">`).join('');
  return `${links}\n  <link rel="alternate" hreflang="x-default" href="${origin}${pagePath(page, 'ja')}">\n  `;
}

function languageSwitcher(page, locale) {
  const labels = { ja: '日本語', en: 'English', zh: '中文', pt: 'Português' };
  const links = locales.map(target => `<a data-language-link="${target}" hreflang="${languageTags[target]}" lang="${languageTags[target]}" href="${pagePath(page, target)}"${target === locale ? ' aria-current="page" class="is-current"' : ''}>${labels[target]}</a>`).join('');
  return `<details class="language-switcher"><summary class="locale-indicator" data-locale-indicator>${locale.toUpperCase()}</summary><div>${links}</div></details>`;
}

function projectDirectory(locale) {
  return siteContent.projects.map((project, index) => {
    const description = project.description[locale] || project.description.en;
    const platforms = project.platforms.map(platform => `<i>${escapeHtml(platform)}</i>`).join('');
    return `<a href="${escapeHtml(project.url)}" class="project-card project-${project.color}"><span class="project-count">${String(index + 1).padStart(2, '0')}</span><span class="project-icon">${escapeHtml(project.code)}</span><span class="project-name">${escapeHtml(project.name)}</span><span class="project-desc">${escapeHtml(description)}</span><span class="platforms">${platforms}</span><span class="project-open" aria-hidden="true">OPEN ↗</span></a>`;
  }).join('');
}

function newsDirectory(locale, limit = Infinity) {
  return siteContent.news.slice(0, limit).map(item => {
    const title = item.title[locale] || item.title.en;
    const summary = item.summary?.[locale] || item.summary?.en || '';
    const link = item.url ? `<a href="${escapeHtml(item.url)}" aria-label="${escapeHtml(title)}">↗</a>` : '<i>—</i>';
    return `<article><time datetime="${item.date.replaceAll('.', '-')}">${item.date}</time><span>${item.tag}</span><div><h3>${escapeHtml(title)}</h3>${summary ? `<p>${escapeHtml(summary)}</p>` : ''}</div>${link}</article>`;
  }).join('');
}

function localizeInternalLinks(html, page, locale) {
  if (locale === 'ja') return html;
  const prefix = `/${locale}`;
  return html
    .replaceAll('href="/#projects"', `href="${prefix}/#projects"`)
    .replaceAll('href="#projects"', `href="${prefix}/#projects"`)
    .replaceAll('href="/profile"', `href="${prefix}/profile"`)
    .replaceAll('href="/news"', `href="${prefix}/news"`)
    .replaceAll('href="#top"', `href="${prefix}/#top"`)
    .replaceAll('href="/"', `href="${prefix}/"`);
}

function projectListSchema(locale) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${origin}/#projects`,
    name: 'Studio RIZI Projects',
    itemListElement: siteContent.projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.name,
      url: project.url,
      description: project.description[locale] || project.description.en
    }))
  }, null, 2);
}

function localizePage(source, page, locale) {
  const seo = pageSeo[page][locale];
  let html = source.replace(/<html\b[^>]*>/, `<html lang="${htmlLanguages[locale]}" data-site-language="${locale}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
  html = replaceMeta(html, 'description', seo.description);
  html = replaceMeta(html, 'og:title', seo.ogTitle);
  html = replaceMeta(html, 'og:description', seo.ogDescription);
  html = replaceMeta(html, 'og:url', `${origin}${pagePath(page, locale)}`);
  html = replaceMeta(html, 'og:locale', ogLocales[locale]);
  html = html.replace(/(?:\s*<meta property="og:locale:alternate" content="[^"]+">)+/, locales.filter(target => target !== locale).map(target => `\n  <meta property="og:locale:alternate" content="${ogLocales[target]}">`).join(''));
  html = replaceMeta(html, 'twitter:title', seo.ogTitle);
  html = replaceMeta(html, 'twitter:description', seo.ogDescription);
  html = html.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${origin}${pagePath(page, locale)}">`);
  html = replaceGeneratedRegion(html, 'seo-alternates', alternates(page));
  html = replaceGeneratedRegion(html, 'language-switcher', languageSwitcher(page, locale));
  for (const [from, to] of translations[page]?.[locale] || []) html = html.replaceAll(from, to);
  const nav = locale === 'zh' ? ['项目', '动态', '简介', '首页 ←'] : locale === 'pt' ? ['Projetos', 'Notícias', 'Perfil', 'Início ←'] : ['Projects', 'News', 'Profile', 'Home ←'];
  html = html.replace(/(<header class="site-header">[\s\S]*?<nav[^>]*>)[\s\S]*?(<\/nav>)/, (match, start, end) => {
    const current = page === 'news' ? 'news' : page === 'profile' ? 'profile' : '';
    return `${start}<a href="${locale === 'ja' ? '' : `/${locale}`}/#projects">${nav[0]}</a><a href="${pagePath('news', locale)}"${current === 'news' ? ' aria-current="page"' : ''}>${nav[1]}</a><a href="${pagePath('profile', locale)}"${current === 'profile' ? ' aria-current="page"' : ''}>${nav[2]}</a>${end}`;
  });
  html = html.replace(/(<a class="pill pill-dark header-cta" href="[^"]+">)[\s\S]*?(<\/a>)/, `$1${nav[3]}$2`);
  html = localizeInternalLinks(html, page, locale);
  html = html.replace(/<base href="[^"]+">/, '<base href="/">');
  html = replaceGeneratedRegion(html, 'language-switcher', languageSwitcher(page, locale));
  if (page === 'home') {
    const viewCopy = {
      ja:['プロジェクトの表示方法','カード','リスト'],
      en:['Project view','Cards','List'],
      zh:['项目显示方式','卡片','列表'],
      pt:['Visualização dos projetos','Cartões','Lista']
    }[locale];
    html = html.replace('aria-label="プロジェクトの表示方法"',`aria-label="${viewCopy[0]}"`)
      .replace('<span>カード</span>',`<span>${viewCopy[1]}</span>`)
      .replace('<span>リスト</span>',`<span>${viewCopy[2]}</span>`);
    html = replaceGeneratedRegion(html, 'project-directory', projectDirectory(locale));
    html = replaceGeneratedRegion(html, 'news-directory', newsDirectory(locale, 3));
    html = html.replace(/(<script type="application\/ld\+json" id="project-directory-schema">)[\s\S]*?(<\/script>)/, `$1\n${projectListSchema(locale)}\n  $2`);
    html = html.replace('"inLanguage": "ja"', `"inLanguage": "${languageTags[locale]}"`);
  }
  if (page === 'news') html = replaceGeneratedRegion(html, 'news-directory', newsDirectory(locale));
  if (page === 'profile') {
    html = html.replaceAll(`${origin}/profile#profile-page`, `${origin}${pagePath(page, locale)}#profile-page`);
    html = html.replace(`"url": "${origin}/profile"`, `"url": "${origin}${pagePath(page, locale)}"`);
    html = html.replace('"inLanguage": "ja"', `"inLanguage": "${languageTags[locale]}"`);
    html = html.replace('"name": "折田悠希（おりたゆうき）のプロフィール"', `"name": ${JSON.stringify(seo.title.split(' | ')[0])}`);
  }
  return html;
}

const baseFiles = { home: 'index.html', profile: 'profile.html', news: 'news.html' };
for (const [page, fileName] of Object.entries(baseFiles)) {
  const sourcePath = path.join(publicRoot, fileName);
  const source = await readFile(sourcePath, 'utf8');
  await writeFile(sourcePath, localizePage(source, page, 'ja'));
  for (const locale of locales.slice(1)) {
    const directory = path.join(publicRoot, locale);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, fileName), localizePage(source, page, locale));
  }
}

const vocelloScript = await readFile(path.join(publicRoot, 'projects/vocello-jp/localized.js'), 'utf8');
const vocelloContext = {};
vm.runInNewContext(`${vocelloScript.split('const lang =')[0]}globalThis.copyData = copy;`, vocelloContext);
const vocelloCopy = vocelloContext.copyData;
const vocelloSeo = {
  ja: {
    title: 'Vocello JP — Mac用日本語AI音声スタジオ | 折田悠希',
    description: 'Vocello JPは、Apple Silicon Mac上でQwen3-TTSによる日本語音声生成・音声デザイン・音声クローンをローカル実行するアプリです。開発者: 折田悠希（おりたゆうき / Yuki Orita）。'
  },
  en: {
    title: 'Vocello JP — Local Japanese AI Voice Studio for Mac',
    description: 'Vocello JP is a private, local Japanese AI voice studio for Apple Silicon Macs, built by Yuki Orita. Generate, design, and clone voices with Qwen3-TTS.'
  },
  zh: {
    title: 'Vocello JP — Mac 本地日语 AI 语音工作室',
    description: 'Vocello JP 是折田悠希（Yuki Orita）开发的 Apple Silicon Mac 本地日语 AI 语音工作室，支持 Qwen3-TTS 语音生成、设计与克隆。'
  },
  pt: {
    title: 'Vocello JP — Estúdio local de voz japonesa com IA para Mac',
    description: 'Vocello JP é um estúdio local e privado de voz japonesa com IA para Macs Apple Silicon, criado por Yuki Orita com Qwen3-TTS.'
  }
};

for (const locale of locales) {
  const localeDirectory = locale === 'ja' ? '' : `${locale}/`;
  const relative = `projects/vocello-jp/${localeDirectory}index.html`;
  const file = path.join(publicRoot, relative);
  let html = await readFile(file, 'utf8');
  const copy = vocelloCopy[locale];
  const seo = vocelloSeo[locale];
  const canonical = `${origin}/projects/vocello-jp/${localeDirectory}`;
  html = html.replace(/<html lang="[^"]+">/, `<html lang="${htmlLanguages[locale]}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(seo.description)}">`);
  html = html.replace(/<meta name="keywords" content="[^"]*">/, '');
  html = html.replace(/<p class="eyebrow" data-eyebrow>[\s\S]*?<\/p>/, `<p class="eyebrow" data-eyebrow>${escapeHtml(copy.eyebrow)}</p>`);
  html = html.replace(/<h1 data-title>[\s\S]*?<\/h1>/, `<h1 data-title>${escapeHtml(copy.title)}</h1>`);
  html = html.replace(/<p class="lead" data-lead>[\s\S]*?<\/p>/, `<p class="lead" data-lead>${escapeHtml(copy.lead)}</p>`);
  html = html.replace(/(<a class="primary" data-download[^>]*>)[\s\S]*?(<\/a>)/, `$1${escapeHtml(copy.download)}$2`);
  html = html.replace(/(<a data-source[^>]*>)[\s\S]*?(<\/a>)/, `$1${escapeHtml(copy.source)}$2`);
  html = html.replace(/<section class="cards">[\s\S]*?<\/section>/, `<section class="cards">${copy.cards.map((title, index) => `<article data-card><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy.cardText[index])}</p></article>`).join('')}</section>`);
  html = html.replace(/<p class="note" data-note>[\s\S]*?<\/p>/, `<p class="note" data-note>${escapeHtml(copy.note)}</p>`);
  html = html.replace(/<!-- project-seo:start -->[\s\S]*?<!-- project-seo:end -->/, '');
  const projectAlternates = `${locales.map(target => {
    const targetDirectory = target === 'ja' ? '' : `${target}/`;
    return `<link rel="alternate" hreflang="${languageTags[target]}" href="${origin}/projects/vocello-jp/${targetDirectory}">`;
  }).join('')}<link rel="alternate" hreflang="x-default" href="${origin}/projects/vocello-jp/">`;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${canonical}#software`,
    name: 'Vocello JP',
    url: canonical,
    description: seo.description,
    inLanguage: languageTags[locale],
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'macOS 26 or later on Apple Silicon',
    softwareVersion: '2.4.0-jp.1',
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      '@id': `${origin}/#person`,
      name: '折田悠希',
      alternateName: ['おりたゆうき', 'Yuki Orita', 'Yuki_Orita', 'oriyu90'],
      url: `${origin}/`
    },
    sameAs: ['https://github.com/oriyu90/vocello-jp'],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' }
  });
  const projectSeoMarkup = `<!-- project-seo:start -->${projectAlternates}<meta property="og:type" content="website"><meta property="og:locale" content="${ogLocales[locale]}"><meta property="og:site_name" content="Studio RIZI"><meta property="og:title" content="${escapeHtml(seo.title)}"><meta property="og:description" content="${escapeHtml(seo.description)}"><meta property="og:url" content="${canonical}"><script type="application/ld+json">${schema}</script><!-- project-seo:end -->`;
  html = html.replace(/(<link rel="canonical" href="[^"]+">)/, `$1${projectSeoMarkup}`);
  await writeFile(file, html);
}

function canonicalPathForFile(relative) {
  const normalized = relative.replaceAll(path.sep, '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'index.html'.length)}`;
  if (normalized.endsWith('.html')) return `/${normalized.slice(0, -'.html'.length)}`;
  return null;
}

function lastModified(relative) {
  try {
    execFileSync('git', ['diff', '--quiet', '--', `website/${relative}`], { cwd: root });
    const value = execFileSync('git', ['log', '-1', '--format=%cs', '--', `website/${relative}`], { cwd: root, encoding: 'utf8' }).trim();
    return value || today;
  } catch {
    return today;
  }
}

const sitemapEntries = [];
for (const page of ['home', 'news', 'profile']) {
  for (const locale of locales) {
    const relative = `${locale === 'ja' ? '' : `${locale}/`}${baseFiles[page]}`;
    sitemapEntries.push({
      urlPath: pagePath(page, locale),
      relative,
      alternates: [
        ...locales.map(target => ({ hreflang: languageTags[target], href: `${origin}${pagePath(page, target)}` })),
        { hreflang: 'x-default', href: `${origin}${pagePath(page, 'ja')}` }
      ]
    });
  }
}

async function findProjectIndexes(directory, prefix = '') {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) results.push(...await findProjectIndexes(path.join(directory, entry.name), relative));
    else if (entry.name === 'index.html') results.push(relative);
  }
  return results;
}

const projectIndexes = await findProjectIndexes(path.join(publicRoot, 'projects'));
const projectGroups = new Map();
for (const relativeProject of projectIndexes) {
  const relative = `projects/${relativeProject.replaceAll(path.sep, '/')}`;
  const urlPath = canonicalPathForFile(relative);
  const parts = urlPath.split('/').filter(Boolean);
  const slug = parts[1];
  const localeSegment = parts[2];
  const group = projectGroups.get(slug) || [];
  if (!localeSegment || locales.includes(localeSegment)) group.push({ urlPath, locale: localeSegment || 'ja' });
  projectGroups.set(slug, group);
  sitemapEntries.push({ urlPath, relative, alternates: [] });
}
for (const entry of sitemapEntries.filter(entry => entry.urlPath.startsWith('/projects/'))) {
  const slug = entry.urlPath.split('/').filter(Boolean)[1];
  const group = projectGroups.get(slug) || [];
  if (group.length > 1 && group.some(item => item.urlPath === entry.urlPath)) {
    const defaultItem = group.find(item => item.locale === 'ja') || group[0];
    entry.alternates = [
      ...group.map(item => ({ hreflang: languageTags[item.locale], href: `${origin}${item.urlPath}` })),
      { hreflang: 'x-default', href: `${origin}${defaultItem.urlPath}` }
    ];
  }
}

const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.map(entry => `  <url>
    <loc>${xmlEscape(origin + entry.urlPath)}</loc>
    <lastmod>${lastModified(entry.relative)}</lastmod>${entry.alternates.map(alternate => `
    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${xmlEscape(alternate.href)}"/>`).join('')}
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(publicRoot, 'sitemap.xml'), sitemap);

console.log(`Generated ${locales.length * Object.keys(baseFiles).length} localized pages and ${sitemapEntries.length} sitemap URLs.`);
