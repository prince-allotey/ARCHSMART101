#!/usr/bin/env node
/**
 * scripts/syncPublicToStorage.cjs
 *
 * Non-destructive server-side helper to copy files from public/images to
 * storage/app/public/<folder>. Useful when you deploy static images and want
 * them available via Laravel's storage URLs immediately.
 *
 * Run on the server (project root):
 *   node scripts/syncPublicToStorage.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const publicImages = path.join(root, 'public', 'images');
const storageRoot = path.join(root, 'storage', 'app', 'public');

if (!fs.existsSync(publicImages)) {
  console.error('public/images not found at', publicImages);
  process.exit(1);
}

if (!fs.existsSync(storageRoot)) {
  console.error('storage/app/public not found at', storageRoot);
  process.exit(1);
}

const folders = fs.readdirSync(publicImages).filter((n) => fs.statSync(path.join(publicImages, n)).isDirectory());

for (const folder of folders) {
  const srcDir = path.join(publicImages, folder);
  const dstDir = path.join(storageRoot, folder);
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
  const files = fs.readdirSync(srcDir).filter((f) => fs.statSync(path.join(srcDir, f)).isFile());
  for (const f of files) {
    const src = path.join(srcDir, f);
    const dst = path.join(dstDir, f);
    if (!fs.existsSync(dst)) {
      try {
        fs.copyFileSync(src, dst);
        console.log(`Copied ${folder}/${f} -> storage`);
      } catch (e) {
        console.error('Failed to copy', src, e.message || e);
      }
    } else {
      console.log(`Skipped existing ${folder}/${f}`);
    }
  }
}

try {
  // Attempt to set permissive but safe permissions
  execSync(`chmod -R 644 ${path.join(storageRoot)}`);
} catch (e) {
  // ignore chmod errors on Windows or systems without chmod
}

console.log('Sync complete.');
