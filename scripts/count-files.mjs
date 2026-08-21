import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const publicRoot = path.resolve('website');
const warningLimit = 16_000;

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

const files = await walk(publicRoot);
const hashes = new Map();
for (const file of files) {
  const digest = createHash('sha256').update(await readFile(file)).digest('hex');
  const matches = hashes.get(digest) ?? [];
  matches.push(path.relative(publicRoot, file));
  hashes.set(digest, matches);
}

const duplicates = [...hashes.values()].filter(matches => matches.length > 1);
if (duplicates.length) {
  console.error('Duplicate public files detected:');
  for (const matches of duplicates) console.error(`- ${matches.join(', ')}`);
  process.exit(1);
}
if (files.length > warningLimit) {
  console.error(`Public file count ${files.length} exceeds the safety limit ${warningLimit}.`);
  process.exit(1);
}

console.log(`Public files: ${files.length}/${warningLimit}; duplicate hashes: 0.`);
