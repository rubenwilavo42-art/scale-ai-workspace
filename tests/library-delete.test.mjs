import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { deleteItem } = require('../src/main/library.js');

const H = '/home/u', P = '/proj';
// deleteItem resolves every path it touches, which on Windows means an
// absolute drive prefix (e.g. D:\home\u\...) picked up from the runner's
// cwd. These fixtures assert against plain POSIX literals, so strip the
// drive and fold separators back to '/' before comparing or looking up.
const posix = (p) => p.replace(/^[A-Za-z]:/, '').split(path.sep).join('/');
function fakes(existing) {
  const trashed = [];
  return {
    trashed,
    trashFn: (p) => { trashed.push(p); return Promise.resolve(); },
    existsFn: (p) => existing.includes(posix(p)),
  };
}

test('agent file inside the project .claude root goes to trash', async () => {
  const f = fakes([P + '/.claude/agents/scribe.md']);
  const out = await deleteItem({ filePath: P + '/.claude/agents/scribe.md', projectPath: P, homeDir: H, ...f });
  assert.deepEqual({ ok: out.ok, target: posix(out.target) }, { ok: true, target: P + '/.claude/agents/scribe.md' });
  assert.deepEqual(f.trashed.map(posix), [P + '/.claude/agents/scribe.md']);
});

// The project's own skills/ is where ScalAI writes, so it has to be deletable —
// and it is a plain folder name, not a dotted one, so the guard list had to
// learn it rather than matching a .claude prefix by luck.
test('a skill in the project\'s own skills/ folder is deletable', async () => {
  const f = fakes([P + '/skills/meeting-notes']);
  const out = await deleteItem({ filePath: P + '/skills/meeting-notes/SKILL.md', projectPath: P, homeDir: H, ...f });
  assert.equal(out.ok, true, out.error);
  assert.deepEqual(f.trashed.map(posix), [P + '/skills/meeting-notes']);
});

// The 60 dangling links a shared-store installer left behind live in folders the
// old guard list had never heard of, so cleaning them up was impossible.
test('a dead link in another tool\'s skills folder can be removed', async () => {
  for (const rel of ['.codex/skills', '.gemini/skills', '.cursor/skills', '.hermes/skills', '.agents/skills', '.config/opencode/skills']) {
    const f = fakes([`${H}/${rel}/media-use`]);
    const out = await deleteItem({ filePath: `${H}/${rel}/media-use/SKILL.md`, projectPath: null, homeDir: H, ...f });
    assert.equal(out.ok, true, `${rel}: ${out.error}`);
    assert.deepEqual(f.trashed.map(posix), [`${H}/${rel}/media-use`]);
  }
});

test('the plugin cache stays off limits even though it is scanned', async () => {
  const f = fakes([H + '/.claude/plugins/cache/m/p/1.0.0/skills/tdd']);
  const out = await deleteItem({ filePath: H + '/.claude/plugins/cache/m/p/1.0.0/skills/tdd/SKILL.md', projectPath: null, homeDir: H, ...f });
  assert.equal(out.ok, false);
  assert.deepEqual(f.trashed, []);
});

test('a skills folder outside the open project is still refused', async () => {
  const f = fakes(['/elsewhere/skills/sneaky']);
  const out = await deleteItem({ filePath: '/elsewhere/skills/sneaky/SKILL.md', projectPath: P, homeDir: H, ...f });
  assert.equal(out.ok, false);
  assert.deepEqual(f.trashed, []);
});

test('a skill SKILL.md trashes the whole skill folder', async () => {
  const f = fakes([H + '/.claude/skills/paper-design']);
  const out = await deleteItem({ filePath: H + '/.claude/skills/paper-design/SKILL.md', projectPath: null, homeDir: H, ...f });
  assert.equal(out.ok, true);
  assert.deepEqual(f.trashed.map(posix), [H + '/.claude/skills/paper-design']);
});

test('paths outside the library roots and the plugin cache are refused', async () => {
  const f = fakes(['/etc/passwd', H + '/.claude/plugins/cache/x/agents/a.md']);
  const a = await deleteItem({ filePath: '/etc/passwd', projectPath: P, homeDir: H, ...f });
  assert.equal(a.ok, false);
  const b = await deleteItem({ filePath: H + '/.claude/plugins/cache/x/agents/a.md', projectPath: P, homeDir: H, ...f });
  assert.equal(b.ok, false);
  assert.deepEqual(f.trashed, []);
});

test('a path that no longer exists reports instead of throwing', async () => {
  const f = fakes([]);
  const out = await deleteItem({ filePath: P + '/.claude/agents/gone.md', projectPath: P, homeDir: H, ...f });
  assert.equal(out.ok, false);
  assert.match(out.error, /gone|Already/i);
});
