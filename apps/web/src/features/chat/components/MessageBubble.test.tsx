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
