# AGENTS.md — OmniChat

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

------

Compact instruction file for AI agents. High-signal, no fluff.
If you change something structural, update this file too.

## Elevator summary

- Bun workspace monorepo, 2 packages:
  - `apps/api` — NestJS + Prisma + Socket.io (port 3001)
  - `apps/web` — Vue 3 → web components via Vite (4 bundles)
- All commands run from repo root unless noted.
- **No test suite / lint / typecheck** anywhere. `vue-tsc` and `playwright` are in deps but unused.
- AI agent via Vercel AI SDK (providers configured in DB via Admin UI).
- Redis optional — falls back to in-memory if `REDIS_URL` not set.

## Essential commands

| Command | What it does |
|---|---|
| `bun run dev:api` | NestJS on 3001 (hot-reload via `--watch`) |
| `bun run dev:web` | Vite dev on **port 3000**, proxies `/api` (strips prefix) and `/socket.io` (ws) to 3001 |
| `bun run build:api` | Output: `apps/api/dist/` |
| `bun run build:web` | Builds all 4 bundles sequentially |
| `bun run prisma:generate` | Prisma client from active schema |
| `bun run prisma:push` | Push schema to DB |
| `bun run prisma:studio` | Prisma Studio on port 5555 |
| `bun run use-provider <provider>` | Switch DB: `mysql\|postgresql\|mongodb` (also accepts `postgres`, `mongo`) |

Individual web builds (run from `apps/web` or `cd apps/web && bun run build:xxx`):
- `build:admin-portal` → `dist/omnichat-admin-portal.js`
- `build:chat-widget` → `dist/omnichat-chat-widget.js`
- `build:agent-widget` → `dist/omnichat-agent-widget.js`
- `build:chat-page` → `dist/omnichat-chat-page.js`

**Root shortcuts `build:admin`, `build:client`, `build:admin-widget` are broken** — script names don't match web package. Use the per-target names above instead.

## Repo layout (agent-relevant)

- `apps/api/src/main.ts` — entry point. Hard-exits in production if `JWT_SECRET` or `ADMIN_API_KEY` still match defaults. CORS is **DB-driven** (read from `SiteConfig.allowedOrigins`; localhost always allowed).
- `apps/api/src/app.module.ts` — all modules wired. Key: `ChatModule`+`ChatGateway`, `AuthModule`+`AdminSecurityModule`, `AiModule`+`RagModule`, `UploadModule`, `SessionStateModule` (Redis or in-memory).
- `apps/api/src/prisma/prisma.service.ts` — Prisma singleton.
- `apps/api/prisma/schema.prisma` — ACTIVE schema (overwritten by `use-provider.sh`). Provider overlays: `schema.{mysql,postgresql,mongodb}.prisma`.
- `apps/api/src/rag/` — RAG vector store **varies by DB provider**: separate implementations for MongoDB / PostgreSQL / MySQL.
- `apps/web/vite.config.*.ts` — 4 IIFE build configs + 1 dev config (`vite.config.ts`).
- `demo/` — HTML pages loading built bundles. Served via `bun serve-demo.js` (port 8081).

## Build quirks (web)

- **CSS stripped** from output by a custom Vite plugin (removes `.css` from bundle).
- **Dynamic imports inlined** (`inlineDynamicImports: true`).
- IIFE format (not ESM). Load via `<script>` tag or CDN.
- `process.env.NODE_ENV` **hardcoded to `'production'`** in all 4 build configs.
- Path alias `@/` → `src/` in both API (tsconfig) and web (vite config).

## Prisma / DB switching

- Always use `./scripts/use-provider.sh` to switch; never edit `schema.prisma` directly.
- After switching: verify `DATABASE_URL` in `apps/api/.env` matches, then `bun run prisma:push`.
- Provider differences: MongoDB uses `@map("_id")`, no cascading FKs, no `@db.Text`. SQL variants use standard relations + `@@index` + `onDelete`.

## Dev / demo flow

```
bun run dev:api          # Terminal 1: API on :3001
bun run dev:web          # Terminal 2: Vite dev on :3000 (proxied to :3001)
bun serve-demo.js        # Terminal 3: Demo server on :8081
```

- You **must** register an admin first: `POST /auth/register` (JSON with username, password, displayName).
- The Vite dev proxy rewrites `/api` → target without prefix (e.g., `/api/auth/register` → `http://localhost:3001/auth/register`). **Don't double-prefix routes.**
- Demos served via HTTP (`bun serve-demo.js`). `file://` fails (CORS + cookies).
- Rebuild web bundles (`bun run build:web`) before testing via `serve-demo.js` — it serves **built** dist files, not the dev server.

## AI / RAG

- Provider keys/config stored in DB (AES-256-CBC), set via Admin UI. No extra env vars.
- Vector store is DB-provider-specific (see `apps/api/src/rag/`).
- See `docs/ai-agent.md` and `docs/rag-setup.md` for behavior details.

## Containers / deploy

- `Dockerfile` → `oven/bun:1-alpine` + ImageMagick + HEIC support. Builds both api + web, runs `bun run start:prod`.
- `docker-compose.yml` — api service only (port 3001, SQLite dev.db volume).
- `deploy-docker.sh` / `.ps1` — wrapper that runs `docker compose up -d --build` after env checks.
- `nginx.conf` — sample config for serving JS bundles with immutable cache headers.

## Sources of truth (check these, not docs prose)

- Root `package.json` + `apps/*/package.json` for scripts and deps.
- `apps/api/src/main.ts` + `app.module.ts` for backend wiring.
- `apps/api/prisma/schema.prisma` + provider overlays for data model.
- `apps/web/vite.config.*.ts` for build layout.
- `serve-demo.js` for demo server routing.
