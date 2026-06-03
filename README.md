# 💬 OmniChat

![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-green)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)

**OmniChat** is a high-performance, self-hosted, and open-source communication suite. It features a lightweight Vue 3 chat widget for instant visitor engagement, a full-page chat mode for deep-link conversations, and a RAG-ready AI agent that answers questions using your own data. Built for extensibility, developers can effortlessly embed the chat interface into any website, open dedicated chat pages for visitors, and integrate the powerful admin portal directly into their existing backoffice.

<div align="center">
  <img src="docs/img/ss-admin.png" alt="OmniChat Admin Portal" width="48%" />
  <img src="docs/img/ss-widget.png" alt="OmniChat Chat Widget" width="48%" />
  <img src="docs/img/ss-ai.png" alt="OmniChat AI Agent" width="48%" />
  <img src="docs/img/ss-rag.png" alt="OmniChat AI Knowledge Base" width="48%" />
</div>

## ✨ Features

* **⚡ Real-time Communication**: Powered by Socket.io for sub-millisecond latency.
* **💾 Multi-Database Support**: Thanks to Prisma, OmniChat supports **MongoDB, PostgreSQL, and MySQL**.
* **🎫 Ticket ID Tracking**: Customers receive a unique 8-character Ticket ID (e.g., `#A8B7C6D5`) to easily track and reference their cases in the future.
* **👨‍⚕️ Specialist Transfers**: Easily transfer active chats to specialized agents. The specialized agent will receive a notification and the chat will appear in their dedicated "Specialist" tab.
* **🔍 Smart Search & Filters**: Search conversations by specific prefixes (`@username`, `#ticketID`) and filter resolved chats by date ranges in the agent's local timezone.
* **🌐 Cross-Tab Persistence**: Visitors can navigate across your site or open new tabs without losing their chat session.
* **🕵️ Visitor Context Tracking**: Automatically captures and displays visitor IP, Browser, OS, Device, Current URL, Timezone, Language, and Referrer.
* **🖼️ Smart Image Uploads**: 
   * Client-side image compression (Canvas).
   * Backend thumbnail generation using `sharp`.
   * **HEIC/HEIF support** - Automatic conversion to WebP via ImageMagick.
   * Built-in UI Lightbox for viewing high-res images.
   * Cross-platform HEIC conversion (macOS, Ubuntu, Windows Server).
* **⚡ Quick Replies**: Admins can configure canned responses and trigger them in chat by simply typing `/`.
* **⏱️ Auto-Resolution**: Automatically sends a 3-minute inactivity warning and resolves inactive chats after 5 minutes.
* **🎨 Highly Customizable Widget**: Change bubble colors, patterns, sizes, icons, and welcome messages directly from the Admin UI. Dynamic CORS configuration stored in the database.
* **⭐ Post-Chat Reviews**: Collect visitor feedback and star ratings after a conversation is resolved.
* **🌎 AI Translation**: Translate messages inline into 20+ languages (English, 中文, 日本語, 한국어, Français, Español, العربية, etc.). Per-message toggle between original and translated text with IndexedDB caching. Available in both the Admin Portal and Admin Floating Widget.

**🤖 AI Agent**

* OmniChat includes optional AI Agent support for automated visitor conversations and human handoff orchestration.
* Human Offline Mode: when enabled, visitors are prevented from being routed to human agents. If AI Agent is enabled, visitors will be served by the AI Agent when humans are offline.
* Handoff logic: transfers to humans only succeed when an agent is truly available (presence is session-aware and requires an active, online agent session).
* Read receipts: agents can see visitor read status when enabled; visitors never see read receipts in the widget.
* Character limits: visitor messages are limited to 100 characters and agent/admin messages to 1000 characters (enforced client- and server-side).
* Quick Replies and canned responses work with both human and AI-driven conversations and are validated server-side (title/content limits).
* Messages support Markdown rendering (sanitized HTML) for both AI and human messages; streaming behavior is supported but should be tested during integration.
* Configuration: AI Agent settings (enable/disable, greetings, system prompt, human offline mode, read receipts) are available in the Admin Settings and Ai Setup pages. See docs/ai-agent.md for full details.

## 🛠️ Tech Stack

This project is structured as a Bun workspace monorepo:

* **Backend (`apps/api`)**: NestJS, Prisma (MongoDB, PostgreSQL, MySQL), Socket.io, Multer, Sharp.
* **Frontend (`apps/web`)**: Vue 3 (compiled to Custom Web Components via Vite).

## 🧩 Web Component Usage & Attributes

OmniChat is compiled into native Web Components, meaning you can drop them into any framework (React, Angular, Vue, Blazor) or plain HTML.

- **Visitor components** (embedded on your website for customers):
  - `<omnichat-chat-widget>`
  - `<omnichat-chat-page>`
- **Admin / Agent components** (embedded in your internal admin or backoffice pages):
  - `<omnichat-admin-portal>`
  - `<omnichat-agent-widget>`

### Chat Widget (`<omnichat-chat-widget>`)
A floating bubble that opens a chat panel. Drop it onto any page for instant visitor engagement.
```html
<omnichat-chat-widget
  server-url="https://api.yoursite.com"
  bubble-color="#4F46E5"
  welcome-message="Hello! How can we help you?"
  position="bottom-right">
</omnichat-chat-widget>
```
**Supported Attributes:**
* `server-url` (Required): The base URL of your OmniChat backend API.
* `bubble-color` (Optional): Hex color code for the chat widget theme (defaults to `#4F46E5`). Can be overridden by backend site config.
* `welcome-message` (Optional): The default greeting message. Can be overridden by backend site config.
* `position` (Optional): Where the widget renders on the screen (defaults to `bottom-right`).
* `data-external-token` (Optional): HS256-signed JWT for external site authenticated visitors. Signed with `EXTERNAL_SITE_JWT_SECRET`.

### Admin Portal (`<omnichat-admin-portal>`)
A full admin dashboard for managing conversations, AI settings, knowledge base, tools, logs, and users. Authenticates via login form — tokens are stored in `localStorage` and sent as `Authorization: Bearer` + `x-external-site-token` headers on all requests. Embed it as a standalone page or within your own admin iframe.
```html
<omnichat-admin-portal
  server-url="https://api.yoursite.com">
</omnichat-admin-portal>
```
**Supported Attribute:**
* `server-url` (Required): The base URL of your OmniChat backend API.

### Agent Widget (`<omnichat-agent-widget>`)
A compact, always-accessible chat panel for agents to embed in their own backoffice or admin dashboard. Reads tokens from `localStorage` (after admin login) — no authentication attributes needed. Agents can manage conversations from any page without switching views.
```html
<omnichat-agent-widget
  server-url="https://api.yoursite.com">
</omnichat-agent-widget>
```
**Key Features:**
* **Draggable Bubble & Panel**: Drag the floating bubble anywhere on screen; reposition the panel by its header.
* **Unread Badge**: Red notification count for new messages in Active or Specialist conversations.
* **Resizable Panel**: Drag the bottom-right corner to adjust panel size to fit your screen.
* **Full Chat Management**: View Active and Specialist conversations, reply to visitors, resolve chats, and transfer to specialists — all within the floating panel.
* **Conversation Details**: Inspect visitor info (IP, browser, URL), update customer username, and add internal agent remarks.
* **AI Translation**: Inline translate messages into 20+ languages with per-message toggle.
* **Widget Settings Sync**: Automatically applies bubble color, size, pattern, icon, and notification sound from the admin Settings → Widget Setup page.

**Supported Attribute:**
* `server-url` (Required): The base URL of your OmniChat backend API.

### Chat Page (`<omnichat-chat-page>`)
A full-page live chat that opens in a new tab. Ideal for embedding deep links on your website — visitors click the link and get a complete chat interface, not a floating bubble.

Also works as an embeddable custom element inside any page.

**As a custom element:**
```html
<omnichat-chat-page
  server-url="https://api.yoursite.com"
  bubble-color="#4F46E5"
  welcome-message="Hello! How can we help you?">
</omnichat-chat-page>
```

**As a standalone page:** Link to `chat-app.html?server=http://localhost:3001` to open a full-page chat in a new tab. Supports query params `?server=`, `?color=`, and `?welcome=`.

**Key Features:**
* **Full-Page Experience**: No floating bubble — the entire viewport is the chat interface.
* **All Widget Features**: Pre-chat form, real-time messaging, AI streaming, typing indicators, file upload, translation, reviews, and more.
* **Responsive**: Works on mobile and desktop with viewport-filling layout.
* **Embeddable**: Use `<omnichat-chat-page>` as a custom element or link directly to the standalone HTML page.
* **Standalone Demo**: Available at `demo/chat-app.html?server=http://localhost:3001`.

**Supported Attributes:**
* `server-url` (Required): The base URL of your OmniChat backend API.
* `bubble-color` (Optional): Hex color code for the chat theme (defaults to `#4F46E5`). Can be overridden by backend site config.
* `welcome-message` (Optional): The default greeting message. Can be overridden by backend site config.
* `data-external-token` (Optional): HS256-signed JWT for external site authenticated visitors. Signed with `EXTERNAL_SITE_JWT_SECRET`.

## 🔐 Authentication Architecture

JWTs are stored in `localStorage` and sent via `Authorization: Bearer` header. All authenticated requests also require an `x-external-site-token` header (an origin-bound companion JWT). No auth cookies are used — only `omnichat_visitor_token` (httpOnly) for visitor session persistence.

**Login response:**
```json
{
  "accessToken": "eyJ...",      // JWT, short-lived (30m default), includes boundOrigin
  "refreshToken": "uuid...",     // Opaque token, longer-lived (7d default)
  "siteToken": "eyJ...",         // Origin-bound JWT, sent as x-external-site-token
  "user": { "id": "...", "username": "...", "role": "developer" }
}
```
All three tokens (`accessToken`, `refreshToken`, `siteToken`) are stored in `localStorage` by the OmniChat web client upon successful login. They are generated by the OmniChat API — the external site is not involved in admin/agent authentication.

**Refresh flow:** On 401, the client calls `POST /auth/refresh` with the refresh token to get new access + refresh tokens.

**Dual-layer protection:**
1. Access token (JWT, 30m) — signature + expiry + session (jti) + origin binding
2. Site token (`x-external-site-token`) — origin-bound companion JWT, required on all authenticated requests

Even if an attacker steals the access token, it's useless without the matching site token. Both are short-lived.

### Roles

| Role | Description |
|------|-------------|
| **developer** | Full access. Can manage CORS, IP allowlist, and promote users to developer. First registered user. |
| **admin** | Can manage AI agents, knowledge base, tools, logs, and users. Cannot change CORS/IP settings or promote to developer. |
| **agent** | Can view and respond to conversations. Can change widget settings. |

### External Site JWT (Widget Visitor Auth)

For authenticated visitors on external sites, generate an HS256-signed JWT server-side:
```json
{
  "sub": "<external_user_id>",
  "username": "<display_name>",
  "operatorName": "<site_identifier>",
  "iat": 1717000000,
  "exp": 1717000900
}
```
Sign with the same key as `EXTERNAL_SITE_JWT_SECRET` in OmniChat's `.env`. Pass it via the `data-external-token` attribute:

```html
<omnichat-chat-widget
    server-url="https://api.yoursite.com"
    data-external-token="eyJhbGciOiJIUzI1NiIs..."
    bubble-color="#4F46E5">
</omnichat-chat-widget>
```

The widget sends this token to `POST /auth/visitor` via the request body, and the server verifies it against the pre-shared secret. The visitor cookie (`omnichat_visitor_token`) persists the visitor ID across page refreshes (30-day expiry).

### Visitor JWT (for External Tool Token-Exchange)

For token-exchange flow with external tools, the external site's JWT (passed via `data-external-token` attribute) is forwarded to the configured tool's `tokenUrl` endpoint. The flow:

1. Embedding site generates an HS256 JWT signed with `EXTERNAL_SITE_JWT_SECRET`
2. Passed via `<omnichat-chat-widget data-external-token="<JWT>">`
3. When AI calls an external tool registered with `authType: "token-exchange"`, OmniChat sends the JWT to the tool's `tokenUrl` to obtain a tool-scoped `access_token`

The external JWT should have a reasonable lifespan (e.g., 3 hours) since it may be used for multiple tool invocations throughout a conversation.

## 🚀 Quick Start

### 🐳 Docker Deployment (Recommended)

OmniChat includes full HEIC image support and can be deployed using Docker with pre-configured ImageMagick conversion:

#### Quick Start with Docker

**Linux/macOS:**
```bash
./deploy-docker.sh
```

**Windows (PowerShell):**
```powershell
PowerShell -ExecutionPolicy Bypass -File deploy-docker.ps1
```

**Manual:**
```bash
docker compose up -d --build
```

The Docker deployment includes:
- ✅ Bun runtime for optimal performance
- ✅ ImageMagick with HEIC support
- ✅ Cross-platform compatibility (macOS, Ubuntu, Windows Server)
- ✅ Pre-configured environment
- ✅ Persistent volume mounts

### 💻 Manual Deployment (No Docker)

For developers who prefer manual installation and direct system control, OmniChat can be deployed without Docker by installing ImageMagick and other dependencies directly on the server OS.

#### Quick Start with Manual Setup

**Ubuntu Server:**
```bash
# Install ImageMagick with HEIC support
sudo apt install imagemagick libheif-dev

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and setup
git clone <repository-url>
cd omnichat
bun install
bun run prisma:generate
bun run prisma:push
bun run build:api
bun run dev:api
```

**Windows Server:**
```powershell
# Download and install ImageMagick
https://imagemagick.org/script/download.php#windows

# Install Bun
irm bun.sh/install.ps1 | iex

# Clone and setup
git clone <repository-url>
cd omnichat
bun install
bun run prisma:generate
bun run prisma:push
bun run build:api
bun run dev:api
```

**macOS:**
```bash
# Install ImageMagick (optional - sips works as fallback)
brew install imagemagick

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone and setup
git clone <repository-url>
cd omnichat
bun install
bun run prisma:generate
bun run prisma:push
bun run build:api
bun run dev:api
```

For comprehensive manual deployment instructions, see [Manual Deployment Guide](MANUAL_DEPLOYMENT.md).

#### Deployment Comparison

| Aspect | Docker Deployment | Manual Deployment |
|--------|------------------|-------------------|
| **Setup Complexity** | Low (single command) | Medium (manual installation) |
| **HEIC Support** | Pre-configured | Manual ImageMagick setup required |
| **Cross-platform** | Guaranteed | Platform-specific steps |
| **Performance** | Slight container overhead | Direct system access |
| **Maintenance** | Container updates | System package updates |
| **Code Changes** | None | None |
| **Functionality** | Identical | Identical |

Both deployment methods provide **identical HEIC conversion functionality**. Choose Docker for simplified setup and consistency, or manual deployment for maximum control and performance.

#### CDN Links

You can easily embed OmniChat via CDN:

* **Admin Portal**: `https://cdn.jsdelivr.net/gh/garyhooi/omnichat@main/apps/web/dist/omnichat-admin-portal.js`
* **Chat Widget**: `https://cdn.jsdelivr.net/gh/garyhooi/omnichat@main/apps/web/dist/omnichat-chat-widget.js`
* **Agent Widget**: `https://cdn.jsdelivr.net/gh/garyhooi/omnichat@main/apps/web/dist/omnichat-agent-widget.js`
* **Chat Page**: `https://cdn.jsdelivr.net/gh/garyhooi/omnichat@main/apps/web/dist/omnichat-chat-page.js`

### Prerequisites
* Bun
* A database of your choice (MongoDB, PostgreSQL, or MySQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/garyhooi/omnichat.git
   cd omnichat
   ```

2. **Install dependencies:**
    ```bash
    bun install
    ```

3. **Environment Setup:**
    * Navigate to `apps/api` and copy `.env.example` to `.env`.
    * Update the `DATABASE_URL` to point to your database instance.
    * If not using MongoDB, you can switch providers using the included shell script: `bun run use-provider postgresql` or `bun run use-provider mysql` (Requires `scripts/use-provider.sh` to be executed).

4. **Sync the Database:**
    ```bash
    bun run prisma:generate
    bun run prisma:push
    ```

5. **Run the Development Servers:**
    * **API Server:** 
      ```bash
      bun run dev:api
      ```
    * **Web/Frontend Builder:** 
      ```bash
      bun run dev:web
      ```

## File Structure Reference

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
│       │   ├── admin-portal/
│       │   │   ├── AdminDashboard.ce.vue
│       │   │   ├── main.ce.ts
│       │   │   ├── pages/
│       │   │   │   ├── DeveloperPage.vue
│       │   │   │   └── ...
│       │   │   └── stores/
│       │   ├── agent-widget/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
│       │   ├── chat-widget/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
│       │   ├── chat-page/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
│       │   ├── shared/
│       │   └── utils/
│       ├── demo/
│       │   ├── admin.html
│       │   ├── widget.html
│       │   ├── chat-page.html
│       │   └── chat-app.html
│       └── vite.config.*.ts
├── docker-compose.yml
└── scripts/
    └── use-provider.sh
```


## 📚 Documentation

For more detailed setup instructions, including Docker and Production deployments, please refer to the following guides:

* [Local Setup Guide](docs/SETUP_LOCAL.md)
* [Production Deployment Guide](docs/SETUP_PRODUCTION.md)
* [Quickstart Overview](docs/QUICKSTART.md)
* [Docker Deployment Guide](docs/DOCKER_DEPLOYMENT.md)
* [Manual Deployment Guide](docs/MANUAL_DEPLOYMENT.md)

## 🤝 Contributing

Contributions are welcome! If you'd like to improve OmniChat, please fork the repository and submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 💖 Support

If you find OmniChat useful, consider supporting its development:

* **USDT (TRC20):** `TPZ1yCehxRQsJWRW1Sq8f3BBm56WLVBWzA`
* **USDC (Arbitrum One):** `0x2cE5a401a2AEaf78376E72c8C88a962c5862adA3`

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
