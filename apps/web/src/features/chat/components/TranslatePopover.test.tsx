// @vitest-environment jsdom
// =============================================================================
// Language menu — every AI-translate language (Español included) must be a
// selectable option. The menu only picks the AI-translation target; the
// interface language is set independently (element [lang] attribute / admin
// default), so the list is never relabelled as an interface-language picker.
// =============================================================================

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TRANSLATE_LANGS } from '../../../shared/lib/translationCache'
import { TranslatePopover } from './TranslatePopover'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

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

function render(props: {
  lang?: string
  autoEnabled?: boolean
  onLangChange?: (lang: string) => void
  onAutoChange?: (enabled: boolean) => void
}) {
  act(() => {
    root.render(
      <TranslatePopover
        lang={props.lang ?? 'en'}
        autoEnabled={props.autoEnabled ?? false}
        onLangChange={props.onLangChange ?? (() => {})}
        onAutoChange={props.onAutoChange ?? (() => {})}
      />,
    )
  })
  // Open the popover.
  const trigger = container.querySelector('button')
  act(() => {
    trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  return container
}

const languageButtons = (el: HTMLElement) =>
  Array.from(el.querySelectorAll('.oc-popover-langs button')) as HTMLButtonElement[]

describe('TranslatePopover language menu', () => {
  it('offers all 20 AI-translate languages, Español included', () => {
    const el = render({})
    const texts = languageButtons(el).map((b) => b.textContent)
    expect(texts).toHaveLength(TRANSLATE_LANGS.length)
    expect(texts).toContain('Español')
    expect(texts).toEqual(TRANSLATE_LANGS.map((l) => l.label))
  })

  it('reports the picked translation language (Spanish) and closes the menu', () => {
    const onLangChange = vi.fn()
    const el = render({ onLangChange })
    const spanish = languageButtons(el).find((b) => b.textContent === 'Español')
    expect(spanish).toBeDefined()
    act(() => {
      spanish?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onLangChange).toHaveBeenCalledWith('es')
    expect(el.querySelector('.oc-popover')).toBeNull()
  })

  it('never relabels the menu as an interface-language picker', () => {
    const el = render({})
    expect(el.textContent).not.toContain('common.uiLanguage')
    expect(el.querySelector('.oc-popover-label')).toBeNull()
  })

  it('marks the active translation language', () => {
    const el = render({ lang: 'es' })
    const active = languageButtons(el).find((b) => b.className.includes('oc-active'))
    expect(active?.textContent).toBe('Español')
  })
})
