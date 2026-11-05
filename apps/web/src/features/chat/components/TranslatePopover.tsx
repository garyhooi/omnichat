import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, Sparkles } from 'lucide-react'
import { TRANSLATE_LANGS } from '../../../shared/lib/translationCache'

export interface TranslatePopoverProps {
  lang: string
  autoEnabled: boolean
  onLangChange: (lang: string) => void
  onAutoChange: (enabled: boolean) => void
}

/** Keeps the menu usable even when the host panel is very short/narrow. */
const MIN_MENU_HEIGHT = 160
const MIN_MENU_WIDTH = 180
const MAX_MENU_HEIGHT = 420
const MAX_MENU_WIDTH = 420
const PREFERRED_MENU_WIDTH = 280
/** Gap kept between the menu and the clip container edges. */
const MENU_MARGIN = 10

export interface MenuBox {
  maxHeight?: number
  maxWidth?: number
  minWidth?: number
}

interface RectLike {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * Fit the menu inside the space between the trigger and its clip container
 * (the agent widget panel can be as small as 320x420 with overflow:hidden).
 * Exported for tests — pure rect math, no DOM access.
 */
export function computeMenuBox(trigger: RectLike, clip: RectLike | null, viewportHeight: number): MenuBox {
  const clipBottom = Math.min(clip?.bottom ?? viewportHeight, viewportHeight)
  const clipLeft = Math.max(clip?.left ?? 0, 0)
  const spaceBelow = clipBottom - trigger.bottom - MENU_MARGIN
  // The menu is right-aligned to the trigger; keep its left edge inside.
  const spaceLeft = trigger.right - clipLeft - MENU_MARGIN
  const maxWidth = Math.max(MIN_MENU_WIDTH, Math.min(MAX_MENU_WIDTH, Math.round(spaceLeft)))
  return {
    maxHeight: Math.max(MIN_MENU_HEIGHT, Math.min(MAX_MENU_HEIGHT, Math.round(spaceBelow))),
    maxWidth,
    minWidth: Math.min(PREFERRED_MENU_WIDTH, maxWidth),
  }
}

/**
 * Walk up until the first clip container (an ancestor with overflow other than
 * visible, e.g. the widget/panel frame) or a fixed-position ancestor. Widgets
 * live in a shadow root, so the walk has to hop across the shadow boundary.
 */
function findClipRect(start: HTMLElement): DOMRect | null {
  let node: Element | null = start.parentElement
  while (node) {
    const style = getComputedStyle(node)
    if (
      style.position === 'fixed' ||
      style.overflowY !== 'visible' ||
      style.overflowX !== 'visible'
    ) {
      return node.getBoundingClientRect()
    }
    const parent: Element | null = node.parentElement
    if (parent) {
      node = parent
      continue
    }
    const root = node.getRootNode()
    node = root instanceof ShadowRoot && root.host ? root.host : null
  }
  return null
}

/**
 * Language + auto-translate popover anchored under the header's translate
 * button. Closes on outside click / Escape.
 *
 * The language list selects the AI-translation target only — the interface
 * language is independent (element [lang] attribute / admin default). It is a
 * two-column grid so all 20 languages — Español included — are visible
 * without a hidden scroll.
 *
 * The menu measures the space inside its clip container (the agent widget
 * panel can be as small as 320x420 and has overflow:hidden), so it shrinks to
 * fit instead of being cut off at the panel edge.
 */
export function TranslatePopover({ lang, autoEnabled, onLangChange, onAutoChange }: TranslatePopoverProps) {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [menuBox, setMenuBox] = useState<MenuBox>({})

  const measure = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    const trigger = el.getBoundingClientRect()
    const clip = findClipRect(el)
    setMenuBox(computeMenuBox(trigger, clip, window.innerHeight))
  }, [])

  // Measure before paint so the menu never renders clipped for a frame.
  useLayoutEffect(() => {
    if (open) measure()
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open, measure])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      // Widgets mount inside a shadow root, where document-level listeners see
      // the shadow *host* as e.target (event retargeting) — never the real
      // element. Check the composed path instead so clicks on the popover's own
      // items (language buttons, auto-translate) are not treated as "outside".
      if (rootRef.current && !e.composedPath().includes(rootRef.current)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        type="button"
        className="oc-icon-btn"
        title={t('common.translation')}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Languages size={16} />
      </button>
      {open && (
        <div className="oc-popover" style={{ right: 0, top: 'calc(100% + 6px)', ...menuBox }}>
          <button
            type="button"
            className={`oc-popover-item ${autoEnabled ? 'oc-active' : ''}`}
            onClick={() => onAutoChange(!autoEnabled)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Sparkles size={14} />
            {t('common.autoTranslate')}
          </button>
          <div style={{ height: 1, background: 'var(--oc-border)', margin: '4px 0' }} />
          <div className="oc-popover-langs">
            {TRANSLATE_LANGS.map((l) => (
              <button
                key={l.value}
                type="button"
                className={`oc-popover-item ${l.value === lang ? 'oc-active' : ''}`}
                onClick={() => {
                  onLangChange(l.value)
                  setOpen(false)
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
