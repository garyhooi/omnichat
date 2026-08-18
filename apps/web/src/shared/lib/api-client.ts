// =============================================================================
// Authenticated fetch client — mirrors the legacy api-client.ts contract.
// - Adds Authorization + x-external-site-token headers
// - Auto-refreshes once on 401 (refresh token is rotated by the server)
// - Calls onLogout when the refresh token is rejected
// =============================================================================

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SITE_TOKEN_KEY, storageGet, storageRemove, storageSet } from './storage'

let serverUrl = ''
let onLogout: (() => void) | null = null
let refreshPromise: Promise<AuthTokens> | null = null

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  siteToken: string
}

function storeTokens(tokens: AuthTokens): void {
  storageSet(ACCESS_TOKEN_KEY, tokens.accessToken)
  storageSet(REFRESH_TOKEN_KEY, tokens.refreshToken)
  storageSet(SITE_TOKEN_KEY, tokens.siteToken)
}

function clearTokens(): void {
  storageRemove(ACCESS_TOKEN_KEY)
  storageRemove(REFRESH_TOKEN_KEY)
  storageRemove(SITE_TOKEN_KEY)
}

export function initAuthClient(url: string, logoutFn?: () => void): void {
  serverUrl = url.replace(/\/$/, '')
  if (logoutFn) onLogout = logoutFn
}

export function getServerUrl(): string {
  return serverUrl
}

export async function refreshTokens(): Promise<AuthTokens> {
  if (refreshPromise) return refreshPromise
  const refreshToken = storageGet(REFRESH_TOKEN_KEY)
  if (!refreshToken) throw new Error('No refresh token')
  refreshPromise = fetch(`${serverUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Refresh failed: ${res.status}`)
      const data = (await res.json()) as AuthTokens
      storeTokens(data)
      return data
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

export function logout(): void {
  clearTokens()
  onLogout?.()
}

/**
 * fetch with automatic Bearer token + site token headers and a single
 * 401 → refresh → retry cycle.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)
  const accessToken = storageGet(ACCESS_TOKEN_KEY)
  const siteToken = storageGet(SITE_TOKEN_KEY)
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (siteToken) headers.set('x-external-site-token', siteToken)
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  let res = await fetch(url, { ...options, headers })
  if (res.status === 401 && storageGet(REFRESH_TOKEN_KEY)) {
    try {
      await refreshTokens()
      const retryHeaders = new Headers(headers)
      retryHeaders.set('Authorization', `Bearer ${storageGet(ACCESS_TOKEN_KEY)}`)
      res = await fetch(url, { ...options, headers: retryHeaders })
    } catch {
      clearTokens()
      onLogout?.()
    }
  }
  return res
}

/** Convenience: authFetch + JSON parse + throw on !ok. */
export async function authFetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await authFetch(url, options)
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = (await res.json()) as { message?: string | string[] }
      if (typeof body.message === 'string') message = body.message
      else if (Array.isArray(body.message)) message = body.message.join(', ')
    } catch {
      /* keep default message */
    }
    throw new Error(message)
  }
  return (await res.json()) as T
}
