// =============================================================================
// Cross-tab safe localStorage hooks.
// Same-tab writes update state immediately; the `storage` event keeps other
// tabs in sync (visitor id, conversation id, widget prefs).
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { storageGet, storageSet } from '../lib/storage'

function subscribeToKey(key: string, onChange: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === key) onChange()
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

/**
 * localStorage-backed state. Writes update this tab immediately and notify
 * other tabs via the `storage` event. `fallback` is used when the key is
 * absent.
 */
export function useLocalStorageState(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const [value, setValueState] = useState<string>(() => storageGet(key) ?? fallback)

  useEffect(() => {
    setValueState(storageGet(key) ?? fallback)
    return subscribeToKey(key, () => setValueState(storageGet(key) ?? fallback))
  }, [key, fallback])

  const setValue = useCallback(
    (next: string) => {
      storageSet(key, next)
      setValueState(next)
    },
    [key],
  )

  return [value, setValue]
}

/**
 * Boolean variant of useLocalStorageState — parse/stored as 'true'/'false'.
 */
export function useLocalStorageBoolean(
  key: string,
  fallback: boolean,
): [boolean, (value: boolean) => void] {
  const [raw, setRaw] = useLocalStorageState(key, String(fallback))
  const setValue = useCallback((value: boolean) => setRaw(String(value)), [setRaw])
  return [raw === 'true', setValue]
}

/**
 * Subscribe to a localStorage key that another tab may change.
 * Returns a function that re-reads the current value.
 */
export function useLocalStorageSubscription(key: string): () => string {
  const [, setTick] = useState(0)
  useEffect(() => subscribeToKey(key, () => setTick((t) => t + 1)), [key])
  return useCallback(() => storageGet(key) ?? '', [key])
}
