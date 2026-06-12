import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SITE_TOKEN_KEY } from '../../shared/storage-keys'
import { initAuthClient, authFetch } from '../../shared/api-client'

interface User {
  id: string
  username: string
  displayName: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
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
    initAuthClient(serverUrl.value, () => {
      user.value = null
    })
  }

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${serverUrl.value}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      user.value = data.user
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
      localStorage.setItem(SITE_TOKEN_KEY, data.siteToken)
      return true
    } catch {
      return false
    }
  }

  async function fetchMe(): Promise<void> {
    try {
      const res = await authFetch(`${serverUrl.value}/auth/me`)
      if (res.ok) {
        const data = await res.json()
        user.value = data.user
      }
    } catch {
    }
  }

  async function logout() {
    try {
      await authFetch(`${serverUrl.value}/auth/logout`, { method: 'POST' })
    } catch {
    }
    user.value = null
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(SITE_TOKEN_KEY)
  }

  function setUser(u: User) {
    user.value = u
  }

  function configure(url: string) {
    serverUrl.value = url
    initAuthClient(url, () => {
      user.value = null
    })
  }

  function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    const t = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (t) headers['Authorization'] = `Bearer ${t}`
    const st = localStorage.getItem(SITE_TOKEN_KEY)
    if (st) headers['x-external-site-token'] = st
    return headers
  }

  return { user, serverUrl, isAdmin, isDeveloper, init, login, logout, setUser, configure, fetchMe, getAuthHeaders }
})
