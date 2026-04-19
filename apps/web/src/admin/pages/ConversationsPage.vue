<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from '../stores/toast.store'
import { io, Socket } from 'socket.io-client'
import { renderMarkdown } from '../../utils/markdown'

const authStore = useAuthStore()
const toast = useToast()

/** Build fetch options with auth headers (supports both cookie and token auth) */
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { ...extra }
  if (authStore.token && authStore.token !== 'cookie-auth') {
    h['Authorization'] = `Bearer ${authStore.token}`
  }
  return h
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
interface Message {
  id: string
  conversationId: string
  senderType: 'visitor' | 'agent' | 'ai' | 'system'
  senderId?: string
  content: string
  messageType?: string
  attachmentUrl?: string
  attachmentThumbnailUrl?: string
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
  specialistUsername?: string
  resolvedByUsername?: string
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

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const socket = ref<Socket | null>(null)
const conversations = ref<Conversation[]>([])
const activeConversationId = ref<string | null>(null)
const activeConversationData = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const activeTab = ref<'active' | 'ai' | 'resolved' | 'specialist'>('active')
const isTyping = ref(false)
const typingUser = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const showResolveConfirm = ref(false)
const showTransferConfirm = ref(false)
const transferTargetUsername = ref('')
const adminList = ref<{ username: string; displayName: string }[]>([])

const isUploading = ref(false)
const isDragging = ref(false)
const dragCounter = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

const selectedImage = ref<string | null>(null)

const bubbleColor = ref('#4F46E5')
const enableReadReceipts = ref(true)
const isOfflineMode = ref(false)
const notificationSoundUrl = ref('')

const isMuted = ref(localStorage.getItem('omnichat_admin_muted') === 'true')

const searchQuery = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const showConversationDetails = ref(false)
const draftAssignedUsername = ref('')
const draftAgentRemarks = ref('')

const currentUserUsername = ref(authStore.user?.username || '')
const currentUserDisplayName = ref(authStore.user?.displayName || '')

// Quick Replies
const quickReplies = ref<QuickReply[]>([])
const showQuickReplyPopover = ref(false)
const activeQuickReplyIndex = ref(0)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const activeUnreadCount = computed(() => {
  return conversations.value
    .filter((c) => c.status === 'active')
    .reduce((sum, c) => sum + (c.unreadCount || 0), 0)
})

const aiUnreadCount = computed(() => {
  return conversations.value
    .filter((c) => c.status === 'ai')
    .reduce((sum, c) => sum + (c.unreadCount || 0), 0)
})

const specialistUnreadCount = computed(() => {
  return conversations.value
    .filter((c) => c.status === 'specialist' && c.specialistUsername === currentUserUsername.value)
    .reduce((sum, c) => sum + (c.unreadCount || 0), 0)
})

const filteredConversations = computed(() => {
  let list = conversations.value.filter((c) => {
    if (activeTab.value === 'specialist') {
      return c.status === 'specialist' && c.specialistUsername === currentUserUsername.value
    }
    return c.status === activeTab.value
  })

  if (activeTab.value === 'resolved' && (filterStartDate.value || filterEndDate.value)) {
    list = list.filter((c) => {
      const convDate = new Date(c.updatedAt)
      let isValid = true

      if (filterStartDate.value) {
        const [y, m, d] = filterStartDate.value.split('-').map(Number)
        const start = new Date(y, m - 1, d, 0, 0, 0, 0)
        if (convDate < start) isValid = false
      }

      if (filterEndDate.value) {
        const [y, m, d] = filterEndDate.value.split('-').map(Number)
        const end = new Date(y, m - 1, d, 23, 59, 59, 999)
        if (convDate > end) isValid = false
      }

      return isValid
    })
  }

  if (searchQuery.value) {
    const rawQ = searchQuery.value.trim()
    const isUsernameSearch = rawQ.startsWith('@')
    const isTicketSearch = rawQ.startsWith('#')
    const q = isUsernameSearch || isTicketSearch ? rawQ.slice(1).toLowerCase() : rawQ.toLowerCase()

    list = list.filter((c) => {
      const assigned = (c.assignedUsername || '').toLowerCase()
      const specialist = (c.specialistUsername || '').toLowerCase()
      const id = c.id.toLowerCase()
      const ticketId = c.id.slice(-8).toLowerCase()

      if (isUsernameSearch) {
        return assigned.includes(q) || specialist.includes(q)
      }

      if (isTicketSearch) {
        return id.includes(q) || ticketId.includes(q)
      }

      const visitorLabel = getVisitorLabel(c).toLowerCase()
      const email = getVisitorEmail(c)?.toLowerCase() || ''
      const remarks = (c.agentRemarks || '').toLowerCase()

      return (
        visitorLabel.includes(q) ||
        email.includes(q) ||
        assigned.includes(q) ||
        specialist.includes(q) ||
        remarks.includes(q) ||
        id.includes(q) ||
        ticketId.includes(q)
      )
    })
  }
  return list
})

const isActive = computed(
  () => activeConversationData.value?.status === 'active' || activeConversationData.value?.status === 'specialist',
)

const filteredQuickReplies = computed(() => {
  if (!newMessage.value.startsWith('/')) return []
  const query = newMessage.value.substring(1).toLowerCase()
  return quickReplies.value.filter(
    (qr) => qr.title.toLowerCase().includes(query) || qr.content.toLowerCase().includes(query),
  )
})

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------
const audioPlayer = new Audio()

function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('omnichat_admin_muted', isMuted.value ? 'true' : 'false')
}

function playSound() {
  if (isMuted.value) return

  if (notificationSoundUrl.value) {
    const src = notificationSoundUrl.value.startsWith('http')
      ? notificationSoundUrl.value
      : authStore.serverUrl + notificationSoundUrl.value
    if (audioPlayer.src !== src) {
      audioPlayer.src = src
    }
    audioPlayer.currentTime = 0
    audioPlayer.play().catch((e) => console.warn('Audio autoplay blocked or failed:', e))
  } else {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)

      oscillator.start(audioCtx.currentTime)
      oscillator.stop(audioCtx.currentTime + 0.1)
    } catch (e) {
      console.warn('Synthesized audio failed:', e)
    }
  }
}

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------
function openImage(url: string) {
  selectedImage.value = url
}

function closeImage() {
  selectedImage.value = null
}

// ---------------------------------------------------------------------------
// Socket.io connection & event handlers
// ---------------------------------------------------------------------------
function connect() {
  const s = io(authStore.serverUrl, {
    auth: authStore.token && authStore.token !== 'cookie-auth' ? { token: authStore.token } : undefined,
    transports: ['websocket', 'polling'],
    withCredentials: true,
  })

  s.on('connect', () => {
    console.log('[OmniChat Admin] Connected to server')
  })

  s.on(
    'conversations_list',
    (data: {
      conversations: Conversation[]
      currentUser?: { id: string; username: string; displayName: string; role: string }
    }) => {
      if (data.currentUser) {
        currentUserUsername.value = data.currentUser.username
        currentUserDisplayName.value = data.currentUser.displayName
      }

      conversations.value = data.conversations.map((c) => ({
        ...c,
        unreadCount: c._count?.messages || 0,
      }))
      if (activeConversationId.value) {
        const found = conversations.value.find((c) => c.id === activeConversationId.value)
        if (found) {
          activeConversationData.value = found
        }
      }
    },
  )

  s.on('new_conversation', (data: { conversation: Conversation }) => {
    // Don't play sound for AI-handled conversations — agents don't need alerts for those
    if (data.conversation.status !== 'ai') playSound()
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
        createdAt: new Date().toISOString(),
      })
      nextTick(() => scrollToBottom())
    }
    const conv = conversations.value.find((c) => c.id === data.conversationId)
    if (conv) {
      conv.messages = [
        {
          id: 'sys_' + Date.now(),
          conversationId: data.conversationId,
          senderType: 'system',
          content: data.message,
          createdAt: new Date().toISOString(),
        },
      ]
    }
  })

  s.on('message_error', (data: { error: string }) => {
    toast.error(data.error)
  })

  s.on('new_message', (data: { message: Message }) => {
    // Play sound for visitor messages, but not in AI-handled conversations
    const msgConv = conversations.value.find((c) => c.id === data.message.conversationId)
    if (data.message.senderType === 'visitor' && msgConv?.status !== 'ai') playSound()
    if (data.message.conversationId === activeConversationId.value) {
      messages.value.push(data.message)
      nextTick(() => {
        scrollToBottom()
        if (data.message.senderType === 'visitor') {
          socket.value?.emit('read_message', {
            messageId: data.message.id,
            conversationId: activeConversationId.value,
          })
        }
      })
    }
    const conv = conversations.value.find((c) => c.id === data.message.conversationId)
    if (conv) {
      conv.messages = [data.message]
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

  s.on('visitor_typing', (data: { conversationId: string; user: string; isTyping: boolean }) => {
    if (data.conversationId === activeConversationId.value) {
      isTyping.value = data.isTyping
      typingUser.value = data.user
    }
  })

  s.on('conversation_resolved', (data: { conversationId: string; resolvedBy: string }) => {
    const conv = conversations.value.find((c) => c.id === data.conversationId)
    if (conv) {
      conv.status = 'resolved'
    }
    if (activeConversationData.value?.id === data.conversationId) {
      activeConversationData.value.status = 'resolved'
    }
  })

  s.on('chat_transferred', (data: { conversationId: string; specialistUsername: string; transferredBy: string }) => {
    const conv = conversations.value.find((c) => c.id === data.conversationId)
    if (conv) {
      conv.status = 'specialist'
      conv.specialistUsername = data.specialistUsername
    }
    if (activeConversationData.value?.id === data.conversationId) {
      activeConversationData.value.status = 'specialist'
      activeConversationData.value.specialistUsername = data.specialistUsername
    }
    if (data.specialistUsername === currentUserUsername.value) {
      playSound()
    }
  })

  s.on('conversation_updated', (data: { conversation: Conversation }) => {
    const idx = conversations.value.findIndex((c) => c.id === data.conversation.id)
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
      conversationId: activeConversationId.value,
    })
  })
}

function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        const mimeType = 'image/webp'

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newName = file.name.replace(/\.[^/.]+$/, '') + '.webp'
              resolve(new File([blob], newName, { type: mimeType }))
            } else {
              reject(new Error('Canvas to Blob failed'))
            }
          },
          mimeType,
          quality,
        )
      }
      img.onerror = (e) => reject(e)
    }
    reader.onerror = (e) => reject(e)
  })
}

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  await processFile(target.files[0])
}

function onPanelDragEnter(event: DragEvent) {
  event.preventDefault()
  dragCounter.value++
  isDragging.value = true
}

function onPanelDragOver(event: DragEvent) {
  event.preventDefault()
}

function onPanelDragLeave(event: DragEvent) {
  event.preventDefault()
  dragCounter.value--
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

function onPanelDrop(event: DragEvent) {
  event.preventDefault()
  dragCounter.value = 0
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFile(event.dataTransfer.files[0])
  }
}

async function processFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB limit.')
    return
  }

  isUploading.value = true

  try {
    const fileName = file.name.toLowerCase()
    const isHeicFile =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      file.type === 'image/heic-sequence' ||
      file.type === 'image/heif-sequence'

    if (isHeicFile) {
      console.log('HEIC file detected - will be converted on backend')
    } else if (file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      file = await compressImage(file, 1200, 0.8)
    } else {
      throw new Error(`Unsupported format: ${file.type}`)
    }
  } catch (err: any) {
    console.error('Image processing failed', err)
    alert(`Failed to process image: ${err.message}. Make sure it is a valid format (JPG, PNG, HEIC, WEBP).`)
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  if (activeConversationId.value) {
    formData.append('conversationId', activeConversationId.value)
  }

  try {
    const res = await fetch(`${authStore.serverUrl}/upload`, {
      credentials: 'include',
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload failed')
    }

    const data = await res.json()

    socket.value?.emit('send_message', {
      conversationId: activeConversationId.value,
      content: '',
      messageType: 'image',
      attachmentUrl: `${authStore.serverUrl}${data.url}`,
      attachmentThumbnailUrl: `${authStore.serverUrl}${data.thumbnailUrl || data.url}`,
    })
  } catch (error) {
    console.error('File upload error:', error)
    alert('Failed to upload file.')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !activeConversationId.value) return

  const text = newMessage.value.trim()
  if (text.length > 200) {
    toast.error(`Message too long (${text.length}/200 characters).`)
    return
  }

  socket.value?.emit('send_message', {
    conversationId: activeConversationId.value,
    content: newMessage.value.trim(),
    messageType: 'text',
  })

  socket.value?.emit('typing_stop', {
    conversationId: activeConversationId.value,
  })

  newMessage.value = ''
}

let typingTimeout: ReturnType<typeof setTimeout> | null = null

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

  if (activeTab.value !== 'resolved') {
    activeConversationData.value = null
    activeConversationId.value = null
  }
}

function cancelResolveConversation() {
  showResolveConfirm.value = false
}

function confirmTransferConversation() {
  showTransferConfirm.value = true
}

function executeTransferConversation() {
  if (!activeConversationId.value || !transferTargetUsername.value) return

  socket.value?.emit('transfer_to_specialist', {
    conversationId: activeConversationId.value,
    targetUsername: transferTargetUsername.value,
  })

  showTransferConfirm.value = false
  transferTargetUsername.value = ''

  if (activeTab.value === 'active' || transferTargetUsername.value !== currentUserUsername.value) {
    activeConversationData.value = null
    activeConversationId.value = null
  }
}

function cancelTransferConversation() {
  showTransferConfirm.value = false
  transferTargetUsername.value = ''
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function formatTicketId(id: string | null): string {
  if (!id) return ''
  return id.slice(-8).toUpperCase()
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getVisitorLabel(conv: Conversation) {
  if (conv.metadata) {
    try {
      const meta = JSON.parse(conv.metadata)
      const name = meta.visitorName || meta.name
      if (name) return name
    } catch {}
  }
  return 'Visitor'
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
    const msg = conv.messages[0]
    if (msg.messageType === 'image') {
      return msg.content ? `[Image] ${msg.content}` : '[Image]'
    }
    const content = msg.content || ''
    return content.slice(0, 50) + (content.length > 50 ? '...' : '')
  }
  return 'No messages yet'
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
  } else if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function insertQuickReply(content: string) {
  newMessage.value = content
  showQuickReplyPopover.value = false
  activeQuickReplyIndex.value = 0
  handleInputChange()
}

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------
async function loadAdminList() {
  try {
    const res = await fetch(`${authStore.serverUrl}/admin/users`, {
      credentials: 'include',
      headers: authHeaders(),
    })
    if (res.ok) {
      adminList.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to load admin list', err)
  }
}

async function loadSettings() {
  try {
    const res = await fetch(`${authStore.serverUrl}/config/active`, {
      credentials: 'include',
      headers: authHeaders(),
    })
    if (res.ok) {
      const config = await res.json()
      if (config) {
        bubbleColor.value = config.bubbleColor || '#4F46E5'
        if (config.enableReadReceipts !== undefined) {
          enableReadReceipts.value = config.enableReadReceipts
        }
        if (config.isOfflineMode !== undefined) {
          isOfflineMode.value = config.isOfflineMode
        }
        if (config.notificationSoundUrl) {
          notificationSoundUrl.value = config.notificationSoundUrl
        }
      }
    }
  } catch {
    // Config may not exist yet
  }
}

async function loadQuickReplies() {
  try {
    const res = await fetch(`${authStore.serverUrl}/quick-replies`, {
      credentials: 'include',
      headers: authHeaders(),
    })
    if (res.ok) {
      quickReplies.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to load quick replies', err)
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  connect()
  loadSettings()
  loadQuickReplies()
  loadAdminList()
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>

<template>
  <div
    class="omnichat-admin-root"
    style="
      position: relative;
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      height: 100% !important;
      width: 100% !important;
      overflow: hidden !important;
    "
  >
    <!-- Sidebar Panel -->
    <div
      class="sidebar"
      style="
        width: 300px !important;
        min-width: 300px !important;
        max-width: 300px !important;
        flex: 0 0 300px !important;
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
        overflow: hidden !important;
        border-right: 1px solid #e5e7eb;
      "
    >
      <div
        class="sidebar-header"
        style="flex-shrink: 0 !important; display: flex; align-items: center; justify-content: space-between"
      >
        <div style="display: flex; flex-direction: column">
          <div style="display: flex; align-items: center; gap: 8px">
            <span>OmniChat</span>
            <span
              v-if="isOfflineMode"
              style="
                background-color: #ef4444;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
              "
              >Human Offline</span
            >
            <span
              v-else
              style="
                background-color: #10b981;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
              "
              >Online</span
            >
          </div>
          <span v-if="currentUserUsername" style="font-size: 11px; color: #6b7280; margin-top: 2px">
            {{ currentUserDisplayName }} (@{{ currentUserUsername }})
          </span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center">
          <button
            style="background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280"
            :title="isMuted ? 'Unmute Notifications' : 'Mute Notifications'"
            @click="toggleMute"
          >
            {{ isMuted ? '🔕' : '🔔' }}
          </button>
        </div>
      </div>

      <!-- Active / Resolved / Specialist tabs -->
      <div class="sidebar-tabs">
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'active' }"
          :style="activeTab === 'active' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'active'"
        >
          Active
          <span
            v-if="activeUnreadCount > 0"
            style="
              background-color: #ef4444;
              color: white;
              border-radius: 9999px;
              padding: 0 6px;
              font-size: 10px;
              font-weight: bold;
              line-height: 16px;
              margin-left: 4px;
            "
          >
            {{ activeUnreadCount }}
          </span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'ai' }"
          :style="activeTab === 'ai' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'ai'"
        >
          AI
          <span
            v-if="aiUnreadCount > 0"
            style="
              background-color: #ef4444;
              color: white;
              border-radius: 9999px;
              padding: 0 6px;
              font-size: 10px;
              font-weight: bold;
              line-height: 16px;
              margin-left: 4px;
            "
          >
            {{ aiUnreadCount }}
          </span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'specialist' }"
          :style="activeTab === 'specialist' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'specialist'"
        >
          Specialist
          <span
            v-if="specialistUnreadCount > 0"
            style="
              background-color: #ef4444;
              color: white;
              border-radius: 9999px;
              padding: 0 6px;
              font-size: 10px;
              font-weight: bold;
              line-height: 16px;
              margin-left: 4px;
            "
          >
            {{ specialistUnreadCount }}
          </span>
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

      <!-- Search Bar & Filters -->
      <div style="padding: 10px; border-bottom: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 8px">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search name, email, username, ID..."
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px"
        />
        <div v-if="activeTab === 'resolved'" style="display: flex; gap: 8px; align-items: center">
          <input
            v-model="filterStartDate"
            type="date"
            style="
              flex: 1;
              padding: 6px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              font-size: 12px;
              color: #4b5563;
            "
            title="Start Date"
          />
          <span style="color: #9ca3af; font-size: 12px">to</span>
          <input
            v-model="filterEndDate"
            type="date"
            style="
              flex: 1;
              padding: 6px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              font-size: 12px;
              color: #4b5563;
            "
            title="End Date"
          />
        </div>
      </div>

      <!-- Conversation list -->
      <div class="conversation-list" style="flex: 1; min-height: 0; overflow-y: auto">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="conversation-item"
          :class="{ active: conv.id === activeConversationId }"
          @click="selectConversation(conv.id)"
        >
          <div
            style="
              font-weight: 600;
              font-size: 14px;
              margin-bottom: 4px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div style="display: flex; align-items: center; gap: 6px">
              <span
                style="
                  color: #1e293b;
                  max-width: 120px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: inline-block;
                  vertical-align: bottom;
                "
                >{{ getVisitorLabel(conv) }}</span
              >
              <span style="font-size: 12px; color: #94a3b8; font-weight: normal">#{{ formatTicketId(conv.id) }}</span>
              <span
                v-if="conv.unreadCount && conv.unreadCount > 0"
                style="
                  background-color: #ef4444;
                  color: white;
                  border-radius: 9999px;
                  padding: 2px 6px;
                  font-size: 10px;
                  font-weight: bold;
                  line-height: 1;
                "
              >
                {{ conv.unreadCount }}
              </span>
            </div>
            <span v-if="conv.agentRemarks" style="color: #f59e0b; font-size: 12px" title="Has remarks">📝</span>
          </div>
          <div style="display: flex; gap: 6px; margin-bottom: 8px">
            <div
              v-if="conv.assignedUsername"
              style="
                font-size: 11px;
                color: #4338ca;
                background: #e0e7ff;
                display: inline-flex;
                align-items: center;
                padding: 2px 6px;
                border-radius: 12px;
                font-weight: 500;
              "
            >
              @{{ conv.assignedUsername }}
            </div>
            <div
              v-if="conv.specialistUsername"
              style="
                font-size: 11px;
                color: #059669;
                background: #d1fae5;
                display: inline-flex;
                align-items: center;
                padding: 2px 6px;
                border-radius: 12px;
                font-weight: 500;
              "
              title="Specialist"
            >
              👨‍⚕️ @{{ conv.specialistUsername }}
            </div>
          </div>
          <div
            style="
              font-size: 13px;
              color: #64748b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 1.4;
            "
          >
            {{ getLastMessage(conv) }}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 6px">
            {{ formatTime(conv.updatedAt) }}
          </div>
        </div>

        <div v-if="filteredConversations.length === 0" class="empty-state" style="padding: 40px 16px">
          No {{ activeTab }} conversations
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div
      class="chat-window"
      style="
        flex: 1 1 auto !important;
        display: flex !important;
        flex-direction: column !important;
        min-width: 0 !important;
        height: 100% !important;
        overflow: hidden !important;
        position: relative;
      "
      @dragenter="onPanelDragEnter"
      @dragover="onPanelDragOver"
      @dragleave="onPanelDragLeave"
      @drop="onPanelDrop"
    >
      <template v-if="activeConversationData">
        <!-- Chat header -->
        <div class="chat-header" style="flex: 0 0 auto !important">
          <div>
            <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px">
              <span
                style="
                  max-width: 250px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: inline-block;
                  vertical-align: bottom;
                "
                >{{ getVisitorLabel(activeConversationData) }}</span
              >
              <span style="font-size: 13px; color: #6b7280; font-weight: normal">
                #{{ formatTicketId(activeConversationData.id) }}
              </span>
              <span
                v-if="activeConversationData.assignedUsername"
                style="background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-size: 11px"
                title="Visitor username"
              >
                @{{ activeConversationData.assignedUsername }}
              </span>
              <span
                v-if="activeConversationData.specialistUsername"
                style="background: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-size: 11px"
                title="Specialist handler"
              >
                👨‍⚕️ @{{ activeConversationData.specialistUsername }}
              </span>
              <span
                v-if="getVisitorEmail(activeConversationData)"
                style="font-weight: 400; font-size: 12px; color: #6b7280"
              >
                {{ getVisitorEmail(activeConversationData) }}
              </span>
            </div>
            <div style="font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 8px">
              <span>{{ isActive ? 'Active conversation' : 'Resolved' }}</span>
              <span
                v-if="activeConversationData.agentRemarks"
                style="color: #d97706"
                :title="activeConversationData.agentRemarks"
              >
                📝 Has remarks
              </span>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center">
            <button
              style="
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 13px;
              "
              @click="showConversationDetails = !showConversationDetails"
            >
              Details
            </button>
            <template v-if="isActive">
              <template v-if="showTransferConfirm">
                <select
                  v-model="transferTargetUsername"
                  style="border: 1px solid #d1d5db; border-radius: 6px; padding: 6px; font-size: 13px"
                >
                  <option value="">Select Specialist</option>
                  <option v-for="admin in adminList" :key="admin.username" :value="admin.username">
                    {{ admin.displayName }} (@{{ admin.username }})
                  </option>
                </select>
                <button
                  style="
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 13px;
                  "
                  :disabled="!transferTargetUsername"
                  @click="executeTransferConversation"
                >
                  Transfer
                </button>
                <button
                  style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 13px;
                  "
                  @click="cancelTransferConversation"
                >
                  Cancel
                </button>
              </template>
              <template v-else-if="showResolveConfirm">
                <span style="font-size: 13px; color: #b91c1c; font-weight: 500; margin-right: 4px">Resolve?</span>
                <button
                  style="
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 13px;
                  "
                  @click="executeResolveConversation"
                >
                  Confirm
                </button>
                <button
                  style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 13px;
                  "
                  @click="cancelResolveConversation"
                >
                  Cancel
                </button>
              </template>
              <template v-else>
                <button
                  class="transfer-btn"
                  style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #4b5563;
                  "
                  @click="confirmTransferConversation"
                >
                  Transfer
                </button>
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

        <!-- Drag Overlay -->
        <div v-if="isDragging" class="drag-overlay">
          <div class="drag-overlay-content">
            <span style="font-size: 40px; margin-bottom: 12px; display: block; text-align: center">📥</span>
            <span>Drop file to upload</span>
          </div>
        </div>

        <!-- Conversation Details Panel -->
        <transition name="slide-down">
          <div v-if="showConversationDetails" class="conversation-details-panel">
            <div class="details-grid">
              <div class="details-col flex-2" style="display: flex; flex-direction: column; gap: 16px">
                <div>
                  <label class="details-label" title="The visitor's username on your external website"
                    >Customer Username</label
                  >
                  <div class="details-input-wrap">
                    <span class="input-icon">@</span>
                    <input
                      v-model="draftAssignedUsername"
                      type="text"
                      placeholder="user123"
                      class="details-input with-icon"
                    />
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; flex: 1">
                  <label class="details-label">Internal Remarks</label>
                  <textarea
                    v-model="draftAgentRemarks"
                    placeholder="Add notes for other agents..."
                    rows="2"
                    class="details-input resize-y"
                    style="flex: 1"
                  ></textarea>
                </div>
                <div style="display: flex; justify-content: flex-start; margin-top: auto">
                  <button @click="saveConversationDetails" class="save-details-btn">Save Changes</button>
                </div>
              </div>

              <div class="details-col border-left">
                <label class="details-label">Visitor Info</label>
                <div class="info-list">
                  <div class="info-row">
                    <span class="info-key">IP</span>
                    <span class="info-val">{{ activeConversationData.visitorIp || 'Unknown' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Browser</span>
                    <span class="info-val">{{ activeConversationData.visitorBrowser || 'Unknown' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">OS</span>
                    <span class="info-val">{{ activeConversationData.visitorOs || 'Unknown' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Device</span>
                    <span class="info-val capitalize">{{ activeConversationData.visitorDevice || 'Desktop' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Screen</span>
                    <span class="info-val">{{ activeConversationData.visitorScreenRes || 'Unknown' }}</span>
                  </div>
                </div>
              </div>

              <div class="details-col border-left">
                <label class="details-label">Session Context</label>
                <div class="info-list">
                  <div class="info-row">
                    <span class="info-key">URL</span>
                    <a
                      :href="activeConversationData.visitorCurrentUrl"
                      target="_blank"
                      class="info-link"
                      :title="activeConversationData.visitorCurrentUrl"
                      >{{ activeConversationData.visitorCurrentUrl || 'Unknown' }}</a
                    >
                  </div>
                  <div class="info-row">
                    <span class="info-key">Referrer</span>
                    <a
                      v-if="activeConversationData.visitorReferrer"
                      :href="activeConversationData.visitorReferrer"
                      target="_blank"
                      class="info-link"
                      :title="activeConversationData.visitorReferrer"
                      >{{ activeConversationData.visitorReferrer }}</a
                    ><span v-else class="info-val">Direct / None</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Timezone</span>
                    <span class="info-val">{{ activeConversationData.visitorTimezone || 'Unknown' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Language</span>
                    <span class="info-val">{{ activeConversationData.visitorLanguage || 'Unknown' }}</span>
                  </div>
                  <template v-if="activeConversationData.status === 'resolved'">
                    <div class="info-row">
                      <span class="info-key">Resolved By</span>
                      <span class="info-val">@{{ activeConversationData.resolvedByUsername || 'Unknown' }}</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="messages-container"
          style="
            flex: 1 1 auto !important;
            min-height: 0 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          "
        >
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-bubble', msg.senderType]"
            :style="
              msg.senderType === 'agent'
                ? { backgroundColor: bubbleColor, padding: msg.messageType === 'image' ? '4px' : '' }
                : msg.senderType === 'ai'
                  ? {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: msg.messageType === 'image' ? '4px' : '',
                    }
                  : { padding: msg.messageType === 'image' ? '4px' : '' }
            "
          >
            <template v-if="msg.messageType === 'image'">
              <img
                :src="msg.attachmentThumbnailUrl || msg.attachmentUrl"
                alt="Attachment"
                style="
                  max-width: 100%;
                  max-height: 150px;
                  border-radius: 8px;
                  display: block;
                  cursor: pointer;
                  object-fit: cover;
                "
                @click="openImage(msg.attachmentUrl || '')"
              />
              <div v-if="msg.content" class="md-content" style="padding: 8px" v-html="renderMarkdown(msg.content)"></div>
            </template>
            <template v-else>
              <div class="md-content" v-html="renderMarkdown(msg.content || '')"></div>
            </template>
            <div class="message-meta" :style="{ padding: msg.messageType === 'image' ? '0 8px 8px 8px' : '' }">
              <span>{{ msg.senderDisplayName || msg.senderType }} &middot; {{ formatTime(msg.createdAt) }}</span>
              <span
                v-if="enableReadReceipts && msg.senderType === 'agent' && msg.readAt"
                style="color: #10b981; font-weight: bold; margin-left: 4px"
                title="Read"
              >
                &#10003;&#10003;
              </span>
            </div>
          </div>
        </div>

        <!-- Post-chat Review -->
        <div
          v-if="activeConversationData.rating"
          style="padding: 15px; background: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb"
        >
          <div style="font-weight: 600; color: #374151">Visitor Review</div>
          <div style="font-size: 20px" :style="{ color: bubbleColor }">
            {{ '★'.repeat(activeConversationData.rating)
            }}{{ '☆'.repeat(5 - activeConversationData.rating) }}
          </div>
          <div
            v-if="activeConversationData.review"
            style="font-size: 14px; color: #6b7280; font-style: italic; margin-top: 5px"
          >
            "{{ activeConversationData.review }}"
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="typing-indicator" style="padding-bottom: 12px">
          <span>{{ typingUser }} is typing</span>
        </div>

        <div class="chat-input-area" style="flex: 0 0 auto !important; min-height: 80px !important; position: relative">
          <div
            v-if="showQuickReplyPopover && filteredQuickReplies.length > 0"
            class="quick-reply-popover"
            style="
              position: absolute;
              bottom: 100%;
              left: 24px;
              width: 320px;
              max-height: 250px;
              overflow-y: auto;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
              z-index: 20;
              margin-bottom: 12px;
              padding: 8px;
            "
          >
            <div
              v-for="(qr, index) in filteredQuickReplies"
              :key="qr.id"
              class="quick-reply-item"
              :style="{
                padding: '12px',
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: index < filteredQuickReplies.length - 1 ? '4px' : '0',
                backgroundColor: index === activeQuickReplyIndex ? '#f1f5f9' : 'transparent',
                transition: 'background 0.2s',
              }"
              @click="insertQuickReply(qr.content)"
              @mouseover="activeQuickReplyIndex = index"
            >
              <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px">/{{ qr.title }}</div>
              <div
                style="
                  font-size: 12px;
                  color: #64748b;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{ qr.content }}
              </div>
            </div>
          </div>
          <button
            class="attachment-btn"
            style="
              background: #f1f5f9;
              border: none;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              font-size: 18px;
              cursor: pointer;
              color: #64748b;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
            "
            :disabled="!isActive || isUploading"
            @click="triggerFileUpload"
            title="Attach Image (Max size: 5MB. Supported: JPG, PNG, HEIC, WEBP)"
          >
            <span style="transform: rotate(45deg); display: inline-block">&#128206;</span>
          </button>
          <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileUpload" />
          <textarea
            v-model="newMessage"
            class="chat-input"
            rows="1"
            maxlength="200"
            :placeholder="
              isUploading
                ? 'Uploading image...'
                : isActive
                  ? 'Type a message... (Type / for quick replies)'
                  : 'Conversation resolved'
            "
            :disabled="!isActive || isUploading"
            @keydown="handleKeyDown"
            @input="handleInputChange"
          ></textarea>
          <span
            :style="{
              fontSize: '11px',
              color: newMessage.length >= 180 ? '#dc2626' : '#9ca3af',
              position: 'absolute',
              bottom: '6px',
              right: '70px',
              pointerEvents: 'none',
            }"
          >{{ newMessage.length }}/200</span>
          <button
            class="send-btn"
            :style="{ backgroundColor: bubbleColor }"
            :disabled="(!newMessage.trim() && !isUploading) || !isActive"
            @click="sendMessage"
          >
            {{ isUploading ? '...' : 'Send' }}
          </button>
        </div>
      </template>

      <!-- No conversation selected -->
      <div v-else class="empty-state">
        <div
          style="
            text-align: center;
            color: #94a3b8;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          "
        >
          <div style="font-size: 48px; opacity: 0.5">💬</div>
          <div style="font-size: 16px; font-weight: 500; color: #64748b">
            Select a conversation to start chatting
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox overlay -->
  <div
    v-if="selectedImage"
    style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
    "
    @click="closeImage"
  >
    <button
      style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
      "
    >
      &times;
    </button>
    <img
      :src="selectedImage"
      style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px"
      @click.stop
    />
  </div>
</template>

<style scoped>
.message-bubble.ai {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message-bubble.ai .message-meta {
  color: rgba(255, 255, 255, 0.7);
}

/* Markdown content in chat messages */
.md-content {
  line-height: 1.5;
  word-break: break-word;
}
.md-content :deep(p) {
  margin: 0 0 8px 0;
}
.md-content :deep(p:last-child) {
  margin-bottom: 0;
}
.md-content :deep(code) {
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
.md-content :deep(pre) {
  background: rgba(0, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 0.85em;
}
.md-content :deep(pre code) {
  background: none;
  padding: 0;
}
.md-content :deep(ul),
.md-content :deep(ol) {
  margin: 4px 0;
  padding-left: 20px;
}
.md-content :deep(li) {
  margin: 2px 0;
}
.md-content :deep(blockquote) {
  margin: 8px 0;
  padding: 4px 12px;
  border-left: 3px solid rgba(0, 0, 0, 0.2);
  opacity: 0.85;
}
.md-content :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}
.md-content :deep(h1),
.md-content :deep(h2),
.md-content :deep(h3),
.md-content :deep(h4),
.md-content :deep(h5),
.md-content :deep(h6) {
  margin: 8px 0 4px 0;
  font-weight: 600;
  line-height: 1.3;
}
.md-content :deep(h1) { font-size: 1.3em; }
.md-content :deep(h2) { font-size: 1.2em; }
.md-content :deep(h3) { font-size: 1.1em; }
.md-content :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 0.9em;
}
.md-content :deep(th),
.md-content :deep(td) {
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 4px 8px;
}
.md-content :deep(th) {
  background: rgba(0, 0, 0, 0.04);
  font-weight: 600;
}
.md-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  margin: 8px 0;
}
/* White links in AI bubbles */
.message-bubble.ai .md-content :deep(a) {
  color: #c7d2fe;
}
.message-bubble.ai .md-content :deep(code) {
  background: rgba(255, 255, 255, 0.15);
}
.message-bubble.ai .md-content :deep(pre) {
  background: rgba(255, 255, 255, 0.1);
}
.message-bubble.ai .md-content :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.4);
}
.message-bubble.ai .md-content :deep(th),
.message-bubble.ai .md-content :deep(td) {
  border-color: rgba(255, 255, 255, 0.25);
}
.message-bubble.ai .md-content :deep(th) {
  background: rgba(255, 255, 255, 0.1);
}
.message-bubble.ai .md-content :deep(hr) {
  border-top-color: rgba(255, 255, 255, 0.25);
}
</style>
