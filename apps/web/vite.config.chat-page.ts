import { defineConfig } from 'vite'
import { createBaseConfig } from './vite.base'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Chat Page build — <omnichat-chat-page> full-screen custom element
// Output: dist/omnichat-chat-page.js (single IIFE file)
// ---------------------------------------------------------------------------
export default defineConfig({
  ...createBaseConfig(),
  build: {
    ...createBaseConfig().build,
    lib: {
      entry: resolve(__dirname, 'src/chat-page/main.tsx'),
      formats: ['iife'],
      name: 'OmniChatChatPage',
      fileName: () => 'omnichat-chat-page.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
})
