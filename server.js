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
  '/mobile-ops/',
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

// ── In-memory device registry & room state ──────────────────────────
const deviceRegistry = new Map(); // peerId -> { id, name, type, peerId, status, lastSeen, roomCode }
let activeRoom = null; // { code, facilitatorPeerId, createdAt }
const devicePolicies = new Map(); // policyId -> { id, name, kioskUrl, allowNavigation, autoLaunch, refreshInterval, whitelist }
const commandQueue = new Map(); // peerId -> [{ id, command, payload, createdAt }]

devicePolicies.set('default', {
  id: 'default',
  name: 'Auto-Connect',
  kioskUrl: null,
  allowNavigation: true,
  autoLaunch: true,
  refreshInterval: 0,
  whitelist: [],
  createdAt: new Date().toISOString()
});

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

function jsonResponse(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

// Clean up stale devices every 30 s (remove if lastSeen > 60 s ago)
setInterval(() => {
  const cutoff = Date.now() - 60_000;
  for (const [key, dev] of deviceRegistry) {
    if (dev.lastSeen < cutoff) deviceRegistry.delete(key);
  }
}, 30_000);

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);

  // Skip server internals
  if (urlPath === '/server.js' || urlPath === '/package.json' || urlPath.startsWith('/node_modules/')) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // ── API routes ─────────────────────────────────────────────────────
  if (urlPath.startsWith('/api/')) {
    const method = req.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    // GET /api/devices — list all registered devices
    if (urlPath === '/api/devices' && method === 'GET') {
      const now = Date.now();
      const devices = [...deviceRegistry.values()].map(d => ({
        ...d,
        status: (now - d.lastSeen < 15_000) ? 'online' : 'offline',
      }));
      return jsonResponse(res, devices);
    }

    // POST /api/devices/register — headset registers itself
    if (urlPath === '/api/devices/register' && method === 'POST') {
      const body = await readBody(req);
      const { peerId, name, type, serial, deviceId, policyId } = body;
      if (!peerId) return jsonResponse(res, { error: 'peerId is required' }, 400);
      deviceRegistry.set(peerId, {
        id: deviceId || peerId,
        name: name || 'Unknown Device',
        type: type || 'headset',
        peerId,
        serial: serial || null,
        status: 'online',
        lastSeen: Date.now(),
        roomCode: null,
        policyId: policyId || 'default',
      });
      return jsonResponse(res, { ok: true, peerId });
    }

    // POST /api/devices/heartbeat — periodic heartbeat
    if (urlPath === '/api/devices/heartbeat' && method === 'POST') {
      const body = await readBody(req);
      const { peerId } = body;
      if (!peerId) return jsonResponse(res, { error: 'peerId is required' }, 400);
      const dev = deviceRegistry.get(peerId);
      if (dev) {
        dev.lastSeen = Date.now();
        return jsonResponse(res, { ok: true });
      }
      return jsonResponse(res, { error: 'device not found' }, 404);
    }

    // GET /api/cast/room — return active room
    if (urlPath === '/api/cast/room' && method === 'GET') {
      return jsonResponse(res, activeRoom);
    }

    // POST /api/cast/room — facilitator registers active room
    if (urlPath === '/api/cast/room' && method === 'POST') {
      const body = await readBody(req);
      const { code, facilitatorPeerId } = body;
      if (!code || !facilitatorPeerId) {
        return jsonResponse(res, { error: 'code and facilitatorPeerId are required' }, 400);
      }
      activeRoom = { code, facilitatorPeerId, createdAt: new Date().toISOString() };
      return jsonResponse(res, { ok: true, room: activeRoom });
    }

    // DELETE /api/cast/room — clear active room
    if (urlPath === '/api/cast/room' && method === 'DELETE') {
      activeRoom = null;
      return jsonResponse(res, { ok: true });
    }

    // ── MDM Policy & Command routes ──────────────────────────────────

    // GET /api/policies — list all policies
    if (urlPath === '/api/policies' && method === 'GET') {
      return jsonResponse(res, [...devicePolicies.values()]);
    }

    // POST /api/policies — create or update a policy
    if (urlPath === '/api/policies' && method === 'POST') {
      const body = await readBody(req);
      const id = body.id || Date.now().toString(36);
      const policy = {
        id,
        name: body.name || 'Untitled Policy',
        kioskUrl: body.kioskUrl || null,
        allowNavigation: body.allowNavigation !== undefined ? body.allowNavigation : true,
        autoLaunch: body.autoLaunch !== undefined ? body.autoLaunch : true,
        refreshInterval: body.refreshInterval || 0,
        whitelist: body.whitelist || [],
        createdAt: devicePolicies.has(id) ? devicePolicies.get(id).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      devicePolicies.set(id, policy);
      return jsonResponse(res, policy);
    }

    // POST /api/fleet/command — broadcast command to all online devices
    if (urlPath === '/api/fleet/command' && method === 'POST') {
      const body = await readBody(req);
      const { command, payload } = body;
      const validCommands = ['navigate', 'refresh', 'lock', 'unlock', 'restart', 'set-policy', 'message'];
      if (!command || !validCommands.includes(command)) {
        return jsonResponse(res, { error: 'Invalid command. Valid: ' + validCommands.join(', ') }, 400);
      }
      const now = Date.now();
      let count = 0;
      for (const [peerId] of deviceRegistry) {
        const cmdEntry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), command, payload: payload || null, createdAt: new Date().toISOString() };
        if (!commandQueue.has(peerId)) commandQueue.set(peerId, []);
        commandQueue.get(peerId).push(cmdEntry);
        count++;
      }
      return jsonResponse(res, { ok: true, devicesQueued: count });
    }

    // Routes with path parameters (regex matching)
    const deviceCmdMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/command$/);
    const deviceCmdsMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/commands$/);
    const devicePolicyMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/policy$/);
    const policyDeleteMatch = urlPath.match(/^\/api\/policies\/([^/]+)$/);

    // DELETE /api/policies/:id — delete a policy
    if (policyDeleteMatch && method === 'DELETE') {
      const policyId = policyDeleteMatch[1];
      if (policyId === 'default') {
        return jsonResponse(res, { error: 'Cannot delete the default policy' }, 400);
      }
      if (!devicePolicies.has(policyId)) {
        return jsonResponse(res, { error: 'Policy not found' }, 404);
      }
      devicePolicies.delete(policyId);
      return jsonResponse(res, { ok: true });
    }

    // POST /api/devices/:peerId/command — queue a command for a device
    if (deviceCmdMatch && method === 'POST') {
      const peerId = deviceCmdMatch[1];
      const body = await readBody(req);
      const { command, payload } = body;
      const validCommands = ['navigate', 'refresh', 'lock', 'unlock', 'restart', 'set-policy', 'message'];
      if (!command || !validCommands.includes(command)) {
        return jsonResponse(res, { error: 'Invalid command. Valid: ' + validCommands.join(', ') }, 400);
      }
      const cmdEntry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), command, payload: payload || null, createdAt: new Date().toISOString() };
      if (!commandQueue.has(peerId)) commandQueue.set(peerId, []);
      commandQueue.get(peerId).push(cmdEntry);
      return jsonResponse(res, { ok: true, commandId: cmdEntry.id });
    }

    // GET /api/devices/:peerId/commands — retrieve and drain pending commands
    if (deviceCmdsMatch && method === 'GET') {
      const peerId = deviceCmdsMatch[1];
      const commands = commandQueue.get(peerId) || [];
      commandQueue.delete(peerId);
      return jsonResponse(res, commands);
    }

    // POST /api/devices/:peerId/policy — assign a policy to a device
    if (devicePolicyMatch && method === 'POST') {
      const peerId = devicePolicyMatch[1];
      const body = await readBody(req);
      const { policyId } = body;
      if (!policyId) return jsonResponse(res, { error: 'policyId is required' }, 400);
      const policy = devicePolicies.get(policyId);
      if (!policy) return jsonResponse(res, { error: 'Policy not found' }, 404);
      const dev = deviceRegistry.get(peerId);
      if (!dev) return jsonResponse(res, { error: 'Device not found' }, 404);
      dev.policyId = policyId;
      // Also queue a set-policy command with the full policy as payload
      const cmdEntry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), command: 'set-policy', payload: policy, createdAt: new Date().toISOString() };
      if (!commandQueue.has(peerId)) commandQueue.set(peerId, []);
      commandQueue.get(peerId).push(cmdEntry);
      return jsonResponse(res, { ok: true, policyId });
    }

    // Unknown API route
    return jsonResponse(res, { error: 'Not found' }, 404);
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
    headers['Access-Control-Allow-Origin'] = '*';
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
  const peerId = client.getId();
  console.log(`[PeerJS] Peer connected: ${peerId}`);
  const dev = deviceRegistry.get(peerId);
  if (dev) dev.lastSeen = Date.now();
});

peerServer.on('disconnect', (client) => {
  console.log(`[PeerJS] Peer disconnected: ${client.getId()}`);
  // Don't remove from registry — let heartbeat timeout handle staleness
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
  console.log('  ║  MDM API:   /api/devices, /api/policies     ║');
  console.log('  ║  Cast Hub:  /cast/                           ║');
  if (localIP) {
    const autoUrl = `http://${localIP}:${PORT}/cast/#auto`;
    console.log(`  ║  Auto-Join: ${autoUrl.padEnd(33)}║`);
    console.log('  ║  (Set as headset browser homepage)           ║');
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
