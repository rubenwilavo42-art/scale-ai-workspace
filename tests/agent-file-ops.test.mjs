import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { OPERATIONS, realInside, requestFor, authorize } from '../src/main/agent-file-ops.js';
import { clearSessionPermissions, resolvePermission } from '../src/main/agent-permissions.js';

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'scalai-files-')); }

test('realInside rejects symlink escapes', () => {
  const root = tmp(), outside = tmp();
  fs.writeFileSync(path.join(outside, 'secret.txt'), 'secret');
  fs.symlinkSync(outside, path.join(root, 'link'), 'dir');
  assert.equal(realInside(root, path.join(root, 'link', 'secret.txt')), false);
});

test('file permission request exposes operation and target without credentials', async () => {
  clearSessionPermissions();
  const root = tmp();
  const sent = [];
  const pending = authorize({ operation: OPERATIONS.write, agentId: 'codex', workspaceRoot: root, cwd: root, target: path.join(root, 'a.txt') }, p => sent.push(p));
  assert.equal(sent.length, 1);
  assert.equal(sent[0].kind, 'file-write');
  assert.match(sent[0].command, /Modifier le workspace/);
  assert.equal(Object.hasOwn(sent[0], 'settings'), false);
  resolvePermission(sent[0].id, 'once');
  assert.deepEqual(await pending, { ok: true, decision: 'once' });
});

test('workspace escape is denied before permission prompt', async () => {
  const root = tmp(), outside = tmp(), sent = [];
  const result = await authorize({ operation: OPERATIONS.write, agentId: 'claude', workspaceRoot: root, cwd: root, target: path.join(outside, 'x.txt') }, p => sent.push(p));
  assert.equal(result.ok, false);
  assert.equal(sent.length, 0);
});

test('request descriptor stays descriptive and bounded', () => {
  const req = requestFor({ operation: OPERATIONS.rename, agentId: 'opencode', workspaceRoot:'/tmp/p', cwd:'/tmp/p', target:'/tmp/p/a' });
  assert.equal(req.kind, 'file-rename');
  assert.equal(req.credentialAccess, false);
});
