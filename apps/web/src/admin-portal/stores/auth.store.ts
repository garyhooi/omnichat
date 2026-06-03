import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  username: string
  displayName: string
  role: string
}

const isBearerMode = () => {
  return true
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const serverUrl = ref('')

  const isAdmin = computed(() => {
    const role = user.value?.role
    return role === 'admin' || role === 'developer'
  })

  const isDeveloper = computed(() => user.value?.role === 'developer')

  function init() {
    const meta = document.querySelector('meta[name="omnichat-server"]')
    serverUrl.value = meta?.getAttribute('content') || 
      (window as any).__OMNICHAT_SERVER_URL || 
      `${window.location.protocol}//${window.location.hostname}:3001`
  }

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${serverUrl.value}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: isBearerMode() ? undefined : 'include',
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      user.value = data.user

      if (isBearerMode()) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('siteToken', data.siteToken)
        token.value = data.accessToken
      } else {
        token.value = data.token || 'cookie-auth'
      }
      return true
    } catch {
      return false
    }
  }

  async function fetchMe(): Promise<void> {
    try {
      const headers: Record<string, string> = {}
      if (isBearerMode()) {
        const t = localStorage.getItem('accessToken')
        if (t) headers['Authorization'] = `Bearer ${t}`
        const st = localStorage.getItem('siteToken')
        if (st) headers['x-external-site-token'] = st
      }

      const res = await fetch(`${serverUrl.value}/auth/me`, {
        credentials: isBearerMode() ? undefined : 'include',
        headers: isBearerMode() ? headers : undefined,
      })
      if (res.ok) {
        const data = await res.json()
        user.value = data.user
      }
    } catch {
    }
  }

  async function logout() {
    try {
      const headers: Record<string, string> = {}
      if (isBearerMode()) {
        const t = localStorage.getItem('accessToken')
        if (t) headers['Authorization'] = `Bearer ${t}`
        const st = localStorage.getItem('siteToken')
        if (st) headers['x-external-site-token'] = st
      }

      await fetch(`${serverUrl.value}/auth/logout`, {
        method: 'POST',
        credentials: isBearerMode() ? undefined : 'include',
        headers: isBearerMode() ? headers : undefined,
      })
    } catch {
    }
    user.value = null
    token.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('siteToken')
  }

  function setUser(u: User) {
    user.value = u
  }

  function configure(url: string, tok: string) {
    serverUrl.value = url
    token.value = tok
  }

  function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    if (isBearerMode()) {
      const t = localStorage.getItem('accessToken')
      if (t) headers['Authorization'] = `Bearer ${t}`
      const st = localStorage.getItem('siteToken')
      if (st) headers['x-external-site-token'] = st
    }
    return headers
  }

  return { user, token, serverUrl, isAdmin, isDeveloper, init, login, logout, setUser, configure, fetchMe, getAuthHeaders }
})
