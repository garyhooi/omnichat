const http = require('http');
const fs = require('fs');
const path = require('path');

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

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Clean URL and handle root path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './demo/admin.html';
  } else if (filePath.startsWith('./demo') || filePath.startsWith('./apps')) {
    // Valid path
  } else {
    // Default to resolving in demo folder if not specified
    filePath = './demo' + req.url;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        res.writeHead(404);
        res.end('File not found');
      } else {
        console.error(`Server error: ${error.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Demo Server running at: http://localhost:${PORT}`);
  console.log(`======================================================`);
  console.log(`\nTo test HttpOnly cookies securely, open these URLs in your browser:`);
  console.log(`- Admin Dashboard: http://localhost:${PORT}/demo/admin.html`);
  console.log(`- Visitor Widget:  http://localhost:${PORT}/demo/widget.html`);
  console.log(`\n(Make sure the API server is running on port 3001)`);
});
