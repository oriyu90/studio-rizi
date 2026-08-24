import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://studio-rizi.pages.dev';
const key = '3f7b54ab9d4f4a1eb8d097f24be0cf62';
const keyLocation = `${origin}/${key}.txt`;
const args = process.argv.slice(2);

function urlForHtml(relative) {
  const normalized = relative.replaceAll(path.sep, '/').replace(/^website\//, '');
  if (!normalized.endsWith('.html') || normalized === '404.html') return null;
  if (normalized === 'index.html') return `${origin}/`;
  if (normalized.endsWith('/index.html')) return `${origin}/${normalized.slice(0, -'index.html'.length)}`;
  return `${origin}/${normalized.slice(0, -'.html'.length)}`;
}

async function allSitemapUrls() {
  const sitemap = await readFile(path.join(root, 'website/sitemap.xml'), 'utf8');
  return [...sitemap.matchAll(/<loc>(https:\/\/studio-rizi\.pages\.dev[^<]*)<\/loc>/g)].map(match => match[1]);
}

async function changedUrls(before, after) {
  if (!before || !after || /^0+$/.test(before)) return allSitemapUrls();
  const output = execFileSync('git', ['diff', '--name-only', before, after, '--', 'website', 'projects/manifest.json'], { cwd: root, encoding: 'utf8' });
  const files = output.trim().split('\n').filter(Boolean);
  const urls = new Set(files.map(urlForHtml).filter(Boolean));
  const sharedContentChanged = files.some(file => /^(?:website\/(?:app|content|i18n)\.js|projects\/manifest\.json)$/.test(file));
  if (sharedContentChanged) {
    for (const locale of ['', 'en/', 'zh/', 'pt/']) {
      urls.add(`${origin}/${locale}`);
      urls.add(`${origin}/${locale}news`);
      urls.add(`${origin}/${locale}profile`);
    }
  }
  return [...urls];
}

const urlList = args[0] === '--all' ? await allSitemapUrls() : await changedUrls(args[0], args[1]);
if (!urlList.length) {
  console.log('No changed indexable URLs to submit to IndexNow.');
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'studio-rizi.pages.dev', key, keyLocation, urlList })
});

if (!response.ok) throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
console.log(`Submitted ${urlList.length} changed URLs to IndexNow (${response.status}).`);
