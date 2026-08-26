import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicRoot = path.join(root, 'website');
const manifest = JSON.parse(await readFile(path.join(root, 'projects/manifest.json'), 'utf8'));
const failures = [];
const oldOrigins = [
  'https://awasero-music.pages.dev/',
  'https://easyroo.pages.dev/',
  'https://mcs-manager.pages.dev/',
  'https://md-viewer-pro.pages.dev/',
  'https://media-master.pages.dev/',
  'https://media-master-9o5.pages.dev/',
  'https://mlx-bar.pages.dev/',
  'https://pinechat.pages.dev/',
  'https://tango-pro.pages.dev/',
  'https://vocello-jp.pages.dev/',
  'https://volume-routine.pages.dev/',
  'https://wakaru.pages.dev/',
  'https://oriyu90.github.io/official/',
  'https://rizi-jp.pages.dev/',
];
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt']);
const origin = 'https://studio-rizi.pages.dev';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(target));
    else files.push(target);
  }
  return files;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

for (const project of manifest.projects) {
  const projectRoot = path.join(publicRoot, 'projects', project.slug);
  if (!project.hosted) {
    if (project.slug !== 'kizi' || project.url !== 'https://kizi.pages.dev/') {
      failures.push('Kizi must remain the independent exception');
    }
    continue;
  }

  const index = path.join(projectRoot, 'index.html');
  if (!await exists(index)) {
    failures.push(`${project.slug}: index.html is missing`);
    continue;
  }
  const html = await readFile(index, 'utf8');
  if (!html.includes(project.url)) failures.push(`${project.slug}: canonical project URL is missing from index.html`);
}

for (const file of await walk(publicRoot)) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  const content = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  for (const oldOrigin of oldOrigins) {
    if (content.includes(oldOrigin)) failures.push(`${relative}: old URL remains: ${oldOrigin}`);
  }

  if (path.extname(file).toLowerCase() !== '.html') continue;
  const baseHref = content.match(/<base\s+href=(["'])(.*?)\1/i)?.[2];
  const attributes = content.matchAll(/\b(?:href|src|action)=(["'])(.*?)\1/g);
  for (const match of attributes) {
    const reference = match[2];
    if (!reference || reference.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)) continue;
    const clean = reference.split(/[?#]/, 1)[0];
    if (!clean) continue;
    let target = clean.startsWith('/')
      ? path.join(publicRoot, clean)
      : baseHref?.startsWith('/')
        ? path.join(publicRoot, baseHref.replace(/^\/+/, ''), clean)
      : path.resolve(path.dirname(file), clean);
    if (clean.endsWith('/')) target = path.join(target, 'index.html');
    if (!path.extname(target) && !clean.endsWith('/')) {
      if (await exists(`${target}.html`)) continue;
      target = path.join(target, 'index.html');
    }
    if (!await exists(target)) failures.push(`${relative}: broken local reference: ${reference}`);
  }
}

const localeDefinitions = [
  { locale: 'ja', hreflang: 'ja', htmlLang: 'ja', directory: '' },
  { locale: 'en', hreflang: 'en', htmlLang: 'en', directory: 'en' },
  { locale: 'zh', hreflang: 'zh-Hans', htmlLang: 'zh-CN', directory: 'zh' },
  { locale: 'pt', hreflang: 'pt', htmlLang: 'pt', directory: 'pt' }
];
const pageDefinitions = [
  { name: 'home', file: 'index.html', urlPath: '/' },
  { name: 'news', file: 'news.html', urlPath: '/news' },
  { name: 'profile', file: 'profile.html', urlPath: '/profile' }
];
const localizedPages = [];

for (const page of pageDefinitions) {
  for (const locale of localeDefinitions) {
    const prefix = locale.directory ? `/${locale.directory}` : '';
    const canonical = `${origin}${page.name === 'home' ? `${prefix}/` : `${prefix}${page.urlPath}`}`;
    const file = path.join(publicRoot, locale.directory, page.file);
    if (!await exists(file)) {
      failures.push(`${page.name}/${locale.locale}: localized HTML is missing`);
      continue;
    }
    const html = await readFile(file, 'utf8');
    localizedPages.push({ page, locale, canonical, file, html });
    if (!html.includes(`<html lang="${locale.htmlLang}"`)) failures.push(`${page.name}/${locale.locale}: html lang is incorrect`);
    if (!html.includes(`<link rel="canonical" href="${canonical}">`)) failures.push(`${page.name}/${locale.locale}: self canonical is incorrect`);
    if (!/<title>[^<]{10,}<\/title>/.test(html)) failures.push(`${page.name}/${locale.locale}: descriptive title is missing`);
    if (!/<meta name="description" content="[^\"]{50,}">/.test(html)) failures.push(`${page.name}/${locale.locale}: descriptive meta description is missing`);
    if (!html.includes('data-language-link')) failures.push(`${page.name}/${locale.locale}: visible language links are missing`);
    for (const target of localeDefinitions) {
      const targetPrefix = target.directory ? `/${target.directory}` : '';
      const targetUrl = `${origin}${page.name === 'home' ? `${targetPrefix}/` : `${targetPrefix}${page.urlPath}`}`;
      if (!html.includes(`rel="alternate" hreflang="${target.hreflang}" href="${targetUrl}"`)) {
        failures.push(`${page.name}/${locale.locale}: hreflang ${target.hreflang} is missing or incorrect`);
      }
    }
    if (!html.includes('rel="alternate" hreflang="x-default"')) failures.push(`${page.name}/${locale.locale}: x-default is missing`);
    if (page.name === 'home') {
      const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0] || '';
      const socialLinks = [...footer.matchAll(/<a\b[^>]*href="(https:[^"]+)"[^>]*>([^<]+)<\/a>/g)]
        .map(([, url, label]) => ({ url, label }));
      const expectedSocialLinks = [
        { url: 'https://x.com/InovateofRIZI', label: 'X' },
        { url: 'https://kizi.pages.dev/', label: 'KIZI' },
        { url: 'https://github.com/oriyu90', label: 'GitHub' }
      ];
      if (JSON.stringify(socialLinks) !== JSON.stringify(expectedSocialLinks)) {
        failures.push(`${page.name}/${locale.locale}: footer links must be X / KIZI / GitHub in that order`);
      }
      for (const project of manifest.projects) {
        if (!html.includes(`href="${project.url}"`)) failures.push(`${page.name}/${locale.locale}: crawlable project link is missing: ${project.name}`);
      }
    }
    for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(match[1]);
      } catch (error) {
        failures.push(`${path.relative(root, file)}: invalid JSON-LD: ${error.message}`);
      }
    }
  }
}

const sitemap = await readFile(path.join(publicRoot, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) failures.push('sitemap.xml: duplicate URLs');
for (const { canonical } of localizedPages) {
  if (!sitemapUrls.includes(canonical)) failures.push(`sitemap.xml: localized URL is missing: ${canonical}`);
}
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) failures.push('sitemap.xml: xhtml namespace is missing');

const notFound = await readFile(path.join(publicRoot, '404.html'), 'utf8');
if (!notFound.includes('name="robots" content="noindex,follow"')) failures.push('404.html must be noindex,follow');

const indexNowKey = '3f7b54ab9d4f4a1eb8d097f24be0cf62';
const indexNowKeyContents = (await readFile(path.join(publicRoot, `${indexNowKey}.txt`), 'utf8')).trim();
if (indexNowKeyContents !== indexNowKey) failures.push('IndexNow key file is invalid');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Site validation passed for ${manifest.projects.filter(project => project.hosted).length} hosted projects; Kizi remains external.`);
