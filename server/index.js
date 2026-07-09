import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const port = Number(process.env.PORT || 4174);
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp']
]);

function sendJson(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const target = path.normalize(path.join(root, decoded === '/' ? 'index.html' : decoded));
  return target.startsWith(root) ? target : null;
}

const server = createServer(async (req, res) => {
  if (req.url === '/api/health') {
    sendJson(res, 200, { ok: true, mode: 'node-static-data' });
    return;
  }

  const target = safePath(req.url || '/');
  if (!target) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  try {
    const file = await readFile(target);
    res.writeHead(200, { 'content-type': types.get(path.extname(target)) || 'application/octet-stream' });
    res.end(file);
  } catch {
    createReadStream(path.join(root, 'index.html'))
      .on('error', () => sendJson(res, 404, { error: 'Not found' }))
      .pipe(res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }));
  }
});

server.listen(port, () => {
  console.log(`Meal Prep Optimizer running at http://localhost:${port}`);
});
