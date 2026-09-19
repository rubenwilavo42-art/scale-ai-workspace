import test from 'node:test';
import assert from 'node:assert/strict';
import {
  insideWorkspace, validateWorkspace, normalizeCommand,
  rememberSession, decisionFor, clearSessionPermissions,
  requestPermission, resolvePermission,
} from '../src/main/agent-permissions.js';

test('workspace boundary accepts root and descendants but rejects siblings/parents', () => {
  assert.equal(insideWorkspace('/tmp/project', '/tmp/project'), true);
  assert.equal(insideWorkspace('/tmp/project', '/tmp/project/src'), true);
  assert.equal(insideWorkspace('/tmp/project', '/tmp/project/../other'), false);
  assert.equal(insideWorkspace('/tmp/project', '/tmp/project-x'), false);
});

test('session permission is memory-only and scoped to agent, workspace and capability', () => {
  clearSessionPermissions();
  const input = { workspaceRoot:'/tmp/project', cwd:'/tmp/project', agentId:'codex', command:'codex', scope:'agent-run', credentialAccess:true };
  assert.equal(decisionFor(input), null);
  rememberSession(input);
  assert.equal(decisionFor({ ...input, cwd:'/tmp/project/src', command:'codex --continue abc' }), 'allow');
  assert.equal(decisionFor({ ...input, agentId:'claude' }), null);
  assert.equal(decisionFor({ ...input, workspaceRoot:'/tmp/other' }), null);
  assert.equal(decisionFor({ ...input, scope:'file-ops', credentialAccess:false }), null);
  clearSessionPermissions();
  assert.equal(decisionFor(input), null);
});

test('a session grant does not prompt again for normal follow-up commands', async () => {
  clearSessionPermissions();
  const input = { workspaceRoot:'/tmp/project', cwd:'/tmp/project', agentId:'codex', command:'codex', scope:'agent-run', credentialAccess:true };
  rememberSession(input);
  const sent = [];
  const result = await requestPermission({ ...input, cwd:'/tmp/project/src', command:'codex --continue session-2' }, req => sent.push(req));
  assert.equal(result.ok, true);
  assert.equal(result.decision, 'session');
  assert.equal(result.cached, true);
  assert.equal(sent.length, 0);
  clearSessionPermissions();
});

test('permission requests default to deny and resolve explicitly', async () => {
  const sent = [];
  const pending = requestPermission({ workspaceRoot:'/tmp/project', cwd:'/tmp/project', agentId:'codex', command:'codex' }, (req) => sent.push(req));
  assert.equal(sent.length, 1);
  assert.equal(sent[0].command, 'codex');
  assert.equal(resolvePermission(sent[0].id, 'once').ok, true);
  assert.deepEqual(await pending, { ok:true, decision:'once' });
});

test('unknown decisions are fail-closed', async () => {
  const sent = [];
  const pending = requestPermission({ workspaceRoot:'/tmp/project', cwd:'/tmp/project', agentId:'codex', command:'codex  --help' }, (req) => sent.push(req));
  resolvePermission(sent[0].id, 'something-else');
  const result = await pending;
  assert.equal(result.ok, false);
  assert.equal(result.decision, 'deny');
});

test('commands are normalized for display without changing the actual launch input', () => {
  assert.equal(normalizeCommand('  codex   --help\n\n test  '), 'codex --help test');
});
