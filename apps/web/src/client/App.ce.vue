<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
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
  readAt?: string
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

// Site config state
const siteBubbleColor = ref('')
const siteWelcomeMessage = ref('')
const siteBubbleSize = ref('medium')
const siteBubblePattern = ref('solid')
const siteWebsitePosition = ref('bottom-right')
const siteBubbleIcon = ref('💬')
const siteEnableReadReceipts = ref(true)
const currentBubbleColor = computed(() => siteBubbleColor.value || props.bubbleColor)
const dynamicBubbleStyle = computed(() => {
  let bg = currentBubbleColor.value
  let size = '56px'
  let fontSize = '24px'

  // Pattern handling
  if (siteBubblePattern.value === 'gradient') {
    bg = `linear-gradient(135deg, ${currentBubbleColor.value}, #ffffff)`
  } else if (siteBubblePattern.value === 'stripes') {
    bg = `repeating-linear-gradient(45deg, ${currentBubbleColor.value}, ${currentBubbleColor.value} 10px, #ffffff 10px, #ffffff 20px)`
  } else if (siteBubblePattern.value === 'dots') {
    bg = `radial-gradient(#ffffff 2px, transparent 2px), radial-gradient(#ffffff 2px, transparent 2px)`
  }

  // Size handling
  if (siteBubbleSize.value === 'small') {
    size = '48px'
    fontSize = '20px'
  } else if (siteBubbleSize.value === 'large') {
    size = '64px'
    fontSize = '28px'
  }

  const baseStyle: any = {
    width: size,
    height: size,
    fontSize: fontSize,
  }

  if (siteBubblePattern.value === 'dots') {
    baseStyle.backgroundColor = currentBubbleColor.value
    baseStyle.backgroundImage = bg
    baseStyle.backgroundSize = '10px 10px'
    baseStyle.backgroundPosition = '0 0, 5px 5px'
  } else {
    baseStyle.background = bg
  }

  return baseStyle
})

const dynamicPanelStyle = computed(() => {
  return siteWebsitePosition.value === 'bottom-left' 
    ? { left: '0', right: 'auto' } 
    : { right: '0', left: 'auto' }
})

// Pre-chat form state
const visitorName = ref('')
const visitorEmail = ref('')

// Unread count state
const unreadCount = ref(0)

// Post-chat review state
const reviewRating = ref(0)
const reviewComment = ref('')
const reviewSubmitted = ref(false)

// End chat confirmation state
const showEndChatConfirm = ref(false)

// Generate or retrieve a persistent visitor ID
function getVisitorId(): string {
  const storageKey = 'omnichat_visitor_id'
  let id = localStorage.getItem(storageKey)
  if (!id) {
    if (window.crypto && crypto.randomUUID) {
      id = 'v_' + crypto.randomUUID()
    } else {
      // Fallback for older browsers
      id = 'v_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36)
    }
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

  s.on('conversation_history', (data: { conversation: { messages?: Message[]; status?: string; rating?: number } }) => {
    messages.value = data.conversation.messages || []
    isResolved.value = data.conversation.status === 'resolved'
    if (data.conversation.rating) {
      reviewSubmitted.value = true
    }
    
    if (!isOpen.value) {
      unreadCount.value = messages.value.filter(m => m.senderType === 'agent' && !m.readAt).length
    }

    nextTick(() => {
      scrollToBottom()
      if (isOpen.value) {
        markUnreadMessagesAsRead()
      }
    })
  })

  s.on('new_message', (data: { message: Message }) => {
    if (data.message.conversationId === conversationId.value) {
      messages.value.push(data.message)
      
      if (!isOpen.value && data.message.senderType === 'agent') {
        unreadCount.value++
      }

      nextTick(() => {
        scrollToBottom()
        if (isOpen.value && data.message.senderType === 'agent') {
          // If panel is open and agent sent a message, mark it read
          socket.value?.emit('read_message', {
            messageId: data.message.id,
            conversationId: conversationId.value
          })
        }
      })
    }
  })

  s.on('message_read', (data: { messageId: string; readAt: string }) => {
    const msg = messages.value.find((m) => m.id === data.messageId)
    if (msg) {
      msg.readAt = data.readAt
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
  if (isOpen.value) {
    unreadCount.value = 0
    markUnreadMessagesAsRead()
  } else {
    showEndChatConfirm.value = false // reset on close
  }
}

function markUnreadMessagesAsRead() {
  if (!socket.value || !conversationId.value) return
  const unreadAgentMessages = messages.value.filter(m => m.senderType === 'agent' && !m.readAt)
  unreadAgentMessages.forEach(m => {
    socket.value?.emit('read_message', {
      messageId: m.id,
      conversationId: conversationId.value
    })
  })
}

function startConversation() {
  if (!visitorName.value.trim()) {
    alert('Please provide your name to continue.')
    return
  }

  socket.value?.emit('start_conversation', {
    visitorId: visitorId.value,
    visitorName: visitorName.value.trim(),
    visitorEmail: visitorEmail.value.trim(),
    visitorCurrentUrl: window.location.href,
    visitorTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    visitorLanguage: navigator.language,
    visitorScreenRes: `${window.screen.width}x${window.screen.height}`,
    visitorReferrer: document.referrer || null,
    metadata: JSON.stringify({
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

function submitReview() {
  if (!conversationId.value || reviewRating.value === 0) return
  
  socket.value?.emit('submit_review', {
    conversationId: conversationId.value,
    rating: reviewRating.value,
    review: reviewComment.value.trim(),
  })
  
  reviewSubmitted.value = true
}

function endChat() {
  showEndChatConfirm.value = true
}

function confirmEndChat() {
  if (!conversationId.value) return
  
  // Visitor optionally ends chat
  socket.value?.emit('resolve_conversation', {
    conversationId: conversationId.value,
  })
  isResolved.value = true
  showEndChatConfirm.value = false
}

function cancelEndChat() {
  showEndChatConfirm.value = false
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
  reviewSubmitted.value = false
  reviewRating.value = 0
  reviewComment.value = ''
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
      if (config.bubbleColor) siteBubbleColor.value = config.bubbleColor
      if (config.welcomeMessage) siteWelcomeMessage.value = config.welcomeMessage
      if (config.bubbleSize) siteBubbleSize.value = config.bubbleSize
      if (config.bubblePattern) siteBubblePattern.value = config.bubblePattern
      if (config.websitePosition) siteWebsitePosition.value = config.websitePosition
      if (config.bubbleIcon) siteBubbleIcon.value = config.bubbleIcon
      if (config.enableReadReceipts !== undefined) siteEnableReadReceipts.value = config.enableReadReceipts
      
      // Apply position to the host element
      if (siteWebsitePosition.value === 'bottom-left') {
        const host = document.querySelector('omnichat-widget') as HTMLElement
        if (host) {
          host.style.right = 'auto'
          host.style.left = '20px'
        }
      }
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
  <div style="position: relative; display: inline-block;">
    <button
      v-if="!isOpen"
      type="button"
      class="chat-bubble"
      :style="dynamicBubbleStyle"
      @click="toggleWidget"
      aria-label="Open chat"
    >
      {{ siteBubbleIcon }}
    </button>
    <div
      v-if="!isOpen && unreadCount > 0"
      style="position: absolute; top: -6px; right: -6px; background-color: #ef4444; color: white; border-radius: 9999px; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; z-index: 10;"
    >
      {{ unreadCount }}
    </div>
  </div>

  <!-- Chat panel -->
  <div v-if="isOpen" class="chat-panel" :style="dynamicPanelStyle">
    <!-- Header -->
    <div class="panel-header" :style="{ backgroundColor: currentBubbleColor }">
      <h3>Chat with us</h3>
      <button type="button" class="close-btn" @click="toggleWidget" aria-label="Close chat">
        &times;
      </button>
    </div>

    <!-- Welcome screen (no active conversation) -->
    <template v-if="!conversationId">
      <div class="welcome-screen">
        <p>{{ currentWelcomeMessage }}</p>
        
        <div class="pre-chat-form">
          <input v-model="visitorName" type="text" placeholder="Your Name" class="form-input" />
          <input v-model="visitorEmail" type="text" inputmode="email" placeholder="Your Email (Optional)" class="form-input" />
        </div>

        <button
          type="button"
          class="start-chat-btn"
          :style="{ backgroundColor: currentBubbleColor }"
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
          :style="msg.senderType === 'visitor' ? { backgroundColor: currentBubbleColor } : {}"
        >
          <div>{{ msg.content }}</div>
          <div class="msg-meta">
            <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
            <span v-if="siteEnableReadReceipts && msg.senderType === 'visitor' && msg.readAt" class="msg-read-receipt" title="Read">&#10003;&#10003;</span>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="typing-hint">
        {{ typingUser }} is typing...
      </div>

      <!-- Resolved state & Review -->
      <template v-if="isResolved">
        <div class="resolved-banner">
          This conversation has been resolved.
          
          <div v-if="!reviewSubmitted" class="review-section">
            <p>How was your experience?</p>
            <div class="star-rating">
              <span v-for="star in 5" :key="star" 
                    @click="reviewRating = star"
                    :class="{ active: star <= reviewRating }">
                &#9733;
              </span>
            </div>
            <textarea v-model="reviewComment" placeholder="Any comments? (Optional)" class="form-input"></textarea>
            <button type="button" class="submit-review-btn" :style="{ backgroundColor: currentBubbleColor }" @click="submitReview">Submit Review</button>
          </div>
          <div v-else class="review-thank-you">
            Thank you for your feedback!
          </div>

          <button
            type="button"
            class="start-new-chat-btn"
            @click="startNewChat"
          >
            Start a new chat
          </button>
        </div>
      </template>

      <!-- Input area (only when conversation is active) -->
      <template v-else>
        <!-- End Chat Confirmation Overlay -->
        <div v-if="showEndChatConfirm" class="confirm-action-area">
          <span class="confirm-text">End this chat?</span>
          <div class="confirm-buttons">
            <button type="button" class="confirm-yes-btn" @click="confirmEndChat">End</button>
            <button type="button" class="confirm-cancel-btn" @click="cancelEndChat">Cancel</button>
          </div>
        </div>

        <div v-else class="input-area">
          <input
            v-model="newMessage"
            class="msg-input"
            type="text"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
            @input="handleInput"
          />
          <button
            type="button"
            class="send-msg-btn"
            :style="{ backgroundColor: currentBubbleColor }"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
          >
            Send
          </button>
          <button
            type="button"
            class="end-chat-btn"
            @click="endChat"
            title="End Chat"
          >
            &#10006;
          </button>
        </div>
      </template>
    </template>
  </div>
</template>
