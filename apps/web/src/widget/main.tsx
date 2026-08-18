// =============================================================================
// <omnichat-chat-widget> — custom element registration.
//
// Usage on any host page (Blazor, Nuxt, plain HTML, server-rendered apps):
//
//   <omnichat-chat-widget
//     server-url="https://api.yoursite.com"
//     bubble-color="#4F46E5"
//     external-token="..."
//     lang="zh-Hans"       <!-- optional UI language (default: English; any AI-translate language) -->
//   ></omnichat-chat-widget>
//   <script src="https://cdn.yoursite.com/omnichat-chat-widget.js"></script>
//
// Styles are injected inside the Shadow Root — zero CSS bleed into the host
// page. React 19 mounts into a container div inside the shadow root.
// =============================================================================

import { createRoot, type Root } from 'react-dom/client'
import { WidgetRoot, type WidgetAppProps } from '../features/widget/WidgetApp'
import chatCss from '../features/chat/styles/chat.css?inline'
import widgetCss from '../features/widget/widget.css?inline'

const STYLES = `<style>${widgetCss}</style><style>${chatCss}</style>`

const OBSERVED_ATTRIBUTES = ['server-url', 'bubble-color', 'external-token', 'lang']

export class OmniChatChatWidget extends HTMLElement {
  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  private root: Root | null = null
  private mountPoint: HTMLDivElement | null = null

  connectedCallback() {
    if (this.root) return // already mounted
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `${STYLES}<div class="oc-widget-host"></div>`
    this.mountPoint = shadow.querySelector('.oc-widget-host')
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

  private getProps(): WidgetAppProps {
    const serverUrl = (this.getAttribute('server-url') || '').replace(/\/$/, '')
    return {
      serverUrl,
      bubbleColor: this.getAttribute('bubble-color') || undefined,
      externalToken: this.getAttribute('external-token') || undefined,
      position: this.getAttribute('position') || undefined,
      lang: this.getAttribute('lang') || undefined,
    }
  }

  private render() {
    const props = this.getProps()
    if (!props.serverUrl) {
      console.warn('[omnichat-chat-widget] missing "server-url" attribute')
      return
    }
    this.root?.render(<WidgetRoot {...props} />)
  }
}

// Register once; the IIFE bundle may be loaded on pages that already have it.
if (!customElements.get('omnichat-chat-widget')) {
  customElements.define('omnichat-chat-widget', OmniChatChatWidget)
}

// Programmatic access for host pages.
export default OmniChatChatWidget
export type { WidgetAppProps } from '../features/widget/WidgetApp'
