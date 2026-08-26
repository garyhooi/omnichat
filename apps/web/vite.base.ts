import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

/**
 * Shared Vite base for all four OmniChat bundles.
 *
 * Widget-style bundles (chat-widget, chat-page, agent-widget) are built as
 * single-file IIFE libraries whose CSS is imported with `?inline` and injected
 * into each custom element's Shadow Root — zero CSS bleed into the host page.
 * The admin portal is a standalone SPA (regular build, not a custom element).
 */
export function createBaseConfig(): UserConfig {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      // Some bundled deps (socket.io, tanstack) reference process.env at runtime.
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      cssCodeSplit: false,
    },
  }
}
