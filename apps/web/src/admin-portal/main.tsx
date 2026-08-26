// =============================================================================
// <omnichat-admin-portal> — admin portal custom element registration.
//
// Usage on any host page (backoffice, iframe, plain HTML):
//
//   <omnichat-admin-portal
//     server-url="https://api.yoursite.com"
//     lang="zh-Hans">   <!-- optional UI language (default: English; any AI-translate language) -->
//   </omnichat-admin-portal>
//   <script src="https://cdn.yoursite.com/omnichat-admin-portal.js"></script>
//
// Shadow DOM with all styles injected — zero CSS bleed into the host page.
// Authenticates with the admin JWT in localStorage (omnichat_accessToken),
// same origin contract as the legacy Vue portal.
// =============================================================================

import { createRoot, type Root } from 'react-dom/client'
import { AdminRoot } from '../admin/Root'
import adminCss from '../admin/admin.css?inline'
import chatCss from '../features/chat/styles/chat.css?inline'
import agentCss from '../features/agent/agent-widget.css?inline'

// Admin shell + shared chat + agent-widget chrome (the conversation drawer
// reuses classes from all three stylesheets).
const STYLES = `<style>${adminCss}</style><style>${chatCss}</style><style>${agentCss}</style>`

const OBSERVED_ATTRIBUTES = ['server-url', 'lang']

class OmniChatAdminPortal extends HTMLElement {
  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  private root: Root | null = null

  connectedCallback() {
    if (this.root) return
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `${STYLES}<div class="admp-host"></div>`
    const el = shadow.querySelector<HTMLDivElement>('.admp-host')
    if (!el) throw new Error('admin portal mount point missing')
    this.root = createRoot(el)
    this.render()
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = null
  }

  attributeChangedCallback() {
    if (this.root) this.render()
  }

  private getServerUrl(): string | undefined {
    const url = (this.getAttribute('server-url') || '').replace(/\/$/, '')
    return url || undefined
  }

  private render() {
    this.root?.render(
      <AdminRoot serverUrl={this.getServerUrl()} lang={this.getAttribute('lang') || undefined} />,
    )
  }
}

if (!customElements.get('omnichat-admin-portal')) {
  customElements.define('omnichat-admin-portal', OmniChatAdminPortal)
}

export default OmniChatAdminPortal
export type { AdminRootProps } from '../admin/Root'
