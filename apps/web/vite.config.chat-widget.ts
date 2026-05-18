import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Vite config — Chat Widget build
// ---------------------------------------------------------------------------
// Output: dist/omnichat-chat-widget.js
// Format: IIFE (no module loader required — just a <script> tag)
// Custom element: <omnichat-chat-widget>
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [
    vue({
      customElement: true,
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
      entry: resolve(__dirname, 'src/chat-widget/main.ts'),
      formats: ['iife'],
      name: 'OmniChatChatWidget',
      fileName: () => 'omnichat-chat-widget.js',
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
