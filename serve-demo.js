import { serve } from 'bun';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';

const PORT = 8081;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

serve({
  port: PORT,
  async fetch(req) {
    console.log(`${req.method} ${req.url}`);
    
    const url = new URL(req.url);
    let filePath;
    
    // Serve the demo admin HTML (we no longer build the SPA into dist-admin)
    if (url.pathname === '/admin' || url.pathname === '/admin/' || url.pathname === '/' || url.pathname === '') {
      // Serve the developer demo admin page which mounts the custom element
      filePath = './demo/admin.html';
    } else if (url.pathname.startsWith('/admin/')) {
      // Serve any demo subpaths under demo/ for the admin demo
      const subPath = url.pathname.replace('/admin/', '');
      filePath = `./demo/${subPath}`;
    } else if (url.pathname.startsWith('/assets/')) {
      // Static assets from the built dist/ directory
      filePath = `./apps/web/dist${url.pathname}`;
    } else if (url.pathname.startsWith('/demo')) {
      filePath = '.' + url.pathname;
    } else if (url.pathname.startsWith('/apps')) {
      filePath = '.' + url.pathname;
    } else {
      // Try dist-admin first, then demo
      filePath = `./apps/web/dist-admin${url.pathname}`;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = await readFile(filePath);
      return new Response(content, {
        headers: { 'Content-Type': contentType }
      });
    } catch (error) {
      // For SPA routes, serve admin.html (hash routing handles the rest)
      if (!ext || ext === '.html') {
        try {
          const fallback = await readFile('./apps/web/dist-admin/admin.html');
          return new Response(fallback, {
            headers: { 'Content-Type': 'text/html' }
          });
        } catch {
          // Fall through to 404
        }
      }
      
      if (error.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        return new Response('File not found', { status: 404 });
      } else {
        console.error(`Server error: ${error.code}`);
        return new Response(`Server Error: ${error.code}`, { status: 500 });
      }
    }
  }
});

console.log(`\n======================================================`);
console.log(`Demo Server running at: http://localhost:${PORT}`);
console.log(`======================================================`);
console.log(`\nAdmin SPA:       http://localhost:${PORT}/`);
console.log(`Legacy CE demo:  http://localhost:${PORT}/demo/admin.html`);
console.log(`Visitor Widget:  http://localhost:${PORT}/demo/widget.html`);
console.log(`\n(Make sure the API server is running on port 3001)`);
