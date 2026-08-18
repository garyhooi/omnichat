// Dev harness — renders the widget root directly (no custom element) so
// React dev-mode errors show the full message + component stack.
import { createRoot } from 'react-dom/client'
import { WidgetRoot } from '@/features/widget/WidgetApp'
import chatCss from '@/features/chat/styles/chat.css?inline'
import widgetCss from '@/features/widget/widget.css?inline'

const style = document.createElement('style')
style.textContent = `${widgetCss}\n${chatCss}`
document.head.appendChild(style)

const container = document.createElement('div')
container.style.position = 'fixed'
container.style.inset = '0'
container.style.zIndex = '9999'
document.body.appendChild(container)

createRoot(container).render(<WidgetRoot serverUrl="http://localhost:3001" bubbleColor="#4f46e5" />)
