<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAiStore } from '../stores/ai.store'

const aiStore = useAiStore()
const deleting = ref<string | null>(null)

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

    <!-- Built-in Tools -->
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

    <!-- External Tools -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">External Tools</h2>
      <p class="text-sm text-gray-500 mb-4">
        Register custom tools that the AI can call. External tools are invoked via HTTP POST to your endpoint.
      </p>

      <div v-if="aiStore.tools.length === 0" class="bg-gray-50 border-2 border-dashed rounded-lg p-8 text-center">
        <p class="text-gray-400 mb-2">No external tools registered</p>
        <p class="text-xs text-gray-400">
          External tools can be registered via the API:<br>
          <code class="bg-gray-200 px-1 rounded">POST /ai/config/tools</code>
        </p>
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
          <button @click="deleteTool(tool.id)" :disabled="deleting === tool.id"
                  class="text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 disabled:opacity-50">
            {{ deleting === tool.id ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>

      <!-- Developer Guide -->
      <div class="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Developer Guide: Creating External Tools</h3>
        <div class="text-xs text-gray-600 space-y-2">
          <p>External tools allow the AI agent to call your custom endpoints. Here's how to register one:</p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">POST /ai/config/tools
{
  "name": "check_order_status",
  "description": "Check the status of a customer order",
  "parametersSchema": {
    "orderId": { "type": "string", "description": "The order ID" }
  },
  "handlerType": "external",
  "endpoint": "https://your-api.com/tools/check-order",
  "authType": "token-exchange",
  "authConfig": {
    "tokenUrl": "https://your-api.com/auth/token"
  }
}</pre>
          <p>Your endpoint will receive a POST with the tool arguments as JSON body and must return a JSON response.
          Auth types: <code>none</code>, <code>static</code> (static token), <code>token-exchange</code> (exchange external_auth_token for tool-scoped JWT).</p>
        </div>
      </div>
    </div>
  </div>
</template>
