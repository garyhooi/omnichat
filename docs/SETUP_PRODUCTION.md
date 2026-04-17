# OmniChat Production Deployment Guide

This guide explains how to deploy the OmniChat system to a production environment. 

OmniChat is designed with a decoupled architecture:
1. **The Backend (NestJS API & Socket.io):** Handles business logic, database operations, and real-time WebSocket connections.
2. **The Frontend (Vue 3 Web Components):** Compiled into standalone JavaScript files (`omnichat-widget.js` and `omnichat-admin.js`) that can be embedded into *any* website or framework (Blazor, WordPress, React, plain HTML) like a standard script tag.

---

## Phase 1: Deploying the Backend (NestJS API)

The backend needs a Bun environment and a database (e.g., PostgreSQL). It can be hosted on a VPS (DigitalOcean, AWS, Azure), Railway, Render, or within a Docker container.

### 1. Setup and Build
```bash
cd apps/api
bun install
```

### 2. Configure Environment Variables
Create a `.env` file in the `apps/api` directory:
```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/omnichat"

# JWT Secret for admin authentication
JWT_SECRET="your-super-secure-random-secret-key"

# Port for the API to listen on
PORT=3001

# Allowed origins for CORS (e.g., your main website's domain)
CORS_ORIGIN="https://www.your-website.com"
```

### 3. Database Migration
Apply the database schema:
```bash
bun prisma generate
bun prisma migrate deploy # Use 'deploy' for production, not 'db push'
```

### 4. Build and Run
Compile the TypeScript code and start the server:
```bash
bun run build
bun run start:prod
```
*Note: In production, it is highly recommended to run the app using a process manager like **PM2** (`pm2 start dist/main.js --name omnichat-api`) or run it inside a Docker container to ensure it restarts automatically if it crashes.*

### 5. Reverse Proxy & SSL (Crucial)
You must place the API behind a reverse proxy (like Nginx) and secure it with SSL/TLS (HTTPS). WebSockets (`wss://`) require a secure connection to function properly in modern browsers. 
Ensure your Nginx config upgrades the connection for WebSockets:
```nginx
location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

---

## Phase 2: Building and Hosting the Frontend (Web Components)

The frontend consists of Vue components that we compile into raw JavaScript files. These do not require a Bun server to run; they are purely static files.

### 1. Build the Bundles
```bash
cd apps/web
bun install

# Build the chat widget for website visitors
bun run build:client

# Build the admin dashboard
bun run build:admin
```

This will output two files in the `apps/web/dist` directory:
- `omnichat-widget.js`
- `omnichat-admin.js`

### 2. Host the Static Files
You need to host these `.js` files so they are publicly accessible via a URL. You **do not** need to manually copy them into your host application's (like Blazor's) `wwwroot` anymore.

You can host them on:
- **A CDN** (e.g., AWS CloudFront, Cloudflare).
- **Static Hosting** (Vercel, Netlify, GitHub Pages).
- **Your own Nginx Server** (e.g., serving them from `/var/www/omnichat-cdn/`).

Once hosted, you will have URLs like:
- `https://cdn.your-domain.com/js/omnichat-widget.js`
- `https://cdn.your-domain.com/js/omnichat-admin.js`

---

## Phase 3: Integrating into Your Host Application

Now that your API is running and your JS files are hosted publicly, you can embed OmniChat into **any** website.

### Integrating the Chat Widget (For Visitors)
Add this snippet to the bottom of your website's `<body>` (e.g., in your Blazor `_Layout.cshtml`, WordPress footer, or React `index.html`):

```html
<!-- 1. Load the script from your CDN/Host -->
<script src="https://cdn.your-domain.com/js/omnichat-widget.js" defer></script>

<!-- 2. Add the custom element anywhere in the DOM -->
<omnichat-widget
    server-url="https://api.your-domain.com"
    bubble-color="#4F46E5"
    welcome-message="Hi there! 👋 How can we help you today?"
></omnichat-widget>
```

### Integrating the Admin Dashboard
Create an admin page in your application (like we did in Blazor) and add this snippet:

```html
<!-- 1. Load the admin script from your CDN/Host -->
<script src="https://cdn.your-domain.com/js/omnichat-admin.js" defer></script>

<!-- 2. Add the custom element -->
<!-- Note: You will need to dynamically set the 'token' attribute after the user logs in -->
<omnichat-admin
    server-url="https://api.your-domain.com"
    token="YOUR_JWT_TOKEN_HERE"
></omnichat-admin>
```

### Why this is better:
- **Decoupled:** Your main website (Blazor, etc.) does not need to store, build, or care about the OmniChat codebase.
- **Auto-Updating:** If you update the OmniChat Vue code, rebuild it, and upload the new `.js` to your CDN, all websites using the `<script>` tag will automatically get the latest version on the next page refresh.
- **Cache Friendly:** Browsers will cache the `.js` file from your CDN, making it load instantly for users navigating between pages.