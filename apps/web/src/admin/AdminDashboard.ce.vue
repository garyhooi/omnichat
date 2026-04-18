<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent, markRaw, type Component } from 'vue'
import { useAuthStore } from './stores/auth.store'

// ---------------------------------------------------------------------------
// Props — mapped from HTML attributes:
//   <omnichat-admin server-url="..." token="..."></omnichat-admin>
// ---------------------------------------------------------------------------
const props = defineProps({
  serverUrl: { type: String, required: true },
  token: { type: String, required: true },
})

// ---------------------------------------------------------------------------
// Pages — statically imported (IIFE build inlines everything)
// ---------------------------------------------------------------------------
import ConversationsPage from './pages/ConversationsPage.vue'
import AiSetupPage from './pages/AiSetupPage.vue'
import KnowledgeBasePage from './pages/KnowledgeBasePage.vue'
import ToolsPage from './pages/ToolsPage.vue'
import SettingsPage from './pages/SettingsPage.vue'

const pages: Record<string, Component> = {
  conversations: markRaw(ConversationsPage),
  'ai-setup': markRaw(AiSetupPage),
  'knowledge-base': markRaw(KnowledgeBasePage),
  tools: markRaw(ToolsPage),
  settings: markRaw(SettingsPage),
}

const navItems = [
  { key: 'conversations', label: 'Conversations', icon: '\u{1F4AC}' },
  { key: 'ai-setup', label: 'AI Agent', icon: '\u{1F916}' },
  { key: 'knowledge-base', label: 'Knowledge Base', icon: '\u{1F4DA}' },
  { key: 'tools', label: 'Tools', icon: '\u{1F527}' },
  { key: 'settings', label: 'Settings', icon: '\u2699\uFE0F' },
]

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const currentPage = ref('conversations')
const sidebarCollapsed = ref(false)

// ---------------------------------------------------------------------------
// Lifecycle — configure auth store with CE props
// ---------------------------------------------------------------------------
// Configure auth store immediately so child components (which mount during
// the same render cycle) see the serverUrl/token before they attempt socket
// connections. This prevents socket.io-client from defaulting to the host
// origin and requesting /socket.io on the demo server.
const authStore = useAuthStore()
authStore.configure(props.serverUrl, props.token)

// Watch for prop changes (e.g. token refresh)
watch(() => props.serverUrl, (v) => {
  authStore.configure(v, props.token)
})
watch(() => props.token, (v) => {
  authStore.configure(props.serverUrl, v)
})

// Insert a hidden DOM node into the host element at runtime so it is visible
// in the final compiled output / inspector. This avoids build-time stripping.
onMounted(() => {
  try {
    const host = document.querySelector('omnichat-admin') as HTMLElement | null
    if (host) {
      const marker = document.createElement('p')
      marker.textContent = 'Powered by OmniChat: https://github.com/garyhooi/omnichat'
      marker.style.display = 'none'
      marker.setAttribute('aria-hidden', 'true')
      marker.setAttribute('data-omnichat-powered', 'v3.0.0')
      host.appendChild(marker)
    }
  } catch (e) {
    // noop
  }
})
</script>

<template>
  <!-- Powered by OmniChat: https://github.com/garyhooi/omnichat -->
  <div style="display: flex; height: 100%; width: 100%; font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; font-size: 14px; overflow: hidden;">
    <p hidden style="display:none;margin:0;padding:0;line-height:0;">Powered by OmniChat: https://github.com/garyhooi/omnichat</p>
    <!-- Sidebar Navigation -->
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
      <!-- Logo -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #374151;">
        <span v-if="!sidebarCollapsed" style="font-size: 16px; font-weight: 700;">OmniChat</span>
        <button
          @click="sidebarCollapsed = !sidebarCollapsed"
          style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 4px; font-size: 14px;"
        >
          {{ sidebarCollapsed ? '\u2192' : '\u2190' }}
        </button>
      </div>

      <!-- Nav Items -->
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
      <!-- Footer note (bottom of sidebar) -->
      <div style="padding: 8px 12px; border-top: 1px solid #374151; flex-shrink: 0;">
        <a
          v-if="!sidebarCollapsed"
          href="https://github.com/garyhooi/omnichat"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #9ca3af; font-size: 12px; text-decoration: none; display: block; text-align: center;"
        >
          Powered by OmniChat v3.0.0
        </a>
        <a
          v-else
          href="https://github.com/garyhooi/omnichat"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #9ca3af; font-size: 12px; text-decoration: none; display: block; text-align: center;"
          title="Powered by OmniChat v3.0.0"
        >
          ·
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main style="flex: 1; overflow: hidden; min-width: 0; height: 100%;">
      <component :is="pages[currentPage]" />
    </main>
  </div>
  <p hidden style="display:none;margin:0;padding:0;line-height:0;">Powered by OmniChat: https://github.com/garyhooi/omnichat</p>
  <!-- Powered by OmniChat: https://github.com/garyhooi/omnichat -->
</template>
