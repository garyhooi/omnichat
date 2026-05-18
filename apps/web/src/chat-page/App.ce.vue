<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { io, Socket } from 'socket.io-client'
import { renderMarkdown } from '../utils/markdown'
import { fetchTranslation, getDefaultLang, TRANSLATE_LANGS } from '../utils/translationCache'
import { appVersion } from '../version'

const props = defineProps({
  serverUrl: { type: String, required: true },
  bubbleColor: { type: String, default: '#4F46E5' },
  welcomeMessage: { type: String, default: 'Hello! How can we help you today?' },
})

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

const socket = ref<Socket | null>(null)
const isOpen = ref(true)
const conversationId = ref<string | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const isTyping = ref(false)
const typingUser = ref('')
const isResolved = ref(false)
const visitorId = ref('')
const messagesArea = ref<HTMLElement | null>(null)

// AI streaming state
const aiStreamingText = ref('')
const isAiStreaming = ref(false)
const isAiEnabled = ref(false)
const isTranslationEnabled = ref(true)
const autoTranslationEnabled = ref(true)

let _scrollRafId: number | null = null
let _userScrolledUp = false

function isNearBottom(): boolean {
  if (!messagesArea.value) return true
  const el = messagesArea.value
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

function throttledScrollToBottom() {
  if (_userScrolledUp) return
  if (_scrollRafId) return
  _scrollRafId = requestAnimationFrame(() => {
    scrollToBottom(true)
    _scrollRafId = null
  })
}

watch(messagesArea, (el, oldEl) => {
  if (oldEl) oldEl.removeEventListener('scroll', onMessagesScroll)
  if (el) el.addEventListener('scroll', onMessagesScroll, { passive: true })
})

// Site config
const siteBubbleColor = ref('')
const siteWelcomeMessage = ref('')
const siteOfflineMessage = ref('We are currently offline. Please check back later.')
const siteOfflineMode = ref(false)
const siteEnableReadReceipts = ref(true)
const isMuted = ref(localStorage.getItem('omnichat_visitor_muted') === 'true')
const translationSoundUrl = ref('')

const translateLang = ref(getDefaultLang('omnichat_visitor_translate_lang'))
const showLangPopover = ref(false)
const translatingMessageIds = ref<Set<string>>(new Set())
const translatedMessages = ref<Record<string, string>>({})

function setTranslateLang(lang: string) {
  translateLang.value = lang
  localStorage.setItem('omnichat_visitor_translate_lang', lang)
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
    const translated = await fetchTranslation(props.serverUrl, text, translateLang.value)
    translatedMessages.value = { ...translatedMessages.value, [msg.id]: translated }
  } catch (e: any) {
    console.warn('Translation failed:', e.message)
  } finally {
    const next = new Set(translatingMessageIds.value)
    next.delete(msg.id)
    translatingMessageIds.value = next
  }
}

function autoTranslateMessage(msg: Message) {
  if (!autoTranslationEnabled.value) return
  if (!msg.content || msg.messageType === 'image') return
  if (translatedMessages.value[msg.id] || translatingMessageIds.value.has(msg.id)) return
  toggleTranslation(msg)
}

const audioPlayer = new Audio()
function playSound() {
  if (isMuted.value) return
  if (translationSoundUrl.value) {
    const src = translationSoundUrl.value.startsWith('http') ? translationSoundUrl.value : props.serverUrl + translationSoundUrl.value
    if (audioPlayer.src !== src) audioPlayer.src = src
    audioPlayer.currentTime = 0
    audioPlayer.play().catch(e => console.warn('Audio autoplay blocked:', e))
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

function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('omnichat_visitor_muted', isMuted.value ? 'true' : 'false')
}

const currentBubbleColor = computed(() => siteBubbleColor.value || props.bubbleColor)

// Pre-chat
const visitorName = ref('')
const visitorEmail = ref('')

// Review
const reviewRating = ref(0)
const reviewComment = ref('')
const reviewSubmitted = ref(false)

// End chat confirm
const showEndChatConfirm = ref(false)
const isUploading = ref(false)
const isDragging = ref(false)
const dragCounter = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadToken = ref<string | null>(null)
const selectedImage = ref<string | null>(null)

const wordLimitError = ref('')

function getVisitorId(): string {
  const storageKey = 'omnichat_visitor_id'
  let id = localStorage.getItem(storageKey)
  if (!id) {
    id = window.crypto && crypto.randomUUID ? 'v_' + crypto.randomUUID() : 'v_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36)
    localStorage.setItem(storageKey, id)
  }
  return id
}

function connect() {
  visitorId.value = getVisitorId()
  const s = io(props.serverUrl, {
    auth: { visitorId: visitorId.value },
    transports: ['websocket', 'polling'],
  })

  s.on('connect', () => {
    const existingConvId = localStorage.getItem('omnichat_conversation_id')
    if (existingConvId) {
      conversationId.value = existingConvId
      s.emit('join_conversation', { conversationId: existingConvId })
    }
  })

  s.on('upload_token', (data: { token: string }) => {
    uploadToken.value = data.token
  })

  s.on('conversation_started', (data: { conversation: { id: string } }) => {
    conversationId.value = data.conversation.id
    localStorage.setItem('omnichat_conversation_id', data.conversation.id)
  })

  s.on('conversation_history', (data: { conversation: { messages?: Message[]; status?: string; rating?: number } }) => {
    messages.value = data.conversation.messages || []
    isResolved.value = data.conversation.status === 'resolved'
    if (data.conversation.rating) reviewSubmitted.value = true
    nextTick(() => scrollToBottom())
  })

  s.on('inactivity_warning', (data: { conversationId: string; message: string }) => {
    if (data.conversationId === conversationId.value) {
      messages.value.push({
        id: 'sys_' + Date.now(),
        conversationId: data.conversationId,
        senderType: 'system',
        content: data.message,
        createdAt: new Date().toISOString(),
      })
      capMessages()
      nextTick(() => scrollToBottom())
    }
  })

  s.on('message_error', (data: { error: string }) => {
    wordLimitError.value = data.error
    setTimeout(() => (wordLimitError.value = ''), 4000)
  })

  s.on('new_message', (data: { message: Message }) => {
    if (data.message.conversationId === conversationId.value) {
      if (data.message.senderType === 'ai' && isAiStreaming.value) {
        isAiStreaming.value = false
        aiStreamingText.value = ''
        _userScrolledUp = false
      }
      messages.value.push(data.message)
      capMessages()
      if (data.message.senderType === 'agent' || data.message.senderType === 'ai') playSound()
      nextTick(() => {
        scrollToBottom()
        if (isOpen.value && (data.message.senderType === 'agent' || data.message.senderType === 'ai')) {
          socket.value?.emit('read_message', { messageId: data.message.id, conversationId: conversationId.value })
        }
        if (data.message.senderType === 'agent' || data.message.senderType === 'ai') autoTranslateMessage(data.message)
      })
    }
  })

  s.on('ai_stream', (data: { conversationId: string; token: string; isComplete: boolean; fullText?: string }) => {
    if (data.conversationId !== conversationId.value) return
    if (data.isComplete) return
    isAiStreaming.value = true
    aiStreamingText.value += data.token
    throttledScrollToBottom()
  })

  s.on('message_read', (data: { messageId: string; readAt: string }) => {
    const msg = messages.value.find(m => m.id === data.messageId)
    if (msg) msg.readAt = data.readAt
  })

  s.on('agent_typing', (data: { conversationId: string; user: string; isTyping: boolean }) => {
    if (data.conversationId === conversationId.value) {
      isTyping.value = data.isTyping
      typingUser.value = data.user
    }
  })

  s.on('conversation_resolved', (data: { conversationId: string }) => {
    if (data.conversationId === conversationId.value) isResolved.value = true
  })

  s.on('error', (data: { message: string }) => {
    console.error('Visitor Error:', data.message)
    if (data.message === 'Failed to resolve conversation') isResolved.value = true
  })

  s.on('disconnect', () => {})

  socket.value = s
}

const MAX_MESSAGES = 200
function capMessages(): void {
  if (messages.value.length > MAX_MESSAGES) messages.value.splice(0, messages.value.length - MAX_MESSAGES)
}

function formatTicketId(id: string | null): string {
  if (!id) return ''
  return id.slice(-8).toUpperCase()
}

function onMessagesScroll() {
  if (isAiStreaming.value) _userScrolledUp = !isNearBottom()
}

function onPanelDragEnter(event: DragEvent) {
  if (!conversationId.value || !isOpen.value) return
  event.preventDefault()
  dragCounter.value++
  isDragging.value = true
}

function onPanelDragOver(event: DragEvent) {
  if (!conversationId.value || !isOpen.value) return
  event.preventDefault()
}

function onPanelDragLeave(event: DragEvent) {
  if (!conversationId.value || !isOpen.value) return
  event.preventDefault()
  dragCounter.value--
  if (dragCounter.value <= 0) { dragCounter.value = 0; isDragging.value = false }
}

function onPanelDrop(event: DragEvent) {
  event.preventDefault()
  dragCounter.value = 0
  isDragging.value = false
  if (!conversationId.value) return
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) processFile(event.dataTransfer.files[0])
}

function openImage(url: string) { selectedImage.value = url }
function closeImage() { selectedImage.value = null }

function startConversation() {
  if (!visitorName.value.trim()) { alert('Please provide your name to continue.') }
  socket.value?.emit('start_conversation', {
    visitorId: visitorId.value,
    visitorName: visitorName.value.trim(),
    visitorEmail: visitorEmail.value.trim(),
    visitorCurrentUrl: window.location.href,
    visitorTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    visitorLanguage: navigator.language,
    visitorScreenRes: `${window.screen.width}x${window.screen.height}`,
    visitorReferrer: document.referrer || null,
    metadata: JSON.stringify({ userAgent: navigator.userAgent }),
  })
}

function triggerFileUpload() { fileInput.value?.click() }

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
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) {
            const newName = file.name.replace(/\.[^/.]+$/, '') + '.webp'
            resolve(new File([blob], newName, { type: 'image/webp' }))
          } else { reject(new Error('Canvas to Blob failed')) }
        }, 'image/webp', quality)
      }
    }
    reader.onerror = (e) => reject(e)
  })
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  await processFile(target.files[0])
}

async function processFile(file: File) {
  if (file.size > 5 * 1024 * 1024) { alert('File size exceeds 5MB limit.') }
  isUploading.value = true
  try {
    const fileName = file.name.toLowerCase()
    const isHeicFile = fileName.endsWith('.heic') || fileName.endsWith('.heif') ||
      file.type === 'image/heic' || file.type === 'image/heif'
    if (!isHeicFile && file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      file = await compressImage(file, 1200, 0.8)
    } else if (isHeicFile) {
      // HEIC handled by backend
    } else {
      throw new Error(`Unsupported format: ${file.type}`)
    }
  } catch (err) {
    console.error('Image processing failed', err)
    alert(`Failed to process image: ${err.message}.`)
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
    return
  }
  const formData = new FormData()
  formData.append('file', file)
  if (conversationId.value) formData.append('conversationId', conversationId.value)
  try {
    const headers: HeadersInit = {}
    if (uploadToken.value) headers['Authorization'] = uploadToken.value
    const res = await fetch(`${props.serverUrl}/upload`, { method: 'POST', headers, body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    if (data.uploadToken) uploadToken.value = data.uploadToken
    socket.value?.emit('send_message', {
      conversationId: conversationId.value,
      content: '',
      messageType: 'image',
      attachmentUrl: `${props.serverUrl}${data.url}`,
      attachmentThumbnailUrl: `${props.serverUrl}${data.thumbnailUrl || data.url}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload file.')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !conversationId.value) return
  const text = newMessage.value.trim()
  if (text.length > 100) {
    wordLimitError.value = `Message too long (${text.length}/100 characters).`
    setTimeout(() => (wordLimitError.value = ''), 4000)
    return
  }
  wordLimitError.value = ''
  socket.value?.emit('send_message', {
    conversationId: conversationId.value,
    content: newMessage.value.trim(),
    messageType: 'text',
  })
  socket.value?.emit('typing_stop', { conversationId: conversationId.value })
  newMessage.value = ''
}

let typingTimeout: ReturnType<typeof setTimeout> | null = null
function handleInput() {
  if (!conversationId.value) return
  socket.value?.emit('typing_start', { conversationId: conversationId.value })
  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.value?.emit('typing_stop', { conversationId: conversationId.value })
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

function endChat() { showEndChatConfirm.value = true }

function confirmEndChat() {
  if (!conversationId.value) { isResolved.value = true; showEndChatConfirm.value = false; return }
  socket.value?.emit('resolve_conversation', { conversationId: conversationId.value })
  showEndChatConfirm.value = false
}

function cancelEndChat() { showEndChatConfirm.value = false }

function scrollToBottom(instant = false) {
  if (messagesArea.value) {
    if (instant) {
      messagesArea.value.scrollTop = messagesArea.value.scrollHeight
    } else {
      messagesArea.value.scrollTo({ top: messagesArea.value.scrollHeight, behavior: 'smooth' })
    }
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const datePart = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  return `${datePart} ${time}`
}

function startNewChat() {
  conversationId.value = null
  messages.value = []
  isResolved.value = false
  reviewSubmitted.value = false
  reviewRating.value = 0
  reviewComment.value = ''
  aiStreamingText.value = ''
  isAiStreaming.value = false
  localStorage.removeItem('omnichat_conversation_id')
}

function requestHuman() {
  if (!conversationId.value) return
  socket.value?.emit('send_message', {
    conversationId: conversationId.value,
    content: 'I would like to talk to a human agent please.',
    messageType: 'text',
  })
}

const msgCounterStyle = computed(() => ({
  fontSize: '10px',
  color: newMessage.value.length >= 85 ? '#dc2626' : '#9ca3af',
  position: 'absolute',
  bottom: '4px',
  right: '65px',
  pointerEvents: 'none',
}))

function langItemStyle(lang: string) {
  return translateLang.value === lang.value
    ? { background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }
    : {}
}

onMounted(() => {
  fetch(`${props.serverUrl}/config/active`)
    .then((res) => res.json())
    .then((config) => {
      if (config.bubbleColor) siteBubbleColor.value = config.bubbleColor
      if (config.welcomeMessage) siteWelcomeMessage.value = config.welcomeMessage
      if (config.offlineMessage) siteOfflineMessage.value = config.offlineMessage
      if (config.isOfflineMode !== undefined) siteOfflineMode.value = config.isOfflineMode
      if (config.notificationSoundUrl) translationSoundUrl.value = config.notificationSoundUrl
      if (config.aiEnabled !== undefined) isAiEnabled.value = config.aiEnabled
      if (config.translationEnabled !== undefined) isTranslationEnabled.value = config.translationEnabled
      if (config.autoTranslationEnabled !== undefined) autoTranslationEnabled.value = config.autoTranslationEnabled
    })
    .catch(() => {})

  connect()
})

onUnmounted(() => {
  socket.value?.disconnect()
})

// Close handler: navigate back or close window
function handleClose() {
  try {
    if (window.opener) {
      window.close()
    } else {
      // Embedded: try to notify parent
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'omnichat-close' }, '*')
      } else {
        window.history.back()
      }
    }
  } catch {
    window.history.back()
  }
}
</script>

<template>
  <div class="panel-wrapper" :style="{
    left: '0px', top: '0px', width: '100vw', height: '100dvh',
    borderRadius: '0px', border: 'none',
  }" @dragenter="onPanelDragEnter" @dragover="onPanelDragOver" @dragleave="onPanelDragLeave" @drop="onPanelDrop">
    <!-- Header -->
    <div class="panel-header" :style="{ backgroundColor: currentBubbleColor }">
      <div>
        <h3>{{ conversationId ? 'Chat Support' : 'Chat with us' }}</h3>
        <span v-if="conversationId" style="font-size: 12px; opacity: 0.85; margin-top: 2px;">
          Ticket: #{{ formatTicketId(conversationId) }}
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <!-- Language -->
        <div v-if="isTranslationEnabled" style="position: relative;">
          <button type="button" class="close-btn" @click="showLangPopover = !showLangPopover" title="Translate" style="font-size: 16px;">
            🌐
          </button>
          <div v-if="showLangPopover" style="position: absolute; top: 100%; right: 0; margin-top: 6px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); z-index: 100; min-width: 160px; max-height: 260px; overflow-y: auto; padding: 4px 0;">
            <button v-for="lang in TRANSLATE_LANGS" :key="lang.value" @click="setTranslateLang(lang.value); showLangPopover = false" style="display: block; width: 100%; text-align: left; padding: 6px 14px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151;" :style="langItemStyle(lang)" @mouseenter="($event.target as HTMLElement).style.background = '#f3f4f6'" @mouseleave="($event.target as HTMLElement).style.background = translateLang === lang.value ? '#eef2ff' : 'none'">
              {{ lang.label }}
            </button>
          </div>
        </div>
        <!-- Mute -->
        <button type="button" class="close-btn" @click="toggleMute" :title="isMuted ? 'Unmute' : 'Mute'" style="font-size: 16px;">
          {{ isMuted ? '🔕' : '🔔' }}
        </button>
        <!-- Close -->
        <button type="button" class="close-btn" @click="handleClose" aria-label="Close chat">
          &times;
        </button>
      </div>
    </div>

    <!-- Drag overlay -->
    <div v-if="isDragging" class="drag-overlay">
      <div class="drag-overlay-content">
        <span style="font-size: 40px; margin-bottom: 12px; display: block; text-align: center;">📥</span>
        <span>Drop file to upload</span>
      </div>
    </div>

    <!-- Pre-chat / Welcome -->
    <template v-if="!conversationId">
      <div class="welcome-screen">
        <template v-if="siteOfflineMode && !isAiEnabled">
          <div style="background: rgba(254, 226, 226, 0.8); border: 1px solid #fca5a5; padding: 16px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
            <p style="color: #b91c1c; font-weight: 600; margin: 0 0 8px 0; font-size: 15px;">
              <span>🌙</span> Agents are offline
            </p>
            <p style="color: #7f1d1d; white-space: pre-wrap; font-size: 14px; margin: 0;">{{ siteOfflineMessage }}</p>
          </div>
        </template>
        <template v-else>
          <p>{{ siteWelcomeMessage || welcomeMessage }}</p>
          <div class="pre-chat-form">
            <input v-model="visitorName" type="text" placeholder="Your Name" class="form-input" />
            <input v-model="visitorEmail" type="text" inputmode="email" placeholder="Your Email (Optional)" class="form-input" />
          </div>
          <button type="button" class="start-chat-btn" :style="{ backgroundColor: currentBubbleColor, boxShadow: '0 4px 14px ' + currentBubbleColor + '66' }" @click="startConversation">
            Start a conversation
          </button>
        </template>
      </div>
    </template>

    <!-- Chat area -->
    <template v-else>
      <div ref="messagesArea" class="messages-area">
        <div v-for="msg in messages" :key="msg.id" :class="['msg-bubble', msg.senderType]" :style="msg.senderType === 'visitor' ? { backgroundColor: currentBubbleColor, padding: msg.messageType === 'image' ? '4px' : '' } : { padding: msg.messageType === 'image' ? '4px' : '' }">
          <div v-if="msg.senderType === 'ai'" class="ai-label">AI Agent</div>
          <template v-if="msg.messageType === 'image'">
            <img :src="msg.attachmentThumbnailUrl || msg.attachmentUrl" alt="Attachment" style="max-width: 100%; max-height: 150px; border-radius: 8px; display: block; cursor: pointer; object-fit: cover;" @click="openImage(msg.attachmentUrl || '')" />
            <div v-if="msg.content" class="md-content" style="padding: 8px;" v-html="renderMarkdown(translatedMessages[msg.id] || msg.content)"></div>
          </template>
          <template v-else>
            <div class="md-content" v-html="renderMarkdown(translatedMessages[msg.id] || msg.content || '')"></div>
          </template>
          <div class="msg-meta" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: msg.messageType === 'image' ? '0 8px 8px 8px' : '' }">
            <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
            <button v-if="msg.content && msg.messageType !== 'image' && isTranslationEnabled" @click="toggleTranslation(msg)" :disabled="translatingMessageIds.has(msg.id)" style="background: none; border: 1px solid rgba(255,255,255,0.3); color: inherit; padding: 1px 6px; border-radius: 4px; font-size: 10px; cursor: pointer; opacity: 0.7;" :title="translatedMessages[msg.id] ? 'Show original' : 'Translate'">
              {{ translatingMessageIds.has(msg.id) ? '...' : (translatedMessages[msg.id] ? 'Original' : 'Translate') }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="isAiStreaming && aiStreamingText" class="msg-bubble ai ai-streaming" style="align-self: flex-start;">
        <div class="ai-label">AI Agent</div>
        <div class="md-content" v-html="renderMarkdown(aiStreamingText)"></div><span class="ai-cursor">|</span>
      </div>

      <div v-if="isTyping" class="typing-hint">
        <span>{{ typingUser }} is typing</span>
      </div>

      <!-- Resolved -->
      <template v-if="isResolved">
        <div class="resolved-banner">
          This conversation has been resolved. <br/>
          Reference Ticket: <strong>#{{ formatTicketId(conversationId) }}</strong>
          <div v-if="!reviewSubmitted" class="review-section">
            <p>How was your experience?</p>
            <div class="star-rating">
              <span v-for="star in 5" :key="star" @click="reviewRating = star" :class="{ active: star <= reviewRating }">&#9733;</span>
            </div>
            <textarea v-model="reviewComment" placeholder="Any comments? (Optional)" class="form-input"></textarea>
            <button type="button" class="submit-review-btn" :style="{ backgroundColor: currentBubbleColor }" @click="submitReview">Submit Review</button>
          </div>
          <div v-else class="review-thank-you">Thank you for your feedback!</div>
          <button type="button" class="start-new-chat-btn" @click="startNewChat">Start a new chat</button>
        </div>
      </template>

      <!-- Input -->
      <template v-else>
        <div v-if="showEndChatConfirm" class="confirm-action-area">
          <span class="confirm-text">End this chat?</span>
          <div class="confirm-buttons">
            <button type="button" class="confirm-yes-btn" @click="confirmEndChat">End</button>
            <button type="button" class="confirm-cancel-btn" @click="cancelEndChat">Cancel</button>
          </div>
        </div>
        <div v-else class="input-area">
          <div v-if="wordLimitError" style="position: absolute; top: -32px; left: 12px; right: 12px; background: #fef2f2; color: #dc2626; font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid #fecaca;">{{ wordLimitError }}</div>
          <button type="button" class="attachment-btn" style="background: transparent; border: none; font-size: 18px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;" :disabled="isUploading" @click="triggerFileUpload" title="Attach Image (Max 5MB)">
            <span style="transform: rotate(45deg);">&#128206;</span>
          </button>
          <input type="file" ref="fileInput" style="display: none;" accept="image/*" @change="handleFileUpload" />
          <textarea v-model="newMessage" class="msg-input" rows="1" maxlength="100" :placeholder="isUploading ? 'Uploading...' : 'Type your message...'" :disabled="isUploading" @keydown.enter.exact.prevent="sendMessage" @keydown.enter.shift.exact="() => void 0" @input="handleInput"></textarea>
          <span :style="msgCounterStyle">{{ newMessage.length }}/100</span>
          <button type="button" class="send-msg-btn" :style="{ backgroundColor: currentBubbleColor, boxShadow: '0 4px 10px ' + currentBubbleColor + '40' }" :disabled="(!newMessage.trim() && !isUploading)" @click="sendMessage">
            {{ isUploading ? '...' : 'Send' }}
          </button>
          <button type="button" class="end-chat-btn" @click="endChat" title="End Chat">&#10006;</button>
        </div>
      </template>
    </template>
  </div>

  <!-- Image preview -->
  <div v-if="selectedImage" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2147483647; display: flex; align-items: center; justify-content: center;" @click="closeImage">
    <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 32px; cursor: pointer;">&times;</button>
    <img :src="selectedImage" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px;" @click.stop />
  </div>
</template>
