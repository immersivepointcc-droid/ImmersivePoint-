const http = require('http');
const fs = require('fs');
const path = require('path');
const { PeerServer } = require('peer');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PEER_PORT = parseInt(process.env.PEER_PORT, 10) || 9000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
};

const SPA_ROUTES = [
  '/dashboard/',
  '/spark/',
  '/passport/',
  '/crm/',
  '/vendors/',
  '/cast/',
  '/j/',
];

function resolveFile(urlPath) {
  // Exact file match
  const exact = path.join(ROOT, urlPath);
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return exact;

  // Directory → index.html
  const dirIndex = path.join(ROOT, urlPath, 'index.html');
  if (fs.existsSync(dirIndex)) return dirIndex;

  // SPA fallback — find matching module
  for (const route of SPA_ROUTES) {
    if (urlPath.startsWith(route)) {
      return path.join(ROOT, route, 'index.html');
    }
  }

  // /p/* → passport SPA
  if (urlPath.startsWith('/p/')) {
    return path.join(ROOT, 'passport', 'index.html');
  }

  // Root fallback
  return path.join(ROOT, 'index.html');
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);

  // Skip server internals
  if (urlPath === '/server.js' || urlPath === '/package.json' || urlPath.startsWith('/node_modules/')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const filePath = resolveFile(urlPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 — Not Found</h1>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    const headers = {
      'Content-Type': contentType,
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    if (ext === '.html') {
      headers['Content-Security-Policy'] = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' ws://localhost:9000 https://script.google.com https://script.googleusercontent.com",
      ].join('; ');
    }
    res.writeHead(200, headers);
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Start PeerJS signaling server
const peerServer = PeerServer({
  port: PEER_PORT,
  host: '0.0.0.0',
  path: '/peer',
  allow_discovery: false,
});

peerServer.on('connection', (client) => {
  console.log(`[PeerJS] Peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`[PeerJS] Peer disconnected: ${client.getId()}`);
});

server.listen(PORT, () => {
  const localIP = getLocalIP();
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║        IMMERSIVEPOINT  —  LOCAL SERVER       ║');
  console.log('  ╠══════════════════════════════════════════════╣');
  console.log(`  ║  Platform:  http://localhost:${PORT}             ║`);
  if (localIP) {
    const padded = `http://${localIP}:${PORT}`;
    console.log(`  ║  Network:   ${padded.padEnd(33)}║`);
  }
  console.log(`  ║  PeerJS:    ws://localhost:${PEER_PORT}/peer           ║`);
  console.log('  ║                                              ║');
  console.log('  ║  Cast Hub:  /cast/                           ║');
  if (localIP) {
    console.log(`  ║  Headset:   http://${localIP}:${PORT}/cast/#join=CODE ║`);
  }
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
});

function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}
