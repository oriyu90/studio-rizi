const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const darkMode = matchMedia('(prefers-color-scheme: dark)');

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
  ja:{open:'OPEN ↗',project:'PROJECT',visit:'公式サイトへ',related:'関連ページを開く',search:'プロジェクトを検索',showAll:'すべてのプロジェクトを見る ↓',collapse:'1行に折りたたむ ↑',empty:'該当するプロジェクトはありません',count:'{count} PROJECTS',countOne:'1 PROJECT'},
  en:{open:'OPEN ↗',project:'PROJECT',visit:'Visit website',related:'Open related page',search:'Search projects',showAll:'View all projects ↓',collapse:'Collapse to one row ↑',empty:'No projects found',count:'{count} PROJECTS',countOne:'1 PROJECT'},
  zh:{open:'打开 ↗',project:'项目',visit:'访问官方网站',related:'打开相关页面',search:'搜索项目',showAll:'查看全部项目 ↓',collapse:'收起为一行 ↑',empty:'没有符合条件的项目',count:'{count} 个项目'},
  pt:{open:'ABRIR ↗',project:'PROJETO',visit:'Visitar site',related:'Abrir página relacionada',search:'Buscar projetos',showAll:'Ver todos os projetos ↓',collapse:'Recolher para uma linha ↑',empty:'Nenhum projeto encontrado',count:'{count} PROJETOS',countOne:'1 PROJETO'}
};
const label = key => labels[window.SITE_LANG || 'en'][key];
const grid = document.querySelector('#project-grid');
const gridShell = document.querySelector('#project-grid-shell');
const projectSearch = document.querySelector('#project-search-input');
const projectSearchCount = document.querySelector('#project-search-count');
const projectFoldToggle = document.querySelector('#project-fold-toggle');
const dialog = document.querySelector('#project-dialog');
let projectQuery = '';
let projectsExpanded = false;
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
  const cards = [...grid.querySelectorAll('.project-card')];
  if (!cards.length) {
    grid.style.maxHeight = 'none';
    gridShell.classList.remove('has-overflow','is-collapsed');
    projectFoldToggle.hidden = true;
    return;
  }
  const firstTop = cards[0].offsetTop;
  const firstRow = cards.filter(card => Math.abs(card.offsetTop - firstTop) < 2);
  const firstRowBottom = Math.max(...firstRow.map(card => card.offsetTop + card.offsetHeight));
  const hasOverflow = cards.some(card => card.offsetTop > firstTop + 2);
  gridShell.classList.toggle('has-overflow',hasOverflow);
  gridShell.classList.toggle('is-collapsed',hasOverflow && !projectsExpanded);
  projectFoldToggle.hidden = !hasOverflow;
  projectFoldToggle.setAttribute('aria-expanded',String(hasOverflow && projectsExpanded));
  projectFoldToggle.textContent = projectsExpanded ? label('collapse') : label('showAll');
  grid.style.maxHeight = hasOverflow ? `${projectsExpanded ? grid.scrollHeight : firstRowBottom + 120}px` : 'none';
  cards.forEach(card => {
    const folded = hasOverflow && !projectsExpanded && card.offsetTop > firstTop + 2;
    card.tabIndex = folded ? -1 : 0;
    card.setAttribute('aria-hidden',String(folded));
  });
}

function renderProjects() {
  if (!grid || !window.SITE_CONTENT) return;
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
    card.innerHTML = `<span class="project-count">${String(index+1).padStart(2,'0')}</span><span class="project-icon">${project.code}</span><span class="project-name">${project.name}</span><span class="project-desc">${description}</span><span class="platforms">${project.platforms.map(p=>`<i>${p}</i>`).join('')}</span><span class="project-open">${label('open')}</span>`;
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
  projectResizeFrame = requestAnimationFrame(updateProjectFold);
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
    article.innerHTML=`<time>${item.date}</time><span>${item.tag}</span><div><h3>${title}</h3>${summary?`<p>${summary}</p>`:''}</div>${item.url?`<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${title}: ${label('related')}">↗</a>`:'<i>—</i>'}`;
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
