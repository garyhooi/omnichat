import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Vite config — Admin Portal build
// ---------------------------------------------------------------------------
// Output: dist/omnichat-admin-portal.js
// Format: IIFE (no module loader required — just a <script> tag)
// Custom element: <omnichat-admin-portal>
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [
    vue({
      customElement: /\.ce\.vue$/,
    }),
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
      entry: resolve(__dirname, 'src/admin-portal/main.ce.ts'),
      formats: ['iife'],
      name: 'OmniChatAdminPortal',
      fileName: () => 'omnichat-admin-portal.js',
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
