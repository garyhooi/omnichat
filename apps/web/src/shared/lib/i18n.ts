// =============================================================================
// UI internationalisation — react-i18next setup.
//
// Every embeddable surface (chat widget, chat page, agent widget, admin
// portal) builds its OWN i18n instance via createUII18n() so multiple
// components on one host page never fight over a shared language.
//
// Language is admin-controlled: the admin portal → Widget Setup stores the
// default UI language for the visitor surfaces (visitorLanguage) and for the
// operator surfaces (adminLanguage) on the site config. Each surface applies
// that default via useApplyUiLang once the config loads. The element's
// optional lang attribute overrides it per embed. Supported languages === the
// AI-translate language list.
// =============================================================================
import i18n, { type i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './locales'
import { TRANSLATE_LANGS, normalizeLang } from './translationCache'

/** Language values supported by the UI — identical to the AI-translate options. */
export const UI_LANGS: readonly string[] = TRANSLATE_LANGS.map((l) => l.value)

export type UII18n = I18nInstance

export function isSupportedUILang(value: string | null | undefined): value is string {
  return !!value && UI_LANGS.includes(value)
}

/**
 * Resolve the effective UI language from the element's optional lang
 * attribute: the attribute wins, otherwise fall back to the browser
 * language (normalized), else English. The admin-configured default from
 * the site config is applied separately by useApplyUiLang once loaded.
 */
export function resolveUILang(attrLang: string | undefined): string {
  if (isSupportedUILang(attrLang)) return attrLang
  const navLang =
    typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en'
  return normalizeLang(navLang)
}

/** Build a fresh, isolated i18next instance for one embedded surface. */
export function createUII18n(lang: string): I18nInstance {
  const instance = i18n.createInstance()
  void instance
    .use(initReactI18next)
    .init({
      resources,
      lng: isSupportedUILang(lang) ? lang : 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    })
  return instance
}
