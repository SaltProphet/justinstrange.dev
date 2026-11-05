# Agent Instructions

## Project Status

- This repository contains the recovered static HTML export of the Justin Strange portfolio.
- Vercel serves the repository root as an Other framework project with no build command and output directory `.`.
- The site is a multi-page personal systems-architecture portfolio; preserve the existing route hierarchy and root-relative asset paths.

## Architecture

- Each public route is represented by an `index.html` file, with shared styles and behavior under `assets/`.
- Keep the static export self-contained: use root-relative paths for internal navigation and assets, and do not reintroduce the removed Next.js runtime without an explicit migration.
- The export includes Work, Research, Blog, About, Contact, and project/article detail routes.

## Content Rules

- Treat the recovered HTML and media files as the shipped content source.
- Preserve canonical URLs, metadata, accessible labels, and explicit external-link destinations when editing pages.

## UI And Quality

- Preserve the existing editorial visual language, semantic HTML, keyboard navigation, visible focus states, responsive behavior, and reduced-motion behavior.
- Before shipping changes, verify all 13 routes, internal links, media files, theme switching, desktop rendering, and mobile rendering.

## Source Of Truth

- Prefer `vercel.json`, `export-validation.json`, and the deployed files over prose when they disagree.
- Do not commit the source ZIP or its temporary extraction directory.

## Verified Commands

- Validate static links and assets with the repository's route-check script when present.
- Serve the root with a static HTTP server for browser verification.
- Deploy with the authenticated Vercel CLI using the existing project/domain configuration.
