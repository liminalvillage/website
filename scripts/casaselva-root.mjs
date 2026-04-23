import { copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

// quests.html is domain-aware (reads window.location.hostname), so both sites
// can serve it as-is. We only remap the homepage.
const mappings = [
  ['casaselva.html', 'index.html'],
];

for (const [src, dest] of mappings) {
  const srcPath = resolve(dist, src);
  const destPath = resolve(dist, dest);
  if (!existsSync(srcPath)) {
    console.error(`casaselva-root: missing ${srcPath}`);
    process.exit(1);
  }
  copyFileSync(srcPath, destPath);
  console.log(`casaselva-root: ${src} -> ${dest}`);
}
