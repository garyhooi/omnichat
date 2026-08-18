// =============================================================================
// useApplyUiLang — apply the admin-configured default UI language.
//
// Language is admin-controlled (site config visitorLanguage / adminLanguage,
// set in the admin portal → Widget Setup). The site config loads
// asynchronously, so each surface applies the effective language once it is
// known. The element's [lang] attribute always wins over the configured value.
// =============================================================================
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isSupportedUILang } from '../lib/i18n'

/**
 * @param attrLang       The element's optional [lang] attribute.
 * @param configuredLang Admin-configured default (visitorLanguage or adminLanguage).
 */
export function useApplyUiLang(
  attrLang: string | undefined,
  configuredLang: string | null | undefined,
): void {
  const { i18n } = useTranslation()
  const effective = isSupportedUILang(attrLang)
    ? attrLang
    : isSupportedUILang(configuredLang)
      ? configuredLang
      : undefined

  useEffect(() => {
    if (effective) void i18n.changeLanguage(effective)
  }, [i18n, effective])
}
