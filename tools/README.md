# tools

Development helpers for the ghost-mode probe page. Excluded from the deployed
site by `.vercelignore`.

## Commands

| Command | Purpose |
| --- | --- |
| `node tools/ghost-page.mjs` | Regenerate `agent.html` from `clean.html` |
| `node tools/check.mjs` | Page-pair, token, tag-character and routing assertions |
| `node tools/verify-ghost.mjs` | UA/navigation matrix against a deployed URL |
| `node tools/verify-ghost.mjs --base <url>` | Same, against a preview or local URL |

`check.mjs` exits non-zero if `agent.html` drifts from a fresh build of
`clean.html`, if a probe token leaks into the clean copy, if the Unicode tag
characters stop decoding, if a probe moves out of its assigned position, or if
the rewrite order changes.

## Layout

| Token | Channel | Position | Style |
| --- | --- | --- | --- |
| `GHOST-OFFSCREEN-7F3A` | off-screen | inline, end of last article section | directive |
| `GHOST-DISPLAY-7F3A` | `display:none` | trailing, after footer | descriptive |
| `GHOST-UNICODE-7F3A` | tag characters | trailing, after footer | descriptive |
| `GHOST-NEUTRAL-7F3A` | `visibility:hidden` | trailing, after footer | neutral fact, no instruction |

The neutral canary exists to separate two hypotheses: "the model refuses
probe-shaped text" and "the model will not reproduce any hidden value." It is
deliberately not framed as a probe.

The inline anchor is `</section></main>` in `clean.html`. If a post edit
removes it, the build fails rather than silently reverting to trailing probes.

## Local detector results (P6)

Served the post directory locally and ran Hollowtext against both copies.

`scripts/scan-unicode.js`:

- `agent.html` — `highest=high`, 18 tag characters, decoded
  `GHOST-UNICODE-7F3A`
- `clean.html` — `clean`, `highest=none`

`scripts/render.js` (UA `GPTBot/1.0`):

- `agent.html` — exit 2. Off-screen geometry, `display:none` node,
  `aria-hidden` tag characters, one instruction-shaped hidden fragment,
  invisible Unicode at `high`.
- `clean.html` — exit 2, but only baseline site noise: the hidden nav, the
  theme script, and the article's own verbatim injection excerpt.
  `unicode highest=none`, no probe nodes.

The probe is detectable by the project's own tooling, and the clean copy is
not artificially flagged.

## Routing

Rule order matters: crawler, then agent UA, then headless hint, then
`sec-fetch-mode: navigate` to the clean page, then the agent fallback. Putting
the navigation rule last means a headless browser or a self-identifying agent
is never mistaken for a human.

The verifier uses `node:https` on purpose. Node's `fetch` (undici) rewrites
`sec-fetch-mode` to `cors`, so a fetch-based test can never exercise the
navigation branch.

`Vary` is deliberately not sent: it announces header-based cloaking, and
Vercel's cache key is already the rewritten destination. A `Content-Disposition:
inline` rule attempts to suppress the static handler's
`filename="agent.html"`; `verify-ghost.mjs` reports whether that took effect.

`has` conditions do not work under `vercel dev`, so the rewrite matrix must be
validated on a preview deployment:

```
node tools/verify-ghost.mjs --base https://<preview>.vercel.app/blog/instructions-my-ai-agent-wasnt-supposed-to-follow/
```
