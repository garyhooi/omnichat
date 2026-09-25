import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** Minimal IndexedDB stand-in: open() succeeds and get() returns the record. */
function stubIndexedDb(record: unknown) {
  const store = {
    get: () => {
      const req: { result?: unknown; onsuccess?: () => void } = { result: record }
      setTimeout(() => req.onsuccess?.(), 0)
      return req
    },
    put: () => {},
  }
  const db = {
    objectStoreNames: { contains: () => true },
    transaction: () => ({ objectStore: () => store }),
    onversionchange: null,
  }
  ;(globalThis as unknown as { indexedDB: unknown }).indexedDB = {
    open: () => {
      const req: { result?: unknown; onsuccess?: () => void } = { result: db }
      setTimeout(() => req.onsuccess?.(), 0)
      return req
    },
  }
}

/** IndexedDB that accepts the connection then never answers (blocked/hung). */
function stubHungIndexedDb() {
  ;(globalThis as unknown as { indexedDB: unknown }).indexedDB = {
    open: () => ({}) as IDBOpenDBRequest,
  }
}

const stubFetch = (body: unknown = { translatedText: 'Hola', targetLanguage: 'es' }) => {
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => body }))
  ;(globalThis as unknown as { fetch: unknown }).fetch = fetchMock
  return fetchMock
}

describe('fetchTranslation', () => {
  const realIndexedDB = (globalThis as unknown as { indexedDB?: unknown }).indexedDB
  const realFetch = (globalThis as unknown as { fetch?: unknown }).fetch

  beforeEach(() => {
    // Each case gets a fresh module: the cache keeps one IndexedDB connection.
    vi.resetModules()
  })
  afterEach(() => {
    ;(globalThis as unknown as { indexedDB?: unknown }).indexedDB = realIndexedDB
    ;(globalThis as unknown as { fetch?: unknown }).fetch = realFetch
    vi.restoreAllMocks()
  })

  it('issues the request even when the IndexedDB cache never answers', async () => {
    stubHungIndexedDb()
    const fetchMock = stubFetch()
    const { fetchTranslation } = await import('./translationCache')

    const result = await Promise.race([
      fetchTranslation('http://api.test', 'Hello', 'es'),
      new Promise((resolve) => setTimeout(() => resolve('TIMED_OUT'), 3000)),
    ])
    expect(result).toBe('Hola')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('serves a cached translation without a request', async () => {
    stubIndexedDb({ id: 'k', translatedText: 'Hola', createdAt: 0 })
    const fetchMock = stubFetch()
    const { fetchTranslation } = await import('./translationCache')

    await expect(fetchTranslation('http://api.test', 'Hello', 'es')).resolves.toBe('Hola')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('ignores a cached entry identical to the source and translates again', async () => {
    stubIndexedDb({ id: 'k', translatedText: 'Hello', createdAt: 0 })
    const fetchMock = stubFetch()
    const { fetchTranslation } = await import('./translationCache')

    await expect(fetchTranslation('http://api.test', 'Hello', 'es')).resolves.toBe('Hola')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('accepts the legacy `translated` field (fork API contract)', async () => {
    // The fork's /ai/translate answered { translated } long after the React port
    // started expecting { translatedText }; a successful call then looked like a
    // failure (and, after the identity guard, threw a TypeError).
    stubIndexedDb(undefined)
    stubFetch({ translated: '你好' })
    const { fetchTranslation } = await import('./translationCache')

    await expect(fetchTranslation('http://api.test', 'Hello', 'zh-Hans')).resolves.toBe('你好')
  })

  it('fails with a clear error when the response carries no translation text', async () => {
    stubIndexedDb(undefined)
    stubFetch({ targetLanguage: 'zh-Hans' })
    const { fetchTranslation } = await import('./translationCache')

    await expect(fetchTranslation('http://api.test', 'Hello', 'zh-Hans')).rejects.toThrow(/no text/)
  })
})
