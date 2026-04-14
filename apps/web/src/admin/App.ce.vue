<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { io, Socket } from 'socket.io-client'

// ---------------------------------------------------------------------------
// Props — mapped from HTML attributes by Vue's defineCustomElement
// Blazor, Nuxt, or plain HTML pass these as hyphenated attributes:
//   <omnichat-admin server-url="..." token="..."></omnichat-admin>
// ---------------------------------------------------------------------------
const props = defineProps({
  serverUrl: { type: String, required: true },
  token: { type: String, required: true },
})

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
interface Message {
  id: string
  conversationId: string
  senderType: 'visitor' | 'agent'
  senderId?: string
  content: string
  senderDisplayName?: string
  createdAt: string
}

interface Conversation {
  id: string
  visitorId: string
  status: string
  agentId?: string
  metadata?: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
  agent?: { id: string; displayName: string; isOnline: boolean }
}

const socket = ref<Socket | null>(null)
const conversations = ref<Conversation[]>([])
const activeConversationId = ref<string | null>(null)
const activeConversationData = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const activeTab = ref<'active' | 'resolved'>('active')
const isTyping = ref(false)
const typingUser = ref('')
const showSettings = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const settingsSaved = ref(false)
const settingsError = ref('')

// Settings state
const bubbleColor = ref('#4F46E5')
const welcomeMessage = ref('Hello! How can we help you today?')
const siteConfigId = ref<string | null>(null)

const filteredConversations = computed(() =>
  conversations.value.filter((c) => c.status === activeTab.value),
)

const isActive = computed(() => activeConversationData.value?.status === 'active')

// ---------------------------------------------------------------------------
// Socket.io connection & event handlers
// ---------------------------------------------------------------------------
function connect() {
  const s = io(props.serverUrl, {
    auth: { token: props.token },
    transports: ['websocket', 'polling'],
  })

  s.on('connect', () => {
    console.log('[OmniChat Admin] Connected to server')
  })

  s.on('conversations_list', (data: { conversations: Conversation[] }) => {
    conversations.value = data.conversations
    if (activeConversationId.value) {
      const found = data.conversations.find((c) => c.id === activeConversationId.value)
      if (found) {
        activeConversationData.value = found
      }
    }
  })

  s.on('new_conversation', (data: { conversation: Conversation }) => {
    conversations.value.unshift(data.conversation)
  })

  s.on('conversation_history', (data: { conversation: Conversation }) => {
    messages.value = data.conversation.messages || []
    activeConversationData.value = data.conversation
    const conv = conversations.value.find((c) => c.id === data.conversation.id)
    if (conv) {
      conv.status = data.conversation.status
    }
    nextTick(() => scrollToBottom())
  })

  s.on('new_message', (data: { message: Message }) => {
    if (data.message.conversationId === activeConversationId.value) {
      messages.value.push(data.message)
      nextTick(() => scrollToBottom())
    }
    const conv = conversations.value.find(
      (c) => c.id === data.message.conversationId,
    )
    if (conv) {
      conv.messages = [data.message]
    }
  })

  s.on(
    'visitor_typing',
    (data: { conversationId: string; user: string; isTyping: boolean }) => {
      if (data.conversationId === activeConversationId.value) {
        isTyping.value = data.isTyping
        typingUser.value = data.user
      }
    },
  )

  s.on(
    'conversation_resolved',
    (data: { conversationId: string; resolvedBy: string }) => {
      const conv = conversations.value.find(
        (c) => c.id === data.conversationId,
      )
      if (conv) {
        conv.status = 'resolved'
      }
      if (activeConversationData.value?.id === data.conversationId) {
        activeConversationData.value.status = 'resolved'
      }
    },
  )

  s.on('conversation_updated', (data: { conversation: Conversation }) => {
    const idx = conversations.value.findIndex(
      (c) => c.id === data.conversation.id,
    )
    if (idx !== -1) {
      conversations.value[idx] = {
        ...conversations.value[idx],
        ...data.conversation,
      }
    }
    if (activeConversationData.value?.id === data.conversation.id) {
      activeConversationData.value = {
        ...activeConversationData.value,
        ...data.conversation,
      }
    }
  })

  s.on('agent_presence', (data: { agents: any[] }) => {
    console.log('[OmniChat Admin] Agent presence update:', data.agents)
  })

  s.on('error', (data: { message: string }) => {
    console.error('[OmniChat Admin] Error:', data.message)
  })

  s.on('disconnect', () => {
    console.log('[OmniChat Admin] Disconnected from server')
  })

  socket.value = s
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function selectConversation(conversationId: string) {
  activeConversationId.value = conversationId
  messages.value = []
  isTyping.value = false
  activeConversationData.value = conversations.value.find((c) => c.id === conversationId) || null

  socket.value?.emit('join_conversation', { conversationId })
}

function sendMessage() {
  if (!newMessage.value.trim() || !activeConversationId.value) return

  socket.value?.emit('send_message', {
    conversationId: activeConversationId.value,
    content: newMessage.value.trim(),
  })

  socket.value?.emit('typing_stop', {
    conversationId: activeConversationId.value,
  })

  newMessage.value = ''
}

let typingTimeout: ReturnType<typeof setTimeout> | null = null

function handleInputChange() {
  if (!activeConversationId.value) return

  socket.value?.emit('typing_start', {
    conversationId: activeConversationId.value,
  })

  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.value?.emit('typing_stop', {
      conversationId: activeConversationId.value,
    })
  }, 2000)
}

function resolveConversation() {
  if (!activeConversationId.value) return

  socket.value?.emit('resolve_conversation', {
    conversationId: activeConversationId.value,
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getVisitorLabel(conv: Conversation) {
  if (conv.metadata) {
    try {
      const meta = JSON.parse(conv.metadata)
      return meta.name || `Visitor ${conv.visitorId.slice(0, 8)}`
    } catch {
      return `Visitor ${conv.visitorId.slice(0, 8)}`
    }
  }
  return `Visitor ${conv.visitorId.slice(0, 8)}`
}

function getLastMessage(conv: Conversation) {
  if (conv.messages && conv.messages.length > 0) {
    return conv.messages[0].content.slice(0, 50) + (conv.messages[0].content.length > 50 ? '...' : '')
  }
  return 'No messages yet'
}

async function loadSettings() {
  try {
    const res = await fetch(`${props.serverUrl}/config/active`, {
      headers: { 'Authorization': `Bearer ${props.token}` },
    })
    if (res.ok) {
      const config = await res.json()
      if (config) {
        siteConfigId.value = config.id
        bubbleColor.value = config.bubbleColor || '#4F46E5'
        welcomeMessage.value = config.welcomeMessage || 'Hello! How can we help you today?'
      }
    }
  } catch {
    // Config may not exist yet
  }
}

async function saveSettings() {
  settingsSaved.value = false
  settingsError.value = ''

  try {
    let res: Response

    if (siteConfigId.value) {
      res = await fetch(`${props.serverUrl}/config/${siteConfigId.value}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.token}`,
        },
        body: JSON.stringify({
          bubbleColor: bubbleColor.value,
          welcomeMessage: welcomeMessage.value,
        }),
      })
    } else {
      res = await fetch(`${props.serverUrl}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.token}`,
        },
        body: JSON.stringify({
          siteName: 'default',
          bubbleColor: bubbleColor.value,
          welcomeMessage: welcomeMessage.value,
          allowedOrigins: '*',
        }),
      })
    }

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Failed to save settings')
    }

    const saved = await res.json()
    siteConfigId.value = saved.id
    settingsSaved.value = true
    setTimeout(() => { settingsSaved.value = false }, 3000)
  } catch (err: any) {
    settingsError.value = err.message || 'Failed to save settings'
    setTimeout(() => { settingsError.value = '' }, 5000)
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  connect()
  loadSettings()
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <div class="omnichat-admin-root" style="position: relative; display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; height: 100% !important; width: 100% !important; overflow: hidden !important;">
    <!-- Sidebar Panel -->
    <div class="sidebar" style="width: 300px !important; min-width: 300px !important; max-width: 300px !important; flex: 0 0 300px !important; display: flex !important; flex-direction: column !important; height: 100% !important; overflow: hidden !important; border-right: 1px solid #e5e7eb;">
      <div class="sidebar-header" style="flex-shrink: 0 !important;">
        <span>OmniChat</span>
        <button
          style="background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280;"
          title="Settings"
          @click="showSettings = !showSettings"
        >
          &#9881;
        </button>
      </div>

      <!-- Active / Resolved tabs -->
      <div class="sidebar-tabs">
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'active' }"
          @click="activeTab = 'active'"
        >
          Active
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'resolved' }"
          @click="activeTab = 'resolved'"
        >
          Resolved
        </button>
      </div>

      <!-- Conversation list -->
      <div class="conversation-list" style="flex: 1; min-height: 0; overflow-y: auto;">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="conversation-item"
          :class="{ active: conv.id === activeConversationId }"
          @click="selectConversation(conv.id)"
        >
          <div style="font-weight: 500; font-size: 13px; margin-bottom: 2px;">
            {{ getVisitorLabel(conv) }}
          </div>
          <div style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ getLastMessage(conv) }}
          </div>
          <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">
            {{ formatTime(conv.updatedAt) }}
          </div>
        </div>

        <div v-if="filteredConversations.length === 0" class="empty-state" style="padding: 40px 16px;">
          No {{ activeTab }} conversations
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="chat-window" style="flex: 1 1 auto !important; display: flex !important; flex-direction: column !important; min-width: 0 !important; height: 100% !important; overflow: hidden !important; position: relative;">
      <template v-if="activeConversationData">
        <!-- Chat header -->
        <div class="chat-header" style="flex: 0 0 auto !important;">
          <div>
            <div style="font-weight: 600; font-size: 14px;">
              {{ getVisitorLabel(activeConversationData) }}
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              {{ isActive ? 'Active conversation' : 'Resolved' }}
            </div>
          </div>
          <button
            v-if="isActive"
            class="resolve-btn"
            @click="resolveConversation"
          >
            Resolve
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="messages-container" style="flex: 1 1 auto !important; min-height: 0 !important; overflow-y: auto !important; overflow-x: hidden !important;">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-bubble', msg.senderType]"
          >
            <div>{{ msg.content }}</div>
            <div class="message-meta">
              {{ msg.senderDisplayName || msg.senderType }} &middot; {{ formatTime(msg.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="typing-indicator">
          {{ typingUser }} is typing...
        </div>

        <!-- Input area — always show when conversation is selected -->
        <div class="chat-input-area" style="flex: 0 0 auto !important; min-height: 60px !important;">
          <input
            v-model="newMessage"
            class="chat-input"
            type="text"
            :placeholder="isActive ? 'Type a message...' : 'Conversation resolved'"
            :disabled="!isActive"
            @keyup.enter="sendMessage"
            @input="handleInputChange"
          />
          <button
            class="send-btn"
            :disabled="!newMessage.trim() || !isActive"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </template>

      <!-- No conversation selected -->
      <div v-else class="empty-state">
        Select a conversation to start chatting
      </div>
    </div>

    <!-- Settings Drawer -->
    <template v-if="showSettings">
      <div class="settings-overlay" @click="showSettings = false" />
      <div class="settings-drawer">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Settings</h3>
          <button
            style="background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280;"
            @click="showSettings = false"
          >
            &times;
          </button>
        </div>

        <div class="settings-field">
          <label class="settings-label">Bubble Color</label>
          <input
            v-model="bubbleColor"
            type="color"
            class="settings-input"
            style="height: 40px; padding: 4px;"
          />
        </div>

        <div class="settings-field">
          <label class="settings-label">Welcome Message</label>
          <textarea
            v-model="welcomeMessage"
            class="settings-input"
            rows="3"
            style="resize: vertical;"
          />
        </div>

        <button
          class="send-btn"
          style="width: 100%; margin-top: 12px;"
          @click="saveSettings"
        >
          Save Settings
        </button>

        <div v-if="settingsSaved" style="color: #10b981; font-size: 13px; margin-top: 8px; text-align: center;">
          Settings saved successfully
        </div>
        <div v-if="settingsError" style="color: #ef4444; font-size: 13px; margin-top: 8px; text-align: center;">
          {{ settingsError }}
        </div>
      </div>
    </template>
  </div>
</template>
