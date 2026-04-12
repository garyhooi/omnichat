/// <reference types="vite/client" />

// Allow importing .vue files in TypeScript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Allow importing CSS as inline strings via Vite's ?inline query
declare module '*.css?inline' {
  const content: string
  export default content
}
