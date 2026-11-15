#!/usr/bin/env node
// Fails if any HTML page is missing the shared stylesheet, loads another
// site stylesheet, or carries a page-specific visual marker.
// Usage: node scripts/check-style.mjs  (run from the repo root; no build step)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const SHARED = '/assets/styles.css';
const skip = new Set(['.git', 'node_modules', '_next', 'scripts']);
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
})(root);

const errors = [];
for (const file of pages) {
  const rel = relative(root, file);
  const html = readFileSync(file, 'utf8');
  const sheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]
    .map((m) => (m[0].match(/href="([^"]+)"/) || [])[1])
    .filter((h) => h && !h.startsWith('/_next/'));
  if (!sheets.includes(SHARED)) errors.push(`${rel}: missing ${SHARED}`);
  for (const h of sheets) if (h !== SHARED) errors.push(`${rel}: extra stylesheet ${h}`);
  if (/\bdata-visual=/.test(html)) errors.push(`${rel}: page-specific data-visual marker`);
  if (/<style[\s>]/i.test(html)) errors.push(`${rel}: inline <style> block`);
}
const css = existsSync(join(root, 'assets/styles.css')) ? readFileSync(join(root, 'assets/styles.css'), 'utf8') : '';
if (!css) errors.push('assets/styles.css: missing');
if (/@import\b/.test(css)) errors.push('assets/styles.css: @import of another stylesheet');
if (/@scope\b|data-visual/.test(css)) errors.push('assets/styles.css: page-scoped visual rules');

if (errors.length) {
  console.error(`check-style: FAIL (${errors.length})`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`check-style: OK — ${pages.length} pages load only ${SHARED}, no page-specific markers`);
