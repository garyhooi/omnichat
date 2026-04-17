# OmniChat — Quick Start Cheat Sheet

## TL;DR — 5 Commands to Test Locally

```bash
# 1. Install dependencies
bun install

# 2. Setup database provider
./scripts/use-provider.sh mysql

# 3. Start Docker (MySQL + Nginx)
docker-compose up -d

# 4. Push schema to database
bun run prisma:push

# 5. Now open 2 terminal windows and run these in parallel:
```

**Terminal 1: Start API**
```bash
cd apps/api && bun run dev
# API runs on http://localhost:3001
```

**Terminal 2: Start Web Dev Server**
```bash
cd apps/web && bun run dev
# Web runs on http://localhost:5173
```

---


## Test the Demo in 3 Steps

### 1. Start the Local Demo Server
Run the secure demo server to serve the HTML pages over HTTP so the browser can attach the HttpOnly cookies for security:
```bash
bun serve-demo.js
```
This will run the demo server at **http://localhost:8081**.

### 2. Create Admin Account (via API)
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "SecurePassword123!",
    "displayName": "John Agent"
  }'
```

*(No need to copy the token! The API automatically sets the HttpOnly cookie for future requests).*

### 3. Open Admin Dashboard and Widget
Navigate to:
- **Admin Dashboard:** [http://localhost:8081/demo/admin.html](http://localhost:8081/demo/admin.html)
- **Visitor Widget:** [http://localhost:8081/demo/widget.html](http://localhost:8081/demo/widget.html)

Sign in from the Admin Dashboard and the portal will load. Open the Visitor Widget in a separate tab or window to start a conversation!

---

## Logs & Debugging

```bash
# Watch API logs (in Terminal 1)
cd apps/api && bun run dev

# Watch web dev server (in Terminal 2)
cd apps/web && bun run dev

# Watch Docker services (separate terminal)
docker-compose logs -f

# Open database visual explorer
bun run prisma:studio
# Then visit http://localhost:5555
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `Cannot find module '@prisma/client'` | `bun run prisma:generate` then restart API |
| MySQL connection refused | `docker-compose ps` to check if running, wait 30s |
| Unauthorized in admin portal | Ensure you are using `http://localhost:8081` instead of `file://` |
| Widget won't connect | Check API running on 3001, look at browser console |
| Port 3001 in use | Change `PORT=3002` in `.env` |
| Port 5173 in use | Vite auto-increments, check console for new port |

---

## Full Documentation
See **SETUP.md** for detailed instructions and troubleshooting.
