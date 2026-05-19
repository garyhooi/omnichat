import { defineCustomElement } from 'vue'
import App from './App.ce.vue'
import styles from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Chat Page — Custom Element Registration
// ---------------------------------------------------------------------------
// Full-page chat custom element. Usage in any host page:
//
//   <omnichat-chat-page
//     server-url="https://api.yoursite.com"
//     bubble-color="#4F46E5"
//     welcome-message="Hi there! How can we help?">
//   </omnichat-chat-page>
//   <script src="https://cdn.yoursite.com/omnichat-chat-page.js"></script>
// ---------------------------------------------------------------------------

const OmniChatChatPage = defineCustomElement(App, {
  styles: [styles],
})

customElements.define('omnichat-chat-page', OmniChatChatPage)

export { OmniChatChatPage }
