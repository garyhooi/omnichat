# 💬 OmniChat

![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-green)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)

**OmniChat** is a high-performance, self-hosted, and open-source live chat system designed for modern websites. It provides a lightweight embeddable Vue 3 widget for your visitors and a powerful dashboard for your support agents.

## ✨ Features

* **⚡ Real-time Communication**: Powered by Socket.io for sub-millisecond latency.
* **🌐 Cross-Tab Persistence**: Visitors can navigate across your site or open new tabs without losing their chat session.
* **🕵️ Visitor Context Tracking**: Automatically captures and displays visitor IP, Browser, OS, Device, Current URL, Timezone, Language, and Referrer.
* **🖼️ Smart Image Uploads**: 
  * Client-side image compression (Canvas).
  * Backend thumbnail generation using `sharp`.
  * Built-in UI Lightbox for viewing high-res images.
* **⚡ Quick Replies**: Admins can configure canned responses and trigger them in chat by simply typing `/`.
* **⏱️ Auto-Resolution**: Automatically sends a 3-minute inactivity warning and resolves inactive chats after 5 minutes.
* **🎨 Highly Customizable Widget**: Change bubble colors, patterns, sizes, icons, and welcome messages directly from the Admin UI. Dynamic CORS configuration stored in the database.
* **⭐ Post-Chat Reviews**: Collect visitor feedback and star ratings after a conversation is resolved.

## 🛠️ Tech Stack

This project is structured as an npm workspace monorepo:

* **Backend (`apps/api`)**: NestJS, Prisma (MongoDB), Socket.io, Multer, Sharp.
* **Frontend (`apps/web`)**: Vue 3 (compiled to Custom Web Components via Vite).

## 🚀 Quick Start

### CDN Links

You can easily embed OmniChat via CDN:

* **Admin Portal Widget**: `https://cdn.jsdelivr.net/gh/garyhooi/omnichat@main/apps/web/dist/omnichat-admin.js`
* **Client Visitor Widget**: `https://cdn.jsdelivr.net/gh/garyhooi/omnichat@main/apps/web/dist/omnichat-client.js`

### Prerequisites
* Node.js >= 18.0.0
* MongoDB (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/garyhooi/omnichat.git
   cd omnichat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   * Navigate to `apps/api` and copy `.env.example` to `.env`.
   * Update the `DATABASE_URL` to point to your MongoDB instance.

4. **Sync the Database:**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **Run the Development Servers:**
   * **API Server:** 
     ```bash
     npm run dev:api
     ```
   * **Web/Frontend Builder:** 
     ```bash
     npm run dev:web
     ```

## 📚 Documentation

For more detailed setup instructions, including Docker and Production deployments, please refer to the following guides:

* [Local Setup Guide](doc/SETUP_LOCAL.md)
* [Production Deployment Guide](doc/SETUP_PRODUCTION.md)
* [Quickstart Overview](doc/QUICKSTART.md)

## 🤝 Contributing

Contributions are welcome! If you'd like to improve OmniChat, please fork the repository and submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
