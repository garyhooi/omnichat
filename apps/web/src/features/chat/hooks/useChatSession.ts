// =============================================================================
// Chat session — the composition layer every chat UI (widget, full-page chat)
// consumes. Owns the socket, reads the conversation from the TanStack Query
// cache, and exposes derived state + actions to the components.
//
// Data flow (per the architecture decision):
//   useQuery reads the conversation under ['conversation', url, id]; the
//   *initial history* arrives as the `conversation_history` socket event and
//   is written into the cache with setQueryData (the server has no REST
//   endpoint for history). New messages are appended the same way — no
//   refetching ever happens (staleTime: Infinity).
// =============================================================================

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useVisitorContext } from '../../../shared/hooks/useVisitorContext'
import { useLocalStorageBoolean, useLocalStorageState } from '../../../shared/hooks/useLocalStorage'
import { getDefaultLang } from '../../../shared/lib/translationCache'
import {
  clearTranslationCooldown,
  isTranslationOnCooldown,
  markTranslationFailed,
} from '../../../shared/lib/translationCooldown'
import type { Conversation, Message, SenderType } from '../../../shared/types/models'
import type { ServerEventMap, StartConversationPayload } from '../../../shared/types/socket'
import { useSiteConfig } from './useSiteConfig'
import { useChatSocket } from './useChatSocket'
import { useSound } from './useSound'
import type { ConversationQueryState } from '../types'
import { conversationQueryKey, createEmptyConversationState, typingQueryKey } from '../types'
import { setTranslation, translationKey } from '../chatState'

export interface ChatSessionStorageKeys {
  mutedKey: string
  translateLangKey: string
  autoTranslateKey: string
}

export interface ChatSessionOptions {
  serverUrl: string
  /** Per-entry-point storage keys (widget vs chat page must not clash). */
  storageKeys: ChatSessionStorageKeys
  externalToken?: string
  /** Panel visibility — read receipts are only sent while open. */
  getPanelOpen?: () => boolean
  /** Extra socket event callback (widget toasts, page banners, …). */
  onEvent?: (event: keyof ServerEventMap, payload: ServerEventMap[keyof ServerEventMap]) => void
}

export interface ChatSession {
  // Connection
  connected: boolean
  conversationId: string | null
  // Conversation data (query cache)
  conversation: Conversation | null
  messages: Message[]
  aiStreamContent: string | null
  isAiStreaming: boolean
  typingUsers: string[]
  isIpBlacklisted: boolean
  uploadToken: string | null
  inactivityWarning: string | null
  lastError: string | null
  loaded: boolean
  isResolved: boolean
  hasRating: boolean
  // Preferences
  muted: boolean
  toggleMuted: () => void
  autoTranslateEnabled: boolean
  setAutoTranslateEnabled: (v: boolean) => void
  translateLang: string
  setTranslateLang: (lang: string) => void
  translations: Record<string, string>
  // Site config
  siteConfig: ReturnType<typeof useSiteConfig>['config']
  // Actions
  startConversation: (name: string, email?: string) => void
  sendText: (content: string) => void
  sendImage: (attachmentUrl: string, thumbnailUrl?: string) => void
  uploadImage: (file: File) => Promise<boolean>
  requestHuman: () => void
  submitReview: (rating: number, review?: string) => void
  endChat: () => void
  startNewChat: () => void
  readMessage: (messageId: string) => void
  markAllAsRead: () => void
  typingStart: () => void
  typingStop: () => void
  clearError: () => void
  playSound: () => void
  /** Translate one message into the selected language; resolves false on failure. */
  translateMessage: (message: Message) => Promise<boolean>
  visitorId: string
}

const VISITOR_MAX_CHARS = 100

export function useChatSession(options: ChatSessionOptions): ChatSession {
  const { serverUrl, storageKeys, externalToken } = options
  const queryClient = useQueryClient()

  const visitorContext = useVisitorContext()
  const visitorId = visitorContext.visitorId

  const { config: siteConfig } = useSiteConfig(serverUrl)

  const getPanelOpenRef = useRef(options.getPanelOpen)
  useEffect(() => {
    getPanelOpenRef.current = options.getPanelOpen
  })
  const onEventRef = useRef(options.onEvent)
  useEffect(() => {
    onEventRef.current = options.onEvent
  })

  // Preferences (persisted per entry point)
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useLocalStorageBoolean(
    storageKeys.autoTranslateKey,
    siteConfig?.autoTranslationEnabled ?? true,
  )
  const [translateLang, setTranslateLang] = useLocalStorageState(
    storageKeys.translateLangKey,
    getDefaultLang(storageKeys.translateLangKey),
  )

  const { muted, toggleMuted, playSound } = useSound(
    serverUrl,
    storageKeys.mutedKey,
    siteConfig?.notificationSoundUrl,
  )

  const socket = useChatSocket({
    serverUrl,
    visitorId,
    externalToken,
    isPanelOpen: () => getPanelOpenRef.current?.() ?? true,
    translate: { enabled: autoTranslateEnabled, lang: translateLang },
    onEvent: (event, payload) => {
      if (event === 'new_message') {
        const { message } = payload as ServerEventMap['new_message']
        if (message.senderType === 'agent' || message.senderType === 'ai') playSound()
      }
      onEventRef.current?.(event, payload)
    },
  })

  // ---------------------------------------------------------------------------
  // Conversation data — read reactively from the query cache. The socket hook
  // populates this cache (initial history + live appends); this query never
  // refetches because there is no REST history endpoint.
  // ---------------------------------------------------------------------------
  const qk = conversationQueryKey(serverUrl, socket.conversationId ?? '')
  const { data: state } = useQuery<ConversationQueryState>({
    queryKey: qk,
    enabled: !!socket.conversationId,
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: createEmptyConversationState(),
    queryFn: () => createEmptyConversationState(),
  })

  const typingQk = typingQueryKey(serverUrl, socket.conversationId ?? '')
  const { data: typingUsers } = useQuery<string[]>({
    queryKey: typingQk,
    enabled: !!socket.conversationId,
    staleTime: Infinity,
    queryFn: () => [],
  })

  const conversation = state?.conversation ?? null
  const messages = useMemo(
    () => [...(state?.messages ?? [])].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
    [state?.messages],
  )

  const isResolved = conversation?.status === 'resolved'
  const hasRating = !!conversation?.rating

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const startConversation = useCallback(
    (name: string, email?: string) => {
      if (!name.trim()) return
      const metadata = JSON.stringify({
        visitorName: name.trim(),
        visitorEmail: email?.trim() || '',
        userAgent: visitorContext.userAgent,
      })
      socket.startConversation({
        visitorId: socket.visitorId,
        metadata,
        visitorName: name.trim(),
        visitorEmail: email?.trim() || '',
        visitorCurrentUrl: visitorContext.visitorCurrentUrl,
        visitorTimezone: visitorContext.visitorTimezone,
        visitorLanguage: visitorContext.visitorLanguage,
        visitorScreenRes: visitorContext.visitorScreenRes,
        visitorReferrer: visitorContext.visitorReferrer,
      } satisfies StartConversationPayload)
    },
    [socket, visitorId, visitorContext],
  )

  const sendText = useCallback(
    (content: string) => {
      if (content.trim().length > VISITOR_MAX_CHARS) return
      // Sending a message re-arms the server's inactivity timer — clear the
      // local warning banner (the server sends no "warning cleared" event).
      const id = socket.conversationId
      if (id) {
        queryClient.setQueryData(conversationQueryKey(serverUrl, id), (s: ConversationQueryState | undefined) =>
          s ? { ...s, inactivityWarning: null } : s,
        )
      }
      socket.sendText(content)
    },
    [queryClient, serverUrl, socket],
  )

  const requestHuman = useCallback(() => {
    socket.sendText('I would like to talk to a human agent please.')
  }, [socket])

  const uploadImage = useCallback(
    async (file: File): Promise<boolean> => {
      // Upload + send image message, rotating the token into the cache.
      const id = socket.conversationId
      if (!id) return false
      const stateNow = queryClient.getQueryData<ConversationQueryState>(conversationQueryKey(serverUrl, id))
      const token = stateNow?.uploadToken ?? null

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('conversationId', id)
        const headers: HeadersInit = {}
        if (token) headers['Authorization'] = token
        const res = await fetch(`${serverUrl}/upload`, { method: 'POST', headers, body: formData })
        if (!res.ok) throw new Error('Upload failed')
        const data = (await res.json()) as {
          url: string
          thumbnailUrl?: string
          uploadToken?: string
        }
        if (data.uploadToken) {
          queryClient.setQueryData(conversationQueryKey(serverUrl, id), (s: ConversationQueryState | undefined) =>
            s ? { ...s, uploadToken: data.uploadToken! } : s,
          )
        }
        socket.sendImage(`${serverUrl}${data.url}`, `${serverUrl}${data.thumbnailUrl || data.url}`)
        return true
      } catch {
        return false
      }
    },
    [queryClient, serverUrl, socket],
  )

  const translateMessage = useCallback(
    (message: Message): Promise<boolean> => {
      if (!message.content || message.messageType !== 'text') return Promise.resolve(false)
      const id = socket.conversationId
      if (!id) return Promise.resolve(false)
      const key = translationKey(message.id, translateLang)
      const qk = conversationQueryKey(serverUrl, id)
      const stateNow = queryClient.getQueryData<ConversationQueryState>(qk)
      if (stateNow?.translations[key]) return Promise.resolve(true)
      if (isTranslationOnCooldown(key)) return Promise.resolve(false)
      return import('../../../shared/lib/translationCache').then(({ fetchTranslation }) =>
        fetchTranslation(serverUrl, message.content!, translateLang)
          .then((text) => {
            clearTranslationCooldown(key)
            queryClient.setQueryData(qk, (s: ConversationQueryState | undefined) =>
              s ? setTranslation(s, message.id, translateLang, text) : s,
            )
            return true
          })
          .catch(() => {
            markTranslationFailed(key)
            return false
          }),
      )
    },
    [queryClient, serverUrl, socket.conversationId, translateLang],
  )

  // Auto-translate the latest incoming message whenever the visitor switches
  // the target language — without this, changing language has no visible
  // effect on the conversation (legacy parity: new messages auto-translate).
  const inFlightTranslations = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (!autoTranslateEnabled || !socket.conversationId || messages.length === 0) return
    const latest = messages[messages.length - 1]
    if (!latest || latest.senderType === 'visitor' || latest.messageType !== 'text' || !latest.content) return
    const qk = conversationQueryKey(serverUrl, socket.conversationId)
    const st = queryClient.getQueryData<ConversationQueryState>(qk)
    const key = translationKey(latest.id, translateLang)
    if (st?.translations[key] || inFlightTranslations.current.has(key) || isTranslationOnCooldown(key)) return
    inFlightTranslations.current.add(key)
    void import('../../../shared/lib/translationCache').then(({ fetchTranslation }) =>
      fetchTranslation(serverUrl, latest.content!, translateLang)
        .then((text) => {
          clearTranslationCooldown(key)
          queryClient.setQueryData(qk, (s: ConversationQueryState | undefined) =>
            s ? setTranslation(s, latest.id, translateLang, text) : s,
          )
        })
        .catch(() => {
          markTranslationFailed(key)
        })
        .finally(() => {
          inFlightTranslations.current.delete(key)
        }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTranslateEnabled, socket.conversationId, messages, queryClient, serverUrl, translateLang])

  const startNewChat = useCallback(() => {
    socket.setConversationId(null)
    queryClient.setQueryData(conversationQueryKey(serverUrl, ''), createEmptyConversationState())
  }, [queryClient, serverUrl, socket])

  const clearError = useCallback(() => {
    const id = socket.conversationId
    if (!id) return
    queryClient.setQueryData(conversationQueryKey(serverUrl, id), (s: ConversationQueryState | undefined) =>
      s ? { ...s, lastError: null } : s,
    )
  }, [queryClient, serverUrl, socket.conversationId])

  return {
    connected: socket.connected,
    visitorId: socket.visitorId,
    conversationId: socket.conversationId,
    conversation,
    messages,
    aiStreamContent: state?.aiStream?.content ?? null,
    isAiStreaming: !!state?.aiStream,
    typingUsers: typingUsers ?? [],
    isIpBlacklisted: state?.isIpBlacklisted ?? false,
    uploadToken: state?.uploadToken ?? null,
    inactivityWarning: state?.inactivityWarning ?? null,
    lastError: state?.lastError ?? null,
    loaded: state?.loaded ?? false,
    isResolved,
    hasRating,
    muted,
    toggleMuted,
    autoTranslateEnabled,
    setAutoTranslateEnabled,
    translateLang,
    setTranslateLang,
    translations: state?.translations ?? {},
    siteConfig,
    startConversation,
    sendText,
    sendImage: socket.sendImage,
    uploadImage,
    requestHuman,
    submitReview: socket.submitReview,
    endChat: socket.resolveConversation,
    startNewChat,
    readMessage: socket.readMessage,
    markAllAsRead: socket.markAllAsRead,
    typingStart: socket.typingStart,
    typingStop: socket.typingStop,
    clearError,
    playSound,
    translateMessage,
  }
}

export type { SenderType }
