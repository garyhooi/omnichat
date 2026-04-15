# OmniChat — Local Development Setup Guide

## Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- A terminal/command line

---

## Quick Start (5 steps)

### Step 1: Install Dependencies
```bash
# From the project root
npm install

# This installs dependencies for:
# - Root (monorepo scripts)
# - apps/api (NestJS backend)
# - apps/web (Vue 3 web components)
```

### Step 2: Select Database Provider
```bash
# Setup MySQL (recommended for local dev)
./scripts/use-provider.sh mysql

# This copies schema.mysql.prisma → schema.prisma and generates Prisma client
```

### Step 3: Start Database & Infrastructure
```bash
# From the project root, start Docker services
docker-compose up -d

# This starts:
# - db-mysql (MySQL 8)
# - nginx (static file server on port 8080)

# Verify services are running:
docker-compose ps

# Wait ~30 seconds for MySQL to be fully ready
```

### Step 4: Initialize Database Schema
```bash
# From project root
npm run prisma:push

# This pushes your schema to the MySQL database and creates tables
```

### Step 5: Create a Test Admin User
```bash
# Option A: Use NestJS CLI to seed (if you implement a seed script)
# Option B: Send a POST request after the API starts (see Step 7)

# For now, skip this — the API will create users via the /auth/register endpoint
```

---

## Running the Full Stack Locally

You'll need **3 terminal windows**:

### Terminal 1: NestJS API Server
```bash
cd apps/api
npm run dev

# Expected output:
# [Nest] 12345 - 01/20/2025 12:00:00 PM
# [NestFactory] Starting Nest application...
# [InstanceLoader] PrismaModule dependencies initialized
# OmniChat API running on port 3001
```

### Terminal 2: Vite Web Components Dev Server
```bash
cd apps/web
npm run dev

# Expected output:
# VITE v5.x.x  ready in xx ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

### Terminal 3: Optional — Watch Docker Logs
```bash
docker-compose logs -f db-mysql

# Or follow all services:
docker-compose logs -f
```

---

## Testing the Demo

### 1. Create an Admin Account (via API)
Open Postman, curl, or browser and POST to:

```
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "displayName": "John Agent"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "clx...",
    "email": "admin@example.com",
    "role": "agent"
  }
}
```

**Copy the `accessToken` — you'll need it next.**

### 2. Load Admin Portal
Open in browser: **http://localhost:5173**

You'll see the OmniChat dev preview page with two components:

**Admin Portal** (top):
```html
<omnichat-admin
  server-url="http://localhost:3001"
  token="YOUR_TOKEN_HERE"
></omnichat-admin>
```

Replace `YOUR_TOKEN_HERE` with the `accessToken` from Step 1.

**Visitor Widget** (bottom-right floating bubble):
```html
<omnichat-widget
  server-url="http://localhost:3001"
  bubble-color="#4F46E5"
  welcome-message="Hi! How can we help?"
></omnichat-widget>
```

### 3. Test the Chat Flow

**Step A: Open Visitor Widget**
- Click the floating chat bubble (bottom-right)
- Click "Start a conversation"
- The widget opens and connects to the API

**Step B: Check Admin Portal**
- A new conversation should appear in the "Active" tab
- Click it to open the chat window
- You should see the empty message list

**Step C: Send Messages**
- Type a message in the widget and send it
- The message appears in the admin portal in real-time
- Type a reply in the admin portal
- The reply appears in the widget

**Step D: Test Typing Indicator**
- Start typing in either side
- The other side should see "is typing..." indicator
- Indicator disappears after 2 seconds of no typing

**Step E: Resolve Conversation**
- In the admin portal, click the "Resolve" button
- The widget shows "This conversation has been resolved"
- Optionally click "Start a new chat" for a fresh conversation

---

## Useful Commands

### Development
```bash
# Start everything (from 3 terminals as shown above)
npm run dev:api                          # Terminal 1
npm run dev:web                          # Terminal 2

# Watch web components hot-reload (dev mode)
cd apps/web && npm run dev

# Watch API hot-reload
cd apps/api && npm run dev
```

### Database
```bash
# Push schema to database
npm run prisma:push

# Regenerate Prisma client (after changing provider)
npm run prisma:generate

# Open Prisma Studio (visual database explorer)
npm run prisma:studio
# Opens http://localhost:5555

# Switch database provider
./scripts/use-provider.sh postgresql     # Switch to PostgreSQL
./scripts/use-provider.sh mongodb        # Switch to MongoDB
./scripts/use-provider.sh mysql          # Switch to MySQL
```

### Docker
```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart db-mysql

# MySQL-only deployment (no Mongo)
docker-compose up -d api db-mysql nginx

# MongoDB-only deployment (uncomment mongo in compose file first)
# docker-compose up -d api db-mongo nginx
```

### Building
```bash
# Build both admin and visitor widgets
npm run build:web

# Build only admin portal (omnichat-admin.js)
npm run build:admin

# Build only visitor widget (omnichat-client.js)
npm run build:client

# Production API build
npm run build:api
```

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
# Regenerate the client
npm run prisma:generate

# Then restart the API
```

### "Connection refused" when API tries to reach database
- Ensure MySQL is running: `docker-compose ps`
- MySQL takes ~30 seconds to start. Wait and retry.
- Check logs: `docker-compose logs db-mysql`

### "Token invalid" in admin portal
- Make sure you're using the full `accessToken` from `/auth/register`
- The token format should start with `eyJ...`

### Visitor widget won't connect
- Ensure API is running on port 3001: `npm run dev:api`
- Check browser console for Socket.io connection errors
- Verify `server-url` matches your API endpoint

### Hot reload not working
- Vite should auto-reload on `.vue` file changes
- Try refreshing the browser manually
- Ensure dev server is still running

### Port already in use
```bash
# If port 3001 is taken, update in:
# - apps/api/.env (PORT=3002)
# - apps/web/vite.config.ts (proxy target)

# If port 5173 is taken, Vite will auto-increment
# If port 8080 is taken:
docker-compose down  # Stop all services
```

---

## File Structure During Development

```
omnichat/
├── apps/api/
│   ├── src/
│   │   ├── main.ts          ← API entry point
│   │   ├── chat/            ← Socket.io gateway
│   │   ├── auth/            ← JWT + login
│   │   └── config/          ← Settings endpoints
│   ├── prisma/
│   │   ├── schema.prisma    ← Active schema (MySQL)
│   │   └── migrations/      ← Auto-generated by Prisma
│   ├── dist/                ← Compiled API (build output)
│   └── .env                 ← Your config
├── apps/web/
│   ├── src/
│   │   ├── admin/           ← Admin portal web component
│   │   ├── client/          ← Visitor widget web component
│   │   └── env.d.ts         ← TypeScript types
│   ├── dist/                ← Compiled JS bundles (build output)
│   │   ├── omnichat-admin.js    ← Embed this
│   │   └── omnichat-client.js   ← Embed this
│   ├── index.html           ← Dev preview page
│   └── vite.config.ts       ← Dev server config
└── docker-compose.yml       ← Local database + nginx
```

---

## What's Running and Where

| Service | Port | Purpose |
|---------|------|---------|
| NestJS API | 3001 | WebSocket gateway + REST endpoints |
| Vite dev server | 5173 | Hot-reload Web Components dev |
| Nginx | 8080 | Serves static JS bundles |
| MySQL | 3306 | Database |

---

## Next Steps After Local Testing

1. **Customize the Welcome Message**
   - Edit the `welcomeMessage` prop in `apps/web/src/client/App.ce.vue`
   - Hot-reload will pick it up instantly

2. **Change Bubble Color**
   - Edit `bubble-color="#4F46E5"` in `apps/web/index.html`
   - Or pass it as an attribute from your host page

3. **Deploy to Production**
   - Build: `npm run build:web` (generates `omnichat-admin.js` and `omnichat-client.js`)
   - Host JS bundles on a CDN
   - Embed in Blazor/Nuxt/HTML pages with `<script>` tags
   - Point `server-url` to your production API

4. **Explore Prisma Studio**
   - Run: `npm run prisma:studio`
   - Browse/edit data visually at http://localhost:5555

---

## Support

If you encounter issues:
1. Check browser console for errors (`F12` → Console tab)
2. Check API logs in Terminal 1
3. Check Vite logs in Terminal 2
4. Check Docker logs: `docker-compose logs -f`
5. Verify all services are running: `docker-compose ps`
