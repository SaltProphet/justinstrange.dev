# Agent Instructions

## Project Status

- This workspace is currently an empty scaffold; do not assume package scripts, dependencies, routes, or test commands exist until they are added and verified.
- The intended stack is Next.js App Router, TypeScript, Tailwind CSS, MDX content, and Vercel-compatible deployment.
- The site is a multi-page personal systems-architecture portfolio, not a single landing page; preserve the route hierarchy as features are implemented.

## Architecture

- Keep content separate from presentation: projects, articles, experiments, notes, and page copy belong in `content/` and should not require editing React components.
- Put route entrypoints under `src/app/`, reusable UI under `src/components/`, and content loading, validation, search, metadata, and other shared logic under `src/lib/`.
- Use the main navigation only for Work, Writing, Lab, About, and Contact; expose supporting routes such as Approach, Notes, Now, Uses, Archive, and Search contextually or in the footer.
- Treat Work and Lab as different presentation modes over potentially shared content infrastructure: Work documents finished or operational work, while Lab records experiments and unfinished explorations.
- Case studies must distinguish context, constraints, architecture, decisions, implementation, verification, results, limitations, and artifacts rather than presenting unsupported marketing claims.

## Content Rules

- Validate frontmatter before rendering content. At minimum, preserve stable `title`, `slug`, `summary`, `visibility`, `date`, and `tags` fields, plus type-specific metadata.
- Do not collapse project states into one generic status; use `Concept`, `Prototype`, `In Development`, `Operational`, or `Archived` accurately.
- Keep drafts and non-public content out of public routes, search, feeds, sitemap output, and social metadata.
- Adding or editing content should not require changing a page template unless the schema or intended presentation genuinely changes.

## UI And Quality

- Control color, typography, spacing, and responsive behavior through centralized design tokens; keep the chosen visual direction consistent across all routes.
- Favor an editorial, documentation-led experience with clear hierarchy over a generic portfolio landing-page pattern. The home page is a navigational overview, not a sales funnel.
- Preserve semantic HTML, keyboard navigation, visible focus states, adequate contrast, responsive layouts, optimized assets, and reduced-motion behavior.
- New routes should include appropriate metadata and be covered by route, content, accessibility, and production-build verification when those test systems exist.
- Before shipping frontend changes, verify desktop and mobile rendering, navigation and active-route behavior, dynamic content resolution, and broken links.

## Source Of Truth

- Prefer executable configuration and scripts over prose when they disagree. Update this file when the real stack, commands, directory ownership, or workflow changes.
- Do not invent setup, test, deployment, or environment-variable instructions here; document them only after they exist in the repository and have been verified.

## Verified Commands

- Install dependencies with `npm install`.
- Run the development server with `npm run dev`.
- Run linting with `npm run lint` and type checking with `npm run typecheck`.
- Verify a production build with `npm run build`.
