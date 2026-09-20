import test from 'node:test';
import assert from 'node:assert/strict';
import { validServiceId, validateRemoteUrl, validateEnv, validateEntry, validateProjectPath, sanitizeForRenderer, bundlePathAllowed } from '../src/main/mcp-security.js';

const ROOT = process.cwd();

test('validates MCP ids without shell syntax', () => {
  assert.equal(validServiceId('notion'), true);
  assert.equal(validServiceId('my.server-1'), true);
  assert.equal(validServiceId('x;touch-pwned'), false);
  assert.equal(validServiceId('../escape'), false);
});

test('requires HTTPS for remote MCP except local development HTTP', () => {
  assert.equal(validateRemoteUrl('https://example.com/mcp').ok, true);
  assert.equal(validateRemoteUrl('http://localhost:3000/mcp').ok, true);
  assert.equal(validateRemoteUrl('http://127.0.0.1:3000/mcp').ok, true);
  assert.equal(validateRemoteUrl('http://example.com/mcp').ok, false);
  assert.equal(validateRemoteUrl('file:///tmp/x').ok, false);
});

test('rejects environment injection variables', () => {
  assert.equal(validateEnv({ API_KEY: 'secret' }).ok, true);
  assert.equal(validateEnv({ NODE_OPTIONS: '--require /tmp/x' }).ok, false);
  assert.equal(validateEnv({ LD_PRELOAD: '/tmp/x' }).ok, false);
  assert.equal(validateEnv({ 'BAD-NAME': 'x' }).ok, false);
});

test('validates local and remote entries', () => {
  assert.equal(validateEntry({ command: 'npx', args: ['-y', 'demo'], env: { API_KEY: 'x' } }).ok, true);
  assert.equal(validateEntry({ url: 'https://example.com/mcp' }).ok, true);
  assert.equal(validateEntry({ url: 'http://example.com/mcp' }).ok, false);
  assert.equal(validateEntry({ command: '' }).ok, false);
});

test('project scope requires an existing directory', () => {
  assert.equal(validateProjectPath(ROOT, 'project').ok, true);
  assert.equal(validateProjectPath('/definitely/not/a/real/folder', 'project').ok, false);
  assert.equal(validateProjectPath(null, 'user').ok, true);
  assert.equal(validateProjectPath(ROOT, 'nope').ok, false);
});

test('renderer sanitizer exposes env names but never secret values', () => {
  const secretValue = 'S'.repeat(24);
  const safe = sanitizeForRenderer({ command: 'npx', args: ['demo'], env: { API_KEY: secretValue } });
  assert.deepEqual(safe.envKeys, ['API_KEY']);
  assert.equal(JSON.stringify(safe).includes(secretValue), false);
});

test('bundle paths stay inside managed bundle directory', () => {
  assert.equal(bundlePathAllowed('/home/test/.nami/bundles/demo', '/home/test'), true);
  assert.equal(bundlePathAllowed('/home/test/.nami/bundles/../settings', '/home/test'), false);
  assert.equal(bundlePathAllowed('/tmp/demo', '/home/test'), false);
});
