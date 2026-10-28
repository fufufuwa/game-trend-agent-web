// ponytail: a buildless site needs asset checks and one state regression; browser QA covers layout and real DOM behavior.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import { randomUUID } from 'node:crypto';

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

// ponytail: the tiny DOM only routes the real script's events; use browser QA for accessibility and rendering.
const storage = new Map();
function boot() {
  const elements = new Map(), listeners = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      id, dataset: {}, value: '', innerHTML: '', textContent: '', hidden: false,
      classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, focus() {},
      addEventListener(type, handler) { listeners.set(`${id}:${type}`, handler); },
    });
    return elements.get(id);
  };
  const document = {
    documentElement: element('html'), body: element('body'), getElementById: element,
    querySelectorAll: () => [], querySelector: () => null,
    addEventListener(type, handler) { listeners.set(type, handler); },
  };
  const window = {};
  runInNewContext(script, { document, window, URL, structuredClone, Intl, Date, Math,
    crypto: { randomUUID }, setTimeout: () => 0, clearTimeout() {},
    navigator: { clipboard: { writeText: async () => {} } },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
  });
  return {
    state: () => window.GameTrendDemo.getState(), count: window.GameTrendDemo.weightedLength,
    click: action => listeners.get('click')({ preventDefault() {}, target: { closest: selector => selector === '[data-action]' ? { dataset: { action } } : null } }),
    input: value => listeners.get('input')({ target: { id: 'draft-editor', value } }),
    language: () => listeners.get('language-toggle:click')(), element,
    publish: () => listeners.get('submit')({ preventDefault() {}, target: { id: 'publish-form' } }),
  };
}
let demo = boot();
const current = () => { const state = demo.state(); return state.versions[state.selectedTopic].find(item => item.id === state.selectedVersions[state.selectedTopic]); };
assert.equal(demo.count('ABC中文'), 7);
assert.equal(demo.count('https://example.com/long/path'), 23);
assert.equal(demo.count('e\u0301'), demo.count('é'));
assert.equal(demo.count('👨‍👩‍👧‍👦'), 2);
demo.click('edit');
const original = current();
assert.equal(original.locked, true, 'Starting editing must lock before save');
demo.input('尚未保存的人工作品');
assert.equal(current().content, original.content);
demo = boot();
assert.equal(current().locked, true);
assert.equal(current().buffer, '尚未保存的人工作品', 'Unsaved input must survive reload');
demo.click('regenerate');
assert.equal(demo.state().versions[demo.state().selectedTopic].length, 6);
assert.equal(current().id, original.id, 'Generation must preserve the selected manual version');
assert.equal(current().content, original.content);
assert.deepEqual(current().evidence, original.evidence);
demo.click('save'); demo.click('approve');
assert.equal(current().status, 'approved');
demo.input('人工修改已批准稿'); demo.click('save');
assert.equal(current().status, 'pending', 'A manual save must revoke approval');
demo.language();
assert.equal(demo.state().language, 'en');
assert.equal(current().content, '人工修改已批准稿', 'Language switching must preserve human text');
assert.equal(demo.element('view-title').textContent, 'Good stories. Your take.');
demo.click('approve'); demo.click('publish');
demo.element('published-text').value = 'Actual manually published text';
demo.element('published-date').value = '2026-10-28T12:00';
demo.element('published-url').value = 'https://x.com/demo/status/123';
demo.publish();
const snapshot = demo.state().publications;
assert.equal(snapshot.length, 1);
assert.equal(snapshot[0].text, 'Actual manually published text');
demo.input('Attempt to change published text');
demo.click('save'); demo.click('regenerate'); demo.publish(); demo = boot();
assert.deepEqual(demo.state().publications, snapshot, 'Published snapshots must survive later actions and reload');
console.log('PASS demo state: weighted estimate, immediate lock, unsaved reload, append-only generation, approval revoked on save, bilingual human text, immutable post snapshot');
