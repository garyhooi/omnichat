// @vitest-environment jsdom
// =============================================================================
// Regression: who sees the per-message Translate button.
//
// The button is deliberately gated in two different ways:
//   visitor surfaces — only when the target language is not English (nothing to
//                     translate an English page into), so it is hidden by default
//                     on an English browser until the visitor picks a language
//                     in the TranslatePopover;
//   agent console   — always offered (alwaysOfferTranslate), because agents
//                     translate foreign messages INTO their own language, which
//                     is English by default.
// =============================================================================

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Message } from '../../../shared/types/models'
import { MessageBubble } from './MessageBubble'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const message: Message = {
  id: 'm1',
  conversationId: 'c1',
  senderType: 'ai',
  senderId: 'ai-agent',
  messageType: 'text',
  content: 'Hello there',
  attachmentUrl: null,
  attachmentThumbnailUrl: null,
  readAt: null,
  createdAt: '2026-09-25T00:00:00.000Z',
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function render(overrides: Record<string, unknown>): HTMLElement {
  act(() => {
    root.render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <MessageBubble
        message={message}
        isOwn={false}
        accentColor="#4F46E5"
        showSenderLabel={false}
        readReceiptsEnabled={false}
        translations={{}}
        translateLang="en"
        translationEnabled
        onTranslate={() => true}
        onOpenLightbox={() => {}}
        {...(overrides as Record<string, never>)}
      />,
    )
  })
  return container
}

const showsTranslate = (el: HTMLElement) => (el.textContent || '').includes('visitor.translate')

const markdownMessage: Message = {
  ...message,
  id: 'm2',
  content: 'Hi!\n\n- **Account questions**\n- **Deposits / Withdrawals**',
}

const clickButton = (el: HTMLElement, label: string) => {
  const btn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === label)
  expect(btn, 'button ' + label).toBeDefined()
  act(() => {
    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  return btn
}

describe('MessageBubble translate affordance', () => {
  it('offers Translate in the agent console even when the target language is English', () => {
    const el = render({ alwaysOfferTranslate: true, translateLang: 'en' })
    expect(showsTranslate(el)).toBe(true)
  })

  it('hides Translate for a visitor whose target language is English', () => {
    const el = render({ translateLang: 'en' })
    expect(showsTranslate(el)).toBe(false)
  })

  it('offers Translate to a visitor once another language is selected', () => {
    const el = render({ translateLang: 'es' })
    expect(showsTranslate(el)).toBe(true)
  })

  it('never offers Translate on the viewer own message', () => {
    const el = render({ isOwn: true, translateLang: 'es', alwaysOfferTranslate: true })
    expect(showsTranslate(el)).toBe(false)
  })

  it('offers no Translate button when translation is disabled', () => {
    const el = render({ translationEnabled: false, translateLang: 'es', alwaysOfferTranslate: true })
    expect(showsTranslate(el)).toBe(false)
  })
})

describe('MessageBubble translation states', () => {
  it('renders a translation through the markdown pipeline (bold/list, not raw text)', () => {
    const el = render({
      translateLang: 'tr',
      message: markdownMessage,
      translations: { 'm2:tr': 'Merhaba!\n\n- **Hesap** soruları\n- **Para Yatırma**' },
    })
    // The regression: translated text used to render as plain text, showing **.
    expect(el.textContent).not.toContain('**')
    expect(el.querySelectorAll('strong').length).toBe(2)
    expect(el.querySelectorAll('li').length).toBe(2)
    expect(el.querySelector('.oc-bubble')?.classList.contains('oc-translated')).toBe(true)
  })

  it('shows a Translating… placeholder with Cancel while a request is in flight', () => {
    const el = render({
      translateLang: 'tr',
      translationsPending: { 'm1:tr': true },
      onCancelTranslate: () => {},
    })
    expect(el.textContent).toContain('visitor.translating')
    expect(el.querySelector('.oc-tx-loading')).not.toBeNull()
    expect(el.textContent).toContain('common.cancel')
    // The original text is replaced by the placeholder while translating.
    expect(el.textContent).not.toContain('Hello there')
  })

  it('calls onCancelTranslate when Cancel is clicked', () => {
    const onCancelTranslate = vi.fn()
    const el = render({
      translateLang: 'tr',
      translationsPending: { 'm1:tr': true },
      onCancelTranslate,
    })
    clickButton(el, 'common.cancel')
    expect(onCancelTranslate).toHaveBeenCalledTimes(1)
    expect(onCancelTranslate).toHaveBeenCalledWith(message)
  })

  it('restores the original text with a retry hint when the translation fails', async () => {
    const onTranslate = vi.fn().mockResolvedValue(false)
    const el = render({ translateLang: 'tr', onTranslate })
    const btn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'visitor.translate')
    await act(async () => {
      btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })
    expect(el.textContent).toContain('Hello there')
    expect(el.textContent).toContain('visitor.translateFallback')
    expect(el.textContent).toContain('visitor.retry')
  })
})
