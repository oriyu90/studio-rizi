(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const data = JSON.parse(document.getElementById('search-data').textContent);
  const dialog = document.querySelector('.search-dialog');
  const field = document.getElementById('recipe-search');
  const results = document.querySelector('.search-results');
  const count = document.querySelector('.search-count');
  function renderSearch() {
    const query = field.value.trim().normalize('NFKC').toLocaleLowerCase();
    const items = data.items.filter(item => `${item.title} ${item.description}`.normalize('NFKC').toLocaleLowerCase().includes(query));
    results.replaceChildren();
    count.textContent = `${items.length} ${data.resultCount}`;
    for (const item of items) {
      const link=document.createElement('a'); link.href=item.url;
      const title=document.createElement('strong'); title.textContent=item.title;
      const description=document.createElement('span'); description.textContent=item.description;
      link.append(title,description); results.append(link);
      link.addEventListener('click',()=>dialog.close());
    }
    if (!items.length) { const text=document.createElement('p'); text.textContent=data.empty; results.append(text); }
  }
  document.querySelectorAll('.search-open').forEach(button => button.addEventListener('click', () => { dialog.showModal(); renderSearch(); field.focus(); }));
  document.querySelector('.search-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  field.addEventListener('input',renderSearch);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    let visible=0;
    document.querySelectorAll('.sauce-card').forEach(card=>{card.hidden=category!=='all'&&!card.dataset.category.split(' ').includes(category);if(!card.hidden)visible++;});
    document.querySelector('.filter-count').textContent=`${visible} ${data.selectedCount}`;
  }));
  // A deep link always reveals its sauce, even after a filter was selected.
  function revealTarget(){const target=document.getElementById(location.hash.slice(1));if(target?.matches('.sauce-card')&&target.hidden){document.querySelector('[data-filter="all"]').click();target.scrollIntoView();}}
  window.addEventListener('hashchange',revealTarget);
  const checks=[...document.querySelectorAll('[data-ingredient]')];
  const key='orita-kitchen-cold-udon-ingredients-v1';
  try {const saved=JSON.parse(localStorage.getItem(key)||'[]');checks.forEach(input=>input.checked=saved.includes(input.dataset.ingredient));} catch { /* Checklist still works if storage is unavailable. */ }
  checks.forEach(input=>input.addEventListener('change',()=>{try{localStorage.setItem(key,JSON.stringify(checks.filter(x=>x.checked).map(x=>x.dataset.ingredient)));}catch{}}));
  document.querySelector('.reset-checks')?.addEventListener('click',()=>{checks.forEach(input=>input.checked=false);try{localStorage.removeItem(key);}catch{}});
  document.querySelector('.print-button')?.addEventListener('click',()=>window.print());
  if (document.querySelector('.toc')) {
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.toc nav a').forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-10% 0px -65% 0px'});
    document.querySelectorAll('.recipe-section').forEach(section=>observer.observe(section));
  }
})();
