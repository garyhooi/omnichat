<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { io, Socket } from 'socket.io-client'
import { renderMarkdown } from '../utils/markdown'
import { fetchTranslation, getDefaultLang, TRANSLATE_LANGS } from '../utils/translationCache'
import { appVersion } from '../version'

const WIDGET_MARGIN = 12
const PANEL_MIN_WIDTH = 340
const PANEL_MIN_HEIGHT = 380
const PANEL_MAX_WIDTH_RATIO = 0.9
const PANEL_MAX_HEIGHT_RATIO = 0.9
const DEFAULT_PANEL_WIDTH = 480
const DEFAULT_PANEL_HEIGHT = 560
const DESKTOP_PANEL_GAP = 16

// ---------------------------------------------------------------------------
// Props
// Usage: <omnichat-admin-widget server-url="https://api.yoursite.com" token="jwt-token"></omnichat-admin-widget>
// ---------------------------------------------------------------------------
const props = defineProps({
  serverUrl: { type: String, required: true },
  token: { type: String, required: true },
})

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

interface Conversation {
  id: string
  visitorId: string
  status: string
  agentId?: string
  metadata?: string
  createdAt: string
  updatedAt: string
  messages?: Message[]
  rating?: number
  review?: string
  assignedUsername?: string
  specialistUsername?: string
  resolvedByUsername?: string
  visitorCurrentUrl?: string
  _count?: { messages: number }
  unreadCount?: number
}

// ---------------------------------------------------------------------------
// Auth headers helper
// ---------------------------------------------------------------------------
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { ...extra }
  if (props.token && props.token !== 'cookie-auth') {
    h['Authorization'] = `Bearer ${props.token}`
  }
  return h
}

// ---------------------------------------------------------------------------
// Viewport & position state
// ---------------------------------------------------------------------------
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const viewportHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 720)
const widgetPosition = ref({ x: 20, y: 20 })

let dragPointerId: number | null = null
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0
let dragMoved = false
let dragSuppressClickUntil = 0

// ---------------------------------------------------------------------------
// Panel size / resize state
// ---------------------------------------------------------------------------
const panelWidth = ref(DEFAULT_PANEL_WIDTH)
const panelHeight = ref(DEFAULT_PANEL_HEIGHT)
const isResizing = ref(false)
let resizePointerId: number | null = null
let resizeStartX = 0
let resizeStartY = 0
let resizeStartWidth = 0
let resizeStartHeight = 0

// Panel free-positioning anchor (used when panel is open and dragged via header)
const panelAnchorX = ref(0)
const panelAnchorY = ref(0)

// ---------------------------------------------------------------------------
// Widget config state (from server /config/active)
// ---------------------------------------------------------------------------
const siteBubbleColor = ref('')
const siteBubbleSize = ref('medium')
const siteBubblePattern = ref('solid')
const siteBubbleIcon = ref('💬')
const notificationSoundUrl = ref('')
const isMuted = ref(localStorage.getItem('omnichat_admin_widget_muted') === 'true')

// ---------------------------------------------------------------------------
// Socket & data state
// ---------------------------------------------------------------------------
const socket = ref<Socket | null>(null)
const isOpen = ref(false)
const conversations = ref<Conversation[]>([])
const activeConversationId = ref<string | null>(null)
const activeConversationData = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const activeTab = ref<'active' | 'specialist'>('active')
const isTyping = ref(false)
const typingUser = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const currentUserUsername = ref('')
const showResolveConfirm = ref(false)
const selectedImage = ref<string | null>(null)

// Details state
const showConversationDetails = ref(false)
const draftAssignedUsername = ref('')
const draftAgentRemarks = ref('')

// Transfer state
const showTransferConfirm = ref(false)
const transferTargetUsername = ref('')
const adminList = ref<{ username: string; displayName: string }[]>([])

// Translation state
const translateLang = ref(getDefaultLang('omnichat_admin_widget_translate_lang'))
const showLangPopover = ref(false)
const translatingMessageIds = ref<Set<string>>(new Set())
const translatedMessages = ref<Record<string, string>>({})
const isTranslationEnabled = ref(true)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const bubbleDiameter = computed(() => {
  if (siteBubbleSize.value === 'small') return 48
  if (siteBubbleSize.value === 'large') return 64
  return 56
})

const currentBubbleColor = computed(() => siteBubbleColor.value || '#4F46E5')

const dynamicBubbleStyle = computed(() => {
  let bg = currentBubbleColor.value
  const size = `${bubbleDiameter.value}px`
  let fontSize = '24px'

  if (siteBubblePattern.value === 'gradient') {
    bg = `linear-gradient(135deg, ${currentBubbleColor.value}, #ffffff)`
  } else if (siteBubblePattern.value === 'stripes') {
    bg = `repeating-linear-gradient(45deg, ${currentBubbleColor.value}, ${currentBubbleColor.value} 10px, #ffffff 10px, #ffffff 20px)`
  } else if (siteBubblePattern.value === 'dots') {
    bg = `radial-gradient(#ffffff 2px, transparent 2px), radial-gradient(#ffffff 2px, transparent 2px)`
  }

  if (siteBubbleSize.value === 'small') {
    fontSize = '20px'
  } else if (siteBubbleSize.value === 'large') {
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

const bubbleWrapperStyle = computed(() => ({
  left: `${widgetPosition.value.x}px`,
  top: `${widgetPosition.value.y}px`,
}))

const widgetPositionStorageKey = computed(
  () => `omnichat_admin_widget_position_${encodeURIComponent(props.serverUrl)}`,
)

const panelAnchorStorageKey = computed(
  () => `omnichat_admin_widget_panel_anchor_${encodeURIComponent(props.serverUrl)}`,
)

const unreadCount = computed(() => {
  return conversations.value
    .filter((c) => c.status === 'active' || c.status === 'specialist')
    .reduce((sum, c) => sum + (c.unreadCount || 0), 0)
})

const filteredConversations = computed(() => {
  return conversations.value.filter((c) => {
    if (activeTab.value === 'specialist') {
      return c.status === 'specialist' && c.specialistUsername === currentUserUsername.value
    }
    return c.status === 'active'
  })
})

const isActive = computed(
  () => activeConversationData.value?.status === 'active' || activeConversationData.value?.status === 'specialist',
)

const maxPanelWidth = computed(() => Math.floor(viewportWidth.value * PANEL_MAX_WIDTH_RATIO))
const maxPanelHeight = computed(() => Math.floor(viewportHeight.value * PANEL_MAX_HEIGHT_RATIO))

const dynamicPanelStyle = computed(() => {
  const w = clamp(panelWidth.value, PANEL_MIN_WIDTH, maxPanelWidth.value)
  const h = clamp(panelHeight.value, PANEL_MIN_HEIGHT, maxPanelHeight.value)

  if (isOpen.value) {
    // When panel is open, position directly from anchor — the user can place
    // it anywhere on screen without being coupled to the bubble position.
    const maxLeft = Math.max(0, viewportWidth.value - w)
    const maxTop = Math.max(0, viewportHeight.value - h)
    return {
      left: `${clamp(panelAnchorX.value, 0, maxLeft)}px`,
      top: `${clamp(panelAnchorY.value, 0, maxTop)}px`,
      width: `${w}px`,
      height: `${h}px`,
    }
  }

  // Panel closed: position relative to bubble (used to pre-calc the anchor
  // before panel opens, or for sizing pre-computation)
  const preferredLeft = widgetPosition.value.x + bubbleDiameter.value - w
  const maxLeft = Math.max(WIDGET_MARGIN, viewportWidth.value - w - WIDGET_MARGIN)
  let top = widgetPosition.value.y - h - DESKTOP_PANEL_GAP

  if (top < WIDGET_MARGIN) {
    top = widgetPosition.value.y + bubbleDiameter.value + DESKTOP_PANEL_GAP
  }

  return {
    left: `${clamp(preferredLeft, WIDGET_MARGIN, maxLeft)}px`,
    top: `${clamp(top, WIDGET_MARGIN, Math.max(WIDGET_MARGIN, viewportHeight.value - h - WIDGET_MARGIN))}px`,
    width: `${w}px`,
    height: `${h}px`,
  }
})

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const datePart = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  return `${datePart} ${time}`
}

function formatTicketId(id: string | null): string {
  if (!id) return ''
  return id.slice(-8).toUpperCase()
}

function getVisitorLabel(c: Conversation): string {
  try {
    if (c.metadata) {
      const m = JSON.parse(c.metadata)
      return m.visitorName || 'Visitor'
    }
  } catch (e) { /* noop */ }
  return c.visitorId?.slice(-6) || 'Visitor'
}

function getVisitorEmail(c: Conversation): string | null {
  try {
    if (c.metadata) {
      const m = JSON.parse(c.metadata)
      return m.visitorEmail || null
    }
  } catch (e) { /* noop */ }
  return null
}

function formatWidgetPosition(x: number, y: number) {
  return `xy:${Math.round(x)},${Math.round(y)}`
}

function parseWidgetPosition(value?: string | null) {
  if (!value?.startsWith('xy:')) return null
  const [xRaw, yRaw] = value.slice(3).split(',')
  const x = Number.parseInt(xRaw ?? '', 10)
  const y = Number.parseInt(yRaw ?? '', 10)
  if (Number.isNaN(x) || Number.isNaN(y)) return null
  return { x, y }
}

function clampWidgetPosition(position: { x: number; y: number }) {
  const maxX = Math.max(WIDGET_MARGIN, viewportWidth.value - bubbleDiameter.value - WIDGET_MARGIN)
  const maxY = Math.max(WIDGET_MARGIN, viewportHeight.value - bubbleDiameter.value - WIDGET_MARGIN)
  return {
    x: clamp(Math.round(position.x), WIDGET_MARGIN, maxX),
    y: clamp(Math.round(position.y), WIDGET_MARGIN, maxY),
  }
}

function setWidgetPosition(position: { x: number; y: number }, persist = false) {
  widgetPosition.value = clampWidgetPosition(position)
  if (persist) {
    localStorage.setItem(
      widgetPositionStorageKey.value,
      formatWidgetPosition(widgetPosition.value.x, widgetPosition.value.y),
    )
  }
}

function initializeWidgetPosition() {
  const saved = parseWidgetPosition(localStorage.getItem(widgetPositionStorageKey.value))
  if (saved) {
    setWidgetPosition(saved)
  } else {
    setWidgetPosition({
      x: viewportWidth.value - bubbleDiameter.value - 20,
      y: viewportHeight.value - bubbleDiameter.value - 80,
    })
  }

  // Restore last panel anchor position so the panel opens where it was dragged
  const savedPanel = parseWidgetPosition(localStorage.getItem(panelAnchorStorageKey.value))
  if (savedPanel) {
    panelAnchorX.value = savedPanel.x
    panelAnchorY.value = savedPanel.y
  }
}

function refreshViewport() {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------
const audioPlayer = new Audio()
function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('omnichat_admin_widget_muted', isMuted.value ? 'true' : 'false')
}

function playSound() {
  if (isMuted.value) return

  if (notificationSoundUrl.value) {
    const src = notificationSoundUrl.value.startsWith('http')
      ? notificationSoundUrl.value
      : props.serverUrl + notificationSoundUrl.value
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
// Drag handlers
// ---------------------------------------------------------------------------
function startWidgetDrag(event: PointerEvent) {
  if (event.button !== 0 && event.pointerType !== 'touch') return

  const interactiveTarget = (event.target as HTMLElement | null)?.closest('button, input, textarea, select, a')
  if (interactiveTarget && interactiveTarget !== event.currentTarget) return

  widgetDragState.isDragging = true
  dragPointerId = event.pointerId
  dragStartX = event.clientX
  dragStartY = event.clientY

  if (isOpen.value) {
    // Dragging panel via header — track panel anchor directly
    dragOriginX = panelAnchorX.value
    dragOriginY = panelAnchorY.value
  } else {
    // Dragging bubble
    dragOriginX = widgetPosition.value.x
    dragOriginY = widgetPosition.value.y
  }
  dragMoved = false

  window.addEventListener('pointermove', onWidgetDragMove)
  window.addEventListener('pointerup', stopWidgetDrag)
  window.addEventListener('pointercancel', stopWidgetDrag)

  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  event.preventDefault()
}

function onWidgetDragMove(event: PointerEvent) {
  if (!widgetDragState.isDragging || dragPointerId !== event.pointerId) return
  const deltaX = event.clientX - dragStartX
  const deltaY = event.clientY - dragStartY
  if (!dragMoved && Math.hypot(deltaX, deltaY) > 4) {
    dragMoved = true
  }

  if (isOpen.value) {
    panelAnchorX.value = dragOriginX + deltaX
    panelAnchorY.value = dragOriginY + deltaY
  } else {
    setWidgetPosition({ x: dragOriginX + deltaX, y: dragOriginY + deltaY })
  }
}

function stopWidgetDrag(event: PointerEvent) {
  if (dragPointerId !== null && dragPointerId !== event.pointerId) return
  window.removeEventListener('pointermove', onWidgetDragMove)
  window.removeEventListener('pointerup', stopWidgetDrag)
  window.removeEventListener('pointercancel', stopWidgetDrag)
  widgetDragState.isDragging = false
  dragPointerId = null
  if (dragMoved) {
    dragSuppressClickUntil = performance.now() + 250
    if (isOpen.value) {
      // Persist panel anchor position so reopening restores it
      localStorage.setItem(
        panelAnchorStorageKey.value,
        formatWidgetPosition(panelAnchorX.value, panelAnchorY.value),
      )
    } else {
      setWidgetPosition(widgetPosition.value, true)
    }
  }
}

const widgetDragState = reactive({ isDragging: false })

// ---------------------------------------------------------------------------
// Resize handlers
// ---------------------------------------------------------------------------
function startResize(event: PointerEvent) {
  isResizing.value = true
  resizePointerId = event.pointerId
  resizeStartX = event.clientX
  resizeStartY = event.clientY
  resizeStartWidth = panelWidth.value
  resizeStartHeight = panelHeight.value

  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', stopResize)
  window.addEventListener('pointercancel', stopResize)

  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  event.preventDefault()
  event.stopPropagation()
}

function onResizeMove(event: PointerEvent) {
  if (!isResizing.value || resizePointerId !== event.pointerId) return
  const deltaX = event.clientX - resizeStartX
  const deltaY = event.clientY - resizeStartY
  panelWidth.value = clamp(resizeStartWidth + deltaX, PANEL_MIN_WIDTH, maxPanelWidth.value)
  panelHeight.value = clamp(resizeStartHeight + deltaY, PANEL_MIN_HEIGHT, maxPanelHeight.value)
}

function stopResize(event: PointerEvent) {
  if (resizePointerId !== null && resizePointerId !== event.pointerId) return
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', stopResize)
  window.removeEventListener('pointercancel', stopResize)
  isResizing.value = false
  resizePointerId = null
}

// ---------------------------------------------------------------------------
// Bubble toggle
// ---------------------------------------------------------------------------
function toggleWidget() {
  if (performance.now() < dragSuppressClickUntil) return
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    showResolveConfirm.value = false
    activeConversationId.value = null
    messages.value = []
    activeConversationData.value = null
  } else {
    // Initialize panel anchor from saved position or compute from bubble
    if (panelAnchorX.value <= 0 && panelAnchorY.value <= 0) {
      panelAnchorX.value = Math.max(
        0,
        widgetPosition.value.x + bubbleDiameter.value - panelWidth.value,
      )
      panelAnchorY.value = Math.max(
        0,
        widgetPosition.value.y - panelHeight.value - DESKTOP_PANEL_GAP,
      )
      if (panelAnchorY.value < 0) {
        panelAnchorY.value = widgetPosition.value.y + bubbleDiameter.value + DESKTOP_PANEL_GAP
      }
    }
    if (activeConversationId.value) {
      markUnreadVisitorMessagesAsRead()
    }
  }
}

// ---------------------------------------------------------------------------
// Socket events
// ---------------------------------------------------------------------------
function connect() {
  const s = io(props.serverUrl, {
    auth: props.token && props.token !== 'cookie-auth' ? { token: props.token } : undefined,
    transports: ['websocket', 'polling'],
    withCredentials: true,
  })

  s.on('connect', () => {
    console.log('[OmniChat Admin Widget] Connected')
  })

  s.on(
    'conversations_list',
    (data: {
      conversations: Conversation[]
      currentUser?: { id: string; username: string; displayName: string; role: string }
    }) => {
      if (data.currentUser) {
        currentUserUsername.value = data.currentUser.username
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

  s.on('new_message', (data: { message: Message }) => {
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

  s.on('visitor_typing', (data: { conversationId: string; user: string; isTyping: boolean }) => {
    if (data.conversationId === activeConversationId.value) {
      isTyping.value = data.isTyping
      typingUser.value = data.user
    }
  })

  s.on('agent_typing', (data: { conversationId: string; user: string; isTyping: boolean }) => {
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
      conversations.value[idx] = { ...conversations.value[idx], ...data.conversation }
    }
    if (activeConversationData.value?.id === data.conversation.id) {
      activeConversationData.value = { ...activeConversationData.value, ...data.conversation }
    }
  })

  s.on('review_submitted', (data: { conversationId: string; rating: number; review?: string }) => {
    const conv = conversations.value.find((c) => c.id === data.conversationId)
    if (conv) {
      conv.rating = data.rating
      conv.review = data.review
    }
  })

  s.on('message_error', (data: { error: string }) => {
    console.warn('[OmniChat Admin Widget] Message error:', data.error)
  })

  s.on('error', (data: { message: string }) => {
    console.error('[OmniChat Admin Widget] Error:', data.message)
  })

  s.on('disconnect', () => {
    console.log('[OmniChat Admin Widget] Disconnected')
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
  showTransferConfirm.value = false

  socket.value?.emit('join_conversation', { conversationId })
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

function handleInput() {
  if (!activeConversationId.value) return

  socket.value?.emit('typing_start', {
    conversationId: activeConversationId.value,
  })

  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.value?.emit('typing_stop', { conversationId: activeConversationId.value })
  }, 2000)
}

function resolveConversation() {
  showResolveConfirm.value = true
}

function confirmResolve() {
  if (!activeConversationId.value) return
  socket.value?.emit('resolve_conversation', {
    conversationId: activeConversationId.value,
  })
  showResolveConfirm.value = false
}

function cancelResolve() {
  showResolveConfirm.value = false
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

function openImage(url: string) {
  selectedImage.value = url
}

function closeImage() {
  selectedImage.value = null
}

function backToList() {
  activeConversationId.value = null
  messages.value = []
  activeConversationData.value = null
  showResolveConfirm.value = false
}

// ---------------------------------------------------------------------------
// Details
// ---------------------------------------------------------------------------
function saveConversationDetails() {
  if (!activeConversationId.value) return
  socket.value?.emit('update_conversation_details', {
    conversationId: activeConversationId.value,
    assignedUsername: draftAssignedUsername.value.trim(),
    agentRemarks: draftAgentRemarks.value.trim(),
  })
  showConversationDetails.value = false
}

// ---------------------------------------------------------------------------
// Transfer
// ---------------------------------------------------------------------------
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
}

function cancelTransferConversation() {
  showTransferConfirm.value = false
  transferTargetUsername.value = ''
}

async function loadAdminList() {
  try {
    const res = await fetch(`${props.serverUrl}/admin/users`, {
      credentials: 'include',
      headers: authHeaders(),
    })
    if (res.ok) {
      adminList.value = await res.json()
    }
  } catch (err) {
    console.error('[OmniChat Admin Widget] Failed to load admin list', err)
  }
}

// ---------------------------------------------------------------------------
// Translation
// ---------------------------------------------------------------------------
function setTranslateLang(lang: string) {
  translateLang.value = lang
  localStorage.setItem('omnichat_admin_widget_translate_lang', lang)
}

async function toggleTranslation(msg: Message) {
  if (translatedMessages.value[msg.id]) {
    delete translatedMessages.value[msg.id]
    return
  }
  if (translatingMessageIds.value.has(msg.id)) return

  const text = msg.content || ''
  if (!text.trim()) return

  translatingMessageIds.value = new Set([...translatingMessageIds.value, msg.id])
  try {
    const translated = await fetchTranslation(props.serverUrl, text, translateLang.value, authHeaders())
    translatedMessages.value = { ...translatedMessages.value, [msg.id]: translated }
  } catch (e: any) {
    console.warn('[OmniChat Admin Widget] Translation failed:', e.message)
  } finally {
    const next = new Set(translatingMessageIds.value)
    next.delete(msg.id)
    translatingMessageIds.value = next
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  refreshViewport()
  initializeWidgetPosition()

  // Fetch config from server to apply bubble styling
  fetch(`${props.serverUrl}/config/active`)
    .then((res) => res.json())
    .then((config) => {
      if (config.bubbleColor) siteBubbleColor.value = config.bubbleColor
      if (config.bubbleSize) siteBubbleSize.value = config.bubbleSize
      if (config.bubblePattern) siteBubblePattern.value = config.bubblePattern
      if (config.bubbleIcon) siteBubbleIcon.value = config.bubbleIcon
      if (config.notificationSoundUrl) notificationSoundUrl.value = config.notificationSoundUrl
      if (config.translationEnabled !== undefined) isTranslationEnabled.value = config.translationEnabled
    })
    .catch(() => {
      // Config endpoint is optional — widget still works with defaults
    })

  window.addEventListener('resize', refreshViewport)
  connect()
  loadAdminList()

  // Insert hidden attribution marker
  try {
    const host = document.querySelector('omnichat-admin-widget') as HTMLElement | null
    if (host) {
      const marker = document.createElement('p')
      marker.textContent = 'Powered by OmniChat: https://github.com/garyhooi/omnichat'
      marker.style.display = 'none'
      marker.setAttribute('aria-hidden', 'true')
      marker.setAttribute('data-omnichat-powered', appVersion)
      host.appendChild(marker)
    }
  } catch (e) {
    // noop
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', refreshViewport)
  window.removeEventListener('pointermove', onWidgetDragMove)
  window.removeEventListener('pointerup', stopWidgetDrag)
  window.removeEventListener('pointercancel', stopWidgetDrag)
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', stopResize)
  window.removeEventListener('pointercancel', stopResize)
  socket.value?.disconnect()
})

watch([bubbleDiameter, viewportWidth, viewportHeight], () => {
  setWidgetPosition(widgetPosition.value)
})

watch(showLangPopover, (val) => {
  if (val) {
    const close = () => { showLangPopover.value = false }
    setTimeout(() => document.addEventListener('click', close, { once: true }))
  }
})
</script>

<template>
  <p hidden style="display:none;margin:0;padding:0;line-height:0;">Powered by OmniChat: https://github.com/garyhooi/omnichat</p>

  <!-- Floating bubble -->
  <div class="aw-bubble-wrap" :style="bubbleWrapperStyle">
    <button
      v-if="!isOpen"
      type="button"
      :class="['aw-bubble', { 'aw-has-unread': unreadCount > 0, 'aw-dragging': widgetDragState.isDragging }]"
      :style="dynamicBubbleStyle"
      @click="toggleWidget"
      @pointerdown="startWidgetDrag"
      aria-label="Open admin chat"
    >
      <img v-if="siteBubbleIcon.startsWith('/') || siteBubbleIcon.startsWith('http')" :src="siteBubbleIcon.startsWith('http') ? siteBubbleIcon : props.serverUrl + siteBubbleIcon" alt="Icon" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none; border-radius: 50%;" />
      <span v-else>{{ siteBubbleIcon }}</span>
    </button>
    <div
      v-if="!isOpen && unreadCount > 0"
      class="aw-unread-badge"
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </div>
  </div>

  <!-- Panel -->
  <div v-if="isOpen" class="aw-panel" :style="dynamicPanelStyle">
    <!-- Header -->
    <div class="aw-header" :style="{ backgroundColor: currentBubbleColor }" @pointerdown="startWidgetDrag">
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 14px; font-weight: 600;">Conversations</span>
        <span v-if="activeConversationId && activeConversationData" style="font-size: 11px; opacity: 0.85; margin-top: 1px;">
          #{{ formatTicketId(activeConversationId) }} · {{ getVisitorLabel(activeConversationData) }}
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" class="aw-header-btn" @click="toggleMute" :title="isMuted ? 'Unmute' : 'Mute'">
          {{ isMuted ? '🔕' : '🔔' }}
        </button>
        <button type="button" class="aw-header-btn" @click="toggleWidget" aria-label="Close">
          &times;
        </button>
      </div>
    </div>

    <!-- Main content area -->
    <div class="aw-body">
      <!-- Conversation List View -->
      <template v-if="!activeConversationId">
        <!-- Tabs -->
        <div class="aw-tabs">
          <button
            type="button"
            :class="['aw-tab', { active: activeTab === 'active' }]"
            @click="activeTab = 'active'"
          >
            Active ({{ conversations.filter(c => c.status === 'active').length }})
          </button>
          <button
            type="button"
            :class="['aw-tab', { active: activeTab === 'specialist' }]"
            @click="activeTab = 'specialist'"
          >
            Specialist ({{ conversations.filter(c => c.status === 'specialist' && c.specialistUsername === currentUserUsername).length }})
          </button>
        </div>

        <!-- Conversation list -->
        <div class="aw-conv-list">
          <div v-if="filteredConversations.length === 0" class="aw-empty">
            No {{ activeTab === 'specialist' ? 'specialist' : 'active' }} conversations
          </div>
          <button
            v-for="conv in filteredConversations"
            :key="conv.id"
            type="button"
            class="aw-conv-item"
            @click="selectConversation(conv.id)"
          >
            <div class="aw-conv-item-top">
              <span class="aw-conv-name">{{ getVisitorLabel(conv) }}</span>
              <span class="aw-conv-time">{{ formatTime(conv.updatedAt) }}</span>
            </div>
            <div class="aw-conv-item-bottom">
              <span class="aw-conv-preview">{{ conv.messages?.[0]?.content || 'No messages' }}</span>
              <span
                v-if="(conv.unreadCount || 0) > 0"
                class="aw-conv-unread"
              >{{ conv.unreadCount }}</span>
            </div>
          </button>
        </div>
      </template>

      <!-- Chat View -->
      <template v-else>
        <!-- Back + actions bar -->
        <div class="aw-chat-topbar">
          <button type="button" class="aw-back-btn" @click="backToList">
            &#8592;
          </button>
          <div style="flex: 1; text-align: left; font-size: 12px; font-weight: 500; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: 4px;">
            {{ getVisitorLabel(activeConversationData!) }}
          </div>
          <span
            :style="{
              fontSize: '10px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '6px',
              background: activeConversationData?.status === 'specialist' ? '#fef3c7' : activeConversationData?.status === 'resolved' ? '#d1fae5' : '#dbeafe',
              color: activeConversationData?.status === 'specialist' ? '#92400e' : activeConversationData?.status === 'resolved' ? '#065f46' : '#1e40af',
              marginRight: '6px',
            }"
          >
            {{ activeConversationData?.status || '' }}
          </span>
          <!-- Translation language selector -->
          <div v-if="isTranslationEnabled" style="position: relative;">
            <button
              type="button"
              class="aw-action-btn"
              title="Translate messages"
              @click="showLangPopover = !showLangPopover"
            >&#127760;</button>
            <div
              v-if="showLangPopover"
              class="aw-lang-popover"
            >
              <button
                v-for="lang in TRANSLATE_LANGS"
                :key="lang.value"
                type="button"
                class="aw-lang-option"
                :style="translateLang === lang.value ? { background: '#eef2ff', color: '#4f46e5', fontWeight: 600 } : {}"
                @click="setTranslateLang(lang.value); showLangPopover = false"
                @mouseenter="($event.target as HTMLElement).style.background = '#f3f4f6'"
                @mouseleave="($event.target as HTMLElement).style.background = translateLang === lang.value ? '#eef2ff' : 'none'"
              >
                {{ lang.label }}
              </button>
            </div>
          </div>
          <!-- Details button -->
          <button
            type="button"
            class="aw-action-btn"
            :style="showConversationDetails ? { background: '#4f46e5', color: 'white', borderColor: '#4f46e5' } : {}"
            @click="showConversationDetails = !showConversationDetails; showTransferConfirm = false"
            title="Details"
          >&#8505;</button>
          <!-- Transfer button (only for active/specialist) -->
          <template v-if="isActive">
            <button
              v-if="!showTransferConfirm"
              type="button"
              class="aw-action-btn"
              @click="showTransferConfirm = true; showConversationDetails = false"
              title="Transfer"
            >&#10150;</button>
            <template v-else>
              <select
                v-model="transferTargetUsername"
                class="aw-transfer-select"
              >
                <option value="">Select...</option>
                <option v-for="admin in adminList" :key="admin.username" :value="admin.username">
                  @{{ admin.username }}
                </option>
              </select>
              <button
                type="button"
                class="aw-action-btn"
                style="color: #4f46e5; border-color: #4f46e5;"
                :disabled="!transferTargetUsername"
                @click="executeTransferConversation"
              >&#10003;</button>
              <button
                type="button"
                class="aw-action-btn"
                @click="cancelTransferConversation"
              >&#10005;</button>
            </template>
          </template>
        </div>

        <!-- Details panel -->
        <div v-if="showConversationDetails" class="aw-details-panel">
          <div style="margin-bottom: 8px;">
            <label style="font-size: 11px; font-weight: 600; color: #6b7280;">Customer Username</label>
            <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
              <span style="color: #9ca3af;">@</span>
              <input
                v-model="draftAssignedUsername"
                type="text"
                placeholder="user123"
                class="aw-details-input"
              />
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <label style="font-size: 11px; font-weight: 600; color: #6b7280;">Internal Remarks</label>
            <textarea
              v-model="draftAgentRemarks"
              placeholder="Add notes..."
              rows="2"
              class="aw-details-input"
              style="resize: vertical; min-height: 40px;"
            ></textarea>
          </div>
          <div class="aw-details-info">
            <div class="aw-details-row"><span class="aw-details-key">IP</span><span class="aw-details-val">{{ activeConversationData?.visitorIp || '—' }}</span></div>
            <div class="aw-details-row"><span class="aw-details-key">Browser</span><span class="aw-details-val">{{ activeConversationData?.visitorBrowser || '—' }}</span></div>
            <div class="aw-details-row"><span class="aw-details-key">URL</span><span class="aw-details-val" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ activeConversationData?.visitorCurrentUrl || '—' }}</span></div>
          </div>
          <button type="button" class="aw-save-details-btn" @click="saveConversationDetails">Save Changes</button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="aw-messages">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['aw-msg', msg.senderType]"
          >
            <template v-if="msg.messageType === 'image'">
              <img
                :src="msg.attachmentThumbnailUrl || msg.attachmentUrl"
                alt="Attachment"
                style="max-width: 100%; max-height: 120px; border-radius: 6px; display: block; cursor: pointer; object-fit: cover;"
                @click="openImage(msg.attachmentUrl || '')"
              />
              <div v-if="msg.content" class="aw-msg-content" v-html="renderMarkdown(translatedMessages[msg.id] || msg.content)"></div>
            </template>
            <template v-else>
              <div class="aw-msg-content" v-html="renderMarkdown(translatedMessages[msg.id] || msg.content || '')"></div>
            </template>
            <div class="aw-msg-meta">
              <span class="aw-msg-time">{{ formatTime(msg.createdAt) }}</span>
              <button
                v-if="msg.content && msg.messageType !== 'image' && isTranslationEnabled"
                type="button"
                class="aw-translate-btn"
                :disabled="translatingMessageIds.has(msg.id)"
                :title="translatedMessages[msg.id] ? 'Show original' : 'Translate'"
                @click="toggleTranslation(msg)"
              >
                {{ translatingMessageIds.has(msg.id) ? '...' : (translatedMessages[msg.id] ? 'Orig' : 'A') }}
              </button>
              <span v-if="msg.senderType === 'visitor' && msg.readAt" class="aw-msg-read">&#10003;&#10003;</span>
            </div>
          </div>
          <div v-if="isTyping" class="aw-typing-hint">
            {{ typingUser }} is typing...
          </div>
        </div>

        <!-- Resolve confirm banner -->
        <div v-if="showResolveConfirm" class="aw-resolve-confirm">
          <span style="font-size: 13px; color: #b91c1c; font-weight: 600;">Resolve this conversation?</span>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="aw-btn-resolve-yes" @click="confirmResolve">Resolve</button>
            <button type="button" class="aw-btn-resolve-cancel" @click="cancelResolve">Cancel</button>
          </div>
        </div>

        <!-- Resolved banner -->
        <div v-else-if="activeConversationData?.status === 'resolved'" class="aw-resolved-banner">
          This conversation has been resolved.
          <br/>
          <span style="font-size: 12px; opacity: 0.7;">Ticket #{{ formatTicketId(activeConversationId) }}</span>
          <div v-if="activeConversationData.rating" style="margin-top: 4px;">
            Rating: {{ '⭐'.repeat(activeConversationData.rating) }}
          </div>
        </div>

        <!-- Input area (active/specialist) -->
        <div v-else class="aw-input-area">
          <textarea
            v-model="newMessage"
            class="aw-input"
            rows="1"
            placeholder="Type your message..."
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="() => {}"
            @input="handleInput"
          ></textarea>
          <button
            type="button"
            class="aw-send-btn"
            :style="{ backgroundColor: currentBubbleColor }"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
          >
            Send
          </button>
          <button
            type="button"
            class="aw-resolve-btn"
            @click="resolveConversation"
            title="Resolve"
          >
            &#10006;
          </button>
        </div>
      </template>
    </div>

    <!-- Resize handle -->
    <div
      class="aw-resize-handle"
      @pointerdown="startResize"
      title="Drag to resize"
    ></div>
  </div>

  <!-- Lightbox overlay -->
  <div v-if="selectedImage" class="aw-lightbox" @click="closeImage">
    <button class="aw-lightbox-close">&times;</button>
    <img :src="selectedImage" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px;" @click.stop />
  </div>

  <p hidden style="display:none;margin:0;padding:0;line-height:0;">Powered by OmniChat: https://github.com/garyhooi/omnichat</p>
</template>
