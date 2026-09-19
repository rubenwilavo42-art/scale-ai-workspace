import test from 'node:test';
import assert from 'node:assert/strict';
import { addContext, removeContext, normalizeContextEntries, contextIndexes, restoreContextIndexes } from '../src/renderer/session-context.mjs';

test('context deduplicates paths and keeps newest attachment first', () => {
  const out = addContext(addContext([], '/projet/a.md'), '/projet/b.md');
  const again = addContext(out, '/projet/a.md');
  assert.deepEqual(again.map(x => x.path), ['/projet/a.md', '/projet/b.md']);
});

test('context removal is path-scoped and safe for malformed entries', () => {
  const out = removeContext([{ path: '/a' }, null, { path: '/b' }], '/a');
  assert.deepEqual(out.map(x => x.path), ['/b']);
});

test('context persistence uses session indexes, never ephemeral ids', () => {
  const panels = [
    { id: 'w1_s1', kind: 'acp', contextFiles: [{ path: '/a' }] },
    { id: 'w1_f1', kind: 'editor', filePath: '/a' },
    { id: 'w1_s2', kind: 'shell', contextFiles: [{ path: '/b' }] },
  ];
  assert.deepEqual(contextIndexes(panels), { 0: [{ path: '/a', kind: 'file', name: 'a', addedAt: 0 }], 2: [{ path: '/b', kind: 'file', name: 'b', addedAt: 0 }] });
  const restored = panels.map(p => ({ ...p, contextFiles: [] }));
  restoreContextIndexes(restored, { 0: [{ path: '/a' }], 2: [{ path: '/b' }] });
  assert.deepEqual(restored[0].contextFiles[0].path, '/a');
  assert.deepEqual(restored[2].contextFiles[0].path, '/b');
});
