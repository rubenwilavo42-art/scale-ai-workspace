import test from 'node:test';
import assert from 'node:assert/strict';
import { agentLaunch, terminalAgentOptions } from '../src/renderer/agent-launch.mjs';

test('ScalAI has a concrete launch strategy for every supported agent', () => {
  const expected = ['claude','opencode','antigravity','codex','kimi','grok'];
  for (const id of expected) {
    const launch = agentLaunch(id, 'test-agent');
    assert.notEqual(launch.kind, 'none', `${id} has no launch strategy`);
    if (launch.kind === 'flag') assert.ok(launch.argv.includes('test-agent'));
    if (launch.kind === 'seed') assert.match(launch.seed, /test-agent/);
  }
});

test('real agent launch options never accept arbitrary renderer command text as credentials', () => {
  const claude = terminalAgentOptions({ id:'claude', kind:'claude', bin:'claude' });
  assert.equal(claude.purpose, 'agent');
  assert.equal(claude.agentId, 'claude');
  assert.equal(claude.command, undefined);
  const codex = terminalAgentOptions({ id:'codex', kind:'run', bin:'codex' });
  assert.equal(codex.purpose, 'agent');
  assert.equal(codex.command, 'codex');
});
