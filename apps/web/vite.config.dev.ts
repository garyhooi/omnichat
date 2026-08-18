// Dev-only config for the widget debug harness (loads the @ alias).
import { defineConfig } from 'vite'
import { createBaseConfig } from './vite.base'

export default defineConfig({
  ...createBaseConfig(),
  server: {
    port: 5199,
    hmr: false,
  },
})
