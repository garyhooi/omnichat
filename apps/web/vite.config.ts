import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Vite config — Development server
// ---------------------------------------------------------------------------
// This config is used for `vite dev` during development.
// For production builds, use vite.config.admin.ts or vite.config.client.ts.
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [
    vue({
      // Only treat .ce.vue files as custom elements
      customElement: /\.ce\.vue$/,
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
