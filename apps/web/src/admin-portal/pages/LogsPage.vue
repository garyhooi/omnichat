<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()
const base = () => auth.serverUrl

// --- State ---
const activeTab = ref<'http' | 'ai' | 'tool'>('http')

// HTTP logs
const httpLogs = ref<any[]>([])
const httpTotal = ref(0)
const httpPage = ref(1)
const httpLimit = ref(50)
const httpTotalPages = ref(0)
const httpLoading = ref(false)
const httpStartDate = ref('')
const httpEndDate = ref('')
const httpMethodFilter = ref('')
const httpSearch = ref('')
const httpExpandedId = ref<string | null>(null)

// AI logs
const aiLogs = ref<any[]>([])
const aiTotal = ref(0)
const aiPage = ref(1)
const aiLimit = ref(50)
const aiTotalPages = ref(0)
const aiLoading = ref(false)
const aiStartDate = ref('')
const aiEndDate = ref('')
const aiEventTypeFilter = ref('')
const aiSearch = ref('')
const aiExpandedId = ref<string | null>(null)

// Tool logs
const toolLogs = ref<any[]>([])
const toolTotal = ref(0)
const toolPage = ref(1)
const toolLimit = ref(50)
const toolTotalPages = ref(0)
const toolLoading = ref(false)
const toolStartDate = ref('')
const toolEndDate = ref('')
const toolNameFilter = ref('')
const handlerTypeFilter = ref('')
const successFilter = ref('')
const toolSearch = ref('')
const toolExpandedId = ref<string | null>(null)

function authHeaders(): Record<string, string> {
  return auth.getAuthHeaders()
}

async function apiFetch(path: string) {
  return fetch(`${base()}${path}`, {
    headers: { ...authHeaders() },
  })
}

async function loadHttpLogs() {
  httpLoading.value = true
  try {
    const params = new URLSearchParams()
    params.set('page', String(httpPage.value))
    params.set('limit', String(httpLimit.value))
    if (httpStartDate.value) params.set('startDate', httpStartDate.value)
    if (httpEndDate.value) params.set('endDate', httpEndDate.value)
    if (httpMethodFilter.value) params.set('method', httpMethodFilter.value)
    if (httpSearch.value) params.set('search', httpSearch.value)
    const res = await apiFetch(`/logs/http?${params}`)
    if (!res.ok) return
    const data = await res.json()
    httpLogs.value = data.data
    httpTotal.value = data.total
    httpTotalPages.value = data.totalPages
  } catch { /* ignore */ } finally {
    httpLoading.value = false
  }
}

async function loadAiLogs() {
  aiLoading.value = true
  try {
    const params = new URLSearchParams()
    params.set('page', String(aiPage.value))
    params.set('limit', String(aiLimit.value))
    if (aiStartDate.value) params.set('startDate', aiStartDate.value)
    if (aiEndDate.value) params.set('endDate', aiEndDate.value)
    if (aiEventTypeFilter.value) params.set('eventType', aiEventTypeFilter.value)
    if (aiSearch.value) params.set('search', aiSearch.value)
    const res = await apiFetch(`/logs/ai?${params}`)
    if (!res.ok) return
    const data = await res.json()
    aiLogs.value = data.data
    aiTotal.value = data.total
    aiTotalPages.value = data.totalPages
  } catch { /* ignore */ } finally {
    aiLoading.value = false
  }
}

async function loadToolLogs() {
  toolLoading.value = true
  try {
    const params = new URLSearchParams()
    params.set('page', String(toolPage.value))
    params.set('limit', String(toolLimit.value))
    if (toolStartDate.value) params.set('startDate', toolStartDate.value)
    if (toolEndDate.value) params.set('endDate', toolEndDate.value)
    if (toolNameFilter.value) params.set('toolName', toolNameFilter.value)
    if (handlerTypeFilter.value) params.set('handlerType', handlerTypeFilter.value)
    if (successFilter.value) params.set('success', successFilter.value)
    if (toolSearch.value) params.set('search', toolSearch.value)
    const res = await apiFetch(`/logs/tool?${params}`)
    if (!res.ok) return
    const data = await res.json()
    toolLogs.value = data.data
    toolTotal.value = data.total
    toolTotalPages.value = data.totalPages
  } catch { /* ignore */ } finally {
    toolLoading.value = false
  }
}

function applyHttpFilters() {
  httpPage.value = 1
  loadHttpLogs()
}

function clearHttpFilters() {
  httpStartDate.value = ''
  httpEndDate.value = ''
  httpMethodFilter.value = ''
  httpSearch.value = ''
  httpPage.value = 1
  loadHttpLogs()
}

function applyAiFilters() {
  aiPage.value = 1
  loadAiLogs()
}

function clearAiFilters() {
  aiStartDate.value = ''
  aiEndDate.value = ''
  aiEventTypeFilter.value = ''
  aiSearch.value = ''
  aiPage.value = 1
  loadAiLogs()
}

function applyToolFilters() {
  toolPage.value = 1
  loadToolLogs()
}

function clearToolFilters() {
  toolStartDate.value = ''
  toolEndDate.value = ''
  toolNameFilter.value = ''
  handlerTypeFilter.value = ''
  successFilter.value = ''
  toolSearch.value = ''
  toolPage.value = 1
  loadToolLogs()
}

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}

function statusColor(code: number | null) {
  if (!code) return '#6b7280'
  if (code < 300) return '#16a34a'
  if (code < 400) return '#d97706'
  return '#dc2626'
}

function toggleHttpExpand(id: string) {
  httpExpandedId.value = httpExpandedId.value === id ? null : id
}

function toggleAiExpand(id: string) {
  aiExpandedId.value = aiExpandedId.value === id ? null : id
}

function toggleToolExpand(id: string) {
  toolExpandedId.value = toolExpandedId.value === id ? null : id
}

function tryParseJson(str: string | null | undefined): string {
  if (!str) return ''
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

onMounted(() => {
  loadHttpLogs()
  loadAiLogs()
  loadToolLogs()
})

watch(activeTab, () => {
  if (activeTab.value === 'http') loadHttpLogs()
  else if (activeTab.value === 'ai') loadAiLogs()
  else loadToolLogs()
})
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">System Logs</h1>

      <div class="flex gap-2 mb-6">
        <button
          @click="activeTab = 'http'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'http' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >HTTP Request Logs</button>
        <button
          @click="activeTab = 'ai'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >AI Logs</button>
        <button
          @click="activeTab = 'tool'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'tool' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >Tool Calling</button>
      </div>

      <div v-if="activeTab === 'http'">
        <div class="bg-white rounded-lg shadow p-4 mb-4">
          <div class="flex flex-wrap gap-3 items-end">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Start Date</label>
              <input type="datetime-local" v-model="httpStartDate" class="border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">End Date</label>
              <input type="datetime-local" v-model="httpEndDate" class="border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Method</label>
              <select v-model="httpMethodFilter" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                <option value="">All</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">URL Search</label>
              <input type="text" v-model="httpSearch" placeholder="e.g. /config" class="border border-gray-300 rounded px-2 py-1.5 text-sm w-40" />
            </div>
            <button @click="applyHttpFilters" class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Filter</button>
            <button @click="clearHttpFilters" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200">Clear</button>
            <span class="text-xs text-gray-400 ml-auto">{{ httpTotal }} total records</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div v-if="httpLoading" class="p-8 text-center text-gray-400">Loading...</div>
          <div v-else-if="httpLogs.length === 0" class="p-8 text-center text-gray-400">No logs found.</div>
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="px-3 py-2 text-left">Time</th>
                <th class="px-3 py-2 text-left">Method</th>
                <th class="px-3 py-2 text-left">URL</th>
                <th class="px-3 py-2 text-left">Status</th>
                <th class="px-3 py-2 text-left">IP</th>
                <th class="px-3 py-2 text-left">User</th>
                <th class="px-3 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="log in httpLogs" :key="log.id">
                <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleHttpExpand(log.id)">
                  <td class="px-3 py-2 text-gray-500 whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                  <td class="px-3 py-2 font-mono font-semibold">{{ log.method }}</td>
                  <td class="px-3 py-2 font-mono text-xs truncate max-w-xs">{{ log.url }}</td>
                  <td class="px-3 py-2">
                    <span class="font-mono font-semibold" :style="{ color: statusColor(log.statusCode) }">{{ log.statusCode }}</span>
                  </td>
                  <td class="px-3 py-2 text-gray-500 text-xs">{{ log.clientIp || '-' }}</td>
                  <td class="px-3 py-2 text-gray-500 text-xs">{{ log.username || '-' }}</td>
                  <td class="px-3 py-2 text-gray-500 text-xs">{{ log.duration != null ? log.duration + 'ms' : '-' }}</td>
                </tr>
                <tr v-if="httpExpandedId === log.id">
                  <td colspan="7" class="px-4 py-3 bg-gray-50">
                    <div class="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p class="font-semibold text-gray-700 mb-1">Request Headers</p>
                        <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">{{ tryParseJson(log.requestHeaders) }}</pre>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-700 mb-1">User Agent</p>
                        <p class="text-gray-500 break-all">{{ log.userAgent || '-' }}</p>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-700 mb-1">Request Body</p>
                        <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">{{ tryParseJson(log.requestBody) || '-' }}</pre>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-700 mb-1">Response Body</p>
                        <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">{{ tryParseJson(log.responseBody) || '-' }}</pre>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-if="httpTotalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
            <span class="text-gray-500">Page {{ httpPage }} of {{ httpTotalPages }}</span>
            <div class="flex gap-2">
              <button @click="httpPage--; loadHttpLogs()" :disabled="httpPage <= 1" class="px-3 py-1 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200">Prev</button>
              <button @click="httpPage++; loadHttpLogs()" :disabled="httpPage >= httpTotalPages" class="px-3 py-1 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'ai'">
        <div class="bg-white rounded-lg shadow p-4 mb-4">
          <div class="flex flex-wrap gap-3 items-end">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Start Date</label>
              <input type="datetime-local" v-model="aiStartDate" class="border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">End Date</label>
              <input type="datetime-local" v-model="aiEndDate" class="border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Event Type</label>
              <input type="text" v-model="aiEventTypeFilter" placeholder="e.g. chat" class="border border-gray-300 rounded px-2 py-1.5 text-sm w-32" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Message Search</label>
              <input type="text" v-model="aiSearch" placeholder="Search..." class="border border-gray-300 rounded px-2 py-1.5 text-sm w-40" />
            </div>
            <button @click="applyAiFilters" class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Filter</button>
            <button @click="clearAiFilters" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200">Clear</button>
            <span class="text-xs text-gray-400 ml-auto">{{ aiTotal }} total records</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div v-if="aiLoading" class="p-8 text-center text-gray-400">Loading...</div>
          <div v-else-if="aiLogs.length === 0" class="p-8 text-center text-gray-400">No AI logs found.</div>
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="px-3 py-2 text-left">Time</th>
                <th class="px-3 py-2 text-left">Event Type</th>
                <th class="px-3 py-2 text-left">Conversation</th>
                <th class="px-3 py-2 text-left">Provider</th>
                <th class="px-3 py-2 text-left">Message</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="log in aiLogs" :key="log.id">
                <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleAiExpand(log.id)">
                  <td class="px-3 py-2 text-gray-500 whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                  <td class="px-3 py-2">
                    <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{{ log.eventType }}</span>
                  </td>
                  <td class="px-3 py-2 font-mono text-xs text-gray-500">{{ log.conversationId || '-' }}</td>
                  <td class="px-3 py-2 font-mono text-xs text-gray-500">{{ log.providerId || '-' }}</td>
                  <td class="px-3 py-2 text-gray-600 truncate max-w-xs">{{ log.message || '-' }}</td>
                </tr>
                <tr v-if="aiExpandedId === log.id">
                  <td colspan="5" class="px-4 py-3 bg-gray-50">
                    <div class="text-xs">
                      <p class="font-semibold text-gray-700 mb-1">Details</p>
                      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">{{ tryParseJson(log.details) || '-' }}</pre>
                      <p class="font-semibold text-gray-700 mb-1 mt-3">Full Message</p>
                      <p class="text-gray-600 whitespace-pre-wrap">{{ log.message || '-' }}</p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-if="aiTotalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
            <span class="text-gray-500">Page {{ aiPage }} of {{ aiTotalPages }}</span>
            <div class="flex gap-2">
              <button @click="aiPage--; loadAiLogs()" :disabled="aiPage <= 1" class="px-3 py-1 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200">Prev</button>
              <button @click="aiPage++; loadAiLogs()" :disabled="aiPage >= aiTotalPages" class="px-3 py-1 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'tool'">
        <div class="bg-white rounded-lg shadow p-4 mb-4">
          <div class="flex flex-wrap gap-3 items-end">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Start Date</label>
              <input type="datetime-local" v-model="toolStartDate" class="border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">End Date</label>
              <input type="datetime-local" v-model="toolEndDate" class="border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Tool Name</label>
              <input type="text" v-model="toolNameFilter" placeholder="e.g. get_order" class="border border-gray-300 rounded px-2 py-1.5 text-sm w-36" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Handler Type</label>
              <select v-model="handlerTypeFilter" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                <option value="">All</option>
                <option value="builtin">Builtin</option>
                <option value="external">External</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Success</label>
              <select v-model="successFilter" class="border border-gray-300 rounded px-2 py-1.5 text-sm">
                <option value="">All</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Search</label>
              <input type="text" v-model="toolSearch" placeholder="Search..." class="border border-gray-300 rounded px-2 py-1.5 text-sm w-40" />
            </div>
            <button @click="applyToolFilters" class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Filter</button>
            <button @click="clearToolFilters" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200">Clear</button>
            <span class="text-xs text-gray-400 ml-auto">{{ toolTotal }} total records</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div v-if="toolLoading" class="p-8 text-center text-gray-400">Loading...</div>
          <div v-else-if="toolLogs.length === 0" class="p-8 text-center text-gray-400">No tool logs found.</div>
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="px-3 py-2 text-left">Time</th>
                <th class="px-3 py-2 text-left">Tool Name</th>
                <th class="px-3 py-2 text-left">Type</th>
                <th class="px-3 py-2 text-left">Conversation</th>
                <th class="px-3 py-2 text-left">Success</th>
                <th class="px-3 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="log in toolLogs" :key="log.id">
                <tr class="hover:bg-gray-50 cursor-pointer" @click="toggleToolExpand(log.id)">
                  <td class="px-3 py-2 text-gray-500 whitespace-nowrap">{{ formatDate(log.createdAt) }}</td>
                  <td class="px-3 py-2 font-mono text-xs">{{ log.toolName }}</td>
                  <td class="px-3 py-2">
                    <span class="px-2 py-0.5 rounded text-xs font-medium" :class="log.handlerType === 'external' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700'">
                      {{ log.handlerType }}
                    </span>
                  </td>
                  <td class="px-3 py-2 font-mono text-xs text-gray-500">{{ log.conversationId || '-' }}</td>
                  <td class="px-3 py-2">
                    <span class="px-2 py-0.5 rounded text-xs font-medium" :class="log.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                      {{ log.success ? 'OK' : 'FAIL' }}
                    </span>
                  </td>
                  <td class="px-3 py-2 text-gray-500 text-xs">{{ log.duration != null ? log.duration + 'ms' : '-' }}</td>
                </tr>
                <tr v-if="toolExpandedId === log.id">
                  <td colspan="6" class="px-4 py-3 bg-gray-50">
                    <div class="text-xs">
                      <p class="font-semibold text-gray-700 mb-1">Request Details</p>
                      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">{{ tryParseJson(log.requestHeaders) }}</pre>
                      <p class="font-semibold text-gray-700 mb-1 mt-3">Request Body</p>
                      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">{{ tryParseJson(log.requestBody) || '-' }}</pre>
                      <p class="font-semibold text-gray-700 mb-1 mt-3">Response Status</p>
                      <p class="text-gray-600">{{ log.responseStatus != null ? log.responseStatus : '-' }}</p>
                      <p class="font-semibold text-gray-700 mb-1 mt-3">Response Body</p>
                      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">{{ tryParseJson(log.responseBody) || '-' }}</pre>
                      <p class="font-semibold text-gray-700 mb-1 mt-3">Error Message</p>
                      <p class="text-gray-600 whitespace-pre-wrap">{{ log.errorMessage || '-' }}</p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-if="toolTotalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
            <span class="text-gray-500">Page {{ toolPage }} of {{ toolTotalPages }}</span>
            <div class="flex gap-2">
              <button @click="toolPage--; loadToolLogs()" :disabled="toolPage <= 1" class="px-3 py-1 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200">Prev</button>
              <button @click="toolPage++; loadToolLogs()" :disabled="toolPage >= toolTotalPages" class="px-3 py-1 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
