import { defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import AdminDashboard from './AdminDashboard.ce.vue'
import style from './style.css?inline'

// ---------------------------------------------------------------------------
// OmniChat Admin Portal — Custom Element Entry Point
// ---------------------------------------------------------------------------
// Registers <omnichat-admin> as a web component with Shadow DOM.
// Uses Vue's configureApp to install Pinia inside the custom element.
// ---------------------------------------------------------------------------

const OmniChatAdmin = defineCustomElement(AdminDashboard, {
  styles: [style],
  configureApp(app) {
    app.use(createPinia())
  },
})

customElements.define('omnichat-admin', OmniChatAdmin)
