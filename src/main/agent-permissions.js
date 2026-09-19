'use strict';

const path = require('node:path');

const DECISIONS = new Set(['once', 'session', 'deny']);
const sessionGrants = new Map();
const pending = new Map();
let seq = 0;

function normalizeRoot(root) {
  if (typeof root !== 'string' || !root.trim()) return null;
  return path.resolve(root);
}

function insideWorkspace(workspaceRoot, cwd) {
  const root = normalizeRoot(workspaceRoot);
  const target = normalizeRoot(cwd);
  if (!root || !target) return false;
  const rel = path.relative(root, target);
  return rel === '' || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel));
}

function normalizeCommand(command) {
  return String(command || '').replace(/\s+/g, ' ').trim().slice(0, 2000);
}

function permissionScope(input = {}) {
  // A session grant is intentionally broader than one exact command/cwd,
  // otherwise a long-running agent would trigger a permission sheet for
  // every new command or file target. The scope is still bounded by the
  // workspace, agent identity and capability.
  if (input.scope) return String(input.scope);
  if (String(input.kind || '').startsWith('file-')) return 'file-ops';
  if (String(input.kind || '').startsWith('browser-')) return 'browser';
  if (input.credentialAccess === true) return 'agent-run';
  return 'action';
}

function fingerprint({ workspaceRoot, agentId, scope, credentialAccess }) {
  return JSON.stringify([
    normalizeRoot(workspaceRoot),
    String(agentId || ''),
    permissionScope({ scope, credentialAccess }),
    credentialAccess === true,
  ]);
}

function redactSecrets(value, settings = {}) {
  let out = String(value || '');
  const values = Object.values(settings.envKeys || {}).filter(v => typeof v === 'string' && v.length >= 4);
  for (const secret of [...new Set(values)].sort((a,b) => b.length - a.length)) out = out.split(secret).join('[secret redacted]');
  return out;
}

function describeRequest(input = {}) {
  const command = redactSecrets(normalizeCommand(input.command || input.program || ''), input.settings || {});
  return {
    id: `perm-${Date.now()}-${++seq}`,
    kind: input.kind || 'run',
    agentId: input.agentId || null,
    command,
    cwd: normalizeRoot(input.cwd),
    workspaceRoot: normalizeRoot(input.workspaceRoot),
    credentialAccess: input.credentialAccess === true,
  };
}

function decisionFor(input) {
  const key = fingerprint(input);
  return sessionGrants.get(key) || null;
}

function rememberSession(input) {
  sessionGrants.set(fingerprint(input), 'allow');
}

function clearSessionPermissions() { sessionGrants.clear(); }

function validateWorkspace(input) {
  if (!input.workspaceRoot) return { ok: false, error: 'Workspace root is required for agent execution.' };
  if (!insideWorkspace(input.workspaceRoot, input.cwd)) {
    return { ok: false, error: 'Agent execution is outside the active ScalAI workspace.' };
  }
  return { ok: true };
}

function requestPermission(input, send, timeoutMs = 120000) {
  const req = describeRequest(input);
  const existing = decisionFor(input);
  if (existing === 'allow') return Promise.resolve({ ok: true, decision: 'session', cached: true });
  if (pending.has(req.id)) return pending.get(req.id).promise;

  let timer;
  let resolvePromise;
  const promise = new Promise((resolve) => { resolvePromise = resolve; });
  pending.set(req.id, { promise, resolve: resolvePromise, timer: null });
  timer = setTimeout(() => {
    pending.delete(req.id);
    resolvePromise({ ok: false, decision: 'deny', error: 'Permission request timed out.' });
  }, timeoutMs);

  pending.get(req.id).timer = timer;
  try { send(req); } catch (err) {
    clearTimeout(timer); pending.delete(req.id);
    resolvePromise({ ok: false, decision: 'deny', error: 'Could not display permission request.' });
  }
  return promise;
}

function resolvePermission(id, decision) {
  const item = pending.get(id);
  if (!item) return { ok: false, error: 'Permission request is no longer active.' };
  const normalized = DECISIONS.has(decision) ? decision : 'deny';
  pending.delete(id);
  const result = normalized === 'deny'
    ? { ok: false, decision: normalized, error: 'Action refused by the user.' }
    : { ok: true, decision: normalized };
  clearTimeout(item.timer);
  item.resolve(result);
  return { ok: true };
}

function attachRequestTimer(id, timer) { const item = pending.get(id); if (item) item.timer = timer; }

module.exports = {
  DECISIONS,
  insideWorkspace,
  normalizeCommand,
  redactSecrets,
  fingerprint,
  describeRequest,
  decisionFor,
  rememberSession,
  clearSessionPermissions,
  validateWorkspace,
  requestPermission,
  resolvePermission,
  attachRequestTimer,
};
