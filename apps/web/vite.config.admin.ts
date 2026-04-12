import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Vite config — Admin Portal build
// ---------------------------------------------------------------------------
// Output: dist/omnichat-admin.js
// Format: IIFE (no module loader required — just a <script> tag)
// Custom element: <omnichat-admin>
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
      entry: resolve(__dirname, 'src/admin/main.ts'),
      formats: ['iife'],
      name: 'OmniChatAdmin',
      fileName: () => 'omnichat-admin.js',
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
    // Clear dist before building
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
