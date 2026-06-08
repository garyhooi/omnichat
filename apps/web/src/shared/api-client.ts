import { useAuthStore } from '../admin-portal/stores/auth.store'

let refreshPromise: Promise<boolean> | null = null

function getAccessToken(): string | null {
  return localStorage.getItem('accessToken')
}

function getSiteToken(): string | null {
  return localStorage.getItem('siteToken')
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken')
}

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const token = getRefreshToken()
      if (!token) return false

      const auth = useAuthStore()
      const res = await fetch(`${auth.serverUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token }),
      })

      if (!res.ok) {
        auth.logout()
        return false
      }

      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('siteToken', data.siteToken)
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
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  if (siteToken) {
    headers['x-external-site-token'] = siteToken
  }

  let res = await fetch(url, {
    ...options,
    headers,
  })

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      const newHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      }
      const newToken = getAccessToken()
      const newSiteToken = getSiteToken()
      if (newToken) newHeaders['Authorization'] = `Bearer ${newToken}`
      if (newSiteToken) newHeaders['x-external-site-token'] = newSiteToken

      res = await fetch(url, {
        ...options,
        headers: newHeaders,
      })
    }
  }

  return res
}
