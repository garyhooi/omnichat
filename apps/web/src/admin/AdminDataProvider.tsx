// =============================================================================
// Admin data context — one shared agent socket for the whole portal.
// Provides the live conversations list, presence, and the conversation
// actions (open/resolve/transfer/take-over/send) to every page.
// =============================================================================

import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useAgentSocket,
  agentConversationsQueryKey,
  agentPresenceQueryKey,
  type AgentSocket,
} from '../features/agent/useAgentSocket'
import type { Conversation, AgentPresenceEntry } from '../shared/types/models'

interface AdminDataValue {
  socket: AgentSocket
  conversations: Conversation[]
  loaded: boolean
  agents: AgentPresenceEntry[]
}

const AdminDataContext = createContext<AdminDataValue | null>(null)

export function AdminDataProvider({ serverUrl, children }: { serverUrl: string; children: React.ReactNode }) {
  const socket = useAgentSocket({ serverUrl })

  const { data: convsState } = useQuery({
    queryKey: agentConversationsQueryKey(serverUrl),
    staleTime: Infinity,
    placeholderData: { conversations: [], currentUser: null, loaded: false },
    queryFn: () => ({ conversations: [], currentUser: null, loaded: false }),
  })
  const { data: agents } = useQuery<AgentPresenceEntry[]>({
    queryKey: agentPresenceQueryKey(serverUrl),
    staleTime: Infinity,
    placeholderData: [],
    queryFn: () => [],
  })

  const value = useMemo<AdminDataValue>(
    () => ({
      socket,
      conversations: convsState?.conversations ?? [],
      loaded: convsState?.loaded ?? false,
      agents: agents ?? [],
    }),
    [socket, convsState, agents],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider')
  return ctx
}
