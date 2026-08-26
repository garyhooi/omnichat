import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, Sparkles } from 'lucide-react'
import { TRANSLATE_LANGS } from '../../../shared/lib/translationCache'

export interface TranslatePopoverProps {
  lang: string
  autoEnabled: boolean
  onLangChange: (lang: string) => void
  onAutoChange: (enabled: boolean) => void
}

/**
 * Language + auto-translate popover anchored under the header's translate
 * button. Closes on outside click / Escape.
 */
export function TranslatePopover({ lang, autoEnabled, onLangChange, onAutoChange }: TranslatePopoverProps) {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

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
        <div className="oc-popover" style={{ right: 0, top: 'calc(100% + 6px)' }}>
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
      )}
    </div>
  )
}
