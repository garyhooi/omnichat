import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  username: string
  displayName: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const serverUrl = ref('')

  function init() {
    // Read server URL from meta tag, script attribute, or default
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
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      user.value = data.user
      token.value = data.token || 'cookie-auth'
      return true
    } catch {
      return false
    }
  }

  async function logout() {
    try {
      await fetch(`${serverUrl.value}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Ignore logout errors
    }
    user.value = null
    token.value = null
  }

  function setUser(u: User) {
    user.value = u
  }

  /** Configure auth from custom element attributes (CE mode) */
  function configure(url: string, tok: string) {
    serverUrl.value = url
    token.value = tok
  }

  return { user, token, serverUrl, init, login, logout, setUser, configure }
})
