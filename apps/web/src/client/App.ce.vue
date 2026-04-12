<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io, Socket } from 'socket.io-client'

// ---------------------------------------------------------------------------
// Props — mapped from HTML attributes by Vue's defineCustomElement
// Usage: <omnichat-widget server-url="https://api.yoursite.com"></omnichat-widget>
// ---------------------------------------------------------------------------
const props = defineProps({
  serverUrl: { type: String, required: true },
  bubbleColor: { type: String, default: '#4F46E5' },
  welcomeMessage: { type: String, default: 'Hello! How can we help you today?' },
  position: { type: String, default: 'bottom-right' }, // future: bottom-left
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

const socket = ref<Socket | null>(null)
const isOpen = ref(false)
const conversationId = ref<string | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const isTyping = ref(false)
const typingUser = ref('')
const isResolved = ref(false)
const visitorId = ref('')
const messagesArea = ref<HTMLElement | null>(null)

// Generate or retrieve a persistent visitor ID
function getVisitorId(): string {
  const storageKey = 'omnichat_visitor_id'
  let id = localStorage.getItem(storageKey)
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36)
    localStorage.setItem(storageKey, id)
  }
  return id
}

// ---------------------------------------------------------------------------
// Socket.io connection
// ---------------------------------------------------------------------------
function connect() {
  visitorId.value = getVisitorId()

  const s = io(props.serverUrl, {
    auth: { visitorId: visitorId.value },
    transports: ['websocket', 'polling'],
  })

  s.on('connect', () => {
    console.log('[OmniChat Widget] Connected')
  })

  s.on('conversation_started', (data: { conversation: { id: string } }) => {
    conversationId.value = data.conversation.id
    // Store conversation ID so the visitor can resume on page refresh
    sessionStorage.setItem('omnichat_conversation_id', data.conversation.id)
  })

  s.on('conversation_history', (data: { conversation: { messages?: Message[]; status?: string } }) => {
    messages.value = data.conversation.messages || []
    isResolved.value = data.conversation.status === 'resolved'
    nextTick(() => scrollToBottom())
  })

  s.on('new_message', (data: { message: Message }) => {
    if (data.message.conversationId === conversationId.value) {
      messages.value.push(data.message)
      nextTick(() => scrollToBottom())
    }
  })

  s.on('agent_typing', (data: { conversationId: string; user: string; isTyping: boolean }) => {
    if (data.conversationId === conversationId.value) {
      isTyping.value = data.isTyping
      typingUser.value = data.user
    }
  })

  s.on('conversation_resolved', (data: { conversationId: string }) => {
    if (data.conversationId === conversationId.value) {
      isResolved.value = true
    }
  })

  s.on('error', (data: { message: string }) => {
    console.error('[OmniChat Widget] Error:', data.message)
  })

  s.on('disconnect', () => {
    console.log('[OmniChat Widget] Disconnected')
  })

  socket.value = s

  // Attempt to rejoin existing conversation from session storage
  const existingConvId = sessionStorage.getItem('omnichat_conversation_id')
  if (existingConvId) {
    conversationId.value = existingConvId
    s.on('connect', () => {
      s.emit('join_conversation', { conversationId: existingConvId })
    })
  }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function toggleWidget() {
  isOpen.value = !isOpen.value
}

function startConversation() {
  socket.value?.emit('start_conversation', {
    visitorId: visitorId.value,
    metadata: JSON.stringify({
      url: window.location.href,
      userAgent: navigator.userAgent,
    }),
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !conversationId.value) return

  socket.value?.emit('send_message', {
    conversationId: conversationId.value,
    content: newMessage.value.trim(),
  })

  socket.value?.emit('typing_stop', {
    conversationId: conversationId.value,
  })

  newMessage.value = ''
}

let typingTimeout: ReturnType<typeof setTimeout> | null = null

function handleInput() {
  if (!conversationId.value) return

  socket.value?.emit('typing_start', {
    conversationId: conversationId.value,
  })

  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.value?.emit('typing_stop', {
      conversationId: conversationId.value,
    })
  }, 2000)
}

function scrollToBottom() {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function startNewChat() {
  conversationId.value = null
  messages.value = []
  isResolved.value = false
  sessionStorage.removeItem('omnichat_conversation_id')
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  // Fetch config from server to apply site-level settings
  fetch(`${props.serverUrl}/config/active`)
    .then((res) => res.json())
    .then((config) => {
      // Config could override defaults — but props always win if set explicitly
      console.log('[OmniChat Widget] Site config loaded:', config)
    })
    .catch(() => {
      // Config endpoint is optional — widget still works with prop defaults
    })

  connect()
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <!-- Floating chat bubble -->
  <button
    v-if="!isOpen"
    class="chat-bubble"
    :style="{ backgroundColor: bubbleColor }"
    @click="toggleWidget"
    aria-label="Open chat"
  >
    &#128172;
  </button>

  <!-- Chat panel -->
  <div v-if="isOpen" class="chat-panel">
    <!-- Header -->
    <div class="panel-header" :style="{ backgroundColor: bubbleColor }">
      <h3>Chat with us</h3>
      <button class="close-btn" @click="toggleWidget" aria-label="Close chat">
        &times;
      </button>
    </div>

    <!-- Welcome screen (no active conversation) -->
    <template v-if="!conversationId">
      <div class="welcome-screen">
        <p>{{ welcomeMessage }}</p>
        <button
          class="start-chat-btn"
          :style="{ backgroundColor: bubbleColor }"
          @click="startConversation"
        >
          Start a conversation
        </button>
      </div>
    </template>

    <!-- Active conversation -->
    <template v-else>
      <!-- Messages area -->
      <div ref="messagesArea" class="messages-area">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['msg-bubble', msg.senderType]"
          :style="msg.senderType === 'visitor' ? { backgroundColor: bubbleColor } : {}"
        >
          <div>{{ msg.content }}</div>
          <div class="msg-time">{{ formatTime(msg.createdAt) }}</div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="typing-hint">
        {{ typingUser }} is typing...
      </div>

      <!-- Resolved state -->
      <template v-if="isResolved">
        <div class="resolved-banner">
          This conversation has been resolved.
          <button
            style="background: none; border: none; color: #4f46e5; cursor: pointer; font-weight: 500; margin-left: 4px;"
            @click="startNewChat"
          >
            Start a new chat
          </button>
        </div>
      </template>

      <!-- Input area (only when conversation is active) -->
      <template v-else>
        <div class="input-area">
          <input
            v-model="newMessage"
            class="msg-input"
            type="text"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
            @input="handleInput"
          />
          <button
            class="send-msg-btn"
            :style="{ backgroundColor: bubbleColor }"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </template>
    </template>
  </div>
</template>
