import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const app = await readFile(new URL('../website/app.js',import.meta.url),'utf8');
const content = await readFile(new URL('../website/content.js',import.meta.url),'utf8');
const responsive = await readFile(new URL('../website/responsive.css',import.meta.url),'utf8');

test('compact-card styles retain descriptions and decorative labels',()=>{
  assert.doesNotMatch(responsive,/\.project-(?:desc|count|open)\s*\{[^}]*display\s*:\s*none/);
  assert.match(responsive,/\.project-desc\{display:-webkit-box/);
  for(const part of ['count','open']) assert.match(responsive,new RegExp(`\\.project-${part}\\{display:block`));
  assert.match(responsive,/-webkit-line-clamp:3/);
});

// A small DOM fixture tests application state; actual CSS geometry is checked in a browser.
function fixture() {
  class Element {
    constructor() {
      this.attributes = {};
      this.dataset = {};
      this.style = {setProperty:(key,value)=>{this.style[key]=value;}};
      this.events = {};
      this.children = [];
      const classes = new Set();
      this.classList = {
        contains:key=>classes.has(key),
        remove:(...keys)=>keys.forEach(key=>classes.delete(key)),
        toggle:(key,on)=>on ? classes.add(key) : classes.delete(key)
      };
    }
    set innerHTML(value) { this.html=value; this.children=[]; }
    get innerHTML() { return this.html || ''; }
    setAttribute(key,value) { this.attributes[key]=value; }
    toggleAttribute(key,on) { if(on)this.attributes[key]='';else delete this.attributes[key]; }
    addEventListener(key,handler) { this.events[key]=handler; }
    fire(key,event={}) { this.events[key]?.({target:this,...event}); }
    querySelector() { return this.label; }
    querySelectorAll() { return this.children; }
    append(child) { this.children.push(child); }
    getBoundingClientRect() { return {top:0}; }
    focus() {}
    blur() {}
    showModal() { this.open=true; }
    close() { this.open=false; }
  }
  const selectors = ['#project-grid','#project-grid-shell','#project-search-input','#project-search-count','#project-fold-toggle','#project-view-toggle','#project-dialog','#dialog-content','.dialog-close'];
  const elements = Object.fromEntries(selectors.map(key=>[key,new Element()]));
  const grid=elements['#project-grid'], shell=elements['#project-grid-shell'];
  const toggle=elements['#project-view-toggle'];
  toggle.children=['cards','list'].map(view=>{
    const icon=new Element();
    icon.dataset.viewIcon=view;
    return icon;
  });
  const root=new Element(), frames=[], events={};
  const win={innerWidth:1200,innerHeight:800,SITE_LANG:'ja',addEventListener:(key,handler)=>{events[key]=handler;},scrollBy(){}};
  win.siteText=value=>typeof value==='string' ? value : value[win.SITE_LANG];
  const columns=()=>shell.classList.contains('is-list') ? 1 : win.innerWidth<600 ? 2 : 3;
  Object.defineProperty(grid,'scrollHeight',{get:()=>Math.ceil(grid.children.length/columns())*120});
  const document={
    documentElement:root,
    querySelector:key=>elements[key] || null,
    querySelectorAll:()=>[],
    createElement:()=>{
      const card=new Element();
      Object.defineProperties(card,{
        offsetTop:{get:()=>Math.floor(grid.children.indexOf(card)/columns())*120},
        offsetHeight:{get:()=>110}
      });
      return card;
    }
  };
  let clock=0;
  const context=vm.createContext({window:win,document,matchMedia:()=>({matches:true}),
    requestAnimationFrame:callback=>{frames.push(callback);return frames.length;},
    cancelAnimationFrame(){},performance:{now:()=>clock+=1000},setTimeout(){}});
  vm.runInContext(content,context);
  context.SITE_CONTENT=win.SITE_CONTENT;
  vm.runInContext(app,context);
  const flush=()=>{let budget=30;while(frames.length && budget--)frames.shift()(clock+=1000);assert.ok(budget>0,'animation queue settles');};
  flush();
  return {elements,grid,shell,toggle,win,root,events,flush,
    switchTo:view=>{if(toggle.dataset.nextView===view)toggle.fire('click');flush();},
    search:query=>{elements['#project-search-input'].value=query;elements['#project-search-input'].fire('input');flush();}};
}

test('portrait density decreases smoothly, with readable lower and landscape upper bounds',()=>{
  const f=fixture();
  const scales=[500,800,1000,1600,2400].map(height=>{
    f.win.innerWidth=800;f.win.innerHeight=height;f.events.resize();f.flush();
    return Number(f.root.style['--card-scale']);
  });
  assert.equal(scales[0],1);
  assert.equal(scales.at(-1),.68);
  assert.ok(scales.every((value,index)=>index===0 || value<=scales[index-1]));
  assert.ok(scales[1]>scales[2]);
});

test('list shows all matches and restores the collapsed card view',()=>{
  const f=fixture(), fold=f.elements['#project-fold-toggle'];
  assert.equal(f.grid.children.filter(c=>c.tabIndex===0).length,3);
  f.switchTo('list');
  assert.ok(fold.hidden);
  assert.equal(f.grid.style.maxHeight,'none');
  assert.ok(f.grid.children.every(c=>c.tabIndex===0 && c.attributes['aria-hidden']==='false'));
  assert.equal(f.toggle.dataset.nextView,'cards');
  assert.equal(f.toggle.attributes['aria-label'],'カード表示に切り替える');
  assert.ok('hidden' in f.toggle.children.find(i=>i.dataset.viewIcon==='list').attributes);
  assert.ok(!('hidden' in f.toggle.children.find(i=>i.dataset.viewIcon==='cards').attributes));
  f.switchTo('cards');
  assert.ok(!fold.hidden);
  assert.ok(f.shell.classList.contains('is-collapsed'));
  assert.equal(f.grid.children.filter(c=>c.tabIndex===0).length,3);
});

test('expanded cards stay expanded after a round trip through list mode',()=>{
  const f=fixture();
  f.elements['#project-fold-toggle'].fire('click');f.flush();
  f.switchTo('list');f.switchTo('cards');
  assert.equal(f.elements['#project-fold-toggle'].attributes['aria-expanded'],'true');
  assert.ok(f.grid.children.every(c=>c.tabIndex===0));
});

test('portrait cards expose three rows, square windows two, and landscape one',()=>{
  const f=fixture();
  for(const [height,visible] of [[1600,9],[1200,6],[800,3]]){
    f.win.innerHeight=height;f.events.resize();f.flush();
    assert.equal(f.grid.children.filter(card=>card.tabIndex===0).length,visible);
  }
});

test('search, no-results, and resizing work in either view without losing the query',()=>{
  const f=fixture();
  f.search('Tango');
  const card=f.grid.children[0];
  f.switchTo('list');
  assert.equal(f.grid.children.length,1);
  assert.equal(f.grid.children[0],card);
  f.win.innerWidth=390;f.win.innerHeight=844;f.events.resize();f.flush();
  assert.ok(f.shell.classList.contains('is-list'));
  f.search('no-matching-project-987');
  assert.equal(f.grid.children.length,0);
  assert.match(f.grid.innerHTML,/該当するプロジェクトはありません/);
  f.switchTo('cards');
  assert.ok(f.elements['#project-fold-toggle'].hidden);
  f.search('');
  assert.equal(f.grid.children.length,f.win.SITE_CONTENT.projects.length);
  assert.equal(f.grid.children.filter(c=>c.tabIndex===0).length,6);
});

test('language changes retain list mode and localize the switch',()=>{
  const f=fixture();
  f.switchTo('list');f.search('Tango');
  f.win.SITE_LANG='pt';f.events['site-language-change']();f.flush();
  assert.equal(f.toggle.attributes['aria-label'],'Mudar para cartões');
  assert.equal(f.toggle.attributes.title,'Mudar para cartões');
  assert.ok(f.shell.classList.contains('is-list'));
  assert.equal(f.grid.children.length,1);
});

test('list entries keep the detail dialog and modified-click link behavior',()=>{
  const f=fixture();f.switchTo('list');
  const card=f.grid.children[0], dialog=f.elements['#project-dialog'];
  let prevented=false;
  card.fire('click',{button:0,ctrlKey:true,preventDefault:()=>{prevented=true;}});
  assert.ok(!prevented && !dialog.open);
  card.fire('click',{button:0,preventDefault:()=>{prevented=true;}});
  assert.ok(prevented && dialog.open);
  assert.match(f.elements['#dialog-content'].innerHTML,/Awasero Music/);
  f.elements['.dialog-close'].fire('click');assert.equal(dialog.open,false);
});
