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

<div align="center">
  <img src="docs/img/ss-admin.png" alt="OmniChat Admin Portal" width="23%" style="margin:4px" />
  <img src="docs/img/ss-widget.png" alt="OmniChat Chat Widget" width="23%" style="margin:4px" />
  <img src="docs/img/ss-ai.png" alt="OmniChat AI Agent" width="23%" style="margin:4px" />
  <img src="docs/img/ss-rag.png" alt="OmniChat AI Knowledge Base" width="23%" style="margin:4px" />
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

### Chat Widget (`<omnichat-chat-widget>`)
A floating bubble that opens a chat panel. Drop it onto any page for instant visitor engagement.
```html
<omnichat-chat-widget
  server-url="https://api.yoursite.com"
  bubble-color="#4F46E5"
  welcome-message="Hello! How can we help you?"
  position="bottom-right"
  assign-username="logged_in_user123">
</omnichat-chat-widget>
```
**Supported Attributes:**
* `server-url` (Required): The base URL of your OmniChat backend API.
* `bubble-color` (Optional): Hex color code for the chat widget theme (defaults to `#4F46E5`). Can be overridden by backend site config.
* `welcome-message` (Optional): The default greeting message. Can be overridden by backend site config.
* `position` (Optional): Where the widget renders on the screen (defaults to `bottom-right`).
* `assign-username` (Optional): Automatically link an authenticated visitor's username to their chat session for tracking.

### Admin Portal (`<omnichat-admin-portal>`)
A full admin dashboard for managing conversations, AI settings, knowledge base, tools, logs, and users. Embed it as a standalone page or within your own admin iframe.
```html
<omnichat-admin-portal
  server-url="https://api.yoursite.com"
  token="eyJhbGciOiJIUzI1NiIsInR...">
</omnichat-admin-portal>
```
**Supported Attributes:**
* `server-url` (Required): The base URL of your OmniChat backend API.
* `token` (Required): The JWT authentication token for the logged-in agent/admin.

### Agent Widget (`<omnichat-agent-widget>`)
A compact, always-accessible chat panel for agents to embed in their own backoffice or admin dashboard. Agents can manage conversations from any page without switching views.
```html
<omnichat-agent-widget
  server-url="https://api.yoursite.com"
  token="eyJhbGciOiJIUzI1NiIsInR...">
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
* **JWT-Authenticated**: Identity is derived from the JWT token payload — no client-modifiable username attribute.

**Supported Attributes:**
* `server-url` (Required): The base URL of your OmniChat backend API.
* `token` (Required): The JWT authentication token for the logged-in agent/admin. The agent's username is extracted from the JWT payload.

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

## 🔐 Token Handling Best Practices

### Chat Widget – `external-auth-token` (Visitor JWT)

The chat widget supports an optional `external-auth-token` attribute:

```html
<omnichat-chat-widget
  server-url="https://api.yoursite.com"
  external-auth-token="eyJhbGciOiJIUzI1NiIs..."
></omnichat-chat-widget>
```

What it is:
- A short-lived JWT issued by your own authentication provider (e.g., Keycloak, Auth0, custom auth).
- Used by OmniChat to:
  - Optionally identify the visitor.
  - Perform token-exchange for external tools when configured with `authType: "token-exchange"`.

When it’s required:
- **Not required** for basic chat, AI chat, or human agent conversations.
- **Required** only if you:
  - Use external tools with `token-exchange` auth.
  - Want to extract the visitor identity from a custom JWT.

How to set it safely:
- Generate the token on your backend (e.g., after login) and:
  - Render it server-side into the page:
    - `<omnichat-chat-widget external-auth-token="{{ externalAuthToken }}" ...></omnichat-chat-widget>`
  - Or inject via a protected, authenticated page (SSR / Razor / Blade, etc.).
- Use a reasonable lifetime (e.g., 30–180 minutes).
- Only send it over HTTPS.
- Never:
  - Hardcode tokens in client-side JS.
  - Log them to the console or expose them in URLs.
  - Share them with third-party scripts or analytics.

Notes:
- The token is stored in conversation metadata on the OmniChat backend (not persisted long-term).
- External tool endpoints can validate this JWT via their own token-exchange handler.

### Admin Portal & Agent Widget – `token` (Agent/Admin JWT)

The Admin Portal and Agent Widget require a `token` attribute:

- Admin Portal:
  ```html
  <omnichat-admin-portal
    server-url="https://api.yoursite.com"
    token="eyJhbGciOiJIUzI1NiIs..."
  ></omnichat-admin-portal>
  ```
- Agent Widget:
  ```html
  <omnichat-agent-widget
    server-url="https://api.yoursite.com"
    token="eyJhbGciOiJIUzI1NiIs..."
  ></omnichat-agent-widget>
  ```

What it is:
- A JWT issued by the OmniChat backend after authenticating an agent/admin (via `/auth/login` or your integration).
- The agent/admin username and role are read from this token payload.

How to set it safely:
- After login:
  - Use the JWT returned by your OmniChat backend.
  - Or generate it in your own backend and embed it into the admin page via SSR or a protected template.
- Prefer using httpOnly cookies for backend auth where possible; embed the JWT only within protected admin pages.
- Only serve admin and agent pages over HTTPS.
- Rotate tokens and restrict them via your backend security (shorter-lived tokens for embedded use are recommended).
- Never:
  - Embed long-lived tokens in public pages or demo files.
  - Expose admin/agent pages without your own authentication guard.

Example flow (embedding Admin Portal):
1. Agent logs in to your internal system.
2. Your backend calls OmniChat’s login or uses a shared auth to obtain a JWT.
3. Your backend renders an admin page:
   - `<omnichat-admin-portal server-url="https://api.yoursite.com" token="{{ agentJwt }}"></omnichat-admin-portal>`
4. This page is behind your internal auth so only authorized staff can load it.

For more details on AI Agent, external tools, and token-exchange, see:
- docs/ai-agent.md

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
│       │   │   └── main.ce.ts
│       │   ├── agent-widget/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
│       │   ├── chat-widget/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
│       │   ├── chat-page/
│       │   │   ├── App.ce.vue
│       │   │   └── main.ts
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
