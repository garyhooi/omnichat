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
  senderType: 'visitor' | 'agent' | 'system'
  senderId?: string
  content: string
  senderDisplayName?: string
  createdAt: string
  readAt?: string
}

interface QuickReply {
  id: string
  title: string
  content: string
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
  rating?: number
  review?: string
  agentRemarks?: string
  assignedUsername?: string
  visitorIp?: string
  visitorBrowser?: string
  visitorOs?: string
  visitorDevice?: string
  visitorCurrentUrl?: string
  visitorTimezone?: string
  visitorLanguage?: string
  visitorScreenRes?: string
  visitorReferrer?: string
  _count?: { messages: number }
  unreadCount?: number
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
const showResolveConfirm = ref(false)

// Settings state
const bubbleColor = ref('#4F46E5')
const welcomeMessage = ref('Hello! How can we help you today?')
const bubbleSize = ref('medium')
const bubblePattern = ref('solid')
const websitePosition = ref('bottom-right')
const bubbleIcon = ref('💬')
const siteConfigId = ref<string | null>(null)
const enableReadReceipts = ref(true)

// Quick Replies state
const settingsTab = ref<'widget' | 'quick-replies'>('widget')
const quickReplies = ref<QuickReply[]>([])
const showQuickReplyPopover = ref(false)
const editingQuickReplyId = ref<string | null>(null)
const qrDraftTitle = ref('')
const qrDraftContent = ref('')

const emit = defineEmits(['omnichat:logout'])

const searchQuery = ref('')
const showConversationDetails = ref(false)
const draftAssignedUsername = ref('')
const draftAgentRemarks = ref('')

const filteredConversations = computed(() => {
  let list = conversations.value.filter((c) => c.status === activeTab.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => {
      const visitorLabel = getVisitorLabel(c).toLowerCase()
      const email = getVisitorEmail(c)?.toLowerCase() || ''
      const assigned = (c.assignedUsername || '').toLowerCase()
      const remarks = (c.agentRemarks || '').toLowerCase()
      const id = c.id.toLowerCase()
      const visitorId = c.visitorId.toLowerCase()
      
      return visitorLabel.includes(q) || 
             email.includes(q) || 
             assigned.includes(q) || 
             remarks.includes(q) || 
             id.includes(q) || 
             visitorId.includes(q)
    })
  }
  return list
})

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
    conversations.value = data.conversations.map(c => ({
      ...c,
      unreadCount: c._count?.messages || 0
    }))
    if (activeConversationId.value) {
      const found = conversations.value.find((c) => c.id === activeConversationId.value)
      if (found) {
        activeConversationData.value = found
      }
    }
  })

  s.on('new_conversation', (data: { conversation: Conversation }) => {
    const newConv = { ...data.conversation, unreadCount: data.conversation._count?.messages || 0 }
    conversations.value.unshift(newConv)
  })

  s.on('conversation_history', (data: { conversation: Conversation }) => {
    messages.value = data.conversation.messages || []
    activeConversationData.value = data.conversation
    const conv = conversations.value.find((c) => c.id === data.conversation.id)
    if (conv) {
      conv.status = data.conversation.status
    }
    nextTick(() => {
      scrollToBottom()
      markUnreadVisitorMessagesAsRead()
    })
  })

  s.on('inactivity_warning', (data: { conversationId: string; message: string }) => {
    if (data.conversationId === activeConversationId.value) {
      messages.value.push({
        id: 'sys_' + Date.now(),
        conversationId: data.conversationId,
        senderType: 'system',
        content: data.message,
        createdAt: new Date().toISOString()
      })
      nextTick(() => scrollToBottom())
    }
    // Update the preview message in the sidebar
    const conv = conversations.value.find((c) => c.id === data.conversationId)
    if (conv) {
      conv.messages = [{
        id: 'sys_' + Date.now(),
        conversationId: data.conversationId,
        senderType: 'system',
        content: data.message,
        createdAt: new Date().toISOString()
      }]
    }
  })

  s.on('new_message', (data: { message: Message }) => {
    if (data.message.conversationId === activeConversationId.value) {
      messages.value.push(data.message)
      nextTick(() => {
        scrollToBottom()
        if (data.message.senderType === 'visitor') {
          // Admin marks visitor message as read
          socket.value?.emit('read_message', {
            messageId: data.message.id,
            conversationId: activeConversationId.value
          })
        }
      })
    }
    const conv = conversations.value.find(
      (c) => c.id === data.message.conversationId,
    )
    if (conv) {
      conv.messages = [data.message]
      // Increment unread count if it's a visitor message and we are not viewing this conversation
      if (data.message.conversationId !== activeConversationId.value && data.message.senderType === 'visitor') {
        conv.unreadCount = (conv.unreadCount || 0) + 1
      }
    }
  })

  s.on('message_read', (data: { messageId: string; readAt: string }) => {
    const msg = messages.value.find((m) => m.id === data.messageId)
    if (msg) {
      msg.readAt = data.readAt
    }
  })

  s.on('review_submitted', (data: { conversationId: string; rating: number; review?: string }) => {
    const conv = conversations.value.find((c) => c.id === data.conversationId)
    if (conv) {
      conv.rating = data.rating
      conv.review = data.review
    }
    if (activeConversationData.value?.id === data.conversationId) {
      activeConversationData.value.rating = data.rating
      activeConversationData.value.review = data.review
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
  showResolveConfirm.value = false
  activeConversationData.value = conversations.value.find((c) => c.id === conversationId) || null

  if (activeConversationData.value) {
    activeConversationData.value.unreadCount = 0
    draftAssignedUsername.value = activeConversationData.value.assignedUsername || ''
    draftAgentRemarks.value = activeConversationData.value.agentRemarks || ''
  }
  showConversationDetails.value = false

  socket.value?.emit('join_conversation', { conversationId })
}

function saveConversationDetails() {
  if (!activeConversationId.value) return
  socket.value?.emit('update_conversation_details', {
    conversationId: activeConversationId.value,
    assignedUsername: draftAssignedUsername.value.trim(),
    agentRemarks: draftAgentRemarks.value.trim(),
  })
  showConversationDetails.value = false
}

function markUnreadVisitorMessagesAsRead() {
  if (!activeConversationId.value || !socket.value) return
  const unreadVisitorMessages = messages.value.filter((m) => m.senderType === 'visitor' && !m.readAt)
  unreadVisitorMessages.forEach((m) => {
    socket.value?.emit('read_message', {
      messageId: m.id,
      conversationId: activeConversationId.value
    })
  })
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

const filteredQuickReplies = computed(() => {
  if (!newMessage.value.startsWith('/')) return []
  const query = newMessage.value.substring(1).toLowerCase()
  return quickReplies.value.filter(qr => 
    qr.title.toLowerCase().includes(query) || 
    qr.content.toLowerCase().includes(query)
  )
})

const activeQuickReplyIndex = ref(0)

function handleInputChange() {
  if (!activeConversationId.value) return

  if (newMessage.value.startsWith('/')) {
    showQuickReplyPopover.value = true
    activeQuickReplyIndex.value = 0
  } else {
    showQuickReplyPopover.value = false
  }

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

function confirmResolveConversation() {
  showResolveConfirm.value = true
}

function executeResolveConversation() {
  if (!activeConversationId.value) return

  socket.value?.emit('resolve_conversation', {
    conversationId: activeConversationId.value,
  })
  
  showResolveConfirm.value = false
}

function cancelResolveConversation() {
  showResolveConfirm.value = false
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
  const shortId = conv.visitorId ? `#${conv.visitorId.substring(conv.visitorId.length > 6 ? conv.visitorId.length - 5 : 0)}` : ''
  if (conv.metadata) {
    try {
      const meta = JSON.parse(conv.metadata)
      const name = meta.visitorName || meta.name
      if (name) return `${name} ${shortId}`
    } catch {}
  }
  return `Visitor ${shortId}`
}

function getVisitorEmail(conv: Conversation) {
  if (conv.metadata) {
    try {
      const meta = JSON.parse(conv.metadata)
      if (meta.visitorEmail) return meta.visitorEmail
    } catch {
      return null
    }
  }
  return null
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
        bubbleSize.value = config.bubbleSize || 'medium'
        bubblePattern.value = config.bubblePattern || 'solid'
        websitePosition.value = config.websitePosition || 'bottom-right'
        bubbleIcon.value = config.bubbleIcon || '💬'
        if (config.enableReadReceipts !== undefined) {
          enableReadReceipts.value = config.enableReadReceipts
        }
      }
    }
  } catch {
    // Config may not exist yet
  }
}

async function loadQuickReplies() {
  try {
    const res = await fetch(`${props.serverUrl}/quick-replies`, {
      headers: { 'Authorization': `Bearer ${props.token}` },
    })
    if (res.ok) {
      quickReplies.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to load quick replies', err)
  }
}

function startEditingQuickReply(qr?: QuickReply) {
  if (qr) {
    editingQuickReplyId.value = qr.id
    qrDraftTitle.value = qr.title
    qrDraftContent.value = qr.content
  } else {
    editingQuickReplyId.value = 'new'
    qrDraftTitle.value = ''
    qrDraftContent.value = ''
  }
}

function cancelEditingQuickReply() {
  editingQuickReplyId.value = null
  qrDraftTitle.value = ''
  qrDraftContent.value = ''
}

async function saveQuickReply() {
  if (!qrDraftTitle.value.trim() || !qrDraftContent.value.trim()) return
  
  try {
    const isNew = editingQuickReplyId.value === 'new'
    const url = isNew ? `${props.serverUrl}/quick-replies` : `${props.serverUrl}/quick-replies/${editingQuickReplyId.value}`
    const method = isNew ? 'POST' : 'PUT'
    
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`,
      },
      body: JSON.stringify({
        title: qrDraftTitle.value.trim(),
        content: qrDraftContent.value.trim()
      })
    })
    
    if (res.ok) {
      await loadQuickReplies()
      cancelEditingQuickReply()
    }
  } catch (err) {
    console.error('Failed to save quick reply', err)
  }
}

async function deleteQuickReply(id: string) {
  if (!confirm('Are you sure you want to delete this quick reply?')) return
  try {
    const res = await fetch(`${props.serverUrl}/quick-replies/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${props.token}` },
    })
    if (res.ok) {
      await loadQuickReplies()
    }
  } catch (err) {
    console.error('Failed to delete quick reply', err)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (showQuickReplyPopover.value && filteredQuickReplies.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeQuickReplyIndex.value = Math.min(activeQuickReplyIndex.value + 1, filteredQuickReplies.value.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeQuickReplyIndex.value = Math.max(activeQuickReplyIndex.value - 1, 0)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      insertQuickReply(filteredQuickReplies.value[activeQuickReplyIndex.value].content)
    }
  } else if (e.key === 'Enter') {
    sendMessage()
  }
}

function insertQuickReply(content: string) {
  newMessage.value = content
  showQuickReplyPopover.value = false
  activeQuickReplyIndex.value = 0
  handleInputChange()
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
          bubbleSize: bubbleSize.value,
          bubblePattern: bubblePattern.value,
          websitePosition: websitePosition.value,
          bubbleIcon: bubbleIcon.value,
          enableReadReceipts: enableReadReceipts.value,
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
          bubbleSize: bubbleSize.value,
          bubblePattern: bubblePattern.value,
          websitePosition: websitePosition.value,
          bubbleIcon: bubbleIcon.value,
          allowedOrigins: '*',
          enableReadReceipts: enableReadReceipts.value,
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

async function handleLogout() {
  try {
    await fetch(`${props.serverUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${props.token}`,
      },
    })
  } catch (err) {
    console.error('[OmniChat Admin] Failed to call logout endpoint', err)
  }
  
  // Disconnect socket immediately
  socket.value?.disconnect()
  socket.value = null

  // Emit custom event to host application
  emit('omnichat:logout')
  
  // Dispatch native composed event for broader compatibility
  const host = document.querySelector('omnichat-admin')
  if (host) {
    host.dispatchEvent(new CustomEvent('omnichat:logout', { bubbles: true, composed: true }))
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  connect()
  loadSettings()
  loadQuickReplies()
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <div class="omnichat-admin-root" style="position: relative; display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; height: 100% !important; width: 100% !important; overflow: hidden !important;">
    <!-- Sidebar Panel -->
    <div class="sidebar" style="width: 300px !important; min-width: 300px !important; max-width: 300px !important; flex: 0 0 300px !important; display: flex !important; flex-direction: column !important; height: 100% !important; overflow: hidden !important; border-right: 1px solid #e5e7eb;">
      <div class="sidebar-header" style="flex-shrink: 0 !important; display: flex; align-items: center; justify-content: space-between;">
        <span>OmniChat</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button
            style="background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280;"
            title="Settings"
            @click="showSettings = !showSettings"
          >
            &#9881;
          </button>
          <button
            style="background: none; border: none; cursor: pointer; font-size: 18px; color: #ef4444;"
            title="Logout"
            @click="handleLogout"
          >
            &#10162;
          </button>
        </div>
      </div>

      <!-- Active / Resolved tabs -->
      <div class="sidebar-tabs">
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'active' }"
          :style="activeTab === 'active' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'active'"
        >
          Active
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'resolved' }"
          :style="activeTab === 'resolved' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'resolved'"
        >
          Resolved
        </button>
      </div>

      <!-- Search Bar -->
      <div style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search name, email, username, ID..." 
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px;"
        />
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
          <div style="font-weight: 500; font-size: 13px; margin-bottom: 2px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span>{{ getVisitorLabel(conv) }}</span>
              <span v-if="conv.unreadCount && conv.unreadCount > 0" style="background-color: #ef4444; color: white; border-radius: 9999px; padding: 0 6px; font-size: 10px; font-weight: bold; line-height: 16px;">
                {{ conv.unreadCount }}
              </span>
            </div>
            <span v-if="conv.agentRemarks" style="color: #d97706; font-size: 11px;" title="Has remarks">📝</span>
          </div>
          <div v-if="conv.assignedUsername" style="font-size: 11px; color: #4338ca; margin-bottom: 4px; background: #e0e7ff; display: inline-block; padding: 2px 4px; border-radius: 4px;">
            @{{ conv.assignedUsername }}
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
            <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px;">
              {{ getVisitorLabel(activeConversationData) }}
              <span v-if="activeConversationData.assignedUsername" style="background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                @{{ activeConversationData.assignedUsername }}
              </span>
              <span v-if="getVisitorEmail(activeConversationData)" style="font-weight: 400; font-size: 12px; color: #6b7280;">
                {{ getVisitorEmail(activeConversationData) }}
              </span>
            </div>
            <div style="font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 8px;">
              <span>{{ isActive ? 'Active conversation' : 'Resolved' }}</span>
              <span v-if="activeConversationData.agentRemarks" style="color: #d97706;" :title="activeConversationData.agentRemarks">
                📝 Has remarks
              </span>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button
              style="background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px;"
              @click="showConversationDetails = !showConversationDetails"
            >
              Details
            </button>
            <template v-if="isActive">
              <template v-if="showResolveConfirm">
                <span style="font-size: 13px; color: #b91c1c; font-weight: 500; margin-right: 4px;">Resolve?</span>
                <button
                  style="background: #ef4444; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px;"
                  @click="executeResolveConversation"
                >
                  Confirm
                </button>
                <button
                  style="background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px;"
                  @click="cancelResolveConversation"
                >
                  Cancel
                </button>
              </template>
              <template v-else>
                <button
                  class="resolve-btn"
                  :style="{ backgroundColor: bubbleColor, borderColor: bubbleColor }"
                  @click="confirmResolveConversation"
                >
                  Resolve
                </button>
              </template>
            </template>
          </div>
        </div>

        <!-- Conversation Details Panel -->
        <div v-if="showConversationDetails" style="background: #f9fafb; border-bottom: 1px solid #e5e7eb; padding: 15px; flex: 0 0 auto;">
          <div style="display: flex; gap: 15px;">
            <div style="flex: 1;">
              <label style="display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px;">Assigned Username</label>
              <input v-model="draftAssignedUsername" type="text" placeholder="e.g. user123" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px;" />
            </div>
            <div style="flex: 2;">
              <label style="display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px;">Internal Remarks</label>
              <textarea v-model="draftAgentRemarks" placeholder="Add notes for other agents..." rows="2" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; resize: vertical;"></textarea>
            </div>
            
            <div style="flex: 1.5; border-left: 1px solid #d1d5db; padding-left: 15px;">
              <label style="display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px;">Visitor Info</label>
              <div style="font-size: 12px; color: #6b7280; display: grid; grid-template-columns: 60px 1fr; gap: 4px;">
                <strong>IP:</strong> <span>{{ activeConversationData.visitorIp || 'Unknown' }}</span>
                <strong>Browser:</strong> <span>{{ activeConversationData.visitorBrowser || 'Unknown' }}</span>
                <strong>OS:</strong> <span>{{ activeConversationData.visitorOs || 'Unknown' }}</span>
                <strong>Device:</strong> <span style="text-transform: capitalize;">{{ activeConversationData.visitorDevice || 'Desktop' }}</span>
                <strong>Screen:</strong> <span>{{ activeConversationData.visitorScreenRes || 'Unknown' }}</span>
              </div>
            </div>
            
            <div style="flex: 1.5; border-left: 1px solid #d1d5db; padding-left: 15px;">
              <label style="display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px;">Session Context</label>
              <div style="font-size: 12px; color: #6b7280; display: grid; grid-template-columns: 70px 1fr; gap: 4px;">
                <strong>URL:</strong> <a :href="activeConversationData.visitorCurrentUrl" target="_blank" style="color: #4f46e5; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px; display: inline-block;" :title="activeConversationData.visitorCurrentUrl">{{ activeConversationData.visitorCurrentUrl || 'Unknown' }}</a>
                <strong>Referrer:</strong> <a v-if="activeConversationData.visitorReferrer" :href="activeConversationData.visitorReferrer" target="_blank" style="color: #4f46e5; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px; display: inline-block;" :title="activeConversationData.visitorReferrer">{{ activeConversationData.visitorReferrer }}</a><span v-else>Direct / None</span>
                <strong>Timezone:</strong> <span>{{ activeConversationData.visitorTimezone || 'Unknown' }}</span>
                <strong>Language:</strong> <span>{{ activeConversationData.visitorLanguage || 'Unknown' }}</span>
              </div>
            </div>

            <div style="display: flex; align-items: flex-end;">
              <button @click="saveConversationDetails" style="background: #10b981; color: white; border: none; padding: 6px 16px; border-radius: 4px; font-weight: 500; cursor: pointer; font-size: 13px;">Save</button>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="messages-container" style="flex: 1 1 auto !important; min-height: 0 !important; overflow-y: auto !important; overflow-x: hidden !important;">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-bubble', msg.senderType]"
            :style="msg.senderType === 'agent' ? { backgroundColor: bubbleColor } : {}"
          >
            <div>{{ msg.content }}</div>
            <div class="message-meta">
              <span>{{ msg.senderDisplayName || msg.senderType }} &middot; {{ formatTime(msg.createdAt) }}</span>
              <span v-if="enableReadReceipts && msg.senderType === 'agent' && msg.readAt" style="color: #10b981; font-weight: bold; margin-left: 4px;" title="Read">
                &#10003;&#10003;
              </span>
            </div>
          </div>
        </div>

        <!-- Post-chat Review -->
        <div v-if="activeConversationData.rating" style="padding: 15px; background: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
          <div style="font-weight: 600; color: #374151;">Visitor Review</div>
          <div style="font-size: 20px;" :style="{ color: bubbleColor }">
            {{ '★'.repeat(activeConversationData.rating) }}{{ '☆'.repeat(5 - activeConversationData.rating) }}
          </div>
          <div v-if="activeConversationData.review" style="font-size: 14px; color: #6b7280; font-style: italic; margin-top: 5px;">
            "{{ activeConversationData.review }}"
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="typing-indicator">
          {{ typingUser }} is typing...
        </div>

        <!-- Quick Reply Popover -->
        <div v-if="showQuickReplyPopover && filteredQuickReplies.length > 0" class="quick-reply-popover" style="position: absolute; bottom: 65px; left: 15px; width: 300px; max-height: 200px; overflow-y: auto; background: white; border: 1px solid #d1d5db; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); z-index: 10;">
          <div
            v-for="(qr, index) in filteredQuickReplies"
            :key="qr.id"
            class="quick-reply-item"
            :style="{ padding: '10px', cursor: 'pointer', borderBottom: index < filteredQuickReplies.length - 1 ? '1px solid #f3f4f6' : 'none', backgroundColor: index === activeQuickReplyIndex ? '#f3f4f6' : 'white' }"
            @click="insertQuickReply(qr.content)"
            @mouseover="activeQuickReplyIndex = index"
          >
            <div style="font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 2px;">/{{ qr.title }}</div>
            <div style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ qr.content }}</div>
          </div>
        </div>

        <!-- Input area — always show when conversation is selected -->
        <div class="chat-input-area" style="flex: 0 0 auto !important; min-height: 60px !important;">
          <input
            v-model="newMessage"
            class="chat-input"
            type="text"
            :placeholder="isActive ? 'Type a message... (Type / for quick replies)' : 'Conversation resolved'"
            :disabled="!isActive"
            @keydown="handleKeyDown"
            @input="handleInputChange"
          />
          <button
            class="send-btn"
            :style="{ backgroundColor: bubbleColor }"
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
      <div class="settings-drawer" style="width: 360px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Settings</h3>
          <button
            style="background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280;"
            @click="showSettings = false"
          >
            &times;
          </button>
        </div>

        <div style="display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 20px;">
          <button
            style="flex: 1; padding: 10px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; border-bottom: 2px solid transparent;"
            :style="settingsTab === 'widget' ? { borderBottomColor: '#4f46e5', color: '#4f46e5' } : { color: '#6b7280' }"
            @click="settingsTab = 'widget'"
          >
            Widget Setup
          </button>
          <button
            style="flex: 1; padding: 10px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; border-bottom: 2px solid transparent;"
            :style="settingsTab === 'quick-replies' ? { borderBottomColor: '#4f46e5', color: '#4f46e5' } : { color: '#6b7280' }"
            @click="settingsTab = 'quick-replies'"
          >
            Quick Replies
          </button>
        </div>

        <div v-if="settingsTab === 'widget'">
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

          <div class="settings-field">
            <label class="settings-label">Bubble Size</label>
            <select v-model="bubbleSize" class="settings-input">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div class="settings-field">
            <label class="settings-label">Bubble Pattern</label>
            <select v-model="bubblePattern" class="settings-input">
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
              <option value="stripes">Stripes</option>
              <option value="dots">Dots</option>
            </select>
          </div>

          <div class="settings-field">
            <label class="settings-label">Website Position</label>
            <select v-model="websitePosition" class="settings-input">
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>

          <div class="settings-field">
            <label class="settings-label">Bubble Icon</label>
            <select v-model="bubbleIcon" class="settings-input">
              <option value="💬">💬 Chat</option>
              <option value="✉️">✉️ Envelope</option>
              <option value="👋">👋 Wave</option>
              <option value="❓">❓ Question</option>
              <option value="🎧">🎧 Headset</option>
            </select>
          </div>

          <div class="settings-field" style="display: flex; align-items: center; gap: 8px;">
            <input
              id="enableReadReceipts"
              type="checkbox"
              v-model="enableReadReceipts"
            />
            <label for="enableReadReceipts" class="settings-label" style="margin-bottom: 0;">Enable Read Receipts</label>
          </div>

          <button
            class="send-btn"
            style="width: 100%; margin-top: 12px;"
            :style="{ backgroundColor: bubbleColor }"
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

        <div v-if="settingsTab === 'quick-replies'" style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Quick Replies List -->
          <div v-if="!editingQuickReplyId">
            <button
              class="send-btn"
              style="width: 100%; margin-bottom: 16px; background-color: #10b981;"
              @click="startEditingQuickReply()"
            >
              + Add Quick Reply
            </button>
            
            <div v-if="quickReplies.length === 0" style="text-align: center; color: #6b7280; font-size: 13px;">
              No quick replies found.
            </div>
            
            <div v-for="qr in quickReplies" :key="qr.id" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="margin: 0; font-size: 14px; font-weight: 600;">{{ qr.title }}</h4>
                <div style="display: flex; gap: 8px;">
                  <button @click="startEditingQuickReply(qr)" style="background: none; border: none; cursor: pointer; color: #4f46e5; font-size: 12px;">Edit</button>
                  <button @click="deleteQuickReply(qr.id)" style="background: none; border: none; cursor: pointer; color: #ef4444; font-size: 12px;">Delete</button>
                </div>
              </div>
              <p style="margin: 0; font-size: 12px; color: #6b7280; white-space: pre-wrap;">{{ qr.content }}</p>
            </div>
          </div>
          
          <!-- Edit/Create Form -->
          <div v-if="editingQuickReplyId" style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600;">{{ editingQuickReplyId === 'new' ? 'New Quick Reply' : 'Edit Quick Reply' }}</h4>
            
            <div class="settings-field">
              <label class="settings-label">Title / Shortcut</label>
              <input v-model="qrDraftTitle" type="text" class="settings-input" placeholder="e.g. Greeting" />
            </div>
            
            <div class="settings-field">
              <label class="settings-label">Message Content</label>
              <textarea v-model="qrDraftContent" class="settings-input" rows="4" placeholder="Enter the full message..." style="resize: vertical;"></textarea>
            </div>
            
            <div style="display: flex; gap: 8px; margin-top: 16px;">
              <button class="send-btn" style="flex: 1;" @click="saveQuickReply">Save</button>
              <button style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer;" @click="cancelEditingQuickReply">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
