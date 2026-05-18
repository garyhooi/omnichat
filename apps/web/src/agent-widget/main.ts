import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Agent Widget — Custom Element Registration
// ---------------------------------------------------------------------------
// Registers <omnichat-agent-widget> as a web component with Shadow DOM.
//
// Usage in any host page (backoffice, admin panel):
//
//   <omnichat-agent-widget
//     server-url="https://api.yoursite.com"
//     token="your-jwt-token"
//   ></omnichat-agent-widget>
//   <script src="https://cdn.yoursite.com/omnichat-agent-widget.js"></script>
//
// All styles are injected inside the Shadow Root — zero CSS bleed to the host.
// ---------------------------------------------------------------------------

const OmniChatAgentWidget = defineCustomElement(App, {
  styles: [styles],
})

customElements.define('omnichat-agent-widget', OmniChatAgentWidget)

export { OmniChatAgentWidget }
