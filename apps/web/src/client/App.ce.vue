<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { io, Socket } from 'socket.io-client'
import heic2any from 'heic2any'

// ---------------------------------------------------------------------------
// Props — mapped from HTML attributes by Vue's defineCustomElement
// Usage: <omnichat-widget server-url="https://api.yoursite.com"></omnichat-widget>
// ---------------------------------------------------------------------------
const props = defineProps({
  serverUrl: { type: String, required: true },
  bubbleColor: { type: String, default: '#4F46E5' },
  welcomeMessage: { type: String, default: 'Hello! How can we help you today?' },
  position: { type: String, default: 'bottom-right' }, // future: bottom-left
  assignUsername: { type: String, default: '' },
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
const siteOfflineMessage = ref('We are currently offline. Please check back later.')
const siteBubbleSize = ref('medium')
const siteBubblePattern = ref('solid')
const siteWebsitePosition = ref('bottom-right')
const siteBubbleIcon = ref('💬')
const siteEnableReadReceipts = ref(true)
const siteIsOfflineMode = ref(false)

const notificationSoundUrl = ref('')
const isMuted = ref(localStorage.getItem('omnichat_client_muted') === 'true')

function toggleMute() {
  isMuted.value = !isMuted.value
  localStorage.setItem('omnichat_client_muted', isMuted.value ? 'true' : 'false')
}

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
const isUploading = ref(false)
const isDragging = ref(false)
const dragCounter = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadToken = ref<string | null>(null)

const selectedImage = ref<string | null>(null)

function openImage(url: string) {
  selectedImage.value = url
}

function closeImage() {
  selectedImage.value = null
}

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

  s.on('upload_token', (data: { token: string }) => {
    uploadToken.value = data.token
    console.log('[OmniChat Widget] Upload token received')
  })

  s.on('conversation_started', (data: { conversation: { id: string } }) => {
    conversationId.value = data.conversation.id
    // Store conversation ID so the visitor can resume on page refresh or across tabs
    localStorage.setItem('omnichat_conversation_id', data.conversation.id)
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

  s.on('inactivity_warning', (data: { conversationId: string; message: string }) => {
    if (data.conversationId === conversationId.value) {
      messages.value.push({
        id: 'sys_' + Date.now(),
        conversationId: data.conversationId,
        senderType: 'system',
        content: data.message,
        createdAt: new Date().toISOString()
      })
      nextTick(() => scrollToBottom())
    }
  })

  s.on('new_message', (data: { message: Message }) => {
    if (data.message.conversationId === conversationId.value) {
      messages.value.push(data.message)
      if (data.message.senderType === 'agent') playSound()
      
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

  // Attempt to rejoin existing conversation from local storage
  const existingConvId = localStorage.getItem('omnichat_conversation_id')
  if (existingConvId) {
    conversationId.value = existingConvId
    s.on('connect', () => {
      s.emit('join_conversation', { conversationId: existingConvId })
    })
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTicketId(id: string | null): string {
  if (!id) return ''
  return id.slice(-8).toUpperCase()
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
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
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

function onPanelDrop(event: DragEvent) {
  event.preventDefault()
  dragCounter.value = 0
  isDragging.value = false
  if (!conversationId.value) return
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFile(event.dataTransfer.files[0])
  }
}

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
    assignUsername: props.assignUsername,
    metadata: JSON.stringify({
      userAgent: navigator.userAgent,
    }),
  })
}

function triggerFileUpload() {
  fileInput.value?.click()
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

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  await processFile(target.files[0])
}

async function processFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds 5MB limit.')
    return
  }

  isUploading.value = true

  try {
    if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
      })
      const blobArray = Array.isArray(convertedBlob) ? convertedBlob : [convertedBlob]
      file = new File([blobArray[0]], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
    }

    if (file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      file = await compressImage(file, 1200, 0.8)
    } else {
      // If it's another format somehow or conversion failed but bypassed, ensure it's still treated
      throw new Error('Unsupported format')
    }
  } catch (err) {
    console.error('Image compression/conversion failed', err)
    alert('Failed to process image. Make sure it is a valid format (JPG, PNG, HEIC, WEBP).')
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  if (conversationId.value) {
    formData.append('conversationId', conversationId.value)
  }

  try {
    const headers: HeadersInit = {}
    
    // Use upload token if available
    if (uploadToken.value) {
      headers['Authorization'] = uploadToken.value
    }

    const res = await fetch(`${props.serverUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload failed')
    }

    const data = await res.json()

    // Send message as image
    socket.value?.emit('send_message', {
      conversationId: conversationId.value,
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
  if (!newMessage.value.trim() || !conversationId.value) return

  socket.value?.emit('send_message', {
    conversationId: conversationId.value,
    content: newMessage.value.trim(),
    messageType: 'text',
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
  socket.value?.emit('resolve_conversation', {
    conversationId: conversationId.value,
  })
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
  localStorage.removeItem('omnichat_conversation_id')
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
      if (config.offlineMessage) siteOfflineMessage.value = config.offlineMessage
      if (config.bubbleSize) siteBubbleSize.value = config.bubbleSize
      if (config.bubblePattern) siteBubblePattern.value = config.bubblePattern
      if (config.websitePosition) siteWebsitePosition.value = config.websitePosition
      if (config.bubbleIcon) siteBubbleIcon.value = config.bubbleIcon
      if (config.enableReadReceipts !== undefined) siteEnableReadReceipts.value = config.enableReadReceipts
      if (config.isOfflineMode !== undefined) siteIsOfflineMode.value = config.isOfflineMode
      if (config.notificationSoundUrl) notificationSoundUrl.value = config.notificationSoundUrl
      
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
      :class="['chat-bubble', { 'has-unread': unreadCount > 0 }]"
      :style="dynamicBubbleStyle"
      @click="toggleWidget"
      aria-label="Open chat"
    >
      <img v-if="siteBubbleIcon.startsWith('/') || siteBubbleIcon.startsWith('http')" :src="siteBubbleIcon.startsWith('http') ? siteBubbleIcon : props.serverUrl + siteBubbleIcon" alt="Chat Icon" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none; border-radius: 50%;" />
      <span v-else>{{ siteBubbleIcon }}</span>
    </button>
    <div
      v-if="!isOpen && unreadCount > 0"
      style="position: absolute; top: -6px; right: -6px; background-color: #ef4444; color: white; border-radius: 9999px; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; border: 2px solid white; z-index: 10;"
    >
      {{ unreadCount }}
    </div>
  </div>

  <!-- Chat panel -->
  <div v-if="isOpen" class="chat-panel" :style="dynamicPanelStyle" @dragenter="onPanelDragEnter" @dragover="onPanelDragOver" @dragleave="onPanelDragLeave" @drop="onPanelDrop">
    <!-- Header -->
    <div class="panel-header" :style="{ backgroundColor: currentBubbleColor }">
      <div style="display: flex; flex-direction: column;">
        <h3 style="margin: 0; font-size: 16px;">Chat with us</h3>
        <span v-if="conversationId" style="font-size: 12px; opacity: 0.85; margin-top: 2px;">
          Ticket: #{{ formatTicketId(conversationId) }}
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <button type="button" class="close-btn" @click="toggleMute" :title="isMuted ? 'Unmute Notifications' : 'Mute Notifications'" style="font-size: 16px; margin: 0;">
          {{ isMuted ? '🔕' : '🔔' }}
        </button>
        <button type="button" class="close-btn" @click="toggleWidget" aria-label="Close chat" style="margin: 0;">
          &times;
        </button>
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

    <!-- Welcome screen (no active conversation) -->
    <template v-if="!conversationId">
      <div class="welcome-screen">
        <template v-if="siteIsOfflineMode">
          <div style="background: rgba(254, 226, 226, 0.8); border: 1px solid #fca5a5; padding: 16px; border-radius: 12px; margin-bottom: 24px; text-align: center; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);">
            <p style="color: #b91c1c; font-weight: 600; margin: 0 0 8px 0; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span style="font-size: 18px;">🌙</span> Agents are offline
            </p>
            <p style="color: #7f1d1d; white-space: pre-wrap; font-size: 14px; margin: 0;">{{ siteOfflineMessage }}</p>
          </div>
        </template>
        <template v-else>
          <p>{{ currentWelcomeMessage || siteWelcomeMessage || welcomeMessage }}</p>
          
          <div class="pre-chat-form">
            <input v-model="visitorName" type="text" placeholder="Your Name" class="form-input" />
            <input v-model="visitorEmail" type="text" inputmode="email" placeholder="Your Email (Optional)" class="form-input" />
          </div>

          <button
            type="button"
            class="start-chat-btn"
            :style="{ backgroundColor: currentBubbleColor, boxShadow: `0 4px 14px ${currentBubbleColor}66` }"
            @click="startConversation"
          >
            Start a conversation
          </button>
        </template>
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
          :style="msg.senderType === 'visitor' ? { backgroundColor: currentBubbleColor, padding: msg.messageType === 'image' ? '4px' : '' } : { padding: msg.messageType === 'image' ? '4px' : '' }"
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
          <div class="msg-meta" :style="{ padding: msg.messageType === 'image' ? '0 8px 8px 8px' : '' }">
            <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
            <span v-if="siteEnableReadReceipts && msg.senderType === 'visitor' && msg.readAt" class="msg-read-receipt" title="Read">&#10003;&#10003;</span>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="typing-hint">
        <span>{{ typingUser }} is typing</span>
      </div>

      <!-- Resolved state & Review -->
      <template v-if="isResolved">
        <div class="resolved-banner">
          This conversation has been resolved. <br/>
          Reference Ticket: <strong>#{{ formatTicketId(conversationId) }}</strong>
          
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
          <button
            type="button"
            class="attachment-btn"
            style="background: transparent; border: none; font-size: 18px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center; transition: color 0.2s;"
            :disabled="isUploading"
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
            class="msg-input"
            rows="1"
            :placeholder="isUploading ? 'Uploading...' : 'Type your message...'"
            :disabled="isUploading"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="() => {}"
            @input="handleInput"
          ></textarea>
          <button
            type="button"
            class="send-msg-btn"
            :style="{ backgroundColor: currentBubbleColor, boxShadow: `0 4px 10px ${currentBubbleColor}40` }"
            :disabled="(!newMessage.trim() && !isUploading)"
            @click="sendMessage"
          >
            {{ isUploading ? '...' : 'Send' }}
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

  <!-- Lightbox overlay -->
  <div v-if="selectedImage" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2147483647; display: flex; align-items: center; justify-content: center;" @click="closeImage">
    <button style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 32px; cursor: pointer;">&times;</button>
    <img :src="selectedImage" style="max-width: 90vw; max-height: 90vh; object-fit: contain; border-radius: 4px;" @click.stop />
  </div>
</template>
