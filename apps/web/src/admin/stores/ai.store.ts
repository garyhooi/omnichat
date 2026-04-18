import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth.store'

interface AiProvider {
  id: string
  name: string
  providerType: string
  apiKey: string | null
  baseUrl: string | null
  chatModelId: string
  embeddingModelId: string | null
  isActive: boolean
}

interface AiAgentConfig {
  id: string
  enabled: boolean
  systemPrompt: string
  greetingMessage: string | null
  humanRequestKeywords: string | null
  maxTokensPerResponse: number
  temperature: number
  maxTurnsPerConversation: number
  maxTokensPerSession: number
  ragFailureThreshold: number
  humanRequestThreshold: number
  aiRateLimitPerMinute: number
}

interface KnowledgeDocument {
  id: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  embeddingStatus: string
  errorMessage: string | null
  chunkCount: number
  createdAt: string
}

export const useAiStore = defineStore('ai', () => {
  const authStore = useAuthStore()
  const providers = ref<AiProvider[]>([])
  const agentConfig = ref<AiAgentConfig | null>(null)
  const documents = ref<KnowledgeDocument[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchApi(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }
    if (authStore.token && authStore.token !== 'cookie-auth') {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }
    const res = await fetch(`${authStore.serverUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `HTTP ${res.status}`)
    }
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  // --- Providers ---
  async function loadProviders() {
    try {
      providers.value = await fetchApi('/ai/config/providers')
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function createProvider(data: Partial<AiProvider>) {
    const payload: any = { ...data }
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt
    const result = await fetchApi('/ai/config/providers', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    await loadProviders()
    return result
  }

  async function updateProvider(id: string, data: Partial<AiProvider>) {
    const payload: any = { ...data }
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt
    await fetchApi(`/ai/config/providers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    await loadProviders()
  }

  async function deleteProvider(id: string) {
    await fetchApi(`/ai/config/providers/${id}`, { method: 'DELETE' })
    await loadProviders()
  }

  async function testProvider(id: string) {
    return fetchApi(`/ai/config/providers/${id}/test`, { method: 'POST' })
  }

  // --- Agent Config ---
  async function loadAgentConfig() {
    try {
      agentConfig.value = await fetchApi('/ai/config/agent')
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function saveAgentConfig(data: Partial<AiAgentConfig>) {
    const { id, createdAt, updatedAt, ...payload } = data as any
    agentConfig.value = await fetchApi('/ai/config/agent', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // --- Knowledge Documents ---
  async function loadDocuments() {
    try {
      documents.value = await fetchApi('/ai/knowledge/documents')
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function uploadDocument(file: File, title?: string) {
    const formData = new FormData()
    formData.append('file', file)
    if (title) formData.append('title', title)

    const uploadHeaders: Record<string, string> = {}
    if (authStore.token && authStore.token !== 'cookie-auth') {
      uploadHeaders['Authorization'] = `Bearer ${authStore.token}`
    }
    const res = await fetch(`${authStore.serverUrl}/ai/knowledge/documents`, {
      method: 'POST',
      credentials: 'include',
      headers: uploadHeaders,
      body: formData,
    })
    if (!res.ok) throw new Error('Upload failed')
    await loadDocuments()
    return res.json()
  }

  async function deleteDocument(id: string) {
    await fetchApi(`/ai/knowledge/documents/${id}`, { method: 'DELETE' })
    await loadDocuments()
  }

  async function searchKnowledge(query: string, topK?: number) {
    return fetchApi('/ai/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({ query, topK }),
    })
  }

  return {
    providers, agentConfig, documents, loading, error,
    loadProviders, createProvider, updateProvider, deleteProvider, testProvider,
    loadAgentConfig, saveAgentConfig,
    loadDocuments, uploadDocument, deleteDocument, searchKnowledge,
  }
})
