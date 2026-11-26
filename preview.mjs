import http from 'node:http';
import { readFile } from 'node:fs/promises';

const assets = {
  '/index.html': 'text/html',
  '/styles.css': 'text/css',
  '/script.js': 'text/javascript',
};
const port = Number(process.env.PORT) || 4174;

http.createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const path = pathname === '/' ? '/index.html' : pathname;
  const type = assets[path];

  if (!type) {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    const content = await readFile(new URL(path.slice(1), import.meta.url));
    response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` }).end(content);
  } catch {
    response.writeHead(500).end('Could not load the requested file');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}`);
});
