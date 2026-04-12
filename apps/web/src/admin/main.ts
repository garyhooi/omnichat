import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Admin Portal — Custom Element Registration
// ---------------------------------------------------------------------------
// This file is the entry point for the admin portal bundle.
// It registers <omnichat-admin> as a custom element with Shadow DOM encapsulation.
//
// Usage in any host page (Blazor, Nuxt, plain HTML):
//
//   <omnichat-admin
//     server-url="https://api.yoursite.com"
//     token="eyJhbGciOiJIUzI1NiJ9..."
//   ></omnichat-admin>
//   <script src="https://cdn.yoursite.com/omnichat-admin.js"></script>
//
// Vue's defineCustomElement automatically maps hyphenated HTML attributes
// (server-url, token) to camelCase props (serverUrl, token).
// Blazor passes attributes as strings — no special handling needed.
// ---------------------------------------------------------------------------

const OmniChatAdmin = defineCustomElement(App, {
  // Inject compiled Tailwind CSS into the Shadow Root.
  // This ensures utility classes are scoped and never leak to the host page.
  styles: [styles],
})

// Register the custom element globally
customElements.define('omnichat-admin', OmniChatAdmin)

// Export for environments that want programmatic access
export { OmniChatAdmin }
