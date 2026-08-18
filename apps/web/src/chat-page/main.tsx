// =============================================================================
// <omnichat-chat-page> — full-page chat custom element.
//
//   <omnichat-chat-page
//     server-url="https://api.yoursite.com"
//     bubble-color="#4F46E5"
//     lang="zh-Hans">   <!-- optional UI language (default: English; any AI-translate language) -->
//   </omnichat-chat-page>
//   <script src="https://cdn.yoursite.com/omnichat-chat-page.js"></script>
// =============================================================================

import { createRoot, type Root } from 'react-dom/client'
import { PageRoot, type PageAppProps } from '../features/chat-page/PageApp'
import chatCss from '../features/chat/styles/chat.css?inline'
import pageCss from '../features/chat-page/page.css?inline'

const STYLES = `<style>${pageCss}</style><style>${chatCss}</style>`

const OBSERVED_ATTRIBUTES = ['server-url', 'bubble-color', 'external-token', 'lang']

export class OmniChatChatPage extends HTMLElement {
  static get observedAttributes() {
    return OBSERVED_ATTRIBUTES
  }

  private root: Root | null = null
  private mountPoint: HTMLDivElement | null = null

  connectedCallback() {
    if (this.root) return
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `${STYLES}<div class="oc-page-host"></div>`
    this.mountPoint = shadow.querySelector('.oc-page-host')
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

  private getProps(): PageAppProps {
    const serverUrl = (this.getAttribute('server-url') || '').replace(/\/$/, '')
    return {
      serverUrl,
      bubbleColor: this.getAttribute('bubble-color') || undefined,
      externalToken: this.getAttribute('external-token') || undefined,
      lang: this.getAttribute('lang') || undefined,
    }
  }

  private render() {
    const props = this.getProps()
    if (!props.serverUrl) {
      console.warn('[omnichat-chat-page] missing "server-url" attribute')
      return
    }
    this.root?.render(<PageRoot {...props} />)
  }
}

if (!customElements.get('omnichat-chat-page')) {
  customElements.define('omnichat-chat-page', OmniChatChatPage)
}

export default OmniChatChatPage
export type { PageAppProps } from '../features/chat-page/PageApp'
