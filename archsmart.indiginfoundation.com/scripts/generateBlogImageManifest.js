const fs = require('fs');
const path = require('path');

const publicBlogsDir = path.join(__dirname, '..', 'public', 'images', 'blogs');
const outFile = path.join(__dirname, '..', 'src', 'data', 'publicBlogImages.json');

try {
  if (!fs.existsSync(publicBlogsDir)) {
    console.error('Public blog images directory does not exist:', publicBlogsDir);
    process.exit(1);
  }
  const files = fs.readdirSync(publicBlogsDir).filter(f => !f.startsWith('.') && fs.statSync(path.join(publicBlogsDir, f)).isFile());
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(files, null, 2));
  console.log('Wrote public blog images manifest to', outFile);
} catch (err) {
  console.error('Failed to generate blog image manifest:', err);
  process.exit(2);
}
