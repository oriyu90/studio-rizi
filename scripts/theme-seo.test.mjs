import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const themeScript = await readFile(new URL('../website/theme.js',import.meta.url),'utf8');
function themeFixture(search, dark, legacy = false) {
  const root = {dataset:{}}, meta = {content:''};
  const source = {media:'(prefers-color-scheme: dark)',dataset:{}};
  const events = {}, preference = {matches:dark};
  preference[legacy ? 'addListener' : 'addEventListener'] = (...args)=>{events.change=args.at(-1);};
  const document = {
    documentElement:root,
    querySelectorAll:selector=>selector.startsWith('meta') ? [meta] : [source],
    addEventListener:(event,listener)=>{events[event]=listener;}
  };
  vm.runInNewContext(themeScript,{document,location:{search},URLSearchParams,matchMedia:()=>preference});
  events.DOMContentLoaded();
  return {root,meta,source,preference,change:()=>events.change()};
}

for (const osDark of [false,true]) {
  for (const forced of ['light','dark']) test(`forced ${forced} is consistent with OS dark=${osDark}`,()=>{
    const f=themeFixture(`?theme=${forced}`,osDark);
    assert.equal(f.root.dataset.theme,forced);
    assert.equal(f.source.media,forced==='dark' ? 'all' : 'not all');
    assert.equal(f.meta.content,forced==='dark' ? '#0d100d' : '#ffffff');
    f.preference.matches=!osDark;f.change();
    assert.equal(f.root.dataset.theme,forced);
  });
}
test('automatic theme follows OS changes without disabling native picture queries',()=>{
  const f=themeFixture('?theme=invalid',false);
  assert.equal(f.root.dataset.theme,'light');
  f.preference.matches=true;f.change();assert.equal(f.root.dataset.theme,'dark');
  f.preference.matches=false;f.change();assert.equal(f.root.dataset.theme,'light');
  assert.equal(f.source.media,'(prefers-color-scheme: dark)');
});
test('older MediaQueryList listeners remain supported',()=>{
  const f=themeFixture('',false,true);
  f.preference.matches=true;f.change();assert.equal(f.root.dataset.theme,'dark');
});

const publicRoot = new URL('../website/',import.meta.url);
const image = await readFile(new URL('assets/og-v2.png',publicRoot));
test('shared social image is a real PNG with matching declared dimensions and a bounded payload',()=>{
  assert.equal(image.subarray(1,4).toString(),'PNG');
  assert.equal(image.readUInt32BE(16),1730);
  assert.equal(image.readUInt32BE(20),909);
  assert.ok(image.length < 5 * 1024 * 1024,'keep the asset within the site’s 5 MiB payload budget');
});

const alts = new Set();
for (const locale of ['','en/','zh/','pt/']) {
  for (const page of ['index','news','profile']) {
    test(`static sharing metadata is complete and consistent: ${locale}${page}`,async()=>{
      const html=await readFile(new URL(`${locale}${page}.html`,publicRoot),'utf8');
      const metas=new Map([...html.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)"/g)].map(([,key,value])=>[key,value]));
      for(const key of ['og:title','og:type','og:url','og:description','og:image','og:image:width','og:image:height','og:image:type','og:image:alt','og:locale','twitter:card','twitter:title','twitter:description','twitter:image','twitter:image:alt','twitter:site']) assert.ok(metas.get(key),key);
      assert.equal(metas.get('og:image'),'https://studio-rizi.pages.dev/assets/og-v2.png');
      assert.equal(metas.get('twitter:image'),metas.get('og:image'));
      assert.equal(metas.get('twitter:image:alt'),metas.get('og:image:alt'));
      assert.equal(metas.get('twitter:title'),metas.get('og:title'));
      assert.equal(metas.get('twitter:description'),metas.get('og:description'));
      assert.equal(metas.get('og:image:width'),String(image.readUInt32BE(16)));
      assert.equal(metas.get('og:image:height'),String(image.readUInt32BE(20)));
      assert.equal(metas.get('og:image:type'),'image/png');
      assert.equal(metas.get('twitter:card'),'summary_large_image');
      assert.equal(metas.get('twitter:site'),'@InovateofRIZI');
      assert.equal(metas.get('og:url'),html.match(/<link rel="canonical" href="([^"]+)"/)[1]);
      assert.ok(html.includes('src="theme.js?v=20260827g"'));
      if(page==='index') alts.add(metas.get('og:image:alt'));
      if(page==='news'){
        const dates=[...html.matchAll(/<time datetime="[^"]+">([^<]+)<\/time>/g)].map(([,date])=>date).sort();
        assert.equal(html.match(/<span>LATEST<\/span><b>([^<]+)<\/b>/)[1],dates.at(-1));
      }
    });
  }
}
test('image alternatives are independently localized in all four languages',()=>assert.equal(alts.size,4));
