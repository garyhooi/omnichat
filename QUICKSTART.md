# OmniChat — Quick Start Cheat Sheet

## TL;DR — 5 Commands to Test Locally

```bash
# 1. Install dependencies
npm install

# 2. Setup database provider
./scripts/use-provider.sh mysql

# 3. Start Docker (MySQL + Nginx)
docker-compose up -d

# 4. Push schema to database
npm run prisma:push

# 5. Now open 2 terminal windows and run these in parallel:
```

**Terminal 1: Start API**
```bash
cd apps/api && npm run dev
# API runs on http://localhost:3001
```

**Terminal 2: Start Web Dev Server**
```bash
cd apps/web && npm run dev
# Web runs on http://localhost:5173
```

---

## Test the Demo in 3 Steps

### 1. Create Admin Account (Postman/curl/browser)
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "displayName": "John Agent"
  }'
```

Copy the `accessToken` from the response.

### 2. Open Admin Portal in Browser
Navigate to: **http://localhost:5173**

Find this in the HTML:
```html
<omnichat-admin
  server-url="http://localhost:3001"
  token="YOUR_TOKEN_HERE"
></omnichat-admin>
```

Replace `YOUR_TOKEN_HERE` with the token from Step 1. 

**The admin portal should now be live with no conversations.**

### 3. Test with the Visitor Widget
- Click the floating chat bubble (bottom-right) on the same page
- Click "Start a conversation"
- Type a message from the widget
- Watch it appear in the admin portal in real-time
- Reply from admin portal
- Watch it appear in the widget

---

## Logs & Debugging

```bash
# Watch API logs (in Terminal 1)
cd apps/api && npm run dev

# Watch web dev server (in Terminal 2)
cd apps/web && npm run dev

# Watch Docker services (separate terminal)
docker-compose logs -f

# Open database visual explorer
npm run prisma:studio
# Then visit http://localhost:5555
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `Cannot find module '@prisma/client'` | `npm run prisma:generate` then restart API |
| MySQL connection refused | `docker-compose ps` to check if running, wait 30s |
| Token invalid in admin portal | Make sure you copied the full `accessToken` value |
| Widget won't connect | Check API running on 3001, look at browser console |
| Port 3001 in use | Change `PORT=3002` in `.env` |
| Port 5173 in use | Vite auto-increments, check console for new port |

---

## Full Documentation
See **SETUP.md** for detailed instructions and troubleshooting.
