// Pure helpers for ScalAI's multi-agent comparison surface.
// The UI owns the Set of selected ids; these rules keep selection deterministic
// and prevent closed/non-agent panels from entering a comparison.

export const MAX_COMPARE_SESSIONS = 4;

export function comparableSessions(panels = []) {
  return panels.filter((p) => p && ['claude', 'shell', 'harness', 'run', 'acp'].includes(p.kind) && !p.exited);
}

export function normalizeCompareSelection(panels, ids = [], max = MAX_COMPARE_SESSIONS) {
  const allowed = new Set(comparableSessions(panels).map((p) => p.id));
  const out = [];
  for (const id of ids) {
    if (!allowed.has(id) || out.includes(id)) continue;
    out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

export function compareLayout(count) {
  const n = Math.max(0, Math.min(MAX_COMPARE_SESSIONS, Number(count) || 0));
  if (n <= 1) return { columns: 1, density: 'single' };
  if (n === 2) return { columns: 2, density: 'comfortable' };
  return { columns: 2, density: 'compact' };
}

export function canCompare(ids, panels) {
  return normalizeCompareSelection(panels, ids).length >= 2;
}
