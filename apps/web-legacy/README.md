# OmniChat Web — Legacy Vue 3 build (ARCHIVED)

This directory contains the **old Vue 3 web-component frontend** (chat widget,
chat page, agent widget, admin portal), superseded by the React 19 rebuild in
`apps/web` (2026-08-16).

- **Replacement**: `apps/web` (React 19 + Vite 7 — same custom-element names and
  `dist/omnichat-*.js` bundle filenames, so the demo pages and CDN paths are
  unchanged).
- **Why it's kept**: reference for behavior parity (every feature in this Vue
  build was ported to React) and for comparing old/new behavior.
- **Not part of the Bun workspaces** anymore — to run it standalone:
  `cd apps/web-legacy && bun install && bun run dev`.
- The last built bundles are under `apps/web-legacy/dist/` (committed for
  reference).

Do NOT edit this directory — fixes go into `apps/web`.
