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
import { TranslatePopover, computeMenuBox } from './TranslatePopover'

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

// The agent widget panel can be as small as 320x420 and clips its children
// (overflow:hidden) — the menu must shrink to the space inside it instead of
// being cut off at the panel edge.
describe('computeMenuBox — fit the menu inside its clip container', () => {
  const trigger = { top: 150, bottom: 178, left: 520, right: 552 }

  it('uses the full menu size when there is plenty of room', () => {
    const box = computeMenuBox(trigger, { top: 50, bottom: 670, left: 30, right: 430 }, 900)
    expect(box).toEqual({ maxHeight: 420, maxWidth: 420, minWidth: 280 })
  })

  it('caps the height to the space below the trigger inside the panel', () => {
    // 320x420 panel: bottom = 470 -> 470 - 178 - 10 = 282
    const box = computeMenuBox(trigger, { top: 50, bottom: 470, left: 470, right: 790 }, 900)
    expect(box.maxHeight).toBe(282)
  })

  it('shrinks the width so the menu cannot overflow the panel left edge', () => {
    // trigger.right (552) - panel.left (470) - 10 = 72 -> floor at 180
    const narrow = computeMenuBox(trigger, { top: 50, bottom: 470, left: 470, right: 790 }, 900)
    expect(narrow.maxWidth).toBe(180)
    expect(narrow.minWidth).toBe(180)
    // 200px of room -> maxWidth 200, minWidth 200 (preferred 280 does not fit)
    const medium = computeMenuBox(
      { ...trigger, right: 680 },
      { top: 50, bottom: 470, left: 470, right: 790 },
      900,
    )
    expect(medium.maxWidth).toBe(200)
    expect(medium.minWidth).toBe(200)
  })

  it('never goes below the usable minimum (no clip container / tiny viewport)', () => {
    const box = computeMenuBox({ top: 10, bottom: 40, left: 0, right: 20 }, null, 40)
    expect(box.maxHeight).toBe(160)
    expect(box.maxWidth).toBe(180)
    expect(box.minWidth).toBe(180)
  })
})
