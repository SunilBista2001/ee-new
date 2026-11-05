/**
 * Serves the frozen React (Vite) build in `.reference/react-dist` so Playwright can
 * compare the Next.js migration against it. No dependencies: Node's http module only.
 *
 *   node scripts/serve-reference.mjs [port]   (default 5173)
 *
 * The reference build is produced from the `react-approved-v1` git tag:
 *   git worktree add .reference/react-src react-approved-v1
 *   (cd .reference/react-src && npm ci && npm run build)
 *   cp -R .reference/react-src/dist .reference/react-dist
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../.reference/react-dist');
const port = Number(process.argv[2] ?? process.env.PORT ?? 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

if (!existsSync(join(root, 'index.html'))) {
  console.error(`Reference build not found at ${root}. See the header of this file.`);
  process.exit(1);
}

createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
  let file = join(root, path);
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Reference build on http://localhost:${port}`));
