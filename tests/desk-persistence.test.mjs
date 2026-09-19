import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeskMeta, restoreDeskMeta, sanitizeDeskMeta } from '../src/renderer/desk-persistence.mjs';

test('desk metadata persists positions instead of ephemeral ids', () => {
  const panels = [{ id: 'old-a' }, { id: 'old-b' }, { id: 'old-c' }];
  const meta = buildDeskMeta(panels, { activeId: 'old-b', expandedId: 'old-c', view: 'split' });
  assert.equal(meta.activeIndex, 1);
  assert.equal(meta.expandedIndex, 2);
  assert.equal(meta.view, 'split');
});

test('desk metadata restores against freshly minted panel ids', () => {
  const panels = [{ id: 'new-a' }, { id: 'new-b' }, { id: 'new-c' }];
  const restored = restoreDeskMeta(panels, { activeIndex: 1, expandedIndex: 2, view: 'split' });
  assert.deepEqual(restored, { activeId: 'new-b', expandedId: 'new-c', view: 'split' });
});

test('invalid metadata safely falls back to the first panel', () => {
  const panels = [{ id: 'a' }];
  const restored = restoreDeskMeta(panels, { activeIndex: 99, expandedIndex: -1, view: 'wat' });
  assert.deepEqual(restored, { activeId: 'a', expandedId: null, view: 'desk' });
});

test('sanitization never preserves invalid indices or views', () => {
  assert.deepEqual(sanitizeDeskMeta({ activeIndex: -3, expandedIndex: 'x', view: 'wat' }), {
    version: 1, activeIndex: null, expandedIndex: null, view: 'desk', savedAt: 0,
  });
});
