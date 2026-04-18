import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readdirSync, unlinkSync } from 'fs'

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
      // Only treat .ce.vue files as custom elements — page components compile normally
      customElement: /\.ce\.vue$/,
    }),
    // Suppress extracted CSS file — all styles are inlined via ?inline imports
    {
      name: 'no-css-file',
      enforce: 'post' as const,
      generateBundle(_, bundle) {
        for (const key of Object.keys(bundle)) {
          if (key.endsWith('.css')) delete bundle[key]
        }
      },
    },
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/admin/main.ce.ts'),
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
    // Don't clear dist — both admin and client bundles coexist
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
