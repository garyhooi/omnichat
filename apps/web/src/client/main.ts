import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Visitor Widget — Custom Element Registration
// ---------------------------------------------------------------------------
// This file is the entry point for the visitor widget bundle.
// It registers <omnichat-widget> as a custom element with Shadow DOM encapsulation.
//
// Usage in any host page (Blazor, Nuxt, plain HTML):
//
//   <omnichat-widget
//     server-url="https://api.yoursite.com"
//     bubble-color="#4F46E5"
//     welcome-message="Hi there! How can we help?"
//   ></omnichat-widget>
//   <script src="https://cdn.yoursite.com/omnichat-client.js"></script>
//
// All styles are injected inside the Shadow Root — zero CSS bleed to the host.
// ---------------------------------------------------------------------------

const OmniChatWidget = defineCustomElement(App, {
  // Inject compiled Tailwind CSS into the Shadow Root.
  styles: [styles],
})

// Register the custom element globally
customElements.define('omnichat-widget', OmniChatWidget)

// Export for programmatic access
export { OmniChatWidget }
