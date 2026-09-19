import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'src/main');
const views = fs.readFileSync(path.join(root, 'browser-views.js'), 'utf8');
const mcp = fs.readFileSync(path.join(root, 'browser-mcp.js'), 'utf8');

test('browser grants expose explicit observe/interact modes', () => {
  assert.match(views, /\['observe', 'interact'\]\.includes\(mode\)/);
  assert.match(views, /session\.browserMode = mode/);
});

test('observe mode exposes only non-mutating browser tools', () => {
  assert.match(mcp, /const OBSERVE_TOOLS = new Set/);
  for (const tool of ['browser_click', 'browser_type', 'browser_fill_form', 'browser_drag', 'browser_press_key', 'browser_select_option', 'browser_evaluate', 'browser_handle_dialog']) {
    assert.match(mcp, new RegExp(`'${tool}'`));
  }
  assert.match(mcp, /s\.browserMode === 'observe'/);
  assert.match(mcp, /read-only browser access/);
});

test('interactive mode remains the compatibility default', () => {
  assert.match(views, /mode = 'interact'/);
  assert.match(mcp, /s\.browserMode === 'observe' \? 'observe' : 'interact'/);
});
