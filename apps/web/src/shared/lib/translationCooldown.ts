// =============================================================================
// Failed-translation backoff, persisted in sessionStorage.
//
// /ai/translate is rate limited per IP (default 30 req/min). When a request
// fails (429/timeout/provider error), the same text+language pair is skipped
// for 60s — INCLUDING across page loads/reloads, so fresh tabs don't re-fire a
// doomed request and keep the rate-limit window saturated.
// =============================================================================

const STORAGE_KEY = 'omnichat_translate_cooldowns'
const WINDOW_MS = 60_000

type CooldownMap = Record<string, number>

function read(): CooldownMap {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') as CooldownMap
  } catch {
    return {}
  }
}

function write(map: CooldownMap): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* storage unavailable — cooldown is best-effort */
  }
}

/** True while the key is inside its backoff window. Prunes expired entries. */
export function isTranslationOnCooldown(key: string): boolean {
  const map = read()
  const retryAt = map[key]
  if (!retryAt) return false
  if (Date.now() >= retryAt) {
    delete map[key]
    write(map)
    return false
  }
  return true
}

/** Remember that this key failed; retries are suppressed for 60s. */
export function markTranslationFailed(key: string): void {
  const map = read()
  map[key] = Date.now() + WINDOW_MS
  write(map)
}

/** A translation succeeded — drop any previous failure state. */
export function clearTranslationCooldown(key: string): void {
  const map = read()
  if (map[key] !== undefined) {
    delete map[key]
    write(map)
  }
}
