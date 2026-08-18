// =============================================================================
// I18nScope — per-surface i18next provider.
//
// Each mounted surface creates ONE stable instance (useState initializer).
// A lang prop change (the element's lang attribute being updated) switches
// the live instance. The admin-configured default UI language (site config)
// is applied by useApplyUiLang from inside the surface after config loads.
// =============================================================================
import { useEffect, useRef, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import {
  createUII18n,
  isSupportedUILang,
  resolveUILang,
  type UII18n,
} from '../lib/i18n'

export interface I18nScopeProps {
  /** Element [lang] attribute (optional; resolved with fallback chain). */
  lang?: string
  children: React.ReactNode
}

export function I18nScope({ lang, children }: I18nScopeProps) {
  const [instance] = useState<UII18n>(() => createUII18n(resolveUILang(lang)))
  const lastAttrLang = useRef(lang)

  useEffect(() => {
    if (lang !== lastAttrLang.current && isSupportedUILang(lang)) {
      lastAttrLang.current = lang
      void instance.changeLanguage(lang)
    }
  }, [lang, instance])

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
