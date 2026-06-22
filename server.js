const http = require('http');
const fs = require('fs');
const path = require('path');
const { PeerServer } = require('peer');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PEER_PORT = parseInt(process.env.PEER_PORT, 10) || 9000;
const ROOT = __dirname;

// ── Persistent state file ────────────────────────────────────────────
const STATE_FILE = path.join(ROOT, '.mdm-state.json');

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
  '/overlay/',
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
const deviceRegistry = new Map(); // peerId -> { id, name, type, peerId, status, lastSeen, roomCode, ... }
let activeRoom = null; // { code, facilitatorPeerId, createdAt }
const devicePolicies = new Map(); // policyId -> { id, name, kioskUrl, allowNavigation, autoLaunch, refreshInterval, whitelist }
const commandQueue = new Map(); // peerId -> [{ id, command, payload, createdAt }]

// ── New MDM state variables ─────────────────────────────────────────
const deviceGroups = new Map(); // groupId -> { id, name, color, deviceIds: [] }
const auditLog = []; // [{ id, timestamp, action, target, targetName, details, result }]
const alertRules = []; // [{ id, name, type, threshold, enabled, lastTriggered }]
const activeAlerts = []; // [{ id, ruleId, deviceId, deviceName, message, severity, timestamp, acknowledged }]
const scheduledCommands = []; // [{ id, command, payload, targetType, targetId, scheduledAt, executed, createdAt }]
const sessions = []; // [{ id, peerId, deviceName, url, startedAt, endedAt, duration }]

// ── Overlay state (OBS SSE) ────────────────────────────────────────
const overlayData = {
  players: new Map(),
  scoreboard: { title: '', teams: [], clock: '', status: 'idle' },
  activity: new Map(),
  lastUpdate: Date.now()
};
const sseClients = new Set();

function broadcastOverlay(type, payload) {
  overlayData.lastUpdate = Date.now();
  const msg = 'data: ' + JSON.stringify({ type, payload, ts: Date.now() }) + '\n\n';
  for (const client of sseClients) {
    try { client.write(msg); } catch { sseClients.delete(client); }
  }
}

// ── Default policy ──────────────────────────────────────────────────
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

// ── Default alert rules ─────────────────────────────────────────────
alertRules.push(
  { id: 'offline', name: 'Device Offline', type: 'offline', threshold: 30, enabled: true, lastTriggered: null },
  { id: 'low-battery', name: 'Low Battery', type: 'battery', threshold: 20, enabled: true, lastTriggered: null },
  { id: 'storage-full', name: 'Storage Full', type: 'storage', threshold: 90, enabled: true, lastTriggered: null }
);

// ── Persistence ─────────────────────────────────────────────────────
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      if (raw.policies) {
        for (const p of raw.policies) devicePolicies.set(p.id, p);
      }
      if (raw.groups) {
        for (const g of raw.groups) deviceGroups.set(g.id, g);
      }
      if (raw.auditLog) auditLog.push(...raw.auditLog.slice(-500));
      if (raw.alerts) {
        // Merge saved alert rules over defaults
        for (const a of raw.alerts) {
          const idx = alertRules.findIndex(r => r.id === a.id);
          if (idx >= 0) alertRules[idx] = a;
          else alertRules.push(a);
        }
      }
      if (raw.scheduledCommands) scheduledCommands.push(...raw.scheduledCommands);
      console.log('[MDM] Loaded state from disk');
    }
  } catch (e) { console.error('[MDM] Failed to load state:', e.message); }
}

function saveState() {
  try {
    const data = {
      policies: [...devicePolicies.values()],
      groups: [...deviceGroups.values()],
      auditLog: auditLog.slice(-500),
      alerts: alertRules,
      scheduledCommands,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
  } catch (e) { console.error('[MDM] Failed to save state:', e.message); }
}

let _saveTimer = null;
function debouncedSave() {
  if (_saveTimer) return;
  _saveTimer = setTimeout(() => { _saveTimer = null; saveState(); }, 1000);
}

// Load persisted state
loadState();

// ── Audit helper ────────────────────────────────────────────────────
function audit(action, target, targetName, details, result = 'ok') {
  auditLog.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    action, target, targetName, details, result
  });
  if (auditLog.length > 1000) auditLog.splice(0, auditLog.length - 500);
  debouncedSave();
}

// ── Helpers ─────────────────────────────────────────────────────────
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

// ── Alert Check Engine (every 15 s) ────────────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [peerId, dev] of deviceRegistry) {
    // Offline check
    const offlineRule = alertRules.find(r => r.id === 'offline' && r.enabled);
    if (offlineRule && (now - dev.lastSeen > offlineRule.threshold * 1000)) {
      const existing = activeAlerts.find(a => a.ruleId === 'offline' && a.deviceId === peerId && !a.acknowledged);
      if (!existing) {
        activeAlerts.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          ruleId: 'offline', deviceId: peerId, deviceName: dev.name,
          message: `${dev.name} has been offline for >${offlineRule.threshold}s`,
          severity: 'warning', timestamp: new Date().toISOString(), acknowledged: false
        });
      }
    }

    // Battery check
    const batteryRule = alertRules.find(r => r.id === 'low-battery' && r.enabled);
    if (batteryRule && dev.batteryLevel !== undefined && dev.batteryLevel < batteryRule.threshold) {
      const existing = activeAlerts.find(a => a.ruleId === 'low-battery' && a.deviceId === peerId && !a.acknowledged);
      if (!existing) {
        activeAlerts.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          ruleId: 'low-battery', deviceId: peerId, deviceName: dev.name,
          message: `${dev.name} battery at ${dev.batteryLevel}%`,
          severity: 'critical', timestamp: new Date().toISOString(), acknowledged: false
        });
      }
    }

    // Storage check
    const storageRule = alertRules.find(r => r.id === 'storage-full' && r.enabled);
    if (storageRule && dev.storageUsed !== undefined && dev.storageTotal > 0) {
      const pct = Math.round((dev.storageUsed / dev.storageTotal) * 100);
      if (pct > storageRule.threshold) {
        const existing = activeAlerts.find(a => a.ruleId === 'storage-full' && a.deviceId === peerId && !a.acknowledged);
        if (!existing) {
          activeAlerts.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            ruleId: 'storage-full', deviceId: peerId, deviceName: dev.name,
            message: `${dev.name} storage at ${pct}%`,
            severity: 'warning', timestamp: new Date().toISOString(), acknowledged: false
          });
        }
      }
    }
  }

  // Clean old acknowledged alerts (older than 1 hour)
  const cutoff = now - 3600_000;
  for (let i = activeAlerts.length - 1; i >= 0; i--) {
    if (activeAlerts[i].acknowledged && new Date(activeAlerts[i].timestamp).getTime() < cutoff) {
      activeAlerts.splice(i, 1);
    }
  }
}, 15_000);

// ── Scheduled Command Executor (every 10 s) ────────────────────────
setInterval(() => {
  const now = new Date();
  for (const sc of scheduledCommands) {
    if (sc.executed) continue;
    if (new Date(sc.scheduledAt) <= now) {
      sc.executed = true;
      if (sc.targetType === 'fleet') {
        for (const [peerId] of deviceRegistry) {
          const cmds = commandQueue.get(peerId) || [];
          cmds.push({ id: Date.now().toString(36), command: sc.command, payload: sc.payload, createdAt: new Date().toISOString() });
          commandQueue.set(peerId, cmds);
        }
        audit('scheduled-fleet-command', 'fleet', 'All Devices', { command: sc.command, scheduledAt: sc.scheduledAt });
      } else if (sc.targetType === 'device') {
        const cmds = commandQueue.get(sc.targetId) || [];
        cmds.push({ id: Date.now().toString(36), command: sc.command, payload: sc.payload, createdAt: new Date().toISOString() });
        commandQueue.set(sc.targetId, cmds);
        audit('scheduled-device-command', sc.targetId, sc.targetId, { command: sc.command, scheduledAt: sc.scheduledAt });
      } else if (sc.targetType === 'group') {
        const group = deviceGroups.get(sc.targetId);
        if (group) {
          for (const devId of group.deviceIds) {
            for (const [peerId, dev] of deviceRegistry) {
              if (dev.id === devId || peerId === devId) {
                const cmds = commandQueue.get(peerId) || [];
                cmds.push({ id: Date.now().toString(36), command: sc.command, payload: sc.payload, createdAt: new Date().toISOString() });
                commandQueue.set(peerId, cmds);
              }
            }
          }
          audit('scheduled-group-command', sc.targetId, group.name, { command: sc.command, scheduledAt: sc.scheduledAt });
        }
      }
      debouncedSave();
    }
  }
  // Clean executed commands older than 24 hours
  const dayAgo = Date.now() - 86400_000;
  for (let i = scheduledCommands.length - 1; i >= 0; i--) {
    if (scheduledCommands[i].executed && new Date(scheduledCommands[i].scheduledAt).getTime() < dayAgo) {
      scheduledCommands.splice(i, 1);
    }
  }
}, 10_000);

// ── SSE heartbeat ──────────────────────────────────────────────────
setInterval(() => {
  for (const client of sseClients) {
    try { client.write(':\n\n'); } catch { sseClients.delete(client); }
  }
}, 15000);

// ── HTTP Server ─────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const urlPath = decodeURIComponent(parsed.pathname);
  const query = parsed.searchParams;

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

    // GET /api/devices/export — CSV export of all devices
    if (urlPath === '/api/devices/export' && method === 'GET') {
      const now = Date.now();
      const headers = ['id','name','type','peerId','status','lastSeen','policyId','batteryLevel','storageUsed','storageTotal','wifiSignal','wifiSSID','browserVersion','osVersion','screenResolution'];
      const rows = [headers.join(',')];
      for (const d of deviceRegistry.values()) {
        const status = (now - d.lastSeen < 15_000) ? 'online' : 'offline';
        const row = headers.map(h => {
          if (h === 'status') return status;
          const val = d[h];
          if (val === undefined || val === null) return '';
          return String(val).includes(',') ? `"${val}"` : String(val);
        });
        rows.push(row.join(','));
      }
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename="devices.csv"'
      });
      res.end(rows.join('\n'));
      return;
    }

    // POST /api/devices/register — headset registers itself
    if (urlPath === '/api/devices/register' && method === 'POST') {
      const body = await readBody(req);
      const { peerId, name, type, serial, deviceId, policyId,
              batteryLevel, storageUsed, storageTotal, wifiSignal, wifiSSID,
              browserVersion, osVersion, screenResolution, groupIds } = body;
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
        batteryLevel: batteryLevel !== undefined ? batteryLevel : null,
        storageUsed: storageUsed !== undefined ? storageUsed : null,
        storageTotal: storageTotal !== undefined ? storageTotal : null,
        wifiSignal: wifiSignal !== undefined ? wifiSignal : null,
        wifiSSID: wifiSSID || null,
        browserVersion: browserVersion || null,
        osVersion: osVersion || null,
        screenResolution: screenResolution || null,
        currentUrl: null,
      });
      // Add device to specified groups
      if (Array.isArray(groupIds)) {
        for (const gid of groupIds) {
          const group = deviceGroups.get(gid);
          if (group && !group.deviceIds.includes(peerId)) {
            group.deviceIds.push(peerId);
          }
        }
        debouncedSave();
      }
      audit('device-register', peerId, name || 'Unknown Device', { type: type || 'headset' });
      return jsonResponse(res, { ok: true, peerId });
    }

    // POST /api/devices/heartbeat — periodic heartbeat
    if (urlPath === '/api/devices/heartbeat' && method === 'POST') {
      const body = await readBody(req);
      const { peerId, batteryLevel, storageUsed, storageTotal, wifiSignal, wifiSSID, currentUrl } = body;
      if (!peerId) return jsonResponse(res, { error: 'peerId is required' }, 400);
      const dev = deviceRegistry.get(peerId);
      if (dev) {
        dev.lastSeen = Date.now();
        if (batteryLevel !== undefined) dev.batteryLevel = batteryLevel;
        if (storageUsed !== undefined) dev.storageUsed = storageUsed;
        if (storageTotal !== undefined) dev.storageTotal = storageTotal;
        if (wifiSignal !== undefined) dev.wifiSignal = wifiSignal;
        if (wifiSSID !== undefined) dev.wifiSSID = wifiSSID;
        if (currentUrl !== undefined) dev.currentUrl = currentUrl;
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
      const isUpdate = devicePolicies.has(id);
      const policy = {
        id,
        name: body.name || 'Untitled Policy',
        kioskUrl: body.kioskUrl || null,
        allowNavigation: body.allowNavigation !== undefined ? body.allowNavigation : true,
        autoLaunch: body.autoLaunch !== undefined ? body.autoLaunch : true,
        refreshInterval: body.refreshInterval || 0,
        whitelist: body.whitelist || [],
        createdAt: isUpdate ? devicePolicies.get(id).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      devicePolicies.set(id, policy);
      audit('policy-update', id, policy.name, { action: isUpdate ? 'updated' : 'created' });
      debouncedSave();
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
      let count = 0;
      for (const [peerId] of deviceRegistry) {
        const cmdEntry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), command, payload: payload || null, createdAt: new Date().toISOString() };
        if (!commandQueue.has(peerId)) commandQueue.set(peerId, []);
        commandQueue.get(peerId).push(cmdEntry);
        count++;
      }
      audit('fleet-command', 'fleet', 'All Devices', { command, payload });
      return jsonResponse(res, { ok: true, devicesQueued: count });
    }

    // ── Device Groups ────────────────────────────────────────────────

    // GET /api/groups — list all groups
    if (urlPath === '/api/groups' && method === 'GET') {
      return jsonResponse(res, [...deviceGroups.values()]);
    }

    // POST /api/groups — create or update a group
    if (urlPath === '/api/groups' && method === 'POST') {
      const body = await readBody(req);
      const id = body.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const existing = deviceGroups.get(id);
      const group = {
        id,
        name: body.name || (existing ? existing.name : 'Untitled Group'),
        color: body.color || (existing ? existing.color : '#4A90D9'),
        deviceIds: existing ? existing.deviceIds : [],
      };
      deviceGroups.set(id, group);
      debouncedSave();
      return jsonResponse(res, group);
    }

    // ── Audit Log ────────────────────────────────────────────────────

    // GET /api/audit — return audit entries
    if (urlPath === '/api/audit' && method === 'GET') {
      const limit = Math.min(parseInt(query.get('limit') || '200', 10), 1000);
      return jsonResponse(res, auditLog.slice(-limit).reverse());
    }

    // ── Alert Rules & Active Alerts ──────────────────────────────────

    // GET /api/alerts/rules — list alert rules
    if (urlPath === '/api/alerts/rules' && method === 'GET') {
      return jsonResponse(res, alertRules);
    }

    // POST /api/alerts/rules — update an alert rule
    if (urlPath === '/api/alerts/rules' && method === 'POST') {
      const body = await readBody(req);
      const { id, enabled, threshold } = body;
      const rule = alertRules.find(r => r.id === id);
      if (!rule) return jsonResponse(res, { error: 'Alert rule not found' }, 404);
      if (enabled !== undefined) rule.enabled = enabled;
      if (threshold !== undefined) rule.threshold = threshold;
      debouncedSave();
      return jsonResponse(res, rule);
    }

    // GET /api/alerts/active — list active (unacknowledged) alerts
    if (urlPath === '/api/alerts/active' && method === 'GET') {
      return jsonResponse(res, activeAlerts.filter(a => !a.acknowledged));
    }

    // ── Scheduled Commands ───────────────────────────────────────────

    // GET /api/scheduled — list all scheduled commands
    if (urlPath === '/api/scheduled' && method === 'GET') {
      return jsonResponse(res, scheduledCommands);
    }

    // POST /api/scheduled — create a scheduled command
    if (urlPath === '/api/scheduled' && method === 'POST') {
      const body = await readBody(req);
      const { command, payload, targetType, targetId, scheduledAt } = body;
      if (!command || !targetType || !scheduledAt) {
        return jsonResponse(res, { error: 'command, targetType, and scheduledAt are required' }, 400);
      }
      const sc = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        command,
        payload: payload || null,
        targetType,
        targetId: targetId || null,
        scheduledAt,
        executed: false,
        createdAt: new Date().toISOString(),
      };
      scheduledCommands.push(sc);
      debouncedSave();
      return jsonResponse(res, sc);
    }

    // ── Sessions ─────────────────────────────────────────────────────

    // GET /api/sessions — return recent sessions
    if (urlPath === '/api/sessions' && method === 'GET') {
      return jsonResponse(res, sessions.slice(-100).reverse());
    }

    // POST /api/sessions/start — headset reports session start
    if (urlPath === '/api/sessions/start' && method === 'POST') {
      const body = await readBody(req);
      const { peerId, url, timestamp } = body;
      if (!peerId) return jsonResponse(res, { error: 'peerId is required' }, 400);
      const dev = deviceRegistry.get(peerId);
      const session = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        peerId,
        deviceName: dev ? dev.name : peerId,
        url: url || null,
        startedAt: timestamp || new Date().toISOString(),
        endedAt: null,
        duration: null,
      };
      sessions.push(session);
      if (sessions.length > 500) sessions.splice(0, sessions.length - 300);
      return jsonResponse(res, session);
    }

    // POST /api/sessions/end — headset reports session end
    if (urlPath === '/api/sessions/end' && method === 'POST') {
      const body = await readBody(req);
      const { peerId, url, timestamp, duration } = body;
      if (!peerId) return jsonResponse(res, { error: 'peerId is required' }, 400);
      // Find the most recent open session for this peer
      for (let i = sessions.length - 1; i >= 0; i--) {
        if (sessions[i].peerId === peerId && !sessions[i].endedAt) {
          sessions[i].endedAt = timestamp || new Date().toISOString();
          sessions[i].duration = duration || null;
          return jsonResponse(res, sessions[i]);
        }
      }
      // No open session found — create a completed one
      const dev = deviceRegistry.get(peerId);
      const session = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        peerId,
        deviceName: dev ? dev.name : peerId,
        url: url || null,
        startedAt: null,
        endedAt: timestamp || new Date().toISOString(),
        duration: duration || null,
      };
      sessions.push(session);
      return jsonResponse(res, session);
    }

    // ── Routes with path parameters ─────────────────────────────────
    const deviceCmdMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/command$/);
    const deviceCmdsMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/commands$/);
    const devicePolicyMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/policy$/);
    const deviceTelemetryMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/telemetry$/);
    const deviceAckMatch = urlPath.match(/^\/api\/devices\/([^/]+)\/ack$/);
    const policyDeleteMatch = urlPath.match(/^\/api\/policies\/([^/]+)$/);
    const groupIdMatch = urlPath.match(/^\/api\/groups\/([^/]+)$/);
    const groupDevicesMatch = urlPath.match(/^\/api\/groups\/([^/]+)\/devices$/);
    const groupCommandMatch = urlPath.match(/^\/api\/groups\/([^/]+)\/command$/);
    const alertAckMatch = urlPath.match(/^\/api\/alerts\/([^/]+)\/ack$/);
    const scheduledDeleteMatch = urlPath.match(/^\/api\/scheduled\/([^/]+)$/);

    // DELETE /api/policies/:id — delete a policy
    if (policyDeleteMatch && method === 'DELETE') {
      const policyId = policyDeleteMatch[1];
      if (policyId === 'default') {
        return jsonResponse(res, { error: 'Cannot delete the default policy' }, 400);
      }
      if (!devicePolicies.has(policyId)) {
        return jsonResponse(res, { error: 'Policy not found' }, 404);
      }
      const policyName = devicePolicies.get(policyId).name;
      devicePolicies.delete(policyId);
      audit('policy-update', policyId, policyName, { action: 'deleted' });
      debouncedSave();
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
      const dev = deviceRegistry.get(peerId);
      audit('device-command', peerId, dev ? dev.name : peerId, { command, payload });
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
      audit('policy-assign', peerId, dev.name, { policyId });
      return jsonResponse(res, { ok: true, policyId });
    }

    // GET /api/devices/:peerId/telemetry — return current telemetry
    if (deviceTelemetryMatch && method === 'GET') {
      const peerId = deviceTelemetryMatch[1];
      const dev = deviceRegistry.get(peerId);
      if (!dev) return jsonResponse(res, { error: 'Device not found' }, 404);
      return jsonResponse(res, {
        peerId: dev.peerId,
        name: dev.name,
        batteryLevel: dev.batteryLevel,
        storageUsed: dev.storageUsed,
        storageTotal: dev.storageTotal,
        wifiSignal: dev.wifiSignal,
        wifiSSID: dev.wifiSSID,
        currentUrl: dev.currentUrl,
        browserVersion: dev.browserVersion,
        osVersion: dev.osVersion,
        screenResolution: dev.screenResolution,
        lastSeen: dev.lastSeen,
        status: (Date.now() - dev.lastSeen < 15_000) ? 'online' : 'offline',
      });
    }

    // POST /api/devices/:peerId/ack — device acknowledges a command
    if (deviceAckMatch && method === 'POST') {
      const peerId = deviceAckMatch[1];
      const body = await readBody(req);
      const { commandId, result, message } = body;
      audit('command-ack', peerId, peerId, { commandId, result: result || 'ok', message: message || null });
      return jsonResponse(res, { ok: true });
    }

    // DELETE /api/groups/:id — delete a group
    if (groupIdMatch && method === 'DELETE') {
      const groupId = groupIdMatch[1];
      if (!deviceGroups.has(groupId)) return jsonResponse(res, { error: 'Group not found' }, 404);
      deviceGroups.delete(groupId);
      debouncedSave();
      return jsonResponse(res, { ok: true });
    }

    // POST /api/groups/:id/devices — add devices to group
    if (groupDevicesMatch && method === 'POST') {
      const groupId = groupDevicesMatch[1];
      const group = deviceGroups.get(groupId);
      if (!group) return jsonResponse(res, { error: 'Group not found' }, 404);
      const body = await readBody(req);
      const { deviceIds } = body;
      if (!Array.isArray(deviceIds)) return jsonResponse(res, { error: 'deviceIds array is required' }, 400);
      for (const did of deviceIds) {
        if (!group.deviceIds.includes(did)) group.deviceIds.push(did);
      }
      debouncedSave();
      return jsonResponse(res, group);
    }

    // DELETE /api/groups/:id/devices — remove devices from group
    if (groupDevicesMatch && method === 'DELETE') {
      const groupId = groupDevicesMatch[1];
      const group = deviceGroups.get(groupId);
      if (!group) return jsonResponse(res, { error: 'Group not found' }, 404);
      const body = await readBody(req);
      const { deviceIds } = body;
      if (!Array.isArray(deviceIds)) return jsonResponse(res, { error: 'deviceIds array is required' }, 400);
      group.deviceIds = group.deviceIds.filter(id => !deviceIds.includes(id));
      debouncedSave();
      return jsonResponse(res, group);
    }

    // POST /api/groups/:id/command — send command to all devices in group
    if (groupCommandMatch && method === 'POST') {
      const groupId = groupCommandMatch[1];
      const group = deviceGroups.get(groupId);
      if (!group) return jsonResponse(res, { error: 'Group not found' }, 404);
      const body = await readBody(req);
      const { command, payload } = body;
      const validCommands = ['navigate', 'refresh', 'lock', 'unlock', 'restart', 'set-policy', 'message'];
      if (!command || !validCommands.includes(command)) {
        return jsonResponse(res, { error: 'Invalid command. Valid: ' + validCommands.join(', ') }, 400);
      }
      let count = 0;
      for (const devId of group.deviceIds) {
        for (const [peerId, dev] of deviceRegistry) {
          if (dev.id === devId || peerId === devId) {
            const cmdEntry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), command, payload: payload || null, createdAt: new Date().toISOString() };
            if (!commandQueue.has(peerId)) commandQueue.set(peerId, []);
            commandQueue.get(peerId).push(cmdEntry);
            count++;
          }
        }
      }
      audit('group-command', groupId, group.name, { command, payload, devicesQueued: count });
      return jsonResponse(res, { ok: true, devicesQueued: count });
    }

    // POST /api/alerts/:id/ack — acknowledge an alert
    if (alertAckMatch && method === 'POST') {
      const alertId = alertAckMatch[1];
      const alert = activeAlerts.find(a => a.id === alertId);
      if (!alert) return jsonResponse(res, { error: 'Alert not found' }, 404);
      alert.acknowledged = true;
      return jsonResponse(res, { ok: true });
    }

    // DELETE /api/scheduled/:id — cancel a scheduled command
    if (scheduledDeleteMatch && method === 'DELETE') {
      const scId = scheduledDeleteMatch[1];
      const idx = scheduledCommands.findIndex(s => s.id === scId);
      if (idx < 0) return jsonResponse(res, { error: 'Scheduled command not found' }, 404);
      scheduledCommands.splice(idx, 1);
      debouncedSave();
      return jsonResponse(res, { ok: true });
    }

    // ── Overlay API (OBS SSE) ───────────────────────────────────────

    // GET /api/overlay/state — return full overlay state
    if (urlPath === '/api/overlay/state' && method === 'GET') {
      return jsonResponse(res, {
        players: [...overlayData.players.values()],
        scoreboard: overlayData.scoreboard,
        activity: [...overlayData.activity.values()],
        lastUpdate: overlayData.lastUpdate
      });
    }

    // GET /api/overlay/events — SSE stream
    if (urlPath === '/api/overlay/events' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write(':\n\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    // POST /api/overlay/scores — CV pipeline pushes player scores
    if (urlPath === '/api/overlay/scores' && method === 'POST') {
      const body = await readBody(req);
      const players = body.players || [];
      for (const p of players) {
        if (!p.peerId) continue;
        const dev = deviceRegistry.get(p.peerId);
        const existing = overlayData.players.get(p.peerId) || {};
        overlayData.players.set(p.peerId, {
          ...existing,
          peerId: p.peerId,
          name: p.name || existing.name || (dev ? dev.name : 'Unknown'),
          headsetType: p.headsetType || existing.headsetType || (dev ? dev.type : 'VR Headset'),
          score: p.score !== undefined ? p.score : (existing.score || 0),
          kills: p.kills !== undefined ? p.kills : (existing.kills || 0),
          deaths: p.deaths !== undefined ? p.deaths : (existing.deaths || 0),
          assists: p.assists !== undefined ? p.assists : (existing.assists || 0),
          team: p.team || existing.team || '',
          avatar: p.avatar || existing.avatar || '',
          lastUpdate: Date.now()
        });
      }
      broadcastOverlay('scores', [...overlayData.players.values()]);
      return jsonResponse(res, { ok: true, playerCount: overlayData.players.size });
    }

    // POST /api/overlay/activity — CV pipeline pushes action intensity
    if (urlPath === '/api/overlay/activity' && method === 'POST') {
      const body = await readBody(req);
      if (!body.peerId) return jsonResponse(res, { error: 'peerId required' }, 400);
      overlayData.activity.set(body.peerId, {
        peerId: body.peerId,
        intensity: body.intensity || 0,
        action: body.action || 'idle',
        lastUpdate: Date.now()
      });
      broadcastOverlay('activity', { peerId: body.peerId, intensity: body.intensity || 0, action: body.action || 'idle' });
      return jsonResponse(res, { ok: true });
    }

    // POST /api/overlay/scoreboard — update overall scoreboard
    if (urlPath === '/api/overlay/scoreboard' && method === 'POST') {
      const body = await readBody(req);
      overlayData.scoreboard = {
        title: body.title || overlayData.scoreboard.title,
        teams: body.teams || overlayData.scoreboard.teams,
        clock: body.clock || overlayData.scoreboard.clock,
        status: body.status || overlayData.scoreboard.status
      };
      broadcastOverlay('scoreboard', overlayData.scoreboard);
      return jsonResponse(res, { ok: true });
    }

    // DELETE /api/overlay/reset — clear all overlay data
    if (urlPath === '/api/overlay/reset' && method === 'DELETE') {
      overlayData.players.clear();
      overlayData.activity.clear();
      overlayData.scoreboard = { title: '', teams: [], clock: '', status: 'idle' };
      broadcastOverlay('reset', {});
      return jsonResponse(res, { ok: true });
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
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    if (!urlPath.startsWith('/overlay/')) {
      headers['X-Frame-Options'] = 'DENY';
    }
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
