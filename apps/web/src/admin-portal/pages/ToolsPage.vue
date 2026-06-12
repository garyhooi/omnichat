<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAiStore } from '../stores/ai.store'

const aiStore = useAiStore()
const deleting = ref<string | null>(null)

// --- External tool form ---
const editingId = ref<string | null>(null)
const saving = ref(false)
const draftName = ref('')
const draftDescription = ref('')
const draftParams = ref('')
const draftEndpoint = ref('')
const draftAuthType = ref('none')
const draftAuthConfig = ref('')
const draftIsActive = ref(true)

const authConfigPlaceholder = computed(() =>
  draftAuthType.value === 'static'
    ? '{"token": "my-token"}'
    : '{"tokenUrl": "https://..."}'
)

function startAdd() {
  editingId.value = '__new__'
  draftName.value = ''
  draftDescription.value = ''
  draftParams.value = '{\n  "orderId": { "type": "string", "description": "The order ID" }\n}'
  draftEndpoint.value = ''
  draftAuthType.value = 'token-exchange'
  draftAuthConfig.value = '{\n  "tokenUrl": "https://your-api.com/auth/token"\n}'
  draftIsActive.value = true
}

function startEdit(tool: any) {
  editingId.value = tool.id
  draftName.value = tool.name
  draftDescription.value = tool.description
  draftParams.value = tool.parametersSchema
  draftEndpoint.value = tool.endpoint || ''
  draftAuthType.value = tool.authType || 'none'
  draftAuthConfig.value = tool.authConfig || ''
  draftIsActive.value = tool.isActive
}

function cancelEdit() {
  editingId.value = null
}

async function saveTool() {
  if (!draftName.value || !draftDescription.value || !draftEndpoint.value) return
  saving.value = true
  try {
    let paramsSchema: Record<string, any> = {}
    if (draftParams.value) {
      try { paramsSchema = JSON.parse(draftParams.value) } catch { /* ignore */ }
    }
    let authConfig: Record<string, any> | undefined
    if (draftAuthType.value !== 'none' && draftAuthConfig.value) {
      try { authConfig = JSON.parse(draftAuthConfig.value) } catch { /* ignore */ }
    }
    const data = {
      name: draftName.value,
      description: draftDescription.value,
      parametersSchema: paramsSchema,
      handlerType: 'external',
      endpoint: draftEndpoint.value || undefined,
      authType: draftAuthType.value,
      authConfig,
      isActive: draftIsActive.value,
    }
    if (editingId.value === '__new__') {
      await aiStore.createTool(data)
    } else {
      await aiStore.updateTool(editingId.value!, data)
    }
    cancelEdit()
  } finally {
    saving.value = false
  }
}

const builtinTools = [
  {
    name: 'search_knowledge_base',
    description: 'Searches uploaded FAQ documents for relevant answers',
    type: 'builtin',
    active: true,
  },
  {
    name: 'transfer_to_human',
    description: 'Transfers the conversation to a human agent',
    type: 'builtin',
    active: true,
  },
  {
    name: 'check_human_availability',
    description: 'Checks if human agents are currently online and available to handle conversations before attempting a transfer.',
    type: 'builtin',
    active: true,
  },
  {
    name: 'ip_spam_blacklist',
    description: 'Built-in backend protection that temporarily blacklists IPs when the same IP repeatedly spams the AI across conversations.',
    type: 'builtin',
    active: true,
  },
]

onMounted(() => {
  aiStore.loadTools()
})

async function deleteTool(id: string) {
  if (!confirm('Delete this external tool? This cannot be undone.')) return
  deleting.value = id
  try {
    await aiStore.deleteTool(id)
  } finally {
    deleting.value = null
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Tool Registry</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Built-in Tools</h2>
      <p class="text-sm text-gray-500 mb-4">
        These tools are available to the AI agent by default.
      </p>
      <div class="space-y-3">
        <div v-for="tool in builtinTools" :key="tool.name"
             class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div class="flex items-center gap-2">
              <code class="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{{ tool.name }}</code>
              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{{ tool.type }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ tool.description }}</p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">External Tools</h2>
        <button v-if="!editingId" @click="startAdd"
                class="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          + Add External Tool
        </button>
      </div>
      <p class="text-sm text-gray-500 mb-4">
        Register custom tools that the AI can call. External tools are invoked via HTTP POST to your endpoint.
      </p>

      <div v-if="editingId" class="bg-gray-50 border rounded-lg p-4 mb-4 space-y-3">
        <h3 class="text-sm font-semibold text-gray-700">
          {{ editingId === '__new__' ? 'New External Tool' : 'Edit External Tool' }}
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Name <span class="text-red-500">*</span></label>
            <input v-model="draftName" class="w-full text-sm border rounded px-2 py-1.5" placeholder="check_order_status" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Endpoint URL <span class="text-red-500">*</span></label>
            <input v-model="draftEndpoint" class="w-full text-sm border rounded px-2 py-1.5" placeholder="https://your-api.com/tools/..." />
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Description <span class="text-red-500">*</span></label>
            <input v-model="draftDescription" class="w-full text-sm border rounded px-2 py-1.5" placeholder="What does this tool do?" />
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Parameters Schema (JSON)</label>
            <textarea v-model="draftParams" rows="3" class="w-full text-sm font-mono border rounded px-2 py-1.5"
                      placeholder='{"orderId": {"type": "string", "description": "The order ID"}}'></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Auth Type</label>
            <select v-model="draftAuthType" class="w-full text-sm border rounded px-2 py-1.5">
              <option value="none">None</option>
              <option value="static">Static Token</option>
              <option value="token-exchange">Token Exchange</option>
            </select>
          </div>
          <div v-if="draftAuthType !== 'none'">
            <label class="block text-xs font-medium text-gray-600 mb-1">
              {{ draftAuthType === 'static' ? 'Auth Config ({"token":"..."})' : 'Auth Config ({"tokenUrl":"..."})' }}
            </label>
            <input v-model="draftAuthConfig" class="w-full text-sm font-mono border rounded px-2 py-1.5"
                   :placeholder="authConfigPlaceholder" />
          </div>
          <div class="flex items-center gap-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="draftIsActive" class="sr-only peer">
              <div class="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4"></div>
            </label>
            <span class="text-sm text-gray-600">Active</span>
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <button @click="saveTool" :disabled="saving"
                  class="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
            {{ saving ? 'Saving...' : (editingId === '__new__' ? 'Create Tool' : 'Save Changes') }}
          </button>
          <button @click="cancelEdit"
                  class="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>

      <div v-if="aiStore.tools.length === 0 && !editingId" class="bg-gray-50 border-2 border-dashed rounded-lg p-8 text-center">
        <p class="text-gray-400 mb-2">No external tools registered</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="tool in aiStore.tools" :key="tool.id"
             class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div class="flex items-center gap-2">
              <code class="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{{ tool.name }}</code>
              <span class="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">external</span>
              <span v-if="tool.isActive" class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
              <span v-else class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">{{ tool.description }}</p>
            <p v-if="tool.endpoint" class="text-xs text-gray-400 mt-0.5 font-mono">{{ tool.endpoint }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="startEdit(tool)" :disabled="editingId !== null"
                    class="text-xs px-3 py-1.5 border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-50 disabled:opacity-50">
              Edit
            </button>
            <button @click="deleteTool(tool.id)" :disabled="deleting === tool.id"
                    class="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 disabled:opacity-50">
              {{ deleting === tool.id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
