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
  const attributes = content.matchAll(/\b(?:href|src|action)=(["'])(.*?)\1/g);
  for (const match of attributes) {
    const reference = match[2];
    if (!reference || reference.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)) continue;
    const clean = reference.split(/[?#]/, 1)[0];
    if (!clean) continue;
    let target = clean.startsWith('/')
      ? path.join(publicRoot, clean)
      : path.resolve(path.dirname(file), clean);
    if (clean.endsWith('/')) target = path.join(target, 'index.html');
    if (!path.extname(target) && !clean.endsWith('/')) {
      if (await exists(`${target}.html`)) continue;
      target = path.join(target, 'index.html');
    }
    if (!await exists(target)) failures.push(`${relative}: broken local reference: ${reference}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Site validation passed for ${manifest.projects.filter(project => project.hosted).length} hosted projects; Kizi remains external.`);
