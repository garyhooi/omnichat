import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SITE_TOKEN_KEY } from './storage-keys'

let refreshPromise: Promise<boolean> | null = null
let serverUrl = ''
let onLogout: (() => void) | null = null

export function initAuthClient(url: string, logoutFn?: () => void) {
  serverUrl = url
  if (logoutFn) onLogout = logoutFn
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function getSiteToken(): string | null {
  return localStorage.getItem(SITE_TOKEN_KEY)
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const token = getRefreshToken()
      if (!token) return false

      const res = await fetch(`${serverUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
      })

      if (!res.ok) {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(SITE_TOKEN_KEY)
        onLogout?.()
        return false
      }

      const data = await res.json()
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
      localStorage.setItem(SITE_TOKEN_KEY, data.siteToken)
      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = getAccessToken()
  const siteToken = getSiteToken()

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  if (siteToken) {
    headers['x-external-site-token'] = siteToken
  }

  const hasBody = options.body != null
  if (hasBody && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  let res = await fetch(url, {
    ...options,
    headers,
  })

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      const newHeaders: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
      }
      const newToken = getAccessToken()
      const newSiteToken = getSiteToken()
      if (newToken) newHeaders['Authorization'] = `Bearer ${newToken}`
      if (newSiteToken) newHeaders['x-external-site-token'] = newSiteToken
      if (hasBody && !(options.body instanceof FormData) && !newHeaders['Content-Type']) {
        newHeaders['Content-Type'] = 'application/json'
      }

      res = await fetch(url, {
        ...options,
        headers: newHeaders,
      })
    }
  }

  return res
}
