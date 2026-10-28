// ponytail: a buildless site only needs syntax and asset checks; browser QA covers interactions.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const script = readFileSync(resolve(root, 'app.js'), 'utf8');
assert.match(html, /<meta\s+[^>]*name=["']viewport["']/i, 'Mobile viewport is required');
assert.match(html, /<html\s+[^>]*lang=/i, 'Document language is required');
assert.match(html, /<title>[^<]+<\/title>/i, 'A descriptive title is required');
for (const [, path] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  if (/^(?:#|https?:|mailto:|data:)/i.test(path)) continue;
  const asset = resolve(root, path.split(/[?#]/)[0]);
  assert(!relative(root, asset).startsWith('..'), `Asset escapes the frontend: ${path}`);
  assert(existsSync(asset), `Missing local asset: ${path}`);
}
const syntax = spawnSync(process.execPath, ['--check', resolve(root, 'app.js')], { encoding: 'utf8' });
assert.equal(syntax.status, 0, syntax.stderr);
assert.doesNotMatch(script, /\b(?:fetch|WebSocket|XMLHttpRequest)\s*\(/, 'The demo must not call a live backend');
assert.match(script, /localStorage/, 'Demo changes must persist locally');
for (const file of readdirSync(root)) {
  assert(!/^\.env(?:\.|$)|\.(?:sqlite3?|db)$/i.test(file), `Runtime data must stay outside the web release: ${file}`);
}
console.log('PASS frontend: local assets, JavaScript syntax, language/viewport, browser-only storage, no live API calls or runtime data');
