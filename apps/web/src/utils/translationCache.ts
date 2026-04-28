const DB_NAME = 'omnichat_translations'
const DB_VERSION = 1
const STORE_NAME = 'translations'

export interface LangOption {
  value: string
  label: string
}

export const TRANSLATE_LANGS: LangOption[] = [
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

export function getDefaultLang(storageKey: string): string {
  const stored = localStorage.getItem(storageKey)
  if (stored) return stored

  const sysLang = navigator.language || (navigator as any).userLanguage || ''
  const short = sysLang.split('-')[0].toLowerCase()

  if (short === 'zh') {
    return sysLang.toLowerCase().includes('hant') || sysLang.toLowerCase().includes('tw') || sysLang.toLowerCase().includes('hk')
      ? 'zh-Hant'
      : 'zh-Hans'
  }

  const match = TRANSLATE_LANGS.find((l) => l.value === short)
  return match ? match.value : 'en'
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function makeKey(text: string, targetLanguage: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return `${hash}:${targetLanguage}`
}

export async function getCachedTranslation(text: string, targetLanguage: string): Promise<string | null> {
  try {
    const db = await openDB()
    const key = makeKey(text, targetLanguage)
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(key)
      request.onsuccess = () => {
        db.close()
        resolve(request.result?.translatedText || null)
      }
      request.onerror = () => {
        db.close()
        reject(request.error)
      }
    })
  } catch {
    return null
  }
}

export async function setCachedTranslation(text: string, targetLanguage: string, translatedText: string): Promise<void> {
  try {
    const db = await openDB()
    const key = makeKey(text, targetLanguage)
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.put({ id: key, translatedText, createdAt: Date.now() })
      request.onsuccess = () => {
        db.close()
        resolve()
      }
      request.onerror = () => {
        db.close()
        reject(request.error)
      }
    })
  } catch {
    // Silently fail if IndexedDB is unavailable
  }
}

export async function fetchTranslation(
  serverUrl: string,
  text: string,
  targetLanguage: string,
  authHeaders?: Record<string, string>,
): Promise<string> {
  const cached = await getCachedTranslation(text, targetLanguage)
  if (cached) return cached

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authHeaders || {}),
  }

  const res = await fetch(`${serverUrl}/ai/translate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, targetLanguage }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(errText || `HTTP ${res.status}`)
  }

  const data = await res.json()
  const translated = data.translatedText

  await setCachedTranslation(text, targetLanguage, translated)
  return translated
}
