import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

// ---------------------------------------------------------------------------
// Vite config — Chat Page build
// ---------------------------------------------------------------------------
// Output: dist/omnichat-chat-page.js
// Format: IIFE (full-page chat custom element)
// Custom element: <omnichat-chat-page>
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, './src/chat-page/main.ts'),
      formats: ['iife'],
      name: 'OmniChatChatPage',
      fileName: () => 'omnichat-chat-page.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: 'esbuild',
    cssMinify: false,
    emptyOutDir: false,
    modulePreload: {
      polyfill: false,
    },
  },
})
