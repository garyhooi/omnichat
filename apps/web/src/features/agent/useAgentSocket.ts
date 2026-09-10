// =============================================================================
// Agent socket hook — the admin side of the protocol. Authenticates with the
// admin JWT (auto-refreshed), receives the live conversations list, and syncs
// per-conversation data into the same query-cache contract the visitor side
// uses (['conversation', url, id]) so both sides share the chatState helpers.
//
// Cache contract:
//   ['agent-conversations', url] → { conversations, currentUser, agents }
//   ['conversation', url, id]    → ConversationQueryState (same as visitor)
//   ['typing', url, id]          → Set<string>
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { ACCESS_TOKEN_KEY, storageGet } from '../../shared/lib/storage'
import type {
  Conversation,
  CurrentUser,
  AgentPresenceEntry,
} from '../../shared/types/models'
import type {
  ServerEventMap,
  UpdateConversationDetailsPayload,
  TransferToSpecialistPayload,
  ListConversationsPayload,
  ConversationStatusFilter,
} from '../../shared/types/socket'
import { CLIENT_EVENTS, SERVER_EVENTS } from '../../shared/types/socket'
import {
  addPendingSend,
  appendMessage,
  applyHistory,
  clearAiStream,
  markMessageRead,
  setConversationStatus,
  setInactivityWarning,
  setLastError,
  upsertAiStream,
} from '../chat/chatState'
import type { ConversationQueryState } from '../chat/types'
import { conversationQueryKey, createEmptyConversationState, typingQueryKey } from '../chat/types'

export const agentConversationsQueryKey = (serverUrl: string) =>
  ['agent-conversations', serverUrl] as const
export const agentPresenceQueryKey = (serverUrl: string) => ['agent-presence', serverUrl] as const

export interface AgentConversationsState {
  conversations: Conversation[]
  currentUser: CurrentUser | null
  loaded: boolean
}

export interface AgentSocketOptions {
  serverUrl: string
  /** Access token provider — defaults to localStorage (same as legacy). */
  getToken?: () => string | null
  onEvent?: (event: keyof ServerEventMap, payload: ServerEventMap[keyof ServerEventMap]) => void
}

/** Live server-event listener (new_message, new_conversation, …). */
export type AgentServerEventListener = (
  event: keyof ServerEventMap,
  payload: ServerEventMap[keyof ServerEventMap],
) => void

export interface AgentSocket {
  connected: boolean
  currentUser: CurrentUser | null
  /** The conversation whose room this socket has joined. */
  openConversationId: string | null
  openConversation: (id: string) => void
  closeConversation: () => void
  /** Subscribe to live server events (after cache writes). Returns unsubscribe. */
  subscribeEvents: (fn: AgentServerEventListener) => () => void
  listConversations: (status?: ConversationStatusFilter, dateRange?: { start?: string; end?: string }) => void
  sendText: (conversationId: string, content: string) => void
  sendImage: (conversationId: string, attachmentUrl: string, thumbnailUrl?: string) => void
  readMessage: (conversationId: string, messageId: string) => void
  typingStart: (conversationId: string) => void
  typingStop: (conversationId: string) => void
  resolveConversation: (conversationId: string) => void
  takeOverConversation: (conversationId: string) => void
  transferToSpecialist: (conversationId: string, targetUsername: string) => void
  updateConversationDetails: (
    conversationId: string,
    payload: Omit<UpdateConversationDetailsPayload, 'conversationId'>,
  ) => void
  disconnect: () => void
}

const AGENT_MAX_CHARS = 2000
const HEARTBEAT_MS = 25_000

export function useAgentSocket(options: AgentSocketOptions): AgentSocket {
  const { serverUrl } = options
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const connectedRef = useRef(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [openConversationId, setOpenConversationIdState] = useState<string | null>(null)
  const openConversationIdRef = useRef<string | null>(null)
  const optionsRef = useRef(options)
  /** Live event listeners registered via subscribeEvents(). */
  const listenersRef = useRef<AgentServerEventListener[]>([])
  /** Last list_conversations request — re-emitted after a reconnect so date
   *  filters (Resolved tab) never silently drop while the socket is down. */
  const pendingListRef = useRef<{ status?: ConversationStatusFilter; startDate?: string; endDate?: string } | null>(null)
  useEffect(() => {
    optionsRef.current = options
  })

  // ---------------------------------------------------------------------------
  // Cache helpers
  // ---------------------------------------------------------------------------
  /** Register a live server-event listener; returns an unsubscribe function. */
  const subscribeEvents = useCallback((fn: AgentServerEventListener) => {
    listenersRef.current.push(fn)
    return () => {
      listenersRef.current = listenersRef.current.filter((f) => f !== fn)
    }
  }, [])

  const setConversations = useCallback(
    (updater: (s: AgentConversationsState) => AgentConversationsState) => {
      const qk = agentConversationsQueryKey(serverUrl)
      const prev = queryClient.getQueryData<AgentConversationsState>(qk) ?? {
        conversations: [],
        currentUser: null,
        loaded: false,
      }
      queryClient.setQueryData(qk, updater(prev))
    },
    [queryClient, serverUrl],
  )

  const getConversationState = useCallback(
    (id: string): ConversationQueryState => {
      const qk = conversationQueryKey(serverUrl, id)
      return (
        (queryClient.getQueryData<ConversationQueryState>(qk) as ConversationQueryState) ??
        createEmptyConversationState()
      )
    },
    [queryClient, serverUrl],
  )

  const setConversationState = useCallback(
    (id: string, updater: (state: ConversationQueryState) => ConversationQueryState) => {
      queryClient.setQueryData(conversationQueryKey(serverUrl, id), updater(getConversationState(id)))
    },
    [queryClient, getConversationState, serverUrl],
  )

  const updateTyping = useCallback(
    (id: string, user: string, isTyping: boolean) => {
      const qk = typingQueryKey(serverUrl, id)
      const current = new Set<string>(queryClient.getQueryData<string[]>(qk) ?? [])
      if (isTyping) current.add(user)
      else current.delete(user)
      queryClient.setQueryData(qk, [...current])
    },
    [queryClient, serverUrl],
  )

  // ---------------------------------------------------------------------------
  // Event handling
  // ---------------------------------------------------------------------------
  const handleServerEvent = useCallback(
    (event: keyof ServerEventMap, payload: ServerEventMap[keyof ServerEventMap]) => {
      switch (event) {
        case SERVER_EVENTS.conversationsList: {
          const { conversations, currentUser: cu } = payload as ServerEventMap['conversations_list']
          setConversations((s) => ({
            ...s,
            conversations: conversations.map((c) => ({
              ...c,
              unreadCount: c._count?.messages ?? 0,
            })),
            currentUser: cu,
            loaded: true,
          }))
          setCurrentUser(cu)
          break
        }

        case SERVER_EVENTS.newConversation: {
          const { conversation } = payload as ServerEventMap['new_conversation']
          setConversations((s) => {
            if (s.conversations.some((c) => c.id === conversation.id)) return s
            return {
              ...s,
              conversations: [
                { ...conversation, unreadCount: conversation._count?.messages ?? 0 },
                ...s.conversations,
              ],
            }
          })
          break
        }

        case SERVER_EVENTS.conversationUpdated: {
          const { conversation } = payload as ServerEventMap['conversation_updated']
          setConversations((s) => ({
            ...s,
            conversations: s.conversations.map((c) =>
              c.id === conversation.id
                ? { ...conversation, unreadCount: conversation._count?.messages ?? c.unreadCount ?? 0 }
                : c,
            ),
          }))
          // Also refresh the open conversation's cached conversation object.
          if (conversation.id === openConversationIdRef.current) {
            setConversationState(conversation.id, (st) => {
              if (!st.conversation) return st
              return { ...st, conversation: { ...st.conversation, ...conversation } }
            })
          }
          break
        }

        case SERVER_EVENTS.newMessage: {
          const { message } = payload as ServerEventMap['new_message']
          setConversationState(message.conversationId, (s) => appendMessage(s, message))
          // Live-preview + unread count in the list.
          setConversations((s) => ({
            ...s,
            conversations: s.conversations.map((c) => {
              if (c.id !== message.conversationId) return c
              const isVisitorMsg = message.senderType === 'visitor'
              const isOpen = message.conversationId === openConversationIdRef.current
              return {
                ...c,
                updatedAt: message.createdAt,
                ...(isVisitorMsg && !isOpen
                  ? { unreadCount: (c.unreadCount ?? 0) + 1 }
                  : {}),
              }
            }),
          }))
          if (message.conversationId === openConversationIdRef.current) {
            // Read receipts: agent is looking at this conversation. Skip the
            // agent's own echo — the sender doesn't mark their own message read.
            if (message.senderId !== currentUser?.id) {
              socketRef.current?.emit(CLIENT_EVENTS.readMessage, {
                messageId: message.id,
                conversationId: message.conversationId,
              })
            }
          }
          optionsRef.current.onEvent?.(event, payload)
          break
        }

        case SERVER_EVENTS.messageRead: {
          const { messageId, conversationId, readAt } = payload as ServerEventMap['message_read']
          setConversationState(conversationId, (s) => markMessageRead(s, messageId, readAt))
          break
        }

        case SERVER_EVENTS.aiStream: {
          const stream = payload as ServerEventMap['ai_stream']
          if (stream.conversationId !== openConversationIdRef.current) break
          if (stream.isComplete) {
            setConversationState(stream.conversationId, clearAiStream)
          } else {
            setConversationState(stream.conversationId, (s) => upsertAiStream(s, stream))
          }
          break
        }

        case SERVER_EVENTS.visitorTyping: {
          const { conversationId, user, isTyping } = payload as ServerEventMap['visitor_typing']
          updateTyping(conversationId, user, isTyping)
          break
        }

        case SERVER_EVENTS.agentTyping: {
          const { conversationId, user, isTyping } = payload as ServerEventMap['agent_typing']
          // Only show other agents' typing (not our own echo).
          if (user === currentUser?.displayName) break
          updateTyping(conversationId, user, isTyping)
          break
        }

        case SERVER_EVENTS.conversationHistory: {
          const { conversation, isIpBlacklisted } =
            payload as ServerEventMap['conversation_history']
          const id = conversation.id
          setConversationState(id, (s) => applyHistory(s, conversation, isIpBlacklisted))
          setConversationState(id, clearAiStream)
          // Read receipts for unread visitor messages (the agent just opened
          // this conversation) — matches the legacy mark-read-on-select.
          const messages = conversation.messages ?? []
          for (const m of messages) {
            if (m.senderType === 'visitor' && !m.readAt) {
              socketRef.current?.emit(CLIENT_EVENTS.readMessage, {
                messageId: m.id,
                conversationId: id,
              })
            }
          }
          break
        }

        case SERVER_EVENTS.conversationResolved: {
          const { conversationId } = payload as ServerEventMap['conversation_resolved']
          setConversationState(conversationId, (s) => {
            let next = setConversationStatus(s, 'resolved')
            next = setInactivityWarning(next, null)
            return clearAiStream(next)
          })
          break
        }

        case SERVER_EVENTS.chatTransferred: {
          const { conversationId, specialistUsername } =
            payload as ServerEventMap['chat_transferred']
          setConversations((s) => ({
            ...s,
            conversations: s.conversations.map((c) =>
              c.id === conversationId
                ? { ...c, status: 'specialist', specialistUsername }
                : c,
            ),
          }))
          break
        }

        case SERVER_EVENTS.aiHandoff: {
          const { conversationId } = payload as ServerEventMap['ai_handoff']
          setConversations((s) => ({
            ...s,
            conversations: s.conversations.map((c) =>
              c.id === conversationId ? { ...c, status: 'active' } : c,
            ),
          }))
          break
        }

        case SERVER_EVENTS.inactivityWarning: {
          const { conversationId, message } = payload as ServerEventMap['inactivity_warning']
          setConversationState(conversationId, (s) => setInactivityWarning(s, message))
          break
        }

        case SERVER_EVENTS.messageError: {
          const { conversationId, error } = payload as ServerEventMap['message_error']
          setConversationState(conversationId, (s) => setLastError(s, error))
          optionsRef.current.onEvent?.(event, payload)
          break
        }

        case SERVER_EVENTS.agentPresence: {
          const { agents } = payload as ServerEventMap['agent_presence']
          queryClient.setQueryData(agentPresenceQueryKey(serverUrl), agents)
          break
        }

        case SERVER_EVENTS.reviewSubmitted: {
          const { conversationId, rating, review } = payload as ServerEventMap['review_submitted']
          setConversationState(conversationId, (s) =>
            s.conversation ? { ...s, conversation: { ...s.conversation, rating, review } } : s,
          )
          // Keep the conversations-list cache in sync so resolved rows show the rating too.
          setConversations((s) => ({
            ...s,
            conversations: s.conversations.map((c) =>
              c.id === conversationId ? { ...c, rating, review } : c,
            ),
          }))
          break
        }

        case SERVER_EVENTS.ipBlacklisted: {
          const { conversationId } = payload as ServerEventMap['ip_blacklisted']
          setConversationState(conversationId, (s) => ({
            ...s,
            isIpBlacklisted: true,
          }))
          break
        }

        default:
          optionsRef.current.onEvent?.(event, payload)
      }
      // Notify live subscribers after the cache writes above, so listeners
      // (notification sounds, etc.) observe consistent list/cache state.
      for (const listener of listenersRef.current) listener(event, payload)
    },
    [currentUser?.displayName, queryClient, serverUrl, setConversationState, setConversations, updateTyping],
  )

  // ---------------------------------------------------------------------------
  // Connection
  // ---------------------------------------------------------------------------
  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect()
      return
    }
    const getToken = () =>
      optionsRef.current.getToken?.() ?? storageGet(ACCESS_TOKEN_KEY)
    const socket = io(serverUrl, {
      auth: { token: getToken() },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      connectedRef.current = true
      setConnected(true)
      // Re-join the open conversation room after a reconnect.
      const openId = openConversationIdRef.current
      if (openId) {
        socket.emit(CLIENT_EVENTS.joinConversation, { conversationId: openId })
      }
      // Re-apply the last list filter (Resolved date range) — the server's
      // connect-time conversations_list is unfiltered and would otherwise
      // clobber the requested slice until the user re-picks dates.
      const pending = pendingListRef.current
      if (pending) {
        socket.emit(CLIENT_EVENTS.listConversations, pending)
      }
    })

    socket.on('disconnect', () => {
      connectedRef.current = false
      setConnected(false)
    })

    socket.on('connect_error', async () => {
      // Token expired → refresh once and retry with the new token.
      try {
        const refreshToken = storageGet('omnichat_refreshToken')
        if (!refreshToken) return
        const res = await fetch(`${serverUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
        if (!res.ok) return
        const data = (await res.json()) as { accessToken: string }
        socket.auth = { token: data.accessToken }
        socket.connect()
      } catch {
        /* refresh failed — keep retrying */
      }
    })

    for (const event of Object.values(SERVER_EVENTS)) {
      socket.on(event, (payload: unknown) => {
        handleServerEvent(event as keyof ServerEventMap, payload as ServerEventMap[keyof ServerEventMap])
      })
    }
  }, [handleServerEvent, serverUrl])

  useEffect(() => {
    connect()
    return () => {
      socketRef.current?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect])

  // Heartbeat keeps lastSeenAt fresh so the presence/timeout logic works.
  useEffect(() => {
    if (!connected) return
    const timer = window.setInterval(() => {
      socketRef.current?.emit(CLIENT_EVENTS.heartbeat)
    }, HEARTBEAT_MS)
    return () => window.clearInterval(timer)
  }, [connected])

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const openConversation = useCallback(
    (id: string) => {
      if (openConversationIdRef.current === id) return
      openConversationIdRef.current = id
      setOpenConversationIdState(id)
      // Fresh query state for the newly opened conversation (history arrives
      // via conversation_history right after join_conversation).
      queryClient.setQueryData(conversationQueryKey(serverUrl, id), createEmptyConversationState())
      // Clear the list badge + send read receipts for unread visitor messages.
      setConversations((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === id ? { ...c, unreadCount: 0 } : c,
        ),
      }))
      socketRef.current?.emit(CLIENT_EVENTS.joinConversation, { conversationId: id })
    },
    [queryClient, serverUrl, setConversations],
  )

  const closeConversation = useCallback(() => {
    openConversationIdRef.current = null
    setOpenConversationIdState(null)
  }, [])

  const listConversations = useCallback(
    (status?: ConversationStatusFilter, dateRange?: { start?: string; end?: string }) => {
      const payload: ListConversationsPayload = {
        ...(status ? { status } : {}),
        ...(dateRange?.start ? { startDate: dateRange.start } : {}),
        ...(dateRange?.end ? { endDate: dateRange.end } : {}),
      }
      pendingListRef.current = payload
      if (socketRef.current?.connected) {
        socketRef.current.emit(CLIENT_EVENTS.listConversations, payload)
      }
    },
    [],
  )

  const sendText = useCallback(
    (conversationId: string, content: string) => {
      if (!content.trim()) return
      if (content.trim().length > AGENT_MAX_CHARS) return
      // Optimistic append — resolved by the server echo in appendMessage.
      setConversationState(conversationId, (s) =>
        addPendingSend(s, `temp_${crypto.randomUUID()}`, content, conversationId, currentUser?.id ?? 'me'),
      )
      socketRef.current?.emit(CLIENT_EVENTS.sendMessage, {
        conversationId,
        content,
        messageType: 'text',
      })
      socketRef.current?.emit(CLIENT_EVENTS.typingStop, { conversationId })
    },
    [currentUser?.id, setConversationState],
  )

  const sendImage = useCallback(
    (conversationId: string, attachmentUrl: string, thumbnailUrl?: string) => {
      socketRef.current?.emit(CLIENT_EVENTS.sendMessage, {
        conversationId,
        content: '',
        messageType: 'image',
        attachmentUrl,
        attachmentThumbnailUrl: thumbnailUrl || attachmentUrl,
      })
    },
    [],
  )

  const readMessage = useCallback(
    (conversationId: string, messageId: string) => {
      socketRef.current?.emit(CLIENT_EVENTS.readMessage, { conversationId, messageId })
    },
    [],
  )

  const typingStart = useCallback(
    (conversationId: string) => {
      socketRef.current?.emit(CLIENT_EVENTS.typingStart, { conversationId })
    },
    [],
  )

  const typingStop = useCallback(
    (conversationId: string) => {
      socketRef.current?.emit(CLIENT_EVENTS.typingStop, { conversationId })
    },
    [],
  )

  const resolveConversation = useCallback(
    (conversationId: string) => {
      socketRef.current?.emit(CLIENT_EVENTS.resolveConversation, { conversationId })
    },
    [],
  )

  const takeOverConversation = useCallback(
    (conversationId: string) => {
      socketRef.current?.emit(CLIENT_EVENTS.takeOverConversation, { conversationId })
    },
    [],
  )

  const transferToSpecialist = useCallback(
    (conversationId: string, targetUsername: string) => {
      const payload: TransferToSpecialistPayload = { conversationId, targetUsername }
      socketRef.current?.emit(CLIENT_EVENTS.transferToSpecialist, payload)
    },
    [],
  )

  const updateConversationDetails = useCallback(
    (conversationId: string, payload: Omit<UpdateConversationDetailsPayload, 'conversationId'>) => {
      socketRef.current?.emit(CLIENT_EVENTS.updateConversationDetails, {
        conversationId,
        ...payload,
      })
    },
    [],
  )

  return {
    connected,
    currentUser,
    openConversationId,
    openConversation,
    closeConversation,
    subscribeEvents,
    listConversations,
    sendText,
    sendImage,
    readMessage,
    typingStart,
    typingStop,
    resolveConversation,
    takeOverConversation,
    transferToSpecialist,
    updateConversationDetails,
    disconnect: () => socketRef.current?.disconnect(),
  }
}

export type { AgentPresenceEntry }
