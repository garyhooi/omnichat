<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAiStore } from '../stores/ai.store'

const aiStore = useAiStore()
const saving = ref(false)
const testResult = ref<{ success: boolean; error?: string } | null>(null)
const testingId = ref<string | null>(null)

const defaultHumanRequestKeywords = [
  'human',
  'real person',
  'real agent',
  'live agent',
  'live chat',
  'speak to someone',
  'talk to someone',
  'representative',
  'operator',
  'support agent',
  'customer service',
  'actual person',
  'not a bot',
  'not a robot',
  'stop bot',
  'real human',
  'connect me to',
  'transfer me to',
  'let me talk to',
].join(', ')

// Provider form
const showProviderForm = ref(false)
const editingProvider = ref<any>(null)
const providerForm = ref({
  name: '',
  providerType: 'openai',
  apiKey: '',
  baseUrl: '',
  chatModelId: '',
  embeddingModelId: '',
})

// Agent config form
const configForm = ref({
  enabled: false,
  systemPrompt: 'You are a helpful customer support AI Agent. Be concise and helpful.',
  greetingMessage: '',
  humanRequestKeywords: defaultHumanRequestKeywords,
  maxTokensPerResponse: 1024,
  temperature: 0.7,
  maxTurnsPerConversation: 50,
  maxTokensPerSession: 50000,
  ragFailureThreshold: 2,
  humanRequestThreshold: 2,
  aiRateLimitPerMinute: 10,
  spamIpBlacklistMinutes: 15,
  embeddingProviderId: null as string | null,
})

const providerTypes = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'ollama', label: 'Ollama (Local)' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'gemini', label: 'Gemini (Google)' },
  { value: 'grok', label: 'Grok (xAI)' },
]

const hasActiveProvider = computed(() => aiStore.providers.some((p) => p.isActive))

onMounted(async () => {
  await Promise.all([aiStore.loadProviders(), aiStore.loadAgentConfig()])
  if (aiStore.agentConfig) {
    Object.assign(configForm.value, aiStore.agentConfig)
    if (!configForm.value.humanRequestKeywords) {
      configForm.value.humanRequestKeywords = defaultHumanRequestKeywords
    }
  }
})

function openProviderForm(provider?: any) {
  if (provider) {
    editingProvider.value = provider
    providerForm.value = {
      name: provider.name,
      providerType: provider.providerType,
      apiKey: '',
      baseUrl: provider.baseUrl || '',
      chatModelId: provider.chatModelId,
      embeddingModelId: provider.embeddingModelId || '',
    }
  } else {
    editingProvider.value = null
    providerForm.value = {
      name: '', providerType: 'openai', apiKey: '', baseUrl: '',
      chatModelId: '', embeddingModelId: '',
    }
  }
  showProviderForm.value = true
}

async function saveProvider() {
  saving.value = true
  try {
    const payload = {
      name: providerForm.value.name,
      providerType: providerForm.value.providerType,
      apiKey: providerForm.value.apiKey,
      baseUrl: providerForm.value.baseUrl,
      chatModelId: providerForm.value.chatModelId,
      embeddingModelId: providerForm.value.embeddingModelId,
    }
    if (editingProvider.value) {
      if (!payload.apiKey) delete payload.apiKey // Don't overwrite if empty
      await aiStore.updateProvider(editingProvider.value.id, payload)
    } else {
      await aiStore.createProvider(payload)
    }
    showProviderForm.value = false
  } catch (e: any) {
    aiStore.error = e.message
  } finally {
    saving.value = false
  }
}

async function toggleActive(provider: any) {
  await aiStore.updateProvider(provider.id, { isActive: !provider.isActive })
}

async function testConnection(id: string) {
  testingId.value = id
  testResult.value = null
  try {
    testResult.value = await aiStore.testProvider(id)
  } catch (e: any) {
    testResult.value = { success: false, error: e.message }
  } finally {
    testingId.value = null
  }
}

async function removeProvider(id: string) {
  if (confirm('Delete this provider?')) {
    await aiStore.deleteProvider(id)
  }
}

async function saveConfig() {
  saving.value = true
  try {
    await aiStore.saveAgentConfig(configForm.value)
  } catch (e: any) {
    aiStore.error = e.message
  } finally {
    saving.value = false
  }
}

const systemPromptLength = computed(() => configForm.value.systemPrompt?.length || 0)
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">AI Agent Setup</h1>

    <!-- Error Banner -->
    <div v-if="aiStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ aiStore.error }}
      <button @click="aiStore.error = null" class="float-right font-bold">&times;</button>
    </div>

    <!-- AI Enable/Disable Toggle -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">AI Agent</h2>
          <p class="text-sm text-gray-500">
            {{ configForm.enabled ? 'AI is handling visitor conversations' : 'All conversations go to human agents' }}
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="configForm.enabled" class="sr-only peer" @change="saveConfig">
          <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>
      <div v-if="configForm.enabled && !hasActiveProvider" class="mt-3 text-amber-600 text-sm bg-amber-50 p-3 rounded">
        Warning: No active AI provider configured. Add and activate a provider below.
      </div>
    </div>

    <!-- AI Providers Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">AI Providers</h2>
        <button @click="openProviderForm()" class="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
          + Add Provider
        </button>
      </div>

      <!-- Provider List -->
      <div v-if="aiStore.providers.length === 0" class="text-gray-400 text-center py-8">
        No providers configured. Add one to get started.
      </div>
      <div v-else class="space-y-3">
        <div v-for="provider in aiStore.providers" :key="provider.id"
             class="flex items-center justify-between p-4 border rounded-lg"
             :class="provider.isActive ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ provider.name }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full"
                    :class="provider.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ provider.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ provider.providerType }} &middot; {{ provider.chatModelId }}
              <span v-if="provider.embeddingModelId"> &middot; embed: {{ provider.embeddingModelId }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="testConnection(provider.id)"
                    :disabled="testingId === provider.id"
                    class="text-xs px-3 py-1.5 border rounded hover:bg-gray-50 disabled:opacity-50">
              {{ testingId === provider.id ? 'Testing...' : 'Test' }}
            </button>
            <button @click="toggleActive(provider)"
                    class="text-xs px-3 py-1.5 border rounded hover:bg-gray-50">
              {{ provider.isActive ? 'Deactivate' : 'Activate' }}
            </button>
            <button @click="openProviderForm(provider)" class="text-xs px-3 py-1.5 border rounded hover:bg-gray-50">Edit</button>
            <button @click="removeProvider(provider.id)" class="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50">Delete</button>
          </div>
        </div>
      </div>

      <!-- Test Result -->
      <div v-if="testResult" class="mt-3 p-3 rounded text-sm"
           :class="testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        {{ testResult.success ? 'Connection successful!' : `Connection failed: ${testResult.error}` }}
      </div>
    </div>

    <!-- Provider Form Modal -->
    <div v-if="showProviderForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ editingProvider ? 'Edit' : 'Add' }} Provider</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="providerForm.name" type="text" placeholder="e.g. My OpenAI"
                   class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Provider Type</label>
            <select v-model="providerForm.providerType" class="w-full border rounded px-3 py-2 text-sm">
              <option v-for="pt in providerTypes" :key="pt.value" :value="pt.value">{{ pt.label }}</option>
            </select>
          </div>
          <div v-if="providerForm.providerType !== 'ollama'">
            <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input v-model="providerForm.apiKey" type="password"
                   :placeholder="editingProvider ? 'Leave blank to keep current' : 'sk-...'"
                   class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Base URL (optional)</label>
            <input v-model="providerForm.baseUrl" type="text"
                   :placeholder="providerForm.providerType === 'ollama' ? 'http://localhost:11434/api' : 'Leave blank for default'"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Chat Model ID</label>
            <input v-model="providerForm.chatModelId" type="text" placeholder="e.g. gpt-4o"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Embedding Model ID (optional)</label>
            <input v-model="providerForm.embeddingModelId" type="text" placeholder="e.g. text-embedding-3-small"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showProviderForm = false" class="px-4 py-2 border rounded text-sm hover:bg-gray-50">Cancel</button>
          <button @click="saveProvider" :disabled="saving" class="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Agent Configuration -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Agent Configuration</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            System Prompt
            <span class="text-gray-400 ml-1">({{ systemPromptLength }} chars)</span>
          </label>
          <textarea v-model="configForm.systemPrompt" rows="5"
                    class="w-full border rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500"
                    placeholder="You are a helpful customer support assistant..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Greeting Message (optional)</label>
          <input v-model="configForm.greetingMessage" type="text"
                  placeholder="Hi! I'm your AI Agent. How can I help?"
                  class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Temperature ({{ configForm.temperature }})</label>
            <input v-model.number="configForm.temperature" type="range" min="0" max="2" step="0.1" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Tokens/Response</label>
            <input v-model.number="configForm.maxTokensPerResponse" type="number" min="64" max="16384"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Turns/Conversation</label>
            <input v-model.number="configForm.maxTurnsPerConversation" type="number" min="1" max="200"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Tokens/Session</label>
            <input v-model.number="configForm.maxTokensPerSession" type="number" min="1000"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">RAG Failure Threshold</label>
            <input v-model.number="configForm.ragFailureThreshold" type="number" min="1" max="10"
                   class="w-full border rounded px-3 py-2 text-sm" />
            <p class="text-xs text-gray-400 mt-1">Consecutive zero-result RAG searches before handoff</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Human Request Threshold</label>
            <input v-model.number="configForm.humanRequestThreshold" type="number" min="1" max="10"
                   class="w-full border rounded px-3 py-2 text-sm" />
            <p class="text-xs text-gray-400 mt-1">Times visitor asks for human before auto-handoff</p>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Human Request Keywords</label>
            <textarea v-model="configForm.humanRequestKeywords" rows="4"
                      class="w-full border rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500"
                      placeholder="Comma-separated phrases"></textarea>
            <p class="text-xs text-gray-400 mt-1">Comma-separated phrases that trigger human handoff.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">AI Rate Limit/Minute</label>
            <input v-model.number="configForm.aiRateLimitPerMinute" type="number" min="1" max="60"
                   class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Spam IP Blacklist (Minutes)</label>
            <input v-model.number="configForm.spamIpBlacklistMinutes" type="number" min="1" max="1440"
                   class="w-full border rounded px-3 py-2 text-sm" />
            <p class="text-xs text-gray-400 mt-1">If the same IP repeatedly spams AI across conversations, block that IP for this many minutes.</p>
          </div>
        </div>

        <!-- Embedding Provider -->
        <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-1">Embedding Provider (for Knowledge Base / RAG)</label>
          <select v-model="configForm.embeddingProviderId"
                  class="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500">
            <option :value="null">Use active chat provider</option>
            <option v-for="p in aiStore.providers" :key="p.id" :value="p.id">
              {{ p.name }} ({{ p.providerType }} — {{ p.embeddingModelId || 'default model' }})
            </option>
          </select>
          <p class="text-xs text-gray-400 mt-1">
            Some providers (DeepSeek, Anthropic, Grok) don't support embeddings.
            Select a provider that supports embeddings (OpenAI, Ollama, Gemini, Qwen) for Knowledge Base to work.
          </p>
        </div>

        <div class="flex justify-end mt-4">
          <button @click="saveConfig" :disabled="saving"
                  class="px-6 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
            {{ saving ? 'Saving...' : 'Save Configuration' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
