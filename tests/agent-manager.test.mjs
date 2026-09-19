import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { normalizeVersion, versionCommand, capabilitySummary, managerState, runVersion } = require('../src/main/agent-manager.js');

test('normalizes common CLI version output', () => {
  assert.equal(normalizeVersion('Claude Code v1.2.3'), '1.2.3');
  assert.equal(normalizeVersion('codex 0.139.0\n'), '0.139.0');
  assert.equal(normalizeVersion('OpenCode v2.1.0-beta.1'), '2.1.0-beta.1');
});

test('version command is argv-only', () => {
  assert.deepEqual(versionCommand({ bin: 'claude' }), { file: 'claude', args: ['--version'] });
  assert.equal(versionCommand(null), null);
});

test('capabilities reflect verified lifecycle commands', () => {
  const caps = capabilitySummary({ bin: 'claude', install: 'install', lifecycle: { statusCmd: 'x', login: 'login', logout: 'logout', health: 'doctor', configPath: '~/.claude.json', accountUrl: 'https://example.test' } });
  assert.deepEqual(caps, { install:true, detect:true, status:true, signIn:true, signOut:true, switchAccount:true, healthCheck:true, accountPage:true, config:true });
});

test('manager state never contains credentials', () => {
  const state = managerState({ id:'codex', found:true, path:'/usr/bin/codex', pathShort:'~/bin/codex', lifecycle:{statusFichiers:['~/.codex/auth.json']} }, { signedIn:true, label:'signed in through your ChatGPT account', rows:[] }, { version:'1.0.0' });
  assert.equal(state.version, '1.0.0');
  assert.equal(state.signedIn, true);
  assert.ok(!JSON.stringify(state).includes('auth.json'));
  assert.ok(!JSON.stringify(state).includes('token'));
});

test('runVersion uses the resolved executable and argv without a shell', async () => {
  const calls = [];
  const out = await runVersion({ bin:'/opt/bin/claude' }, { exec:(file,args,opts,cb)=>{ calls.push([file,args,opts]); cb(null,'claude v9.8.7',''); } });
  assert.deepEqual(calls[0].slice(0,2), ['/opt/bin/claude',['--version']]);
  assert.equal(out.version,'9.8.7');
});
