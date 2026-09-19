'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const RESERVED_ENV = new Set([
  'LD_PRELOAD', 'LD_LIBRARY_PATH', 'DYLD_INSERT_LIBRARIES', 'DYLD_LIBRARY_PATH',
  'NODE_OPTIONS', 'ELECTRON_RUN_AS_NODE', 'NODE_PATH',
]);

function validServiceId(id) {
  return typeof id === 'string' && /^[a-z0-9][a-z0-9._-]{0,63}$/.test(id);
}

function validateScope(scope) {
  return scope === 'project' || scope === 'user';
}

function isLocalHttp(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' && (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || u.hostname === '[::1]' || u.hostname === '::1');
  } catch (_) { return false; }
}

function validateRemoteUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return { ok: false, error: 'MCP remote URL is required.' };
  try {
    const u = new URL(url.trim());
    if (u.protocol === 'https:') return { ok: true, url: u.toString() };
    if (isLocalHttp(u.toString())) return { ok: true, url: u.toString(), local: true };
    return { ok: false, error: 'MCP remote connections must use HTTPS (HTTP is allowed only for localhost).' };
  } catch (_) { return { ok: false, error: 'Invalid MCP remote URL.' }; }
}

function validateEnv(env) {
  if (env == null) return { ok: true, env: {} };
  if (!env || typeof env !== 'object' || Array.isArray(env)) return { ok: false, error: 'MCP environment must be an object.' };
  const out = {};
  for (const [key, value] of Object.entries(env)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return { ok: false, error: `Invalid MCP environment variable: ${key}` };
    if (RESERVED_ENV.has(key)) return { ok: false, error: `MCP environment variable ${key} is not allowed.` };
    if (typeof value !== 'string') return { ok: false, error: `MCP environment variable ${key} must be a string.` };
    out[key] = value;
  }
  return { ok: true, env: out };
}

function validateEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return { ok: false, error: 'Invalid MCP connection entry.' };
  if (entry.command != null) {
    if (typeof entry.command !== 'string' || !entry.command.trim()) return { ok: false, error: 'MCP command is required.' };
    if (entry.command.includes('\0')) return { ok: false, error: 'MCP command contains an invalid character.' };
    if (entry.args != null && (!Array.isArray(entry.args) || entry.args.some(a => typeof a !== 'string'))) return { ok: false, error: 'MCP command arguments must be strings.' };
  } else if (entry.url != null) {
    const remote = validateRemoteUrl(entry.url);
    if (!remote.ok) return remote;
  } else {
    return { ok: false, error: 'MCP connection needs either a command or a remote URL.' };
  }
  const env = validateEnv(entry.env);
  if (!env.ok) return env;
  return { ok: true, entry: { ...entry, ...(entry.url ? { url: validateRemoteUrl(entry.url).url } : {}), env: env.env } };
}

function validateProjectPath(projectPath, scope) {
  if (!validateScope(scope)) return { ok: false, error: 'Invalid MCP scope.' };
  if (scope === 'user') return { ok: true, projectPath: null };
  if (typeof projectPath !== 'string' || !projectPath.trim()) return { ok: false, error: 'A project folder is required for project-scoped MCP connections.' };
  const resolved = path.resolve(projectPath);
  try {
    if (!fs.statSync(resolved).isDirectory()) return { ok: false, error: 'The MCP project folder is not a directory.' };
  } catch (_) { return { ok: false, error: 'The MCP project folder is not accessible.' }; }
  return { ok: true, projectPath: resolved };
}

function sanitizeForRenderer(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const out = { command: entry.command, args: Array.isArray(entry.args) ? entry.args.slice() : undefined, url: entry.url };
  if (entry.env && typeof entry.env === 'object') out.envKeys = Object.keys(entry.env);
  return out;
}

function bundlePathAllowed(dir, homeDir = os.homedir()) {
  if (typeof dir !== 'string' || !dir) return false;
  const root = path.resolve(homeDir, '.nami', 'bundles');
  const target = path.resolve(dir);
  const rel = path.relative(root, target);
  return rel === '' || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel));
}

module.exports = { RESERVED_ENV, validServiceId, validateScope, validateRemoteUrl, validateEnv, validateEntry, validateProjectPath, sanitizeForRenderer, bundlePathAllowed };
