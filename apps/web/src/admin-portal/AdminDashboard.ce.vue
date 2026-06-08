<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent, markRaw, computed, type Component, watch } from 'vue'
import { useAuthStore } from './stores/auth.store'
import { useToast } from './stores/toast.store'
import { io, type Socket } from 'socket.io-client'
import { appVersion } from '../version'
import { ACCESS_TOKEN_KEY } from '../shared/storage-keys'

const { toasts, dismiss } = useToast()

const props = defineProps({
  serverUrl: { type: String, required: true },
})

import ConversationsPage from './pages/ConversationsPage.vue'
import AiSetupPage from './pages/AiSetupPage.vue'
import KnowledgeBasePage from './pages/KnowledgeBasePage.vue'
import ToolsPage from './pages/ToolsPage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import LogsPage from './pages/LogsPage.vue'
import UserManagementPage from './pages/UserManagementPage.vue'
import DeveloperPage from './pages/DeveloperPage.vue'

const pages: Record<string, Component> = {
  conversations: markRaw(ConversationsPage),
  'ai-setup': markRaw(AiSetupPage),
  'knowledge-base': markRaw(KnowledgeBasePage),
  tools: markRaw(ToolsPage),
  settings: markRaw(SettingsPage),
  logs: markRaw(LogsPage),
  users: markRaw(UserManagementPage),
  developer: markRaw(DeveloperPage),
}

const allNavItems = [
  { key: 'conversations', label: 'Conversations', icon: '\u{1F4AC}', adminOnly: false },
  { key: 'ai-setup', label: 'AI Agent', icon: '\u{1F916}', adminOnly: true },
  { key: 'knowledge-base', label: 'Knowledge Base', icon: '\u{1F4DA}', adminOnly: true },
  { key: 'tools', label: 'Tools', icon: '\u{1F527}', adminOnly: true },
  { key: 'logs', label: 'Logs', icon: '\u{1F4CB}', adminOnly: true },
  { key: 'users', label: 'Users', icon: '\u{1F465}', adminOnly: true },
  { key: 'developer', label: 'Developer', icon: '\u{1F511}', developerOnly: true },
  { key: 'settings', label: 'Settings', icon: '\u2699\uFE0F', adminOnly: false },
]

const navItems = computed(() => {
  return allNavItems.filter(item => {
    if (item.developerOnly) return authStore.isDeveloper
    if (item.adminOnly) return authStore.isAdmin
    return true
  })
})

const currentPage = ref('conversations')
const sidebarCollapsed = ref(false)

const authStore = useAuthStore()
authStore.configure(props.serverUrl)
authStore.fetchMe()

watch(() => props.serverUrl, (v) => {
  authStore.configure(v)
})

function handleLogout() {
  authStore.logout().then(() => {
    try { window.location.reload() } catch (e) { /* ignore */ }
  })
}

let presenceSocket: Socket | null = null
let heartbeatInterval: ReturnType<typeof setInterval> | null = null

const isBearer = true

function connectPresence() {
  if (presenceSocket) {
    presenceSocket.disconnect()
    presenceSocket = null
  }
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }

  const opts: any = {
    transports: ['websocket', 'polling'],
  }

  if (isBearer) {
    opts.auth = {
      token: localStorage.getItem(ACCESS_TOKEN_KEY) || undefined,
    }
  } else {
    opts.withCredentials = true
  }

  presenceSocket = io(authStore.serverUrl, opts)

  presenceSocket.on('connect', () => {
    heartbeatInterval = setInterval(() => {
      if (presenceSocket?.connected) presenceSocket.emit('heartbeat')
    }, 30_000)
  })

  presenceSocket.on('disconnect', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  })
}

function disconnectPresence() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }
  if (presenceSocket) {
    presenceSocket.disconnect()
    presenceSocket = null
  }
}

onMounted(() => {
  connectPresence()
  try {
    const host = document.querySelector('omnichat-admin-portal') as HTMLElement | null
    if (host) {
      const marker = document.createElement('p')
      marker.textContent = 'Powered by OmniChat: https://github.com/garyhooi/omnichat'
      marker.style.display = 'none'
      marker.setAttribute('aria-hidden', 'true')
      marker.setAttribute('data-omnichat-powered', appVersion)
      host.appendChild(marker)
    }
  } catch (e) {
  }
})

onUnmounted(() => {
  disconnectPresence()
})
</script>

<template>
  <div style="display: flex; height: 100%; width: 100%; font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; font-size: 14px; overflow: hidden; border-radius: 16px;">
    <p hidden style="display:none;margin:0;padding:0;line-height:0;">Powered by OmniChat: https://github.com/garyhooi/omnichat</p>
    <aside
      :style="{
        display: 'flex',
        flexDirection: 'column',
        background: '#111827',
        color: 'white',
        transition: 'width 0.2s ease',
        width: sidebarCollapsed ? '56px' : '210px',
        minWidth: sidebarCollapsed ? '56px' : '210px',
        flexShrink: '0',
        overflow: 'hidden',
      }"
    >
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #374151;">
        <span v-if="!sidebarCollapsed" style="font-size: 16px; font-weight: 700;">OmniChat</span>
        <button
          @click="sidebarCollapsed = !sidebarCollapsed"
          style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 4px; font-size: 14px;"
        >
          {{ sidebarCollapsed ? '\u2192' : '\u2190' }}
        </button>
      </div>

      <nav style="flex: 1; padding: 12px 0;">
        <button
          v-for="item in navItems"
          :key="item.key"
          @click="currentPage = item.key"
          :style="{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontSize: '14px',
            textAlign: 'left',
            background: currentPage === item.key ? '#4f46e5' : 'transparent',
            color: currentPage === item.key ? 'white' : '#d1d5db',
          }"
          @mouseover="($event.currentTarget as HTMLElement).style.background = currentPage === item.key ? '#4f46e5' : '#1f2937'"
          @mouseleave="($event.currentTarget as HTMLElement).style.background = currentPage === item.key ? '#4f46e5' : 'transparent'"
        >
          <span style="font-size: 18px; width: 24px; text-align: center;">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" style="margin-left: 12px;">{{ item.label }}</span>
        </button>
      </nav>
      <div style="padding: 8px 12px; border-top: 1px solid #374151; flex-shrink: 0;">
        <button
          @click="handleLogout"
          :title="sidebarCollapsed ? 'Logout' : undefined"
          style="width: 100%; background: none; border: none; color: #9ca3af; font-size: 12px; text-decoration: none; display: block; text-align: center; padding: 6px 0; cursor: pointer;"
        >
          <span v-if="sidebarCollapsed">\u{1F512}</span>
          <span v-else>Logout</span>
        </button>

        <a
          v-if="!sidebarCollapsed"
          href="https://github.com/garyhooi/omnichat"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #9ca3af; font-size: 12px; text-decoration: none; display: block; text-align: center; margin-top: 6px;"
        >
          Powered by OmniChat {{ appVersion }}
        </a>
        <a
          v-else
          href="https://github.com/garyhooi/omnichat"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #9ca3af; font-size: 12px; text-decoration: none; display: block; text-align: center;"
          :title="`Powered by OmniChat ${appVersion}`"
        >
          ·
        </a>
      </div>
    </aside>

    <main style="flex: 1; overflow: hidden; min-width: 0; height: 100%;">
      <component :is="pages[currentPage]" />
    </main>
  </div>
  <p hidden style="display:none;margin:0;padding:0;line-height:0;">Powered by OmniChat: https://github.com/garyhooi/omnichat</p>

  <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column-reverse; gap: 8px; pointer-events: none;">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :style="{
        pointerEvents: 'auto',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        color: 'white',
        background: toast.type === 'success' ? '#16a34a' : '#dc2626',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '240px',
        maxWidth: '380px',
        animation: 'toast-in 0.25s ease',
      }"
    >
      <span style="flex: 1;">{{ toast.message }}</span>
      <button
        @click="dismiss(toast.id)"
        style="background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 16px; padding: 0; line-height: 1;"
      >&times;</button>
    </div>
  </div>
</template>
