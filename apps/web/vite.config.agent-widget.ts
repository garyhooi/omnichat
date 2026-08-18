import { defineConfig } from 'vite'
import { createBaseConfig } from './vite.base'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Agent Widget build — <omnichat-agent-widget> custom element
// Output: dist/omnichat-agent-widget.js (single IIFE file)
// ---------------------------------------------------------------------------
export default defineConfig({
  ...createBaseConfig(),
  build: {
    ...createBaseConfig().build,
    lib: {
      entry: resolve(__dirname, 'src/agent/main.tsx'),
      formats: ['iife'],
      name: 'OmniChatAgentWidget',
      fileName: () => 'omnichat-agent-widget.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
})
