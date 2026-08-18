// =============================================================================
// Visitor socket hook — owns the Socket.io connection and syncs every server
// event into the TanStack Query cache via setQueryData.
//
// Cache contract:
//   ['conversation', serverUrl, id]  → ConversationQueryState (messages,
//       conversation, stream, upload token, translations, …)
//   ['typing', serverUrl, id]        → Set<string> of typing user names
//
// The query cache is the single source of truth: the widget, full-page chat
// and any other consumer read the same data and stay consistent across tabs
// (conversationId itself is cross-tab synced via localStorage).
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { useLocalStorageState } from '../../../shared/hooks/useLocalStorage'
import { CONVERSATION_ID_KEY } from '../../../shared/lib/storage'
import { ensureVisitorSession } from '../../../shared/lib/visitorSession'
import {
  clearTranslationCooldown,
  isTranslationOnCooldown,
  markTranslationFailed,
} from '../../../shared/lib/translationCooldown'
import type {
  Message,
  SenderType,
} from '../../../shared/types/models'
import type {
  ServerEventMap,
  StartConversationPayload,
} from '../../../shared/types/socket'
import { CLIENT_EVENTS, SERVER_EVENTS } from '../../../shared/types/socket'
import { fetchTranslation } from '../../../shared/lib/translationCache'
import {
  addPendingSend,
  appendMessage,
  applyHistory,
  clearAiStream,
  markMessageRead,
  removePendingSend,
  setBlacklisted,
  setConversationStatus,
  setInactivityWarning,
  setLastError,
  setTranslation,
  setUploadToken,
  translationKey,
  upsertAiStream,
  withConversation,
} from '../chatState'
import type { ConversationQueryState } from '../types'
import {
  conversationQueryKey,
  createEmptyConversationState,
  typingQueryKey,
} from '../types'

export interface ChatSocketOptions {
  serverUrl: string
  visitorId: string
  /** Passed through the handshake auth (site integration token / sso). */
  externalToken?: string
  autoConnect?: boolean
  /** Consumer callbacks — fired after the cache has been updated. */
  onEvent?: (event: keyof ServerEventMap, payload: ServerEventMap[keyof ServerEventMap]) => void
  /** Auto-translate incoming agent/ai messages when enabled. */
  translate?: { enabled: boolean; lang: string }
  /** Ref-based panel visibility — read receipts are only sent while open. */
  isPanelOpen?: () => boolean
}

export interface ChatSocket {
  connected: boolean
  /** Authoritative visitor id — the server session cookie wins over the local one. */
  visitorId: string
  conversationId: string | null
  setConversationId: (id: string | null) => void
  ensureConnected: () => Promise<boolean>
  startConversation: (payload: StartConversationPayload) => void
  sendText: (content: string) => void
  sendImage: (attachmentUrl: string, thumbnailUrl?: string) => void
  readMessage: (messageId: string) => void
  markAllAsRead: () => void
  submitReview: (rating: number, review?: string) => void
  resolveConversation: () => void
  typingStart: () => void
  typingStop: () => void
  disconnect: () => void
}

export function useChatSocket(options: ChatSocketOptions): ChatSocket {
  const { serverUrl, visitorId, externalToken, autoConnect = true } = options

  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const connectPromiseRef = useRef<Promise<void> | null>(null)
  const [connected, setConnected] = useState(false)
  const connectedRef = useRef(false)
  // Server-authorized visitor id — may differ from the local one when an
  // httpOnly session cookie from an earlier visit exists.
  const [authoritativeVisitorId, setAuthoritativeVisitorId] = useState(visitorId)
  const [conversationId, rawSetConversationId] = useLocalStorageState(CONVERSATION_ID_KEY, '')
  const conversationIdRef = useRef(conversationId)

  // Latest consumer callbacks — read through refs so socket listeners never go stale.
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  })

  // Keep conversationId readable inside socket listeners.
  useEffect(() => {
    conversationIdRef.current = conversationId
    // A different tab cleared/created the conversation → realign the cache.
    const qk = conversationQueryKey(serverUrl, conversationId)
    if (!conversationId) {
      queryClient.setQueryData(qk, createEmptyConversationState())
    }
    if (conversationId && socketRef.current?.connected) {
      socketRef.current.emit(CLIENT_EVENTS.joinConversation, { conversationId })
    }
  }, [conversationId, queryClient, serverUrl])

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
      const qk = conversationQueryKey(serverUrl, id)
      const next = updater(getConversationState(id))
      queryClient.setQueryData(qk, next)
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
  // Cache sync — one switch per server event. Runs inside socket listeners.
  // ---------------------------------------------------------------------------
  const handleServerEvent = useCallback(
    (event: keyof ServerEventMap, payload: ServerEventMap[keyof ServerEventMap]) => {
      const currentId = conversationIdRef.current

      switch (event) {
        case SERVER_EVENTS.conversationStarted: {
          const { conversation } = payload as ServerEventMap['conversation_started']
          queryClient.setQueryData(
            conversationQueryKey(serverUrl, conversation.id),
            withConversation(createEmptyConversationState(), conversation),
          )
          // Synchronous ref update so events arriving in the same tick see it.
          conversationIdRef.current = conversation.id
          rawSetConversationId(conversation.id)
          break
        }

        case SERVER_EVENTS.conversationHistory: {
          const { conversation, isIpBlacklisted } =
            payload as ServerEventMap['conversation_history']
          const id = conversation.id
          setConversationState(id, (s) => applyHistory(s, conversation, isIpBlacklisted))
          // Fresh history → drop the streaming bubble if the stream died mid-way.
          setConversationState(id, clearAiStream)
          break
        }

        case SERVER_EVENTS.uploadToken: {
          const { token } = payload as ServerEventMap['upload_token']
          if (currentId) setConversationState(currentId, (s) => setUploadToken(s, token))
          break
        }

        case SERVER_EVENTS.newMessage: {
          const { message } = payload as ServerEventMap['new_message']
          if (message.conversationId !== currentId) break
          setConversationState(currentId, (s) => appendMessage(s, message))

          const isIncoming = message.senderType === 'agent' || message.senderType === 'ai'
          if (isIncoming) {
            optionsRef.current.onEvent?.(event, payload)
            // Read receipts: only when the visitor is actually looking at the
            // conversation (closed panel must keep messages unread).
            if (optionsRef.current.isPanelOpen?.()) {
              socketRef.current?.emit(CLIENT_EVENTS.readMessage, {
                messageId: message.id,
                conversationId: currentId,
              })
            }
            // Auto-translate agent messages when the visitor enabled it.
            const t = optionsRef.current.translate
            if (t?.enabled && message.content && message.messageType === 'text') {
              const key = translationKey(message.id, t.lang)
              if (isTranslationOnCooldown(key)) return
              const qk = conversationQueryKey(serverUrl, currentId)
              const state = queryClient.getQueryData<ConversationQueryState>(qk)
              if (state && !state.translations[key]) {
                fetchTranslation(serverUrl, message.content, t.lang)
                  .then((text) => {
                    clearTranslationCooldown(key)
                    setConversationState(currentId, (s) => setTranslation(s, message.id, t.lang, text))
                  })
                  .catch(() => {
                    // Back off for a minute so rate-limited retries don't hammer
                    // the translate endpoint on every cache update.
                    markTranslationFailed(key)
                  })
              }
            }
          }
          break
        }

        case SERVER_EVENTS.aiStream: {
          const payload2 = payload as ServerEventMap['ai_stream']
          if (payload2.conversationId !== currentId) break
          if (payload2.isComplete) {
            setConversationState(currentId, clearAiStream)
            optionsRef.current.onEvent?.(event, payload)
          } else {
            setConversationState(currentId, (s) => upsertAiStream(s, payload2))
          }
          break
        }

        case SERVER_EVENTS.messageRead: {
          const { messageId, readAt } = payload as ServerEventMap['message_read']
          if (currentId) setConversationState(currentId, (s) => markMessageRead(s, messageId, readAt))
          break
        }

        case SERVER_EVENTS.messageError: {
          const { conversationId: cid, error } = payload as ServerEventMap['message_error']
          // Roll back the optimistic send that failed.
          setConversationState(cid, (s) => removePendingSend(s, cid))
          setConversationState(cid, (s) => setLastError(s, error))
          optionsRef.current.onEvent?.(event, payload)
          break
        }

        case SERVER_EVENTS.agentTyping: {
          const { conversationId: cid, user, isTyping } = payload as ServerEventMap['agent_typing']
          if (cid !== currentId) break
          updateTyping(cid, user, isTyping)
          break
        }

        case SERVER_EVENTS.inactivityWarning: {
          const { conversationId: cid, message } = payload as ServerEventMap['inactivity_warning']
          if (cid !== currentId) break
          setConversationState(cid, (s) => setInactivityWarning(s, message))
          break
        }

        case SERVER_EVENTS.conversationResolved: {
          const { conversationId: cid } = payload as ServerEventMap['conversation_resolved']
          if (cid !== currentId) break
          setConversationState(cid, (s) => {
            let next = setConversationStatus(s, 'resolved')
            next = setInactivityWarning(next, null)
            next = clearAiStream(next)
            return next
          })
          optionsRef.current.onEvent?.(event, payload)
          break
        }

        case SERVER_EVENTS.ipBlacklisted: {
          const { conversationId: cid, reason } = payload as ServerEventMap['ip_blacklisted']
          if (cid !== currentId) break
          setConversationState(cid, (s) => setBlacklisted(s, true))
          setConversationState(cid, (s) => setLastError(s, reason))
          break
        }

        case SERVER_EVENTS.reviewSubmitted: {
          const { conversationId: cid, rating, review } = payload as ServerEventMap['review_submitted']
          if (cid !== currentId) break
          setConversationState(cid, (s) =>
            s.conversation
              ? { ...s, conversation: { ...s.conversation, rating, review } }
              : s,
          )
          break
        }

        case SERVER_EVENTS.error: {
          const { message } = payload as ServerEventMap['error']
          if (message === 'Conversation not found') {
            // The stored conversation no longer exists — start fresh.
            conversationIdRef.current = ''
            rawSetConversationId('')
            queryClient.setQueryData(
              conversationQueryKey(serverUrl, ''),
              createEmptyConversationState(),
            )
          } else {
            // e.g. "All agents are currently offline" — surface even without
            // an active conversation (the welcome screen shows the offline view).
            const cid = conversationIdRef.current || ''
            setConversationState(cid, (s) => setLastError(s, message))
            optionsRef.current.onEvent?.(event, payload)
          }
          break
        }

        default:
          optionsRef.current.onEvent?.(event, payload)
      }
    },
    [
      queryClient,
      rawSetConversationId,
      serverUrl,
      setConversationState,
      updateTyping,
    ],
  )

  // ---------------------------------------------------------------------------
  // Connection lifecycle
  // ---------------------------------------------------------------------------
  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect()
      return
    }
    if (connectPromiseRef.current) return
    // Legacy parity: establish the httpOnly visitor session cookie BEFORE the
    // socket handshake so the server resolves the same visitor identity across
    // every entry point (widget ↔ chat page can resume each other's chats).
    connectPromiseRef.current = ensureVisitorSession(serverUrl, visitorId, externalToken)
      .then((authoritativeId) => {
        if (authoritativeId !== visitorId) setAuthoritativeVisitorId(authoritativeId)
        const socket = io(serverUrl, {
          auth: { visitorId: authoritativeId, externalToken: externalToken || undefined },
          transports: ['websocket', 'polling'],
          withCredentials: true,
          reconnection: true,
        })
        socketRef.current = socket

        socket.on('connect', () => {
          connectedRef.current = true
          setConnected(true)
          // Rejoin the persisted conversation on (re)connect.
          const existingId = conversationIdRef.current
          if (existingId) {
            socket.emit(CLIENT_EVENTS.joinConversation, { conversationId: existingId })
          }
        })

        socket.on('disconnect', () => {
          connectedRef.current = false
          setConnected(false)
        })

        for (const event of Object.values(SERVER_EVENTS)) {
          socket.on(event, (payload: unknown) => {
            handleServerEvent(event as keyof ServerEventMap, payload as ServerEventMap[keyof ServerEventMap])
          })
        }
      })
      .catch(() => {
        /* visitor session failed — keep the local id and continue */
      })
      .finally(() => {
        connectPromiseRef.current = null
      })
  }, [handleServerEvent, serverUrl, visitorId, externalToken])

  const ensureConnected = useCallback(async (): Promise<boolean> => {
    if (connectedRef.current) return true
    if (!socketRef.current) {
      if (!connectPromiseRef.current) connect()
      try {
        await connectPromiseRef.current
      } catch {
        return false
      }
    }
    const socket = socketRef.current
    if (!socket) return false
    if (socket.connected) {
      connectedRef.current = true
      return true
    }
    return new Promise((resolve) => {
      const onConnect = () => {
        socket.off('connect', onConnect)
        resolve(true)
      }
      socket.on('connect', onConnect)
      setTimeout(() => {
        socket.off('connect', onConnect)
        resolve(connectedRef.current)
      }, 8000)
    })
  }, [connect])

  useEffect(() => {
    if (!autoConnect) return
    connect()
    return () => {
      // Widget stays alive while embedded; only the full-page chat disconnects.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, autoConnect])

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const startConversation = useCallback(
    (payload: StartConversationPayload) => {
      void ensureConnected().then((ok) => {
        if (!ok) return
        socketRef.current?.emit(CLIENT_EVENTS.startConversation, payload)
      })
    },
    [ensureConnected],
  )

  const sendText = useCallback(
    (content: string) => {
      const id = conversationIdRef.current
      const socket = socketRef.current
      if (!id || !socket || !content.trim()) return
      // Optimistic append — resolved by the server echo in appendMessage.
      setConversationState(id, (s) => addPendingSend(s, `temp_${crypto.randomUUID()}`, content, id))
      socket.emit(CLIENT_EVENTS.sendMessage, {
        conversationId: id,
        content,
        messageType: 'text',
      })
      socket.emit(CLIENT_EVENTS.typingStop, { conversationId: id })
    },
    [setConversationState],
  )

  const sendImage = useCallback(
    (attachmentUrl: string, thumbnailUrl?: string) => {
      const id = conversationIdRef.current
      const socket = socketRef.current
      if (!id || !socket) return
      socket.emit(CLIENT_EVENTS.sendMessage, {
        conversationId: id,
        content: '',
        messageType: 'image',
        attachmentUrl,
        attachmentThumbnailUrl: thumbnailUrl || attachmentUrl,
      })
    },
    [],
  )

  const readMessage = useCallback(
    (messageId: string) => {
      const id = conversationIdRef.current
      if (!id) return
      socketRef.current?.emit(CLIENT_EVENTS.readMessage, { messageId, conversationId: id })
    },
    [],
  )

  const markAllAsRead = useCallback(() => {
    const id = conversationIdRef.current
    if (!id) return
    const state = getConversationState(id)
    const unread = state.messages.filter(
      (m) => (m.senderType === 'agent' || m.senderType === 'ai') && !m.readAt,
    )
    for (const m of unread) {
      socketRef.current?.emit(CLIENT_EVENTS.readMessage, { messageId: m.id, conversationId: id })
      setConversationState(id, (s) => markMessageRead(s, m.id, new Date().toISOString()))
    }
  }, [getConversationState, setConversationState])

  const submitReview = useCallback(
    (rating: number, review?: string) => {
      const id = conversationIdRef.current
      if (!id) return
      socketRef.current?.emit(CLIENT_EVENTS.submitReview, { conversationId: id, rating, review })
    },
    [],
  )

  const resolveConversation = useCallback(() => {
    const id = conversationIdRef.current
    if (!id) return
    socketRef.current?.emit(CLIENT_EVENTS.resolveConversation, { conversationId: id })
  }, [])

  const typingStart = useCallback(() => {
    const id = conversationIdRef.current
    if (!id) return
    socketRef.current?.emit(CLIENT_EVENTS.typingStart, { conversationId: id })
  }, [])

  const typingStop = useCallback(() => {
    const id = conversationIdRef.current
    if (!id) return
    socketRef.current?.emit(CLIENT_EVENTS.typingStop, { conversationId: id })
  }, [])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
  }, [])

  return {
    connected,
    visitorId: authoritativeVisitorId,
    conversationId: conversationId || null,
    setConversationId: (id: string | null) => {
      conversationIdRef.current = id ?? ''
      rawSetConversationId(id ?? '')
    },
    ensureConnected,
    startConversation,
    sendText,
    sendImage,
    readMessage,
    markAllAsRead,
    submitReview,
    resolveConversation,
    typingStart,
    typingStop,
    disconnect,
  }
}

// Local alias so the hook body reads naturally.
export type { SenderType, Message }
