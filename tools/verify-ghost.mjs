#!/usr/bin/env node
// Verify the deployed cloaking matrix from outside.
//
//   node tools/verify-ghost.mjs
//   node tools/verify-ghost.mjs --base http://localhost:3000/blog/.../
//
// Exit code 0 = every client got the expected variant.
//
// Uses node:http(s) rather than fetch: undici rewrites sec-fetch-mode to
// "cors", which would make the navigation case untestable.
//
import http from 'node:http';
import https from 'node:https';

const DEFAULT_BASE =
  'https://www.justinstrange.dev/blog/instructions-my-ai-agent-wasnt-supposed-to-follow/';

const args = process.argv.slice(2);
const baseArg = args.indexOf('--base');
const base = baseArg !== -1 ? args[baseArg + 1] : DEFAULT_BASE;

const CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const SAFARI =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const FIREFOX =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0';

const NAV = { 'sec-fetch-mode': 'navigate', 'sec-fetch-dest': 'document' };

const cases = [
  ['chrome', CHROME, { ...NAV, 'sec-ch-ua': '"Chromium";v="131", "Google Chrome";v="131"' }, 'clean'],
  ['safari', SAFARI, NAV, 'clean'],
  ['firefox', FIREFOX, NAV, 'clean'],
  ['googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', {}, 'clean'],
  ['bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)', {}, 'clean'],
  ['twitterbot', 'Twitterbot/1.0', {}, 'clean'],
  ['headless', CHROME, { 'sec-ch-ua': '"HeadlessChrome";v="131", "Chromium";v="131"' }, 'agent'],
  ['headless+navigate', CHROME, { ...NAV, 'sec-ch-ua': '"HeadlessChrome";v="131"' }, 'agent'],
  ['claudebot', 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)', {}, 'agent'],
  ['claudebot+navigate', 'Mozilla/5.0 (compatible; ClaudeBot/1.0)', NAV, 'agent'],
  ['gptbot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot', {}, 'agent'],
  ['curl', 'curl/8.4.0', {}, 'agent'],
  ['python', 'python-requests/2.31.0', {}, 'agent'],
  ['go', 'Go-http-client/1.1', {}, 'agent'],
  ['node-fetch', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)', {}, 'agent'],
  ['node-cors', CHROME, { 'sec-fetch-mode': 'cors' }, 'agent'],
  ['browser-like agent', CHROME, {}, 'agent'],
  ['empty-ua', '', {}, 'agent'],
];

function request(url, headers) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const mod = target.protocol === 'http:' ? http : https;
    const req = mod.request(
      target,
      { method: 'GET', headers, timeout: 30000 },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () =>
          resolve({ status: res.statusCode, headers: res.headers, body })
        );
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

let failures = 0;
let tells = 0;

for (const [name, ua, extra, expected] of cases) {
  const sep = base.includes('?') ? '&' : '?';
  const url = `${base}${sep}cb=${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
  try {
    const res = await request(url, { 'user-agent': ua, ...extra });
    const isAgent = res.body.includes('GHOST-OFFSCREEN-7F3A');
    const got = isAgent ? 'agent' : 'clean';
    const meta =
      res.body.match(/name="x-ghost-variant" content="([^"]*)"/)?.[1] ?? '-';
    const cd = String(res.headers['content-disposition'] ?? '');
    const cdTell = /filename=/.test(cd);
    if (cdTell) tells += 1;
    const pass = got === expected;
    if (!pass) failures += 1;
    console.log(
      `${pass ? 'PASS' : 'FAIL'}  ${name.padEnd(19)} expected=${expected.padEnd(5)} ` +
        `got=${got.padEnd(5)} meta=${String(meta).padEnd(5)} ` +
        `cd=${cdTell ? 'filename' : 'clean'} status=${res.status}`
    );
  } catch (err) {
    failures += 1;
    console.log(`FAIL  ${name.padEnd(19)} request error: ${err.message}`);
  }
}

if (tells) {
  console.log(
    `\nNOTE: ${tells} response(s) still expose the file name via Content-Disposition`
  );
}

if (failures) {
  console.log(`\n${failures} case(s) failed`);
  process.exit(1);
}
console.log('\nall cases matched');
