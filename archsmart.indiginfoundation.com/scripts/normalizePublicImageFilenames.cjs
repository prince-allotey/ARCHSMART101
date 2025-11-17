#!/usr/bin/env node
/**
 * CommonJS copy of normalizePublicImageFilenames for projects using "type": "module"
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const imagesDir = path.join(root, 'public', 'images');
const mapFile = path.join(__dirname, 'image-filename-map.json');

const args = process.argv.slice(2);
const apply = args.includes('--apply');

if (!fs.existsSync(imagesDir)) {
  console.error('public/images directory not found:', imagesDir);
  process.exit(1);
}

const folders = fs.readdirSync(imagesDir).filter((n) => fs.statSync(path.join(imagesDir, n)).isDirectory());

const normalize = (name) => {
  // Trim, lower-case, replace spaces with '-', remove control chars, collapse multiple dashes
  let n = name.trim();
  // Keep extension
  const ext = path.extname(n);
  const base = path.basename(n, ext);
  let safe = base.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '');
  if (!safe) safe = 'file';
  return `${safe}${ext.toLowerCase()}`;
};

const mapping = [];

for (const folder of folders) {
  const dir = path.join(imagesDir, folder);
  const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile());
  for (const f of files) {
    const normalized = normalize(f);
    if (normalized !== f) {
      const src = path.join(dir, f);
      const dst = path.join(dir, normalized);
      let finalDst = dst;
      // Avoid overwriting an existing file: find a unique suffix
      let i = 1;
      while (fs.existsSync(finalDst)) {
        const nameOnly = path.basename(normalized, path.extname(normalized));
        finalDst = path.join(dir, `${nameOnly}-${i}${path.extname(normalized)}`);
        i += 1;
      }
      mapping.push({ folder, original: f, normalized: path.basename(finalDst), src, dst: finalDst });
    }
  }
}

if (mapping.length === 0) {
  console.log('No filenames require normalization.');
  process.exit(0);
}

console.log('Proposed filename changes:');
mapping.forEach((m) => console.log(`${m.folder}/${m.original} -> ${m.folder}/${m.normalized}`));

fs.writeFileSync(mapFile, JSON.stringify({ applied: !!apply, timestamp: new Date().toISOString(), mapping }, null, 2));
console.log('\nWrote mapping to', mapFile);

if (apply) {
  console.log('\nApplying changes...');
  for (const m of mapping) {
    try {
      fs.renameSync(m.src, m.dst);
      console.log(`Renamed ${m.folder}/${m.original} -> ${m.folder}/${m.normalized}`);
    } catch (e) {
      console.error('Failed to rename', m.src, e.message || e);
    }
  }
  console.log('Done.');
} else {
  console.log('\nDry-run only. To apply changes run: node scripts/normalizePublicImageFilenames.js --apply');
}
