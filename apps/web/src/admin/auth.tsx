// =============================================================================
// Admin auth context — login/logout/me with the legacy token contract
// (omnichat_accessToken / refreshToken / siteToken in localStorage).
// =============================================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  SITE_TOKEN_KEY,
  storageGet,
  storageRemove,
  storageSet,
} from '../shared/lib/storage'
import { initAuthClient, authFetchJson } from '../shared/lib/api-client'
import { checkServerUrl } from '../shared/lib/serverUrl'
import type { Role } from '../shared/types/models'

export interface AdminUser {
  id: string
  username: string
  displayName: string
  role: Role
}

interface AuthContextValue {
  serverUrl: string
  setServerUrl: (url: string) => void
  user: AdminUser | null
  initializing: boolean
  login: (url: string, username: string, password: string, apiKey?: string) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
  isAdmin: boolean
  isDeveloper: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  initialServerUrl,
}: {
  children: React.ReactNode
  /** Server URL from the <omnichat-admin-portal server-url> attribute. */
  initialServerUrl?: string
}) {
  const [serverUrl, setServerUrlState] = useState(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('server')
    // The query param is untrusted input — validate it like the login form.
    const queryOk = fromQuery ? checkServerUrl(fromQuery).ok : false
    return (
      initialServerUrl?.replace(/\/$/, '') ||
      (queryOk ? fromQuery! : null) ||
      storageGet('omnichat_admin_server') ||
      ''
    )
  })
  const [user, setUser] = useState<AdminUser | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    if (!serverUrl) {
      setInitializing(false)
      return
    }
    storageSet('omnichat_admin_server', serverUrl)
    initAuthClient(serverUrl)
    setInitializing(true)
    authFetchJson<{ user: AdminUser }>(`${serverUrl}/auth/me`)
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false))
  }, [serverUrl])

  const setServerUrl = useCallback((url: string) => {
    setServerUrlState(url.replace(/\/$/, ''))
  }, [])

  const login = useCallback(
    async (url: string, username: string, password: string, apiKey?: string) => {
      const effective = url.replace(/\/$/, '')
      if (effective !== serverUrl) setServerUrlState(effective)
      initAuthClient(effective)
      const res = await fetch(`${effective}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-admin-api-key': apiKey } : {}),
        },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        let message = 'Login failed'
        try {
          const body = (await res.json()) as { message?: string | string[] }
          message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? message)
        } catch {
          /* keep default */
        }
        throw new Error(message)
      }
      const data = (await res.json()) as {
        accessToken: string
        refreshToken: string
        siteToken: string
        user: AdminUser
      }
      storageSet(ACCESS_TOKEN_KEY, data.accessToken)
      storageSet(REFRESH_TOKEN_KEY, data.refreshToken)
      storageSet(SITE_TOKEN_KEY, data.siteToken)
      setUser(data.user)
    },
    [serverUrl],
  )

  const logout = useCallback(async () => {
    try {
      await fetch(`${serverUrl}/auth/logout`, { method: 'POST' })
    } catch {
      /* token already invalid */
    }
    storageRemove(ACCESS_TOKEN_KEY)
    storageRemove(REFRESH_TOKEN_KEY)
    storageRemove(SITE_TOKEN_KEY)
    setUser(null)
  }, [serverUrl])

  const refreshMe = useCallback(async () => {
    if (!serverUrl) return
    try {
      const d = await authFetchJson<{ user: AdminUser }>(`${serverUrl}/auth/me`)
      setUser(d.user)
    } catch {
      setUser(null)
    }
  }, [serverUrl])

  const value = useMemo(
    () => ({
      serverUrl,
      setServerUrl,
      user,
      initializing,
      login,
      logout,
      refreshMe,
      isAdmin: user?.role === 'admin' || user?.role === 'developer',
      isDeveloper: user?.role === 'developer',
    }),
    [serverUrl, setServerUrl, user, initializing, login, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function hasToken(): boolean {
  return !!storageGet(ACCESS_TOKEN_KEY)
}
