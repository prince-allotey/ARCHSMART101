const fs = require('fs');
const path = require('path');

// Folders under public/images to scan
const FOLDERS = [
  'blogs',
  'properties',
  'profile_pictures',
  'services',
  'smartliving',
  'images'
];

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const outDir = path.join(__dirname, '..', 'src', 'data');

function listFilesIn(folder) {
  const dir = path.join(publicImagesDir, folder);
  if (!fs.existsSync(dir)) return [];
  try {
    return fs.readdirSync(dir).filter(f => {
      if (f.startsWith('.')) return false;
      const stat = fs.statSync(path.join(dir, f));
      return stat.isFile();
    });
  } catch (e) {
    console.error('Failed to read folder', dir, e.message || e);
    return [];
  }
}

function writeManifest(folder, files) {
  const safeName = folder.replace(/[^a-z0-9]/gi, '_');
  const outFile = path.join(outDir, `public${safeName.charAt(0).toUpperCase() + safeName.slice(1)}Images.json`);
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(files, null, 2));
    console.log('Wrote manifest for', folder, '->', outFile);
  } catch (e) {
    console.error('Failed to write manifest', outFile, e.message || e);
  }
}

function main() {
  console.log('Scanning public/images for manifests...');
  FOLDERS.forEach(folder => {
    const files = listFilesIn(folder);
    writeManifest(folder, files);
  });
  console.log('Done.');
}

main();
