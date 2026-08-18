import { describe, expect, it, beforeEach } from 'vitest'
import { resources, type UILocale } from './locales'
import { UI_LANGS, createUII18n, isSupportedUILang, resolveUILang } from './i18n'

function keysOf(locale: UILocale): string[] {
  return Object.keys(locale).sort()
}

describe('locale key parity (all 20 UI languages)', () => {
  const langs = Object.keys(resources)
  const enKeys = keysOf(resources.en.translation)

  it('exposes all AI-translate supported languages', () => {
    expect(UI_LANGS).toEqual([
      'en', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'fr', 'de', 'it', 'es', 'pt',
      'nl', 'pl', 'tr', 'ar', 'ru', 'th', 'vi', 'id', 'ms', 'hi',
    ])
  })

  it('every locale has exactly the same key set as English', () => {
    for (const lang of langs) {
      expect(resources[lang].translation, lang).toBeDefined()
      const localeKeys = keysOf(resources[lang].translation)
      expect(localeKeys, `${lang}: missing keys`).toEqual(enKeys)
    }
  })

  it('does not leave template placeholders untranslated holes', () => {
    for (const lang of langs) {
      for (const [key, value] of Object.entries(resources[lang].translation)) {
        expect(value.trim(), `${lang}:${key} has an empty value`).not.toBe('')
      }
    }
  })

  it('preserves every interpolation variable used by the English strings', () => {
    for (const lang of langs) {
      for (const [key, enValue] of Object.entries(resources.en.translation)) {
        const vars = (s: string) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort().join(',')
        expect(vars(resources[lang].translation[key] ?? ''), `${lang}:${key}`).toBe(vars(enValue))
      }
    }
  })
})

describe('resolveUILang — language is admin-controlled; the element lang attribute overrides', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { language: 'fr-FR' },
    })
  })

  it('prefers the element lang attribute', () => {
    expect(resolveUILang('zh-Hant')).toBe('zh-Hant')
  })

  it('falls back to the normalized browser language when no attribute is set', () => {
    expect(resolveUILang(undefined)).toBe('fr')
  })

  it('falls back to English when neither attribute nor browser matches', () => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { language: 'xx-YY' },
    })
    expect(resolveUILang('not-a-lang')).toBe('en')
  })

  it('defaults to English when navigator is unavailable (SSR)', () => {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: undefined })
    expect(resolveUILang(undefined)).toBe('en')
  })

  it('rejects unsupported languages', () => {
    expect(isSupportedUILang('xx')).toBe(false)
    expect(isSupportedUILang('en')).toBe(true)
    expect(isSupportedUILang(null)).toBe(false)
  })
})

describe('createUII18n', () => {
  it('initialises the instance with the requested language', () => {
    expect(createUII18n('ko')).toMatchObject({ language: 'ko' })
    expect(createUII18n('xx')).toMatchObject({ language: 'en' })
  })
})
