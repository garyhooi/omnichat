import { defineConfig } from 'vite'
import { createBaseConfig } from './vite.base'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// Admin Portal build — <omnichat-admin-portal> custom element
// Output: dist/omnichat-admin-portal.js (single IIFE file, Shadow DOM styles)
// ---------------------------------------------------------------------------
export default defineConfig({
  ...createBaseConfig(),
  build: {
    ...createBaseConfig().build,
    lib: {
      entry: resolve(__dirname, 'src/admin-portal/main.tsx'),
      formats: ['iife'],
      name: 'OmniChatAdminPortal',
      fileName: () => 'omnichat-admin-portal.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    outDir: 'dist',
    emptyOutDir: false,
    cssCodeSplit: false,
  },
})
