<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from '../stores/toast.store'

const auth = useAuthStore()
const toast = useToast()
const base = () => auth.serverUrl

// --- State ---
const settingsTab = ref<'widget' | 'quick-replies'>('widget')

function parseWidgetPosition(value?: string | null) {
  if (!value?.startsWith('xy:')) return null

  const [xRaw, yRaw] = value.slice(3).split(',')
  const x = Number.parseInt(xRaw ?? '', 10)
  const y = Number.parseInt(yRaw ?? '', 10)

  if (Number.isNaN(x) || Number.isNaN(y)) return null
  return { x, y }
}

// Widget settings
const bubbleColor = ref('#4F46E5')
const welcomeMessage = ref('')
const offlineMessage = ref('')
const bubbleSize = ref('medium')
const bubblePattern = ref('solid')
const widgetPositionX = ref(20)
const widgetPositionY = ref(20)
const bubbleIconType = ref<'emoji' | 'custom'>('emoji')
const bubbleIconEmoji = ref('💬')
const bubbleIconUrl = ref('')
const isUploadingIcon = ref(false)
const iconFileInput = ref<HTMLInputElement | null>(null)
const enableReadReceipts = ref(false)
const isOfflineMode = ref(false)
const notificationSoundUrl = ref('')
const isUploadingSound = ref(false)
const soundFileInput = ref<HTMLInputElement | null>(null)
const siteConfigId = ref<string | null>(null)
const showAdminWidget = ref(true)
const showVisitorWidget = ref(true)

// Quick replies
const quickReplies = ref<{ id: string; title: string; content: string }[]>([])
const editingQuickReplyId = ref<string | null>(null)
const qrDraftTitle = ref('')
const qrDraftContent = ref('')

// Quick reply input handlers to enforce client-side maxlength (defensive)
function handleQrTitleInput(e: Event) {
  if (qrDraftTitle.value.length > 200) {
    qrDraftTitle.value = qrDraftTitle.value.slice(0, 200)
  }
}

function handleQrContentInput(e: Event) {
  if (qrDraftContent.value.length > 1000) {
    qrDraftContent.value = qrDraftContent.value.slice(0, 1000)
  }
}

// Emoji options
const emojiOptions = ['💬', '👋', '🤖', '💡', '❓', '🎉', '⭐', '🔔', '📩', '🛎️']

// --- Fetch helpers ---
function authHeaders(): Record<string, string> {
  return auth.getAuthHeaders()
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  return fetch(`${base()}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers || {}) },
  })
}

// --- Load data ---
async function loadConfig() {
  try {
    const res = await apiFetch('/config/admin-active')
    if (!res.ok) return
    const data = await res.json()
    siteConfigId.value = data.id ?? data._id ?? null
    bubbleColor.value = data.bubbleColor ?? '#4F46E5'
    welcomeMessage.value = data.welcomeMessage ?? ''
    offlineMessage.value = data.offlineMessage ?? ''
    bubbleSize.value = data.bubbleSize ?? 'medium'
    bubblePattern.value = data.bubblePattern ?? 'solid'
    const widgetPosition = parseWidgetPosition(data.websitePosition)
    widgetPositionX.value = widgetPosition?.x ?? 20
    widgetPositionY.value = widgetPosition?.y ?? 20
    // bubbleIcon is stored as a single string: emoji char or "custom:url"
    const icon = data.bubbleIcon ?? '💬'
    if (icon.startsWith('custom:')) {
      bubbleIconType.value = 'custom'
      bubbleIconUrl.value = icon.slice(7)
      bubbleIconEmoji.value = '💬'
    } else {
      bubbleIconType.value = 'emoji'
      bubbleIconEmoji.value = icon
      bubbleIconUrl.value = ''
    }
    enableReadReceipts.value = data.enableReadReceipts ?? false
    isOfflineMode.value = data.isOfflineMode ?? false
    notificationSoundUrl.value = data.notificationSoundUrl ?? ''
    showAdminWidget.value = data.showAdminWidget ?? true
    showVisitorWidget.value = data.showVisitorWidget ?? true
  } catch {
    // ignore
  }
}

async function loadQuickReplies() {
  try {
    const res = await apiFetch('/quick-replies')
    if (!res.ok) return
    quickReplies.value = await res.json()
  } catch {
    // ignore
  }
}

onMounted(() => {
  loadConfig()
  loadQuickReplies()
})

// --- Save settings ---
async function saveSettings() {
  // Combine icon fields into a single string for the API
  const bubbleIconValue = bubbleIconType.value === 'custom' && bubbleIconUrl.value
    ? `custom:${bubbleIconUrl.value}`
    : bubbleIconEmoji.value
  const body = {
    bubbleColor: bubbleColor.value,
    welcomeMessage: welcomeMessage.value,
    offlineMessage: offlineMessage.value,
    bubbleSize: bubbleSize.value,
    bubblePattern: bubblePattern.value,
    websitePosition: `xy:${widgetPositionX.value},${widgetPositionY.value}`,
    bubbleIcon: bubbleIconValue,
    enableReadReceipts: enableReadReceipts.value,
    isOfflineMode: isOfflineMode.value,
    notificationSoundUrl: notificationSoundUrl.value,
    showAdminWidget: showAdminWidget.value,
    showVisitorWidget: showVisitorWidget.value,
  }
  try {
    let res: Response
    if (siteConfigId.value) {
      res = await apiFetch(`/config/${siteConfigId.value}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
    } else {
      res = await apiFetch('/config', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.message || `HTTP ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    siteConfigId.value = data.id ?? data._id ?? siteConfigId.value
    toast.success('Settings saved successfully')
  } catch (e: any) {
    toast.error(e.message || 'Failed to save settings')
  }
}

// --- Icon upload ---
async function uploadCustomIcon(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  isUploadingIcon.value = true
  try {
    const img = new Image()
    const url = URL.createObjectURL(file)
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Invalid image'))
      img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, 128, 128)
    URL.revokeObjectURL(url)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.85)
    )
    if (!blob) throw new Error('Conversion failed')
    const fd = new FormData()
    fd.append('file', blob, 'icon.webp')
    const res = await fetch(`${base()}/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: fd,
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    bubbleIconUrl.value = data.url
    bubbleIconType.value = 'custom'
  } catch {
    toast.error('Icon upload failed')
  } finally {
    isUploadingIcon.value = false
    if (iconFileInput.value) iconFileInput.value.value = ''
  }
}

// --- Sound upload ---
async function uploadCustomSound(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  isUploadingSound.value = true
  try {
    const fd = new FormData()
    fd.append('file', file, file.name)
    const res = await fetch(`${base()}/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: fd,
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    notificationSoundUrl.value = data.url
  } catch {
    toast.error('Sound upload failed')
  } finally {
    isUploadingSound.value = false
    if (soundFileInput.value) soundFileInput.value.value = ''
  }
}

function removeSound() {
  notificationSoundUrl.value = ''
}

function playSound() {
  if (!notificationSoundUrl.value) return

  // Ensure the audio src is absolute. The stored URL may be a relative path
  // (eg. "/uploads/..") so prefix with the server base if needed — this
  // mirrors the logic used in the admin App where sounds play correctly.
  const src = notificationSoundUrl.value.startsWith('http')
    ? notificationSoundUrl.value
    : `${base()}${notificationSoundUrl.value}`

  const audio = new Audio(src)
  audio.currentTime = 0
  // Guard the play promise to avoid uncaught exceptions when playback fails
  audio.play().catch((e) => console.warn('Audio play failed:', e))
}

// --- Quick Reply CRUD ---
function startAddQuickReply() {
  editingQuickReplyId.value = '__new__'
  qrDraftTitle.value = ''
  qrDraftContent.value = ''
}

function startEditQuickReply(qr: { id: string; title: string; content: string }) {
  editingQuickReplyId.value = qr.id
  qrDraftTitle.value = qr.title
  qrDraftContent.value = qr.content
}

function cancelEditQuickReply() {
  editingQuickReplyId.value = null
  qrDraftTitle.value = ''
  qrDraftContent.value = ''
}

async function saveQuickReply() {
  const body = { title: qrDraftTitle.value, content: qrDraftContent.value }
  // Client-side validation
  if (!body.title || body.title.trim().length === 0) {
    toast.error('Title is required')
    return
  }
  if (body.title.length > 200) {
    toast.error('Title is too long (max 200 characters)')
    return
  }
  if (body.content.length > 1000) {
    toast.error('Content is too long (max 1000 characters)')
    return
  }
  try {
    if (editingQuickReplyId.value === '__new__') {
      const res = await apiFetch('/quick-replies', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
    } else {
      const res = await apiFetch(`/quick-replies/${editingQuickReplyId.value}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
    }
    cancelEditQuickReply()
    await loadQuickReplies()
  } catch {
    toast.error('Failed to save quick reply')
  }
}

async function deleteQuickReply(id: string) {
  try {
    const res = await apiFetch(`/quick-replies/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error()
    await loadQuickReplies()
  } catch {
    toast.error('Failed to delete quick reply')
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div class="flex gap-2 mb-6">
        <button
          @click="settingsTab = 'widget'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="settingsTab === 'widget'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          Widget Setup
        </button>
        <button
          @click="settingsTab = 'quick-replies'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="settingsTab === 'quick-replies'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          Quick Replies
        </button>
      </div>

      <div v-if="settingsTab === 'widget'" class="bg-white rounded-lg shadow p-6 space-y-6">

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bubble Color</label>
          <div class="flex items-center gap-3">
            <input type="color" v-model="bubbleColor" class="w-10 h-10 rounded cursor-pointer border border-gray-300" />
            <span class="text-sm text-gray-500 font-mono">{{ bubbleColor }}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
          <textarea v-model="welcomeMessage" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Hello! How can we help you today?" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Offline Message</label>
          <textarea v-model="offlineMessage" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="We're currently offline. Leave a message!" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bubble Size</label>
          <select v-model="bubbleSize" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bubble Pattern</label>
          <select v-model="bubblePattern" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
            <option value="stripes">Stripes</option>
            <option value="dots">Dots</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Widget Position</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="block">
              <span class="block text-xs text-gray-500 mb-1">X offset</span>
              <input v-model.number="widgetPositionX" type="number" min="0" step="1" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </label>
            <label class="block">
              <span class="block text-xs text-gray-500 mb-1">Y offset</span>
              <input v-model.number="widgetPositionY" type="number" min="0" step="1" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </label>
          </div>
          <p class="text-xs text-gray-400 mt-1">These are the widget's top-left screen coordinates. Visitors can still drag the widget, and their browser will keep the last position locally.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bubble Icon</label>
          <div class="flex items-center gap-4 mb-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="bubbleIconType" value="emoji" class="accent-indigo-600" />
              Emoji
            </label>
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" v-model="bubbleIconType" value="custom" class="accent-indigo-600" />
              Custom Image
            </label>
          </div>
          <div v-if="bubbleIconType === 'emoji'" class="flex items-center gap-2">
            <select v-model="bubbleIconEmoji" class="border border-gray-300 rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option v-for="e in emojiOptions" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
          <div v-else class="flex items-center gap-3">
            <img v-if="bubbleIconUrl" :src="bubbleIconUrl" class="w-10 h-10 rounded object-cover border border-gray-200" />
            <button @click="iconFileInput?.click()" :disabled="isUploadingIcon" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50">
              {{ isUploadingIcon ? 'Uploading...' : 'Upload Image' }}
            </button>
            <input ref="iconFileInput" type="file" accept="image/*" class="hidden" @change="uploadCustomIcon" />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Widget Visibility</label>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Show Admin Widget</label>
                  <p class="text-xs text-gray-400">Show agent widget for team members to receive messages</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="showAdminWidget" class="sr-only peer" @change="saveSettings">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Show Visitor Widget</label>
                  <p class="text-xs text-gray-400">Show chat widget on your website for visitors</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="showVisitorWidget" class="sr-only peer" @change="saveSettings">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Read Receipts</label>
              <div class="inline-flex rounded-md overflow-hidden border border-gray-300 text-sm">
                <button
                  type="button"
                  :class="[
                    'px-4 py-1.5 font-medium transition-colors',
                    !enableReadReceipts
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  ]"
                  @click="enableReadReceipts = false"
                >Off</button>
                <button
                  type="button"
                  :class="[
                    'px-4 py-1.5 font-medium transition-colors',
                    enableReadReceipts
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  ]"
                  @click="enableReadReceipts = true"
                >On</button>
              </div>
              <p class="text-xs text-gray-400 mt-1">When on, agents can see if customers have read their messages. Customers never see read receipts.</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Human Agent Status</label>
            <div class="inline-flex rounded-md overflow-hidden border border-gray-300 text-sm">
              <button
                type="button"
                :class="[
                  'px-4 py-1.5 font-medium transition-colors',
                  isOfflineMode
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
                @click="isOfflineMode = true"
              >Offline</button>
              <button
                type="button"
                :class="[
                  'px-4 py-1.5 font-medium transition-colors',
                  !isOfflineMode
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
                @click="isOfflineMode = false"
              >Online</button>
            </div>
            <p class="text-xs text-gray-400 mt-1">When offline, human agents are unavailable. If AI agent is active, customers can still chat with AI.</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notification Sound</label>
          <div class="flex items-center gap-3">
            <button @click="soundFileInput?.click()" :disabled="isUploadingSound" class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50">
              {{ isUploadingSound ? 'Uploading...' : 'Upload Sound' }}
            </button>
            <input ref="soundFileInput" type="file" accept="audio/*" class="hidden" @change="uploadCustomSound" />
            <template v-if="notificationSoundUrl">
              <button @click="playSound" class="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md">Play</button>
              <button @click="removeSound" class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md">Remove</button>
            </template>
            <span v-else class="text-sm text-gray-400">No sound uploaded</span>
          </div>
        </div>

        <div class="pt-2">
          <button @click="saveSettings" class="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Save Settings
          </button>
        </div>
      </div>

      <div v-if="settingsTab === 'quick-replies'" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Quick Replies</h2>
          <button @click="startAddQuickReply" class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Add Quick Reply
          </button>
        </div>

        <div v-if="editingQuickReplyId" class="mb-6 border border-indigo-200 rounded-md p-4 bg-indigo-50/30 space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input v-model="qrDraftTitle" @input="handleQrTitleInput" type="text" maxlength="200" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Greeting" />
            <div class="text-xs text-gray-400 mt-1">{{ qrDraftTitle.length }}/200</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea v-model="qrDraftContent" @input="handleQrContentInput" rows="3" maxlength="1000" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Reply content..." />
            <div class="text-xs text-gray-400 mt-1">{{ qrDraftContent.length }}/1000</div>
          </div>
          <div class="flex gap-2">
            <button :disabled="!qrDraftTitle.trim()" @click="saveQuickReply" class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {{ editingQuickReplyId === '__new__' ? 'Create' : 'Update' }}
            </button>
            <button @click="cancelEditQuickReply" class="px-4 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>

        <div v-if="quickReplies.length === 0 && !editingQuickReplyId" class="text-sm text-gray-400 py-8 text-center">
          No quick replies yet.
        </div>
        <ul class="divide-y divide-gray-100">
          <li v-for="qr in quickReplies" :key="qr.id" class="py-3 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ qr.title }}</p>
              <p class="text-sm text-gray-500 truncate">{{ qr.content }}</p>
            </div>
            <div class="flex gap-1 shrink-0">
              <button @click="startEditQuickReply(qr)" class="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded">Edit</button>
              <button @click="deleteQuickReply(qr.id)" class="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
