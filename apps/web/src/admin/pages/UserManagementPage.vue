<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from '../stores/toast.store'

const auth = useAuthStore()
const toast = useToast()
const base = () => auth.serverUrl

interface User {
  id: string
  username: string
  displayName: string
  role: string
  isOnline: boolean
  isLocked: boolean
  lastSeenAt: string | null
  lastLoginIp: string | null
  userAgent: string | null
  createdAt: string
  activeSessions: number
  effectiveOnline: boolean
}

const users = ref<User[]>([])
const loading = ref(false)

// Search / filter
const searchQuery = ref('')
const roleFilter = ref('')
const onlineFilter = ref('')

// Action in progress
const actionUserId = ref<string | null>(null)
const actionType = ref<string | null>(null)

// Role change modal
const showRoleModal = ref(false)
const roleModalUserId = ref<string | null>(null)
const roleModalValue = ref('')

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

async function loadUsers() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.set('search', searchQuery.value)
    if (roleFilter.value) params.set('role', roleFilter.value)
    if (onlineFilter.value) params.set('online', onlineFilter.value)
    const qs = params.toString()
    const res = await apiFetch(`/admin/users${qs ? '?' + qs : ''}`)
    if (!res.ok) throw new Error('Failed to load users')
    users.value = await res.json()
  } catch (e: any) {
    toast.error(e.message || 'Failed to load users')
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  loadUsers()
}

function clearFilters() {
  searchQuery.value = ''
  roleFilter.value = ''
  onlineFilter.value = ''
  loadUsers()
}

async function forceLogout(userId: string) {
  actionUserId.value = userId
  actionType.value = 'logout'
  try {
    const res = await apiFetch(`/admin/users/${userId}/sessions`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to force logout')
    const data = await res.json()
    toast.success(`Revoked ${data.revokedCount} session(s)`)
    await loadUsers()
  } catch (e: any) {
    toast.error(e.message || 'Failed to force logout')
  } finally {
    actionUserId.value = null
    actionType.value = null
  }
}

async function toggleLock(user: User) {
  const newLocked = !user.isLocked
  actionUserId.value = user.id
  actionType.value = 'lock'
  try {
    const res = await apiFetch(`/admin/users/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isLocked: newLocked }),
    })
    if (!res.ok) throw new Error('Failed to update user')
    toast.success(newLocked ? `${user.displayName} has been locked` : `${user.displayName} has been unlocked`)
    await loadUsers()
  } catch (e: any) {
    toast.error(e.message || 'Failed to update user')
  } finally {
    actionUserId.value = null
    actionType.value = null
  }
}

function openRoleModal(user: User) {
  roleModalUserId.value = user.id
  roleModalValue.value = user.role
  showRoleModal.value = true
}

async function saveRole() {
  if (!roleModalUserId.value) return
  actionUserId.value = roleModalUserId.value
  actionType.value = 'role'
  try {
    const res = await apiFetch(`/admin/users/${roleModalUserId.value}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: roleModalValue.value }),
    })
    if (!res.ok) throw new Error('Failed to change role')
    toast.success('Role updated successfully')
    showRoleModal.value = false
    await loadUsers()
  } catch (e: any) {
    toast.error(e.message || 'Failed to change role')
  } finally {
    actionUserId.value = null
    actionType.value = null
  }
}



function formatDate(d: string | null) {
  if (!d) return '-'
  return new Date(d).toLocaleString()
}

const isActioning = (userId: string, type: string) =>
  actionUserId.value === userId && actionType.value === type

onMounted(loadUsers)
</script>

<template>
  <div class="h-full overflow-y-auto p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
        <button @click="loadUsers" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200">
          Refresh
        </button>
      </div>


      <!-- Search & Filter -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Search by Name / Username</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Type to search..."
              class="border border-gray-300 rounded px-3 py-1.5 text-sm w-64"
              @keyup.enter="applyFilters"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Role</label>
            <select v-model="roleFilter" class="border border-gray-300 rounded px-3 py-1.5 text-sm">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Status</label>
            <select v-model="onlineFilter" class="border border-gray-300 rounded px-3 py-1.5 text-sm">
              <option value="">All</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
          </div>
          <button @click="applyFilters" class="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Search</button>
          <button @click="clearFilters" class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200">Clear</button>
          <span class="text-xs text-gray-400 ml-auto">{{ users.length }} user(s)</span>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-8 text-center text-gray-400">Loading...</div>
        <div v-else-if="users.length === 0" class="p-8 text-center text-gray-400">No users found.</div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">User</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Sessions</th>
              <th class="px-4 py-3 text-left">Last IP</th>
              <th class="px-4 py-3 text-left">Created</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50" :class="{ 'bg-red-50/40': user.isLocked }">
              <td class="px-4 py-3">
                <div>
                  <p class="font-medium text-gray-800">{{ user.displayName }}</p>
                  <p class="text-xs text-gray-500">@{{ user.username }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80"
                  :class="user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'"
                  @click="openRoleModal(user)"
                  title="Click to change role"
                >{{ user.role }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-col gap-1">
                  <span
                    class="inline-flex items-center gap-1 text-xs"
                    :class="user.effectiveOnline ? 'text-green-600' : 'text-gray-400'"
                  >
                    <span class="w-2 h-2 rounded-full" :class="user.effectiveOnline ? 'bg-green-500' : 'bg-gray-300'"></span>
                    {{ user.effectiveOnline ? 'Online' : 'Offline' }}
                  </span>
                  <span v-if="user.isLocked" class="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                    Locked
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-gray-500 font-mono">{{ user.activeSessions }}</td>
              <td class="px-4 py-3 text-xs text-gray-500 font-mono">{{ user.lastLoginIp || '-' }}</td>
              <td class="px-4 py-3 text-xs text-gray-500">{{ formatDate(user.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-1.5 flex-wrap">
                  <!-- Change Role -->
                  <button
                    @click="openRoleModal(user)"
                    class="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded hover:bg-indigo-100"
                  >Role</button>

                  <!-- Lock / Unlock -->
                  <button
                    @click="toggleLock(user)"
                    :disabled="isActioning(user.id, 'lock')"
                    class="px-2.5 py-1 text-xs font-medium rounded disabled:opacity-50"
                    :class="user.isLocked
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'"
                  >
                    {{ isActioning(user.id, 'lock') ? '...' : (user.isLocked ? 'Unlock' : 'Lock') }}
                  </button>

                  <!-- Force Logout -->
                  <button
                    @click="forceLogout(user.id)"
                    :disabled="isActioning(user.id, 'logout') || user.activeSessions === 0"
                    class="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100 disabled:opacity-50"
                  >
                    {{ isActioning(user.id, 'logout') ? '...' : 'Force Logout' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Role Change Modal -->
    <div v-if="showRoleModal" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0,0,0,0.3);">
      <div class="bg-white rounded-lg shadow-xl p-6 w-80">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Change User Role</h3>
        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Select Role</label>
          <select v-model="roleModalValue" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <div class="flex gap-2 justify-end">
          <button
            @click="showRoleModal = false"
            class="px-4 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >Cancel</button>
          <button
            @click="saveRole"
            :disabled="actionType === 'role'"
            class="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >{{ actionType === 'role' ? 'Saving...' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
