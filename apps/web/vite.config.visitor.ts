import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

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
      entry: path.resolve(__dirname, './src/visitor/main.ts'),
      formats: ['iife'],
      name: 'OmniChatVisitor',
      fileName: () => 'omnichat-visitor.js',
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
