#!/usr/bin/env node
/**
 * CommonJS copy of generateImageMappingReport for projects using "type": "module"
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const imagesDir = path.join(root, 'public', 'images');
const dataDir = path.join(root, 'src', 'data');

if (!fs.existsSync(imagesDir)) {
  console.error('public/images not found at', imagesDir);
  process.exit(1);
}

const folders = fs.readdirSync(imagesDir).filter((n) => fs.statSync(path.join(imagesDir, n)).isDirectory());

const report = {};

for (const folder of folders) {
  const dir = path.join(imagesDir, folder);
  const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile());
  let manifest = [];
  const manifestPath = path.join(dataDir, `public${folder.charAt(0).toUpperCase() + folder.slice(1)}Images.json`);
  if (fs.existsSync(manifestPath)) {
    try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (e) { manifest = []; }
  }
  const extra = files.filter((f) => !manifest.includes(f));
  const missing = manifest.filter((m) => !files.includes(m));
  report[folder] = { totalFiles: files.length, manifestCount: manifest.length, extra, missing };
}

const out = path.join(__dirname, 'image-mapping-report.json');
fs.writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), report }, null, 2));
console.log('Wrote report to', out);
console.log('Summary:');
Object.keys(report).forEach((k) => {
  console.log(`${k}: files=${report[k].totalFiles}, manifest=${report[k].manifestCount}, extra=${report[k].extra.length}, missing=${report[k].missing.length}`);
});
