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
// The cache key carries CACHE_VERSION: bumping it silently drops every stale
// entry on every client, so a bad cached translation is never something users
// have to clear out of their browser storage by hand.
const DB_NAME = 'omnichat_translations'
const STORE = 'translations'
const CACHE_VERSION = 'v2'

interface CachedTranslation {
  id: string
  translatedText: string
  createdAt: number
}

function makeKey(text: string, lang: string): string {
  // Length in the key: an accidental 32-bit hash collision between two different
  // texts can then never serve the wrong translation.
  return CACHE_VERSION + ':' + text.length + ':' + djb2Hash(text) + ':' + lang
}

/** One shared connection: opening per call leaked handles until opens queued. */
let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => {
        const db = req.result
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' })
        }
      }
      // Fail fast instead of hanging: an open() that never settles would block
      // the request itself (no translation, no network call, no error).
      req.onblocked = () => {
        dbPromise = null
        reject(new Error('indexedDB blocked'))
      }
      req.onerror = () => {
        dbPromise = null
        reject(req.error)
      }
      req.onsuccess = () => {
        const db = req.result
        db.onversionchange = () => {
          db.close()
          dbPromise = null
        }
        resolve(db)
      }
    })
  }
  return dbPromise
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

/**
 * A blocked or hung IndexedDB (sandboxed iframe, Safari storage eviction,
 * corrupted store) must never gate the network: the cache read is bounded and a
 * timeout counts as a miss, so a click always reaches /ai/translate.
 */
const CACHE_WAIT_MS = 800

function withDeadline<T>(work: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    work.catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), CACHE_WAIT_MS)),
  ])
}

export async function fetchTranslation(
  serverUrl: string,
  text: string,
  targetLanguage: string,
): Promise<string> {
  const key = makeKey(text, targetLanguage)
  const cached = await withDeadline(dbGet(key), undefined)
  // An entry identical to the source is a no-op ("already in the target
  // language", or a provider echoing the input). Serving it makes the button
  // look dead — no request, no visible change — so treat it as a miss.
  if (cached && cached.translatedText.trim() !== text.trim()) return cached.translatedText

  const res = await fetch(`${serverUrl}/ai/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  })
  if (!res.ok) {
    // Include the server's reason ("AI agent is not enabled", "Translation is
    // disabled", credit errors) — it is the difference between a broken feature
    // and an unconfigured one, and it is what support needs to see.
    const body = await res.text().catch(() => '')
    let reason = body.slice(0, 200)
    try {
      const parsed = JSON.parse(body) as { message?: string | string[]; error?: string }
      reason = Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message || parsed.error || reason
    } catch {
      /* not JSON — keep the raw body */
    }
    throw new Error('Translation failed (' + res.status + ')' + (reason ? ': ' + reason : ''))
  }
  const data = (await res.json()) as { translatedText?: string; translated?: string; targetLanguage?: string }
  // Write-behind: the result is returned immediately and the cache write can
  // neither delay nor fail the request. No-op results are never cached, so they
  // can never mask a real translation later.
  // Accept either field name: the fork's API answered `{ translated }` (the
  // legacy Vue contract), so reading only `translatedText` made a successful
  // translation look like a failure.
  const translated = data.translatedText ?? data.translated
  if (typeof translated !== 'string' || !translated.trim()) {
    throw new Error('Translation response had no text: ' + JSON.stringify(data).slice(0, 120))
  }
  if (translated.trim() !== text.trim()) {
    void dbPut({ id: key, translatedText: translated, createdAt: Date.now() })
  }
  return translated
}
