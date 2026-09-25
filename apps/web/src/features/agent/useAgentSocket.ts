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
import { refreshTokens } from '../../shared/lib/api-client'
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
  prependMessages,
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
  /** True when the server capped the list; the UI shows "N+", never a false total. */
  truncated?: boolean
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
  /** Page in the transcript OLDER than the oldest message currently loaded. */
  loadOlderMessages: (conversationId: string) => void
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
  /** De-duplicates token refreshes: connect_error, disconnect and the auth
   *  error event can all fire for the SAME failed attempt. */
  const refreshingRef = useRef(false)
  /** Last access token this socket attempted with — the signal that a fresh
   *  login/refresh landed and a dead socket should try again. */
  const lastTokenRef = useRef<string | null>(storageGet(ACCESS_TOKEN_KEY))
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
  // Token recovery
  // ---------------------------------------------------------------------------
  /**
   * Refresh the admin tokens through the SHARED client (which persists the
   * rotated access + refresh tokens), then reconnect.
   *
   * The socket used to refresh on its own with a bare fetch: it kept only the
   * access token in memory and threw the rotated refresh token away, while the
   * server revokes the old refresh token on every use — so the stored
   * credential rotted and recovery eventually became impossible.
   */
  const reconnectWithFreshToken = useCallback(async () => {
    if (refreshingRef.current) return
    refreshingRef.current = true
    try {
      // Explicit server: the agent widget has no AuthProvider, so the
      // api-client module state may still be empty here.
      await refreshTokens(serverUrl)
    } catch {
      // No usable refresh token (logged out, or already rotated away). The
      // token watchers below retry as soon as a fresh token lands in storage.
      return
    } finally {
      refreshingRef.current = false
    }
    socketRef.current?.connect()
  }, [serverUrl])

  /**
   * Reconnect when a NEW access token appears in storage — the operator logged
   * in, or another console refreshed. socket.io will NOT retry by itself after
   * the server force-closes an unauthenticated connection, so the credential
   * changing is the signal that a retry is worth making.
   */
  const reconnectOnTokenChange = useCallback(() => {
    const token = storageGet(ACCESS_TOKEN_KEY)
    if (token === lastTokenRef.current) return
    lastTokenRef.current = token
    const socket = socketRef.current
    if (token && socket && !socket.connected) socket.connect()
  }, [])

  // ---------------------------------------------------------------------------
  // Event handling
  // ---------------------------------------------------------------------------
  const handleServerEvent = useCallback(
    (event: keyof ServerEventMap, payload: ServerEventMap[keyof ServerEventMap]) => {
      switch (event) {
        case SERVER_EVENTS.conversationsList: {
          const { conversations, currentUser: cu, truncated } = payload as ServerEventMap['conversations_list']
          setConversations((s) => ({
            ...s,
            conversations: conversations.map((c) => ({
              ...c,
              unreadCount: c._count?.messages ?? 0,
            })),
            currentUser: cu,
            loaded: true,
            truncated: truncated ?? false,
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

        case SERVER_EVENTS.messagesPage: {
          const { conversationId, messages, hasMoreMessages } =
            payload as ServerEventMap['messages_page']
          setConversationState(conversationId, (s) =>
            prependMessages(s, messages, hasMoreMessages),
          )
          break
        }

        case SERVER_EVENTS.conversationHistory: {
          const { conversation, isIpBlacklisted, hasMoreMessages } =
            payload as ServerEventMap['conversation_history']
          const id = conversation.id
          setConversationState(id, (s) =>
            applyHistory(s, conversation, isIpBlacklisted, hasMoreMessages ?? false),
          )
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

        case SERVER_EVENTS.error: {
          const { code } = payload as ServerEventMap['error']
          // The gateway refuses a bad/expired credential by emitting this and
          // then force-disconnecting. socket.io does not retry after an
          // application-level disconnect, so recover explicitly here.
          if (code === 'auth') void reconnectWithFreshToken()
          optionsRef.current.onEvent?.(event, payload)
          break
        }

        default:
          optionsRef.current.onEvent?.(event, payload)
      }
      // Notify live subscribers after the cache writes above, so listeners
      // (notification sounds, etc.) observe consistent list/cache state.
      for (const listener of listenersRef.current) listener(event, payload)
    },
    [currentUser?.displayName, queryClient, reconnectWithFreshToken, serverUrl, setConversationState, setConversations, updateTyping],
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
      // A FUNCTION, not an object: socket.io re-evaluates it on every attempt,
      // so each reconnect presents the CURRENT token from storage. A frozen
      // object is what let a socket replay an expired token forever while the
      // HTTP client rotated tokens behind its back.
      auth: (cb: (data: Record<string, unknown>) => void) => cb({ token: getToken() }),
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

    socket.on('disconnect', (reason) => {
      connectedRef.current = false
      setConnected(false)
      // 'io server disconnect' = the SERVER called socket.disconnect(), which
      // is how the gateway refuses an expired credential. socket.io deliberately
      // does NOT auto-reconnect after this reason, so recover manually.
      if (reason === 'io server disconnect') void reconnectWithFreshToken()
    })

    socket.on('connect_error', () => {
      // Handshake rejected. Refresh through the shared client (persists the
      // rotated refresh token) and retry — auth() re-reads storage for us.
      void reconnectWithFreshToken()
    })

    for (const event of Object.values(SERVER_EVENTS)) {
      socket.on(event, (payload: unknown) => {
        handleServerEvent(event as keyof ServerEventMap, payload as ServerEventMap[keyof ServerEventMap])
      })
    }
  }, [handleServerEvent, reconnectWithFreshToken, serverUrl])

  useEffect(() => {
    connect()
    return () => {
      socketRef.current?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect])

  // The socket object is created once, so a credential that appears AFTER it
  // (the operator logging in on the same page, or a refresh from another tab)
  // would otherwise never be picked up — the console sits on "connecting"
  // until a full page reload rebuilds the socket.
  useEffect(() => {
    window.addEventListener('storage', reconnectOnTokenChange)
    window.addEventListener('focus', reconnectOnTokenChange)
    document.addEventListener('visibilitychange', reconnectOnTokenChange)
    return () => {
      window.removeEventListener('storage', reconnectOnTokenChange)
      window.removeEventListener('focus', reconnectOnTokenChange)
      document.removeEventListener('visibilitychange', reconnectOnTokenChange)
    }
  }, [reconnectOnTokenChange])

  // A same-document login raises no 'storage' event, so poll while offline.
  // One localStorage read every 2s, and only while the socket is down.
  useEffect(() => {
    if (connected) return
    const timer = window.setInterval(reconnectOnTokenChange, 2000)
    return () => window.clearInterval(timer)
  }, [connected, reconnectOnTokenChange])

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

  const loadOlderMessages = useCallback(
    (conversationId: string) => {
      const oldest = getConversationState(conversationId).messages[0]
      if (!oldest) return
      socketRef.current?.emit(CLIENT_EVENTS.loadMessages, {
        conversationId,
        before: oldest.createdAt,
      })
    },
    [getConversationState],
  )

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
      // Optimistic append — resolved by the server echo in appendMessage. Carries
      // the agent identity so the bubble starts on the agent's own side.
      setConversationState(conversationId, (s) =>
        addPendingSend(s, `temp_${crypto.randomUUID()}`, content, conversationId, {
          senderType: 'agent',
          senderId: currentUser?.id ?? 'me',
        }),
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
    loadOlderMessages,
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
