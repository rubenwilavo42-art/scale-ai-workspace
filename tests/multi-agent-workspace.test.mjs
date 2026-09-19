import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_COMPARE_SESSIONS, comparableSessions, normalizeCompareSelection, compareLayout, canCompare } from '../src/renderer/multi-agent-workspace.mjs';

const panels = [
  { id: 'a', kind: 'claude', title: 'Claude', exited: false },
  { id: 'b', kind: 'acp', title: 'Codex', exited: false },
  { id: 'c', kind: 'acp', title: 'OpenCode', exited: true },
  { id: 'f', kind: 'editor', title: 'README.md', exited: false },
  { id: 'd', kind: 'run', title: 'Kimi', exited: false },
  { id: 'e', kind: 'shell', title: 'Shell', exited: false },
];

test('only live workspace sessions are comparable', () => {
  assert.deepEqual(comparableSessions(panels).map(p => p.id), ['a', 'b', 'd', 'e']);
});

test('selection is deduplicated, filtered, and capped', () => {
  assert.deepEqual(normalizeCompareSelection(panels, ['a', 'a', 'f', 'c', 'b', 'd', 'e', 'missing']), ['a', 'b', 'd', 'e']);
  assert.equal(normalizeCompareSelection(panels, ['a', 'b', 'd', 'e', 'x'], 3).length, 3);
  assert.equal(MAX_COMPARE_SESSIONS, 4);
});

test('comparison requires at least two live sessions', () => {
  assert.equal(canCompare(['a'], panels), false);
  assert.equal(canCompare(['a', 'b'], panels), true);
  assert.equal(canCompare(['a', 'c'], panels), false);
});

test('comparison layout stays readable from two to four agents', () => {
  assert.deepEqual(compareLayout(1), { columns: 1, density: 'single' });
  assert.deepEqual(compareLayout(2), { columns: 2, density: 'comfortable' });
  assert.deepEqual(compareLayout(3), { columns: 2, density: 'compact' });
  assert.deepEqual(compareLayout(4), { columns: 2, density: 'compact' });
});
