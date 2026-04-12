import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Vite config — Visitor Widget build
// ---------------------------------------------------------------------------
// Output: dist/omnichat-client.js
// Format: IIFE (no module loader required — just a <script> tag)
// Custom element: <omnichat-widget>
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [
    vue({
      // Enable custom element mode for .ce.vue files
      customElement: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/client/main.ts'),
      formats: ['iife'],
      name: 'OmniChatWidget',
      fileName: () => 'omnichat-client.js',
    },
    rollupOptions: {
      output: {
        // Single-file output — all dependencies inlined
        inlineDynamicImports: true,
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Minify for production
    minify: 'terser',
    // Output to dist/
    outDir: 'dist',
    // Don't clear dist — we want both admin and client bundles to coexist
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
