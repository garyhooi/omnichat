// =============================================================================
// <omnichat-agent-widget> — agent console custom element.
//
//   <omnichat-agent-widget
//     server-url="https://api.yoursite.com"
//     lang="zh-Hans">   <!-- optional UI language (default: English; any AI-translate language) -->
//   </omnichat-agent-widget>
//   <script src="https://cdn.yoursite.com/omnichat-agent-widget.js"></script>
//
// Authenticates with the admin JWT in localStorage (omnichat_accessToken),
// same as the legacy Vue agent widget.
// =============================================================================

import { createRoot, type Root } from 'react-dom/client'
import { AgentWidgetRoot, type AgentWidgetAppProps } from '../features/agent/AgentWidgetApp'
import chatCss from '../features/chat/styles/chat.css?inline'
import agentCss from '../features/agent/agent-widget.css?inline'

const STYLES = `<style>${agentCss}</style><style>${chatCss}</style>`

const OBSERVED_ATTRIBUTES = ['server-url', 'accent-color', 'lang']

export class OmniChatAgentWidget extends HTMLElement {
  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  private root: Root | null = null
  private mountPoint: HTMLDivElement | null = null

  connectedCallback() {
    if (this.root) return
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `${STYLES}<div class="aw-widget-host"></div>`
    this.mountPoint = shadow.querySelector('.aw-widget-host')
    this.root = createRoot(this.mountPoint)
    this.render()
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = null
    this.mountPoint = null
  }

  attributeChangedCallback() {
    if (this.root) this.render()
  }

  private getProps(): AgentWidgetAppProps {
    const serverUrl = (this.getAttribute('server-url') || '').replace(/\/$/, '')
    return {
      serverUrl,
      accentColor: this.getAttribute('accent-color') || undefined,
      lang: this.getAttribute('lang') || undefined,
    }
  }

  private render() {
    const props = this.getProps()
    if (!props.serverUrl) {
      console.warn('[omnichat-agent-widget] missing "server-url" attribute')
      return
    }
    this.root?.render(<AgentWidgetRoot {...props} />)
  }
}

if (!customElements.get('omnichat-agent-widget')) {
  customElements.define('omnichat-agent-widget', OmniChatAgentWidget)
}

export default OmniChatAgentWidget
export type { AgentWidgetAppProps } from '../features/agent/AgentWidgetApp'
