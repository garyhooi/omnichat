// =============================================================================
// AI Translation — 20-language list, IndexedDB cache, fetchTranslation.
// Port of the legacy Vue utils/translationCache.ts.
// =============================================================================

import { djb2Hash } from './format'

export interface TranslateLanguage {
  value: string
  label: string
}

export const TRANSLATE_LANGS: TranslateLanguage[] = [
  { value: 'en', label: 'English' },
  { value: 'zh-Hans', label: '简体中文' },
  { value: 'zh-Hant', label: '繁體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'ar', label: 'العربية' },
  { value: 'ru', label: 'Русский' },
  { value: 'th', label: 'ไทย' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'hi', label: 'हिन्दी' },
]

export function translateLangLabel(value: string): string {
  return TRANSLATE_LANGS.find((l) => l.value === value)?.label ?? value
}

/** Normalize a browser locale (e.g. "en-US", "pt-BR") to a supported language value. */
export function normalizeLang(raw: string): string {
  const base = raw.toLowerCase()
  if (base.startsWith('zh')) {
    return /hant|tw|hk|mo/.test(base) ? 'zh-Hant' : 'zh-Hans'
  }
  // Strip the region tag ("en-US" -> "en") and check the supported list.
  const code = base.split('-')[0]
  if (TRANSLATE_LANGS.some((l) => l.value === code)) return code
  return 'en'
}

/** Default language from stored preference, else the browser language. */
export function getDefaultLang(storageKey: string): string {
  const stored = localStorage.getItem(storageKey)
  if (stored && TRANSLATE_LANGS.some((l) => l.value === stored)) return stored
  return normalizeLang(navigator.language || 'en')
}

// ---------------------------------------------------------------------------
// IndexedDB cache
// ---------------------------------------------------------------------------
const DB_NAME = 'omnichat_translations'
const STORE = 'translations'

interface CachedTranslation {
  id: string
  translatedText: string
  createdAt: number
}

function makeKey(text: string, lang: string): string {
  return `${djb2Hash(text)}:${lang}`
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbGet(key: string): Promise<CachedTranslation | undefined> {
  try {
    const db = await openDb()
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => resolve(req.result as CachedTranslation | undefined)
      req.onerror = () => resolve(undefined)
    })
  } catch {
    return undefined
  }
}

async function dbPut(record: CachedTranslation): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(record)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  } catch {
    /* IndexedDB unavailable — cache miss, keep working */
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function fetchTranslation(
  serverUrl: string,
  text: string,
  targetLanguage: string,
): Promise<string> {
  const key = makeKey(text, targetLanguage)
  const cached = await dbGet(key)
  if (cached) return cached.translatedText

  const res = await fetch(`${serverUrl}/ai/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  })
  if (!res.ok) throw new Error(`Translation failed (${res.status})`)
  const data = (await res.json()) as { translatedText: string; targetLanguage: string }
  await dbPut({ id: key, translatedText: data.translatedText, createdAt: Date.now() })
  return data.translatedText
}
