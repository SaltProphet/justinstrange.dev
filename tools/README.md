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
characters stop decoding, or if the rewrite order changes.

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

`has` conditions do not work under `vercel dev`, so the rewrite matrix must be
validated on a preview deployment:

```
node tools/verify-ghost.mjs --base https://<preview>.vercel.app/blog/instructions-my-ai-agent-wasnt-supposed-to-follow/
```
