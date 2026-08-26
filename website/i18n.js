(function () {
  const supported = ['ja', 'en', 'zh', 'pt'];
  const params = new URLSearchParams(location.search);
  const requested = params.get('lang')?.toLowerCase().split('-')[0];
  const pathLocale = location.pathname.match(/^\/(en|zh|pt)(?:\/|$)/)?.[1];
  const declaredLocale = document.documentElement.dataset.siteLanguage;
  const detected = (pathLocale || (supported.includes(requested) ? requested : declaredLocale || (navigator.languages || [navigator.language || 'en'])
    .map(value => value.toLowerCase().split('-')[0])
    .find(value => supported.includes(value)))) || 'ja';
  window.SITE_LANG = detected;
  window.siteText = value => typeof value === 'string' ? value : (value?.[window.SITE_LANG] || value?.en || value?.ja || '');

  const common = {
    ja:['Projects','News','Profile','Home ←'], en:['Projects','News','Profile','Home ←'],
    zh:['项目','动态','简介','首页 ←'], pt:['Projetos','Notícias','Perfil','Início ←']
  };
  const pages = {
    home:{
      ja:{hero:'世界をもっと、<br><em>便利に</em><br>面白く',lead:'誰もがその便利さ、面白さにふれる機会があるように。<br>そんな世界を目指して、開発をしています。',projects:'プロジェクトを見る <span>→</span>',profile:'プロフィール <span>↘</span>',j:['考えたことを、<br>言葉にする。','作っている人を、<br>もっと知る。','新しい動きは<br>ここから'],ptitle:'つくったもの、<br><em>育てているもの。</em>',plead:'音楽、学習、AI、ファイル管理。日常の小さな不便を見つけ、使える形までつくります。プロジェクトを選ぶと詳細が開きます。',news:'お知らせ',all:'すべてのお知らせを見る <span>→</span>',closing:'次の「便利」と「面白い」を、<br><em>つくり続ける。</em>'},
      en:{hero:'Make the world<br><em>more useful</em><br>more interesting',lead:'I build so that everyone has a chance to experience<br>what technology can make easier and more fun.',projects:'View projects <span>→</span>',profile:'Profile <span>↘</span>',j:['Turning ideas<br>into words.','Meet the person<br>behind the work.','What is new<br>starts here'],ptitle:'Things I made.<br><em>Things I keep growing.</em>',plead:'Music, learning, AI, and file management. I find small everyday frictions and turn them into products you can actually use.',news:'News',all:'View all news <span>→</span>',closing:'Keep building the next<br><em>useful and interesting thing.</em>'},
      zh:{hero:'让世界更加<br><em>便利</em><br>更加有趣',lead:'让每个人都有机会感受到科技带来的便利与乐趣。<br>我正朝着这样的世界持续开发。',projects:'查看项目 <span>→</span>',profile:'个人简介 <span>↘</span>',j:['把思考，<br>写成文字。','认识作品<br>背后的开发者。','新的动向<br>从这里开始'],ptitle:'已经完成的，<br><em>持续成长的。</em>',plead:'音乐、学习、AI 与文件管理。我从日常的小麻烦出发，把想法做成真正可用的产品。',news:'最新动态',all:'查看全部动态 <span>→</span>',closing:'继续创造下一个<br><em>便利与有趣。</em>'},
      pt:{hero:'Um mundo mais<br><em>prático</em><br>interessante',lead:'Desenvolvo para que todos possam experimentar<br>mais praticidade e diversão através da tecnologia.',projects:'Ver projetos <span>→</span>',profile:'Perfil <span>↘</span>',j:['Transformando ideias<br>em palavras.','Conheça quem está<br>por trás dos projetos.','As novidades<br>começam aqui'],ptitle:'O que criei.<br><em>O que continuo melhorando.</em>',plead:'Música, aprendizado, IA e arquivos. Encontro pequenos atritos do cotidiano e os transformo em produtos úteis.',news:'Notícias',all:'Ver todas as notícias <span>→</span>',closing:'Continuar criando o próximo<br><em>prático e interessante.</em>'}
    },
    profile:{
      ja:{title:'好奇心を、<br><em>動くものに。</em>',lead:'日常で感じた不便や「こうだったら面白い」を、アプリとして形にしています。',from:'広島県',favorite:'焼きそば',quote:'ソフトウェアで<em>「できる」を増やす</em>',statement:'QOL爆上げプロダクトを、日々作って磨いています',method:'小さく始めて、<br>使えるところまで。',steps:[['みつける','毎日の中の面倒や、まだ形になっていない面白さを見つけます。'],['つくる','まず動くものを作り、実際に使いながら必要な形へ整えます。'],['磨く','実際に使い、フィードバックを取り入れながら磨き続けます。']]},
      en:{title:'Turn curiosity<br><em>into something real.</em>',lead:'I turn everyday friction and “what if this were more fun?” into working apps.',from:'Hiroshima, Japan',favorite:'Yakisoba',quote:'Expand what people can do<br><em>with software.</em>',statement:'I build and polish products every day that dramatically improve quality of life.',method:'Start small.<br>Build until it is useful.',steps:[['Notice','Find everyday friction and interesting ideas that have not yet taken shape.'],['Build','Make the smallest working version, use it, and shape what truly matters.'],['Polish','Use it in real life, learn from feedback, and keep refining it.']]},
      zh:{title:'把好奇心，<br><em>变成可以使用的东西。</em>',lead:'我把日常中的不便与“这样会不会更有趣”做成真正可用的应用。',from:'日本广岛县',favorite:'日式炒面',quote:'用软件拓展<br><em>“能做到的事”。</em>',statement:'每天打造并打磨让生活质量大幅提升的产品。',method:'从小处开始，<br>做到真正可用。',steps:[['发现','发现日常的不便，以及还没有成形的有趣想法。'],['制作','先做出能运行的版本，在实际使用中找到真正重要的部分。'],['打磨','投入实际使用，并根据反馈持续打磨。']]},
      pt:{title:'Transformar curiosidade<br><em>em algo que funciona.</em>',lead:'Transformo incômodos do dia a dia e ideias interessantes em aplicativos reais.',from:'Hiroshima, Japão',favorite:'Yakisoba',quote:'Ampliar o que é possível<br><em>com software.</em>',statement:'Crio e aprimoro, todos os dias, produtos que elevam muito a qualidade de vida.',method:'Começar pequeno.<br>Construir até ser útil.',steps:[['Perceber','Encontrar atritos do cotidiano e ideias interessantes que ainda não ganharam forma.'],['Criar','Fazer uma versão funcional, usar e lapidar o que realmente importa.'],['Aprimorar','Usar no dia a dia, ouvir o feedback e continuar refinando.']]}
    },
    news:{
      ja:{title:'新しい動きは<br><em>ここから</em>',lead:'アプリの公開、アップデート、サイトからのお知らせをまとめています。',archive:'すべてのお知らせ',empty:'該当するお知らせはありません。',contact:'最新の活動は、<br>Xでも発信しています。'},
      en:{title:'What is new<br><em>starts here</em>',lead:'Releases, product updates, and announcements from across my work.',archive:'All updates',empty:'No updates in this category.',contact:'Follow the latest work<br>on X as well.'},
      zh:{title:'新的动向<br><em>从这里开始</em>',lead:'集中查看应用发布、产品更新与网站公告。',archive:'全部动态',empty:'此分类暂无动态。',contact:'也可以在 X 上<br>关注最新进展。'},
      pt:{title:'As novidades<br><em>começam aqui</em>',lead:'Lançamentos, atualizações de produtos e anúncios.',archive:'Todas as notícias',empty:'Nenhuma notícia nesta categoria.',contact:'Acompanhe as novidades<br>também no X.'}
    }
  };
  pages.home.ja.hero='<span class="hero-prefix">世界をもっと、</span><em class="hero-impact">便利に</em><span class="hero-impact">面白く</span>';
  pages.home.en.hero='<span class="hero-prefix">Make the world</span><em class="hero-impact">more useful</em><span class="hero-impact">more interesting</span>';
  pages.home.zh.hero='<span class="hero-prefix">让世界更加</span><em class="hero-impact">便利</em><span class="hero-impact">更加有趣</span>';
  pages.home.pt.hero='<span class="hero-prefix">Um mundo mais</span><em class="hero-impact">prático</em><span class="hero-impact">interessante</span>';
  pages.home.ja.j[0]='知恵を得る';
  pages.home.en.j[0]='Gain insight';
  pages.home.zh.j[0]='获取智慧';
  pages.home.pt.j[0]='Ganhar conhecimento';
  pages.home.ja.closing='<span class="closing-line">次の「便利」と「面白い」を、</span><em>つくり続ける。</em>';
  pages.home.en.closing='<span class="closing-line">Keep building the next</span><em>useful and interesting thing.</em>';
  pages.home.zh.closing='<span class="closing-line">继续创造下一个</span><em>便利与有趣。</em>';
  pages.home.pt.closing='<span class="closing-line">Continuar criando o próximo</span><em>prático e interessante.</em>';
  const html=(s,v)=>{const n=document.querySelector(s);if(n&&v)n.innerHTML=v};
  const text=(s,v)=>{const n=document.querySelector(s);if(n&&v)n.textContent=v};
  function applyLanguage(lang=detected){
    window.SITE_LANG=supported.includes(lang)?lang:detected;
    document.documentElement.lang=window.SITE_LANG==='zh'?'zh-CN':window.SITE_LANG;
    const c=common[window.SITE_LANG];
    document.querySelectorAll('.site-header nav a').forEach((n,i)=>n.textContent=c[i]);
    if(document.body.classList.contains('profile-page')||document.body.classList.contains('news-page')) text('.header-cta',c[3]);
    text('[data-locale-indicator]',window.SITE_LANG.toUpperCase());
    document.querySelectorAll('[data-language-link]').forEach(link => {
      const current = link.dataset.languageLink === window.SITE_LANG;
      link.toggleAttribute('aria-current', current);
      link.classList.toggle('is-current', current);
    });
    const page=document.body.classList.contains('profile-page')?'profile':document.body.classList.contains('news-page')?'news':'home';
    const t=pages[page][window.SITE_LANG];
    if(page==='home'){
      html('.hero h1',t.hero);html('.hero-lead',t.lead);html('.hero-actions .button',t.projects);html('.hero-actions .text-link',t.profile);
      document.querySelectorAll('.jump-card h2').forEach((n,i)=>n.innerHTML=t.j[i]);html('.projects-head h2',t.ptitle);text('.projects-head>p',t.plead);text('.section-title h2',t.news);html('.news-more',t.all);html('.closing h2',t.closing);
    }else if(page==='profile'){
      html('.profile-title h1',t.title);text('.profile-title>p:last-child',t.lead);text('.fact:nth-child(3) strong',t.from);text('.fact:nth-child(4) strong',t.favorite);html('.profile-statement blockquote',t.quote);text('.profile-statement>div p',t.statement);html('.method-title h2',t.method);
      document.querySelectorAll('.method-list li').forEach((li,i)=>{li.querySelector('h3').textContent=t.steps[i][0];li.querySelector('p').textContent=t.steps[i][1]});
    }else{html('.news-hero h1',t.title);text('.news-hero-copy>p:last-child',t.lead);text('.archive-head h2',t.archive);text('.news-empty',t.empty);html('.news-contact h2',t.contact)}
    window.dispatchEvent(new CustomEvent('site-language-change',{detail:{lang:window.SITE_LANG}}));
  }
  window.applySiteLanguage=applyLanguage;
  document.addEventListener('DOMContentLoaded',()=>applyLanguage(detected));
})();
