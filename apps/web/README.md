# OmniChat React

React 19 rebuild of the OmniChat frontend — four bundles replacing the legacy Vue
custom elements, wired to the same NestJS/Socket.io backend protocol.

## Bundles

| Target | Element / entry | Build | Output |
|---|---|---|---|
| Chat widget | `<omnichat-chat-widget server-url="…">` | `npm run build:widget` | `dist/omnichat-chat-widget.js` |
| Full-page chat | `<omnichat-chat-page server-url="…">` | `npm run build:chat-page` | `dist/omnichat-chat-page.js` |
| Agent widget | `<omnichat-agent-widget server-url="…">` | `npm run build:agent-widget` | `dist/omnichat-agent-widget.js` |
| Admin portal | `<omnichat-admin-portal server-url="…">` | `npm run build:admin` | `dist/omnichat-admin-portal.js` |

The portal includes: Conversations (master-detail chat with quick replies, take-over,
transfer, resolve), Dashboard, AI Setup (providers / agent config / tools), Knowledge
Base (RAG documents, embedding status, search test), Logs, Users and Settings.

All four are single-file IIFE web components with CSS injected into their
Shadow Roots — zero styles bleed into the host page. The host page sizes the
portal element itself (e.g. `omnichat-admin-portal { display:block; height:100vh }`),
matching the legacy Vue `<omnichat-admin-portal>` contract.

## Architecture

- **Socket + query cache**: every server event is synced into a TanStack Query
  cache keyed `['conversation', serverUrl, id]` via `setQueryData`. The initial
  history arrives as the `conversation_history` socket event (there is no REST
  history endpoint); messages are appended to the same cache. `useQuery` reads
  the cache reactively with `staleTime: Infinity` — no refetching ever.
- **Optimistic sends**: sent messages are appended with a temp id and replaced
  by the server echo; `message_error` rolls them back.
- **AI streaming**: `ai_stream` tokens accumulate into a synthetic bubble; the
  full `new_message` (emitted first by the gateway) supersedes it.
- **Cross-tab**: conversation id, mute/translate prefs and widget position are
  localStorage-backed and stay in sync across tabs.
- **Read receipts**: the visitor emits `read_message` only while the panel is
  open; opening the panel marks everything read; the unread bubble badge is
  derived from `readAt` in the cache.
- **Identity**: visitor id (`v_<uuid>`) is passed through the socket handshake
  auth, migrating the legacy `omnichat_visitor_id` key; the agent widget reads
  the admin JWT from `omnichat_accessToken` on the same origin.

## Layout

```
src/
  shared/          types (wire contracts), api client, storage, markdown, avatars
  features/chat/   visitor chat engine: hooks (socket, session, sound, scroll…),
                   components (message list, composer, review, lightbox…), styles
  features/widget/ launcher bubble, panel frame, drag/position engine
  features/chat-page/ full-page shell + image drag-drop
  features/agent/  agent socket, conversation list, chat view, agent widget shell
  admin/           portal logic: auth, shell, conversations/dashboard/users/settings/logs
  admin-portal/    <omnichat-admin-portal> custom element entry
```

## Demo (local)

With the OmniChat API running at `http://localhost:3001` (the backend reads
`apps/api/.env` in the omnichat repo — your dev MongoDB credentials live there):

```bash
npm install
npm run build
npx http-server . -p 8080        # all four demos live in /demo
```

- Widget demo: `http://localhost:8080/demo/demo-widget.html`
- Full-page chat: `http://localhost:8080/demo/demo-chat-page.html`
- Agent widget: `http://localhost:8080/demo/demo-agent.html`
- Admin portal: `http://localhost:8080/demo/demo-admin.html`

The admin portal and agent widget share an origin (all demos on one server), so
the agent widget picks up the admin JWT from localStorage after you log in.
Login needs the server's `x-admin-api-key` (field on the login form, persisted
in localStorage).

## Notes

- The admin login requires the backend's `ADMIN_API_KEY` (sent as
  `x-admin-api-key`), which the current NestJS API enforces on `login`/`register`.
- The portal also accepts `?server=<api-url>` in the page URL; the element's
  `server-url` attribute takes precedence.
- `npm run typecheck` (tsc) is clean across all four bundles.
