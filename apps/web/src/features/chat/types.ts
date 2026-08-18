// =============================================================================
// Chat feature — shared domain state for the visitor chat engine.
// The conversation's live data (messages, status, stream) lives in the
// TanStack Query cache under `conversationQueryKey`; socket events mutate it
// via setQueryData so every consumer (widget, chat page, agent view) renders
// the same source of truth.
// =============================================================================

import type { Conversation, Message } from '../../shared/types/models'

export interface PendingSend {
  /** Client-generated id of the optimistic message (`temp_<uuid>`). */
  tempId: string
  content: string
  conversationId: string
  sentAt: string
}

export interface AiStreamState {
  conversationId: string
  /** Accumulated partial tokens shown in the synthetic streaming bubble. */
  content: string
}

/**
 * Everything the UI reads for one conversation. Stored in the query cache;
 * never kept in component state so the widget and the full-page chat stay
 * consistent across tabs and remounts.
 */
export interface ConversationQueryState {
  conversation: Conversation | null
  messages: Message[]
  isIpBlacklisted: boolean
  uploadToken: string | null
  aiStream: AiStreamState | null
  /** `messageId:lang` → translated text (auto-translate / manual translate). */
  translations: Record<string, string>
  /** Messages sent optimistically, awaiting the server echo. */
  pendingSends: PendingSend[]
  /** Set when the server warns about inactivity; drives auto-resolution. */
  inactivityWarning: string | null
  lastError: string | null
  /** True once conversation_history (or conversation_started) has arrived. */
  loaded: boolean
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const conversationQueryKey = (serverUrl: string, conversationId: string) =>
  ['conversation', serverUrl, conversationId] as const

/** Per-conversation typing indicator set (agent/visitor usernames). */
export const typingQueryKey = (serverUrl: string, conversationId: string) =>
  ['typing', serverUrl, conversationId] as const

/** Unread message count for the widget bubble badge. */
export const unreadQueryKey = (serverUrl: string) => ['unread', serverUrl] as const

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024

export function createEmptyConversationState(): ConversationQueryState {
  return {
    conversation: null,
    messages: [],
    isIpBlacklisted: false,
    uploadToken: null,
    aiStream: null,
    translations: {},
    pendingSends: [],
    inactivityWarning: null,
    lastError: null,
    loaded: false,
  }
}
