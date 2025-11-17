#!/usr/bin/env node
/**
 * scripts/fixAllImages.cjs
 *
 * Convenience script to run the typical image fixes in sequence:
 * 1) Normalize filenames (applies changes)
 * 2) Regenerate public image manifests (calls existing script)
 * 3) Sync public/images -> storage/app/public (server-side copy)
 *
 * WARNING: normalization renames files. Review mapping at scripts/image-filename-map.json
 * before running this in production.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

function run(cmd, args, opts = {}) {
  console.log('\n> ' + [cmd].concat(args || []).join(' '));
  const r = spawnSync(cmd, args || [], { stdio: 'inherit', cwd: root, shell: true, ...opts });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}`);
}

try {
  // 1) Normalize (apply)
  run('node', ['scripts/normalizePublicImageFilenames.cjs', '--apply']);

  // 2) Regenerate manifests (uses existing script) - use .cjs copy for CommonJS
  run('node', ['scripts/generatePublicImageManifests.cjs']);

  // 3) Sync to storage
  run('node', ['scripts/syncPublicToStorage.cjs']);

  console.log('\nAll done. Review scripts/image-filename-map.json for changes and re-run check:images.');
} catch (e) {
  console.error('Failed:', e && e.message ? e.message : e);
  process.exit(1);
}
