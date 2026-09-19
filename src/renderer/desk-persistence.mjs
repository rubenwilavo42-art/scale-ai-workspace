// Pure helpers for restart-safe desk metadata. Panel ids are ephemeral, so
// persistence stores positions rather than ids.
export function buildDeskMeta(panels, { activeId = null, expandedId = null, view = 'desk' } = {}) {
  const indexOf = (id) => {
    const i = panels.findIndex((p) => p && p.id === id);
    return i >= 0 ? i : null;
  };
  return {
    version: 1,
    activeIndex: indexOf(activeId),
    expandedIndex: indexOf(expandedId),
    view: view === 'split' ? 'split' : 'desk',
    savedAt: Date.now(),
  };
}

export function restoreDeskMeta(panels, meta) {
  const safe = meta && typeof meta === 'object' ? meta : {};
  const pick = (key) => Number.isInteger(safe[key]) && safe[key] >= 0 && safe[key] < panels.length ? panels[safe[key]] : null;
  return {
    activeId: pick('activeIndex')?.id || panels[0]?.id || null,
    expandedId: pick('expandedIndex')?.id || null,
    view: safe.view === 'split' ? 'split' : 'desk',
  };
}

export function sanitizeDeskMeta(meta) {
  const out = restoreDeskMeta([], meta);
  return {
    version: 1,
    activeIndex: Number.isInteger(meta?.activeIndex) && meta.activeIndex >= 0 ? meta.activeIndex : null,
    expandedIndex: Number.isInteger(meta?.expandedIndex) && meta.expandedIndex >= 0 ? meta.expandedIndex : null,
    view: out.view,
    savedAt: Number.isFinite(meta?.savedAt) ? meta.savedAt : 0,
  };
}
