<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
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

const socket = ref<Socket | null>(null)
const conversations = ref<Conversation[]>([])
const activeConversationId = ref<string | null>(null)
const activeConversationData = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const activeTab = ref<'active' | 'resolved' | 'specialist'>('active')
const isTyping = ref(false)
const typingUser = ref('')
const showSettings = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const settingsSaved = ref(false)
const settingsError = ref('')
const showResolveConfirm = ref(false)
const showTransferConfirm = ref(false)
const transferTargetUsername = ref('')
const adminList = ref<{ username: string, displayName: string }[]>([])

async function loadAdminList() {
  try {
    const res = await fetch(`${props.serverUrl}/admin/users`, {
      credentials: "include",
    })
    if (res.ok) {
      adminList.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to load admin list', err)
  }
}
const isUploading = ref(false)
const isDragging = ref(false)
const dragCounter = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

const selectedImage = ref<string | null>(null)

function openImage(url: string) {
  selectedImage.value = url
}

function closeImage() {
  selectedImage.value = null
}

// Settings state
const bubbleColor = ref('#4F46E5')
const welcomeMessage = ref('Hello! How can we help you today?')
const offlineMessage = ref('We are currently offline. Please check back later.')
const bubbleSize = ref('medium')
const bubblePattern = ref('solid')
const websitePosition = ref('bottom-right')
const bubbleIconType = ref('emoji')
const bubbleIconEmoji = ref('💬')
const bubbleIconUrl = ref('')
const isUploadingIcon = ref(false)
const iconFileInput = ref<HTMLInputElement | null>(null)
const siteConfigId = ref<string | null>(null)
const enableReadReceipts = ref(true)
const isOfflineMode = ref(false)

const notificationSoundUrl = ref('')
const isUploadingSound = ref(false)
const soundFileInput = ref<HTMLInputElement | null>(null)
const isMuted = ref(localStorage.getItem('omnichat_admin_muted') === 'true')

function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('omnichat_admin_muted', isMuted.value ? 'true' : 'false')
}

// Audio player logic
const audioPlayer = new Audio()
function playSound() {
  if (isMuted.value) return
  
  if (notificationSoundUrl.value) {
    const src = notificationSoundUrl.value.startsWith('http') ? notificationSoundUrl.value : props.serverUrl + notificationSoundUrl.value
    if (audioPlayer.src !== src) {
      audioPlayer.src = src
    }
    audioPlayer.currentTime = 0
    audioPlayer.play().catch(e => console.warn('Audio autoplay blocked or failed:', e))
  } else {
    // Fallback synthesized pop sound
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

async function uploadCustomSound(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    isUploadingSound.value = true
    const formData = new FormData()
    formData.append('file', file) // already handled audio
    
    const res = await fetch(`${props.serverUrl}/upload`, {
      credentials: "include",
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    notificationSoundUrl.value = data.url
  } catch (err: any) {
    settingsError.value = err.message || 'Failed to upload sound'
    setTimeout(() => { settingsError.value = '' }, 5000)
  } finally {
    isUploadingSound.value = false
    if (soundFileInput.value) soundFileInput.value.value = ''
  }
}


// Quick Replies state
const settingsTab = ref<'widget' | 'quick-replies'>('widget')
const quickReplies = ref<QuickReply[]>([])
const showQuickReplyPopover = ref(false)
const editingQuickReplyId = ref<string | null>(null)
const qrDraftTitle = ref('')
const qrDraftContent = ref('')

const emit = defineEmits(['omnichat:logout'])

const searchQuery = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const showConversationDetails = ref(false)
const draftAssignedUsername = ref('')
const draftAgentRemarks = ref('')

const currentUserUsername = ref('')
const currentUserDisplayName = ref('')

const activeUnreadCount = computed(() => {
  return conversations.value
    .filter((c) => c.status === 'active')
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
    list = list.filter(c => {
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
    const q = (isUsernameSearch || isTicketSearch) ? rawQ.slice(1).toLowerCase() : rawQ.toLowerCase()

    list = list.filter(c => {
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
      
      return visitorLabel.includes(q) || 
             email.includes(q) || 
             assigned.includes(q) || 
             specialist.includes(q) ||
             remarks.includes(q) || 
             id.includes(q) || 
             ticketId.includes(q)
    })
  }
  return list
})

const isActive = computed(() => activeConversationData.value?.status === 'active' || activeConversationData.value?.status === 'specialist')

// ---------------------------------------------------------------------------
// Socket.io connection & event handlers
// ---------------------------------------------------------------------------
function connect() {
  const s = io(props.serverUrl, {
    auth: { token: props.token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  })

  s.on('connect', () => {
    console.log('[OmniChat Admin] Connected to server')
  })

  s.on('conversations_list', (data: { conversations: Conversation[]; currentUser?: { id: string, username: string, displayName: string, role: string } }) => {
    if (data.currentUser) {
      currentUserUsername.value = data.currentUser.username
      currentUserDisplayName.value = data.currentUser.displayName
    }
    
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
    // Don't play sound for AI-handled conversations
    if (data.conversation.status !== 'ai') playSound();
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
    // Play sound for visitor messages, but not in AI-handled conversations
    const msgConv = conversations.value.find((c) => c.id === data.message.conversationId)
    if (data.message.senderType === 'visitor' && msgConv?.status !== 'ai') playSound();
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
        // Just note that backend now sends resolvedBy which is the displayName
        // but the DB has resolvedByUsername. We rely on conversation_updated for full sync.
      }
      if (activeConversationData.value?.id === data.conversationId) {
        activeConversationData.value.status = 'resolved'
      }
    },
  )

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
    
    // If it was transferred TO the current user, play a sound
    if (data.specialistUsername === currentUserUsername.value) {
      playSound()
    }
  })

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

        canvas.toBlob((blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
            resolve(new File([blob], newName, { type: mimeType }))
          } else {
            reject(new Error('Canvas to Blob failed'))
          }
        }, mimeType, quality)
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
    const isHeicFile = fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
                       file.type === 'image/heic' || file.type === 'image/heif' ||
                       file.type === 'image/heic-sequence' || file.type === 'image/heif-sequence'
    
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      isHeicFile
    })
    
    // Only compress non-HEIC images in the browser
    // HEIC files will be converted on the backend
    if (isHeicFile) {
      console.log('HEIC file detected - will be converted on backend')
    } else if (file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      file = await compressImage(file, 1200, 0.8)
    } else {
      throw new Error(`Unsupported format: ${file.type}`)
    }
  } catch (err) {
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
    const res = await fetch(`${props.serverUrl}/upload`, {
      credentials: "include",
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload failed')
    }

    const data = await res.json()

    // Send message as image
    socket.value?.emit('send_message', {
      conversationId: activeConversationId.value,
      content: '', // Optional caption if we want
      messageType: 'image',
      attachmentUrl: `${props.serverUrl}${data.url}`,
      attachmentThumbnailUrl: `${props.serverUrl}${data.thumbnailUrl || data.url}`,
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
    targetUsername: transferTargetUsername.value
  })

  showTransferConfirm.value = false
  transferTargetUsername.value = ''
  
  // Automatically switch tab if current user is transferring away from themselves
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

async function loadSettings() {
  try {
    const res = await fetch(`${props.serverUrl}/config/active`, {
      credentials: "include",
    })
    if (res.ok) {
      const config = await res.json()
      if (config) {
        siteConfigId.value = config.id
        bubbleColor.value = config.bubbleColor || '#4F46E5'
        welcomeMessage.value = config.welcomeMessage || 'Hello! How can we help you today?'
        offlineMessage.value = config.offlineMessage || 'We are currently offline. Please check back later.'
        bubbleSize.value = config.bubbleSize || 'medium'
        bubblePattern.value = config.bubblePattern || 'solid'
        websitePosition.value = config.websitePosition || 'bottom-right'
        if (config.bubbleIcon && (config.bubbleIcon.startsWith('/') || config.bubbleIcon.startsWith('http'))) {
          bubbleIconType.value = 'custom'
          bubbleIconUrl.value = config.bubbleIcon
        } else {
          bubbleIconType.value = 'emoji'
          bubbleIconEmoji.value = config.bubbleIcon || '💬'
        }
        if (config.notificationSoundUrl) notificationSoundUrl.value = config.notificationSoundUrl
        if (config.enableReadReceipts !== undefined) {
          enableReadReceipts.value = config.enableReadReceipts
        }
        if (config.isOfflineMode !== undefined) {
          isOfflineMode.value = config.isOfflineMode
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
      credentials: "include",
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
      credentials: "include",
      method,
      headers: {
        'Content-Type': 'application/json',
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
      credentials: "include",
      method: 'DELETE',
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



async function uploadCustomIcon(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    isUploadingIcon.value = true
    
    // Convert to webp if it's not already using the backend or frontend logic.
    // The backend expects webp. We might need to send it as webp or let backend handle it.
    // Wait, backend explicitly checks for webp mimetype in fileFilter.
    // We should convert to webp here, OR remove the restriction in the backend, 
    // BUT the backend says "Only WebP images are allowed!". Let's see if there's an existing heic/png converter.
    // The codebase has `heic2any` in package.json.
    
    const formData = new FormData()
    
    // Create a canvas to convert to webp
    const img = new Image()
    img.src = URL.createObjectURL(file)
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0)
    
    const webpBlob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/webp', 0.9)
    })
    
    if (!webpBlob) throw new Error('Failed to convert image to WebP')
    
    formData.append('file', webpBlob, 'icon.webp')
    
    const res = await fetch(`${props.serverUrl}/upload`, {
      credentials: "include",
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    bubbleIconUrl.value = data.url
  } catch (err: any) {
    settingsError.value = err.message || 'Failed to upload icon'
    setTimeout(() => { settingsError.value = '' }, 5000)
  } finally {
    isUploadingIcon.value = false
    if (iconFileInput.value) iconFileInput.value.value = ''
  }
}

async function saveSettings() {
  settingsSaved.value = false
  settingsError.value = ''

  try {
    let res: Response

    if (siteConfigId.value) {
      res = await fetch(`${props.serverUrl}/config/${siteConfigId.value}`, {
      credentials: "include",
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
},
        body: JSON.stringify({
          bubbleColor: bubbleColor.value,
          welcomeMessage: welcomeMessage.value,
          offlineMessage: offlineMessage.value,
          bubbleSize: bubbleSize.value,
          bubblePattern: bubblePattern.value,
          websitePosition: websitePosition.value,
          bubbleIcon: bubbleIconType.value === 'custom' ? bubbleIconUrl.value : bubbleIconEmoji.value,
          enableReadReceipts: enableReadReceipts.value,
          isOfflineMode: isOfflineMode.value,
          notificationSoundUrl: notificationSoundUrl.value,
        }),
      })
    } else {
      res = await fetch(`${props.serverUrl}/config`, {
      credentials: "include",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
},
        body: JSON.stringify({
          siteName: 'default',
          bubbleColor: bubbleColor.value,
          welcomeMessage: welcomeMessage.value,
          bubbleSize: bubbleSize.value,
          bubblePattern: bubblePattern.value,
          websitePosition: websitePosition.value,
          bubbleIcon: bubbleIconType.value === 'custom' ? bubbleIconUrl.value : bubbleIconEmoji.value,
          allowedOrigins: '*',
          enableReadReceipts: enableReadReceipts.value,
          isOfflineMode: isOfflineMode.value,
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
      credentials: "include",
      method: 'POST',
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
  loadAdminList()
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
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>OmniChat</span>
            <span v-if="isOfflineMode" style="background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase;">Offline Mode</span>
            <span v-else style="background-color: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase;">Online</span>
          </div>
          <span v-if="currentUserUsername" style="font-size: 11px; color: #6b7280; margin-top: 2px;">
            {{ currentUserDisplayName }} (@{{ currentUserUsername }})
          </span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button
            style="background: none; border: none; cursor: pointer; font-size: 18px; color: #6b7280;"
            :title="isMuted ? 'Unmute Notifications' : 'Mute Notifications'"
            @click="toggleMute"
          >
            {{ isMuted ? '🔕' : '🔔' }}
          </button>
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

      <!-- Active / Resolved / Specialist tabs -->
      <div class="sidebar-tabs">
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'active' }"
          :style="activeTab === 'active' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'active'"
        >
          Active
          <span v-if="activeUnreadCount > 0" style="background-color: #ef4444; color: white; border-radius: 9999px; padding: 0 6px; font-size: 10px; font-weight: bold; line-height: 16px; margin-left: 4px;">
            {{ activeUnreadCount }}
          </span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'specialist' }"
          :style="activeTab === 'specialist' ? { borderBottomColor: bubbleColor, color: bubbleColor } : {}"
          @click="activeTab = 'specialist'"
        >
          Specialist
          <span v-if="specialistUnreadCount > 0" style="background-color: #ef4444; color: white; border-radius: 9999px; padding: 0 6px; font-size: 10px; font-weight: bold; line-height: 16px; margin-left: 4px;">
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
      <div style="padding: 10px; border-bottom: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 8px;">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search name, email, username, ID..." 
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px;"
        />
        <div v-if="activeTab === 'resolved'" style="display: flex; gap: 8px; align-items: center;">
          <input 
            v-model="filterStartDate" 
            type="date" 
            style="flex: 1; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; color: #4b5563;"
            title="Start Date"
          />
          <span style="color: #9ca3af; font-size: 12px;">to</span>
          <input 
            v-model="filterEndDate" 
            type="date" 
            style="flex: 1; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; color: #4b5563;"
            title="End Date"
          />
        </div>
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
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="color: #1e293b; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: bottom;">{{ getVisitorLabel(conv) }}</span>
              <span style="font-size: 12px; color: #94a3b8; font-weight: normal;">#{{ formatTicketId(conv.id) }}</span>
              <span v-if="conv.unreadCount && conv.unreadCount > 0" style="background-color: #ef4444; color: white; border-radius: 9999px; padding: 2px 6px; font-size: 10px; font-weight: bold; line-height: 1;">
                {{ conv.unreadCount }}
              </span>
            </div>
            <span v-if="conv.agentRemarks" style="color: #f59e0b; font-size: 12px;" title="Has remarks">📝</span>
          </div>
          <div style="display: flex; gap: 6px; margin-bottom: 8px;">
            <div v-if="conv.assignedUsername" style="font-size: 11px; color: #4338ca; background: #e0e7ff; display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 12px; font-weight: 500;">
              @{{ conv.assignedUsername }}
            </div>
            <div v-if="conv.specialistUsername" style="font-size: 11px; color: #059669; background: #d1fae5; display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 12px; font-weight: 500;" title="Specialist">
              👨‍⚕️ @{{ conv.specialistUsername }}
            </div>
          </div>
          <div style="font-size: 13px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.4;">
            {{ getLastMessage(conv) }}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
            {{ formatTime(conv.updatedAt) }}
          </div>
        </div>

        <div v-if="filteredConversations.length === 0" class="empty-state" style="padding: 40px 16px;">
          No {{ activeTab }} conversations
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="chat-window" style="flex: 1 1 auto !important; display: flex !important; flex-direction: column !important; min-width: 0 !important; height: 100% !important; overflow: hidden !important; position: relative;" @dragenter="onPanelDragEnter" @dragover="onPanelDragOver" @dragleave="onPanelDragLeave" @drop="onPanelDrop">
      <template v-if="activeConversationData">
        <!-- Chat header -->
        <div class="chat-header" style="flex: 0 0 auto !important;">
          <div>
            <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px;">
              <span style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: bottom;">{{ getVisitorLabel(activeConversationData) }}</span>
              <span style="font-size: 13px; color: #6b7280; font-weight: normal;">
                #{{ formatTicketId(activeConversationData.id) }}
              </span>
              <span v-if="activeConversationData.assignedUsername" style="background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-size: 11px;" title="Customer username">
                @{{ activeConversationData.assignedUsername }}
              </span>
              <span v-if="activeConversationData.specialistUsername" style="background: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-size: 11px;" title="Specialist handler">
                👨‍⚕️ @{{ activeConversationData.specialistUsername }}
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
              <template v-if="showTransferConfirm">
                <select v-model="transferTargetUsername" style="border: 1px solid #d1d5db; border-radius: 6px; padding: 6px; font-size: 13px;">
                  <option value="">Select Specialist</option>
                  <option v-for="admin in adminList" :key="admin.username" :value="admin.username">
                    {{ admin.displayName }} (@{{ admin.username }})
                  </option>
                </select>
                <button
                  style="background: #4f46e5; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px;"
                  :disabled="!transferTargetUsername"
                  @click="executeTransferConversation"
                >
                  Transfer
                </button>
                <button
                  style="background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px;"
                  @click="cancelTransferConversation"
                >
                  Cancel
                </button>
              </template>
              <template v-else-if="showResolveConfirm">
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
                  class="transfer-btn"
                  style="background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px; color: #4b5563;"
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
        <div
          v-if="isDragging"
          class="drag-overlay"
        >
          <div class="drag-overlay-content">
            <span style="font-size: 40px; margin-bottom: 12px; display: block; text-align: center;">📥</span>
            <span>Drop file to upload</span>
          </div>
        </div>

        <!-- Conversation Details Panel -->
        <transition name="slide-down">
          <div v-if="showConversationDetails" class="conversation-details-panel">
            <div class="details-grid">
              <div class="details-col flex-2" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <label class="details-label" title="The visitor's username on your external website">Customer Username</label>
                  <div class="details-input-wrap">
                    <span class="input-icon">@</span>
                    <input v-model="draftAssignedUsername" type="text" placeholder="user123" class="details-input with-icon" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; flex: 1;">
                  <label class="details-label">Internal Remarks</label>
                  <textarea v-model="draftAgentRemarks" placeholder="Add notes for other agents..." rows="2" class="details-input resize-y" style="flex: 1;"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-start; margin-top: auto;">
                  <button @click="saveConversationDetails" class="save-details-btn">Save Changes</button>
                </div>
              </div>
              
              <div class="details-col border-left">
                <label class="details-label">Visitor Info</label>
                <div class="info-list">
                  <div class="info-row"><span class="info-key">IP</span> <span class="info-val">{{ activeConversationData.visitorIp || 'Unknown' }}</span></div>
                  <div class="info-row"><span class="info-key">Browser</span> <span class="info-val">{{ activeConversationData.visitorBrowser || 'Unknown' }}</span></div>
                  <div class="info-row"><span class="info-key">OS</span> <span class="info-val">{{ activeConversationData.visitorOs || 'Unknown' }}</span></div>
                  <div class="info-row"><span class="info-key">Device</span> <span class="info-val capitalize">{{ activeConversationData.visitorDevice || 'Desktop' }}</span></div>
                  <div class="info-row"><span class="info-key">Screen</span> <span class="info-val">{{ activeConversationData.visitorScreenRes || 'Unknown' }}</span></div>
                </div>
              </div>
              
              <div class="details-col border-left">
                <label class="details-label">Session Context</label>
                <div class="info-list">
                  <div class="info-row">
                    <span class="info-key">URL</span> 
                    <a :href="activeConversationData.visitorCurrentUrl" target="_blank" class="info-link" :title="activeConversationData.visitorCurrentUrl">{{ activeConversationData.visitorCurrentUrl || 'Unknown' }}</a>
                  </div>
                  <div class="info-row">
                    <span class="info-key">Referrer</span> 
                    <a v-if="activeConversationData.visitorReferrer" :href="activeConversationData.visitorReferrer" target="_blank" class="info-link" :title="activeConversationData.visitorReferrer">{{ activeConversationData.visitorReferrer }}</a><span v-else class="info-val">Direct / None</span>
                  </div>
                  <div class="info-row"><span class="info-key">Timezone</span> <span class="info-val">{{ activeConversationData.visitorTimezone || 'Unknown' }}</span></div>
                  <div class="info-row"><span class="info-key">Language</span> <span class="info-val">{{ activeConversationData.visitorLanguage || 'Unknown' }}</span></div>
                  <template v-if="activeConversationData.status === 'resolved'">
                    <div class="info-row"><span class="info-key">Resolved By</span> <span class="info-val">@{{ activeConversationData.resolvedByUsername || 'Unknown' }}</span></div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Messages -->
        <div ref="messagesContainer" class="messages-container" style="flex: 1 1 auto !important; min-height: 0 !important; overflow-y: auto !important; overflow-x: hidden !important;">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-bubble', msg.senderType]"
            :style="msg.senderType === 'agent' ? { backgroundColor: bubbleColor, padding: msg.messageType === 'image' ? '4px' : '' } : { padding: msg.messageType === 'image' ? '4px' : '' }"
          >
            <template v-if="msg.messageType === 'image'">
              <img 
                :src="msg.attachmentThumbnailUrl || msg.attachmentUrl" 
                alt="Attachment" 
                style="max-width: 100%; max-height: 150px; border-radius: 8px; display: block; cursor: pointer; object-fit: cover;" 
                @click="openImage(msg.attachmentUrl || '')" 
              />
              <div v-if="msg.content" style="padding: 8px;">{{ msg.content }}</div>
            </template>
            <template v-else>
              <div>{{ msg.content }}</div>
            </template>
            <div class="message-meta" :style="{ padding: msg.messageType === 'image' ? '0 8px 8px 8px' : '' }">
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
      <div v-if="isTyping" class="typing-indicator" style="padding-bottom: 12px;">
        <span>{{ typingUser }} is typing</span>
      </div>

        <div class="chat-input-area" style="flex: 0 0 auto !important; min-height: 80px !important; position: relative;">
          <div v-if="showQuickReplyPopover && filteredQuickReplies.length > 0" class="quick-reply-popover" style="position: absolute; bottom: 100%; left: 24px; width: 320px; max-height: 250px; overflow-y: auto; background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08); z-index: 20; margin-bottom: 12px; padding: 8px;">
            <div
              v-for="(qr, index) in filteredQuickReplies"
              :key="qr.id"
              class="quick-reply-item"
              :style="{ padding: '12px', cursor: 'pointer', borderRadius: '8px', marginBottom: index < filteredQuickReplies.length - 1 ? '4px' : '0', backgroundColor: index === activeQuickReplyIndex ? '#f1f5f9' : 'transparent', transition: 'background 0.2s' }"
              @click="insertQuickReply(qr.content)"
              @mouseover="activeQuickReplyIndex = index"
            >
              <div style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">/{{ qr.title }}</div>
              <div style="font-size: 12px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ qr.content }}</div>
            </div>
          </div>
          <button
            class="attachment-btn"
            style="background: #f1f5f9; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 18px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"
            :disabled="!isActive || isUploading"
            @click="triggerFileUpload"
            title="Attach Image (Max size: 5MB. Supported: JPG, PNG, HEIC, WEBP)"
          >
            <span style="transform: rotate(45deg); display: inline-block;">&#128206;</span>
          </button>
          <input
            type="file"
            ref="fileInput"
            style="display: none;"
            accept="image/*"
            @change="handleFileUpload"
          />
          <textarea
            v-model="newMessage"
            class="chat-input"
            rows="1"
            :placeholder="isUploading ? 'Uploading image...' : (isActive ? 'Type a message... (Type / for quick replies)' : 'Conversation resolved')"
            :disabled="!isActive || isUploading"
            @keydown="handleKeyDown"
            @input="handleInputChange"
          ></textarea>
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
        <div style="text-align: center; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="font-size: 48px; opacity: 0.5;">💬</div>
          <div style="font-size: 16px; font-weight: 500; color: #64748b;">Select a conversation to start chatting</div>
        </div>
      </div>
    </div>

    <!-- Settings Drawer -->
    <!-- Settings Overlay (moved outside drawer) -->
    <transition name="fade">
      <div v-if="showSettings" class="settings-overlay" @click="showSettings = false" />
    </transition>
    
    <!-- Settings Drawer -->
    <transition name="slide-right">
      <div v-if="showSettings" class="settings-drawer fancy-drawer">
        <div class="drawer-header">
          <div class="drawer-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5; margin-right: 8px;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Workspace Settings
          </div>
          <button class="drawer-close-btn" @click="showSettings = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="drawer-tabs">
          <button
            class="drawer-tab"
            :class="{ active: settingsTab === 'widget' }"
            @click="settingsTab = 'widget'"
          >
            Widget Setup
          </button>
          <button
            class="drawer-tab"
            :class="{ active: settingsTab === 'quick-replies' }"
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
            <label class="settings-label">Offline Message</label>
            <textarea
              v-model="offlineMessage"
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
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <label style="display: flex; align-items: center; gap: 4px; font-size: 13px; color: #374151;">
                <input type="radio" v-model="bubbleIconType" value="emoji" /> Emoji
              </label>
              <label style="display: flex; align-items: center; gap: 4px; font-size: 13px; color: #374151;">
                <input type="radio" v-model="bubbleIconType" value="custom" /> Custom Image
              </label>
            </div>
            
            <select v-if="bubbleIconType === 'emoji'" v-model="bubbleIconEmoji" class="settings-input">
              <option value="💬">💬 Chat</option>
              <option value="✉️">✉️ Envelope</option>
              <option value="👋">👋 Wave</option>
              <option value="❓">❓ Question</option>
              <option value="🎧">🎧 Headset</option>
            </select>
            
            <div v-if="bubbleIconType === 'custom'" style="display: flex; flex-direction: column; gap: 8px;">
              <div v-if="bubbleIconUrl" style="display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
                <img :src="props.serverUrl + bubbleIconUrl" alt="Custom Icon" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px;" />
                <button @click="bubbleIconUrl = ''" class="settings-btn" style="padding: 4px 8px; font-size: 12px;">Remove</button>
              </div>
              <div v-else>
                <input type="file" ref="iconFileInput" accept="image/*" style="display: none" @change="uploadCustomIcon" />
                <button @click="iconFileInput?.click()" class="settings-btn" :disabled="isUploadingIcon" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;">
                  <span v-if="isUploadingIcon" class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px;"></span>
                  {{ isUploadingIcon ? 'Uploading...' : 'Upload Image' }}
                </button>
                <p style="font-size: 11px; color: #6b7280; margin-top: 4px;">Square image recommended (PNG, JPG, WebP)</p>
              </div>
            </div>
          </div>

          <div class="settings-field" style="display: flex; align-items: center; gap: 8px;">
            <input
              id="enableReadReceipts"
              type="checkbox"
              v-model="enableReadReceipts"
            />
            <label for="enableReadReceipts" class="settings-label" style="margin-bottom: 0;">Enable Read Receipts</label>
          </div>

          <div class="settings-field" style="display: flex; align-items: center; gap: 8px;">
            <input
              id="isOfflineMode"
              type="checkbox"
              v-model="isOfflineMode"
            />
            <label for="isOfflineMode" class="settings-label" style="margin-bottom: 0;">Offline Mode (Disable Chat)</label>
          </div>

          <div class="settings-field">
            <label class="settings-label">Notification Sound</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div v-if="notificationSoundUrl" style="display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
                <span style="font-size: 13px; color: #374151; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  Custom Sound Uploaded
                </span>
                <button @click="playSound" class="settings-btn" style="padding: 4px 8px; font-size: 12px;">Play</button>
                <button @click="notificationSoundUrl = ''" class="settings-btn" style="padding: 4px 8px; font-size: 12px;">Remove</button>
              </div>
              <div v-else>
                <input type="file" ref="soundFileInput" accept="audio/*" style="display: none" @change="uploadCustomSound" />
                <button @click="soundFileInput?.click()" class="settings-btn" :disabled="isUploadingSound" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;">
                  <span v-if="isUploadingSound" class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px;"></span>
                  {{ isUploadingSound ? 'Uploading...' : 'Upload Audio (.mp3, .wav)' }}
                </button>
              </div>
            </div>
          </div>


          <button
            class="send-btn"
            style="width: 100%; margin-top: 12px;"
            :style="{ backgroundColor: bubbleColor }"
            @click="saveSettings"
          >
            Save Settings
          </button>

          <div v-if="settingsSaved" style="background-color: #10b981; color: white; padding: 8px 12px; border-radius: 4px; font-size: 13px; margin-top: 8px; text-align: center; font-weight: 500;">
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
    </transition>
  </div>

  <!-- Lightbox overlay -->
  <div v-if="selectedImage" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2147483647; display: flex; align-items: center; justify-content: center;" @click="closeImage">
    <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 32px; cursor: pointer;">&times;</button>
    <img :src="selectedImage" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px;" @click.stop />
  </div>
</template>
