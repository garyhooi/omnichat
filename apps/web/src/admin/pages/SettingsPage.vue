<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()
const base = () => auth.serverUrl

// --- State ---
const settingsTab = ref<'widget' | 'quick-replies'>('widget')

// Widget settings
const bubbleColor = ref('#4F46E5')
const welcomeMessage = ref('')
const offlineMessage = ref('')
const bubbleSize = ref('medium')
const bubblePattern = ref('solid')
const websitePosition = ref('bottom-right')
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
const settingsSaved = ref(false)
const settingsError = ref('')

// Quick replies
const quickReplies = ref<{ id: string; title: string; content: string }[]>([])
const editingQuickReplyId = ref<string | null>(null)
const qrDraftTitle = ref('')
const qrDraftContent = ref('')

// Emoji options
const emojiOptions = ['💬', '👋', '🤖', '💡', '❓', '🎉', '⭐', '🔔', '📩', '🛎️']

// --- Fetch helpers ---
function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {}
  if (auth.token && auth.token !== 'cookie-auth') {
    h['Authorization'] = `Bearer ${auth.token}`
  }
  return h
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  return fetch(`${base()}${path}`, {
    credentials: 'include',
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers || {}) },
  })
}

// --- Load data ---
async function loadConfig() {
  try {
    const res = await apiFetch('/config/active')
    if (!res.ok) return
    const data = await res.json()
    siteConfigId.value = data.id ?? data._id ?? null
    bubbleColor.value = data.bubbleColor ?? '#4F46E5'
    welcomeMessage.value = data.welcomeMessage ?? ''
    offlineMessage.value = data.offlineMessage ?? ''
    bubbleSize.value = data.bubbleSize ?? 'medium'
    bubblePattern.value = data.bubblePattern ?? 'solid'
    websitePosition.value = data.websitePosition ?? 'bottom-right'
    bubbleIconType.value = data.bubbleIconType ?? 'emoji'
    bubbleIconEmoji.value = data.bubbleIconEmoji ?? '💬'
    bubbleIconUrl.value = data.bubbleIconUrl ?? ''
    enableReadReceipts.value = data.enableReadReceipts ?? false
    isOfflineMode.value = data.isOfflineMode ?? false
    notificationSoundUrl.value = data.notificationSoundUrl ?? ''
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
  settingsSaved.value = false
  settingsError.value = ''
  const body = {
    bubbleColor: bubbleColor.value,
    welcomeMessage: welcomeMessage.value,
    offlineMessage: offlineMessage.value,
    bubbleSize: bubbleSize.value,
    bubblePattern: bubblePattern.value,
    websitePosition: websitePosition.value,
    bubbleIconType: bubbleIconType.value,
    bubbleIconEmoji: bubbleIconEmoji.value,
    bubbleIconUrl: bubbleIconUrl.value,
    enableReadReceipts: enableReadReceipts.value,
    isOfflineMode: isOfflineMode.value,
    notificationSoundUrl: notificationSoundUrl.value,
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
    if (!res.ok) throw new Error('Failed to save')
    const data = await res.json()
    siteConfigId.value = data.id ?? data._id ?? siteConfigId.value
    settingsSaved.value = true
    setTimeout(() => (settingsSaved.value = false), 3000)
  } catch (e: any) {
    settingsError.value = e.message || 'Failed to save settings'
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
      credentials: 'include',
      headers: authHeaders(),
      body: fd,
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    bubbleIconUrl.value = data.url
    bubbleIconType.value = 'custom'
  } catch {
    settingsError.value = 'Icon upload failed'
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
      credentials: 'include',
      headers: authHeaders(),
      body: fd,
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    notificationSoundUrl.value = data.url
  } catch {
    settingsError.value = 'Sound upload failed'
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
  const audio = new Audio(notificationSoundUrl.value)
  audio.play()
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
    settingsError.value = 'Failed to save quick reply'
  }
}

async function deleteQuickReply(id: string) {
  try {
    const res = await apiFetch(`/quick-replies/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error()
    await loadQuickReplies()
  } catch {
    settingsError.value = 'Failed to delete quick reply'
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <!-- Tabs -->
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

      <!-- Feedback banners -->
      <div v-if="settingsSaved" class="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
        Settings saved successfully.
      </div>
      <div v-if="settingsError" class="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex justify-between items-center">
        <span>{{ settingsError }}</span>
        <button @click="settingsError = ''" class="text-red-400 hover:text-red-600">&times;</button>
      </div>

      <!-- Widget Setup Tab -->
      <div v-if="settingsTab === 'widget'" class="bg-white rounded-lg shadow p-6 space-y-6">

        <!-- Bubble Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bubble Color</label>
          <div class="flex items-center gap-3">
            <input type="color" v-model="bubbleColor" class="w-10 h-10 rounded cursor-pointer border border-gray-300" />
            <span class="text-sm text-gray-500 font-mono">{{ bubbleColor }}</span>
          </div>
        </div>

        <!-- Welcome Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
          <textarea v-model="welcomeMessage" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Hello! How can we help you today?" />
        </div>

        <!-- Offline Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Offline Message</label>
          <textarea v-model="offlineMessage" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="We're currently offline. Leave a message!" />
        </div>

        <!-- Bubble Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bubble Size</label>
          <select v-model="bubbleSize" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <!-- Bubble Pattern -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bubble Pattern</label>
          <select v-model="bubblePattern" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
            <option value="stripes">Stripes</option>
            <option value="dots">Dots</option>
          </select>
        </div>

        <!-- Website Position -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Website Position</label>
          <select v-model="websitePosition" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
        </div>

        <!-- Bubble Icon -->
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

        <!-- Checkboxes -->
        <div class="space-y-3">
          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" v-model="enableReadReceipts" class="accent-indigo-600 w-4 h-4" />
            <span class="text-gray-700">Enable Read Receipts</span>
          </label>
          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" v-model="isOfflineMode" class="accent-indigo-600 w-4 h-4" />
            <span class="text-gray-700">Offline Mode</span>
          </label>
        </div>

        <!-- Notification Sound -->
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

        <!-- Save -->
        <div class="pt-2">
          <button @click="saveSettings" class="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Save Settings
          </button>
        </div>
      </div>

      <!-- Quick Replies Tab -->
      <div v-if="settingsTab === 'quick-replies'" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Quick Replies</h2>
          <button @click="startAddQuickReply" class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Add Quick Reply
          </button>
        </div>

        <!-- Edit / Create form -->
        <div v-if="editingQuickReplyId" class="mb-6 border border-indigo-200 rounded-md p-4 bg-indigo-50/30 space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input v-model="qrDraftTitle" type="text" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Greeting" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea v-model="qrDraftContent" rows="3" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Reply content..." />
          </div>
          <div class="flex gap-2">
            <button @click="saveQuickReply" class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              {{ editingQuickReplyId === '__new__' ? 'Create' : 'Update' }}
            </button>
            <button @click="cancelEditQuickReply" class="px-4 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>

        <!-- List -->
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
