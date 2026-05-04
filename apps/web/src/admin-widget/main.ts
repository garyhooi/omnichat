import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Admin Widget — Custom Element Registration
// ---------------------------------------------------------------------------
// Registers <omnichat-admin-widget> as a web component with Shadow DOM.
//
// Usage in any host page (backoffice, admin panel):
//
//   <omnichat-admin-widget
//     server-url="https://api.yoursite.com"
//     token="your-jwt-token"
//   ></omnichat-admin-widget>
//   <script src="https://cdn.yoursite.com/omnichat-admin-widget.js"></script>
//
// All styles are injected inside the Shadow Root — zero CSS bleed to the host.
// ---------------------------------------------------------------------------

const OmniChatAdminWidget = defineCustomElement(App, {
  styles: [styles],
})

customElements.define('omnichat-admin-widget', OmniChatAdminWidget)

export { OmniChatAdminWidget }
