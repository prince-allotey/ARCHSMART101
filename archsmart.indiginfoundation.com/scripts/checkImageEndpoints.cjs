#!/usr/bin/env node
/**
 * CommonJS copy of checkImageEndpoints for projects using "type": "module"
 */
const fs = require('fs');
const path = require('path');

const BACKEND = process.env.VITE_BACKEND_URL || process.env.BACKEND_ORIGIN || 'http://localhost:8000';
const publicImagesDir = path.resolve(__dirname, '..', 'public', 'images');

const folders = ['blogs', 'properties', 'profile_pictures', 'services', 'smartliving', 'images'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function head(url, timeout = 5000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(id);
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: null, error: e.message || String(e) };
  }
}

async function main() {
  console.log('Backend origin:', BACKEND);
  if (!fs.existsSync(publicImagesDir)) {
    console.error('No public/images directory found at', publicImagesDir);
    process.exit(1);
  }

  const summary = { total: 0, missingLocal: 0, missingBackendMedia: 0, missingBackendStorage: 0, entries: [] };

  for (const folder of folders) {
    const folderPath = path.join(publicImagesDir, folder);
    if (!fs.existsSync(folderPath)) continue;
    const names = fs.readdirSync(folderPath).filter((f) => fs.statSync(path.join(folderPath, f)).isFile());
    for (const name of names) {
      summary.total += 1;
      const localPath = path.join(folderPath, name);
      const rel = `/images/${folder}/${name}`;
      const mediaUrl = `${BACKEND.replace(/\/$/, '')}/api/media/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`;
      const storageUrl = `${BACKEND.replace(/\/$/, '')}/storage/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`;

      const row = { folder, name, rel, localExists: false, media: null, storage: null };
      row.localExists = fs.existsSync(localPath);
      if (!row.localExists) summary.missingLocal += 1;

      // Slight delay to avoid hammering backend
      await sleep(60);
      row.media = await head(mediaUrl);
      if (!row.media.ok) summary.missingBackendMedia += 1;

      await sleep(60);
      row.storage = await head(storageUrl);
      if (!row.storage.ok) summary.missingBackendStorage += 1;

      summary.entries.push(row);
    }
  }

  // Report summary and failing entries
  console.log('\nScan complete');
  console.log(`Total files scanned: ${summary.total}`);
  console.log(`Missing local files (shouldn't happen): ${summary.missingLocal}`);
  console.log(`Backend media HEAD failures: ${summary.missingBackendMedia}`);
  console.log(`Backend storage HEAD failures: ${summary.missingBackendStorage}`);

  const failing = summary.entries.filter((e) => !(e.media && e.media.ok) || !(e.storage && e.storage.ok));
  if (failing.length === 0) {
    console.log('No failing image endpoints detected.');
    process.exit(0);
  }

  console.log('\nFailing entries:');
  for (const f of failing) {
    console.log('---');
    console.log(`folder: ${f.folder}`);
    console.log(`name: ${f.name}`);
    console.log(`local: ${f.localExists ? 'exists' : 'missing'}`);
    console.log(`media HEAD: ${f.media ? f.media.status + (f.media.ok ? ' OK' : ' FAIL') : 'no response'}`);
    console.log(`storage HEAD: ${f.storage ? f.storage.status + (f.storage.ok ? ' OK' : ' FAIL') : 'no response'}`);
  }

  // Exit non-zero to indicate issues
  process.exit(2);
}

main().catch((e) => { console.error(e); process.exit(1); });
