import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Vite config — Admin Widget build
// ---------------------------------------------------------------------------
// Output: dist/omnichat-admin-widget.js
// Format: IIFE (no module loader required — just a <script> tag)
// Custom element: <omnichat-admin-widget>
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [
    vue({
      customElement: true,
    }),
    // Suppress extracted CSS file — all styles are inlined in the custom element
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
      entry: resolve(__dirname, 'src/admin-widget/main.ts'),
      formats: ['iife'],
      name: 'OmniChatAdminWidget',
      fileName: () => 'omnichat-admin-widget.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    target: 'es2020',
    minify: 'terser',
    outDir: 'dist',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
