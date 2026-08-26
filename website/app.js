const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateCardScale() {
  const ratio = window.innerWidth / Math.max(1,window.innerHeight);
  const scale = .68 + .32 * Math.max(0,Math.min(1,(ratio - .5) / .9));
  document.documentElement.style.setProperty('--card-scale',scale.toFixed(4));
}
updateCardScale();

function updateProjectCount() {
  const count = window.SITE_CONTENT?.projects?.length ?? 0;
  document.querySelectorAll('[data-project-count]').forEach(node => { node.textContent = String(count); });
}
updateProjectCount();

function initIntro() {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  const finish = () => {
    if (intro.dataset.finished) return;
    intro.dataset.finished = 'true';
    intro.classList.add('is-finished');
    document.body.classList.remove('intro-lock');
  };
  if (reduceMotion) { finish(); return; }
  document.body.classList.add('intro-lock');
  const logo = intro.querySelector('[data-intro-dark-logo]');
  if (logo) logo.src = ['ja','zh'].includes(window.SITE_LANG) ? '/logo-JP.jpg' : '/logo-EN.jpg';
  const ready = logo ? Promise.race([logo.decode().catch(()=>{}), new Promise(r=>setTimeout(r,600))]) : Promise.resolve();
  ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-running'))));
  intro.addEventListener('animationend', event => { if (event.target === intro && event.animationName === 'introDismiss') finish(); });
  setTimeout(finish, 2900);
}
initIntro();

document.querySelectorAll('.reveal').forEach(el => {
  if (reduceMotion) return el.classList.add('visible');
  new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.disconnect(); }
  }, {threshold:.12}).observe(el);
});

const labels = {
  ja:{open:'OPEN ↗',project:'PROJECT',visit:'公式サイトへ',related:'関連ページを開く',search:'プロジェクトを検索',showAll:'すべてのプロジェクトを見る ↓',empty:'該当するプロジェクトはありません',count:'{count} PROJECTS',countOne:'1 PROJECT'},
  en:{open:'OPEN ↗',project:'PROJECT',visit:'Visit website',related:'Open related page',search:'Search projects',showAll:'View all projects ↓',empty:'No projects found',count:'{count} PROJECTS',countOne:'1 PROJECT'},
  zh:{open:'打开 ↗',project:'项目',visit:'访问官方网站',related:'打开相关页面',search:'搜索项目',showAll:'查看全部项目 ↓',empty:'没有符合条件的项目',count:'{count} 个项目'},
  pt:{open:'ABRIR ↗',project:'PROJETO',visit:'Visitar site',related:'Abrir página relacionada',search:'Buscar projetos',showAll:'Ver todos os projetos ↓',empty:'Nenhum projeto encontrado',count:'{count} PROJETOS',countOne:'1 PROJETO'}
};
const label = key => labels[window.SITE_LANG || 'en'][key];
const viewLabels = {
  ja:{cards:'カード表示に切り替える',list:'リスト表示に切り替える',collapse:'折りたたむ ↑'},
  en:{cards:'Switch to card view',list:'Switch to list view',collapse:'Show fewer projects ↑'},
  zh:{cards:'切换为卡片视图',list:'切换为列表视图',collapse:'收起项目 ↑'},
  pt:{cards:'Mudar para cartões',list:'Mudar para lista',collapse:'Mostrar menos projetos ↑'}
};
const grid = document.querySelector('#project-grid');
const gridShell = document.querySelector('#project-grid-shell');
const projectSearch = document.querySelector('#project-search-input');
const projectSearchCount = document.querySelector('#project-search-count');
const projectFoldToggle = document.querySelector('#project-fold-toggle');
const projectViewToggle = document.querySelector('#project-view-toggle');
const dialog = document.querySelector('#project-dialog');
let projectQuery = '';
let projectsExpanded = false;
let projectView = 'cards';
let projectResizeFrame = 0;
let projectCollapseFrame = 0;

function keepProjectToggleInPlace(viewportTop) {
  cancelAnimationFrame(projectCollapseFrame);
  const startedAt = performance.now();
  const duration = reduceMotion ? 80 : 620;
  const holdPosition = now => {
    const scrollDelta = projectFoldToggle.getBoundingClientRect().top - viewportTop;
    if (Math.abs(scrollDelta) > .5) {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollBy(0,scrollDelta);
      root.style.scrollBehavior = previousScrollBehavior;
    }
    if (now - startedAt < duration) {
      projectCollapseFrame = requestAnimationFrame(holdPosition);
    } else {
      projectFoldToggle.focus({preventScroll:true});
    }
  };
  projectCollapseFrame = requestAnimationFrame(holdPosition);
}

function updateProjectFold() {
  if (!grid || !gridShell || !projectFoldToggle) return;
  // Measure the grid at its natural height. Constraining the grid itself makes
  // CSS Grid shrink its row tracks while square cards overflow and overlap.
  grid.style.maxHeight = 'none';
  const cards = [...grid.querySelectorAll('.project-card')];
  if (!cards.length || projectView === 'list') {
    gridShell.style.maxHeight = 'none';
    gridShell.classList.remove('has-overflow','is-collapsed');
    projectFoldToggle.hidden = true;
    projectFoldToggle.setAttribute('aria-expanded','false');
    cards.forEach(card => {
      card.tabIndex = 0;
      card.setAttribute('aria-hidden','false');
    });
    return;
  }
  const ratio = window.innerWidth / Math.max(1,window.innerHeight);
  const visibleRowCount = ratio <= .75 ? 3 : ratio <= 1.15 ? 2 : 1;
  const rowTops = [...new Set(cards.map(card => card.offsetTop))].sort((a,b)=>a-b);
  const lastVisibleTop = rowTops[Math.min(visibleRowCount,rowTops.length)-1];
  const visibleCards = cards.filter(card => card.offsetTop <= lastVisibleTop + 2);
  const visibleBottom = Math.max(...visibleCards.map(card => card.offsetTop + card.offsetHeight));
  const hasOverflow = cards.some(card => card.offsetTop > lastVisibleTop + 2);
  gridShell.classList.toggle('has-overflow',hasOverflow);
  gridShell.classList.toggle('is-collapsed',hasOverflow && !projectsExpanded);
  projectFoldToggle.hidden = !hasOverflow;
  projectFoldToggle.setAttribute('aria-expanded',String(hasOverflow && projectsExpanded));
  projectFoldToggle.textContent = projectsExpanded ? viewLabels[window.SITE_LANG || 'en'].collapse : label('showAll');
  // Clip the outer shell instead of the grid so row sizing stays independent.
  const expandedHeight = grid.scrollHeight + (Number(projectFoldToggle.offsetHeight) || 52) + 120;
  gridShell.style.maxHeight = hasOverflow ? `${projectsExpanded ? expandedHeight : visibleBottom + 120}px` : 'none';
  cards.forEach(card => {
    const folded = hasOverflow && !projectsExpanded && card.offsetTop > lastVisibleTop + 2;
    card.tabIndex = folded ? -1 : 0;
    card.setAttribute('aria-hidden',String(folded));
  });
}

function updateProjectView() {
  if (!grid || !gridShell) return;
  const copy = viewLabels[window.SITE_LANG || 'en'];
  gridShell.classList.toggle('is-list',projectView === 'list');
  if (projectViewToggle) {
    const nextView = projectView === 'cards' ? 'list' : 'cards';
    projectViewToggle.hidden = false;
    projectViewToggle.dataset.nextView = nextView;
    projectViewToggle.setAttribute('aria-label',copy[nextView]);
    projectViewToggle.setAttribute('title',copy[nextView]);
    projectViewToggle.querySelectorAll('[data-view-icon]').forEach(icon => {
      icon.toggleAttribute('hidden',icon.dataset.viewIcon !== nextView);
    });
  }
}

function renderProjects() {
  if (!grid || !window.SITE_CONTENT) return;
  updateProjectView();
  grid.innerHTML = '';
  const query = projectQuery.toLocaleLowerCase();
  const filtered = SITE_CONTENT.projects.map((project,index)=>({project,index})).filter(({project}) => {
    const searchable = [project.name,project.code,...project.platforms,...Object.values(project.description)].join(' ').toLocaleLowerCase();
    return !query || searchable.includes(query);
  });
  if (projectSearch) projectSearch.placeholder = label('search');
  if (projectSearchCount) projectSearchCount.textContent = (filtered.length === 1 && label('countOne') ? label('countOne') : label('count').replace('{count}',filtered.length));
  if (!filtered.length) {
    grid.innerHTML = `<p class="project-empty">${label('empty')}</p>`;
    requestAnimationFrame(updateProjectFold);
    return;
  }
  filtered.forEach(({project,index}) => {
    const description = window.siteText(project.description);
    const card = document.createElement('a');
    card.href = project.url;
    card.className = `project-card project-${project.color}`;
    card.innerHTML = `<span class="project-count">${String(index+1).padStart(2,'0')}</span><span class="project-icon">${project.code}</span><span class="project-name">${project.name}</span><span class="project-desc">${description}</span><span class="platforms">${project.platforms.map(p=>`<i>${p}</i>`).join('')}</span><span class="project-open" aria-hidden="true">${label('open')}</span>`;
    card.addEventListener('click',event=>{
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      document.querySelector('#dialog-content').innerHTML = `<span class="dialog-icon project-${project.color}">${project.code}</span><p>${label('project')} / ${String(index+1).padStart(2,'0')}</p><h2>${project.name}</h2><p class="dialog-desc">${description}</p><div class="platforms">${project.platforms.map(p=>`<i>${p}</i>`).join('')}</div><a class="button button-lime" href="${project.url}" target="_blank" rel="noreferrer">${label('visit')} <span>↗</span></a>`;
      dialog.showModal();
    });
    grid.append(card);
  });
  requestAnimationFrame(()=>requestAnimationFrame(updateProjectFold));
}
renderProjects();
projectViewToggle?.addEventListener('click',()=>{
  cancelAnimationFrame(projectCollapseFrame);
  projectView = projectView === 'cards' ? 'list' : 'cards';
  updateProjectView();
  // Keep the query and card expansion state; list mode always shows every match.
  updateProjectFold();
});
if (projectSearch) projectSearch.addEventListener('input',event=>{
  projectQuery = event.target.value.trim();
  projectsExpanded = false;
  renderProjects();
});
if (projectFoldToggle) projectFoldToggle.addEventListener('click',()=>{
  const wasExpanded = projectsExpanded;
  const toggleViewportTop = projectFoldToggle.getBoundingClientRect().top;
  if (wasExpanded) projectFoldToggle.blur();
  projectsExpanded = !projectsExpanded;
  updateProjectFold();
  if (wasExpanded) keepProjectToggleInPlace(toggleViewportTop);
});
window.addEventListener('resize',()=>{
  cancelAnimationFrame(projectResizeFrame);
  projectResizeFrame = requestAnimationFrame(()=>{
    updateCardScale();
    updateProjectFold();
  });
},{passive:true});
if (dialog) {
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}

const newsList = document.querySelector('#news-list');
let activeNewsFilter = 'ALL';
function renderNews(filter=activeNewsFilter) {
  if (!newsList || !window.SITE_CONTENT) return;
  activeNewsFilter = filter;
  const limit = Number(newsList.dataset.limit || Infinity);
  const items = SITE_CONTENT.news.filter(item=>filter==='ALL'||item.tag===filter).slice(0,limit);
  newsList.innerHTML='';
  items.forEach(item=>{
    const title=window.siteText(item.title), summary=window.siteText(item.summary);
    const article=document.createElement('article');
    article.innerHTML=`<time datetime="${item.date.replaceAll('.','-')}">${item.date}</time><span>${item.tag}</span><div><h3>${title}</h3>${summary?`<p>${summary}</p>`:''}</div>${item.url?`<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${title}: ${label('related')}">↗</a>`:'<i>—</i>'}`;
    newsList.append(article);
  });
  document.querySelector('.news-empty')?.toggleAttribute('hidden',items.length>0);
}
renderNews();
document.querySelectorAll('.news-filters button').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.news-filters button').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');renderNews(button.dataset.filter);
}));
window.addEventListener('site-language-change',()=>{renderProjects();renderNews()});
window.addEventListener('scroll',()=>document.querySelector('.site-header')?.classList.toggle('scrolled',scrollY>20),{passive:true});
