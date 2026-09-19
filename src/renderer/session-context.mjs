// Per-session file context. A context entry is a durable reference to a file or
// directory in the workspace; it never stores file contents or credentials.
// Panel ids are runtime-only, so persistence is keyed by the session's position.

const MAX_CONTEXT = 40;

function cleanPath(value) {
  const s = String(value == null ? '' : value).trim();
  return s && s.length <= 4096 ? s : null;
}

export function normalizeContextEntries(entries = [], max = MAX_CONTEXT) {
  const out = [];
  const seen = new Set();
  for (const item of Array.isArray(entries) ? entries : []) {
    const path = cleanPath(item?.path ?? item);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push({
      path,
      kind: item?.kind === 'directory' ? 'directory' : 'file',
      name: String(item?.name || path.split(/[\\/]/).filter(Boolean).pop() || path).slice(0, 256),
      addedAt: Number.isFinite(item?.addedAt) ? item.addedAt : 0,
    });
    if (out.length >= max) break;
  }
  return out;
}

export function addContext(entries, item, max = MAX_CONTEXT) {
  const normalized = normalizeContextEntries(entries, max);
  const path = cleanPath(item?.path ?? item);
  if (!path) return normalized;
  const next = normalized.filter((x) => x.path !== path);
  next.unshift({
    path,
    kind: item?.kind === 'directory' ? 'directory' : 'file',
    name: String(item?.name || path.split(/[\\/]/).filter(Boolean).pop() || path).slice(0, 256),
    addedAt: Number.isFinite(item?.addedAt) ? item.addedAt : Date.now(),
  });
  return next.slice(0, max);
}

export function removeContext(entries, path) {
  const target = cleanPath(path);
  return normalizeContextEntries(entries).filter((x) => x.path !== target);
}

export function contextForSession(panels, sessionId) {
  const session = (panels || []).find((p) => p?.id === sessionId);
  return normalizeContextEntries(session?.contextFiles || []);
}

// Persist by session position rather than runtime id.
export function contextIndexes(panels = []) {
  const out = {};
  for (let i = 0; i < panels.length; i++) {
    const p = panels[i];
    if (!p || ['editor', 'viewer', 'card', 'browser'].includes(p.kind)) continue;
    const entries = normalizeContextEntries(p.contextFiles);
    if (entries.length) out[i] = entries;
  }
  return out;
}

export function restoreContextIndexes(panels = [], snapshot = {}) {
  for (const [key, entries] of Object.entries(snapshot && typeof snapshot === 'object' ? snapshot : {})) {
    const index = Number(key);
    const panel = Number.isInteger(index) ? panels[index] : null;
    if (!panel || ['editor', 'viewer', 'card', 'browser'].includes(panel.kind)) continue;
    panel.contextFiles = normalizeContextEntries(entries);
  }
  return panels;
}

export const MAX_SESSION_CONTEXT = MAX_CONTEXT;
