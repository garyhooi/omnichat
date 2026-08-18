import { defineConfig } from 'vite'
import { createBaseConfig } from './vite.base'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Chat Widget build — <omnichat-chat-widget> custom element
// Output: dist/omnichat-chat-widget.js (single IIFE file)
// ---------------------------------------------------------------------------
export default defineConfig({
  ...createBaseConfig(),
  build: {
    ...createBaseConfig().build,
    lib: {
      entry: resolve(__dirname, 'src/widget/main.tsx'),
      formats: ['iife'],
      name: 'OmniChatChatWidget',
      fileName: () => 'omnichat-chat-widget.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
})
