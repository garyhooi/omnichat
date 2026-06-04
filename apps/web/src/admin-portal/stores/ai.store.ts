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
  spamIpBlacklistMinutes: number
  embeddingProviderId: string | null
  translateProviderId: string | null
  translationEnabled: boolean
  autoTranslationEnabled: boolean
}

interface ToolRegistration {
  id: string
  name: string
  description: string
  parametersSchema: string
  handlerType: string
  endpoint: string | null
  authType: string | null
  authConfig: string | null
  isActive: boolean
  requiredPermission: string | null
  createdAt: string
  updatedAt: string
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
  const tools = ref<ToolRegistration[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchApi(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }
    const accessToken = localStorage.getItem('accessToken')
    const siteToken = localStorage.getItem('siteToken')
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
    if (siteToken) headers['x-external-site-token'] = siteToken
    const res = await fetch(`${authStore.serverUrl}${path}`, {
      ...options,
      headers,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `HTTP ${res.status}`)
    }
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

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

    const uploadHeaders = authStore.getAuthHeaders()
    const res = await fetch(`${authStore.serverUrl}/ai/knowledge/documents`, {
      method: 'POST',
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

  async function loadTools() {
    try {
      tools.value = await fetchApi('/ai/config/tools')
    } catch (e: any) {
      error.value = e.message
    }
  }

  async function createTool(data: {
    name: string
    description: string
    parametersSchema: Record<string, any>
    handlerType?: string
    endpoint?: string
    authType?: string
    authConfig?: Record<string, any>
  }) {
    const result = await fetchApi('/ai/config/tools', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    await loadTools()
    return result
  }

  async function updateTool(id: string, data: Partial<ToolRegistration>) {
    const payload: any = { ...data }
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt
    await fetchApi(`/ai/config/tools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    await loadTools()
  }

  async function deleteTool(id: string) {
    await fetchApi(`/ai/config/tools/${id}`, { method: 'DELETE' })
    await loadTools()
  }

  return {
    providers, agentConfig, documents, tools, loading, error,
    loadProviders, createProvider, updateProvider, deleteProvider, testProvider,
    loadAgentConfig, saveAgentConfig,
    loadDocuments, uploadDocument, deleteDocument, searchKnowledge,
    loadTools, createTool, updateTool, deleteTool,
  }
})
