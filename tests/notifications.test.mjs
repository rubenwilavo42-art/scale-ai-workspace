import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { shouldNotify, notificationCopy } = require('../src/main/notifications.js');

test('notifications stay silent when the window is focused', () => {
  assert.equal(shouldNotify({ enabled: true, appFocused: true, deliberate: false, code: 0 }), false);
});
test('deliberate session teardown never notifies', () => {
  assert.equal(shouldNotify({ enabled: true, appFocused: false, deliberate: true, code: 0 }), false);
});
test('disabled notifications never notify', () => {
  assert.equal(shouldNotify({ enabled: false, appFocused: false, deliberate: false, code: 1 }), false);
});
test('background completion notifies', () => {
  assert.equal(shouldNotify({ enabled: true, appFocused: false, deliberate: false, code: 0 }), true);
});
test('background failure notifies', () => {
  assert.equal(shouldNotify({ enabled: true, appFocused: false, deliberate: false, code: 2 }), true);
});
test('notification copy distinguishes success and failure', () => {
  assert.match(notificationCopy({ title: 'Claude', code: 0 }).title, /terminé/);
  assert.match(notificationCopy({ title: 'Claude', code: 1, note: 'échec' }).title, /attention/);
  assert.equal(notificationCopy({ title: 'Claude', code: 1, note: 'échec' }).body, 'échec');
});
