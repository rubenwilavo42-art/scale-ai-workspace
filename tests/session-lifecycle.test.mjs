import test from 'node:test';
import assert from 'node:assert/strict';
import { isWorkspaceSession, sessionState, sessionAction, restartOptions } from '../src/renderer/session-lifecycle.mjs';

test('workspace sessions have explicit lifecycle states', () => {
  assert.equal(sessionState({ kind: 'claude' }), 'running');
  assert.equal(sessionState({ kind: 'claude', working: true }), 'working');
  assert.equal(sessionState({ kind: 'claude', attention: true }), 'attention');
  assert.equal(sessionState({ kind: 'claude', stopping: true }), 'stopping');
  assert.equal(sessionState({ kind: 'claude', exited: true }), 'exited');
  assert.equal(sessionState({ kind: 'run', oneShot: true, commandDone: true }), 'finished');
});

test('stop/restart action follows lifecycle state', () => {
  assert.equal(sessionAction({ kind: 'claude' }), 'stop');
  assert.equal(sessionAction({ kind: 'claude', stopping: true }), 'none');
  assert.equal(sessionAction({ kind: 'claude', exited: true }), 'restart');
  assert.equal(sessionAction({ kind: 'editor' }), 'none');
});

test('restart options preserve agent identity and workspace but drop renderer state', () => {
  const p = {
    id: 'old', kind: 'claude', title: 'Mon projet', titleSource: 'prompt', code: 'CC',
    cwd: '/tmp/project', command: undefined, program: 'claude', args: ['--x'], seed: 'bonjour',
    cont: false, sid: 'session-1', acpSid: 'acp-1', agentId: 'claude', purpose: 'agent',
    watchDone: false, oneShot: false, exited: true, stopping: false, attention: true,
  };
  const r = restartOptions(p);
  assert.equal(isWorkspaceSession(p), true);
  assert.equal(r.cwd, p.cwd);
  assert.equal(r.agentId, p.agentId);
  assert.equal(r.sid, p.sid);
  assert.deepEqual(r.args, ['--x']);
  assert.equal('id' in r, false);
  assert.equal('exited' in r, false);
  assert.equal('attention' in r, false);
});
