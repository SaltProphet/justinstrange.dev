#!/usr/bin/env node
// Local correctness checks for the ghost-mode page pair and routing config.
//
//   node tools/check.mjs
//
// Exit code 0 = all good, 1 = something drifted.
//
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  CLEAN_PATH,
  AGENT_PATH,
  TOKENS,
  buildAgentHtml,
  fromTagChars,
} from './ghost-page.mjs';

let failures = 0;
const ok = (name) => console.log(`  PASS  ${name}`);
const bad = (name, detail) => {
  failures += 1;
  console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
};
const check = (name, fn) => {
  try {
    const detail = fn();
    if (detail) bad(name, detail);
    else ok(name);
  } catch (err) {
    bad(name, err.message);
  }
};

const clean = readFileSync(CLEAN_PATH, 'utf8');
const agent = readFileSync(AGENT_PATH, 'utf8');
const vercel = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));

console.log('Page pair');
check('agent.html matches a fresh build from clean.html', () => {
  const expected = buildAgentHtml(clean);
  return expected === agent ? null : 'run `node tools/ghost-page.mjs`';
});
check('clean.html carries no probe tokens', () => {
  const found = Object.values(TOKENS).filter((t) => clean.includes(t));
  return found.length ? `found ${found.join(', ')}` : null;
});
check('agent.html carries every literal probe token', () => {
  // The unicode token is stored as tag characters, not ASCII; the next check
  // decodes it. Only the plain-text tokens are checked for literal presence.
  const missing = [TOKENS.offscreen, TOKENS.display].filter(
    (t) => !agent.includes(t)
  );
  return missing.length ? `missing ${missing.join(', ')}` : null;
});
check('tag characters decode to the unicode token', () => {
  const decoded = fromTagChars(agent);
  return decoded === TOKENS.unicode ? null : `decoded "${decoded}"`;
});
check('agent.html has no robots noindex meta', () =>
  agent.includes('<meta name="robots"') ? 'found robots meta' : null
);
check('clean.html carries the demo note', () =>
  clean.includes('id="ghost-demo-note"') ? null : 'note missing'
);
check('agent.html omits the demo note', () =>
  agent.includes('id="ghost-demo-note"')
    ? 'note leaked into the probe copy'
    : null
);

console.log('Routing');
const rewrites = vercel.rewrites ?? [];
const dest = (r) => r.destination ?? '';
const hasHeader = (r, key, re) =>
  (r.has ?? []).some(
    (h) =>
      h.key.toLowerCase() === key &&
      (typeof h.value === 'string'
        ? h.value === re
        : new RegExp(h.value.re).test(re))
  );

check('at least five rewrite rules', () =>
  rewrites.length >= 5 ? null : `found ${rewrites.length}`
);
check('rule 1 sends search crawlers to clean.html', () => {
  const r = rewrites[0];
  if (!r || !dest(r).endsWith('clean.html')) return 'not clean.html';
  return hasHeader(r, 'user-agent', 'Googlebot') ? null : 'no crawler matcher';
});
const agentRuleIndex = rewrites.findIndex(
  (r) => dest(r).endsWith('agent.html') && hasHeader(r, 'user-agent', 'ClaudeBot/1.0')
);
const navigateRuleIndex = rewrites.findIndex(
  (r) => dest(r).endsWith('clean.html') && hasHeader(r, 'sec-fetch-mode', 'navigate')
);

check('an agent-UA rule targets agent.html', () =>
  agentRuleIndex !== -1 ? null : 'no agent UA matcher'
);
check('a headless sec-ch-ua rule targets agent.html', () => {
  const found = rewrites.some(
    (r) => dest(r).endsWith('agent.html') && hasHeader(r, 'sec-ch-ua', 'HeadlessChrome')
  );
  return found ? null : 'no headless matcher';
});
check('a navigation rule targets clean.html', () =>
  navigateRuleIndex !== -1 ? null : 'no navigate matcher'
);
check('agent rules precede the navigation rule', () => {
  if (agentRuleIndex === -1 || navigateRuleIndex === -1) return 'missing rule';
  return agentRuleIndex < navigateRuleIndex
    ? null
    : 'navigation would override an identifying agent UA';
});
check('final rule is an unconditional agent.html fallback', () => {
  const r = rewrites[rewrites.length - 1];
  if (!r) return 'no rules';
  if (r.has || r.missing) return 'fallback has conditions';
  return dest(r).endsWith('agent.html') ? null : 'not agent.html';
});
check('clean.html is marked as the clean variant', () =>
  clean.includes('<meta name="x-ghost-variant" content="clean"/>')
    ? null
    : 'missing variant marker'
);
check('agent.html is marked as the agent variant', () =>
  agent.includes('<meta name="x-ghost-variant" content="agent"/>')
    ? null
    : 'missing variant marker'
);
check('Vary covers the routing headers', () => {
  const found = (vercel.headers ?? []).some((h) =>
    (h.headers ?? []).some(
      (x) =>
        x.key.toLowerCase() === 'vary' &&
        /user-agent/.test(x.value) &&
        /sec-fetch-mode/.test(x.value)
    )
  );
  return found ? null : 'no Vary rule';
});
check('direct /agent.html requests are noindex', () => {
  const found = (vercel.headers ?? []).some(
    (h) =>
      h.source?.endsWith('/agent.html') &&
      (h.headers ?? []).some(
        (x) =>
          x.key.toLowerCase() === 'x-robots-tag' && /noindex/i.test(x.value)
      )
  );
  return found ? null : 'no X-Robots-Tag rule';
});

if (failures) {
  console.log(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
