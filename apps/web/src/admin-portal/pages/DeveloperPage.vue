<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from '../stores/toast.store'
import { ACCESS_TOKEN_KEY, SITE_TOKEN_KEY } from '../../shared/storage-keys'

const auth = useAuthStore()
const toast = useToast()
const base = () => auth.serverUrl

const allowedOrigins = ref('')
const adminAllowedIps = ref('')
const siteConfigId = ref<string | null>(null)
const saving = ref(false)

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {}
  const t = localStorage.getItem(ACCESS_TOKEN_KEY)
  const st = localStorage.getItem(SITE_TOKEN_KEY)
  if (t) h['Authorization'] = `Bearer ${t}`
  if (st) h['x-external-site-token'] = st
  return h
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  return fetch(`${base()}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers || {}) },
  })
}

async function loadConfig() {
  try {
    const res = await apiFetch('/config/admin-active')
    if (!res.ok) return
    const data = await res.json()
    siteConfigId.value = data.id ?? data._id ?? null
    allowedOrigins.value = data.allowedOrigins ?? ''
    adminAllowedIps.value = data.adminAllowedIps ?? ''
  } catch {
  }
}

async function saveSettings() {
  saving.value = true
  try {
    let res: Response
    if (siteConfigId.value) {
      res = await apiFetch(`/config/${siteConfigId.value}`, {
        method: 'PATCH',
        body: JSON.stringify({
          allowedOrigins: allowedOrigins.value.trim(),
          adminAllowedIps: adminAllowedIps.value.trim(),
        }),
      })
    } else {
      res = await apiFetch('/config', {
        method: 'POST',
        body: JSON.stringify({
          siteName: 'default',
          allowedOrigins: allowedOrigins.value.trim(),
          adminAllowedIps: adminAllowedIps.value.trim(),
        }),
      })
    }
    if (!res.ok) throw new Error('Failed to save')
    const data = await res.json()
    siteConfigId.value = data.id ?? data._id ?? siteConfigId.value
    allowedOrigins.value = data.allowedOrigins ?? allowedOrigins.value.trim()
    adminAllowedIps.value = data.adminAllowedIps ?? adminAllowedIps.value.trim()
    toast.success('Security settings saved')
  } catch (e: any) {
    toast.error(e.message || 'Failed to save')
  } finally {
    saving.value = false
  }
}

onMounted(loadConfig)
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Developer</h1>

      <div class="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">Site Security</h2>
          <p class="mt-1 text-sm text-gray-500">Enter comma-separated origins or <code>*</code> to allow all origins. Only developers can change these settings.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Allowed Origins</label>
          <textarea
            v-model="allowedOrigins"
            rows="5"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com, https://*.example.com"
          />
          <p class="text-xs text-gray-400 mt-1">Used to validate widget and API origins for incoming requests.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Admin Allowed IP Addresses</label>
          <textarea
            v-model="adminAllowedIps"
            rows="5"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="203.0.113.10, 198.51.100.5"
          />
          <p class="text-xs text-gray-400 mt-1">When this list is not empty, only these IP addresses can access admin portal endpoints, including register and login.</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Environment Configuration</h3>
          <p class="text-xs text-gray-500">The following are configured via <code>.env</code> and cannot be changed here:</p>
          <ul class="mt-2 space-y-1 text-xs text-gray-500">
            <li><code>EXTERNAL_SITE_JWT_SECRET</code> — Pre-shared HS256 key for verifying external site JWTs</li>
            <li><code>ACCESS_TOKEN_EXPIRY</code> — Access token lifetime (default: 30m)</li>
            <li><code>REFRESH_TOKEN_EXPIRY</code> — Refresh token lifetime (default: 7d)</li>
          </ul>
        </div>

        <div class="pt-2">
          <button
            @click="saveSettings"
            :disabled="saving"
            class="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Security Settings' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
