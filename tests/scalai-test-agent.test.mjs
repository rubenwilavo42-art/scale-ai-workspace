import test from 'node:test';
import assert from 'node:assert/strict';
import { detectAgents, agentById } from '../src/main/agents-detect.js';

test('dev test agent is hidden by default', async () => {
  const rows = await detectAgents({ env: {}, exec: async () => '' });
  assert.equal(rows.some((a) => a.id === 'scalai-test'), false);
});

test('dev test agent appears only when SCALAI_DEV_AGENT is enabled', async () => {
  const rows = await detectAgents({ env: { SCALAI_DEV_AGENT: '1' }, exec: async (bin) => bin === 'scalai-test-agent' ? '/tmp/scalai-test-agent' : '' });
  const agent = rows.find((a) => a.id === 'scalai-test');
  assert.equal(agent?.found, true);
  assert.equal(agentById('scalai-test')?.bin, 'scalai-test-agent');
});
