import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base='https://studio-rizi.pages.dev/projects/orita-kitchen/';
const locales=['ja','en','zh','pt'];
const pageUrl=(locale,article)=>base+(locale==='ja'?'':`${locale}/`)+(article?'recipes/cold-udon/':'');

test('recipe and home pages expose complete translations and self canonicals in initial HTML',()=>{
  for(const locale of locales)for(const article of [false,true]){
    const file='website/projects/orita-kitchen/'+(locale==='ja'?'':`${locale}/`)+(article?'recipes/cold-udon/':'')+'index.html';
    const html=readFileSync(file,'utf8');
    assert.ok(html.includes(`<link rel="canonical" href="${pageUrl(locale,article)}">`));
    for(const other of locales)assert.ok(html.includes(`href="${pageUrl(other,article)}"`));
    if(article){assert.equal((html.match(/class="sauce-card"/g)||[]).length,5);assert.equal((html.match(/<li><span>/g)||[]).length,5);}
    const ld=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
    assert.equal(ld.url,pageUrl(locale,article));
    if(article)assert.equal(ld.recipeInstructions.length,5);
  }
});

test('nested recipe sitemap alternates point to the recipe in each language, never the homepage',()=>{
  const xml=readFileSync('website/sitemap.xml','utf8');
  for(const locale of locales){
    const entry=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match=>match[1]).find(entry=>entry.includes(`<loc>${pageUrl(locale,true)}</loc>`));
    assert.ok(entry,'recipe is discoverable');
    for(const target of locales)assert.ok(entry.includes(`href="${pageUrl(target,true)}"`));
    assert.equal((entry.match(/<xhtml:link /g)||[]).length,5);
    for(const target of locales)assert.ok(!entry.includes(`href="${pageUrl(target,false)}"`));
  }
});

test('the original five sauce formulas and optional toppings remain in the Japanese recipe',()=>{
  const html=readFileSync('website/projects/orita-kitchen/recipes/cold-udon/index.html','utf8');
  const cards=[...html.matchAll(/<div class="sauce-card"[\s\S]*?<\/dl><p class="sauce-note">[\s\S]*?<\/p><\/div>/g)].map(match=>match[0]);
  const ratios=cards.map(card=>[...card.matchAll(/<dd>([^<]+)<\/dd>/g)].map(match=>match[1]));
  assert.deepEqual(ratios,[['10','10','1'],['3','1','1','1','0.3–1'],['2','3','1','1'],['2','3','1','0.3–1','1','1'],['2','2','1','2','1']]);
  assert.ok(html.includes('豆板醤や甜麺醤を多めに'));
  assert.ok(html.includes('電子レンジで10秒'));
});
