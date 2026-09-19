import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());

test('édition ScalAI uses the requested signature', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const builder = fs.readFileSync(path.join(root, 'electron-builder.yml'), 'utf8');
  const menu = fs.readFileSync(path.join(root, 'src/main/app-menu.js'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'src/renderer/app.js'), 'utf8');
  assert.equal(pkg.author, 'sacalai.vatsk.rub');
  assert.match(builder, /Copyright © 2026 sacalai\.vatsk\.rub/);
  assert.match(menu, /Conçu par sacalai\.vatsk\.rub/);
  assert.match(app, /sacalai\.vatsk\.rub/);
});
