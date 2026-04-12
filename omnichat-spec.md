# OmniChat — Project Specification

> High-performance · Self-hosted · Open-source live chat system

---

## 1. Product Vision

OmniChat is a zero-dependency live chat platform with a **zero-UI-footprint** philosophy: no standalone dashboard website exists. Both the **Visitor Widget** and the **Admin Management Portal** are delivered as injectable `<script>` tags that mount Web Components onto any host page.

### Core Principles

**Zero-UI Footprint**
Both the visitor widget and admin portal are injectable `<script>` tags — no standalone app shell, no iframe embeds, no routing overhead on the host.

**Universal Integration**
Framework-agnostic by design. Guaranteed compatibility with Blazor (Server + WASM), Nuxt.js, and legacy HTML environments. Shadow DOM isolation is non-negotiable.

**Database Agnostic**
Operators switch between MongoDB, PostgreSQL and MySQL by changing a single connection string. No code changes required.

---

## 2. Technical Stack

| Layer | Technology | Constraint |
|---|---|---|
| Backend runtime | NestJS + Socket.io | WebSocket gateway only |
| ORM | Prisma | Dual-provider schema (see Phase 1) |
| Frontend framework | Vue 3 + Tailwind CSS | Compiled to Web Components |
| Encapsulation | `defineCustomElement` + Shadow DOM | Mandatory — prevents CSS bleed |
| Bundler | Vite | Single-file output per component |

### Primary Key Policy

All Prisma models must use `String` as the primary key type (UUID or ULID). This is the only type compatible with both SQL auto-increment and MongoDB ObjectId semantics when abstracted behind a string representation.

---

## 3. Implementation Phases

### Phase 1 — Universal Prisma Schema

**Goal:** One `schema.prisma` that runs unmodified against both MySQL and MongoDB.

**Entities to define:**

- `Conversation` — tracks visitor sessions, status (active/resolved), assigned agent
- `Message` — content, timestamp, sender type (visitor/agent), foreign key to Conversation
- `AdminUser` — credentials, role, online presence state
- `SiteConfig` — per-site settings (bubble color, welcome message, allowed origins)

**Dual-provider strategy:**

The `@db.ObjectId` attribute and `@map("_id")` directive are MongoDB-only and will cause errors under PostgreSQL and MySQL. Handle this with one of two approaches:

1. **Environment-driven schema generation** — maintain two thin overlay files (`schema.mongodb.prisma`, `schema.mysql.prisma`) that extend a shared base. A `prisma:generate` script selects the correct file from `DATABASE_PROVIDER` env var before running `prisma generate`.
2. **String abstraction** — store all IDs as `String @default(cuid())`. For MongoDB, add `@map("_id")` only in the MongoDB variant. Use a `Makefile` or `package.json` script to swap the active schema file before generation.

Recommended approach: option 2 with a `scripts/use-provider.sh` helper.

---

### Phase 2 — NestJS Real-time Gateway

**Module structure:**

```
src/
  chat/
    chat.module.ts
    chat.gateway.ts      ← Socket.io gateway
    chat.service.ts      ← Prisma persistence layer
  auth/
    auth.module.ts
    jwt.strategy.ts
  config/
    config.module.ts
```

**Gateway responsibilities:**

| Event (inbound) | Handler behavior |
|---|---|
| `join_conversation` | Authenticates client, adds socket to room `conv:{id}` |
| `send_message` | Persists via `ChatService`, then emits `new_message` to room |
| `typing_start` / `typing_stop` | Emits `agent_typing` / `visitor_typing` to room (no DB write) |
| `resolve_conversation` | Updates `Conversation.status`, emits `conversation_resolved` |
| `connection` / `disconnect` | Updates `AdminUser.isOnline`, broadcasts `agent_presence` |

**Persistence contract:** A message is only emitted to the room _after_ a successful `prisma.message.create()` call. Failed writes must not emit.

**Room isolation:** Every conversation maps to a Socket.io room named `conv:{conversationId}`. Visitors and agents join the same room. Cross-conversation message leakage is architecturally impossible.

---

### Phase 3 — Embeddable Admin Portal (Web Component)

**Embedding syntax — the contract:**

```html
<!-- Blazor, Nuxt, or plain HTML -->
<omnichat-admin
  server-url="https://api.yoursite.com"
  token="eyJhbGciOiJIUzI1NiJ9..."
></omnichat-admin>

<script src="https://cdn.yoursite.com/omnichat-admin.js"></script>
```

**Component tree:**

```
<omnichat-admin>              ← Custom Element root (Shadow DOM)
  ├── SidebarPanel            ← Conversation list (active / resolved tabs)
  │     └── ConversationItem  ← Click → sets activeConversationId
  ├── ChatWindow              ← Real-time message thread
  │     ├── MessageBubble[]
  │     └── TypingIndicator
  └── SettingsDrawer          ← Bubble color picker, welcome message editor
```

**Attribute-to-prop binding:**

Vue's `defineCustomElement` maps hyphenated HTML attributes to camelCase props automatically. Declare props with types and defaults:

```ts
const props = defineProps({
  serverUrl: { type: String, required: true },
  token:     { type: String, required: true },
})
```

Blazor passes attributes as strings — no special handling needed. The Web Component spec guarantees `attributeChangedCallback` fires on any attribute mutation, which Vue's custom element wrapper handles transparently.

**Shadow DOM + Tailwind:**

Tailwind styles must be injected _inside_ the Shadow Root. Configure Vite to inline the compiled CSS into the JS bundle, then mount it via a `<style>` tag in the component's `setup()` or via the `styles` option of `defineCustomElement`. Do **not** rely on a global `<link>` stylesheet — it will not pierce the Shadow DOM boundary.

---

### Phase 4 — Vite Bundling Strategy

**Output targets:**

| File | Entry | Custom element tag |
|---|---|---|
| `omnichat-client.js` | `src/client/main.ts` | `<omnichat-widget>` |
| `omnichat-admin.js` | `src/admin/main.ts` | `<omnichat-admin>` |

**Key `vite.config.ts` settings:**

```ts
// Both builds share this pattern
build: {
  lib: {
    entry: 'src/admin/main.ts',
    formats: ['iife'],           // IIFE — no module loader required
    name: 'OmniChatAdmin',
    fileName: () => 'omnichat-admin.js',
  },
  rollupOptions: {
    output: {
      inlineDynamicImports: true // Single-file output
    }
  }
}
```

**Tailwind injection inside Shadow DOM:**

In `main.ts` for each component, import the compiled CSS as a raw string and pass it to `defineCustomElement`:

```ts
import styles from './style.css?inline'
import App from './App.ce.vue'

const OmniChatAdmin = defineCustomElement(App, { styles: [styles] })
customElements.define('omnichat-admin', OmniChatAdmin)
```

This ensures Tailwind utility classes are scoped to the Shadow Root and never leak to the host page.

---

## 4. Execution Checklist for AI Implementation

Implement in this exact order. Each step is a discrete, reviewable unit.

**Step 1 — Schema**
Generate `schema.prisma` with all four models. Include the `scripts/use-provider.sh` switcher script. Explain the `String` vs `ObjectId` resolution strategy with inline comments.

**Step 2 — Gateway**
Provide `chat.module.ts`, `chat.gateway.ts`, and `chat.service.ts`. Show the full event lifecycle: join → persist → emit → disconnect. Include guard usage for JWT authentication on socket handshake.

**Step 3 — Web Component**
Show `App.ce.vue` using `defineCustomElement`. Demonstrate attribute binding from a Blazor host. Show CSS injection into Shadow Root. Include the `vite.config.ts` for both builds.

**Step 4 — Infrastructure**
Provide `.env.example` with all required variables and inline comments. Provide `docker-compose.yml` with services: `api` (NestJS), `db-mysql` (MySQL 8), `db-mongo` (MongoDB 7), and `nginx` (static asset host for the JS bundles). Services must be individually commentable to support MySQL-only or MongoDB-only deployments.

---

## 5. Non-Functional Requirements

| Concern | Requirement |
|---|---|
| CSS isolation | Shadow DOM on all components. Zero global style mutations. |
| Blazor compatibility | No `document.write`. No global CSS classes. Event listeners attached to Shadow Root only. |
| Auth | JWT on REST endpoints. Socket.io handshake validates Bearer token before any room join. |
| Scalability | Socket.io adapter must support Redis (for multi-instance deployments). Include commented-out Redis adapter config. |
| Build output | Each JS bundle under 200 KB gzipped. Tailwind must be purged to used classes only. |

---

## 6. File Structure Reference

```
omnichat/
├── apps/
│   ├── api/                        ← NestJS backend
│   │   ├── src/
│   │   │   ├── chat/
│   │   │   ├── auth/
│   │   │   └── config/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── schema.mongodb.prisma
|   |   |   ├── schema.postgresql.prisma
│   │   │   └── schema.mysql.prisma
│   │   └── .env.example
│   └── web/                        ← Vue 3 Web Components
│       ├── src/
│       │   ├── admin/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
│       │   └── client/
│       │       ├── App.ce.vue
│       │       └── main.ts
│       └── vite.config.ts
├── docker-compose.yml
└── scripts/
    └── use-provider.sh
```
