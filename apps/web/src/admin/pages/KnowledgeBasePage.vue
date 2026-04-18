<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAiStore } from '../stores/ai.store'
import { useAuthStore } from '../stores/auth.store'

const aiStore = useAiStore()
const authStore = useAuthStore()

const isDragging = ref(false)
const uploading = ref(false)
const uploadTitle = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Search test
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searching = ref(false)

const templates = [
  { name: 'Company Info', file: 'company-info.md', desc: 'Company details, contact info, hours' },
  { name: 'Product FAQ', file: 'product-faq.md', desc: 'Product questions and answers' },
  { name: 'Return Policy', file: 'return-policy.md', desc: 'Refund and exchange policies' },
  { name: 'General FAQ', file: 'general-faq.md', desc: 'Common questions and answers' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

onMounted(() => {
  aiStore.loadDocuments()
})

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function handleUpload(files: FileList | null) {
  if (!files?.length) return
  uploading.value = true
  try {
    for (const file of Array.from(files)) {
      await aiStore.uploadDocument(file, uploadTitle.value || undefined)
    }
    uploadTitle.value = ''
  } catch (e: any) {
    aiStore.error = e.message
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  handleUpload(e.dataTransfer?.files || null)
}

async function deleteDoc(id: string) {
  if (confirm('Delete this document and all its embeddings?')) {
    await aiStore.deleteDocument(id)
  }
}

async function testSearch() {
  if (!searchQuery.value.trim()) return
  searching.value = true
  try {
    searchResults.value = await aiStore.searchKnowledge(searchQuery.value, 5)
  } catch (e: any) {
    aiStore.error = e.message
  } finally {
    searching.value = false
  }
}

function downloadTemplate(filename: string) {
  window.open(`${authStore.serverUrl}/rag-templates/${filename}`, '_blank')
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Knowledge Base</h1>

    <!-- Error Banner -->
    <div v-if="aiStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ aiStore.error }}
      <button @click="aiStore.error = null" class="float-right font-bold">&times;</button>
    </div>

    <!-- Upload Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Upload Documents</h2>
      <p class="text-sm text-gray-500 mb-4">
        Upload FAQ documents to train the AI agent. Supported formats: TXT, MD, PDF, DOCX, CSV (max 10MB).
      </p>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Document Title (optional)</label>
        <input v-model="uploadTitle" type="text" placeholder="e.g. Return Policy FAQ"
               class="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
        @click="fileInput?.click()"
      >
        <div v-if="uploading" class="text-indigo-600">
          <svg class="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Processing...
        </div>
        <div v-else>
          <p class="text-gray-500">Drag & drop files here or click to browse</p>
          <p class="text-xs text-gray-400 mt-1">TXT, MD, PDF, DOCX, CSV</p>
        </div>
        <input ref="fileInput" type="file" class="hidden" multiple
               accept=".txt,.md,.pdf,.docx,.csv"
               @change="handleUpload(($event.target as HTMLInputElement).files)" />
      </div>
    </div>

    <!-- Templates Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">FAQ Templates</h2>
      <p class="text-sm text-gray-500 mb-4">
        Download pre-made templates, fill them in with your business information, and upload them.
      </p>
      <div class="grid grid-cols-2 gap-3">
        <button v-for="tpl in templates" :key="tpl.file"
                @click="downloadTemplate(tpl.file)"
                class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left">
          <span class="text-2xl">📄</span>
          <div>
            <div class="font-medium text-sm">{{ tpl.name }}</div>
            <div class="text-xs text-gray-400">{{ tpl.desc }}</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Document List -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Documents ({{ aiStore.documents.length }})</h2>
      <div v-if="aiStore.documents.length === 0" class="text-gray-400 text-center py-8">
        No documents uploaded yet.
      </div>
      <div v-else class="space-y-2">
        <div v-for="doc in aiStore.documents" :key="doc.id"
             class="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div class="font-medium text-sm">{{ doc.title }}</div>
            <div class="text-xs text-gray-400">
              {{ doc.fileName }} &middot; {{ formatFileSize(doc.fileSize) }} &middot; {{ doc.chunkCount }} chunks
            </div>
            <div v-if="doc.errorMessage" class="text-xs text-red-500 mt-1">{{ doc.errorMessage }}</div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['text-xs px-2 py-0.5 rounded-full', statusColors[doc.embeddingStatus]]">
              {{ doc.embeddingStatus }}
            </span>
            <button @click="deleteDoc(doc.id)" class="text-red-500 hover:text-red-700 text-xs">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Test -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Test Search</h2>
      <div class="flex gap-2 mb-4">
        <input v-model="searchQuery" type="text" placeholder="Test a search query..."
               class="flex-1 border rounded px-3 py-2 text-sm"
               @keydown.enter="testSearch" />
        <button @click="testSearch" :disabled="searching"
                class="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
          {{ searching ? 'Searching...' : 'Search' }}
        </button>
      </div>
      <div v-if="searchResults.length > 0" class="space-y-2">
        <div v-for="(result, i) in searchResults" :key="i"
             class="p-3 border rounded-lg text-sm">
          <div class="flex justify-between mb-1">
            <span class="font-medium text-gray-600">Result {{ i + 1 }}</span>
            <span class="text-xs text-gray-400">Score: {{ (result.score * 100).toFixed(1) }}%</span>
          </div>
          <p class="text-gray-700 whitespace-pre-wrap">{{ result.content }}</p>
        </div>
      </div>
      <div v-else-if="searchQuery && !searching" class="text-gray-400 text-center py-4">
        No results. Try uploading documents first.
      </div>
    </div>
  </div>
</template>
