import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Visitor — Custom Element Registration
// ---------------------------------------------------------------------------
// Usage in any host page:
//
//   <omnichat-visitor
//     server-url="https://api.yoursite.com"
//     bubble-color="#4F46E5"
//     welcome-message="Hi there! How can we help?">
//   </omnichat-visitor>
//   <script src="https://cdn.yoursite.com/omnichat-visitor.js"></script>
// ---------------------------------------------------------------------------

const OmniChatVisitor = defineCustomElement(App, {
  styles: [styles],
})

customElements.define('omnichat-visitor', OmniChatVisitor)

export { OmniChatVisitor }
