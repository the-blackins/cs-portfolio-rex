const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const routes = new Map([
  ['/', 'index.html'],
  ['/contact', 'contact/index.html'],
  ['/work/wazuh-endpoint-monitoring', 'work/wazuh-endpoint-monitoring/index.html'],
  ['/work/identity-lifecycle-management', 'work/identity-lifecycle-management/index.html'],
  ['/work/attack-surface-vulnerability-research', 'work/attack-surface-vulnerability-research/index.html'],
]);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8', '.ico': 'image/x-icon' };

function serve(request, response) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('Bad request'); return; }
  const route = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const relative = routes.get(route) || route.replace(/^\//, '');
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) { response.writeHead(403); response.end('Forbidden'); return; }
  fs.stat(resolved, (error, stat) => {
    if (error || !stat.isFile()) {
      const notFound = path.join(root, '404.html');
      fs.readFile(notFound, (readError, data) => {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(readError ? 'Not found' : data);
      });
      return;
    }
    const headers = { 'Content-Type': types[path.extname(resolved).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' };
    if (path.extname(resolved).toLowerCase() === '.mp4') {
      headers['Accept-Ranges'] = 'bytes';
      const match = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '');
      if (match) {
        const start = Number(match[1]);
        const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
        if (start >= stat.size || end < start) {
          response.writeHead(416, { ...headers, 'Content-Range': `bytes */${stat.size}` });
          response.end();
          return;
        }
        response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
        fs.createReadStream(resolved, { start, end }).pipe(response);
        return;
      }
    }
    response.writeHead(200, { ...headers, 'Content-Length': stat.size });
    fs.createReadStream(resolved).pipe(response);
  });
}

const specifiedPort = Number(process.env.PORT);
let port = Number.isInteger(specifiedPort) && specifiedPort > 0 ? specifiedPort : 4173;
function listen() {
  const server = http.createServer(serve);
  server.on('error', error => {
    if (error.code === 'EADDRINUSE' && !specifiedPort) { port += 1; listen(); }
    else { console.error(error); process.exitCode = 1; }
  });
  server.listen(port, '127.0.0.1', () => console.log(`Rex portfolio preview: http://127.0.0.1:${port}`));
}
listen();
