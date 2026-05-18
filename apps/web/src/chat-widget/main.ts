import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Chat Widget — Custom Element Registration
// ---------------------------------------------------------------------------
// This file is the entry point for the chat widget bundle.
// It registers <omnichat-chat-widget> as a custom element with Shadow DOM encapsulation.
//
// Usage in any host page (Blazor, Nuxt, plain HTML):
//
//   <omnichat-chat-widget
//     server-url="https://api.yoursite.com"
//     bubble-color="#4F46E5"
//     welcome-message="Hi there! How can we help?"
//   ></omnichat-chat-widget>
//   <script src="https://cdn.yoursite.com/omnichat-chat-widget.js"></script>
//
// All styles are injected inside the Shadow Root — zero CSS bleed to the host.
// ---------------------------------------------------------------------------

const OmniChatChatWidget = defineCustomElement(App, {
  // Inject compiled Tailwind CSS into the Shadow Root.
  styles: [styles],
})

// Register the custom element globally
customElements.define('omnichat-chat-widget', OmniChatChatWidget)

// Export for programmatic access
export { OmniChatChatWidget }
