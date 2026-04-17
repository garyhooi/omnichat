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
    let filePath = '.' + url.pathname;
    
    if (filePath === './') {
      filePath = './demo/admin.html';
    } else if (filePath.startsWith('./demo') || filePath.startsWith('./apps')) {
      // Valid path
    } else {
      filePath = './demo' + url.pathname;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = await readFile(filePath);
      return new Response(content, {
        headers: { 'Content-Type': contentType }
      });
    } catch (error) {
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
console.log(`🚀 Demo Server running at: http://localhost:${PORT}`);
console.log(`======================================================`);
console.log(`\nTo test HttpOnly cookies securely, open these URLs in your browser:`);
console.log(`- Admin Dashboard: http://localhost:${PORT}/demo/admin.html`);
console.log(`- Visitor Widget:  http://localhost:${PORT}/demo/widget.html`);
console.log(`\n(Make sure the API server is running on port 3001)`);